/**
 * Generates src/data/hsk1.json ... hsk9.json : one word per line,
 *   { id, level, simplified, pinyin, senses: { en: [...], fr?: [...] } }   (fr absent : no French definition)
 * Sources :
 *   - words, readings, English senses : drkameleon/complete-hsk-vocabulary (MIT ; senses from CC-CEDICT, CC BY-SA 4.0)
 *   - reading used by the HSK for words with several : krmanik/HSK-3.0 "correct pinyin" (CC BY-SA 4.0, from Pleco)
 *   - French senses : CFDICT (CC BY-SA 3.0, https://chine.in/mandarin/dictionnaire/CFDICT/)
 * Run: node scripts/build-data.js
 */

import { writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { exit } from 'process'
import { fileURLToPath } from 'url'
import { stripParens } from '../src/utils/validate.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_DIR = join(__dirname, '..', 'src', 'data')

mkdirSync(OUT_DIR, { recursive: true })

// "exclusive" = only words new at this level (not cumulative)
const BASE = 'https://raw.githubusercontent.com/drkameleon/complete-hsk-vocabulary/main/wordlists/exclusive/new'
const OFFICIAL = 'https://raw.githubusercontent.com/krmanik/HSK-3.0/main/Scripts%20and%20data/correct%20pinyin'
const OFFICIAL_FILES = { 1: 'HSK1', 2: 'HSK2', 3: 'HSK3', 4: 'HSK4', 5: 'HSK5', 6: 'HSK6', 7: 'HSK7-9' }
const CFDICT = 'https://chine.in/assets/cfdict/cfdict.u8'

function padId(level, index) {
  return `hsk${level}_${String(index + 1).padStart(4, '0')}`
}

async function fetchText(url) {
  console.log(`Fetching ${url}`)
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`)
  return res.text()
}

// --- Readings ---

/** "ai4hao4", "bu4 yi1hui3r5", "ma5", "lu:4" → [{ base: 'ai', tone: 4 }, …] (no number = neutral tone 5) */
function syllables(numeric) {
  return (numeric.toLowerCase().replace(/u:|ü/g, 'v').match(/[a-z]+[1-5]?/g) || [])
    .map(s => ({ base: s.replace(/[1-5]$/, ''), tone: Number(s.match(/[1-5]$/)?.[0] || 5) }))
}

/** How well two readings match : -1 different syllables or tones, otherwise +2 per equal tone, +1 per neutral tone */
function readingScore(a, b) {
  const x = syllables(a)
  const y = syllables(b)
  if (!x.length || x.length !== y.length) return -1
  let score = 0
  for (let i = 0; i < x.length; i++) {
    if (x[i].base !== y[i].base) return -1
    if (x[i].tone === y[i].tone) score += 2
    else if (x[i].tone === 5 || y[i].tone === 5) score += 1
    else return -1
  }
  return score
}

// --- English senses (CC-CEDICT, via drkameleon) ---

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

/**
 * Reading to teach. Entries with the same pinyin are one reading (后 hòu: empress + behind). With the HSK reading
 * (official), the closest one (说 shuō, not shuì) ; otherwise the first lowercase one with something left to learn
 * (capitalised pinyin = proper noun : 比 Bǐ = Belgium, 日 Rì = Japan).
 */
function pickForm(entry, official) {
  const readings = new Map()
  for (const f of entry.forms || []) {
    const pinyin = (f.transcriptions?.pinyin || '').trim()
    const senses = cleanSenses(f.meanings || [])
    if (!senses.length) continue
    const reading = readings.get(pinyin) || { pinyin, numeric: f.transcriptions?.numeric || '', senses: [] }
    reading.senses.push(...senses)
    readings.set(pinyin, reading)
  }
  const forms = [...readings.values()].map(r => ({ ...r, senses: [...new Set(r.senses)] }))
  const lower = f => f.pinyin[0] === f.pinyin[0]?.toLowerCase()
  if (official) {
    const ranked = forms
      .map(f => ({ f, score: readingScore(f.numeric, official) }))
      .filter(x => x.score >= 0)
      .sort((a, b) => b.score - a.score || lower(b.f) - lower(a.f))
    if (ranked.length) return ranked[0].f
  }
  return forms.find(lower) || forms[0] || null
}

// --- French senses (CFDICT) ---

// Senses not to learn : surnames, slang, archaic meanings, abbreviations, radical numbers, cross-references, variants.
const FR_NOT_A_DEFINITION = [
  /\(nom de famille/i, /\(argot\)/i, /\(arch\.\)/i, /\(abr\.\)/i, /\bvariante\b/i, /\bradical\b/i,
  new RegExp(`^voir ${CJK}`), new RegExp(`^(\\(\\w+\\.?\\) )?${CJK}`),
]

/** CFDICT .u8 → Map simplified → [{ numeric, proper, senses }] */
function parseCfdict(text) {
  const entries = new Map()
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^\S+ (\S+) \[([^\]]+)\] \/(.*)\/\s*$/)
    if (!m) continue
    const [, simplified, numeric, senses] = m
    const list = entries.get(simplified) || []
    list.push({ numeric, proper: /^[A-Z]/.test(numeric), senses: senses.split('/').map(s => s.trim()).filter(Boolean) })
    entries.set(simplified, list)
  }
  return entries
}

/** French senses of the reading being taught : best matching CFDICT entries, proper nouns excluded. */
function frenchSenses(cfdict, simplified, numeric) {
  const ranked = (cfdict.get(simplified) || [])
    .filter(e => !e.proper)
    .map(e => ({ e, score: readingScore(e.numeric, numeric) }))
    .filter(x => x.score >= 0)
  const best = Math.max(-1, ...ranked.map(x => x.score))
  const senses = ranked.filter(x => x.score === best).flatMap(x => x.e.senses)
  return [...new Set(senses.filter(s => !FR_NOT_A_DEFINITION.some(re => re.test(s))))]
}

// Ids follow the upstream index (progress is keyed by id): dropping a word never renumbers the others.
function normalizeEntry(entry, level, index, official, cfdict) {
  const simplified = (entry.simplified || '').trim()
  const form = pickForm(entry, official.get(simplified))
  return {
    id: padId(level, index),
    level,
    simplified,
    pinyin: form?.pinyin || '',
    en: form?.senses || [],
    fr: form ? frenchSenses(cfdict, simplified, form.numeric) : [],
  }
}

// A single character is not asked for a meaning its two-character form has (弟 → 弟弟, 箱 → 箱子, 画 → 画儿).
function dropTwoCharacterMeanings(words, lang) {
  const key = s => stripParens(s).toLowerCase().replace(/\belder\b/g, 'older')
  const bySimplified = new Map(words.map(w => [w.simplified, w]))
  for (const w of words) {
    if ([...w.simplified].length !== 1) continue
    const longer = [w.simplified + w.simplified, w.simplified + '子', w.simplified + '儿']
      .map(s => bySimplified.get(s))
      .filter(Boolean)
    const taken = new Set(longer.flatMap(l => l[lang].map(key)))
    w[lang] = w[lang].filter(s => !taken.has(key(s)))
  }
}

async function main() {
  console.log('Building HSK data files (exclusive per-level words)...\n')

  const cfdict = parseCfdict(await fetchText(CFDICT))
  const levels = []
  for (let level = 1; level <= 7; level++) {
    const raw = JSON.parse(await fetchText(`${BASE}/${level}.json`))
    const official = new Map(
      (await fetchText(`${OFFICIAL}/${OFFICIAL_FILES[level]}.txt`))
        .replace(/^\uFEFF/, '')
        .split(/\r?\n/)
        .map(line => line.split('\t'))
        .filter(cols => cols.length >= 3)
        .map(([simplified, , numeric]) => [simplified.trim(), numeric.trim()]),
    )
    levels.push({ level, words: raw.map((entry, i) => normalizeEntry(entry, level, i, official, cfdict)) })
  }
  const all = levels.flatMap(l => l.words)
  dropTwoCharacterMeanings(all, 'en')
  dropTwoCharacterMeanings(all, 'fr')

  for (const { level, words: list } of levels) {
    const words = list
      .filter(w => w.simplified && w.en.length > 0)
      .map(({ en, fr, ...w }) => ({ ...w, senses: fr.length ? { en, fr } : { en } }))
    writeFileSync(join(OUT_DIR, `hsk${level}.json`), `[\n${words.map(w => JSON.stringify(w)).join(',\n')}\n]\n`, 'utf8')
    const withFr = words.filter(w => w.senses.fr).length
    console.log(`  ✓ hsk${level}.json — ${words.length} mots, ${withFr} avec définition française`)
  }

  // Levels 8-9: not in source
  for (const level of [8, 9]) {
    writeFileSync(join(OUT_DIR, `hsk${level}.json`), '[]\n', 'utf8')
    console.log(`  ~ hsk${level}.json — vide (niveau avancé, données non disponibles)`)
  }

  console.log('\nDone.')
}

main().catch(err => { console.error(err); exit(1) })
