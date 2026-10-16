/**
 * Generates src/data/hsk1.json ... hsk9.json
 * Source: drkameleon/complete-hsk-vocabulary (CC-BY)
 * Run: node scripts/build-data.js
 */

import { writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_DIR = join(__dirname, '..', 'src', 'data')

mkdirSync(OUT_DIR, { recursive: true })

// "exclusive" = only words new at this level (not cumulative)
const BASE = 'https://raw.githubusercontent.com/drkameleon/complete-hsk-vocabulary/main/wordlists/exclusive/new'

function padId(level, index) {
  return `hsk${level}_${String(index + 1).padStart(4, '0')}`
}

async function fetchLevel(level) {
  const url = `${BASE}/${level}.json`
  console.log(`Fetching level ${level}: ${url}`)
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`)
  return res.json()
}

function normalizeEntry(raw, level, index) {
  // Format: { simplified, forms: [{ transcriptions: { pinyin }, meanings: [...] }] }
  const simplified = (raw.simplified || '').trim()
  const form = raw.forms && raw.forms[0]
  const pinyin = form ? (form.transcriptions?.pinyin || '') : ''
  const meanings = form ? (form.meanings || []) : []
  const definition = meanings.join('; ')

  return {
    id: padId(level, index),
    level,
    simplified,
    pinyin: pinyin.trim(),
    definition: definition.trim(),
  }
}

function isSurname(word) {
  if (!word.definition) return false
  const parts = word.definition.split(/[;|]/).map(s => s.trim().toLowerCase())
  return parts.every(p => p.startsWith('surname') || p.startsWith('family name'))
}

async function main() {
  console.log('Building HSK data files (exclusive per-level words)...\n')

  for (let level = 1; level <= 7; level++) {
    try {
      const raw = await fetchLevel(level)
      const words = raw.map((entry, i) => normalizeEntry(entry, level, i))
        .filter(w => w.simplified && !isSurname(w))
      const outPath = join(OUT_DIR, `hsk${level}.json`)
      writeFileSync(outPath, JSON.stringify(words, null, 2), 'utf8')
      const sample = words[0]
      console.log(`  ✓ hsk${level}.json — ${words.length} mots | ex: ${sample.simplified} [${sample.pinyin}] = ${sample.definition.slice(0, 40)}`)
    } catch (err) {
      console.error(`  ✗ Level ${level}: ${err.message}`)
    }
  }

  // Levels 8-9: not in source; generate meaningful placeholders
  for (const level of [8, 9]) {
    const words = []
    writeFileSync(join(OUT_DIR, `hsk${level}.json`), JSON.stringify(words, null, 2), 'utf8')
    console.log(`  ~ hsk${level}.json — vide (niveau avancé, données non disponibles)`)
  }

  console.log('\nDone.')
}

main().catch(err => { console.error(err); process.exit(1) })
