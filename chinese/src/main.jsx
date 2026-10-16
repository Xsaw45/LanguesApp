import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { sync } from './db/index.js'

// Recupere d'abord la progression de l'utilisateur (attente bornee : hors ligne, donnees locales)
sync.start().then(() => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})
