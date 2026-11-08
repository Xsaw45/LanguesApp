import { ArrowLeft, Check, X } from 'lucide-react'
import { ICON } from './uiStyles.js'

// Avec la barre d'état iOS translucide (index.html), le contenu passe sous l'encoche : marges de zone sûre.
export function Screen({ children, className = '' }) {
  return (
    <div className="flex min-h-dvh flex-col bg-page pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
      <div className={`mx-auto flex w-full max-w-xl flex-1 flex-col ${className}`}>{children}</div>
    </div>
  )
}

const backClass = 'inline-flex h-9 items-center gap-2 rounded-lg px-2 -ml-2 text-[15px] text-fg-2 transition-colors duration-150 ease-out hover:bg-raised hover:text-fg'

/** Barre du haut : retour à gauche, titre au centre, information à droite (compteur). */
export function TopBar({ onBack, backHref, backLabel = 'Retour', title, aside, bordered = false }) {
  const back = backHref
    ? <a href={backHref} className={backClass}><ArrowLeft {...ICON} />{backLabel}</a>
    : <button type="button" onClick={onBack} className={backClass}><ArrowLeft {...ICON} />{backLabel}</button>
  return (
    <header className={`grid h-14 shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-2 px-5 ${bordered ? 'border-b border-line' : ''}`}>
      <div className="justify-self-start">{back}</div>
      <h1 className="text-[15px] font-medium text-fg">{title}</h1>
      <div className="justify-self-end text-sm tabular-nums text-fg-3">{aside}</div>
    </header>
  )
}

const BUTTON = {
  primary: 'bg-seal text-white hover:bg-seal-hover',
  secondary: 'border border-line bg-raised text-fg hover:bg-raised-2',
}

export function Button({ variant = 'primary', className = '', ...props }) {
  return (
    <button
      type="button"
      className={`inline-flex h-12 w-full items-center justify-center gap-2 rounded-[10px] px-5 text-base font-medium transition-[background-color,color,transform] duration-150 ease-out active:scale-[0.98] disabled:cursor-default disabled:bg-raised disabled:text-fg-3 disabled:active:scale-100 ${BUTTON[variant]} ${className}`}
      {...props}
    />
  )
}

export function ProgressBar({ value, className = '' }) {
  return (
    <div className={`h-1 overflow-hidden rounded-full bg-raised ${className}`}>
      <div
        className="h-full origin-left rounded-full bg-accent transition-transform duration-300 ease-out"
        style={{ transform: `scaleX(${Math.min(1, Math.max(0, value))})` }}
      />
    </div>
  )
}

export function SectionLabel({ children, className = '' }) {
  return <h2 className={`mb-3 text-sm font-medium text-fg-2 ${className}`}>{children}</h2>
}

/** Sceau vermillon : la marque de chaque module. */
export function Seal({ children, className = '' }) {
  return (
    <span className={`hanzi-display inline-flex size-9 shrink-0 items-center justify-center rounded-md bg-seal text-xl leading-none text-white ${className}`}>
      {children}
    </span>
  )
}

/** Résultat d'une réponse : « Correct » / « Incorrect », puis le détail. */
export function Feedback({ correct, aside, children }) {
  return (
    <section className="rounded-2xl border border-line bg-card p-4">
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className={`inline-flex items-center gap-2 text-base font-medium ${correct ? 'text-good' : 'text-bad'}`}>
          {correct ? <Check {...ICON} /> : <X {...ICON} />}
          {correct ? 'Correct' : 'Incorrect'}
        </p>
        {aside}
      </div>
      {children}
    </section>
  )
}

/** En-tête d'une page de résultat. */
export function Score({ value, label, caption, good }) {
  return (
    <div className="pt-12 pb-10 text-center">
      <p className={`text-[56px] font-medium leading-none tabular-nums ${good ? 'text-good' : 'text-fg'}`}>{value}</p>
      <p className="mt-3 text-lg text-fg-2">{label}</p>
      {caption && <p className="mt-1 text-[15px] text-fg-3">{caption}</p>}
    </div>
  )
}
