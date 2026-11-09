import { GLOSSARY, lineText, lineWords } from '../data/reading.js'
import { HSK_DATA, wordSenses } from '../data/index.js'
import { charSenses, getChar } from '../data/hanzi.js'
import { message } from '../i18n/text.js'
import { lessonProgress } from './lessonProgress.js'

// Questions au format de GrammarQuiz (voir grammarQuiz.js) ; pointId = id du texte.

const MAX_REORDER = 2

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export const readingKey = reading => `rd_${reading.id}`
export const getReadingProgress = (progressMap, reading) => lessonProgress(progressMap, readingKey(reading), 'rd')

const solution = line => ({ zh: lineText(line), pinyin: line.pinyin, tr: line.tr })

function comprehension(reading, question, index) {
  const [answer] = question.a
  return {
    type: 'choice',
    layout: 'text',
    key: `${reading.id}:q:${index}`,
    pointId: reading.id,
    prompt: message('rd.q.comprehension'),
    display: question.q,
    options: shuffle(question.a).map((label, i) => ({ key: `${index}:${i}:${label.en}`, label, correct: label === answer })),
    solution: solution(reading.lines[question.line]),
  }
}

function reorder(reading, line, index) {
  const words = lineWords(line)
  const answers = [lineText(line), ...(line.alt || [])]
  let tokens = shuffle(words.map((text, id) => ({ id, text })))
  // Jamais présenté déjà dans un ordre accepté.
  for (let tries = 0; tries < 10 && answers.includes(tokens.map(t => t.text).join('')); tries++) tokens = shuffle(tokens)
  return {
    type: 'order',
    key: `${reading.id}:order:${index}`,
    pointId: reading.id,
    prompt: message('rd.q.order'),
    tr: line.tr,
    tokens,
    answers,
    solution: solution(line),
  }
}

/** Questions de compréhension dans l'ordre du texte, puis jusqu'à 2 phrases à remettre dans l'ordre. */
export function buildReadingQuiz(reading) {
  const reorderLines = shuffle(reading.lines.filter(line => line.reorder)).slice(0, MAX_REORDER)
  return [
    ...reading.questions.map((q, i) => comprehension(reading, q, i)),
    ...reorderLines.map((line, i) => reorder(reading, line, i)),
  ]
}

export const readingQuizSize = reading => reading.questions.length + Math.min(MAX_REORDER, reading.lines.filter(l => l.reorder).length)

// Mot HSK le plus simple pour chaque écriture (construit au premier mot touché).
let wordIndex = null
function hskWord(simplified) {
  if (!wordIndex) {
    wordIndex = new Map()
    for (const level of Object.keys(HSK_DATA)) for (const w of HSK_DATA[level]) if (!wordIndex.has(w.simplified)) wordIndex.set(w.simplified, w)
  }
  return wordIndex.get(simplified)
}

/** Un mot connu tel quel : glossaire des textes, mot HSK, caractère seul ; null sinon. */
function entry(zh, lang) {
  const own = GLOSSARY[zh]
  if (own) return { zh, pinyin: own.pinyin, senses: [own.tr[lang]] }
  const word = hskWord(zh)
  if (word) return { zh, pinyin: word.pinyin, senses: wordSenses(word, lang).slice(0, 3) }
  const ch = getChar(zh)
  if (ch) return { zh, pinyin: ch.pinyin, senses: charSenses(ch, lang).slice(0, 3) }
  return null
}

/**
 * Mot touché dans un texte → { zh, pinyin, senses, parts? }. Mot inconnu tel quel (二十五, 星期六) : découpé en
 * morceaux connus, les plus longs d'abord (二 + 十 + 五, 星期 + 六), donnés dans parts. null : rien de connu.
 */
export function lookupWord(token, lang) {
  const zh = token.replace(/[^\u3400-\u9fff]/g, '')
  if (!zh) return null
  const whole = entry(zh, lang)
  if (whole) return whole
  const parts = []
  for (let i = 0; i < zh.length;) {
    let part = null
    for (let j = zh.length; j > i && !part; j--) part = entry(zh.slice(i, j), lang)
    if (!part) return null
    parts.push(part)
    i += part.zh.length
  }
  return { zh, pinyin: parts.map(p => p.pinyin).join(' '), senses: [], parts }
}
