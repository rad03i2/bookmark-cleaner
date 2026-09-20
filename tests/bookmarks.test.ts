import test from 'node:test';
import assert from 'node:assert/strict';
import { auditBookmarks, canonicalUrl, cleanBookmarks, parseBookmarks, toNetscape } from '../src/bookmarks.js';

const sample = `<!DOCTYPE NETSCAPE-Bookmark-file-1><DL><p>
<DT><A HREF="https://Example.com/page/?utm_source=x#part" ADD_DATE="1">First</A>
<DT><A HREF="https://example.com/page">Duplicate</A>
<DT><A HREF="javascript:alert(1)">Unsafe</A>
<DT><A HREF="https://example.org/?b=2&a=1">Other &amp; Site</A>
</DL><p>`;

test('parses Netscape bookmarks and entities', () => {
  const items = parseBookmarks(sample);
  assert.equal(items.length, 4);
  assert.equal(items[3]?.title, 'Other & Site');
  assert.equal(items[0]?.addDate, '1');
});

test('canonicalizes tracking, fragments and query ordering', () => {
  assert.equal(canonicalUrl('HTTPS://Example.COM:443/a/?z=2&utm_medium=x&a=1#x'), 'https://example.com/a?a=1&z=2');
  assert.equal(canonicalUrl('file:///tmp/a'), null);
});

test('audits and removes duplicate and unsupported URLs', () => {
  const items = parseBookmarks(sample);
  const audit = auditBookmarks(items);
  assert.equal(audit.duplicates.length, 1);
  assert.equal(audit.invalid.length, 1);
  const clean = cleanBookmarks(items);
  assert.equal(clean.length, 2);
  assert.equal(clean[0]?.title, 'First');
});

test('exports importable Netscape HTML with escaped text', () => {
  const output = toNetscape([{ title: 'A < B', url: 'https://example.com/?a=1&b=2' }]);
  assert.match(output, /NETSCAPE-Bookmark-file-1/);
  assert.match(output, /A &lt; B/);
  assert.match(output, /a=1&amp;b=2/);
  assert.equal(parseBookmarks(output).length, 1);
});
