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
          key={opt.code}
          onClick={() => setLang(opt.code as Language)}
          className={`rounded-md transition-colors font-medium ${size === 'lg' ? 'px-4 py-2 text-sm' : 'px-2 py-1 text-xs'} ${lang === opt.code ? 'bg-primary text-primary-foreground' : 'bg-secondary/60 text-foreground hover:bg-secondary'}`}
        >
          {opt.native}
        </button>
      ))}
    </div>
  )
}
