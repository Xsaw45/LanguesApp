// Charge par le service worker genere (workbox.importScripts). Quand une nouvelle version s'active, les fenetres
// encore servies par l'ancienne sont rechargees : la mise a jour est visible sans fermer l'app (premiere
// installation : aucune fenetre controlee, rien a recharger).
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const outdated = await self.clients.matchAll({ type: 'window' })
    if (!outdated.length) return
    await self.clients.claim()
    // Pas d'attente : le rechargement passe par ce service worker, qui ne repond qu'une fois active (interblocage).
    for (const client of outdated) client.navigate(client.url).catch(() => {})
  })())
})

// La page est servie « réseau d'abord » (cache zh-pages, vite.config.js) : elle n'entre dans le cache qu'en passant
// par ce service worker, donc pas au tout premier chargement. On l'y met dès l'installation pour que l'app
// fonctionne hors ligne même si elle n'a été ouverte qu'une fois.
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open('zh-pages').then((cache) => cache.add(self.registration.scope)).catch(() => {}))
})
