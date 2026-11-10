import { useLang } from '../i18n/useLang.js'
import { Button } from './ui.jsx'

/** Invitation au test de niveau (accueil d'un nouvel utilisateur, page Vocabulaire tant qu'il n'est pas fait). */
export function PlacementInvite({ onStart, className = '' }) {
  const { t } = useLang()
  return (
    <section className={`rounded-2xl border border-line bg-card p-4 ${className}`}>
      <p className="text-base font-medium text-fg">{t('lt.invite')}</p>
      <p className="mt-1 text-sm leading-snug text-fg-2">{t('lt.inviteHint')}</p>
      <Button variant="secondary" onClick={onStart} className="mt-4 h-10 text-sm">{t('lt.start')}</Button>
    </section>
  )
}
