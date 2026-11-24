import { createHash } from 'node:crypto';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = new URL('../web-build/', import.meta.url);
const files = (await readdir(new URL('app/', root), { recursive: true, withFileTypes: true }))
  .filter((entry) => entry.isFile() && entry.name !== 'sw.js')
  .map((entry) => relative(fileURLToPath(root), join(entry.parentPath, entry.name)))
  .sort();
const worker = await readFile(new URL('sw.js', import.meta.url), 'utf8');
const hash = createHash('sha256').update(worker);
for (const path of files) hash.update(path).update(await readFile(new URL(path, root)));
await writeFile(new URL('app/sw.js', root),
  `const CACHE = 'yaft-shell-${hash.digest('hex').slice(0, 16)}';\nconst FILES = ${JSON.stringify(files.map((path) => `/${path}`))};\n${worker}`,
);

// The SQLite WASM worker needs cross-origin isolation. Don't inject portal scripts into the app.
await writeFile(new URL('_headers', root), `/app/*
  Cross-Origin-Opener-Policy: same-origin
  Cross-Origin-Embedder-Policy: require-corp
  X-Content-Type-Options: nosniff
  Referrer-Policy: no-referrer
  X-Amp-Review-Widget: off
  Content-Security-Policy: default-src 'none'; script-src 'self' 'wasm-unsafe-eval'; worker-src 'self' blob:; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; manifest-src 'self'; connect-src 'self' https://cdn.jsdelivr.net https://latest.currency-api.pages.dev; base-uri 'none'; frame-ancestors 'none'
/app/index.html
  Cache-Control: no-cache
/app/sw.js
  Cache-Control: no-cache
`);
