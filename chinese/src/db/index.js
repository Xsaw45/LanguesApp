import { openDB } from 'idb'
import { createSync } from '../../../shared/sync.js'

const DB_NAME = 'hsk-vocab'
const DB_VERSION = 1
const STORE = 'wordProgress'

// Emis quand des progressions arrivent d'un autre appareil (useProgress recharge alors sa Map).
export const REMOTE_PROGRESS_EVENT = 'langues:zh-progress'

let dbPromise = null

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE)) {
          const store = db.createObjectStore(STORE, { keyPath: 'wordId' })
          store.createIndex('level', 'level')
          store.createIndex('nextReview', 'nextReview')
        }
      },
    })
  }
  return dbPromise
}

// Un enregistrement synchronise par mot : key = wordId, value = objet de progression.
export const sync = createSync({
  app: 'zh',
  async applyRemote(records) {
    const db = await getDB()
    const tx = db.transaction(STORE, 'readwrite')
    await Promise.all([
      ...records.map(r => (r.value === null ? tx.store.delete(r.key) : tx.store.put(r.value))),
      tx.done,
    ])
    window.dispatchEvent(new Event(REMOTE_PROGRESS_EVENT))
  },
  async resetLocal() {
    const db = await getDB()
    await db.clear(STORE)
    window.dispatchEvent(new Event(REMOTE_PROGRESS_EVENT))
  },
})

export async function getWordProgress(wordId) {
  const db = await getDB()
  return db.get(STORE, wordId)
}

export async function getAllProgress() {
  const db = await getDB()
  return db.getAll(STORE)
}

export async function getProgressForLevel(level) {
  const db = await getDB()
  return db.getAllFromIndex(STORE, 'level', level)
}

export async function saveWordProgress(progress) {
  const db = await getDB()
  await db.put(STORE, progress)
  sync.track([{ key: progress.wordId, value: progress }])
}

export async function saveManyProgress(progressList) {
  const db = await getDB()
  const tx = db.transaction(STORE, 'readwrite')
  await Promise.all([
    ...progressList.map(p => tx.store.put(p)),
    tx.done,
  ])
  sync.track(progressList.map(p => ({ key: p.wordId, value: p })))
}

export async function clearAllProgress() {
  const db = await getDB()
  const keys = await db.getAllKeys(STORE)
  await db.clear(STORE)
  sync.track(keys.map(key => ({ key, value: null })))
}
