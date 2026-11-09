import { useEffect, useRef, useState } from 'react'
import HanziWriter from 'hanzi-writer'
import { strokeDataUrl } from '../data/hanzi.js'

// Hanzi Writer attend des couleurs hexadécimales : celles du thème (index.css).
function themeColor(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(`--color-${name}`).trim()
}

function loadCharData(char, onLoad, onError) {
  fetch(strokeDataUrl(char))
    .then(res => (res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`))))
    .then(onLoad, onError)
}

/**
 * Case d'écriture (田字格) avec Hanzi Writer.
 * mode 'animate' : montre l'ordre des traits (relancé quand runKey change), clé en couleur si showRadical.
 * mode 'quiz' : le caractère se trace au doigt ; outline affiche le modèle ; onMistake(total), onComplete(total).
 */
export function HanziBoard({ char, mode, outline = false, showRadical = false, runKey = 0, onMistake, onComplete }) {
  const ref = useRef(null)
  const [size] = useState(() => Math.min(300, window.innerWidth - 40)) // toute la largeur utile, 300 px au plus
  const [failed, setFailed] = useState(false)
  // Rappels lus au moment de l'événement : la case n'est pas recréée quand le parent change ses fonctions.
  const callbacks = useRef({})
  useEffect(() => {
    callbacks.current = { onMistake, onComplete }
  })

  useEffect(() => {
    const el = ref.current
    const writer = HanziWriter.create(el, char, {
      width: size,
      height: size,
      padding: 12,
      showCharacter: false,
      showOutline: mode === 'animate' || outline,
      strokeColor: themeColor('fg'),
      radicalColor: showRadical ? themeColor('accent') : null,
      outlineColor: themeColor('raised-2'),
      highlightColor: themeColor('accent'),
      drawingColor: themeColor('fg-2'),
      drawingWidth: 6,
      strokeAnimationSpeed: 1.2,
      delayBetweenStrokes: 200,
      charDataLoader: loadCharData,
      onLoadCharDataError: () => setFailed(true),
    })
    if (mode === 'animate') {
      writer.animateCharacter()
    } else {
      writer.quiz({
        showHintAfterMisses: 3,
        onMistake: data => callbacks.current.onMistake?.(data.totalMistakes),
        onComplete: data => callbacks.current.onComplete?.(data.totalMistakes),
      })
    }
    return () => {
      writer.cancelQuiz()
      writer.pauseAnimation()
      el.replaceChildren()
    }
  }, [char, mode, outline, showRadical, runKey, size])

  return (
    <div className="relative mx-auto touch-none select-none rounded-2xl border border-line bg-card" style={{ width: size, height: size }}>
      <svg className="pointer-events-none absolute inset-0 text-line-2" width={size} height={size} aria-hidden="true">
        <g stroke="currentColor" strokeWidth="1" strokeDasharray="4 6">
          <line x1="0" y1={size / 2} x2={size} y2={size / 2} />
          <line x1={size / 2} y1="0" x2={size / 2} y2={size} />
          <line x1="0" y1="0" x2={size} y2={size} />
          <line x1={size} y1="0" x2="0" y2={size} />
        </g>
      </svg>
      {failed ? (
        <p className="hanzi-display absolute inset-0 flex items-center justify-center text-[160px] leading-none text-fg">{char}</p>
      ) : (
        <div ref={ref} className="absolute inset-0" />
      )}
    </div>
  )
}
