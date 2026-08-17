"use client"

import { useEffect, useRef, useState } from "react"
import { Globe } from "lucide-react"
import { locales } from "@/lib/translations"
import { useLanguage } from "@/contexts/LanguageContext"

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { locale, setLocale } = useLanguage()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const current = locales.find((l) => l.code === locale) ?? locales[0]

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onClickOutside)
    return () => document.removeEventListener("mousedown", onClickOutside)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Change language"
        aria-expanded={open}
        title="Language"
        className={[
          "inline-flex items-center justify-center gap-1.5 border border-[#C8A96A]/25 text-[#A8B0C0] hover:text-[#F5F1E8] hover:border-[#C8A96A]/50 transition-colors",
          compact ? "h-8 px-2.5" : "h-10 px-3",
        ].join(" ")}
      >
        <Globe size={compact ? 13 : 14} strokeWidth={1.5} />
        <span className="font-sans font-medium" style={{ fontSize: compact ? "10px" : "11px", letterSpacing: "0.08em" }}>
          {current.short}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 min-w-[150px] bg-[#0A0F1C] border border-[#C8A96A]/15 shadow-[0_20px_50px_rgba(0,0,0,0.45)] z-50">
          {locales.map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => {
                setLocale(l.code)
                setOpen(false)
              }}
              className={[
                "w-full text-left px-4 py-2.5 font-sans transition-colors cursor-pointer",
                l.code === locale
                  ? "text-[#C8A96A] bg-[#C8A96A]/8"
                  : "text-[#A8B0C0] hover:text-[#F5F1E8] hover:bg-[#C8A96A]/5",
              ].join(" ")}
              style={{ fontSize: "13px" }}
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
