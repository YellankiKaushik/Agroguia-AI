'use client'

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { Language, translations, LANGUAGE_OPTIONS } from './translations'

interface LanguageContextType {
  lang: Language
  setLang: (lang: Language) => void
  t: (key: string) => string
  speechLang: string
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  setLang: () => {},
  t: (key: string) => key,
  speechLang: 'en-IN',
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('en')

  const setLang = useCallback((l: Language) => {
    setLangState(l)
    if (typeof window !== 'undefined') localStorage.setItem('farmerOS_lang', l)
  }, [])

  useEffect(() => {
    const saved = localStorage.getItem('farmerOS_lang') as Language
    if (saved && ['en', 'hi', 'kn', 'te'].includes(saved)) setLangState(saved)
  }, [])

  const t = useCallback((key: string) => {
    return translations[lang]?.[key] ?? translations['en']?.[key] ?? key
  }, [lang])

  const speechLang = LANGUAGE_OPTIONS.find(o => o.code === lang)?.speechLang ?? 'en-IN'

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, speechLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)
