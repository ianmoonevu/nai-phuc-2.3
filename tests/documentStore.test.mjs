import test from 'node:test';
import assert from 'node:assert/strict';
import { writeDocument } from '../src/lib/documentStore.ts';

test('legacy project table retains complete data and satisfies mandatory columns', async () => {
  const item = { id: 'example', title: 'Edited project', verification: 'Tested', specifications: { dosage: '25 kg', fiberSeries: 'HF' } };
  let stored;
  const client = { from: () => ({ upsert: async row => {
    if ('verification' in row) return { error: { code: 'PGRST204', message: "Could not find the 'verification' column of 'projects' in the schema cache" } };
    for (const field of ['dosage', 'fiber_type', 'year']) {
      if (row[field] == null) return { error: { code: '23502', message: `null value in column "${field}" of relation "projects" violates not-null constraint` } };
    }
    stored = structuredClone(row);
    return { error: null };
  } }) };
  await writeDocument(client, 'projects', { id: item.id, title: item.title, verification: item.verification, data: item }, item);
  assert.equal(stored.dosage, '25 kg');
  assert.equal(stored.fiber_type, 'HF');
  assert.deepEqual(stored.data, item);
});

test('current schema succeeds in one request', async () => {
  let calls = 0;
  await writeDocument({ from: () => ({ upsert: async () => { calls++; return { error: null }; } }) }, 'projects', { id: 'p', data: {} }, {});
  assert.equal(calls, 1);
});

test('permission errors and missing data column fail without lossy retry', async () => {
  for (const error of [
    { code: '42501', message: 'permission denied' },
    { code: 'PGRST204', message: "Could not find the 'data' column of 'projects' in the schema cache" },
    { code: '23502', message: 'null value in column "unknown_required" violates not-null constraint' },
  ]) {
    let calls = 0;
    await assert.rejects(writeDocument({ from: () => ({ upsert: async () => { calls++; return { error }; } }) }, 'projects', { id: 'p', data: {} }, {}));
    assert.equal(calls, 1);
  }
});

test('legacy article mandatory columns are populated from the document', async () => {
  const item = { id: 'a', date: '2026-09-11', contentSnippet: 'Summary' };
  let stored;
  const client = { from: () => ({ upsert: async row => {
    for (const field of ['publish_date', 'abstract', 'slug']) {
      if (row[field] == null) return { error: { code: '23502', message: `null value in column "${field}" violates not-null constraint` } };
    }
    stored = structuredClone(row); return { error: null };
  } }) };
  await writeDocument(client, 'articles', { id: 'a', data: item }, item);
  assert.equal(stored.publish_date, item.date);
  assert.equal(stored.abstract, item.contentSnippet);
  assert.equal(stored.slug, 'a');
});
