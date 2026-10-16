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
        className={`flex-1 bg-slate-800 border rounded-xl px-4 py-3 text-white text-base outline-none transition-colors
          ${disabled ? 'border-slate-700 text-slate-500' : 'border-slate-600 focus:border-red-500'}
        `}
        autoCapitalize="none"
        autoCorrect="off"
        autoComplete="off"
        spellCheck={false}
      />
      <button
        onClick={() => value.trim() && !disabled && onSubmit(value)}
        disabled={disabled || !value.trim()}
        className={`px-5 py-3 rounded-xl font-semibold transition-all ${
          !disabled && value.trim()
            ? 'bg-red-600 hover:bg-red-500 text-white'
            : 'bg-slate-800 text-slate-500 cursor-not-allowed'
        }`}
      >
        OK
      </button>
    </div>
  )
}
