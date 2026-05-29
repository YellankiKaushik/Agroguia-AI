'use client'

import React from 'react'
import { useLanguage } from './LanguageContext'
import { LANGUAGE_OPTIONS } from './translations'
import type { Language } from './translations'

interface LanguageSelectorProps {
  size?: 'sm' | 'lg'
}

export default function LanguageSelector({ size = 'sm' }: LanguageSelectorProps) {
  const { lang, setLang } = useLanguage()

  return (
    <div className="flex items-center gap-1">
      {LANGUAGE_OPTIONS.map(opt => (
        <button
          type="button"
          key={opt.code}
          onClick={() => setLang(opt.code as Language)}
          aria-pressed={lang === opt.code}
          aria-label={`Switch language to ${opt.label}`}
          className={`rounded-md font-medium transition-all duration-300 ${size === 'lg' ? 'px-4 py-2 text-sm' : 'px-2 py-1 text-xs'} ${lang === opt.code ? 'bg-emerald-200 text-slate-950' : 'bg-white/[0.035] text-slate-400 hover:bg-white/10 hover:text-white'}`}
        >
          {opt.native}
        </button>
      ))}
    </div>
  )
}
