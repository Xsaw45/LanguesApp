import { DatabaseSync } from 'node:sqlite'

// Progression par utilisateur : un enregistrement par (user, app, key), le plus recent (updated_at, horloge de
// l'appareil) gagne. seq = compteur global, incremente a chaque ecriture acceptee : un appareil demande
// "tout ce qui a change depuis seq N" (son curseur).
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

    /** Copie coherente de la base (sauvegardes), meme pendant les ecritures. */
    snapshot(dest) {
      snapshotTo.run(dest)
    },

    close() {
      db.close()
    },
  }
}
