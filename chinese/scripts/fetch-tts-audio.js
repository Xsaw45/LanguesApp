/**
 * Enregistre avec Google Cloud Text-to-Speech (voix Chirp 3 HD, src/data/voices.js) ce qui n'a pas d'enregistrement
 * humain : public/audio/tts/<voix>-<empreinte>.mp3 et src/data/ttsAudio.json ({ texte: [voix] }).
 *   - phrases : exemples et exercices de grammaire, exemples des classificateurs, textes et dialogues de lecture
 *     (chaque personnage avec sa voix) ;
 *   - mots HSK de plusieurs caractères absents de hugolpz/audio-cmn (src/data/audio.json, lancer fetch-audio.js
 *     avant). Un caractère seul garde l'enregistrement de sa syllabe : la synthèse d'un caractère isolé choisit mal
 *     entre ses lectures (了 le / liǎo).
 * Les fichiers déjà là ne sont pas redemandés ; ceux qui ne servent plus sont supprimés. Environ 12 500 caractères
 * au total : bien en dessous du million gratuit chaque mois.
 * Clé : GOOGLE_TTS_KEY dans chinese/.env.local (jamais commitée).
 * Lancer : node scripts/fetch-tts-audio.js
 */

import { Buffer } from 'buffer'
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { env, exit } from 'process'
import { setTimeout as sleep } from 'timers/promises'
import { fileURLToPath } from 'url'
import { GRAMMAR_POINTS } from '../src/data/grammar.js'
import { CLASSIFIER_GROUPS } from '../src/data/classifiers.js'
import { READINGS, lineText, lineVoice } from '../src/data/reading.js'
import { DEFAULT_VOICE, VOICES, ttsFile } from '../src/data/voices.js'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = join(ROOT, 'public', 'audio', 'tts')
const MANIFEST = join(ROOT, 'src', 'data', 'ttsAudio.json')
const SPEAKING_RATE = 0.9 // un peu plus lent que la normale : pour des débutants
const PARALLEL = 6

function apiKey() {
  const file = join(ROOT, '.env.local')
  const key = env.GOOGLE_TTS_KEY || (existsSync(file) && readFileSync(file, 'utf8').match(/^GOOGLE_TTS_KEY=(\S+)/m)?.[1])
  if (!key) throw new Error('GOOGLE_TTS_KEY manquante (chinese/.env.local)')
  return key
}

/** Tout ce qui est à enregistrer : Map texte → Set de voix. */
function texts() {
  const all = new Map()
  const add = (text, voice = DEFAULT_VOICE) => {
    if (!all.has(text)) all.set(text, new Set())
    all.get(text).add(voice)
  }
  for (const p of GRAMMAR_POINTS) {
    for (const ex of p.examples) add(ex.zh)
    for (const o of p.order) add(o.words.join(''))
    for (const f of p.fill) add(f.before + f.answer + f.after)
    for (const j of p.judge) add(j.ok ? j.zh : j.fix)
    for (const t of p.translate) add(t.answer)
  }
  for (const group of CLASSIFIER_GROUPS) for (const cl of group.items) for (const ex of cl.examples) add(ex.zh)
  for (const reading of READINGS) for (const line of reading.lines) add(lineText(line), lineVoice(reading, line))
  const recorded = new Set(JSON.parse(readFileSync(join(ROOT, 'src', 'data', 'audio.json'), 'utf8')).words)
  for (let level = 1; level <= 9; level++) {
    const path = join(ROOT, 'src', 'data', `hsk${level}.json`)
    if (!existsSync(path)) continue
    for (const w of JSON.parse(readFileSync(path, 'utf8'))) {
      if ([...w.simplified].length > 1 && !recorded.has(w.simplified)) add(w.simplified)
    }
  }
  return all
}

async function synthesize(key, text, voice, attempt = 0) {
  const res = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${key}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      input: { text },
      voice: { languageCode: 'cmn-CN', name: VOICES[voice] },
      audioConfig: { audioEncoding: 'MP3', speakingRate: SPEAKING_RATE },
    }),
  })
  const body = await res.json()
  if ((res.status === 429 || res.status >= 500) && attempt < 5) {
    await sleep(2000 * 2 ** attempt) // quota par minute ou erreur passagère : on réessaie plus tard
    return synthesize(key, text, voice, attempt + 1)
  }
  if (!res.ok) throw new Error(`HTTP ${res.status} : ${body.error?.message} (${text})`)
  return Buffer.from(body.audioContent, 'base64')
}

async function main() {
  const key = apiKey()
  mkdirSync(OUT, { recursive: true })
  const wanted = texts()
  const jobs = [...wanted].flatMap(([text, voices]) => [...voices].map(voice => ({ text, voice, file: ttsFile(text, voice) })))
  const todo = jobs.filter(job => !existsSync(join(OUT, job.file)))
  let done = 0
  // PARALLEL requêtes à la fois ; le manifeste n'est écrit qu'à la fin, quand tous les fichiers existent.
  const worker = async () => {
    for (let job = todo.shift(); job; job = todo.shift()) {
      writeFileSync(join(OUT, job.file), await synthesize(key, job.text, job.voice))
      if (++done % 250 === 0) console.log(`  … ${done}`)
    }
  }
  const created = todo.length
  const chars = todo.reduce((n, job) => n + job.text.length, 0)
  await Promise.all(Array.from({ length: PARALLEL }, worker))
  const files = new Set(jobs.map(job => job.file))
  const stale = readdirSync(OUT).filter(f => !files.has(f))
  for (const f of stale) rmSync(join(OUT, f))
  const manifest = Object.fromEntries([...wanted].map(([text, voices]) => [text, [...voices].sort()]))
  writeFileSync(MANIFEST, JSON.stringify(manifest), 'utf8')
  console.log(`  ✓ ${wanted.size} textes, ${files.size} fichiers (${created} nouveaux, ${chars} caractères envoyés, ${stale.length} supprimés)`)
}

main().catch(err => { console.error(err.message); exit(1) })
