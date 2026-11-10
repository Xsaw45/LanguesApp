import { useState, useMemo } from 'react'
import { ChevronDown, Search, X } from 'lucide-react'
import { ALL_LEVELS, getWordsForLevel, wordSenses } from '../data/index.js'
import { SpeakButton } from './SpeakButton.jsx'
import { wordSrc } from '../utils/audio.js'
import { SEARCH_LIMIT, searchWords } from '../utils/wordSearch.js'
import { useLang } from '../i18n/useLang.js'
import { Screen, TopBar } from './ui.jsx'
import { ICON } from './uiStyles.js'

/** showLevel : niveau affiché sous le pinyin (résultats de recherche, tous niveaux confondus). */
function WordRow({ word, showLevel }) {
  const { lang } = useLang()
  const senses = wordSenses(word, lang)
  return (
    <li className="flex items-start gap-4 py-4">
      <div className="w-16 shrink-0">
        <p className="chinese-text text-2xl leading-tight text-fg">{word.simplified}</p>
        <p className="mt-1 text-sm text-fg-3">{word.pinyin}</p>
        {showLevel && <p className="mt-1 text-xs tabular-nums text-fg-3">HSK {word.level}</p>}
      </div>
      <ol className="min-w-0 flex-1 space-y-1 text-[15px] text-fg">
        {senses.map((s, i) => (
          <li key={i} className="flex gap-2">
            {senses.length > 1 && <span className="w-4 shrink-0 text-right tabular-nums text-fg-3">{i + 1}</span>}
            <span>{s}</span>
          </li>
        ))}
      </ol>
      <SpeakButton src={wordSrc(word)} text={word.simplified} />
    </li>
  )
}

export function VocabularyPage({ onBack }) {
  const { lang, t } = useLang()
  const [selectedLevel, setSelectedLevel] = useState(ALL_LEVELS[0])
  const [query, setQuery] = useState('')
  const searching = query.trim() !== ''
  const words = useMemo(
    () => (searching ? searchWords(query, lang) : getWordsForLevel(selectedLevel)),
    [searching, query, lang, selectedLevel],
  )

  return (
    <Screen>
      <TopBar onBack={onBack} title={t('vocab.list')} bordered />

      <div className="flex flex-col gap-3 border-b border-line px-5 py-4">
        <div className="relative">
          <Search {...ICON} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-fg-3" />
          <input
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={t('vocab.searchPlaceholder')}
            aria-label={t('vocab.search')}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            className="h-12 w-full rounded-[10px] border border-line bg-card pr-11 pl-11 text-base text-fg outline-none transition-colors duration-150 ease-out placeholder:text-fg-3 focus:border-line-2 [&::-webkit-search-cancel-button]:hidden"
          />
          {searching && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label={t('vocab.clearSearch')}
              className="absolute top-1/2 right-2 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-lg text-fg-3 transition-colors duration-150 ease-out hover:bg-raised hover:text-fg"
            >
              <X {...ICON} />
            </button>
          )}
        </div>
        {!searching && (
          <div className="relative">
            <select
              value={selectedLevel}
              onChange={e => setSelectedLevel(Number(e.target.value))}
              aria-label={t('vocab.level')}
              className="h-12 w-full appearance-none rounded-[10px] border border-line bg-card px-4 text-base text-fg outline-none transition-colors duration-150 ease-out hover:bg-raised"
            >
              {ALL_LEVELS.map(l => (
                <option key={l} value={l}>{t('vocab.levelOption', { level: l, n: getWordsForLevel(l).length })}</option>
              ))}
            </select>
            <ChevronDown {...ICON} className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-fg-3" />
          </div>
        )}
      </div>

      {searching && (
        <p className="px-5 pt-4 text-sm tabular-nums text-fg-3">
          {words.length === 0 ? t('vocab.noResult')
            : words.length >= SEARCH_LIMIT ? t('vocab.manyResults', { n: SEARCH_LIMIT })
              : words.length === 1 ? t('vocab.oneResult') : t('vocab.results', { n: words.length })}
        </p>
      )}

      <ul className="flex-1 divide-y divide-line px-5 pb-8">
        {words.map(word => <WordRow key={word.id} word={word} showLevel={searching} />)}
      </ul>
    </Screen>
  )
}
