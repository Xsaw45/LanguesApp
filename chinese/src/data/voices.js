// Voix des phrases enregistrées (Google Cloud Text-to-Speech, Chirp 3 HD) : scripts/fetch-sentence-audio.js les
// génère une fois, l'app lit les fichiers. Sans import : le script Node utilise aussi ce fichier.
// Une voix par personnage des dialogues (data/reading.js : speakers[].voice, voice des textes) ; 'f' ailleurs.

export const VOICES = {
  f: 'cmn-CN-Chirp3-HD-Aoede',
  f2: 'cmn-CN-Chirp3-HD-Kore',
  m: 'cmn-CN-Chirp3-HD-Charon',
  m2: 'cmn-CN-Chirp3-HD-Puck',
}
export const DEFAULT_VOICE = 'f'

/** Nom du fichier d'une phrase dite par une voix : empreinte FNV-1a du texte (les phrases ont de la ponctuation). */
export function sentenceFile(text, voice) {
  let hash = 0x811c9dc5
  for (const ch of `${voice}|${text}`) {
    hash ^= ch.codePointAt(0)
    hash = Math.imul(hash, 0x01000193) >>> 0
  }
  return `${voice}-${hash.toString(16).padStart(8, '0')}.mp3`
}
