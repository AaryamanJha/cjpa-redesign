"use client"

import { useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import { WebGLShader } from "@/components/ui/web-gl-shader"
import { LiquidButton } from "@/components/ui/liquid-glass-button"

const EASE = [0.25, 0.1, 0.25, 1] as const

const OFFICES = [
  { city: "New York", address: "45 Rockefeller Plaza, New York, NY 10111", role: "Headquarters" },
  { city: "Global Network", address: "Asia-Pacific, Caribbean, Europe, Africa", role: "Subject-Matter Experts" },
]

const INQUIRY_TYPES = [
  "Venture Capital",
  "Research and Risk Analysis",
  "Infrastructure and Renewable Energy",
  "Training and Financial Literacy",
  "Consulting",
  "Market Entry Strategy",
  "Other",
]

export function Contact() {
  const lineRef = useRef(null)
  const lineInView = useInView(lineRef, { once: true, margin: "-60px" })
  const headerRef = useRef(null)
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" })

  const [form, setForm] = useState({
    name: "",
    organization: "",
    email: "",
    inquiry: "",
    message: "",
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <section id="contact" className="relative bg-[#070B14] py-28 lg:py-36 overflow-hidden">
      {/* Gold wave background — very subtle */}
      <div className="absolute inset-0 opacity-[0.18] pointer-events-none">
        <WebGLShader />
      </div>
      {/* Fade edges */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#070B14]/80 via-transparent to-[#070B14]/80 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#070B14]/60 via-transparent to-[#070B14]/60 pointer-events-none" />

      {/* Top rule */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10">
        <motion.div
          ref={lineRef}
          className="h-px bg-[#C8A96A] origin-left mb-16 lg:mb-20"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={lineInView ? { scaleX: 1, opacity: 0.2 } : {}}
          transition={{ duration: 1.1, ease: EASE }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <div ref={headerRef} className="mb-16 lg:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE }}
            className="mb-8"
          >
            <span
              className="text-[#C8A96A] font-sans font-light uppercase tracking-[0.3em]"
              style={{ fontSize: "9px" }}
            >
              Contact
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
            className="font-serif text-[#F5F1E8] font-light leading-[1.08] mb-5"
            style={{ fontSize: "clamp(32px, 4vw, 52px)" }}
          >
            Begin a
            <br />
            <em className="not-italic text-[#F5F1E8]/80">Conversation</em>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.75, delay: 0.2, ease: EASE }}
            className="text-[#A8B0C0] font-sans font-light leading-[1.8] max-w-xl"
            style={{ fontSize: "15px" }}
          >
            To help us best serve your inquiry, describe the issue you are
            navigating and what you want to achieve. You may also email or call
            to make an appointment.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-16 lg:gap-24">
          {/* Left — offices */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
            className="flex flex-col gap-8"
          >
            <div>
              <p
                className="text-[#A8B0C0]/50 font-sans font-light uppercase mb-8"
                style={{ fontSize: "8px", letterSpacing: "0.3em" }}
              >
                Contact
              </p>
              <div className="flex flex-col gap-7">
                {OFFICES.map((office) => (
                  <div key={office.city} className="flex flex-col gap-1 border-l border-[#C8A96A]/15 pl-5">
                    <span
                      className="font-serif text-[#F5F1E8] font-light"
                      style={{ fontSize: "16px" }}
                    >
                      {office.city}
                    </span>
                    <span
                      className="text-[#A8B0C0]/70 font-sans font-light"
                      style={{ fontSize: "12px" }}
                    >
                      {office.address}
                    </span>
                    <span
                      className="text-[#C8A96A]/60 font-sans font-light uppercase"
                      style={{ fontSize: "8px", letterSpacing: "0.15em" }}
                    >
                      {office.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-[#C8A96A]/10 pt-7">
              <p
                className="text-[#A8B0C0]/50 font-sans font-light uppercase mb-2"
                style={{ fontSize: "8px", letterSpacing: "0.2em" }}
              >
                General Inquiries
              </p>
              <p
                className="text-[#A8B0C0] font-sans font-light"
                style={{ fontSize: "14px" }}
              >
                info@cjpa.us
                <br />
                (646) 428-5382
              </p>
            </div>
          </motion.div>

          {/* Right — form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.85, delay: 0.25, ease: EASE }}
          >
            {submitted ? (
              <div className="flex flex-col gap-5 py-10">
                <h3
                  className="font-serif text-[#F5F1E8] font-light"
                  style={{ fontSize: "clamp(22px, 2.5vw, 32px)" }}
                >
                  Your inquiry has been received.
                </h3>
                <p
                  className="text-[#A8B0C0] font-sans font-light leading-[1.8]"
                  style={{ fontSize: "14px" }}
                >
                  A member of the CJPA team will review your message and respond
                  within one business day.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-7">
                {/* Name + Org */}
                <div className="grid sm:grid-cols-2 gap-7">
                  <FormField
                    id="name"
                    label="Full Name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                  <FormField
                    id="organization"
                    label="Organization"
                    name="organization"
                    type="text"
                    value={form.organization}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Email + Inquiry type */}
                <div className="grid sm:grid-cols-2 gap-7">
                  <FormField
                    id="email"
                    label="Work Email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="inquiry"
                      className="text-[#A8B0C0]/60 font-sans font-light uppercase"
                      style={{ fontSize: "8px", letterSpacing: "0.2em" }}
                    >
                      Nature of Inquiry
                    </label>
                    <select
                      id="inquiry"
                      name="inquiry"
                      value={form.inquiry}
                      onChange={handleChange}
                      required
                      className="bg-transparent border-b border-[#C8A96A]/25 focus:border-[#C8A96A]/60 text-[#F5F1E8] font-sans font-light py-3 outline-none transition-colors duration-300 cursor-pointer appearance-none"
                      style={{ fontSize: "13px" }}
                    >
                      <option value="" className="bg-[#101827]">
                        Select one
                      </option>
                      {INQUIRY_TYPES.map((t) => (
                        <option key={t} value={t} className="bg-[#101827]">
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="message"
                    className="text-[#A8B0C0]/60 font-sans font-light uppercase"
                    style={{ fontSize: "8px", letterSpacing: "0.2em" }}
                  >
                    Brief Description
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Describe the challenge or initiative you are navigating…"
                    className="bg-transparent border-b border-[#C8A96A]/25 focus:border-[#C8A96A]/60 text-[#F5F1E8] placeholder:text-[#A8B0C0]/30 font-sans font-light py-3 outline-none transition-colors duration-300 resize-none"
                    style={{ fontSize: "13px" }}
                  />
                </div>

                <div className="flex items-center gap-6 pt-2">
                  <LiquidButton
                    type="submit"
                    size="lg"
                    className="text-[#C8A96A] border border-[#C8A96A]/40 hover:border-[#C8A96A]/70 font-sans font-light uppercase tracking-[0.18em] rounded-full"
                    style={{ fontSize: "10px" }}
                  >
                    Send Inquiry
                  </LiquidButton>
                  <p
                    className="text-[#A8B0C0]/40 font-sans font-light"
                    style={{ fontSize: "10px" }}
                  >
                    All communications are strictly confidential.
                  </p>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function FormField({
  id,
  label,
  name,
  type,
  value,
  onChange,
  required,
}: {
  id: string
  label: string
  name: string
  type: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  required?: boolean
}) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="text-[#A8B0C0]/60 font-sans font-light uppercase"
        style={{ fontSize: "8px", letterSpacing: "0.2em" }}
      >
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        className="bg-transparent border-b border-[#C8A96A]/25 focus:border-[#C8A96A]/60 text-[#F5F1E8] placeholder:text-[#A8B0C0]/30 font-sans font-light py-3 outline-none transition-colors duration-300"
        style={{ fontSize: "13px" }}
      />
    </div>
  )
}
