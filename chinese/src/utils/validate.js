// Pinyin tone mark → number equivalents
const TONE_MAP = {
  'ā': 'a1', 'á': 'a2', 'ǎ': 'a3', 'à': 'a4',
  'ē': 'e1', 'é': 'e2', 'ě': 'e3', 'è': 'e4',
  'ī': 'i1', 'í': 'i2', 'ǐ': 'i3', 'ì': 'i4',
  'ō': 'o1', 'ó': 'o2', 'ǒ': 'o3', 'ò': 'o4',
  'ū': 'u1', 'ú': 'u2', 'ǔ': 'u3', 'ù': 'u4',
  'ǖ': 'v1', 'ǘ': 'v2', 'ǚ': 'v3', 'ǜ': 'v4', 'ü': 'v0',
}

function normalizePinyin(str) {
  let result = str.toLowerCase().trim()
  // Replace tone marks with base letter + number
  for (const [mark, replacement] of Object.entries(TONE_MAP)) {
    result = result.replaceAll(mark, replacement)
  }
  // Remove spaces between syllables for comparison
  result = result.replace(/\s+/g, '')
  return result
}

/** Removes parenthesised text, nested included: "(coll.) to be inclined (to do sth)" → "to be inclined". */
export function stripParens(s) {
  let prev
  do { prev = s; s = s.replace(/\([^()]*\)/g, ' ') } while (s !== prev)
  return s.replace(/\s+/g, ' ').trim()
}

// Case, curly apostrophes, final punctuation and spacing never make an answer wrong.
function normalizeText(str) {
  return str.toLowerCase().replace(/[’‘`]/g, "'").replace(/\s+/g, ' ').trim().replace(/[.!?]+$/, '').trim()
}

/**
 * Answers accepted for one sense: the sense itself, without its parentheses (optional precisions), and each of
 * its comma-separated parts ("Beijing, capital of …" → "beijing"). A sense that is only a parenthesis
 * ("(question particle)") is accepted without the brackets. Hyphenated words match with or without the hyphen.
 */
function acceptedAnswers(sense) {
  const bare = stripParens(sense) || sense.replace(/[()]/g, '')
  const forms = [sense, bare, ...bare.split(',')].map(normalizeText).filter(Boolean)
  return forms.flatMap(f => [f.replaceAll('-', ' '), f.replaceAll('-', '')])
}

export function validateAnswer(input, word, questionType) {
  const trimmed = input.trim()
  if (!trimmed) return false

  if (questionType === 'char-to-def') {
    const accepted = new Set(word.definition.split(/[;|]/).flatMap(acceptedAnswers))
    return accepted.has(normalizeText(trimmed).replaceAll('-', ' '))
  }

  if (questionType === 'def-to-char') {
    // Accept exact Chinese character OR pinyin with tones
    const chineseMatch = trimmed === word.simplified
    const pinyinMatch = normalizePinyin(trimmed) === normalizePinyin(word.pinyin)
    return chineseMatch || pinyinMatch
  }

  return false
}
