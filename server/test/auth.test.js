import { test, beforeEach, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { buildApp } from '../app.js'

let app
let dir
let sent

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), 'langues-auth-'))
  sent = []
  app = buildApp({
    dbPath: join(dir, 'test.db'),
    publicDir: dir,
    mode: 'email',
    publicUrl: 'https://chinois.example',
    allowedEmails: new Set(['a@x.fr', 'b@x.fr']),
    mailer: { sendLogin: async (message) => sent.push(message) },
    logger: false,
  })
})

afterEach(async () => {
  await app.close()
  rmSync(dir, { recursive: true, force: true })
})

const post = (url, payload, cookie) =>
  app.inject({ method: 'POST', url, payload, headers: cookie ? { cookie } : {} })

const cookieOf = (res) => res.headers['set-cookie'].split(';')[0]
const tokenOf = (message) => new URL(message.link).searchParams.get('token')

async function signIn(email) {
  await post('/api/auth/request', { email })
  const res = await post('/api/auth/verify', { email, code: sent.at(-1).code })
  return cookieOf(res)
}

test('les en-tetes Tailscale sont ignores sur l acces public', async () => {
  const res = await app.inject({ url: '/api/me', headers: { 'tailscale-user-login': 'a@x.fr' } })
  assert.equal(res.statusCode, 401)
  assert.deepEqual(res.json(), { error: 'connexion requise', login: '/login/' })
})

test('connexion par code : la session donne acces a la progression de l adresse', async () => {
  const cookie = await signIn('A@X.fr')
  const me = await app.inject({ url: '/api/me', headers: { cookie } })
  assert.deepEqual(me.json(), { login: 'a@x.fr', name: 'a@x.fr', method: 'email' })

  const sync = await app.inject({
    method: 'POST', url: '/api/sync/zh', headers: { cookie },
    payload: { user: null, since: 0, changes: [{ key: 'hsk1_0001', value: { s: 1 }, updatedAt: 10 }] },
  })
  assert.equal(sync.json().user, 'a@x.fr')
})

test('le lien ne sert qu une fois', async () => {
  await post('/api/auth/request', { email: 'a@x.fr' })
  const token = tokenOf(sent[0])
  assert.equal(new URL(sent[0].link).searchParams.get('next'), '/zh/')

  assert.equal((await post('/api/auth/verify', { token })).statusCode, 200)
  assert.equal((await post('/api/auth/verify', { token })).statusCode, 400)
})

test('5 codes faux invalident la demande, meme le bon code ensuite', async () => {
  await post('/api/auth/request', { email: 'a@x.fr' })
  const good = sent[0].code
  const wrong = good === '000000' ? '111111' : '000000'
  for (let left = 4; left >= 0; left--) {
    const res = await post('/api/auth/verify', { email: 'a@x.fr', code: wrong })
    assert.deepEqual(res.json(), { error: 'wrong_code', attemptsLeft: left })
  }
  const res = await post('/api/auth/verify', { email: 'a@x.fr', code: good })
  assert.deepEqual(res.json(), { error: 'expired_code' })
})

test('adresse non invitee : 403 et aucun e-mail', async () => {
  const res = await post('/api/auth/request', { email: 'c@x.fr' })
  assert.equal(res.statusCode, 403)
  assert.equal(sent.length, 0)
})

test('deuxieme envoi trop rapproche : 429', async () => {
  assert.equal((await post('/api/auth/request', { email: 'a@x.fr' })).statusCode, 202)
  const res = await post('/api/auth/request', { email: 'a@x.fr' })
  assert.equal(res.statusCode, 429)
  assert.equal(res.json().error, 'too_soon')
  assert.equal(sent.length, 1)
})

test('next ne peut pas renvoyer vers un autre site', async () => {
  await post('/api/auth/request', { email: 'a@x.fr', next: '//evil.example/' })
  assert.equal(new URL(sent[0].link).searchParams.get('next'), '/zh/')
})

test('deconnexion : la session ne vaut plus', async () => {
  const cookie = await signIn('b@x.fr')
  await post('/api/auth/logout', undefined, cookie)
  assert.equal((await app.inject({ url: '/api/me', headers: { cookie } })).statusCode, 401)
})

test('acces public : seule l app chinoise est servie', async () => {
  assert.equal((await app.inject({ url: '/' })).headers.location, '/zh/')
  assert.equal((await app.inject({ url: '/it/' })).statusCode, 404)
})
