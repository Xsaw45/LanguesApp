import { wordSenses } from '../data/index.js'
import { useLang } from '../i18n/useLang.js'

export function QuestionCard({ question }) {
  const { lang, t } = useLang()
  const { word, type } = question

  if (type === 'char-to-def') {
    return (
      <div className="py-10 text-center">
        <p className="mb-6 text-[15px] text-fg-2">{t('vocab.askMeaning')}</p>
        <div className="hanzi-display text-[72px] leading-none text-fg">{word.simplified}</div>
        <p className="mt-6 text-sm text-fg-3">HSK {word.level}</p>
      </div>
    )
  }

  // def-to-char
  return (
    <div className="py-10 text-center">
      <p className="mb-6 text-[15px] text-fg-2">{t('vocab.askWord')}</p>
      <div className="text-2xl font-medium leading-snug text-fg">{wordSenses(word, lang).join('; ')}</div>
      <p className="mt-6 text-sm text-fg-3">HSK {word.level}</p>
    </div>
  )
}
