import { openDB } from 'idb'

const DB_NAME = 'hsk-vocab'
const DB_VERSION = 1

let dbPromise = null

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('wordProgress')) {
          const store = db.createObjectStore('wordProgress', { keyPath: 'wordId' })
          store.createIndex('level', 'level')
          store.createIndex('nextReview', 'nextReview')
        }
      },
    })
  }
  return dbPromise
}

export async function getWordProgress(wordId) {
  const db = await getDB()
  return db.get('wordProgress', wordId)
}

export async function getAllProgress() {
  const db = await getDB()
  return db.getAll('wordProgress')
}

export async function getProgressForLevel(level) {
  const db = await getDB()
  return db.getAllFromIndex('wordProgress', 'level', level)
}

export async function saveWordProgress(progress) {
  const db = await getDB()
  return db.put('wordProgress', progress)
}

export async function saveManyProgress(progressList) {
  const db = await getDB()
  const tx = db.transaction('wordProgress', 'readwrite')
  await Promise.all([
    ...progressList.map(p => tx.store.put(p)),
    tx.done,
  ])
}

export async function clearAllProgress() {
  const db = await getDB()
  return db.clear('wordProgress')
}
