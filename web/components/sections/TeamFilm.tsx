"use client"

import { useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import { Play } from "lucide-react"

const EASE = [0.25, 0.1, 0.25, 1] as const

export function TeamFilm() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
  const [hovered, setHovered] = useState(false)

  return (
    <section className="relative bg-[#070B14] pb-20 lg:pb-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: EASE }}
          className="relative overflow-hidden cursor-pointer group"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{ aspectRatio: "16 / 7" }}
        >
          {/* Background gradient — cinematic dark */}
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(135deg, #060B13 0%, #0D1827 40%, #07111F 70%, #060A12 100%)",
            }}
          />

          {/* Subtle grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(200,169,106,1) 1px, transparent 1px), linear-gradient(90deg, rgba(200,169,106,1) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />

          {/* Vignette */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 30%, rgba(6,10,19,0.7) 100%)",
            }}
          />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
            {/* Play button */}
            <motion.div
              animate={{ scale: hovered ? 1.08 : 1 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="relative"
            >
              <div
                className="w-16 h-16 lg:w-20 lg:h-20 rounded-full border border-[#C8A96A]/30 flex items-center justify-center"
                style={{ background: "rgba(200,169,106,0.07)" }}
              >
                <Play
                  size={20}
                  strokeWidth={1.5}
                  className="text-[#C8A96A] ml-1"
                  fill="rgba(200,169,106,0.4)"
                />
              </div>
              {/* Pulse ring */}
              <motion.div
                className="absolute inset-0 rounded-full border border-[#C8A96A]/15"
                animate={hovered ? { scale: 1.5, opacity: 0 } : { scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </motion.div>

            <div className="text-center">
              <p
                className="text-[#A8B0C0]/40 font-sans uppercase tracking-[0.28em] mb-2"
                style={{ fontSize: "10px" }}
              >
                CJPA Global Advisors
              </p>
              <p
                className="font-serif text-[#F5F1E8]/70 font-light"
                style={{ fontSize: "clamp(18px, 2.5vw, 32px)" }}
              >
                Our Approach to Global Advisory
              </p>
            </div>
          </div>

          {/* Bottom label */}
          <div className="absolute bottom-5 left-6 right-6 flex items-center justify-between">
            <span
              className="text-[#A8B0C0]/25 font-sans"
              style={{ fontSize: "11px", letterSpacing: "0.12em" }}
            >
              Video coming soon
            </span>
            <span
              className="text-[#C8A96A]/20 font-sans uppercase"
              style={{ fontSize: "10px", letterSpacing: "0.2em" }}
            >
              Principal Message
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
