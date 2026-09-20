export interface Bookmark { title: string; url: string; addDate?: string; }
export interface Audit { total: number; unique: number; duplicates: Bookmark[]; invalid: Bookmark[]; }

const hrefPattern = /<A\s+[^>]*HREF=(?:"([^"]*)"|'([^']*)')[^>]*>(.*?)<\/A>/gi;
const addDatePattern = /ADD_DATE=(?:"([^"]*)"|'([^']*)')/i;

export function parseBookmarks(html: string): Bookmark[] {
  const result: Bookmark[] = [];
  for (const match of html.matchAll(hrefPattern)) {
    const tag = match[0];
    const url = decodeEntities((match[1] ?? match[2] ?? '').trim());
    const title = decodeEntities(stripTags(match[3] ?? '').trim());
    const date = tag.match(addDatePattern);
    result.push({ title, url, ...(date ? { addDate: date[1] ?? date[2] } : {}) });
  }
  return result;
}

export function canonicalUrl(raw: string): string | null {
  try {
    const u = new URL(raw);
    if (!['http:', 'https:'].includes(u.protocol)) return null;
    u.hash = '';
    u.hostname = u.hostname.toLowerCase();
    if ((u.protocol === 'http:' && u.port === '80') || (u.protocol === 'https:' && u.port === '443')) u.port = '';
    if (u.pathname.length > 1) u.pathname = u.pathname.replace(/\/+$/, '');
    const params = [...u.searchParams.entries()]
      .filter(([k]) => !/^utm_/i.test(k) && !['fbclid', 'gclid'].includes(k.toLowerCase()))
      .sort(([a], [b]) => a.localeCompare(b));
    u.search = '';
    for (const [k, v] of params) u.searchParams.append(k, v);
    return u.toString();
  } catch { return null; }
}

export function auditBookmarks(items: Bookmark[]): Audit {
  const seen = new Set<string>();
  const duplicates: Bookmark[] = [];
  const invalid: Bookmark[] = [];
  for (const item of items) {
    const key = canonicalUrl(item.url);
    if (!key) { invalid.push(item); continue; }
    if (seen.has(key)) duplicates.push(item); else seen.add(key);
  }
  return { total: items.length, unique: seen.size, duplicates, invalid };
}

export function cleanBookmarks(items: Bookmark[]): Bookmark[] {
  const seen = new Set<string>();
  const output: Bookmark[] = [];
  for (const item of items) {
    const key = canonicalUrl(item.url);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    output.push({ ...item, url: key });
  }
  return output;
}

export function toNetscape(items: Bookmark[]): string {
  const rows = items.map((b) => `    <DT><A HREF="${escapeHtml(b.url)}"${b.addDate ? ` ADD_DATE="${escapeHtml(b.addDate)}"` : ''}>${escapeHtml(b.title)}</A>`);
  return ['<!DOCTYPE NETSCAPE-Bookmark-file-1>', '<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">', '<TITLE>Bookmarks</TITLE>', '<H1>Bookmarks</H1>', '<DL><p>', ...rows, '</DL><p>', ''].join('\n');
}

function stripTags(value: string): string { return value.replace(/<[^>]*>/g, ''); }
function decodeEntities(value: string): string { return value.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>'); }
function escapeHtml(value: string): string { return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
