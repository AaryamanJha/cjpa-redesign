"use client"

import { useRef } from "react"
import Image from "next/image"
import { motion, useInView } from "framer-motion"
import { useLanguage } from "@/contexts/LanguageContext"

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

export function Founder() {
  const { t } = useLanguage()
  const lineRef = useRef(null)
  const lineInView = useInView(lineRef, { once: true, margin: "-60px" })

  return (
    <section id="founder" className="relative bg-[#070B14] py-28 lg:py-36">
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
        <Reveal delay={0}>
          <span
            className="text-[#C8A96A] font-sans font-medium uppercase tracking-[0.3em]"
            style={{ fontSize: "11px" }}
          >
            {t.founder.eyebrow}
          </span>
        </Reveal>

        {/* Photo + bio */}
        <div className="mt-8 grid lg:grid-cols-[0.85fr_1.15fr] gap-12 lg:gap-20 items-start">
          <Reveal delay={0.1} className="relative aspect-[4/5] w-full max-w-md overflow-hidden">
            <Image
              src="/team/earl-carr.jpg"
              alt="Earl Carr, Founder and CEO of CJPA Global Advisors"
              fill
              sizes="(min-width: 1024px) 40vw, 90vw"
              className="object-cover"
            />
            <span aria-hidden="true" className="absolute left-0 top-0 h-12 w-[3px] bg-[#C8A96A]" />
          </Reveal>

          <div className="flex flex-col gap-8">
            <Reveal delay={0.18}>
              <h2
                className="font-serif text-[#F5F1E8] font-light leading-[1.06]"
                style={{ fontSize: "clamp(34px, 4.4vw, 52px)" }}
              >
                {t.founder.heading}
              </h2>
            </Reveal>

            <div className="flex flex-col gap-5">
              <Reveal delay={0.24}>
                <p
                  className="text-[#A8B0C0] font-sans font-light leading-[1.85]"
                  style={{ fontSize: "16px" }}
                >
                  {t.founder.bio1}
                </p>
              </Reveal>
              <Reveal delay={0.3}>
                <p
                  className="text-[#A8B0C0] font-sans font-light leading-[1.85]"
                  style={{ fontSize: "16px" }}
                >
                  {t.founder.bio2}
                </p>
              </Reveal>
              <Reveal delay={0.36}>
                <p
                  className="text-[#A8B0C0] font-sans font-light leading-[1.85]"
                  style={{ fontSize: "16px" }}
                >
                  {t.founder.bio3editorPrefix}{" "}
                  <em className="not-italic text-[#F5F1E8]/85">
                    {t.founder.bio3bookTitle}
                  </em>
                  {t.founder.bio3suffix}
                </p>
              </Reveal>
            </div>
          </div>
        </div>

        {/* Founder's message + credibility photo */}
        <div className="mt-24 lg:mt-32 grid lg:grid-cols-[1.15fr_0.85fr] gap-16 lg:gap-20 items-start">
          <Reveal delay={0} className="flex flex-col gap-8">
            <span
              className="text-[#C8A96A] font-sans font-medium uppercase tracking-[0.3em]"
              style={{ fontSize: "11px" }}
            >
              {t.founder.messageEyebrow}
            </span>

            <div className="flex flex-col gap-5">
              <p
                className="text-[#A8B0C0] font-sans font-light leading-[1.85]"
                style={{ fontSize: "16px" }}
              >
                {t.founder.message1}
              </p>
              <p
                className="text-[#A8B0C0] font-sans font-light leading-[1.85]"
                style={{ fontSize: "16px" }}
              >
                {t.founder.message2}
              </p>
              <p
                className="text-[#A8B0C0] font-sans font-light leading-[1.85]"
                style={{ fontSize: "16px" }}
              >
                {t.founder.message3}
              </p>
            </div>

            <div className="pt-2">
              <p
                className="font-display text-[#F5F1E8]/90 italic font-normal"
                style={{ fontSize: "18px" }}
              >
                {t.founder.signOff}
              </p>
              <p
                className="font-display text-[#C8A96A] italic font-normal mt-1"
                style={{ fontSize: "22px" }}
              >
                Earl Carr
              </p>
              <p
                className="text-[#A8B0C0] font-sans font-light uppercase tracking-[0.15em] mt-1"
                style={{ fontSize: "11px" }}
              >
                {t.founder.signatureTitle}
              </p>
            </div>
          </Reveal>

          {/* Credibility photo — placeholder until the real file is supplied */}
          <Reveal delay={0.15} className="relative">
            <div className="relative aspect-[4/3] w-full overflow-hidden border border-[#C8A96A]/15 bg-[#101827] flex items-center justify-center">
              {/*
                TODO: replace with the real photo of Earl Carr and Jensen Huang
                at the Council on Foreign Relations. Save the file to
                public/team/earl-carr-jensen-huang-cfr.jpg and swap this
                placeholder block for an <Image> tag, same as the headshot above.
              */}
              <span
                className="text-[#A8B0C0]/50 font-sans font-light uppercase tracking-[0.2em] text-center px-8"
                style={{ fontSize: "11px" }}
              >
                {t.founder.photoPendingLabel}
                <br />
                {t.founder.photoPendingName}
              </span>
            </div>
            <div className="absolute bottom-4 right-4 left-4 sm:left-auto sm:max-w-[80%] bg-[#F5F1E8] px-6 py-5">
              <p
                className="font-display italic text-[#070B14] font-normal leading-[1.5]"
                style={{ fontSize: "13.5px" }}
              >
                {t.founder.photoCaption}
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
