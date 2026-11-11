import Fastify from 'fastify'
import fastifyStatic from '@fastify/static'
import { openDb } from './db.js'
import { authRoutes, sessionUser } from './auth.js'

const APPS = ['it', 'zh']

const syncSchema = {
  params: {
    type: 'object',
    required: ['app'],
    properties: { app: { type: 'string', enum: APPS } },
  },
  body: {
    type: 'object',
    required: ['since', 'changes'],
    additionalProperties: false,
    properties: {
      // utilisateur auquel appartiennent les donnees locales de l'appareil (null = premier passage)
      user: { type: ['string', 'null'] },
      since: { type: 'integer', minimum: 0 },
      changes: {
        type: 'array',
        maxItems: 5000,
        items: {
          type: 'object',
          required: ['key', 'value', 'updatedAt'],
          additionalProperties: false,
          properties: {
            key: { type: 'string', minLength: 1, maxLength: 200 },
            value: {},
            updatedAt: { type: 'integer', minimum: 0 },
          },
        },
      },
    },
  },
}

// Tailscale Serve encode les valeurs non ASCII en RFC 2047 "Q" (=?utf-8?q?Ferris_B=C3=BCller?=).
function decodeHeader(value) {
  const match = /^=\?utf-8\?q\?(.*)\?=$/i.exec(value)
  if (!match) return value
  const text = match[1]
  const bytes = []
  for (let i = 0; i < text.length; i++) {
    const hex = text.slice(i + 1, i + 3)
    if (text[i] === '_') bytes.push(0x20)
    else if (text[i] === '=' && /^[0-9a-f]{2}$/i.test(hex)) {
      bytes.push(parseInt(hex, 16))
      i += 2
    } else bytes.push(...Buffer.from(text[i]))
  }
  return Buffer.from(bytes).toString('utf8')
}

/**
 * Identite = en-tetes poses par Tailscale Serve (qui supprime ceux envoyes par le client). Ce mode ne doit donc
 * etre joignable que via Serve. devUser : identite de secours pour le developpement local uniquement.
 */
function identify(request, devUser) {
  const login = request.headers['tailscale-user-login'] || devUser
  if (!login) return null
  const name = request.headers['tailscale-user-name']
  return { login: decodeHeader(login), name: name ? decodeHeader(name) : login, method: 'tailscale' }
}

// Seuls les fichiers de build Vite (/zh/assets/) ont un nom hashe ; le reste est revalide (ETag) a chaque fois.
const HASHED = '/zh/assets/'

/**
 * mode 'tailscale' : acces prive, identite par les en-tetes de Tailscale Serve.
 * mode 'email' : acces public (via Caddy), connexion par e-mail ; les en-tetes Tailscale n'y sont jamais lus, et
 * seule l'app chinoise est servie. publicUrl : adresse publique (liens des e-mails) ; allowedEmails : Set des
 * adresses invitees, null = toutes.
 */
export function buildApp({
  dbPath, publicDir, mode = 'tailscale', devUser = null, publicUrl = null, mailer = null, allowedEmails = null,
  logger = true,
}) {
  const app = Fastify({ logger, bodyLimit: 20 * 1024 * 1024 })
  const db = openDb(dbPath)
  app.addHook('onClose', async () => db.close())
  const email = mode === 'email'

  // Requetes journalisees seulement en cas d'erreur (sync toutes les minutes par appareil, healthcheck)
  const quiet = { logLevel: 'warn' }

  app.get('/healthz', quiet, async () => ({ ok: true }))

  if (email) {
    app.register(authRoutes({ db, mailer, publicUrl, allowedEmails }), { prefix: '/api/auth' })
    app.get('/', quiet, (request, reply) => reply.redirect('/zh/'))
    const notFound = (request, reply) => reply.code(404).send()
    app.get('/it', quiet, notFound)
    app.get('/it/*', quiet, notFound)
  }

  app.register(async (api) => {
    api.addHook('onRequest', async (request, reply) => {
      request.user = email ? sessionUser(request, db) : identify(request, devUser)
      if (request.user) return
      // login : page de connexion vers laquelle le client redirige (shared/sync.js)
      if (email) return reply.code(401).send({ error: 'connexion requise', login: '/login/' })
      return reply.code(401).send({ error: 'identite Tailscale absente' })
    })

    api.get('/me', async (request) => request.user)

    api.post('/sync/:app', { schema: syncSchema }, async (request, reply) => {
      const { login } = request.user
      const { user, since, changes } = request.body
      // Donnees locales d'un autre utilisateur (appareil reconnecte sous un autre compte) :
      // rien n'est ecrit, l'appareil efface ses donnees locales puis resynchronise.
      if (user && user !== login) return reply.code(409).send({ user: login })
      return { user: login, ...db.sync(login, request.params.app, since, changes) }
    })
  }, { prefix: '/api', ...quiet })

  app.register(fastifyStatic, {
    ...quiet,
    root: publicDir,
    redirect: true,
    cacheControl: false,
    setHeaders(res, filePath) {
      const hashed = filePath.replaceAll('\\', '/').includes(HASHED)
      res.setHeader('Cache-Control', hashed ? 'public, max-age=31536000, immutable' : 'no-cache')
    },
  })

  return app
}
