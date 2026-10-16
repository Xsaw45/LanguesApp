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
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      }
    })
  ],
})
