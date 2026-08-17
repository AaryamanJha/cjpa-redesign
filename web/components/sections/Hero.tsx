"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { GlobeInteractive } from "@/components/ui/GlobeInteractive"
import { useLanguage } from "@/contexts/LanguageContext"

const EASE = [0.25, 0.1, 0.25, 1] as const

function FadeUp({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function Hero() {
  const { t } = useLanguage()
  return (
    <section
      className="relative min-h-screen flex items-center overflow-x-hidden"
      style={{ paddingTop: "80px" }}
      aria-label="Hero"
    >
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: [
            "linear-gradient(rgba(200,169,106,0.035) 1px, transparent 1px)",
            "linear-gradient(90deg, rgba(200,169,106,0.035) 1px, transparent 1px)",
          ].join(", "),
          backgroundSize: "80px 80px",
        }}
      />

      {/* Radial vignette over grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 90% 90% at 50% 50%, transparent 30%, #070B14 100%)",
        }}
      />

      {/* Gold ambient glow — left */}
      <div
        className="absolute top-1/3 -left-48 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, rgba(200,169,106,0.06) 0%, transparent 70%)",
          filter: "blur(48px)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 w-full py-24 lg:py-0">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-center min-h-[calc(100vh-80px)]">
          {/* Left — Copy */}
          <div className="flex flex-col justify-center gap-8 lg:py-24">
            {/* Eyebrow */}
            <FadeUp delay={0.1}>
              <div>
                <span
                  className="text-[#C8A96A] font-sans font-light uppercase"
                  style={{ fontSize: "10px", letterSpacing: "0.2em", lineHeight: 1.6 }}
                >
                  {t.hero.eyebrow}
                </span>
              </div>
            </FadeUp>

            {/* Headline */}
            <FadeUp delay={0.25}>
              <h1
                className="font-serif text-[#F5F1E8] font-light leading-[1.06]"
                style={{ fontSize: "clamp(48px, 7vw, 88px)" }}
              >
                {t.hero.headlineLine1}
                <br />
                <em className="font-light not-italic text-[#F5F1E8]/90">
                  {t.hero.headlineLine2}
                </em>
              </h1>
            </FadeUp>

            {/* Body */}
            <FadeUp delay={0.4}>
              <p
                className="text-[#A8B0C0] font-sans font-light leading-relaxed max-w-lg"
                style={{ fontSize: "15px", lineHeight: "1.75" }}
              >
                {t.hero.body}
              </p>
            </FadeUp>

            {/* Gold rule */}
            <FadeUp delay={0.5}>
              <div className="h-px w-16 bg-[#C8A96A] opacity-40" />
            </FadeUp>

            {/* CTAs */}
            <FadeUp delay={0.6}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Link
                  href="#contact"
                  className="inline-flex items-center gap-3 text-[#F5F1E8] border border-[#C8A96A]/40 hover:border-[#C8A96A]/80 hover:bg-[#C8A96A]/6 px-7 py-3.5 text-[11px] tracking-[0.18em] uppercase font-sans transition-all duration-300 cursor-pointer group"
                >
                  {t.hero.ctaPrimary}
                  <ArrowRight
                    size={12}
                    strokeWidth={1.5}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
                <Link
                  href="#services"
                  className="inline-flex items-center gap-2 text-[#A8B0C0] hover:text-[#F5F1E8] text-[11px] tracking-[0.15em] uppercase font-sans transition-colors duration-200 cursor-pointer px-1"
                >
                  {t.hero.ctaSecondary}
                  <ArrowRight size={11} strokeWidth={1.5} />
                </Link>
              </div>
            </FadeUp>
          </div>

          {/* Right — Globe */}
          <motion.div
            className="flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.3, ease: EASE }}
          >
            <div className="relative w-full max-w-[540px]">
              {/* Outer glow ring */}
              <div
                className="absolute inset-[-10%] rounded-full pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse 70% 70% at 50% 50%, rgba(200,169,106,0.05) 0%, transparent 70%)",
                }}
              />
              <GlobeInteractive className="w-full" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        <span
          className="text-[#A8B0C0]/50 font-sans uppercase"
          style={{ fontSize: "8px", letterSpacing: "0.3em" }}
        >
          {t.hero.scroll}
        </span>
        <motion.div
          className="h-6 w-px bg-[#C8A96A] opacity-30"
          animate={{ scaleY: [1, 0.3, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  )
}
