import { useEffect, useState } from 'react'
import { Volume2 } from 'lucide-react'
import { play, playAll, speak, chineseVoice, ttsSrc } from '../utils/audio.js'
import { useLang } from '../i18n/useLang.js'
import { ICON_SM } from './uiStyles.js'

/**
 * Bouton écouter. src : enregistrement, ou liste d'enregistrements joués à la suite. Sans src, une phrase (text)
 * enregistrée est jouée avec sa voix (voice, data/voices.js) ; sinon text (ou liste de textes) est lu par la voix
 * chinoise du téléphone s'il en a une ; sinon rien n'est affiché.
 */
export function SpeakButton({ src, text, voice }) {
  const { t } = useLang()
  const recorded = src || (typeof text === 'string' ? ttsSrc(text, voice) : null)
  const [hasVoice, setHasVoice] = useState(() => !recorded && !!chineseVoice())

  useEffect(() => {
    if (recorded || !text || !window.speechSynthesis) return
    const update = () => setHasVoice(!!chineseVoice())
    window.speechSynthesis.addEventListener('voiceschanged', update)
    return () => window.speechSynthesis.removeEventListener('voiceschanged', update)
  }, [recorded, text])

  if (!recorded && !(text && hasVoice)) return null

  return (
    <button
      type="button"
      onClick={e => {
        e.stopPropagation()
        if (Array.isArray(recorded)) playAll(recorded)
        else if (recorded) play(recorded)
        else speak(text)
      }}
      aria-label={t('audio.listen')}
      title={t(recorded ? 'audio.listen' : 'audio.listenDevice')}
      className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-line text-fg-2 transition-colors duration-150 ease-out hover:bg-raised hover:text-fg active:bg-raised-2"
    >
      <Volume2 {...ICON_SM} />
    </button>
  )
}
