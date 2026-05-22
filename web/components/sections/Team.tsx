"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { TeamShowcase } from "@/components/ui/team-showcase"

const EASE = [0.25, 0.1, 0.25, 1] as const

export function Team() {
  const lineRef = useRef(null)
  const lineInView = useInView(lineRef, { once: true, margin: "-60px" })
  const headerRef = useRef(null)
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" })
  const showcaseRef = useRef(null)
  const showcaseInView = useInView(showcaseRef, { once: true, margin: "-60px" })

  return (
    <section id="team" className="relative bg-[#070B14] py-28 lg:py-36">
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
        <div
          ref={headerRef}
          className="mb-16 lg:mb-20 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8"
        >
          <div className="max-w-xl">
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
                Meet the Team
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 18 }}
              animate={headerInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
              className="font-serif text-[#F5F1E8] font-light leading-[1.06]"
              style={{ fontSize: "clamp(38px, 5vw, 64px)" }}
            >
              Senior Practitioners,
              <br />
              <em className="not-italic text-[#F5F1E8]/80">Not Consultants</em>
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.75, delay: 0.2, ease: EASE }}
            className="text-[#A8B0C0] font-sans font-light leading-[1.8] max-w-sm lg:text-right"
            style={{ fontSize: "15px" }}
          >
            Every engagement is led by a principal — a former senior government
            official, central banker, or institutional leader — not delegated to
            junior analysts.
          </motion.p>
        </div>

        {/* Team showcase with hover interaction */}
        <motion.div
          ref={showcaseRef}
          initial={{ opacity: 0, y: 24 }}
          animate={showcaseInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <TeamShowcase />
        </motion.div>
      </div>
    </section>
  )
}
