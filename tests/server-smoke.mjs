import assert from 'node:assert/strict';
process.env.NODE_ENV = 'production';
process.env.PORT = '32179';
process.env.DB_USER = '';
process.env.DB_NAME = '';
try {
  await import('../server.js');
  const base = 'http://127.0.0.1:32179';
  const health = await fetch(`${base}/api/health`);
  assert.match(health.headers.get('content-type'), /application\/json/);
  assert.equal(health.headers.get('cache-control'), 'no-store');
  assert.equal((await health.json()).database, false);
  const save = await fetch(`${base}/api/content/branding`, {
    method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ data: {} })
  });
  assert.equal(save.status, 503);
  assert.equal((await save.json()).ok, false);
  for (const route of ['/', '/about']) {
    const page = await fetch(`${base}${route}`);
    assert.equal(page.status, 200);
    assert.equal(page.headers.get('cache-control'), 'no-store');
  }
  console.log('PASS: JSON health, rejected save without DB, no-store API and HTML.');
  process.exit(0);
} catch (error) {
  console.error(error);
  process.exit(1);
}
