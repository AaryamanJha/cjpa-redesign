"use client"

import { useRef } from "react"
import Image from "next/image"
import { motion, useInView } from "framer-motion"

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
            Leadership
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
                About the Founder
              </h2>
            </Reveal>

            <div className="flex flex-col gap-5">
              <Reveal delay={0.24}>
                <p
                  className="text-[#A8B0C0] font-sans font-light leading-[1.85]"
                  style={{ fontSize: "16px" }}
                >
                  Earl Carr is Founder and Chief Executive Officer at CJPA Global
                  Advisors, based in New York. With 25+ years of experience, he
                  manages a multidisciplinary team of global research analysts,
                  software engineers, marketing specialists, geopolitical
                  analysts, and media specialists to guide the firm&rsquo;s global
                  thought leadership, global strategic client advisory practice,
                  and cross-border business mandate. Earl is an Adjunct Instructor
                  at NYU&rsquo;s Center for Global Affairs.
                </p>
              </Reveal>
              <Reveal delay={0.3}>
                <p
                  className="text-[#A8B0C0] font-sans font-light leading-[1.85]"
                  style={{ fontSize: "16px" }}
                >
                  Earl has expertise in banking, wealth management, consulting,
                  geopolitical analysis, U.S. foreign policy, and international
                  development. He previously served as Vice President at Morgan
                  Stanley&rsquo;s Institute for Sustainable Investing (ISI),
                  working as a strategist and thought leader. Earl is a member of
                  the Steering Committee for the inaugural National Asian American
                  Book Club and is a monthly columnist at Forbes.com.
                </p>
              </Reveal>
              <Reveal delay={0.36}>
                <p
                  className="text-[#A8B0C0] font-sans font-light leading-[1.85]"
                  style={{ fontSize: "16px" }}
                >
                  Mr. Carr is Editor of{" "}
                  <em className="not-italic text-[#F5F1E8]/85">
                    From Trump to Biden and Beyond: Reimagining U.S.-China
                    Relations
                  </em>
                  , published by Palgrave Macmillan, September 2021.
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
              Founder&rsquo;s Message
            </span>

            <div className="flex flex-col gap-5">
              <p
                className="text-[#A8B0C0] font-sans font-light leading-[1.85]"
                style={{ fontSize: "16px" }}
              >
                At CJPA Global Advisors, our exceptional team of research
                analysts, software engineers, financial advisors, marketing
                specialists, and geopolitical strategists strives to be a global
                leader in advisory services, cross-border business development,
                and customized research. Our firm&rsquo;s core specializations
                include global risk analysis, international supply chain
                analysis, trade analysis, risk management, geopolitical
                analysis and financial markets, environmental sustainable
                governance, racial justice investing, and financial literacy
                training. What makes CJPA truly extraordinary is our dedication
                to analytical rigor and access to proprietary research, people,
                and intelligence through a global network of subject matter
                experts and professionals.
              </p>
              <p
                className="text-[#A8B0C0] font-sans font-light leading-[1.85]"
                style={{ fontSize: "16px" }}
              >
                Through a world-class Global Advisory Board, we ensure that the
                firm&rsquo;s long-term goals and systems are guided and held
                accountable while remaining good stewards of our financial
                resources. At CJPA, we are passionate about how to utilize
                capital, technology, and data to help solve some of the
                world&rsquo;s most pressing problems, including racial
                socio-economic equity, sustainability, and the transition to a
                lower-carbon global economy &mdash; a transition we believe is
                as much a historic investment opportunity as it is a risk to
                manage.
              </p>
              <p
                className="text-[#A8B0C0] font-sans font-light leading-[1.85]"
                style={{ fontSize: "16px" }}
              >
                Our company is determined to help you achieve your goals &mdash;
                whether that means identifying geopolitical, financial, or
                business risk, providing insight as you explore investing in a
                new country, or helping to raise capital for projects around
                the world. We are your trusted partner.
              </p>
            </div>

            <div className="pt-2">
              <p
                className="font-display text-[#F5F1E8]/90 italic font-normal"
                style={{ fontSize: "18px" }}
              >
                Cordially,
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
                Founder and CEO, CJPA Global Advisors
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
                Photo pending —
                <br />
                Earl Carr &amp; Jensen Huang, CFR
              </span>
            </div>
            <div className="absolute bottom-4 right-4 left-4 sm:left-auto sm:max-w-[80%] bg-[#F5F1E8] px-6 py-5">
              <p
                className="font-display italic text-[#070B14] font-normal leading-[1.5]"
                style={{ fontSize: "13.5px" }}
              >
                CJPA&rsquo;s Founder, Earl Carr, with NVIDIA&rsquo;s CEO, Jensen
                Huang, at the Council on Foreign Relations in Washington, D.C.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
