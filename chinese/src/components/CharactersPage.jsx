import { useLayoutEffect, useRef, useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { HANZI_LEVELS, charsForLevel, getChar, hanziLevelLabel } from '../data/hanzi.js'
import { HANZI_PRACTICE_SIZE, buildHanziPractice, getCharProgress } from '../utils/hanziQuiz.js'
import { isDueForReview } from '../utils/spacedrep.js'
import { useLang } from '../i18n/useLang.js'
import { CharacterDetail } from './CharacterDetail.jsx'
import { CharacterPractice } from './CharacterPractice.jsx'
import { RadicalsPage } from './RadicalsPage.jsx'
import { Button, Screen, TopBar } from './ui.jsx'
import { ICON } from './uiStyles.js'

/** Case de la grille : bordure verte maîtrisé, rouge à réviser, trait d'avancement en cours d'apprentissage. */
function CharTile({ ch, progress, onOpen }) {
  const state = progress.known ? (isDueForReview(progress) ? 'due' : 'known') : progress.successCount > 0 ? 'learning' : 'new'
  const border = { known: 'border-good/40', due: 'border-accent/60', learning: 'border-line-2', new: 'border-line' }[state]
  return (
    <button
      type="button"
      onClick={onOpen}
      className={`relative flex aspect-square items-center justify-center rounded-xl border bg-card transition-colors duration-150 ease-out hover:bg-raised ${border}`}
    >
      <span className={`hanzi-display text-[28px] leading-none ${state === 'known' ? 'text-fg-2' : 'text-fg'}`}>{ch.c}</span>
      {state === 'learning' && (
        <span className="absolute inset-x-2 bottom-1.5 h-0.5 overflow-hidden rounded-full bg-raised-2">
          <span className="block h-full bg-accent" style={{ width: `${(progress.successCount / 3) * 100}%` }} />
        </span>
      )}
    </button>
  )
}

export function CharactersPage({ progressMap, applyUpdates, onBack }) {
  const { t } = useLang()
  // Niveau affiché : le premier qui n'est pas entièrement maîtrisé.
  const [level, setLevel] = useState(() =>
    HANZI_LEVELS.find(lv => charsForLevel(lv).some(ch => !getCharProgress(progressMap, ch).known)) ?? HANZI_LEVELS[0])
  // 'list' | 'radicals' | { char } | { practice, id }
  const [view, setView] = useState('list')

  // Retour à la grille : elle reprend où on l'avait laissée ; les autres écrans s'ouvrent en haut.
  const listScroll = useRef(0)
  const open = next => {
    if (view === 'list') listScroll.current = window.scrollY
    setView(next)
  }
  useLayoutEffect(() => {
    window.scrollTo(0, view === 'list' ? listScroll.current : 0)
  }, [view])

  const toList = () => setView('list')
  const startPractice = () => open({ practice: buildHanziPractice(progressMap, level), id: (view.id ?? 0) + 1 })

  if (view.char) return <CharacterDetail ch={getChar(view.char)} onBack={toList} />
  if (view === 'radicals') return <RadicalsPage progressMap={progressMap} applyUpdates={applyUpdates} onBack={toList} />
  if (view.practice) {
    return (
      <CharacterPractice
        key={view.id}
        items={view.practice}
        progressMap={progressMap}
        applyUpdates={applyUpdates}
        onExit={toList}
        onRestart={startPractice}
      />
    )
  }

  const chars = charsForLevel(level)
  const known = chars.filter(ch => getCharProgress(progressMap, ch).known).length
  const canPractice = buildHanziPractice(progressMap, level).length > 0

  return (
    <Screen>
      <TopBar onBack={onBack} title={<>{t('hz.title')} <span className="chinese-text text-fg-2">汉字</span></>} bordered />

      <div className="border-b border-line px-5 py-6">
        <p className="text-[15px] leading-relaxed text-fg">{t('hz.intro')}</p>
        <div className="-mx-5 mt-5 flex gap-2 overflow-x-auto px-5 pb-1">
          {HANZI_LEVELS.map(lv => (
            <button
              key={lv}
              type="button"
              onClick={() => setLevel(lv)}
              aria-pressed={lv === level}
              className={`h-9 shrink-0 rounded-full border px-4 text-sm transition-colors duration-150 ease-out ${
                lv === level ? 'border-seal bg-seal text-white' : 'border-line bg-card text-fg-2 hover:bg-raised'
              }`}
            >
              {hanziLevelLabel(lv)}
            </button>
          ))}
        </div>
        <Button onClick={startPractice} disabled={!canPractice} className="mt-5">{t('hz.practice', { n: HANZI_PRACTICE_SIZE })}</Button>
        <p className="mt-3 text-center text-sm tabular-nums text-fg-3">
          {canPractice ? t('hz.progress', { known, total: chars.length }) : t('hz.allDone')}
        </p>
      </div>

      <div className="flex-1 px-5 pb-8">
        <button
          type="button"
          onClick={() => open('radicals')}
          className="mt-6 flex w-full items-center gap-3 rounded-2xl border border-line bg-card p-4 text-left transition-colors duration-150 ease-out hover:bg-raised"
        >
          <span className="hanzi-display text-2xl text-accent">氵讠扌</span>
          <span className="flex-1 text-[15px] font-medium text-fg">{t('hz.radicals')} <span className="chinese-text text-fg-2">部首</span></span>
          <ChevronRight {...ICON} className="text-fg-3" />
        </button>

        <div className="mt-6 grid grid-cols-6 gap-2">
          {chars.map(ch => (
            <CharTile key={ch.c} ch={ch} progress={getCharProgress(progressMap, ch)} onOpen={() => open({ char: ch.c })} />
          ))}
        </div>
      </div>
    </Screen>
  )
}
