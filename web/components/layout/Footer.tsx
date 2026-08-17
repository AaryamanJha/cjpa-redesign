"use client"

import Link from "next/link"
import { FaLinkedinIn, FaFacebookF, FaXTwitter, FaInstagram } from "react-icons/fa6"
import { Newspaper } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"

const SOCIAL_LINKS = [
  { label: "LinkedIn", href: "https://www.linkedin.com/company/cjpa-global-advisors/", Icon: FaLinkedinIn },
  { label: "Facebook", href: "https://www.facebook.com/people/CJPA-Global-Advisors-LLC/61550040057719/", Icon: FaFacebookF },
  { label: "X (Twitter)", href: "https://x.com/CJPAglobal", Icon: FaXTwitter },
  { label: "Instagram", href: "https://www.instagram.com/cjpa_global/", Icon: FaInstagram },
  { label: "Forbes Column", href: "https://www.forbes.com/sites/earlcarr/?sh=45c4157c6429", Icon: Newspaper },
]

export function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="border-t border-[#C8A96A]/10 bg-[#070B14]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-12">
          {/* Brand */}
          <div className="flex flex-col gap-3 max-w-xs">
            <div className="flex flex-col leading-none">
              <span className="font-serif text-[#F5F1E8] text-lg font-medium tracking-[0.18em]">
                CJPA
              </span>
              <span className="text-[#C8A96A] text-[8px] tracking-[0.38em] uppercase font-sans font-light mt-0.5">
                Global Advisors
              </span>
            </div>
            <p className="text-[#A8B0C0] text-[13px] leading-relaxed font-sans mt-2">
              {t.footer.tagline}
            </p>

            {/* Social links */}
            <div className="flex flex-col gap-3 mt-4">
              <span className="text-[#A8B0C0]/50 text-[9px] tracking-[0.24em] uppercase font-sans font-medium">
                {t.footer.followUs}
              </span>
              <div className="flex items-center gap-3">
                {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    title={label}
                    className="flex h-8 w-8 items-center justify-center border border-[#C8A96A]/20 text-[#A8B0C0] hover:text-[#C8A96A] hover:border-[#C8A96A]/50 transition-colors duration-200 cursor-pointer"
                  >
                    <Icon size={13} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-wrap gap-x-8 gap-y-4" aria-label="Footer navigation">
            {t.footer.nav.map((link) => (
              <Link
                key={link.href ?? link.id}
                href={link.href ?? `#${link.id}`}
                className="text-[#A8B0C0] hover:text-[#F5F1E8] text-[12px] tracking-[0.14em] uppercase font-sans transition-colors duration-200 cursor-pointer"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-[#C8A96A]/8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-[#A8B0C0]/60 text-[10px] tracking-[0.1em] font-sans">
            © {new Date().getFullYear()} CJPA Global Advisors. {t.footer.rights}
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-[#A8B0C0]/60 hover:text-[#A8B0C0] text-[10px] tracking-[0.1em] font-sans transition-colors cursor-pointer">
              {t.footer.privacy}
            </Link>
            <Link href="/terms" className="text-[#A8B0C0]/60 hover:text-[#A8B0C0] text-[10px] tracking-[0.1em] font-sans transition-colors cursor-pointer">
              {t.footer.terms}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
