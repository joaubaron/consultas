const CACHE_VERSION = '26.06.2026-1014';
const CACHE_NAME = `consultas-${CACHE_VERSION}`;

const CACHE = CACHE_NAME;
const STATIC_FILES = [
  'manifest.json',
  'icone192.png',
  'icone512.png',
  'unimed1.webp',
  'unimed2.webp'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(async c => {
      // Arquivos estáticos normalmente
      await c.addAll(STATIC_FILES);
      // index.html com cache-bust para garantir versão nova do CDN
      const resp = await fetch(`index.html?v=${CACHE_VERSION}`, { cache: 'no-store' });
      await c.put('index.html', resp);
    })
  );
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
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
