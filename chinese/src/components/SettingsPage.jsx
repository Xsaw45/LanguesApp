import { Check } from 'lucide-react'
import { LANGS, LANG_NAMES } from '../i18n/text.js'
import { useLang } from '../i18n/useLang.js'
import { Screen, SectionLabel, TopBar } from './ui.jsx'
import { ICON } from './uiStyles.js'

const CREDITS = [
  { key: 'settings.credit.cedict', href: 'https://cc-cedict.org/wiki/' },
  { key: 'settings.credit.cfdict', href: 'https://chine.in/mandarin/dictionnaire/CFDICT/' },
  { key: 'settings.credit.hsk', href: 'https://github.com/krmanik/HSK-3.0' },
  { key: 'settings.credit.audio', href: 'https://github.com/hugolpz/audio-cmn' },
  { key: 'settings.credit.tts', href: 'https://cloud.google.com/text-to-speech' },
  { key: 'settings.credit.strokes', href: 'https://github.com/chanind/hanzi-writer-data' },
  { key: 'settings.credit.unihan', href: 'https://www.unicode.org/charts/unihan.html' },
]

export function SettingsPage({ onBack }) {
  const { lang, setLang, t } = useLang()

  return (
    <Screen>
      <TopBar onBack={onBack} backLabel={t('nav.back')} title={t('settings.title')} bordered />

      <div className="flex flex-col px-5 py-6">
        <SectionLabel className="mb-1">{t('settings.language')}</SectionLabel>
        <p className="mb-3 text-sm text-fg-3">{t('settings.languageHint')}</p>
        <ul role="radiogroup" aria-label={t('settings.language')} className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-card">
          {LANGS.map(code => (
            <li key={code}>
              <button
                type="button"
                role="radio"
                aria-checked={code === lang}
                lang={code}
                onClick={() => setLang(code)}
                className="flex h-14 w-full items-center justify-between px-4 text-left text-base text-fg transition-colors duration-150 ease-out hover:bg-raised"
              >
                {LANG_NAMES[code]}
                {code === lang && <Check {...ICON} className="text-accent" />}
              </button>
            </li>
          ))}
        </ul>

        <SectionLabel className="mt-10">{t('settings.credits')}</SectionLabel>
        <p className="mb-3 text-sm text-fg-3">{t('settings.creditsIntro')}</p>
        <ul className="flex flex-col gap-2 text-sm text-fg-2">
          {CREDITS.map(c => (
            <li key={c.key}>
              <a href={c.href} target="_blank" rel="noreferrer" className="underline decoration-line-2 underline-offset-2 hover:text-fg">
                {t(c.key)}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </Screen>
  )
}
