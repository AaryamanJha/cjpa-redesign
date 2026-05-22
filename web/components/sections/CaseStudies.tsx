"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"

const EASE = [0.25, 0.1, 0.25, 1] as const

const ENGAGEMENTS = [
  {
    number: "01",
    type: "Sovereign Debt Advisory",
    region: "West Africa",
    description:
      "A West African government engaged CJPA during IMF Article IV consultations and concurrent bilateral debt renegotiations with creditor nations. Our principals provided direct counsel at the minister level, navigating the intersection of conditionality, domestic political constraints, and creditor-bloc dynamics.",
    outcome: "$2.4B debt relief framework structured. Creditor consensus secured ahead of Paris Club review.",
  },
  {
    number: "02",
    type: "Cross-Border Investment Strategy",
    region: "Gulf Cooperation Council",
    description:
      "A North American alternative asset manager sought strategic entry into GCC sovereign infrastructure markets. CJPA delivered a regulatory feasibility assessment and facilitated principal-level introductions across three Gulf ministries, navigating foreign ownership frameworks and investment authority mandates.",
    outcome: "Regulatory pathway identified across three jurisdictions. Mandate formalized within six months of engagement.",
  },
  {
    number: "03",
    type: "Geopolitical Risk Assessment",
    region: "Southeast Asia",
    description:
      "A multilateral development institution commissioned CJPA to produce a geopolitical risk overlay for proposed digital infrastructure investments across ASEAN member states. Our assessment integrated political transition risk, technology sovereignty dynamics, and bilateral security considerations.",
    outcome: "Country-by-country risk matrix delivered. Findings informed a $400M allocation decision.",
  },
]

function EngagementCard({
  engagement,
  delay,
}: {
  engagement: (typeof ENGAGEMENTS)[number]
  delay: number
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 22 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: EASE }}
      className="flex flex-col border border-[#C8A96A]/10 bg-[#070B14] hover:border-[#C8A96A]/20 transition-colors duration-500"
    >
      <div className="px-8 py-7 border-b border-[#C8A96A]/08 flex items-start justify-between gap-4">
        <div>
          <span
            className="text-[#C8A96A]/40 font-sans font-medium block mb-3"
            style={{ fontSize: "12px", letterSpacing: "0.12em" }}
          >
            {engagement.number}
          </span>
          <p
            className="text-[#A8B0C0]/60 font-sans uppercase tracking-[0.18em] mb-1"
            style={{ fontSize: "10px" }}
          >
            {engagement.type}
          </p>
          <h3
            className="font-serif text-[#F5F1E8] font-light leading-snug"
            style={{ fontSize: "clamp(20px, 2vw, 26px)" }}
          >
            {engagement.region}
          </h3>
        </div>
        <span
          className="shrink-0 mt-1 border border-[#C8A96A]/20 text-[#C8A96A]/60 font-sans uppercase tracking-[0.12em] px-2.5 py-1"
          style={{ fontSize: "9px" }}
        >
          Confidential
        </span>
      </div>

      <div className="px-8 py-7 flex-1 flex flex-col gap-5">
        <p
          className="text-[#A8B0C0] font-sans font-light leading-[1.85]"
          style={{ fontSize: "15px" }}
        >
          {engagement.description}
        </p>

        <div className="border-l-2 border-[#C8A96A]/30 pl-4 mt-auto">
          <p
            className="text-[#A8B0C0]/50 font-sans uppercase mb-1"
            style={{ fontSize: "9px", letterSpacing: "0.2em" }}
          >
            Outcome
          </p>
          <p
            className="text-[#C8A96A]/80 font-sans font-light leading-relaxed"
            style={{ fontSize: "13px" }}
          >
            {engagement.outcome}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

export function CaseStudies() {
  const lineRef = useRef(null)
  const lineInView = useInView(lineRef, { once: true, margin: "-60px" })
  const headerRef = useRef(null)
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" })

  return (
    <section id="impact" className="relative bg-[#070B14] py-28 lg:py-36">
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
                Track Record
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 18 }}
              animate={headerInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
              className="font-serif text-[#F5F1E8] font-light leading-[1.06]"
              style={{ fontSize: "clamp(38px, 5vw, 64px)" }}
            >
              Selected
              <br />
              <em className="not-italic text-[#F5F1E8]/80">Engagements</em>
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.75, delay: 0.2, ease: EASE }}
            className="text-[#A8B0C0] font-sans font-light leading-[1.85]"
            style={{ fontSize: "15px" }}
          >
            All client engagements are treated as strictly confidential. The
            representative examples below illustrate the nature of our work
            without disclosing the identity of the organizations we serve.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {ENGAGEMENTS.map((eng, i) => (
            <EngagementCard key={eng.number} engagement={eng} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  )
}
