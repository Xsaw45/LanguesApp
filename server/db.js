import { DatabaseSync } from 'node:sqlite'

// Progression par utilisateur : un enregistrement par (user, app, key), le plus recent (updated_at, horloge de
// l'appareil) gagne. seq = compteur global, incremente a chaque ecriture acceptee : un appareil demande
// "tout ce qui a change depuis seq N" (son curseur).
// Connexion par e-mail (acces public, voir auth.js) : une demande en cours par adresse (lien + code), sessions.
// Jetons et codes ne sont stockes que hashes (SHA-256).
export function openDb(path) {
  const db = new DatabaseSync(path)
  db.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA synchronous = NORMAL;
    PRAGMA busy_timeout = 5000;
    CREATE TABLE IF NOT EXISTS records (
      user TEXT NOT NULL,
      app TEXT NOT NULL,
      key TEXT NOT NULL,
      value TEXT,
      updated_at INTEGER NOT NULL,
      seq INTEGER NOT NULL,
      PRIMARY KEY (user, app, key)
    ) WITHOUT ROWID;
    CREATE INDEX IF NOT EXISTS records_by_seq ON records (user, app, seq);
    CREATE TABLE IF NOT EXISTS counter (id INTEGER PRIMARY KEY CHECK (id = 1), seq INTEGER NOT NULL);
    INSERT OR IGNORE INTO counter (id, seq) VALUES (1, 0);
    CREATE TABLE IF NOT EXISTS login_requests (
      email TEXT PRIMARY KEY,
      token_hash TEXT NOT NULL UNIQUE,
      code_hash TEXT NOT NULL,
      expires_at INTEGER NOT NULL,
      attempts INTEGER NOT NULL,
      sent_at INTEGER NOT NULL,
      window_start INTEGER NOT NULL,
      sent_count INTEGER NOT NULL
    ) WITHOUT ROWID;
    CREATE TABLE IF NOT EXISTS sessions (
      token_hash TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      expires_at INTEGER NOT NULL
    ) WITHOUT ROWID;
  `)

  const currentSeq = db.prepare('SELECT seq FROM counter WHERE id = 1')
  const nextSeq = db.prepare('UPDATE counter SET seq = seq + 1 WHERE id = 1 RETURNING seq')
  const upsert = db.prepare(`
    INSERT INTO records (user, app, key, value, updated_at, seq) VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT (user, app, key) DO UPDATE
      SET value = excluded.value, updated_at = excluded.updated_at, seq = excluded.seq
      WHERE excluded.updated_at > records.updated_at
  `)
  const getRecord = db.prepare('SELECT key, value, updated_at, seq FROM records WHERE user = ? AND app = ? AND key = ?')
  const changedSince = db.prepare(
    'SELECT key, value, updated_at, seq FROM records WHERE user = ? AND app = ? AND seq > ? ORDER BY seq',
  )
  const snapshotTo = db.prepare('VACUUM INTO ?')

  const getLoginRequest = db.prepare('SELECT * FROM login_requests WHERE email = ?')
  const getLoginByToken = db.prepare('SELECT * FROM login_requests WHERE token_hash = ?')
  const putLoginRequest = db.prepare(`
    INSERT OR REPLACE INTO login_requests
      (email, token_hash, code_hash, expires_at, attempts, sent_at, window_start, sent_count)
    VALUES (?, ?, ?, ?, 0, ?, ?, ?)
  `)
  const countAttempt = db.prepare('UPDATE login_requests SET attempts = attempts + 1 WHERE email = ?')
  // La demande reste (sans jeton utilisable) pour garder le compteur d'envois de l'heure.
  const spendLoginRequest = db.prepare(
    "UPDATE login_requests SET token_hash = 'used:' || email, code_hash = '', expires_at = 0 WHERE email = ?",
  )
  const insertSession = db.prepare('INSERT INTO sessions (token_hash, email, expires_at) VALUES (?, ?, ?)')
  const getSession = db.prepare('SELECT email FROM sessions WHERE token_hash = ? AND expires_at > ?')
  const deleteSession = db.prepare('DELETE FROM sessions WHERE token_hash = ?')
  const deleteExpiredSessions = db.prepare('DELETE FROM sessions WHERE expires_at <= ?')

  const toChange = (row) => ({
    key: row.key,
    value: row.value === null ? null : JSON.parse(row.value),
    updatedAt: row.updated_at,
  })

  return {
    /**
     * Applique les changements d'un appareil puis renvoie ce qu'il doit appliquer localement :
     * tout ce qui a change depuis `since` (sauf ses propres ecritures acceptees), plus la version serveur
     * des cles dont l'ecriture a ete refusee (plus ancienne), pour que l'appareil converge.
     */
    sync(user, app, since, changes) {
      db.exec('BEGIN IMMEDIATE')
      try {
        const seq = changes.length ? nextSeq.get().seq : currentSeq.get().seq
        const accepted = new Map()
        const rejected = new Set()
        for (const { key, value, updatedAt } of changes) {
          const json = value === null ? null : JSON.stringify(value)
          if (upsert.run(user, app, key, json, updatedAt, seq).changes) {
            accepted.set(key, updatedAt)
            rejected.delete(key)
          } else if (!accepted.has(key)) {
            rejected.add(key)
          }
        }
        const rows = changedSince.all(user, app, since)
        const seen = new Set(rows.map((row) => row.key))
        for (const key of rejected) if (!seen.has(key)) rows.push(getRecord.get(user, app, key))
        db.exec('COMMIT')
        return {
          cursor: seq,
          changes: rows.filter((row) => accepted.get(row.key) !== row.updated_at).map(toChange),
        }
      } catch (err) {
        db.exec('ROLLBACK')
        throw err
      }
    },

    auth: {
      loginRequest: (email) => getLoginRequest.get(email),
      loginByToken: (tokenHash) => getLoginByToken.get(tokenHash),
      saveLoginRequest({ email, tokenHash, codeHash, expiresAt, sentAt, windowStart, sentCount }) {
        putLoginRequest.run(email, tokenHash, codeHash, expiresAt, sentAt, windowStart, sentCount)
      },
      countAttempt: (email) => countAttempt.run(email),
      spendLoginRequest: (email) => spendLoginRequest.run(email),
      createSession(tokenHash, email, expiresAt, now) {
        deleteExpiredSessions.run(now)
        insertSession.run(tokenHash, email, expiresAt)
      },
      sessionEmail: (tokenHash, now) => getSession.get(tokenHash, now)?.email ?? null,
      deleteSession: (tokenHash) => deleteSession.run(tokenHash),
    },

    /** Copie coherente de la base (sauvegardes), meme pendant les ecritures. */
    snapshot(dest) {
      snapshotTo.run(dest)
    },

    close() {
      db.close()
    },
  }
}
