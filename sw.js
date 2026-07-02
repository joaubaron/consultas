const CACHE_VERSION = '02.07.2026-0901';
const CACHE_NAME = `consultas-${CACHE_VERSION}`;

const CACHE = CACHE_NAME;
const FILES = [
  'index.html',
  'manifest.json',
  'icone192.png',
  'icone512.png',
  'unimed.png',
  'unimed1.webp',
  'unimed2.webp'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request)
      .catch(() => caches.match(e.request))
  );
});
