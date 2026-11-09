import { LevelCard } from './LevelCard.jsx'
import { ALL_LEVELS, getWordsForLevel } from '../data/index.js'
import { isActive, createInitialProgress } from '../utils/spacedrep.js'
import { useLang } from '../i18n/useLang.js'
import { Button, Screen, SectionLabel, TopBar } from './ui.jsx'

function countActiveWords(progressMap, unlockedLevels) {
  if (!progressMap) return 0
  return unlockedLevels.flatMap(l => getWordsForLevel(l)).filter(w => {
    const p = progressMap.get(w.id) || createInitialProgress(w.id, w.level)
    return isActive(p)
  }).length
}

export function Dashboard({ levelStats, unlockedLevels, progressMap, onStartQuiz, onOpenVocabulary, onBack }) {
  const { t } = useLang()
  const activeCount = countActiveWords(progressMap, unlockedLevels)
  const canStart = activeCount > 0
  const stats = levelStats || ALL_LEVELS.map(l => ({ level: l, total: getWordsForLevel(l).length, known: 0, pct: 0 }))

  return (
    <Screen>
      <TopBar onBack={onBack} backLabel={t('nav.modules')} />

      <div className="px-5 pb-8">
        <header className="pt-4 pb-6">
          <h1 className="text-[28px] font-medium leading-tight text-fg">{t('vocab.title')}</h1>
          <p className="mt-1 text-[15px] text-fg-2">
            {t('vocab.levels', { from: ALL_LEVELS[0], to: ALL_LEVELS.at(-1) })} · <span className="chinese-text">汉语水平考试</span>
          </p>
        </header>

        <div className="flex flex-col gap-2">
          <Button onClick={onStartQuiz} disabled={!canStart}>
            {canStart ? t('vocab.start', { n: Math.min(activeCount, 20) }) : t('vocab.nothing')}
          </Button>
          {!canStart && <p className="text-center text-sm text-fg-3">{t('vocab.nothingHint')}</p>}
          <Button variant="secondary" onClick={onOpenVocabulary}>{t('vocab.list')}</Button>
        </div>

        <SectionLabel className="mt-10">{t('vocab.progress')}</SectionLabel>
        <div className="flex flex-col gap-3">
          {stats.map(stat => (
            <LevelCard key={stat.level} stat={stat} unlocked={unlockedLevels.includes(stat.level)} last={stat.level === ALL_LEVELS.at(-1)} />
          ))}
        </div>
      </div>
    </Screen>
  )
}
