import { buildApp } from './app.js'
import { createMailer } from './mail.js'
import { normalizeEmail } from './auth.js'

const required = (name) => process.env[name] || (console.error(`Variable ${name} manquante`), process.exit(1))

const dbPath = required('DB_PATH')
const publicDir = required('PUBLIC_DIR')

// Acces prive (Tailscale Serve -> PORT) : identite par les en-tetes Tailscale.
const app = buildApp({
  dbPath,
  publicDir,
  // developpement local uniquement : en production l'identite vient de Tailscale Serve
  devUser: process.env.DEV_USER || null,
})
const apps = [app]

// Acces public (Caddy -> PUBLIC_PORT), facultatif : connexion par e-mail, en-tetes Tailscale ignores.
if (process.env.PUBLIC_PORT) {
  const publicUrl = required('PUBLIC_URL').replace(/\/$/, '')
  if (process.env.NODE_ENV === 'production') ['SMTP_URL', 'MAIL_FROM'].forEach(required)
  const allowed = (process.env.AUTH_ALLOWED_EMAILS || '').split(',').map(normalizeEmail).filter(Boolean)
  const publicApp = buildApp({
    dbPath,
    publicDir,
    mode: 'email',
    publicUrl,
    allowedEmails: allowed.length ? new Set(allowed) : null,
    mailer: createMailer({
      smtpUrl: process.env.SMTP_URL,
      from: process.env.MAIL_FROM || 'Chinois <no-reply@localhost>',
      log: console,
    }),
  })
  apps.push(publicApp)
  await publicApp.listen({ host: '0.0.0.0', port: Number(process.env.PUBLIC_PORT) })
}

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.once(signal, () => Promise.all(apps.map((a) => a.close())).then(() => process.exit(0)))
}

await app.listen({ host: '0.0.0.0', port: Number(process.env.PORT || 8080) })
