// Caractères du programme HSK 3.0 (scripts/build-hanzi.js) : 300 par niveau du HSK 1 au 6, 1 200 pour le HSK 7-9.
// Chaque caractère : { c, level (7 = HSK 7-9), pinyin, strokes, radical (numéro Kangxi), simplifiedRadical, senses }.
// Tracés pour Hanzi Writer : public/hanzi/<c>.json, chargés à la demande (gardés hors ligne une fois vus).

import data from './hanzi.json'
import { HSK_DATA } from './index.js'
import { HANZI_AUDIO_CONTEXTS } from './hanziAudio.js'
import { RADICALS, radicalForms } from './radicals.js'
import { syllableSrc, ttsSrc } from '../utils/audio.js'
import { splitPinyin, toNumeric } from '../utils/pinyin.js'

export const HANZI = data
export const HANZI_LEVELS = [1, 2, 3, 4, 5, 6, 7]
export const hanziLevelLabel = level => (level === 7 ? 'HSK 7–9' : `HSK ${level}`)

const BY_CHAR = new Map(HANZI.map(ch => [ch.c, ch]))
export const getChar = c => BY_CHAR.get(c) || null
export const charsForLevel = level => HANZI.filter(ch => ch.level === level)

export const hanziKey = ch => `hz_${ch.c}`
export const strokeDataUrl = c => `${import.meta.env.BASE_URL}hanzi/${encodeURIComponent(c)}.json`

/** Sens du caractère dans la langue de l'utilisateur, en anglais quand le dictionnaire n'en a pas. */
export const charSenses = (ch, lang) => ch.senses[lang] || ch.senses.en

/** Son du caractère : mot de contexte pour un ton neutre ou une syllabe absente, sinon enregistrement humain. */
export const charAudioContext = ch => HANZI_AUDIO_CONTEXTS[ch.c] || null

export function charSrc(ch) {
  const context = charAudioContext(ch)
  if (context) return ttsSrc(context.text)
  const syllables = splitPinyin(ch.pinyin)
  return syllables.length === 1 ? syllableSrc(toNumeric(syllables[0])) : null
}

/** Clé du caractère : formes telles qu'il les utilise (红 → 纟 糸, 河 → 水 氵) et sens. */
export function charRadical(ch) {
  const r = RADICALS.get(ch.radical)
  return { n: ch.radical, forms: radicalForms(ch.radical, ch.simplifiedRadical), meaning: r.meaning }
}

/** Mots HSK qui contiennent le caractère (pas le caractère seul), les plus simples d'abord. */
export function wordsWithChar(ch, limit = 6) {
  const found = []
  for (const level of Object.keys(HSK_DATA)) {
    for (const w of HSK_DATA[level]) if (w.simplified !== ch.c && w.simplified.includes(ch.c)) found.push(w)
  }
  return found.sort((a, b) => a.level - b.level || a.simplified.length - b.simplified.length).slice(0, limit)
}

/** Caractères des niveaux HSK 1 à 6 par clé, dans l'ordre des listes : Map numéro → caractères. */
export const CHARS_BY_RADICAL = HANZI.filter(ch => ch.level <= 6).reduce((map, ch) => {
  if (!map.has(ch.radical)) map.set(ch.radical, [])
  map.get(ch.radical).push(ch)
  return map
}, new Map())
