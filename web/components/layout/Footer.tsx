import Link from "next/link"

const FOOTER_LINKS = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Team", href: "#team" },
  { label: "Partners", href: "#partners" },
  { label: "Contact", href: "#contact" },
  { label: "Client Portal", href: "/login" },
]

export function Footer() {
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
              Strategic advisory at the intersection of capital, geopolitics, and cross-border policy.
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex flex-wrap gap-x-8 gap-y-4" aria-label="Footer navigation">
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
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
            © {new Date().getFullYear()} CJPA Global Advisors. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-[#A8B0C0]/60 hover:text-[#A8B0C0] text-[10px] tracking-[0.1em] font-sans transition-colors cursor-pointer">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-[#A8B0C0]/60 hover:text-[#A8B0C0] text-[10px] tracking-[0.1em] font-sans transition-colors cursor-pointer">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
