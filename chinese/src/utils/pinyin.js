// Syllabes pinyin : forme "de base" en minuscules avec v pour ü (lv), ton 1-4 (0 = neutre).
const MARKS = { a: 'āáǎà', e: 'ēéěè', i: 'īíǐì', o: 'ōóǒò', u: 'ūúǔù', v: 'ǖǘǚǜ' }
const VOWELS = 'aeiouv'

/** "nǚ" → { base: 'nv', tone: 3 } ; "ma" → { base: 'ma', tone: 0 } */
export function parseSyllable(syllable) {
  let base = ''
  let tone = 0
  for (const ch of syllable.toLowerCase()) {
    if (ch === 'ü') { base += 'v'; continue }
    const vowel = Object.keys(MARKS).find(v => MARKS[v].includes(ch))
    if (vowel) {
      base += vowel
      tone = MARKS[vowel].indexOf(ch) + 1
    } else base += ch
  }
  return { base, tone }
}

/** "Běi jīng" → ['běi', 'jīng'] */
export function splitPinyin(pinyin) {
  return pinyin.replace(/[’'·-]/g, ' ').split(/\s+/).filter(Boolean)
}

/** "mǎ" → "ma3" (nom des enregistrements) ; neutre : base seule */
export function toNumeric(syllable) {
  const { base, tone } = parseSyllable(syllable)
  return tone ? `${base}${tone}` : base
}

/** Voyelle qui porte l'accent : a ou e s'il y en a, o dans "ou", sinon la dernière voyelle (liù, guì). */
export function markIndex(base) {
  for (const v of ['a', 'e']) if (base.includes(v)) return base.indexOf(v)
  if (base.includes('ou')) return base.indexOf('o')
  for (let i = base.length - 1; i >= 0; i--) if (VOWELS.includes(base[i])) return i
  return -1
}

/** ('hao', 3) → "hǎo" ; index force la voyelle accentuée (exercice sur la place de l'accent). */
export function withTone(base, tone, index = markIndex(base)) {
  const chars = [...base]
  if (tone >= 1 && tone <= 4 && index >= 0) chars[index] = MARKS[chars[index]][tone - 1]
  return chars.join('').replaceAll('v', 'ü')
}

export const vowelIndexes = base => [...base].flatMap((ch, i) => (VOWELS.includes(ch) ? [i] : []))

const INITIALS = ['zh', 'ch', 'sh', 'b', 'p', 'm', 'f', 'd', 't', 'n', 'l', 'g', 'k', 'h', 'j', 'q', 'x', 'r', 'z', 'c', 's', 'y', 'w']

/** 'zhang' → { initial: 'zh', final: 'ang' } ; 'an' → { initial: '', final: 'an' } */
export function splitInitial(base) {
  const initial = INITIALS.find(i => base.startsWith(i)) || ''
  return { initial, final: base.slice(initial.length) }
}

export const ALL_INITIALS = ['', 'b', 'p', 'm', 'f', 'd', 't', 'n', 'l', 'g', 'k', 'h', 'j', 'q', 'x', 'zh', 'ch', 'sh', 'r', 'z', 'c', 's', 'y', 'w']
