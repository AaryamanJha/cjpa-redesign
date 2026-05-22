"use client"

// PROTOTYPE portal layout — no real auth

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { PortalProvider, usePortal } from "@/contexts/PortalContext"
import { Sidebar } from "@/components/portal/Sidebar"

function PortalGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = usePortal()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

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
