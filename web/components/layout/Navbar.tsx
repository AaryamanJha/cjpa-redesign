"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"
import { ThemeToggle } from "@/components/theme/ThemeToggle"

const NAV_LINKS = [
  { label: "About",        id: "about"        },
  { label: "Services",     id: "services"     },
  { label: "Team",         id: "team"         },
  { label: "Impact",       id: "impact"       },
  { label: "Insights",     id: "insights"     },
  { label: "Publications", id: "publications" },
  { label: "Partners",     id: "partners"     },
  { label: "Contact",      id: "contact"      },
]

function scrollTo(id: string, onDone?: () => void) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: "smooth" })
  onDone?.()
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
      className={[
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-[#070B14]/95 backdrop-blur-md border-b border-[#C8A96A]/10"
          : "bg-transparent",
      ].join(" ")}
    >
      <nav className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex flex-col leading-none group shrink-0" aria-label="CJPA Global Advisors home">
          <span
            className="font-serif text-[#F5F1E8] font-medium tracking-[0.18em] transition-colors duration-300 group-hover:text-white"
            style={{ fontSize: "22px" }}
          >
            CJPA
          </span>
          <span
            className="text-[#C8A96A] uppercase font-sans font-light mt-0.5 tracking-[0.38em] transition-colors duration-300 group-hover:text-[#D4B97A]"
            style={{ fontSize: "9px" }}
          >
            Global Advisors
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-7">
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className="text-[#A8B0C0] hover:text-[#F5F1E8] uppercase font-sans font-medium tracking-[0.1em] transition-colors duration-200 cursor-pointer bg-transparent border-0 p-0 shrink-0"
              style={{ fontSize: "12px" }}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          <ThemeToggle compact />
          <Link
            href="/login"
            className="uppercase font-sans font-medium tracking-[0.16em] text-[#C8A96A] border border-[#C8A96A]/35 hover:border-[#C8A96A]/70 hover:bg-[#C8A96A]/6 px-4 py-2.5 transition-all duration-300 cursor-pointer"
            style={{ fontSize: "11px" }}
          >
            Portal
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden text-[#F5F1E8] hover:text-[#C8A96A] transition-colors cursor-pointer p-1"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="lg:hidden overflow-hidden bg-[#070B14]/98 backdrop-blur-md border-t border-[#C8A96A]/10"
          >
            <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col gap-6">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollTo(link.id, () => setMobileOpen(false))}
                  className="text-left text-[#A8B0C0] hover:text-[#F5F1E8] uppercase font-sans font-medium tracking-[0.14em] transition-colors cursor-pointer bg-transparent border-0 p-0"
                  style={{ fontSize: "14px" }}
                >
                  {link.label}
                </button>
              ))}
              <Link
                href="/login"
                className="uppercase font-sans font-medium tracking-[0.16em] text-[#C8A96A] border border-[#C8A96A]/35 hover:border-[#C8A96A]/70 px-5 py-3 text-center transition-all duration-300 cursor-pointer mt-2"
                style={{ fontSize: "13px" }}
              >
                Client Portal
              </Link>
              <div className="pt-1">
                <ThemeToggle />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
