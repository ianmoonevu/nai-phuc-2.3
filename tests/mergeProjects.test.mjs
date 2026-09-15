import test from 'node:test';
import assert from 'node:assert/strict';
import { mergeProjects } from '../src/lib/mergeProjects.ts';

const defaults = [{ id: 'geely', title: 'Geely' }, { id: 'sailun', title: 'Sailun' }, { id: 'jinyu', title: 'Jinyu' }];
test('saving the first project preserves every other default after reload', () => {
  const saved = [{ id: 'geely', title: 'test 1' }];
  assert.deepEqual(mergeProjects(defaults, saved), [saved[0], defaults[1], defaults[2]]);
  assert.equal(defaults[0].title, 'Geely');
});
test('new cloud projects appear once and empty cloud keeps defaults', () => {
  const added = { id: 'new', title: 'New project' };
  assert.deepEqual(mergeProjects(defaults, [added]), [added, ...defaults]);
  assert.deepEqual(mergeProjects(defaults, []), defaults);
});
test('explicitly deleted defaults are not restored by merging', () => {
  assert.deepEqual(mergeProjects(defaults, [], ['geely']), defaults.slice(1));
});
