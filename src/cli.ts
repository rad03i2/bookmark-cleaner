#!/usr/bin/env node
import { readFile, writeFile, access } from 'node:fs/promises';
import { resolve } from 'node:path';
import { auditBookmarks, cleanBookmarks, parseBookmarks, toNetscape } from './bookmarks.js';

const VERSION = '1.0.0';
async function main(): Promise<void> {
  const args = process.argv.slice(2);
  if (args.includes('--version')) { console.log(`bookmark-cleaner ${VERSION} — Radwan Abdulhadi Ahmed (@rad03i2)`); return; }
  const [command, input, ...rest] = args;
  if (!command || !input || !['audit', 'clean'].includes(command)) return usage(2);
  const source = resolve(input);
  const html = await readFile(source, 'utf8');
  const items = parseBookmarks(html);
  if (items.length === 0) throw new Error('No bookmarks found. Export bookmarks as Netscape HTML first.');
  const audit = auditBookmarks(items);
  if (command === 'audit') {
    if (rest.includes('--json')) console.log(JSON.stringify(audit, null, 2));
    else console.log(`Bookmarks: ${audit.total}\nUnique HTTP(S): ${audit.unique}\nDuplicates: ${audit.duplicates.length}\nInvalid/unsupported: ${audit.invalid.length}`);
    return;
  }
  const outIndex = rest.indexOf('--output');
  if (outIndex < 0 || !rest[outIndex + 1]) throw new Error('clean requires --output <file>.');
  const destination = resolve(rest[outIndex + 1]!);
  if (destination === source) throw new Error('Refusing to overwrite the input file. Choose a different output path.');
  if (!rest.includes('--overwrite')) {
    try { await access(destination); throw new Error('Output exists. Use --overwrite to replace it.'); } catch (e) { if (e instanceof Error && e.message.startsWith('Output exists')) throw e; }
  }
  const cleaned = cleanBookmarks(items);
  await writeFile(destination, toNetscape(cleaned), { encoding: 'utf8', mode: 0o600 });
  console.log(`Wrote ${cleaned.length} cleaned bookmarks to ${destination}. Removed ${audit.duplicates.length} duplicates and ${audit.invalid.length} invalid/unsupported entries.`);
}
function usage(code: number): never {
  console.error('Usage:\n  bookmark-cleaner audit <bookmarks.html> [--json]\n  bookmark-cleaner clean <bookmarks.html> --output <cleaned.html> [--overwrite]\n  bookmark-cleaner --version');
  process.exit(code);
}
main().catch((error: unknown) => { console.error(`Error: ${error instanceof Error ? error.message : String(error)}`); process.exitCode = 2; });
