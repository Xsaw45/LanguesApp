import { createHash, randomBytes, randomInt, timingSafeEqual } from 'node:crypto'

// Connexion par e-mail de l'acces public : l'utilisateur recoit un lien et un code a 6 chiffres (le code sert
// quand le lien s'ouvre ailleurs que dans l'app installee, ex. iPhone). L'identite est l'adresse e-mail, en
// minuscules : la meme que l'identifiant Tailscale pour un compte Google, donc la meme progression.

export const SESSION_COOKIE = 'langues_session'
const LOGIN_TTL = 15 * 60_000
const SESSION_TTL = 365 * 24 * 3600_000
const RESEND_DELAY = 60_000 // entre deux e-mails a la meme adresse
const MAX_SENDS_PER_HOUR = 5
const MAX_CODE_ATTEMPTS = 5

const hash = (value) => createHash('sha256').update(value).digest('hex')
const codeHash = (email, code) => hash(`${email}:${code}`)
const sameHash = (a, b) => a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b))

export const normalizeEmail = (email) => email.trim().toLowerCase()

/** Chemin interne ou revenir apres connexion (jamais un autre site). */
export const safeNext = (next) => (typeof next === 'string' && /^\/(?![/\\])[\w\-./]*$/.test(next) ? next : '/zh/')

function readCookie(request, name) {
  for (const part of (request.headers.cookie || '').split(';')) {
    const [key, ...rest] = part.trim().split('=')
    if (key === name) return decodeURIComponent(rest.join('='))
  }
  return null
}

/** Utilisateur de la session (cookie), ou null. */
export function sessionUser(request, db) {
  const token = readCookie(request, SESSION_COOKIE)
  if (!token) return null
  const email = db.auth.sessionEmail(hash(token), Date.now())
  return email ? { login: email, name: email, method: 'email' } : null
}

const emailSchema = { type: 'string', minLength: 3, maxLength: 254, pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$' }

/** Routes /api/auth/* : demande de connexion, verification (lien ou code), deconnexion. */
export function authRoutes({ db, mailer, publicUrl, allowedEmails }) {
  const secure = publicUrl.startsWith('https:')

  function openSession(reply, email) {
    const token = randomBytes(32).toString('base64url')
    const now = Date.now()
    db.auth.spendLoginRequest(email)
    db.auth.createSession(hash(token), email, now + SESSION_TTL, now)
    reply.header('set-cookie', [
      `${SESSION_COOKIE}=${token}`, 'Path=/', 'HttpOnly', 'SameSite=Lax', `Max-Age=${SESSION_TTL / 1000}`,
      ...(secure ? ['Secure'] : []),
    ].join('; '))
    return { ok: true }
  }

  return async (api) => {
    api.post('/request', {
      schema: {
        body: {
          type: 'object',
          required: ['email'],
          additionalProperties: false,
          properties: { email: emailSchema, lang: { type: 'string', enum: ['fr', 'en'] }, next: { type: 'string', maxLength: 200 } },
        },
      },
    }, async (request, reply) => {
      const email = normalizeEmail(request.body.email)
      if (allowedEmails && !allowedEmails.has(email)) return reply.code(403).send({ error: 'not_invited' })

      const now = Date.now()
      const previous = db.auth.loginRequest(email)
      if (previous && now - previous.sent_at < RESEND_DELAY) {
        return reply.code(429).send({ error: 'too_soon', retryAfter: Math.ceil((previous.sent_at + RESEND_DELAY - now) / 1000) })
      }
      const sameHour = previous && now - previous.window_start < 3600_000
      const sentCount = sameHour ? previous.sent_count + 1 : 1
      if (sentCount > MAX_SENDS_PER_HOUR) return reply.code(429).send({ error: 'too_many' })

      const token = randomBytes(32).toString('base64url')
      const code = String(randomInt(0, 1_000_000)).padStart(6, '0')
      db.auth.saveLoginRequest({
        email,
        tokenHash: hash(token),
        codeHash: codeHash(email, code),
        expiresAt: now + LOGIN_TTL,
        sentAt: now,
        windowStart: sameHour ? previous.window_start : now,
        sentCount,
      })
      const next = safeNext(request.body.next)
      const link = `${publicUrl}/login/?token=${token}&next=${encodeURIComponent(next)}`
      await mailer.sendLogin({ to: email, link, code, lang: request.body.lang || 'fr' })
      return reply.code(202).send({ ok: true })
    })

    // Lien (token) ou code (email + code). Pas de oneOf : Fastify retire les proprietes inconnues pendant la
    // validation, ce qui viderait la seconde branche.
    api.post('/verify', {
      schema: {
        body: {
          type: 'object',
          additionalProperties: false,
          properties: {
            token: { type: 'string', minLength: 20, maxLength: 100 },
            email: emailSchema,
            code: { type: 'string', pattern: '^[0-9]{6}$' },
          },
        },
      },
    }, async (request, reply) => {
      const now = Date.now()
      const { token, email: rawEmail, code } = request.body
      if (token) {
        const pending = db.auth.loginByToken(hash(token))
        if (!pending || pending.expires_at <= now) return reply.code(400).send({ error: 'invalid_link' })
        return openSession(reply, pending.email)
      }
      if (!rawEmail || !code) return reply.code(400).send({ error: 'missing_code' })
      const email = normalizeEmail(rawEmail)
      const pending = db.auth.loginRequest(email)
      if (!pending || pending.expires_at <= now || pending.attempts >= MAX_CODE_ATTEMPTS) {
        return reply.code(400).send({ error: 'expired_code' })
      }
      if (!sameHash(pending.code_hash, codeHash(email, code))) {
        db.auth.countAttempt(email)
        return reply.code(400).send({ error: 'wrong_code', attemptsLeft: MAX_CODE_ATTEMPTS - pending.attempts - 1 })
      }
      return openSession(reply, email)
    })

    api.post('/logout', async (request, reply) => {
      const token = readCookie(request, SESSION_COOKIE)
      if (token) db.auth.deleteSession(hash(token))
      reply.header('set-cookie', `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure ? '; Secure' : ''}`)
      return { ok: true }
    })
  }
}
