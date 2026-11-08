import { ChevronRight } from 'lucide-react'
import { CLASSIFIERS } from '../data/classifiers.js'
import { PINYIN_LESSONS } from '../data/pinyinLessons.js'
import { getClassifierProgress } from '../utils/classifierQuiz.js'
import { getLessonProgress, PASS_THRESHOLD } from '../utils/pinyinQuiz.js'
import { ProgressBar, Screen, Seal, TopBar } from './ui.jsx'
import { ICON } from './uiStyles.js'

function ModuleCard({ seal, title, chinese, description, known, total, unit, onOpen }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="w-full rounded-2xl border border-line bg-card p-5 text-left transition-colors duration-150 ease-out hover:bg-raised active:bg-raised"
    >
      <div className="flex items-center gap-3">
        <Seal>{seal}</Seal>
        <span className="flex-1 text-lg font-medium text-fg">
          {title} <span className="chinese-text text-fg-2">{chinese}</span>
        </span>
        <ChevronRight {...ICON} className="text-fg-3" />
      </div>
      <p className="mt-3 text-[15px] leading-snug text-fg-2">{description}</p>
      <ProgressBar value={total ? known / total : 0} className="mt-4" />
      <p className="mt-2 text-sm tabular-nums text-fg-3">{known} / {total} {unit}</p>
    </button>
  )
}

export function ModulesHome({ levelStats, progressMap, onOpenPinyin, onOpenVocabulary, onOpenClassifiers }) {
  const wordsKnown = (levelStats || []).reduce((n, s) => n + s.known, 0)
  const wordsTotal = (levelStats || []).reduce((n, s) => n + s.total, 0)
  const classifiersKnown = CLASSIFIERS.filter(cl => getClassifierProgress(progressMap, cl).known).length
  const lessonsPassed = PINYIN_LESSONS.filter(l => getLessonProgress(progressMap, l).bestPct >= PASS_THRESHOLD).length

  return (
    <Screen>
      <TopBar backHref="/" backLabel="Langues" />

      <div className="px-5 pb-8">
        <header className="pt-4 pb-8">
          <h1 className="text-[32px] font-medium leading-tight text-fg">
            Chinois <span className="hanzi-display text-fg-2">中文</span>
          </h1>
          <p className="mt-1 text-[17px] text-fg-2">Que veux-tu travailler ?</p>
        </header>

        <div className="flex flex-col gap-3">
          <ModuleCard
            seal="拼"
            title="Pinyin et tons"
            chinese="拼音"
            description="Pour bien commencer : les tons, les sons et la lecture du pinyin, avec l'audio"
            known={lessonsPassed}
            total={PINYIN_LESSONS.length}
            unit="leçons réussies"
            onOpen={onOpenPinyin}
          />
          <ModuleCard
            seal="词"
            title="Vocabulaire"
            chinese="词汇"
            description="Les mots du HSK, niveau par niveau, en répétition espacée"
            known={wordsKnown}
            total={wordsTotal}
            unit="mots maîtrisés"
            onOpen={onOpenVocabulary}
          />
          <ModuleCard
            seal="量"
            title="Classificateurs"
            chinese="量词"
            description="个, 张, 本, 只… : lesquels vont avec quels noms"
            known={classifiersKnown}
            total={CLASSIFIERS.length}
            unit="maîtrisés"
            onOpen={onOpenClassifiers}
          />
        </div>
      </div>
    </Screen>
  )
}
