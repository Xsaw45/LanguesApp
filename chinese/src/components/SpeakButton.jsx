import { useEffect, useState } from 'react'
import { play, speak, chineseVoice } from '../utils/audio.js'

/**
 * Bouton 🔊 : joue l'enregistrement src ; sans enregistrement, lit text avec la voix chinoise du téléphone s'il en a
 * une ; sinon rien n'est affiché.
 */
export function SpeakButton({ src, text, className = '', label }) {
  const [hasVoice, setHasVoice] = useState(() => !src && !!chineseVoice())

  useEffect(() => {
    if (src || !text || !window.speechSynthesis) return
    const update = () => setHasVoice(!!chineseVoice())
    window.speechSynthesis.addEventListener('voiceschanged', update)
    return () => window.speechSynthesis.removeEventListener('voiceschanged', update)
  }, [src, text])

  if (!src && !(text && hasVoice)) return null

  return (
    <button
      type="button"
      onClick={e => {
        e.stopPropagation()
        if (src) play(src)
        else speak(text)
      }}
      aria-label={label || 'Écouter'}
      title={src ? 'Écouter' : 'Écouter (voix du téléphone)'}
      className={`shrink-0 inline-flex items-center justify-center rounded-full text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 active:bg-slate-600 transition-colors ${className || 'w-9 h-9 text-base'}`}
    >
      🔊
    </button>
  )
}
