import { useState, useRef, useEffect } from 'react'

export function AnswerInput({ onSubmit, disabled, placeholder }) {
  const [value, setValue] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    if (!disabled) {
      setValue('')
      inputRef.current?.focus()
    }
  }, [disabled])

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !disabled && value.trim()) {
      onSubmit(value)
    }
  }

  const ready = !disabled && value.trim()

  return (
    <div className="flex gap-2">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder={placeholder}
        className="h-12 min-w-0 flex-1 rounded-[10px] border border-line bg-card px-4 text-base text-fg outline-none transition-colors duration-150 ease-out placeholder:text-fg-3 focus:border-line-2 focus:bg-raised disabled:text-fg-3"
        autoCapitalize="none"
        autoCorrect="off"
        autoComplete="off"
        spellCheck={false}
      />
      <button
        type="button"
        onClick={() => ready && onSubmit(value)}
        disabled={!ready}
        className="h-12 shrink-0 rounded-[10px] bg-seal px-5 text-base font-medium text-white transition-[background-color,color,transform] duration-150 ease-out hover:bg-seal-hover active:scale-[0.98] disabled:bg-raised disabled:text-fg-3 disabled:active:scale-100"
      >
        Valider
      </button>
    </div>
  )
}
