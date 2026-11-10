import manifest from '../data/audio.json'
import tts from '../data/ttsAudio.json'
import { DEFAULT_VOICE, ttsFile } from '../data/voices.js'
import { splitPinyin, toNumeric } from './pinyin.js'

// Enregistrements humains (scripts/fetch-audio.js) : syllabes aux tons 1-4, mots HSK enregistrés.
// Synthèse (scripts/fetch-tts-audio.js) : phrases (grammaire, classificateurs, lecture, une voix par personnage) et
// mots HSK de plusieurs caractères sans enregistrement humain.
const SYLLABLES = new Set(manifest.syllables)
const WORDS = new Set(manifest.words)
const BASE = `${import.meta.env.BASE_URL}audio/`

export const syllableSrc = numeric => (SYLLABLES.has(numeric) ? `${BASE}syllables/${numeric}.mp3` : null)
export const recordedWordSrc = hanzi => (WORDS.has(hanzi) ? `${BASE}words/${encodeURIComponent(hanzi)}.mp3` : null)

/** Texte synthétisé, dit par la voix demandée si elle l'a été, sinon par une autre ; null s'il n'existe pas. */
export function ttsSrc(text, voice = DEFAULT_VOICE) {
  const voices = tts[text]
  if (!voices) return null
  return `${BASE}tts/${ttsFile(text, voices.includes(voice) ? voice : voices[0])}`
}

/**
 * Son d'un mot HSK. Un caractère seul prend l'enregistrement de sa syllabe (même lecture que le pinyin affiché,
 * même pour les caractères à plusieurs lectures) ; sinon l'enregistrement humain du mot, sinon sa synthèse.
 * null : rien d'enregistré.
 */
export function wordSrc(word) {
  const syllables = splitPinyin(word.pinyin)
  if ([...word.simplified].length === 1 && syllables.length === 1) {
    const src = syllableSrc(toNumeric(syllables[0]))
    if (src) return src
  }
  return recordedWordSrc(word.simplified) || ttsSrc(word.simplified)
}

// Un seul élément <audio> pour toute l'app : une fois débloqué par un geste (iOS), il peut rejouer depuis le code
// (son joué automatiquement à l'affichage d'une question). Fichiers lus via fetch → blob : la réponse complète
// passe par le cache du service worker (hors ligne), sans les requêtes partielles des balises <audio>.
let element = null
const loading = new Map() // src → Promise<objectURL>
const ready = new Map() // src → objectURL

function audioElement() {
  if (!element) element = new Audio()
  return element
}

function load(src) {
  if (!loading.has(src)) {
    const promise = fetch(src)
      .then(res => {
        if (!res.ok) throw new Error(`audio ${res.status}`)
        return res.blob()
      })
      .then(blob => {
        const url = URL.createObjectURL(blob)
        ready.set(src, url)
        return url
      })
    promise.catch(() => loading.delete(src))
    loading.set(src, promise)
  }
  return loading.get(src)
}

export function preload(srcs) {
  for (const src of srcs) if (src) load(src).catch(() => {})
}

// WAV silencieux de 1 échantillon : le jouer pendant un geste débloque l'élément audio sur iOS.
const SILENCE = 'data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YQIAAAAAAA=='

/** À appeler dans un geste (clic) avant de jouer des sons automatiquement. */
export function unlockAudio() {
  const el = audioElement()
  if (el.dataset.unlocked) return
  el.dataset.unlocked = '1'
  el.src = SILENCE
  el.play().catch(() => {})
}

function start(url) {
  const el = audioElement()
  el.dataset.unlocked = '1'
  el.onended = null // un autre son arrête la lecture d'un dialogue en cours
  el.pause()
  el.src = url
  return el.play().catch(() => {})
}

/** Joue un enregistrement (immédiatement s'il est déjà chargé : reste dans le geste de l'utilisateur). */
export function play(src) {
  if (!src) return Promise.resolve()
  window.speechSynthesis?.cancel()
  if (ready.has(src)) return start(ready.get(src))
  return load(src).then(start, () => {})
}

/** Joue des enregistrements à la suite (un dialogue entier) ; un autre son l'interrompt. */
export function playAll(srcs) {
  const [first, ...rest] = srcs.filter(Boolean)
  if (!first) return
  preload(rest)
  play(first).then(() => {
    const el = audioElement()
    if (rest.length && el.src === ready.get(first)) el.onended = () => playAll(rest)
  })
}

// Mots sans enregistrement : synthèse vocale du téléphone, seulement s'il a une voix chinoise.
export function chineseVoice() {
  return window.speechSynthesis?.getVoices().find(v => /^zh[-_]CN/i.test(v.lang))
    || window.speechSynthesis?.getVoices().find(v => /^zh/i.test(v.lang))
    || null
}

/** Lit un texte avec la voix chinoise du téléphone, ou une liste de textes à la suite (un dialogue entier). */
export function speak(text) {
  const voice = chineseVoice()
  if (!voice) return
  audioElement().pause()
  window.speechSynthesis.cancel()
  for (const part of [].concat(text)) {
    const utterance = new SpeechSynthesisUtterance(part)
    utterance.voice = voice
    utterance.lang = voice.lang
    utterance.rate = 0.8
    window.speechSynthesis.speak(utterance)
  }
}
