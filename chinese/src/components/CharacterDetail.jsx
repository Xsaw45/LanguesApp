import { useState } from 'react'
import { PenLine, RotateCcw } from 'lucide-react'
import { charAudioContext, charRadical, charSenses, charSrc, hanziLevelLabel, wordsWithChar } from '../data/hanzi.js'
import { wordSenses } from '../data/index.js'
import { useLang } from '../i18n/useLang.js'
import { HanziBoard } from './HanziBoard.jsx'
import { SpeakButton } from './SpeakButton.jsx'
import { Button, Screen, SectionLabel, TopBar } from './ui.jsx'
import { ICON } from './uiStyles.js'

/** Fiche d'un caractère : ordre des traits (clé en couleur), tracé libre, lecture, sens, clé, mots. */
export function CharacterDetail({ ch, onBack }) {
  const { t, l, lang } = useLang()
  const [mode, setMode] = useState('animate')
  const [runKey, setRunKey] = useState(0)
  const [mistakes, setMistakes] = useState(null)
  const radical = charRadical(ch)
  const words = wordsWithChar(ch)
  const audioContext = charAudioContext(ch)

  const replay = () => {
    setMode('animate')
    setMistakes(null)
    setRunKey(k => k + 1)
  }
  const trace = () => {
    setMode('quiz')
    setMistakes(0)
    setRunKey(k => k + 1)
  }

  return (
    <Screen>
      <TopBar onBack={onBack} title={<span className="chinese-text">{ch.c}</span>} aside={hanziLevelLabel(ch.level)} />

      <div className="px-5 pb-8">
        <div className="pt-2">
          <HanziBoard key={ch.c} char={ch.c} mode={mode} outline showRadical={mode === 'animate'} runKey={runKey} onMistake={setMistakes} onComplete={setMistakes} />
        </div>
        <p className="mt-2 h-5 text-center text-sm tabular-nums text-fg-3">{mistakes !== null && t('hz.mistakes', { n: mistakes })}</p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <Button variant="secondary" onClick={replay}><RotateCcw {...ICON} />{t('hz.replay')}</Button>
          <Button variant="secondary" onClick={trace}><PenLine {...ICON} />{t('hz.trace')}</Button>
        </div>

        <section className="mt-8">
          <div className="flex items-center gap-3">
            <div>
              <p className="text-2xl text-fg">{ch.pinyin}</p>
              {audioContext && (
                <p className="mt-1 text-sm text-fg-3">
                  {t('hz.audioContext')} <span className="chinese-text text-fg">{audioContext.text}</span> · {audioContext.pinyin}
                </p>
              )}
            </div>
            <SpeakButton src={charSrc(ch)} text={audioContext?.text ?? ch.c} />
          </div>
          <ul className="mt-3 space-y-1 text-[15px] text-fg">
            {charSenses(ch, lang).map(s => <li key={s}>{s}</li>)}
          </ul>
        </section>

        <dl className="mt-6 divide-y divide-line rounded-2xl border border-line bg-card">
          <div className="flex items-center justify-between gap-4 p-4">
            <dt className="text-[15px] text-fg-2">{t('hz.radical')}</dt>
            <dd className="flex items-baseline gap-3">
              <span className="hanzi-display text-2xl text-accent">{radical.forms.slice(0, 2).join(' ')}</span>
              <span className="text-[15px] text-fg">{l(radical.meaning)}</span>
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4 p-4">
            <dt className="text-[15px] text-fg-2">{t('hz.strokes')}</dt>
            <dd className="text-[15px] tabular-nums text-fg">{ch.strokes}</dd>
          </div>
        </dl>

        {words.length > 0 && (
          <section className="mt-8">
            <SectionLabel>{t('hz.words')}</SectionLabel>
            <ul className="divide-y divide-line rounded-2xl border border-line bg-card">
              {words.map(w => (
                <li key={w.id} className="flex items-baseline gap-3 px-4 py-3">
                  <span className="hanzi-display text-xl text-fg">{w.simplified}</span>
                  <span className="text-sm text-fg-2">{w.pinyin}</span>
                  <span className="min-w-0 flex-1 truncate text-right text-sm text-fg-3">{wordSenses(w, lang)[0]}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </Screen>
  )
}
