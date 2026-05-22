"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"

const EASE = [0.25, 0.1, 0.25, 1] as const

const TRACKS = [
  {
    number: "01",
    title: "Strategic Mandate",
    description:
      "For organizations requiring focused, time-defined counsel on a specific challenge — regulatory clearance, market entry assessment, political risk evaluation, or preparation for high-stakes diplomatic engagement. We engage at principal level from day one.",
  },
  {
    number: "02",
    title: "Principal Advisory Retainer",
    description:
      "An ongoing relationship providing sustained access to senior judgment across evolving political, regulatory, and capital market environments. Retainer clients benefit from priority access to our principals and continuous geopolitical intelligence.",
  },
  {
    number: "03",
    title: "Transaction Intelligence",
    description:
      "Embedded advisory support on cross-border transactions, foreign investment reviews, sovereign debt negotiations, and multi-jurisdictional M&A requiring geopolitical depth that conventional financial advisors cannot provide.",
  },
]

const CLIENT_TYPES = [
  "Sovereign Governments",
  "Central Banks",
  "Multilateral Institutions",
  "Development Finance",
  "Global Asset Managers",
  "Multinational Corporations",
  "Private Equity & Infrastructure",
  "Family Offices",
]

function TrackCard({
  track,
  delay,
}: {
  track: (typeof TRACKS)[number]
  delay: number
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, delay, ease: EASE }}
      className="flex flex-col gap-5 border-t border-[#C8A96A]/12 pt-8"
    >
      <span
        className="text-[#C8A96A]/50 font-sans font-medium"
        style={{ fontSize: "12px", letterSpacing: "0.12em" }}
      >
        {track.number}
      </span>
      {/* Track title — Playfair Display */}
      <h3
        className="font-display text-[#F5F1E8] font-normal leading-snug"
        style={{ fontSize: "clamp(22px, 2.2vw, 30px)" }}
      >
        {track.title}
      </h3>
      <p
        className="text-[#A8B0C0] font-sans font-light leading-[1.85]"
        style={{ fontSize: "15px" }}
      >
        {track.description}
      </p>
    </motion.div>
  )
}

export function Partners() {
  const lineRef = useRef(null)
  const lineInView = useInView(lineRef, { once: true, margin: "-60px" })
  const headerRef = useRef(null)
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" })
  const typesRef = useRef(null)
  const typesInView = useInView(typesRef, { once: true, margin: "-60px" })

  return (
    <section id="partners" className="relative bg-[#070B14] py-28 lg:py-36">
      {/* Top rule */}
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
        <div ref={headerRef} className="mb-16 lg:mb-20 grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-20 items-end">
          <div>
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
                Engagement
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 18 }}
              animate={headerInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
              className="font-serif text-[#F5F1E8] font-light leading-[1.06]"
              style={{ fontSize: "clamp(38px, 5vw, 64px)" }}
            >
              How Can We
              <br />
              <em className="not-italic text-[#F5F1E8]/80">Help You</em>
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.75, delay: 0.2, ease: EASE }}
            className="text-[#A8B0C0] font-sans font-light leading-[1.85]"
            style={{ fontSize: "15px" }}
          >
            Every engagement begins with a confidential conversation. We work exclusively
            with organizations where the quality of geopolitical and financial judgment
            is consequential — not advisory as a formality, but as a competitive necessity.
          </motion.p>
        </div>

        {/* Three tracks */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 mb-20 lg:mb-24">
          {TRACKS.map((track, i) => (
            <TrackCard key={track.number} track={track} delay={i * 0.1} />
          ))}
        </div>

        {/* Client types strip */}
        <motion.div
          ref={typesRef}
          initial={{ opacity: 0, y: 12 }}
          animate={typesInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE }}
          className="border-t border-[#C8A96A]/10 pt-10"
        >
          <p
            className="text-[#A8B0C0]/50 font-sans font-medium uppercase mb-6"
            style={{ fontSize: "10px", letterSpacing: "0.3em" }}
          >
            Organizations We Serve
          </p>
          <div className="flex flex-wrap gap-3">
            {CLIENT_TYPES.map((type) => (
              <span
                key={type}
                className="text-[#A8B0C0]/70 font-sans font-light border border-[#C8A96A]/12 px-4 py-2"
                style={{ fontSize: "13px", letterSpacing: "0.06em" }}
              >
                {type}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
