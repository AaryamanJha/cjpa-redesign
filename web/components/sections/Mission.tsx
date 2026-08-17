"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"

const EASE = [0.25, 0.1, 0.25, 1] as const

export function Mission() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section
      id="mission"
      className="relative overflow-hidden bg-[#101827] py-28 lg:py-36"
    >
      {/* Subtle grid — the site's established "global network" visual
          language, used instead of a generic stock landscape photo. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(#C8A96A 1px, transparent 1px), linear-gradient(90deg, #C8A96A 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#101827]"
      />

      <div ref={ref} className="relative mx-auto max-w-4xl px-6 text-center lg:px-10">
        <motion.span
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
          className="text-[#C8A96A] font-sans font-medium uppercase tracking-[0.3em]"
          style={{ fontSize: "11px" }}
        >
          Mission
        </motion.span>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
          className="mt-8 font-display text-[#F5F1E8] font-normal italic leading-[1.25]"
          style={{ fontSize: "clamp(26px, 3.6vw, 40px)" }}
        >
          &ldquo;Bridging cultures and diversity through integrity, respect,
          and an unwavering commitment to our clients.&rdquo;
        </motion.p>

        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={inView ? { scaleX: 1, opacity: 0.3 } : {}}
          transition={{ duration: 1, delay: 0.4, ease: EASE }}
          className="mx-auto mt-10 h-px w-16 bg-[#C8A96A]"
        />
      </div>
    </section>
  )
}
