/**
 * Module Caractères : écrit src/data/hanzi.json et copie les tracés dans public/hanzi/.
 *   src/data/hanzi.json : [{ c, level, pinyin, strokes, radical, simplifiedRadical, senses: { en, fr? } }], un par
 *   caractère, dans l'ordre des listes officielles (HSK 7-9 → level 7)
 *   public/hanzi/<c>.json : tracés et ordre des traits pour Hanzi Writer (+ LICENSE-ARPHIC.txt)
 * Sources :
 *   - caractères par niveau : krmanik/HSK-3.0, « HSK Hanzi » (CC BY-SA 4.0, d'après le programme HSK 3.0)
 *   - tracés : hanzi-writer-data (Make Me a Hanzi, Arphic Public License), dépendance de développement
 *   - clé : Unihan (kRSUnicode, licence Unicode)
 *   - sens : CC-CEDICT (anglais, CC BY-SA 4.0) et CFDICT (français, CC BY-SA 3.0), entrées du caractère seul
 *   - lecture : celle du mot HSK quand le caractère en est un (src/data/hsk*.json), sinon CC-CEDICT puis Unihan
 * Lancer après build-data.js : node scripts/build-hanzi.js
 */

import { Buffer } from 'buffer'
import { execFileSync } from 'child_process'
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'fs'
import { tmpdir } from 'os'
import { dirname, join } from 'path'
import { exit } from 'process'
import { fileURLToPath } from 'url'
import { gunzipSync } from 'zlib'
import { splitPinyin, toNumeric, withTone } from '../src/utils/pinyin.js'

/** "ri4" → "rì", "le5" → "le" */
const fromNumeric = numeric => withTone(numeric.replace(/\d$/, ''), Number(numeric.match(/[1-4]$/)?.[0] || 0))

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const STROKES = join(ROOT, 'node_modules', 'hanzi-writer-data')
const OUT = join(ROOT, 'public', 'hanzi')

const LISTS = 'https://raw.githubusercontent.com/krmanik/HSK-3.0/main/New%20HSK%20(2021)/HSK%20Hanzi'
const LIST_FILES = { 1: 'HSK%201', 2: 'HSK%202', 3: 'HSK%203', 4: 'HSK%204', 5: 'HSK%205', 6: 'HSK%206', 7: 'HSK%207-9' }
const UNIHAN = 'https://www.unicode.org/Public/UCD/latest/ucd/Unihan.zip'
const CEDICT = 'https://www.mdbg.net/chinese/export/cedict/cedict_1_0_ts_utf-8_mdbg.txt.gz'
const CFDICT = 'https://chine.in/assets/cfdict/cfdict.u8'

async function fetchBytes(url) {
  console.log(`Fetching ${url}`)
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`)
  return Buffer.from(await res.arrayBuffer())
}

/** Unihan.zip → { caractère: { kRSUnicode: "85.5" | "120'.3" (' = forme simplifiée de la clé), kMandarin: "me" } } */
async function loadUnihan() {
  const dir = mkdtempSync(join(tmpdir(), 'unihan-'))
  try {
    const zip = join(dir, 'Unihan.zip')
    writeFileSync(zip, await fetchBytes(UNIHAN))
    const files = ['Unihan_IRGSources.txt', 'Unihan_Readings.txt']
    try {
      execFileSync('unzip', ['-o', '-q', zip, ...files, '-d', dir])
    } catch {
      execFileSync('tar', ['-xf', zip, '-C', dir, ...files]) // Windows (bsdtar lit les zip)
    }
    const data = {}
    for (const file of files) {
      for (const line of readFileSync(join(dir, file), 'utf8').split('\n')) {
        const m = line.match(/^U\+([0-9A-F]+)\t(kRSUnicode|kMandarin)\t(\S+)/)
        if (m) (data[String.fromCodePoint(parseInt(m[1], 16))] ||= {})[m[2]] = m[3]
      }
    }
    return data
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
}

// Sens à apprendre en priorité : ni nom de famille, ni renvoi (« used in 咖啡 »), ni variante, ni abréviation.
const SECONDARY = [/surname/i, /\bused in\b/i, /^see\b/i, /^abbr\./i, /^\(Tw\)/, /nom de famille/i, /\(argot\)/i,
  /\(arch\.\)/i, /\(abr\.\)/i, /^voir\b/i, /^[\u3400-\u9fff]+$/]
// Jamais affichés.
const NEVER = [/radical/i, /variant/i, /\bvariante\b/i, /\(vulgar\)/i, /^CL:/, /\[/]

const HANZI = '[\\u3400-\\u9fff\\u{20000}-\\u{3134f}]+'
/** "you (courteous, as opposed to informal 你[ni3])" → "… 你)" ; "這麼|这么[zhe4 me5]" → "这么" ; "(CL:條|条[tiao2])" ôté */
const cleanSense = s => s
  .replace(/\s*\(CL:[^)]*\)/g, '')
  .replace(new RegExp(`${HANZI}\\|(${HANZI})\\[[^\\]]*\\]`, 'gu'), '$1')
  .replace(new RegExp(`(${HANZI})\\[[^\\]]*\\]`, 'gu'), '$1')
  .replace(/^\(bound form\)\s*/, '')
  .trim()

/** Fichier au format CEDICT → Map caractère → [{ numeric, proper, senses }] */
function parseDictionary(text) {
  const entries = new Map()
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^\S+ (\S+) \[([^\]]+)\] \/(.*)\/\s*$/)
    if (!m || [...m[1]].length !== 1) continue
    const senses = m[3].split('/').map(cleanSense).filter(s => s && !NEVER.some(re => re.test(s)))
    const list = entries.get(m[1]) || []
    list.push({ numeric: m[2].toLowerCase().replace(/u:/g, 'v'), proper: /^[A-Z]/.test(m[2]), senses })
    entries.set(m[1], list)
  }
  return entries
}

// Ordre de préférence : sens courants, puis renvois et abréviations (咖 → used in 咖啡), puis noms propres (沪, 宋).
const TIERS = [
  e => (e.proper ? [] : e.senses.filter(s => !SECONDARY.some(re => re.test(s)))),
  e => (e.proper ? [] : e.senses),
  e => e.senses,
]

const sameReading = (numeric, reading) => numeric === reading || (numeric === `${reading}5` && !/\d$/.test(reading))

/** Lecture du caractère quand il n'est pas un mot HSK : la première qui a des sens, au meilleur niveau. */
function defaultReading(entries = []) {
  for (const tier of TIERS) {
    const entry = entries.find(e => tier(e).length)
    if (entry) return entry.numeric
  }
  return null
}

/**
 * Sens du caractère pour sa lecture (ton neutre « le » = « le5 »), au meilleur niveau disponible ; 5 au plus.
 * Lecture absente du dictionnaire : sens de sa lecture par défaut.
 */
function sensesFor(entries = [], reading) {
  const matching = entries.filter(e => sameReading(e.numeric, reading))
  const same = matching.length ? matching : entries.filter(e => e.numeric === defaultReading(entries))
  for (const tier of TIERS) {
    const senses = [...new Set(same.flatMap(tier))]
    if (senses.length) return senses.slice(0, 5)
  }
  return []
}

async function main() {
  console.log('Building character data (HSK 3.0 hanzi lists)...\n')
  const unihan = await loadUnihan()
  const cedict = parseDictionary(gunzipSync(await fetchBytes(CEDICT)).toString('utf8'))
  const cfdict = parseDictionary((await fetchBytes(CFDICT)).toString('utf8'))

  // Un caractère qui est aussi un mot du vocabulaire se lit comme ce mot (的 de, 了 le, 着 zhe).
  const words = new Map()
  for (let level = 1; level <= 9; level++) {
    const path = join(ROOT, 'src', 'data', `hsk${level}.json`)
    if (!existsSync(path)) continue
    for (const w of JSON.parse(readFileSync(path, 'utf8'))) if ([...w.simplified].length === 1 && !words.has(w.simplified)) words.set(w.simplified, w)
  }

  rmSync(OUT, { recursive: true, force: true })
  mkdirSync(OUT, { recursive: true })
  copyFileSync(join(STROKES, 'ARPHICPL.TXT'), join(OUT, 'LICENSE-ARPHIC.txt'))

  const seen = new Set()
  const chars = []
  for (const [level, file] of Object.entries(LIST_FILES)) {
    const list = (await fetchBytes(`${LISTS}/${file}.txt`)).toString('utf8').replace(/^\uFEFF/, '').split(/\r?\n/).map(s => s.trim()).filter(Boolean)
    for (const c of list) {
      if (seen.has(c)) continue
      seen.add(c)
      const strokeFile = join(STROKES, `${c}.json`)
      const word = words.get(c)
      const u = unihan[c] || {}
      // Pas un mot HSK : lecture la plus courante selon Unihan (么 me, pas má), si le dictionnaire la connaît.
      const common = u.kMandarin && toNumeric(u.kMandarin)
      const reading = word
        ? toNumeric(splitPinyin(word.pinyin)[0])
        : (cedict.get(c) || []).some(e => sameReading(e.numeric, common)) ? common : defaultReading(cedict.get(c))
      const en = sensesFor(cedict.get(c), reading || '')
      const fr = sensesFor(cfdict.get(c), reading || '')
      if (!existsSync(strokeFile) || !u.kRSUnicode || !reading || !en.length) {
        console.warn(`  ! ${c} : pas de tracé, de clé, de lecture ou de sens, ignoré`)
        continue
      }
      copyFileSync(strokeFile, join(OUT, `${c}.json`))
      const [, radical, apostrophe] = u.kRSUnicode.match(/^(\d+)('?)/)
      chars.push({
        c,
        level: Number(level),
        pinyin: word?.pinyin || fromNumeric(reading),
        strokes: JSON.parse(readFileSync(strokeFile, 'utf8')).strokes.length,
        radical: Number(radical),
        simplifiedRadical: !!apostrophe,
        senses: fr.length ? { en, fr } : { en },
      })
    }
  }

  writeFileSync(join(ROOT, 'src', 'data', 'hanzi.json'), `[\n${chars.map(c => JSON.stringify(c)).join(',\n')}\n]\n`, 'utf8')
  const byLevel = chars.reduce((m, c) => ({ ...m, [c.level]: (m[c.level] || 0) + 1 }), {})
  console.log(`\n  ✓ ${chars.length} caractères`, byLevel, `, ${chars.filter(c => c.senses.fr).length} avec un sens français`)
}

main().catch(err => { console.error(err); exit(1) })
