/**
 * Enregistre les phrases de l'app avec Google Cloud Text-to-Speech (voix Chirp 3 HD, src/data/voices.js) :
 *   public/audio/sentences/<voix>-<empreinte>.mp3 et src/data/sentenceAudio.json ({ phrase: [voix] }).
 * Phrases : exemples et exercices de grammaire, exemples des classificateurs, textes et dialogues de lecture
 * (chaque personnage avec sa voix). Les fichiers déjà là ne sont pas redemandés ; ceux qui ne servent plus sont
 * supprimés. Environ 3 500 caractères au total : bien en dessous du million gratuit chaque mois.
 * Clé : GOOGLE_TTS_KEY dans chinese/.env.local (jamais commitée).
 * Lancer : node scripts/fetch-sentence-audio.js
 */

import { Buffer } from 'buffer'
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { env, exit } from 'process'
import { fileURLToPath } from 'url'
import { GRAMMAR_POINTS } from '../src/data/grammar.js'
import { CLASSIFIER_GROUPS } from '../src/data/classifiers.js'
import { READINGS, lineText, lineVoice } from '../src/data/reading.js'
import { DEFAULT_VOICE, VOICES, sentenceFile } from '../src/data/voices.js'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = join(ROOT, 'public', 'audio', 'sentences')
const MANIFEST = join(ROOT, 'src', 'data', 'sentenceAudio.json')
const SPEAKING_RATE = 0.9 // un peu plus lent que la normale : pour des débutants

function apiKey() {
  const file = join(ROOT, '.env.local')
  const key = env.GOOGLE_TTS_KEY || (existsSync(file) && readFileSync(file, 'utf8').match(/^GOOGLE_TTS_KEY=(\S+)/m)?.[1])
  if (!key) throw new Error('GOOGLE_TTS_KEY manquante (chinese/.env.local)')
  return key
}

/** Toutes les phrases à enregistrer : Map phrase → Set de voix. */
function sentences() {
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
  return all
}

async function synthesize(key, text, voice) {
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
  if (!res.ok) throw new Error(`HTTP ${res.status} : ${body.error?.message} (${text})`)
  return Buffer.from(body.audioContent, 'base64')
}

async function main() {
  const key = apiKey()
  mkdirSync(OUT, { recursive: true })
  const wanted = sentences()
  const files = new Set()
  let created = 0
  let chars = 0
  for (const [text, voices] of wanted) {
    for (const voice of voices) {
      const file = sentenceFile(text, voice)
      files.add(file)
      if (existsSync(join(OUT, file))) continue
      writeFileSync(join(OUT, file), await synthesize(key, text, voice))
      created++
      chars += text.length
    }
  }
  const stale = readdirSync(OUT).filter(f => !files.has(f))
  for (const f of stale) rmSync(join(OUT, f))
  const manifest = Object.fromEntries([...wanted].map(([text, voices]) => [text, [...voices].sort()]))
  writeFileSync(MANIFEST, JSON.stringify(manifest), 'utf8')
  console.log(`  ✓ ${wanted.size} phrases, ${files.size} fichiers (${created} nouveaux, ${chars} caractères envoyés, ${stale.length} supprimés)`)
}

main().catch(err => { console.error(err.message); exit(1) })
