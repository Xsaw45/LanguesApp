import { test, beforeEach, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { buildApp } from '../app.js'

let app
let dir

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), 'langues-'))
  app = buildApp({ dbPath: join(dir, 'test.db'), publicDir: dir, logger: false })
})

afterEach(async () => {
  await app.close()
  rmSync(dir, { recursive: true, force: true })
})

async function sync(login, body, appId = 'it') {
  const res = await app.inject({
    method: 'POST',
    url: `/api/sync/${appId}`,
    headers: login ? { 'tailscale-user-login': login } : {},
    payload: { user: login, since: 0, changes: [], ...body },
  })
  return { status: res.statusCode, body: res.json() }
}

test('le changement le plus recent gagne, quel que soit l ordre d arrivee', async () => {
  await sync('a@x', { changes: [{ key: 'vocab/casa', value: { phase: 2 }, updatedAt: 200 }] })
  const late = await sync('a@x', { changes: [{ key: 'vocab/casa', value: { phase: 0 }, updatedAt: 100 }] })

  // l'appareil en retard recoit la version du serveur pour converger
  assert.deepEqual(late.body.changes, [{ key: 'vocab/casa', value: { phase: 2 }, updatedAt: 200 }])
  const fresh = await sync('a@x', {})
  assert.deepEqual(fresh.body.changes, [{ key: 'vocab/casa', value: { phase: 2 }, updatedAt: 200 }])
})

test('le curseur ne renvoie que ce qui a change depuis, sans l echo des propres ecritures', async () => {
  const first = await sync('a@x', { changes: [{ key: 'settings', value: { darkMode: true }, updatedAt: 10 }] })
  assert.deepEqual(first.body.changes, [])

  await sync('a@x', { changes: [{ key: 'schede/1', value: { theoryViewed: true }, updatedAt: 20 }] })
  const other = await sync('a@x', { since: first.body.cursor })
  assert.deepEqual(other.body.changes, [{ key: 'schede/1', value: { theoryViewed: true }, updatedAt: 20 }])

  const idle = await sync('a@x', { since: other.body.cursor })
  assert.deepEqual(idle.body.changes, [])
  assert.equal(idle.body.cursor, other.body.cursor)
})

test('une suppression (value null) se propage', async () => {
  await sync('a@x', { changes: [{ key: 'hsk1_1', value: { known: true }, updatedAt: 10 }] }, 'zh')
  await sync('a@x', { changes: [{ key: 'hsk1_1', value: null, updatedAt: 20 }] }, 'zh')
  const fresh = await sync('a@x', {}, 'zh')
  assert.deepEqual(fresh.body.changes, [{ key: 'hsk1_1', value: null, updatedAt: 20 }])
})

test('utilisateurs et apps sont isoles', async () => {
  await sync('a@x', { changes: [{ key: 'k', value: 1, updatedAt: 10 }] }, 'it')
  assert.deepEqual((await sync('b@x', {}, 'it')).body.changes, [])
  assert.deepEqual((await sync('a@x', {}, 'zh')).body.changes, [])
})

test('donnees locales d un autre utilisateur : 409 et rien n est ecrit', async () => {
  const res = await sync('b@x', { user: 'a@x', changes: [{ key: 'k', value: 1, updatedAt: 10 }] })
  assert.equal(res.status, 409)
  assert.deepEqual(res.body, { user: 'b@x' })
  assert.deepEqual((await sync('b@x', {})).body.changes, [])
})

test('sans identite Tailscale : 401', async () => {
  assert.equal((await sync(null, {})).status, 401)
  assert.equal((await app.inject({ url: '/api/me' })).statusCode, 401)
})

test('nom affiche decode depuis RFC 2047', async () => {
  const res = await app.inject({
    url: '/api/me',
    headers: { 'tailscale-user-login': 'a@x', 'tailscale-user-name': '=?utf-8?q?Ferris_B=C3=BCller?=' },
  })
  assert.deepEqual(res.json(), { login: 'a@x', name: 'Ferris Büller', method: 'tailscale' })
})
