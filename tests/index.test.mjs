import assert from 'node:assert/strict';
import test from 'node:test';
import * as api from '../dist/esm/index.js';
test('selects highest quality supported type', () => {
  assert.equal(
    api.negotiateAccept('text/*;q=0.8, application/json;q=1', ['text/html', 'application/json']),
    'application/json',
  );
});
test('uses specificity before header order at same q', () => {
  assert.equal(
    api.negotiateAccept('*/*;q=1, text/html;q=1', ['text/html', 'application/json']),
    'text/html',
  );
});
test('wildcard accepts first supported type', () => {
  assert.equal(api.negotiateAccept('*/*', ['image/png', 'text/plain']), 'image/png');
});
test('excludes zero-quality ranges', () => {
  assert.equal(api.negotiateAccept('text/html;q=0, */*;q=0', ['text/html']), null);
});
test('parses bounded decimal q value', () => {
  assert.equal(api.negotiateAccept('text/plain;q=0.125', ['text/plain']), 'text/plain');
});
test('rejects malformed ranges', () => {
  assert.throws(() => api.negotiateAccept('not-a-type', ['text/html']), TypeError);
});
