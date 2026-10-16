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

function normalizeText(str) {
  return str.toLowerCase().trim()
}

export function validateAnswer(input, word, questionType) {
  const trimmed = input.trim()
  if (!trimmed) return false

  if (questionType === 'char-to-def') {
    // Any single sense (split by ; or |) is a valid answer
    const accepted = word.definition
      .split(/[;|]/)
      .map(normalizeText)
      .filter(Boolean)
    const userAnswer = normalizeText(trimmed)
    return accepted.some(a => a === userAnswer)
  }

  if (questionType === 'def-to-char') {
    // Accept exact Chinese character OR pinyin with tones
    const chineseMatch = trimmed === word.simplified
    const pinyinMatch = normalizePinyin(trimmed) === normalizePinyin(word.pinyin)
    return chineseMatch || pinyinMatch
  }

  return false
}
