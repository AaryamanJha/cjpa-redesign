"use client"

// PROTOTYPE: CJPA ID = mock localStorage auth. Microsoft = real OAuth via NextAuth + Azure AD.

import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowRight, AlertCircle, Shield } from "lucide-react"
import { signIn } from "next-auth/react"
import { usePortal } from "@/contexts/PortalContext"
import { portalUsers } from "@/data/portalUsers"

function LoginContent() {
  const { user, login } = usePortal()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [portalId, setPortalId] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [msLoading, setMsLoading] = useState(false)

  useEffect(() => {
    if (user) router.replace("/portal")
    const err = searchParams.get("error")
    if (err === "email_not_found") setError("Your Microsoft account is not registered in the portal. Contact your administrator.")
    else if (err === "OAuthSignin" || err === "OAuthCallback") setError("Microsoft sign-in failed. Check your Azure configuration.")
  }, [user, router, searchParams])

  async function handleMicrosoftSignIn() {
    setMsLoading(true)
    setError("")
    try {
      await signIn("microsoft-entra-id", { callbackUrl: "/portal" })
    } catch {
      setError("Microsoft sign-in unavailable. Ensure Azure credentials are configured.")
      setMsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!portalId.trim()) {
      setError("Please enter your Portal ID.")
      return
    }
    setIsLoading(true)
    setError("")

    await new Promise((r) => setTimeout(r, 600))

    const result = login(portalId.trim())
    if (result.success) {
      router.push("/portal")
    } else {
      setError(result.error || "Login failed.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#070B14] flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #C8A96A 1px, transparent 1px), linear-gradient(to bottom, #C8A96A 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-24 h-24 border-t border-l border-[#C8A96A]/20" />
      <div className="absolute bottom-0 right-0 w-24 h-24 border-b border-r border-[#C8A96A]/20" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md relative"
      >
        {/* Logo / Wordmark */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-block">
            <span
              className="font-serif text-[#F5F1E8] tracking-[0.25em] uppercase"
              style={{ fontSize: "22px", letterSpacing: "0.35em" }}
            >
              CJPA
            </span>
          </Link>
          <div className="mt-1 h-px w-8 bg-[#C8A96A] mx-auto" />
          <p className="mt-3 text-[#A8B0C0] font-sans" style={{ fontSize: "10px", letterSpacing: "0.2em" }}>
            GLOBAL ADVISORS
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#0D1520] border border-[#C8A96A]/14 rounded-sm overflow-hidden">
          {/* Card header */}
          <div className="px-8 pt-8 pb-6 border-b border-[#C8A96A]/10">
            <h1
              className="font-serif text-[#F5F1E8] font-light"
              style={{ fontSize: "clamp(24px, 2.5vw, 30px)" }}
            >
              Portal Access
            </h1>
            <p className="mt-2 text-[#A8B0C0] font-sans" style={{ fontSize: "14px" }}>
              Enter your assigned Portal ID to continue.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 py-7 space-y-5">
            <div>
              <label
                htmlFor="portalId"
                className="block text-[#A8B0C0] font-sans uppercase mb-2"
                style={{ fontSize: "10px", letterSpacing: "0.18em" }}
              >
                Portal ID
              </label>
              <input
                id="portalId"
                type="text"
                value={portalId}
                onChange={(e) => {
                  setPortalId(e.target.value)
                  setError("")
                }}
                placeholder="e.g. analyst, ceo, advisor"
                autoComplete="off"
                spellCheck={false}
                className="w-full bg-transparent border border-[#C8A96A]/20 text-[#F5F1E8] font-sans rounded-sm px-4 py-3 outline-none transition-colors placeholder:text-[#A8B0C0]/40 focus:border-[#C8A96A]/50"
                style={{ fontSize: "14px" }}
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2.5 text-red-400/90 bg-red-400/8 border border-red-400/15 rounded-sm px-4 py-3"
              >
                <AlertCircle size={14} className="shrink-0" />
                <span className="font-sans" style={{ fontSize: "13px" }}>
                  {error}
                </span>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-[#C8A96A] hover:bg-[#D4BB82] text-[#070B14] font-sans font-semibold rounded-sm py-3 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ fontSize: "13px", letterSpacing: "0.06em" }}
            >
              {isLoading ? (
                <span>Authenticating…</span>
              ) : (
                <>
                  <span>Access Portal</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Microsoft sign-in */}
        <div className="mt-4 px-8 pb-7">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-[#C8A96A]/10" />
            <span className="text-[#A8B0C0]/40 font-sans" style={{ fontSize: "11px", letterSpacing: "0.12em" }}>OR</span>
            <div className="flex-1 h-px bg-[#C8A96A]/10" />
          </div>
          <button
            type="button"
            onClick={handleMicrosoftSignIn}
            disabled={msLoading}
            className="w-full flex items-center justify-center gap-3 border border-[#C8A96A]/20 bg-[#0D1520] hover:bg-[#111d2e] text-[#F5F1E8] font-sans rounded-sm py-3 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ fontSize: "13px" }}
          >
            {msLoading ? (
              <span className="text-[#A8B0C0]">Connecting to Microsoft…</span>
            ) : (
              <>
                {/* Microsoft logo mark */}
                <svg width="16" height="16" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="1" y="1" width="9" height="9" fill="#F25022"/>
                  <rect x="11" y="1" width="9" height="9" fill="#7FBA00"/>
                  <rect x="1" y="11" width="9" height="9" fill="#00A4EF"/>
                  <rect x="11" y="11" width="9" height="9" fill="#FFB900"/>
                </svg>
                <span>Sign in with Microsoft</span>
              </>
            )}
          </button>
          <p className="mt-2 text-center text-[#A8B0C0]/30 font-sans" style={{ fontSize: "11px" }}>
            Requires Outlook / Microsoft 365 account
          </p>
        </div>

        {/* Prototype notice */}
        <div className="mt-4 flex items-start gap-2 text-[#A8B0C0]/60">
          <Shield size={12} className="shrink-0 mt-0.5" />
          <p className="font-sans" style={{ fontSize: "12px" }}>
            Prototype system. Mock authentication only — no passwords, no real credentials.
            Contact your administrator for your Portal ID.
          </p>
        </div>

        {/* Dev helper — visible only in dev */}
        {process.env.NODE_ENV === "development" && (
          <details className="mt-6 border border-[#C8A96A]/10 rounded-sm overflow-hidden">
            <summary className="px-4 py-2.5 text-[#A8B0C0]/50 font-sans cursor-pointer select-none" style={{ fontSize: "12px" }}>
              Dev: Available Portal IDs
            </summary>
            <div className="px-4 py-3 border-t border-[#C8A96A]/10 space-y-1.5">
              {portalUsers.slice(0, 12).map((member) => (
                <button
                  key={member.id}
                  type="button"
                  onClick={() => setPortalId(member.id)}
                  className="block w-full text-left text-[#A8B0C0]/70 hover:text-[#C8A96A] font-sans transition-colors"
                  style={{ fontSize: "12px" }}
                >
                  <span className="text-[#C8A96A]/70">{member.id}</span> - {member.name} - {member.title}
                </button>
              ))}
            </div>
          </details>
        )}
      </motion.div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  )
}

