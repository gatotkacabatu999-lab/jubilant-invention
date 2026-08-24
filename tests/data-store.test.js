import test from 'node:test';
import assert from 'node:assert/strict';

import { normalizeDocumentState, normalizeBookTitle } from '../src/data-store.js';
import { isSpaRoute } from '../server.js';

test('normalizeDocumentState returns valid page tree and active id', () => {
  const normalized = normalizeDocumentState({ pages: null, activeId: null });

  assert.ok(Array.isArray(normalized.pages));
  assert.ok(normalized.pages.length > 0);
  assert.ok(typeof normalized.activeId === 'string');
});

test('normalizeDocumentState preserves valid state', () => {
  const input = {
    pages: [{ id: 'p_1', title: 'Hello', content: 'World', children: [] }],
    activeId: 'p_1'
  };

  const normalized = normalizeDocumentState(input);
  assert.deepEqual(normalized.pages, input.pages);
  assert.equal(normalized.activeId, 'p_1');
});

test('normalizeBookTitle trims and falls back to the default title', () => {
  assert.equal(normalizeBookTitle('  Masakanku  '), 'Masakanku');
  assert.equal(normalizeBookTitle('   '), 'RecipeBook');
  assert.equal(normalizeBookTitle(null), 'RecipeBook');
});

test('isSpaRoute excludes api routes from the frontend fallback', () => {
  assert.equal(isSpaRoute('/api/docbook'), false);
  assert.equal(isSpaRoute('/api'), false);
  assert.equal(isSpaRoute('/recipes'), true);
  assert.equal(isSpaRoute('/'), true);
});
