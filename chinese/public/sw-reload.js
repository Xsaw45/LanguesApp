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
