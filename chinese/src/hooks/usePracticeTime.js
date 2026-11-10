import { useEffect, useRef } from 'react'

const TICK_MS = 5000
const IDLE_MS = 90_000 // plus de 90 s sans toucher l'écran ni le clavier : pause, le temps ne compte plus
const SAVE_EVERY_S = 60

/**
 * Compte le temps de pratique : quand counting est vrai (un module ouvert), l'app visible et l'utilisateur actif.
 * onTime(secondes) est appelé chaque minute, quand l'app passe en arrière-plan et quand on arrête de compter.
 */
export function usePracticeTime(counting, onTime) {
  const callback = useRef(onTime)
  useEffect(() => {
    callback.current = onTime
  })

  useEffect(() => {
    if (!counting) return
    let lastInput = Date.now()
    let pending = 0 // secondes comptées pas encore transmises
    const onInput = () => { lastInput = Date.now() }
    const flush = () => {
      if (pending < 1) return
      callback.current(Math.round(pending))
      pending = 0
    }
    const tick = setInterval(() => {
      if (document.visibilityState !== 'visible' || Date.now() - lastInput > IDLE_MS) return
      pending += TICK_MS / 1000
      if (pending >= SAVE_EVERY_S) flush()
    }, TICK_MS)
    const onVisibility = () => document.visibilityState === 'hidden' && flush()
    const events = ['pointerdown', 'keydown', 'scroll']
    for (const e of events) window.addEventListener(e, onInput, { passive: true })
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      clearInterval(tick)
      for (const e of events) window.removeEventListener(e, onInput)
      document.removeEventListener('visibilitychange', onVisibility)
      flush()
    }
  }, [counting])
}
