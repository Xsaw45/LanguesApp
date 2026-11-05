import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { sync } from './db/index.js'
import { registerSW } from 'virtual:pwa-register'

// Mises a jour : le service worker recharge lui-meme la page quand une nouvelle version s'active (public/sw-reload.js).
// Une app installee reste ouverte en arriere-plan sans jamais redemarrer : on cherche donc une nouvelle version a
// chaque retour sur l'app, pas seulement au lancement.
registerSW({
  immediate: true,
  onNeedReload() {}, // deja fait par le service worker
  onRegisteredSW(_url, registration) {
    if (!registration) return
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') registration.update()
    })
  },
})

// Recupere d'abord la progression de l'utilisateur (attente bornee : hors ligne, donnees locales)
sync.start().then(() => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})
