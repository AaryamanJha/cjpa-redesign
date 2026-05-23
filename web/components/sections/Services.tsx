"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import {
  Globe2,
  BarChart2,
  Landmark,
  ArrowLeftRight,
  Shield,
  BookOpen,
} from "lucide-react"

const EASE = [0.25, 0.1, 0.25, 1] as const

const SERVICES = [
  {
    icon: Globe2,
    title: "Research & Risk Analysis",
    description:
      "Customized research reports for multinational clients exploring new markets, with emphasis on trade policy, geopolitical risk, macro trends, tariffs, domestic policy impact, ESG, and values-based investing.",
  },
  {
    icon: BarChart2,
    title: "Venture Capital & Project Finance",
    description:
      "Connecting high-quality infrastructure projects with venture capitalists, individual investors, family offices, RIAs, and development finance institutions.",
  },
  {
    icon: Landmark,
    title: "Infrastructure & Renewable Energy",
    description:
      "Capital and advisory support for infrastructure opportunities across renewable energy, solar, battery projects, 5G, green hydrogen, lithium iron phosphate, and construction robotics.",
  },
  {
    icon: ArrowLeftRight,
    title: "Market Entry Strategy",
    description:
      "Guidance for foreign companies entering the U.S. market, including market dynamics, regulatory requirements, competitive landscapes, and integration strategy.",
  },
  {
    icon: Shield,
    title: "Consulting for Multinationals & Governments",
    description:
      "Strategic intelligence for organizations investing in China or the Indo-Pacific, along with grant support, fundraising, board development, and ESG policy guidance.",
  },
  {
    icon: BookOpen,
    title: "Training & Financial Literacy",
    description:
      "Workshops for nonprofits, government agencies, student organizations, and businesses on asset allocation, risk tolerance, retirement saving, crypto due diligence, and values-based investing.",
  },
]

function ServiceCard({
  service,
  delay,
}: {
  service: (typeof SERVICES)[number]
  delay: number
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  const Icon = service.icon

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, delay, ease: EASE }}
      className="group relative bg-[#101827] border border-[#C8A96A]/10 hover:border-[#C8A96A]/25 transition-colors duration-400 p-8 flex flex-col gap-6 cursor-default"
    >
      {/* Gold top accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-[#C8A96A] opacity-20 group-hover:opacity-50 transition-opacity duration-400" />

      <Icon
        size={22}
        strokeWidth={1.25}
        className="text-[#C8A96A] opacity-70 group-hover:opacity-100 transition-opacity duration-300"
      />

      <div className="flex flex-col gap-3">
        {/* Service title — Playfair Display for variety */}
        <h3
          className="font-display text-[#F5F1E8] font-normal leading-snug"
          style={{ fontSize: "clamp(18px, 1.8vw, 23px)" }}
        >
          {service.title}
        </h3>
        <p
          className="text-[#A8B0C0] font-sans font-light leading-[1.8]"
          style={{ fontSize: "14px" }}
        >
          {service.description}
        </p>
      </div>
    </motion.div>
  )
}

export function Services() {
  const headerRef = useRef(null)
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" })
  const lineRef = useRef(null)
  const lineInView = useInView(lineRef, { once: true, margin: "-60px" })

  return (
    <section id="services" className="relative bg-[#070B14] py-28 lg:py-36">
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
        <div ref={headerRef} className="mb-16 lg:mb-20 max-w-2xl">
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
              Services
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
            className="font-serif text-[#F5F1E8] font-light leading-[1.06]"
            style={{ fontSize: "clamp(38px, 5vw, 64px)" }}
          >
            Our Services
          </motion.h2>
        </div>

        {/* Services grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#C8A96A]/6">
          {SERVICES.map((service, i) => (
            <ServiceCard key={service.title} service={service} delay={i * 0.07} />
          ))}
        </div>
      </div>
    </section>
  )
}
