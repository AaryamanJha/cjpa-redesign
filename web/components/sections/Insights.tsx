"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { ArrowUpRight } from "lucide-react"

const EASE = [0.25, 0.1, 0.25, 1] as const

const ARTICLES = [
  {
    tag: "Sovereign Finance",
    date: "March 2026",
    title: "The New Architecture of Sovereign Debt",
    excerpt:
      "As creditor concentration shifts away from Paris Club norms, governments are navigating an increasingly fragmented restructuring landscape — one defined by bilateral leverage, geopolitical conditionality, and the declining authority of multilateral frameworks.",
  },
  {
    tag: "Capital Strategy",
    date: "January 2026",
    title: "Geopolitical Risk in Private Capital Allocation",
    excerpt:
      "For institutional investors operating across emerging and frontier markets, the line between political risk and investment risk has effectively disappeared. We examine how leading allocators are restructuring their approach to cross-border exposure.",
  },
  {
    tag: "Digital Finance",
    date: "November 2025",
    title: "Digital Currency and Emerging Market Sovereignty",
    excerpt:
      "CBDC adoption timelines are accelerating across Sub-Saharan Africa and Southeast Asia. The implications for IMF program conditionality, cross-border capital flows, and monetary sovereignty are only beginning to be understood.",
  },
]

const PRESS = [
  { publication: "Foreign Affairs", headline: "Inside the New Wave of Sovereign Advisory", date: "April 2026" },
  { publication: "Financial Times", headline: "Advisory Firms Navigate the New Geopolitical Order", date: "March 2026" },
  { publication: "Council on Foreign Relations", headline: "Capital Strategy in an Era of Strategic Competition", date: "February 2026" },
  { publication: "Bloomberg", headline: "Cross-Border Advisory: Who Advises the Advisors?", date: "January 2026" },
  { publication: "IMF Blog", headline: "Debt Restructuring and the Role of Private Advisory", date: "December 2025" },
]

function ArticleCard({
  article,
  delay,
}: {
  article: (typeof ARTICLES)[number]
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
      className="group border-t border-[#C8A96A]/10 py-7 cursor-pointer hover:border-[#C8A96A]/25 transition-colors duration-300"
    >
      <div className="flex items-center gap-3 mb-4">
        <span
          className="text-[#C8A96A]/60 font-sans uppercase tracking-[0.18em]"
          style={{ fontSize: "10px" }}
        >
          {article.tag}
        </span>
        <span className="w-px h-3 bg-[#A8B0C0]/20" />
        <span
          className="text-[#A8B0C0]/40 font-sans"
          style={{ fontSize: "12px" }}
        >
          {article.date}
        </span>
      </div>

      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3
            className="font-display text-[#F5F1E8] font-normal leading-snug mb-3 group-hover:text-white transition-colors"
            style={{ fontSize: "clamp(18px, 1.8vw, 22px)" }}
          >
            {article.title}
          </h3>
          <p
            className="text-[#A8B0C0] font-sans font-light leading-[1.8]"
            style={{ fontSize: "14px" }}
          >
            {article.excerpt}
          </p>
        </div>
        <ArrowUpRight
          size={16}
          strokeWidth={1.5}
          className="text-[#C8A96A]/0 group-hover:text-[#C8A96A]/60 transition-colors shrink-0 mt-1"
        />
      </div>
    </motion.div>
  )
}

export function Insights() {
  const lineRef = useRef(null)
  const lineInView = useInView(lineRef, { once: true, margin: "-60px" })
  const headerRef = useRef(null)
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" })
  const pressRef = useRef(null)
  const pressInView = useInView(pressRef, { once: true, margin: "-60px" })

  return (
    <section id="insights" className="relative bg-[#070B14] py-28 lg:py-36">
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
              Insights
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
            className="font-serif text-[#F5F1E8] font-light leading-[1.06]"
            style={{ fontSize: "clamp(38px, 5vw, 64px)" }}
          >
            Perspectives on
            <br />
            <em className="not-italic text-[#F5F1E8]/80">the Global Order</em>
          </motion.h2>
        </div>

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-16 lg:gap-24">

          {/* Left — Articles */}
          <div>
            <p
              className="text-[#A8B0C0]/40 font-sans uppercase mb-2"
              style={{ fontSize: "10px", letterSpacing: "0.25em" }}
            >
              Recent Perspectives
            </p>
            <div>
              {ARTICLES.map((article, i) => (
                <ArticleCard key={article.title} article={article} delay={i * 0.1} />
              ))}
            </div>
          </div>

          {/* Right — Press */}
          <div ref={pressRef}>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={pressInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: EASE }}
              className="text-[#A8B0C0]/40 font-sans uppercase mb-8"
              style={{ fontSize: "10px", letterSpacing: "0.25em" }}
            >
              In the Press
            </motion.p>

            <div className="space-y-0">
              {PRESS.map((item, i) => (
                <motion.div
                  key={item.headline}
                  initial={{ opacity: 0, x: 12 }}
                  animate={pressInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.05 + i * 0.07, ease: EASE }}
                  className="group flex items-start justify-between gap-4 py-5 border-b border-[#C8A96A]/08 hover:border-[#C8A96A]/18 transition-colors cursor-pointer"
                >
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-[#C8A96A]/60 font-sans uppercase mb-1.5"
                      style={{ fontSize: "10px", letterSpacing: "0.15em" }}
                    >
                      {item.publication}
                    </p>
                    <p
                      className="text-[#A8B0C0] font-sans font-light leading-snug group-hover:text-[#F5F1E8] transition-colors"
                      style={{ fontSize: "14px" }}
                    >
                      {item.headline}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <ArrowUpRight
                      size={13}
                      strokeWidth={1.5}
                      className="text-[#C8A96A]/0 group-hover:text-[#C8A96A]/50 transition-colors"
                    />
                    <span
                      className="text-[#A8B0C0]/30 font-sans"
                      style={{ fontSize: "11px" }}
                    >
                      {item.date}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
