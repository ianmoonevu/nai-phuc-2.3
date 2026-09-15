import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

test('fresh install, authenticated CMS, persistence, uploads, cache and recovery without MySQL', { timeout: 60000 }, async () => {
  const dataDir = await fs.mkdtemp(path.join(os.tmpdir(), 'hoki-test-'));
  const env = { ...process.env, HOKI_DATA_DIR: dataDir, PORT: '0', NODE_ENV: 'production', ADMIN_USERNAME: '', ADMIN_PASSWORD: '', DB_USER: '', DB_NAME: '', RESET_ADMIN_USERNAME: '', RESET_ADMIN_PASSWORD: '' };
  let child;
  let base;
  let cookie;
  async function start() {
    child = spawn(process.execPath, ['app.js'], { cwd: root, env, stdio: ['ignore', 'pipe', 'pipe'] });
    let output = '';
    await new Promise((resolve, reject) => {
      child.stdout.on('data', (chunk) => {
        output += chunk;
        const match = output.match(/ready on port (\d+)/);
        if (match) { base = `http://127.0.0.1:${match[1]}`; resolve(); }
      });
      child.stderr.on('data', (chunk) => { output += chunk; });
      child.once('exit', (code) => reject(new Error(`Server exited ${code}: ${output}`)));
    });
  }
  async function stop() {
    if (!child || child.exitCode !== null) return;
    await new Promise((resolve) => { child.once('exit', resolve); child.kill(); });
  }
  async function request(route, method = 'GET', body, authenticated = true) {
    return fetch(base + route, {
      method,
      headers: { ...(body ? { 'content-type': 'application/json' } : {}), ...(authenticated && cookie ? { cookie } : {}) },
      body: body ? JSON.stringify(body) : undefined
    });
  }
  async function login(credentials) {
    const result = await request('/api/auth/login', 'POST', credentials, false);
    assert.equal(result.status, 200);
    cookie = result.headers.get('set-cookie').split(';')[0];
  }
  try {
    await start();
    const credentials = JSON.parse(await fs.readFile(path.join(dataDir, 'ADMIN-LOGIN.json')));
    assert.equal(credentials.username, 'admin');
    assert.ok(credentials.password.length >= 24);
    const health = await request('/api/health');
    assert.equal((await health.json()).mode, 'sqlite');
    assert.equal(health.headers.get('cache-control'), 'no-store');
    assert.equal((await request('/api/content/branding', 'PUT', { data: { test: 'unauthorized' } }, false)).status, 401);
    assert.equal((await request('/api/auth/login', 'POST', { username: 'admin', password: 'wrong' }, false)).status, 401);
    await login(credentials);
    assert.equal((await request('/api/auth/me')).status, 200);
    assert.equal((await request('/api/content/initialize', 'POST', { content: { branding: { hotlinePhone: 'first' }, articles: [] } })).status, 200);
    await request('/api/content/initialize', 'POST', { content: { branding: { hotlinePhone: 'must-not-overwrite' } } });
    assert.equal((await (await request('/api/content/branding')).json()).data.hotlinePhone, 'first');
    assert.equal((await request('/api/content/batch', 'POST', { content: { branding: { hotlinePhone: 'rolled-back' }, invalid_key: {} } })).status, 400);
    assert.equal((await (await request('/api/content/branding')).json()).data.hotlinePhone, 'first');
    for (let i = 0; i < 5; i++) {
      assert.equal((await request('/api/content/branding', 'PUT', { data: { hotlinePhone: `saved-${i}` } })).status, 200);
    }
    assert.equal((await request('/api/content/batch', 'POST', { content: { projects: [{ id: 'p1', title: 'Persisted project' }], articles: [{ id: 'a1', title: 'Persisted article' }] } })).status, 200);
    const form = new FormData();
    form.append('file', new Blob([Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=', 'base64')], { type: 'image/png' }), 'test.png');
    const upload = await fetch(base + '/api/media/upload', { method: 'POST', headers: { cookie }, body: form });
    assert.equal(upload.status, 201);
    const imageUrl = (await upload.json()).data.url;
    assert.match(imageUrl, /^\/uploads\//);
    const consult = await request('/api/consultations', 'POST', { name: 'Test', firm: 'Test', email: 'test@example.com', projectType: 'floor' }, false);
    assert.equal(consult.status, 201);
    const consultationId = (await consult.json()).data.id;
    assert.equal((await request(`/api/consultations/${consultationId}`, 'PATCH', { status: 'reviewed' })).status, 200);
    assert.equal((await request('/api/consultations', 'GET', undefined, false)).status, 401);
    assert.equal((await request('/api/missing')).status, 404);
    for (const route of ['/', '/about-us', '/admin']) {
      const page = await request(route);
      assert.equal(page.status, 200);
      assert.equal(page.headers.get('cache-control'), 'no-store');
    }
    for (const route of ['/private/hoki-cms/ADMIN-LOGIN.json', '/server/storage.js', '/cms.sqlite']) {
      const text = await (await request(route)).text();
      assert.ok(!text.includes(credentials.password));
      assert.ok(!text.includes('DatabaseSync'));
    }
    await stop();
    await start();
    assert.equal((await request('/api/auth/me')).status, 200, 'Session survives restart');
    const content = await (await request('/api/content', 'GET', undefined, false)).json();
    assert.equal(content.content.branding.hotlinePhone, 'saved-4');
    assert.equal(content.content.projects[0].id, 'p1');
    assert.equal(content.content.articles[0].id, 'a1');
    assert.equal((await request(imageUrl)).status, 200);
    assert.equal((await (await request('/api/consultations')).json()).data[0].status, 'reviewed');
    assert.deepEqual(JSON.parse(await fs.readFile(path.join(dataDir, 'ADMIN-LOGIN.json'))), credentials);
    const reset = spawn(process.execPath, ['scripts/reset-admin.mjs'], { cwd: root, env, stdio: 'pipe' });
    let resetOutput = '';
    reset.stdout.on('data', (chunk) => { resetOutput += chunk; });
    assert.equal(await new Promise((resolve) => reset.once('exit', resolve)), 0);
    assert.match(resetOutput, /reset successfully/);
    assert.equal((await request('/api/auth/me')).status, 401, 'Reset revokes old sessions');
    const nextCredentials = JSON.parse(await fs.readFile(path.join(dataDir, 'ADMIN-LOGIN.json')));
    assert.notEqual(nextCredentials.password, credentials.password);
    assert.equal((await request('/api/auth/login', 'POST', credentials, false)).status, 401);
    await login(nextCredentials);
    assert.equal((await request(`/api/consultations/${consultationId}`, 'DELETE')).status, 200);
    await request('/api/auth/logout', 'POST');
    assert.equal((await request('/api/auth/me')).status, 401);
  } finally {
    await stop();
    await fs.rm(dataDir, { recursive: true, force: true });
  }
});
