/**
 * Generates src/data/hsk1.json ... hsk9.json
 * Source: drkameleon/complete-hsk-vocabulary (CC-BY)
 * Run: node scripts/build-data.js
 */

import { writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { stripParens } from '../src/utils/validate.js'

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

const CJK = '[\\u3400-\\u9fff]'

// Meaning (upstream string, may hold several "; " senses) dropped whole: literary register.
const LITERARY = /\((literary|classical|poetic)\)/i

// Senses that are not something to learn, tested outside parentheses.
const NOT_A_DEFINITION = [
  /\bvariant of\b/i,                                // old / erhua / … variant of X
  new RegExp(`\\bused in ${CJK}`),                  // used in 自个儿
  /^abbr\.|\babbr\. (for|of)\b/i,                   // abbr. for 日本 (word-level abbreviations)
  /^(surname|family name) [A-Z]/, /^surname of\b/i, // surname Wang
  /^(also pr\.|also written|taiwan pr\.|see also\b|cl:)/i,
  new RegExp(`^see ${CJK}`),                        // see 节骨眼 (but not "see you")
]
// Same, tested on the raw sense.
const NOT_A_DEFINITION_RAW = [/\((?:[\w ]+ )?surname\)$/i, /^\((also|taiwan) pr\./i]

function cleanSenses(meanings) {
  return meanings
    .filter(m => !LITERARY.test(m))
    .flatMap(m => m.split(/;\s*/))
    .map(s => s.trim())
    .filter(s => s
      && !NOT_A_DEFINITION_RAW.some(re => re.test(s))
      && !NOT_A_DEFINITION.some(re => re.test(stripParens(s))))
}

// First reading with something left to learn; capitalised pinyin = proper noun (比 Bǐ = Belgium, 日 Rì = Japan),
// only used when the word has nothing else. Entries with the same pinyin are one reading (后 hòu: empress + behind).
function pickForm(entry) {
  const readings = new Map()
  for (const f of entry.forms || []) {
    const pinyin = (f.transcriptions?.pinyin || '').trim()
    const senses = cleanSenses(f.meanings || [])
    if (senses.length) readings.set(pinyin, [...(readings.get(pinyin) || []), ...senses])
  }
  const forms = [...readings].map(([pinyin, senses]) => ({ pinyin, senses: [...new Set(senses)] }))
  return forms.find(f => f.pinyin[0] === f.pinyin[0]?.toLowerCase()) || forms[0] || null
}

// Ids follow the upstream index (progress is keyed by id): dropping a word never renumbers the others.
function normalizeEntry(entry, level, index) {
  const form = pickForm(entry)
  return {
    id: padId(level, index),
    level,
    simplified: (entry.simplified || '').trim(),
    pinyin: form?.pinyin || '',
    senses: form?.senses || [],
  }
}

// A single character is not asked for a meaning its two-character form has (弟 → 弟弟, 箱 → 箱子, 画 → 画儿).
function dropTwoCharacterMeanings(words) {
  const key = s => stripParens(s).toLowerCase().replace(/\belder\b/g, 'older')
  const bySimplified = new Map(words.map(w => [w.simplified, w]))
  for (const w of words) {
    if ([...w.simplified].length !== 1) continue
    const longer = [w.simplified + w.simplified, w.simplified + '子', w.simplified + '儿']
      .map(s => bySimplified.get(s))
      .filter(Boolean)
    const taken = new Set(longer.flatMap(l => l.senses.map(key)))
    w.senses = w.senses.filter(s => !taken.has(key(s)))
  }
}

async function main() {
  console.log('Building HSK data files (exclusive per-level words)...\n')

  const levels = []
  for (let level = 1; level <= 7; level++) {
    const raw = await fetchLevel(level)
    levels.push({ level, words: raw.map((entry, i) => normalizeEntry(entry, level, i)) })
  }
  dropTwoCharacterMeanings(levels.flatMap(l => l.words))

  for (const { level, words: all } of levels) {
    const words = all
      .filter(w => w.simplified && w.senses.length > 0)
      .map(({ senses, ...w }) => ({ ...w, definition: senses.join('; ') }))
    writeFileSync(join(OUT_DIR, `hsk${level}.json`), JSON.stringify(words, null, 2), 'utf8')
    const sample = words[0]
    console.log(`  ✓ hsk${level}.json — ${words.length} mots | ex: ${sample.simplified} [${sample.pinyin}] = ${sample.definition.slice(0, 40)}`)
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
