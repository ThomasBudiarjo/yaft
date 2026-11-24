/* global CACHE, FILES, clients */
const SHELL = '/app/index.html';
const assets = new Set(FILES);

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(FILES.map((url) => new Request(url, { cache: 'reload' })))));
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) {
      if (key.startsWith('yaft-shell-') && key !== CACHE) await caches.delete(key);
    }
    await clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin || url.pathname.startsWith('/app/api/')) return;

  // Navigation and known build files only. Never cache OAuth or GitHub API requests.
  if (request.mode === 'navigate' && url.pathname.startsWith('/app/') && url.pathname !== '/app/auth') {
    event.respondWith(fetch(request).catch(async () => (await caches.open(CACHE)).match(SHELL)));
  } else if (assets.has(url.pathname) && !url.search) {
    event.respondWith(caches.open(CACHE).then(async (cache) => (await cache.match(url.pathname)) ?? fetch(request)));
  }
});
