"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { translations, type Locale, type Translations } from "@/lib/translations"

interface LanguageContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: Translations
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

const STORAGE_KEY = "cjpa_lang"

function isLocale(value: string | null): value is Locale {
  return value === "en" || value === "es" || value === "zh-CN" || value === "zh-TW"
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en")

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (isLocale(stored)) setLocaleState(stored)
  }, [])

  function setLocale(next: Locale) {
    setLocaleState(next)
    localStorage.setItem(STORAGE_KEY, next)
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t: translations[locale] }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider")
  return ctx
}
