"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Mic, BookOpen } from "lucide-react"

const EASE = [0.25, 0.1, 0.25, 1] as const

const BOOKS = [
  {
    title: "Strategic Alliances in a Multipolar World",
    year: "2024",
    subtitle: "Carlton J. Porter",
    description:
      "An examination of how shifting power dynamics are reshaping alliance frameworks, cross-border investment flows, and the architecture of international diplomacy. Drawing on three decades of senior government experience, this work charts the strategic logic behind the realignment of global partnerships.",
    tag: "Geopolitics & Strategy",
  },
  {
    title: "Navigating Capital in the New Geopolitical Order",
    year: "2022",
    subtitle: "Carlton J. Porter",
    description:
      "A practitioner's guide to cross-border investment strategy in environments defined by regulatory volatility, great-power competition, and the erosion of post-Cold War institutional consensus. Required reading for principals operating at the intersection of finance and foreign policy.",
    tag: "Capital & Investment",
  },
]

const MEDIA = [
  {
    show: "The Geopolitics Brief",
    episode: "Sovereign Advisory in the Post-Unipolar Era",
    description: "A deep examination of how advisory mandates are evolving as the G7 consensus fractures and new creditor blocs assert influence over emerging market debt.",
  },
  {
    show: "Capital & Power",
    episode: "When Finance Meets Foreign Policy",
    description: "On the growing convergence between capital allocation decisions and geopolitical calculus — and what it means for institutional investors navigating strategic risk.",
  },
  {
    show: "Global Risk Forum",
    episode: "The IMF, Debt, and the Politics of Restructuring",
    description: "A frank conversation on how multilateral institutions are adapting to a world in which bilateral creditors increasingly set the terms of sovereign debt relief.",
  },
  {
    show: "Emerging Markets Quarterly",
    episode: "The Future of Cross-Border Capital",
    description: "Examining the structural forces — regulatory, political, and technological — that will define the next decade of cross-border capital movement across emerging economies.",
  },
]

export function Publications() {
  const lineRef = useRef(null)
  const lineInView = useInView(lineRef, { once: true, margin: "-60px" })
  const headerRef = useRef(null)
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" })
  const booksRef = useRef(null)
  const booksInView = useInView(booksRef, { once: true, margin: "-60px" })
  const mediaRef = useRef(null)
  const mediaInView = useInView(mediaRef, { once: true, margin: "-60px" })

  return (
    <section id="publications" className="relative bg-[#070B14] py-28 lg:py-36">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <motion.div
          ref={lineRef}
          className="h-px bg-[#C8A96A] origin-left mb-16 lg:mb-20"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={lineInView ? { scaleX: 1, opacity: 0.2 } : {}}
          transition={{ duration: 1.1, ease: EASE }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <div ref={headerRef} className="mb-16 lg:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="h-px w-6 bg-[#C8A96A] opacity-50" />
            <span
              className="text-[#C8A96A] font-sans font-medium uppercase tracking-[0.3em]"
              style={{ fontSize: "11px" }}
            >
              Publications
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
            className="font-serif text-[#F5F1E8] font-light leading-[1.06]"
            style={{ fontSize: "clamp(38px, 5vw, 64px)" }}
          >
            Books &amp; Media
            <br />
            <em className="not-italic text-[#F5F1E8]/80">Appearances</em>
          </motion.h2>
        </div>

        {/* ── Books ── */}
        <div ref={booksRef} className="mb-20 lg:mb-28">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={booksInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: EASE }}
            className="text-[#A8B0C0]/40 font-sans uppercase mb-8"
            style={{ fontSize: "10px", letterSpacing: "0.25em" }}
          >
            Books by Carlton J. Porter
          </motion.p>

          <div className="grid sm:grid-cols-2 gap-6 lg:gap-8">
            {BOOKS.map((book, i) => (
              <motion.div
                key={book.title}
                initial={{ opacity: 0, y: 22 }}
                animate={booksInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: i * 0.1, ease: EASE }}
                className="flex gap-0 border border-[#C8A96A]/10 bg-[#070B14] hover:border-[#C8A96A]/20 transition-colors duration-500 cursor-pointer group"
              >
                {/* Spine */}
                <div
                  className="w-1.5 shrink-0 bg-gradient-to-b from-[#C8A96A]/60 to-[#C8A96A]/15"
                  style={{ minHeight: "220px" }}
                />

                <div className="flex-1 p-7 flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-1.5">
                      <BookOpen size={12} strokeWidth={1.5} className="text-[#C8A96A]/50" />
                      <span
                        className="text-[#C8A96A]/50 font-sans uppercase"
                        style={{ fontSize: "10px", letterSpacing: "0.15em" }}
                      >
                        {book.tag}
                      </span>
                    </div>
                    <span
                      className="text-[#A8B0C0]/30 font-sans shrink-0"
                      style={{ fontSize: "13px" }}
                    >
                      {book.year}
                    </span>
                  </div>

                  <h3
                    className="font-serif text-[#F5F1E8] font-light leading-snug group-hover:text-white transition-colors"
                    style={{ fontSize: "clamp(18px, 1.8vw, 24px)" }}
                  >
                    {book.title}
                  </h3>

                  <p
                    className="text-[#A8B0C0]/70 font-sans font-light leading-[1.8]"
                    style={{ fontSize: "14px" }}
                  >
                    {book.description}
                  </p>

                  <p
                    className="text-[#A8B0C0]/40 font-sans italic mt-auto"
                    style={{ fontSize: "13px" }}
                  >
                    — {book.subtitle}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Media / Podcasts ── */}
        <div ref={mediaRef}>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={mediaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: EASE }}
            className="text-[#A8B0C0]/40 font-sans uppercase mb-8"
            style={{ fontSize: "10px", letterSpacing: "0.25em" }}
          >
            Podcast &amp; Media Appearances
          </motion.p>

          <div className="grid sm:grid-cols-2 gap-4 lg:gap-6">
            {MEDIA.map((item, i) => (
              <motion.div
                key={item.episode}
                initial={{ opacity: 0, y: 18 }}
                animate={mediaInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }}
                className="group border border-[#C8A96A]/08 bg-[#0A0F1C] hover:border-[#C8A96A]/18 hover:bg-[#0D1420] transition-all duration-300 p-6 cursor-pointer"
              >
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 rounded-full bg-[#C8A96A]/08 border border-[#C8A96A]/15 flex items-center justify-center shrink-0">
                    <Mic size={13} strokeWidth={1.5} className="text-[#C8A96A]/60" />
                  </div>
                  <p
                    className="text-[#C8A96A]/60 font-sans uppercase"
                    style={{ fontSize: "10px", letterSpacing: "0.15em" }}
                  >
                    {item.show}
                  </p>
                </div>

                <h4
                  className="font-display text-[#F5F1E8] font-normal leading-snug mb-3 group-hover:text-white transition-colors"
                  style={{ fontSize: "clamp(15px, 1.5vw, 18px)" }}
                >
                  {item.episode}
                </h4>

                <p
                  className="text-[#A8B0C0]/55 font-sans font-light leading-[1.75]"
                  style={{ fontSize: "13px" }}
                >
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
