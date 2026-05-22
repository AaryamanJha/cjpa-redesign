"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const SPLASH_DURATION = 2800
const EASE_INSTITUTIONAL = [0.25, 0.1, 0.25, 1] as const

export function SplashScreen() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), SPLASH_DURATION)
    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="splash"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#070B14] overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: EASE_INSTITUTIONAL }}
          aria-hidden="true"
        >
          {/* Subtle noise texture overlay */}
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
              backgroundRepeat: "repeat",
              backgroundSize: "128px 128px",
            }}
          />

          {/* Gold horizontal rule — draws from center outward */}
          <motion.div
            className="absolute left-0 right-0 h-px bg-[#C8A96A]"
            style={{ top: "calc(50% - -10px)" }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 0.28 }}
            transition={{ duration: 0.9, delay: 0.15, ease: EASE_INSTITUTIONAL }}
          />

          {/* Wordmark block */}
          <div className="relative flex flex-col items-center select-none" style={{ marginTop: -50 }}>
            {/* CJPA */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.95, delay: 0.55, ease: EASE_INSTITUTIONAL }}
            >
              <span
                className="font-serif text-[#F5F1E8] font-light leading-none block"
                style={{
                  fontSize: "clamp(72px, 12vw, 120px)",
                  letterSpacing: "0.22em",
                }}
              >
                CJPA
              </span>
            </motion.div>

            

            {/* GLOBAL ADVISORS */}
            <motion.div
              className="mt-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 1.3, ease: EASE_INSTITUTIONAL }}
            >
              <span
                className="font-sans text-[#C8A96A] font-light tracking-[0.48em] uppercase block text-center"
                style={{ fontSize: "50px", letterSpacing: "0.45em" }}
              >
                Global Advisors
              </span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
