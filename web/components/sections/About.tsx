"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"

const EASE = [0.25, 0.1, 0.25, 1] as const

function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 22 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

const STATS = [
  { value: "25+", label: "Years of founder experience\nacross finance and global affairs" },
  { value: "16+", label: "Years of senior China, Southeast Asia\nand U.S. operating experience" },
  { value: "30+", label: "Years of legal and capital markets\nexperience on the advisory bench" },
  { value: "6", label: "Core specializations across risk,\ntrade, ESG, and financial literacy" },
]

export function About() {
  const lineRef = useRef(null)
  const lineInView = useInView(lineRef, { once: true, margin: "-60px" })

  return (
    <section id="about" className="relative bg-[#070B14] py-28 lg:py-36">
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
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-16 lg:gap-24">

          {/* Left — Editorial copy */}
          <div className="flex flex-col gap-10">
            {/* Section label */}
            <Reveal delay={0}>
              <div>
                <span
                  className="text-[#C8A96A] font-sans font-medium uppercase tracking-[0.3em]"
                  style={{ fontSize: "11px" }}
                >
                  About
                </span>
              </div>
            </Reveal>

            {/* Headline */}
            <Reveal delay={0.1}>
              <h2
                className="font-serif text-[#F5F1E8] font-light leading-[1.06]"
                style={{ fontSize: "clamp(38px, 5vw, 64px)" }}
              >
                Data-Driven Counsel for
                <br />
                <em className="not-italic text-[#F5F1E8]/85">
                  Global Market Complexity
                </em>
              </h2>
            </Reveal>

            {/* Body */}
            <div className="flex flex-col gap-5">
              <Reveal delay={0.2}>
                <p
                  className="text-[#A8B0C0] font-sans font-light leading-[1.85]"
                  style={{ fontSize: "16px" }}
                >
                  CJPA Global Advisors is an international consulting and advisory
                  company dedicated to data-driven scenario planning, strategic
                  advisory, and geopolitical analysis for clients navigating the
                  dynamics of globalization.
                </p>
              </Reveal>
              <Reveal delay={0.28}>
                <p
                  className="text-[#A8B0C0] font-sans font-light leading-[1.85]"
                  style={{ fontSize: "16px" }}
                >
                  The firm began as a global research unit and grew into a
                  multidisciplinary consultancy informed by global finance, policy,
                  and research best practices. CJPA helps clients understand major
                  geopolitical events, cultural dynamics, and supply chain
                  disruption risks.
                </p>
              </Reveal>
            </div>

            {/* Pull quote — Playfair Display */}
            <Reveal delay={0.35}>
              <blockquote className="border-l-2 border-[#C8A96A]/50 pl-6 py-1">
                <p
                  className="font-display text-[#F5F1E8]/80 font-normal italic leading-[1.5]"
                  style={{ fontSize: "clamp(20px, 2.4vw, 28px)" }}
                >
                  &ldquo;Connecting global insight, people, capital, and resources.&rdquo;
                </p>
              </blockquote>
            </Reveal>
          </div>

          {/* Right — Stats grid */}
          <div className="grid grid-cols-2 gap-px bg-[#C8A96A]/8 border border-[#C8A96A]/8 self-start mt-4 lg:mt-16">
            {STATS.map((stat, i) => (
              <Reveal key={stat.value} delay={0.15 + i * 0.08}>
                <div className="bg-[#070B14] p-8 lg:p-10 flex flex-col gap-3">
                  <span
                    className="font-serif text-[#C8A96A] font-light leading-none"
                    style={{ fontSize: "clamp(48px, 5.5vw, 72px)" }}
                  >
                    {stat.value}
                  </span>
                  <span
                    className="text-[#A8B0C0] font-sans font-light leading-[1.5]"
                    style={{ fontSize: "13px", letterSpacing: "0.04em", whiteSpace: "pre-line" }}
                  >
                    {stat.label}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
