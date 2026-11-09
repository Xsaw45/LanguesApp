import { Volume2 } from 'lucide-react'
import { wordSenses } from '../data/index.js'
import { play } from '../utils/audio.js'
import { useLang } from '../i18n/useLang.js'

const PROMPTS = {
  'char-to-def': 'vocab.askMeaning',
  'meaning-choice': 'vocab.askMeaning',
  'def-to-char': 'vocab.askWord',
  'char-choice': 'vocab.askChar',
  'pinyin-choice': 'vocab.askPinyin',
  'listen-choice': 'vocab.askListen',
}

export function QuestionCard({ question }) {
  const { lang, t } = useLang()
  const { word, type } = question

  let shown
  if (type === 'listen-choice') {
    shown = (
      <button
        type="button"
        onClick={() => play(question.audio)}
        aria-label={t('audio.replay')}
        className="mx-auto flex size-20 items-center justify-center rounded-full border border-line bg-card text-fg transition-colors duration-150 ease-out hover:bg-raised active:bg-raised-2"
      >
        <Volume2 size={28} strokeWidth={1.5} aria-hidden />
      </button>
    )
  } else if (type === 'def-to-char' || type === 'char-choice') {
    // Sens → mot : les premiers sens suffisent pour reconnaître le mot (la liste complète est dans la correction).
    const senses = wordSenses(word, lang)
    shown = <div className="text-2xl font-medium leading-snug text-fg">{(type === 'char-choice' ? senses.slice(0, 3) : senses).join('; ')}</div>
  } else {
    shown = <div className="hanzi-display text-[72px] leading-none text-fg">{word.simplified}</div>
  }

  return (
    <div className="py-10 text-center">
      <p className="mb-6 text-[15px] text-fg-2">{t(PROMPTS[type])}</p>
      {shown}
      <p className="mt-6 text-sm text-fg-3">HSK {word.level}</p>
    </div>
  )
}
