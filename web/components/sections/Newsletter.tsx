"use client"

import { useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"

const EASE = [0.25, 0.1, 0.25, 1] as const

export function Newsletter() {
  const { t } = useLanguage()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await res.json() as { result: string; msg: string }
      if (data.result === "success" || data.msg?.includes("already subscribed")) {
        setSubmitted(true)
      } else {
        // Strip Mailchimp HTML tags from error message
        setError(data.msg?.replace(/<[^>]+>/g, "") || t.newsletter.genericError)
      }
    } catch {
      setError(t.newsletter.networkError)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="newsletter" className="relative bg-[#070B14]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, ease: EASE }}
          className="relative bg-[#101827] border border-[#C8A96A]/12 px-10 py-16 lg:px-20 lg:py-20 overflow-hidden"
        >
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-16 h-px bg-[#C8A96A] opacity-30" />
          <div className="absolute top-0 left-0 h-16 w-px bg-[#C8A96A] opacity-30" />
          <div className="absolute bottom-0 right-0 w-16 h-px bg-[#C8A96A] opacity-30" />
          <div className="absolute bottom-0 right-0 h-16 w-px bg-[#C8A96A] opacity-30" />

          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-20 items-center">
            {/* Left */}
            <div>
              <div className="mb-6">
                <span
                  className="text-[#C8A96A] font-sans font-medium uppercase tracking-[0.3em]"
                  style={{ fontSize: "11px" }}
                >
                  {t.newsletter.eyebrow}
                </span>
              </div>
              {/* Playfair Display for this heading */}
              <h2
                className="font-display text-[#F5F1E8] font-normal leading-[1.1] mb-5"
                style={{ fontSize: "clamp(28px, 3.2vw, 44px)" }}
              >
                {t.newsletter.headlineLine1}
                <br />
                <em className="text-[#F5F1E8]/75">{t.newsletter.headlineLine2}</em>
              </h2>
              <p
                className="text-[#A8B0C0] font-sans font-light leading-[1.85]"
                style={{ fontSize: "15px" }}
              >
                {t.newsletter.body}
              </p>
            </div>

            {/* Right — form */}
            <div>
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="flex flex-col gap-3"
                >
                  <p
                    className="font-display text-[#F5F1E8] font-normal"
                    style={{ fontSize: "clamp(20px, 2vw, 26px)" }}
                  >
                    {t.newsletter.successTitle}
                  </p>
                  <p
                    className="text-[#A8B0C0] font-sans font-light"
                    style={{ fontSize: "14px" }}
                  >
                    {t.newsletter.successBody}
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="newsletter-email"
                      className="text-[#A8B0C0]/60 font-sans font-medium uppercase"
                      style={{ fontSize: "10px", letterSpacing: "0.2em" }}
                    >
                      {t.newsletter.emailLabel}
                    </label>
                    <input
                      id="newsletter-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t.newsletter.emailPlaceholder}
                      className="bg-transparent border-b border-[#C8A96A]/25 focus:border-[#C8A96A]/60 text-[#F5F1E8] placeholder:text-[#A8B0C0]/30 font-sans font-light py-3 outline-none transition-colors duration-300"
                      style={{ fontSize: "15px" }}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="group flex items-center justify-between border border-[#C8A96A]/30 hover:border-[#C8A96A]/60 hover:bg-[#C8A96A]/6 text-[#C8A96A] px-6 py-4 transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span
                      className="font-sans font-medium uppercase tracking-[0.2em]"
                      style={{ fontSize: "11px" }}
                    >
                      {loading ? t.newsletter.subscribing : t.newsletter.subscribe}
                    </span>
                    <ArrowRight
                      size={15}
                      strokeWidth={1.5}
                      className="opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300"
                    />
                  </button>
                  {error && (
                    <p className="text-red-400 font-sans font-light" style={{ fontSize: "12px" }}>
                      {error}
                    </p>
                  )}
                  <p
                    className="text-[#A8B0C0]/40 font-sans font-light"
                    style={{ fontSize: "12px" }}
                  >
                    {t.newsletter.disclaimer}
                  </p>
                </form>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
