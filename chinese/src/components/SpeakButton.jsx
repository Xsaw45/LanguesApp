import { useEffect, useState } from 'react'
import { Volume2 } from 'lucide-react'
import { play, speak, chineseVoice } from '../utils/audio.js'
import { ICON_SM } from './uiStyles.js'

/**
 * Bouton écouter : joue l'enregistrement src ; sans enregistrement, lit text avec la voix chinoise du téléphone s'il en
 * a une ; sinon rien n'est affiché.
 */
export function SpeakButton({ src, text, label }) {
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
      className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-line text-fg-2 transition-colors duration-150 ease-out hover:bg-raised hover:text-fg active:bg-raised-2"
    >
      <Volume2 {...ICON_SM} />
    </button>
  )
}
