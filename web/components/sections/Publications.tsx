"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { ArrowUpRight, BookOpen, Clock } from "lucide-react"

const EASE = [0.25, 0.1, 0.25, 1] as const

const BOOK = {
  title: "From Trump to Biden and Beyond",
  subtitle: "Reimagining US-China Relations",
  editor: "Earl A. Carr Jr.",
  publisher: "Palgrave Macmillan / Springer Nature",
  year: "2021",
  isbn: "978-981-16-4296-8",
  cover: "/books/from-trump-to-biden-and-beyond.jpg",
  amazon:
    "https://www.amazon.com/Trump-Biden-Beyond-Reimagining-Relations/dp/9811642966",
  springer: "https://link.springer.com/book/10.1007/978-981-16-4297-5",
  description:
    "An edited volume on the future of U.S.-China relations, with policy analysis and multidisciplinary perspectives on technology, trade, cross-Strait relations, security, climate, geopolitics, and global competition.",
}

export function Publications() {
  const lineRef = useRef(null)
  const lineInView = useInView(lineRef, { once: true, margin: "-60px" })
  const headerRef = useRef(null)
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" })
  const booksRef = useRef(null)
  const booksInView = useInView(booksRef, { once: true, margin: "-60px" })

  return (
    <section id="publications" className="relative bg-[#070B14] py-28 lg:py-36">
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
              Publications
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
            className="font-serif text-[#F5F1E8] font-light leading-[1.06]"
            style={{ fontSize: "clamp(38px, 5vw, 64px)" }}
          >
            Books
            <br />
            <em className="not-italic text-[#F5F1E8]/80">and Research</em>
          </motion.h2>
        </div>

        <div ref={booksRef} className="grid lg:grid-cols-[1.15fr_0.85fr] gap-6 lg:gap-8">
          <motion.a
            href={BOOK.amazon}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 22 }}
            animate={booksInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: EASE }}
            className="group grid sm:grid-cols-[220px_1fr] gap-0 border border-[#C8A96A]/10 bg-[#070B14] hover:border-[#C8A96A]/25 transition-colors duration-500"
          >
            <div className="bg-[#101827] border-r border-[#C8A96A]/10 p-5 flex items-center justify-center">
              <img
                src={BOOK.cover}
                alt={`${BOOK.title}: ${BOOK.subtitle} cover`}
                className="w-full max-w-[180px] shadow-[0_24px_50px_rgba(0,0,0,0.35)]"
                loading="lazy"
              />
            </div>

            <div className="p-7 lg:p-8 flex flex-col gap-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-1.5">
                  <BookOpen size={13} strokeWidth={1.5} className="text-[#C8A96A]/60" />
                  <span
                    className="text-[#C8A96A]/60 font-sans uppercase"
                    style={{ fontSize: "10px", letterSpacing: "0.15em" }}
                  >
                    Published Book
                  </span>
                </div>
                <ArrowUpRight
                  size={15}
                  strokeWidth={1.5}
                  className="text-[#C8A96A]/0 group-hover:text-[#C8A96A]/70 transition-colors"
                />
              </div>

              <div>
                <h3
                  className="font-serif text-[#F5F1E8] font-light leading-[1.08] group-hover:text-white transition-colors"
                  style={{ fontSize: "clamp(25px, 3vw, 40px)" }}
                >
                  {BOOK.title}
                </h3>
                <p
                  className="font-display text-[#C8A96A]/80 mt-2"
                  style={{ fontSize: "clamp(16px, 1.8vw, 22px)" }}
                >
                  {BOOK.subtitle}
                </p>
              </div>

              <p className="text-[#A8B0C0] font-sans font-light leading-[1.8]" style={{ fontSize: "14px" }}>
                {BOOK.description}
              </p>

              <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2 border-t border-[#C8A96A]/10 pt-5">
                <Meta label="Editor" value={BOOK.editor} />
                <Meta label="Year" value={BOOK.year} />
                <Meta label="Publisher" value={BOOK.publisher} />
                <Meta label="ISBN" value={BOOK.isbn} />
              </div>

              <div className="flex flex-wrap gap-3 pt-1">
                <span className="text-[#C8A96A] font-sans uppercase tracking-[0.16em]" style={{ fontSize: "10px" }}>
                  View on Amazon
                </span>
                <span className="text-[#A8B0C0]/35" style={{ fontSize: "12px" }}>|</span>
                <span className="text-[#A8B0C0]/65 font-sans uppercase tracking-[0.16em]" style={{ fontSize: "10px" }}>
                  Springer details
                </span>
              </div>
            </div>
          </motion.a>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={booksInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
            className="border border-[#C8A96A]/10 bg-[#0A0F1C] p-7 lg:p-8 flex flex-col justify-between min-h-[320px]"
          >
            <div>
              <div className="flex items-center gap-1.5 mb-8">
                <Clock size={13} strokeWidth={1.5} className="text-[#C8A96A]/60" />
                <span
                  className="text-[#C8A96A]/60 font-sans uppercase"
                  style={{ fontSize: "10px", letterSpacing: "0.15em" }}
                >
                  Next Publication
                </span>
              </div>

              <h3
                className="font-serif text-[#F5F1E8] font-light leading-[1.1]"
                style={{ fontSize: "clamp(26px, 3vw, 42px)" }}
              >
                Second Book
              </h3>
              <p
                className="font-display text-[#C8A96A]/75 mt-3"
                style={{ fontSize: "clamp(18px, 2vw, 26px)" }}
              >
                Coming Soon
              </p>
            </div>

            <p className="text-[#A8B0C0]/65 font-sans font-light leading-[1.8] mt-10" style={{ fontSize: "14px" }}>
              Details will be announced once the title, cover, and publication timeline are finalized.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[#A8B0C0]/40 font-sans uppercase" style={{ fontSize: "9px", letterSpacing: "0.16em" }}>
        {label}
      </p>
      <p className="text-[#F5F1E8]/85 font-sans mt-0.5" style={{ fontSize: "13px" }}>
        {value}
      </p>
    </div>
  )
}
