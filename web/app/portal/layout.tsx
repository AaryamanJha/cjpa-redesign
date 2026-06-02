"use client"

// Portal auth: supports both CJPA ID (mock) and Microsoft OAuth (NextAuth).
// Microsoft sign-in bridges to the mock user system by matching email.

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { PortalProvider, usePortal } from "@/contexts/PortalContext"
import { Sidebar } from "@/components/portal/Sidebar"
import { portalUsers } from "@/data/portalUsers"

function PortalGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading, login } = usePortal()
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (isLoading || status === "loading") return

    // Bridge: if signed in via Microsoft but no portal user yet, match by email
    if (!user && session?.user?.email) {
      const matched = portalUsers.find(
        (u) => u.email?.toLowerCase() === session.user!.email!.toLowerCase()
      )
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
  }, [user, isLoading, session, status, login, router])

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
