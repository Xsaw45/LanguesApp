// Copie coherente de la base pour les sauvegardes : node server/snapshot.js <destination.db>
import { openDb } from './db.js'

const dest = process.argv[2]
if (!dest || !process.env.DB_PATH) {
  console.error('Usage : DB_PATH=... node server/snapshot.js <destination.db>')
  process.exit(2)
}
const db = openDb(process.env.DB_PATH)
db.snapshot(dest)
db.close()
