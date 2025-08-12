'use client'

import { useState, useEffect, createContext, useContext } from 'react'
import { translations, type Translation } from '@/lib/translations'

type Language = 'en' | 'es'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: Translation
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

export function useLanguageState() {
  const [language, setLanguageState] = useState<Language>('en')

  useEffect(() => {
    // First check localStorage for saved preference
    const savedLanguage = localStorage.getItem('language') as Language
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'es')) {
      setLanguageState(savedLanguage)
      return
    }

    // Detect browser/system language
    const browserLang = navigator.language || (navigator as any).userLanguage || 'en'
    const detectedLang = browserLang.toLowerCase().startsWith('es') ? 'es' : 'en'
    setLanguageState(detectedLang)
    localStorage.setItem('language', detectedLang)
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('language', lang)
  }

  const t = translations[language]

  return { language, setLanguage, t }
}