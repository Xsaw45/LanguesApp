/**
 * Synchronisation de la progression avec le serveur (POST /api/sync/<app>), par utilisateur (Tailscale ou e-mail).
 *
 * Chaque app decrit sa progression en enregistrements { key, value } (value null = supprime) :
 *  - track(changes)        : modifications locales, envoyees peu apres (et conservees hors ligne) ;
 *  - applyRemote(records)  : fourni par l'app, ecrit localement ce qui vient du serveur (sans le re-signaler) ;
 *  - resetLocal()          : fourni par l'app, efface les donnees locales (appareil passe a un autre utilisateur).
 * Fusion enregistrement par enregistrement : le plus recent (horloge de l'appareil) gagne, le serveur tranche.
 * L'etat de synchronisation est dans localStorage["langues-sync:<app>"] (lu aussi par la page d'accueil).
 */
const BATCH = 1000
const DEBOUNCE_MS = 1500
const POLL_MS = 60_000
const MAX_ROUNDS = 50

export function createSync({ app, applyRemote, resetLocal }) {
  const metaKey = `langues-sync:${app}`
  const emptyMeta = (user = null) => ({ user, cursor: 0, pending: {}, lastSync: null })
  let meta = loadMeta()
  let timer = null
  let running = null
  let again = false
  let started = false

  function loadMeta() {
    try {
      const stored = JSON.parse(localStorage.getItem(metaKey))
      if (stored && Number.isInteger(stored.cursor) && stored.pending) return stored
    } catch { /* meta illisible : on repart de zero, le serveur renverra tout */ }
    return emptyMeta()
  }

  function saveMeta() {
    try {
      localStorage.setItem(metaKey, JSON.stringify(meta))
    } catch {
      console.warn('[sync] etat de synchronisation non enregistre (stockage plein ?)')
    }
  }

  async function round() {
    const sent = Object.entries(meta.pending).slice(0, BATCH)
    const changes = sent.map(([key, p]) => ({ key, value: p.value, updatedAt: p.updatedAt }))
    const body = JSON.stringify({ user: meta.user, since: meta.cursor, changes })
    const res = await fetch(`/api/sync/${app}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body,
      // laisse partir l'envoi quand la page se ferme (limite navigateur ~64 Ko)
      keepalive: body.length < 60_000,
    })
    if (res.status === 409) {
      // Les donnees locales appartiennent a un autre utilisateur Tailscale : on les efface, puis on recharge
      // celles de l'utilisateur courant au tour suivant.
      const { user } = await res.json()
      await resetLocal()
      meta = emptyMeta(user)
      saveMeta()
      return true
    }
    if (res.status === 401) {
      // Acces public sans session : le serveur indique sa page de connexion (retour ensuite sur cette page).
      const { login } = await res.json().catch(() => ({}))
      if (login) location.assign(`${login}?next=${encodeURIComponent(location.pathname)}`)
      throw new Error(`sync ${app} : connexion requise`)
    }
    if (!res.ok) throw new Error(`sync ${app} : HTTP ${res.status}`)
    const data = await res.json()

    // une cle re-modifiee pendant l'envoi a une nouvelle entree : elle reste a envoyer
    for (const [key, entry] of sent) if (meta.pending[key] === entry) delete meta.pending[key]
    const incoming = []
    for (const record of data.changes) {
      const local = meta.pending[record.key]
      if (local && local.updatedAt > record.updatedAt) continue // modification locale plus recente : elle partira
      delete meta.pending[record.key]
      incoming.push(record)
    }
    if (incoming.length) await applyRemote(incoming)
    meta.user = data.user
    meta.cursor = data.cursor
    meta.lastSync = Date.now()
    saveMeta()
    return Object.keys(meta.pending).length > 0
  }

  async function run() {
    for (let i = 0; i < MAX_ROUNDS && (await round()); i++);
  }

  function syncNow() {
    clearTimeout(timer)
    if (running) {
      again = true
      return running
    }
    running = run().finally(() => {
      running = null
      if (again) {
        again = false
        syncSoon(0)
      }
    })
    return running
  }

  function syncSoon(delay) {
    clearTimeout(timer)
    timer = setTimeout(() => syncNow().catch((err) => console.debug('[sync]', err.message)), delay)
  }

  return {
    /** Signale des modifications locales : [{ key, value }] (value null = supprime). */
    track(changes) {
      if (!changes.length) return
      const now = Date.now()
      for (const { key, value } of changes) meta.pending[key] = { value: value ?? null, updatedAt: now }
      saveMeta()
      syncSoon(DEBOUNCE_MS)
    },

    /**
     * Premiere synchronisation (attendue au plus `timeout` ms : hors ligne, l'app demarre avec ses donnees
     * locales), puis synchronisation au retour en ligne, au retour sur l'onglet et toutes les minutes.
     */
    start({ timeout = 4000 } = {}) {
      if (!started) {
        started = true
        window.addEventListener('online', () => syncSoon(0))
        // onglet masque : envoi immediat de ce qui reste ; onglet visible : recuperation des autres appareils
        document.addEventListener('visibilitychange', () => syncSoon(0))
        setInterval(() => {
          if (document.visibilityState === 'visible') syncSoon(0)
        }, POLL_MS)
      }
      const first = syncNow().catch((err) => console.debug('[sync]', err.message))
      return Promise.race([first, new Promise((resolve) => setTimeout(resolve, timeout))])
    },
  }
}
