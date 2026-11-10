import { ALL_LEVELS, getWordsForLevel, wordSenses } from '../data/index.js'

export const SEARCH_LIMIT = 60

/** Sans accents ni tons ni espaces, en minuscules : « Nǐ hǎo » → « nihao », « ni3 hao3 » → « nihao », lü → lu. */
const fold = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
const foldPinyin = s => fold(s).replace(/[\s'’·\-0-5]/g, '').replaceAll('v', 'u')
const hasHanzi = s => /[\u3400-\u9fff]/.test(s)

const index = new Map() // lang → [{ word, pinyin, senses }]
function entries(lang) {
  if (!index.has(lang)) {
    index.set(lang, ALL_LEVELS.flatMap(getWordsForLevel).map(word => ({
      word,
      pinyin: foldPinyin(word.pinyin),
      senses: wordSenses(word, lang).map(fold),
    })))
  }
  return index.get(lang)
}

/** Score d'une correspondance : 0 exacte, 1 au début, 2 ailleurs ; null : pas de correspondance. */
function rank(text, query) {
  if (text === query) return 0
  if (text.startsWith(query)) return 1
  return text.includes(query) ? 2 : null
}

/**
 * Mots HSK de tous les niveaux qui correspondent : caractères (dans le mot), pinyin avec ou sans tons, ou sens dans
 * la langue de l'utilisateur (un mot du sens qui commence par la recherche passe avant). Les plus proches d'abord,
 * puis les niveaux les plus bas ; SEARCH_LIMIT au plus.
 */
export function searchWords(query, lang) {
  const q = query.trim()
  if (!q) return []
  const found = []
  if (hasHanzi(q)) {
    for (const e of entries(lang)) {
      const r = rank(e.word.simplified, q)
      if (r !== null) found.push({ word: e.word, r })
    }
  } else {
    const pinyin = foldPinyin(q)
    const meaning = fold(q)
    const startsWord = new RegExp(`(^|[^a-z])${meaning.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`)
    for (const e of entries(lang)) {
      let r = pinyin ? rank(e.pinyin, pinyin) : null
      for (const s of e.senses) {
        const m = s === meaning || s.replace(/^(to|se|s'|l'|le|la|les|un|une|a|an|the) /, '') === meaning ? 0
          : startsWord.test(s) ? 1 : s.includes(meaning) ? 3 : null
        if (m !== null && (r === null || m < r)) r = m
      }
      if (r !== null) found.push({ word: e.word, r })
    }
  }
  return found
    .sort((a, b) => a.r - b.r || a.word.level - b.word.level || a.word.simplified.length - b.word.simplified.length)
    .slice(0, SEARCH_LIMIT)
    .map(f => f.word)
}
