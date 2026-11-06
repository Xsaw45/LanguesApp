/**
 * Copies the pronunciation recordings into public/audio/ and writes src/data/audio.json (what exists).
 * Source: hugolpz/audio-cmn (CC BY-SA : syllables by Chen Wang, HSK words by Yue Tan / Shtooka), 24 kbit/s set.
 *   - public/audio/syllables/<pinyin><tone>.mp3 : syllables (tones 1-4, ü written v : lv4.mp3) found in HSK words ;
 *     the recordings also cover combinations that do not exist in Chinese (rī, sén), left out
 *   - public/audio/words/<hanzi>.mp3            : HSK words of src/data/hsk*.json that have a recording
 * Run after build-data.js : node scripts/fetch-audio.js [existing audio-cmn checkout]
 */

import { execFileSync } from 'child_process'
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'fs'
import { tmpdir } from 'os'
import { dirname, join } from 'path'
import { argv } from 'process'
import { fileURLToPath } from 'url'
import { splitPinyin, toNumeric } from '../src/utils/pinyin.js'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = join(ROOT, 'public', 'audio')
const REPO = 'https://github.com/hugolpz/audio-cmn.git'
const SET = '24k-abr'

let source = argv[2]
let cleanup = null
if (!source) {
  source = mkdtempSync(join(tmpdir(), 'audio-cmn-'))
  cleanup = source
  console.log(`Sparse clone of ${REPO} (${SET}) into ${source}`)
  execFileSync('git', ['clone', '-q', '--depth', '1', '--filter=blob:none', '--sparse', REPO, source], { stdio: 'inherit' })
  execFileSync('git', ['-C', source, 'sparse-checkout', 'set', SET], { stdio: 'inherit' })
}

const recordings = dir => readdirSync(join(source, SET, dir))
  .filter(f => f.startsWith('cmn-') && f.endsWith('.mp3'))
  .map(f => ({ file: join(source, SET, dir, f), name: f.slice(4, -4) }))

rmSync(OUT, { recursive: true, force: true })
mkdirSync(join(OUT, 'syllables'), { recursive: true })
mkdirSync(join(OUT, 'words'), { recursive: true })

const hskWords = new Set()
const inHskWords = new Set() // "ma3"
for (let level = 1; level <= 9; level++) {
  const path = join(ROOT, 'src', 'data', `hsk${level}.json`)
  if (!existsSync(path)) continue
  for (const w of JSON.parse(readFileSync(path, 'utf8'))) {
    hskWords.add(w.simplified)
    for (const s of splitPinyin(w.pinyin)) inHskWords.add(toNumeric(s))
  }
}

// Nommés comme le pinyin écrit : après j, q, x, y le ü s'écrit u (la source a « jv4 » pour jù).
const syllables = recordings('syllabs')
  .map(r => ({ ...r, name: r.name.replace(/^([jqxy])v/, '$1u') }))
  .filter(r => inHskWords.has(r.name))
for (const r of syllables) copyFileSync(r.file, join(OUT, 'syllables', `${r.name}.mp3`))
const words = recordings('hsk').filter(r => hskWords.has(r.name))
for (const r of words) copyFileSync(r.file, join(OUT, 'words', `${r.name}.mp3`))

const manifest = {
  syllables: syllables.map(r => r.name).sort(),
  words: words.map(r => r.name).sort(),
}
writeFileSync(join(ROOT, 'src', 'data', 'audio.json'), JSON.stringify(manifest), 'utf8')
console.log(`  ✓ ${manifest.syllables.length} syllables, ${manifest.words.length}/${hskWords.size} HSK words`)

if (cleanup) rmSync(cleanup, { recursive: true, force: true })
