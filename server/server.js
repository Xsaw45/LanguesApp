import { buildApp } from './app.js'

const required = (name) => process.env[name] || (console.error(`Variable ${name} manquante`), process.exit(1))

const app = buildApp({
  dbPath: required('DB_PATH'),
  publicDir: required('PUBLIC_DIR'),
  // developpement local uniquement : en production l'identite vient de Tailscale Serve
  devUser: process.env.DEV_USER || null,
})

for (const signal of ['SIGINT', 'SIGTERM']) process.once(signal, () => app.close().then(() => process.exit(0)))

await app.listen({ host: '0.0.0.0', port: Number(process.env.PORT || 8080) })
