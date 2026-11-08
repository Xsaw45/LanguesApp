import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// Servie sous /zh/ par le serveur LanguesApp. Le manifeste PWA est celui de l'accueil (/manifest.webmanifest) :
// une seule app installee, ce service worker ne gere que le hors-ligne de /zh/.
export default defineConfig({
  base: '/zh/',
  server: {
    fs: { allow: ['..'] }, // ../shared/sync.js
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: false,
      workbox: {
        // La page (index.html) n'est pas pre-cachee : reseau d'abord, donc chaque ouverture charge la derniere
        // version deployee ; le cache ne sert que hors ligne. Les assets ont un nom hashe, ils restent pre-caches.
        // Police : seuls les sous-ensembles latins (français + pinyin) sont utiles, les autres ne sont jamais chargés.
        globPatterns: ['**/*.{js,css,ico,png,svg,json}', '**/*latin*.woff2'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        navigateFallback: null,
        importScripts: ['sw-reload.js'],
        runtimeCaching: [{
          urlPattern: ({ request }) => request.mode === 'navigate',
          handler: 'NetworkFirst',
          options: { cacheName: 'zh-pages', networkTimeoutSeconds: 4 },
        }, {
          // Enregistrements (36 Mo au total) : gardés une fois écoutés, pas téléchargés d'avance.
          urlPattern: ({ url }) => url.pathname.startsWith('/zh/audio/'),
          handler: 'CacheFirst',
          options: { cacheName: 'zh-audio', expiration: { maxEntries: 5000 } },
        }],
      }
    })
  ],
})
