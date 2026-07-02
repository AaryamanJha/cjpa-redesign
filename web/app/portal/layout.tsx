"use client"

// Portal auth: supports both CJPA ID (mock) and Microsoft OAuth (NextAuth).
// Microsoft sign-in bridges to the mock user system by matching email.

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { PortalProvider, usePortal } from "@/contexts/PortalContext"
import { Sidebar } from "@/components/portal/Sidebar"

const CJPA_DOMAIN = "@cjpa.us"

function PortalGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading, login, teamMembers } = usePortal()
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (isLoading || status === "loading") return

    if (!user && session?.user?.email) {
      const email = session.user.email.toLowerCase()

      // 1. Exact email match against live team data (includes edits from Databank)
      let matched = teamMembers.find((m) => m.email?.toLowerCase() === email)

      // 2. @cjpa.us domain — try matching by Microsoft display name
      if (!matched && email.endsWith(CJPA_DOMAIN)) {
        const displayName = (session.user.name ?? "").toLowerCase().trim()
        if (displayName) {
          matched = teamMembers.find((m) => m.name.toLowerCase() === displayName)
        }
        // 3. Try matching by email prefix: earl@cjpa.us → find user whose id or first name starts with "earl"
        if (!matched) {
          const prefix = email.split("@")[0].toLowerCase()
          matched = teamMembers.find(
            (m) =>
              m.id.toLowerCase().startsWith(prefix) ||
              m.name.toLowerCase().startsWith(prefix)
          )
        }
      }

      if (matched) {
        login(matched.id)
      } else {
        router.push("/login?error=email_not_found")
      }
      return
    }

    if (!user && status !== "authenticated") {
      router.push("/login")
    }
  }, [user, isLoading, session, status, login, router, teamMembers])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#070B14] flex items-center justify-center">
        <div className="text-[#A8B0C0] font-sans" style={{ fontSize: "13px", letterSpacing: "0.1em" }}>
          Loading…
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="flex min-h-screen bg-[#070B14]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">{children}</div>
    </div>
  )
}

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <PortalProvider>
      <PortalGuard>{children}</PortalGuard>
    </PortalProvider>
  )
}
