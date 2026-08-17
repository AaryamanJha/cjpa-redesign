"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { ArrowUpRight, FileText, Image as ImageIcon } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"

const EASE = [0.25, 0.1, 0.25, 1] as const

const ARTICLE_META = [
  {
    tag: "Forbes",
    date: "Feb 18, 2025",
    image: "/insights/panama-canal.png",
    href: "https://www.forbes.com/sites/earlcarr/2025/02/18/reimagining-us--chinese-influence-in-central-america-critical-implications-for-the-panama-canal/",
  },
  {
    tag: "Forbes",
    date: "May 15, 2025",
    image: "/insights/circle-ipo-stablecoin.png",
    href: "https://www.forbes.com/sites/earlcarr/2025/05/15/speed-and-safety-what-circles-ipo-means-for-stablecoins/",
  },
  {
    tag: "Forbes",
    date: "Mar 24, 2025",
    image: "/insights/market-volatility.png",
    href: "https://www.forbes.com/sites/earlcarr/2025/03/24/geopolitical-risk-and-volatility-what-are-advisors-telling-clients/",
  },
]

const PRESS_META = [
  {
    publication: "Press Release",
    date: "May 28, 2025",
    image: "/press/paley-center-luncheon-2025.png",
    href: "/press/cjpa-paley-center-luncheon-2025.pdf",
    attachmentHref: "/press/cjpa-paley-center-luncheon-2025.pdf",
    attachmentType: "document",
  },
  {
    publication: "Press Release",
    date: "May 14, 2026",
    image: "/press/press-release-bank-montreal-1.png",
    href: "/press/cjpa-bmo-2026-press-release.docx",
    attachmentHref: "/press/cjpa-bmo-2026-press-release.docx",
    attachmentType: "document",
  },
  {
    publication: "Hinrich Foundation",
    date: "June 2024",
    image: "/press/hinrich-caribbean.jpg",
    href: "https://www.cjpa.us/new-page",
    attachmentHref: "/press/hinrich-caribbean.jpg",
    attachmentType: "image",
  },
  {
    publication: "Penn State",
    date: "Feb 23, 2024",
    image: "/press/penn-state-careers.jpeg",
    href: "https://www.cjpa.us/new-page",
    attachmentHref: "/press/penn-state-careers.jpeg",
    attachmentType: "image",
  },
  {
    publication: "Press Release",
    date: "July 2025",
    image: "/press/press-release-scage-1.png",
    href: "/press/press-release-scage-1.png",
    attachmentHref: "/press/press-release-scage-1.png",
    attachmentType: "image",
  },
  {
    publication: "Taiwan Engagement",
    date: "July 2023",
    image: "/press/taiwan-meetings.jpeg",
    href: "https://www.cjpa.us/new-page",
    attachmentHref: "/press/taiwan-meetings.jpeg",
    attachmentType: "image",
  },
]

interface Article {
  tag: string
  date: string
  image: string
  href: string
  title: string
  excerpt: string
}

interface PressItem {
  publication: string
  date: string
  image: string
  href: string
  attachmentHref: string
  attachmentType: string
  headline: string
  attachmentLabel: string
}

function ArticleCard({
  article,
  delay,
}: {
  article: Article
  delay: number
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })

  return (
    <motion.a
      ref={ref}
      href={article.href}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, delay, ease: EASE }}
      className="group grid sm:grid-cols-[170px_1fr] gap-5 border-t border-[#C8A96A]/10 py-7 cursor-pointer hover:border-[#C8A96A]/25 transition-colors duration-300"
    >
      <div className="relative overflow-hidden border border-[#C8A96A]/10 bg-[#101827] aspect-[4/3]">
        <img
          src={article.image}
          alt=""
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-[#070B14]/10 group-hover:bg-transparent transition-colors duration-500" />
      </div>
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

      <div className="flex items-start justify-between gap-4 sm:col-start-2">
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
    </motion.a>
  )
}

export function Insights() {
  const { t } = useLanguage()
  const lineRef = useRef(null)
  const lineInView = useInView(lineRef, { once: true, margin: "-60px" })
  const headerRef = useRef(null)
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" })
  const pressRef = useRef(null)
  const pressInView = useInView(pressRef, { once: true, margin: "-60px" })

  const articles: Article[] = ARTICLE_META.map((meta, i) => ({
    ...meta,
    title: t.insights.articles[i].title,
    excerpt: t.insights.articles[i].excerpt,
  }))
  const press: PressItem[] = PRESS_META.map((meta, i) => ({
    ...meta,
    headline: t.insights.press[i].headline,
    attachmentLabel: t.insights.press[i].attachmentLabel,
  }))

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
            className="mb-8"
          >
            <span
              className="text-[#C8A96A] font-sans font-medium uppercase tracking-[0.3em]"
              style={{ fontSize: "11px" }}
            >
              {t.insights.eyebrow}
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
            className="font-serif text-[#F5F1E8] font-light leading-[1.06]"
            style={{ fontSize: "clamp(38px, 5vw, 64px)" }}
          >
            {t.insights.headlineLine1}
            <br />
            <em className="not-italic text-[#F5F1E8]/80">{t.insights.headlineLine2}</em>
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
              {t.insights.recentPerspectives}
            </p>
            <div>
              {articles.map((article, i) => (
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
              {t.insights.inThePress}
            </motion.p>

            <div className="space-y-0">
              {press.map((item, i) => {
                const AttachmentIcon = item.attachmentType === "image" ? ImageIcon : FileText

                return (
                <motion.a
                  key={item.headline}
                  href={item.href}
                  target={item.href.startsWith("/") ? undefined : "_blank"}
                  rel={item.href.startsWith("/") ? undefined : "noopener noreferrer"}
                  initial={{ opacity: 0, x: 12 }}
                  animate={pressInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.05 + i * 0.07, ease: EASE }}
                  className="group grid grid-cols-[76px_1fr_auto] items-start gap-4 py-5 border-b border-[#C8A96A]/08 hover:border-[#C8A96A]/18 transition-colors cursor-pointer"
                >
                  <div className="relative h-16 overflow-hidden border border-[#C8A96A]/10 bg-[#101827]">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt=""
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                        loading="lazy"
                      />
                    ) : (
                      <div className="h-full w-full bg-[linear-gradient(135deg,rgba(200,169,106,0.18),rgba(16,24,39,0.96)_55%,rgba(59,130,246,0.12))] flex items-center justify-center">
                        <FileText size={22} strokeWidth={1.4} className="text-[#C8A96A]/70" />
                      </div>
                    )}
                  </div>
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
                    <span
                      onClick={(event) => event.stopPropagation()}
                      className="mt-2 inline-flex items-center gap-1.5 text-[#A8B0C0]/55 group-hover:text-[#C8A96A] transition-colors"
                      style={{ fontSize: "11px" }}
                    >
                      <AttachmentIcon size={12} strokeWidth={1.5} />
                      {item.attachmentLabel}
                    </span>
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
                </motion.a>
              )})}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
