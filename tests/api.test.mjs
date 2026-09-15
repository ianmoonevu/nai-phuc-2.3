import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import ts from 'typescript';

const source = await fs.readFile(new URL('../src/utils/api.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
const { apiJson } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);

test('HTML 200 cannot masquerade as successful login or save', async () => {
  const original = globalThis.fetch;
  try {
    globalThis.fetch = async () => new Response('<html>SPA</html>', { headers: { 'content-type': 'text/html' } });
    await assert.rejects(apiJson('/api/auth/login'), /API/);
  } finally { globalThis.fetch = original; }
});

test('only explicit JSON success is accepted and cache is bypassed', async () => {
  const original = globalThis.fetch;
  try {
    globalThis.fetch = async (_url, options) => {
      assert.equal(options.cache, 'no-store');
      assert.equal(options.credentials, 'same-origin');
      return Response.json({ ok: true, content: { branding: { hotlinePhone: '123' } } });
    };
    assert.equal((await apiJson('/api/content')).content.branding.hotlinePhone, '123');
    globalThis.fetch = async () => Response.json({});
    await assert.rejects(apiJson('/api/content'));
    globalThis.fetch = async () => Response.json({ ok: false }, { status: 503 });
    await assert.rejects(apiJson('/api/content'), /cơ sở dữ liệu/);
  } finally { globalThis.fetch = original; }
});
