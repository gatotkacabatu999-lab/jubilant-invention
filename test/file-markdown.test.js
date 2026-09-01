import test from 'node:test';
import assert from 'node:assert/strict';

import { serializeFileLink, sanitizeFileName } from '../src/file-markdown.js';

test('sanitizeFileName trims unsafe characters and keeps a usable label', () => {
  assert.equal(sanitizeFileName(' Report (final).pdf '), 'Report (final).pdf');
  assert.equal(sanitizeFileName('bad/name\\file?.pdf'), 'bad_name_file_.pdf');
  assert.equal(sanitizeFileName('   '), 'File');
});

test('serializeFileLink creates a Markdown file link with a safe label', () => {
  const link = serializeFileLink({
    name: 'Report (final).pdf',
    href: '/api/files/report-final.pdf',
    size: '2.4 MB'
  });

  assert.equal(link, '[Report (final).pdf](/api/files/report-final.pdf "2.4 MB")');
});
