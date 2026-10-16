// Hors-ligne de la page d'accueil uniquement. /it/ et /zh/ ont leur propre service worker (portee plus precise) ;
// les caches sont communs a toute l'origine : on ne touche qu'aux notres.
const CACHE_PREFIX = 'langues-home-';
const CACHE_NAME = `${CACHE_PREFIX}v1`;
const ASSETS = ['/', '/manifest.webmanifest', '/icons/icon.svg', '/icons/icon-192.png', '/icons/icon-512.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k.startsWith(CACHE_PREFIX) && k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Reseau d'abord (mises a jour visibles tout de suite), cache si hors ligne.
self.addEventListener('fetch', (event) => {
  const { pathname } = new URL(event.request.url);
  if (event.request.method !== 'GET' || !ASSETS.includes(pathname)) return;
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(pathname, copy));
        }
        return response;
      })
      .catch(() => caches.match(pathname))
  );
});
