"use client"

import { Logos3 } from "@/components/ui/logos3"
import { useLanguage } from "@/contexts/LanguageContext"

const HEADING_BY_LOCALE: Record<string, { eyebrow: string; heading: string }> = {
  en: { eyebrow: "Partners", heading: "Partners and Clients" },
  es: { eyebrow: "Socios", heading: "Socios y Clientes" },
  "zh-CN": { eyebrow: "合作伙伴", heading: "合作伙伴与客户" },
  "zh-TW": { eyebrow: "合作夥伴", heading: "合作夥伴與客戶" },
}

export function CaseStudies() {
  const { locale } = useLanguage()
  const copy = HEADING_BY_LOCALE[locale]

  return (
    <section id="impact" className="relative bg-[#070B14]">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="h-px bg-[#C8A96A]/20" />
      </div>
      <Logos3
        eyebrow={copy.eyebrow}
        heading={copy.heading}
        className="bg-[#070B14]"
      />
    </section>
  )
}
