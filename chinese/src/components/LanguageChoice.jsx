import { ChevronRight } from 'lucide-react'
import { LANGS, LANG_NAMES, defaultLang, frSpacing, translate } from '../i18n/text.js'
import { Screen, Seal } from './ui.jsx'
import { ICON } from './uiStyles.js'

/**
 * Premier lancement : langue d'apprentissage (interface, explications, définitions), puis le test de niveau.
 * La langue n'est pas encore choisie : la question suit celle du navigateur, chaque choix est dans sa propre langue.
 */
export function LanguageChoice({ onChoose }) {
  const browser = defaultLang()
  const say = (lang, key) => (lang === 'fr' ? frSpacing(translate(lang, key)) : translate(lang, key))
  return (
    <Screen className="px-5 pb-8">
      <div className="pt-14">
        <Seal>中</Seal>
        <h1 className="mt-6 text-[28px] font-medium leading-tight text-fg">{say(browser, 'onboard.title')}</h1>
        <p className="mt-2 text-base text-fg-2">{say(browser, 'onboard.intro')}</p>
      </div>
      <ul className="mt-8 flex flex-col gap-3">
        {LANGS.map(code => (
          <li key={code}>
            <button
              type="button"
              lang={code}
              onClick={() => onChoose(code)}
              className="flex w-full items-center gap-4 rounded-2xl border border-line bg-card p-4 text-left transition-colors duration-150 ease-out hover:bg-raised active:bg-raised-2"
            >
              <span className="min-w-0 flex-1">
                <span className="block text-lg font-medium text-fg">{LANG_NAMES[code]}</span>
                <span className="mt-0.5 block text-sm text-fg-2">{say(code, 'onboard.langHint')}</span>
              </span>
              <ChevronRight {...ICON} className="shrink-0 text-fg-3" />
            </button>
          </li>
        ))}
      </ul>
      <p className="mt-auto pt-8 text-center text-sm text-fg-3">{say(browser, 'onboard.next')}</p>
    </Screen>
  )
}
