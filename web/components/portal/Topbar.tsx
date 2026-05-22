"use client"

import { LogOut, Bell } from "lucide-react"
import { usePortal } from "@/contexts/PortalContext"
import { RoleBadge } from "./RoleBadge"

interface TopbarProps {
  title: string
  subtitle?: string
}

export function Topbar({ title, subtitle }: TopbarProps) {
  const { user, logout } = usePortal()

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-7 py-4 bg-[#0A1120]/90 backdrop-blur-sm border-b border-[#C8A96A]/10">
      {/* Page title */}
      <div>
        <h1
          className="font-serif text-[#F5F1E8] font-light"
          style={{ fontSize: "clamp(20px, 2vw, 26px)" }}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="font-sans text-[#A8B0C0] mt-0.5" style={{ fontSize: "13px" }}>
            {subtitle}
          </p>
        )}
      </div>

      {/* Right: user info */}
      {user && (
        <div className="flex items-center gap-4">
          <button
            className="text-[#A8B0C0]/50 hover:text-[#A8B0C0] transition-colors"
            aria-label="Notifications"
          >
            <Bell size={16} strokeWidth={1.5} />
          </button>

          <div className="h-4 w-px bg-[#C8A96A]/15" />

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="font-sans font-medium text-[#F5F1E8]" style={{ fontSize: "14px" }}>
                {user.name}
              </p>
              <p className="font-sans text-[#A8B0C0]" style={{ fontSize: "12px" }}>
                {user.title}
              </p>
            </div>
            <RoleBadge role={user.role} size="sm" />
          </div>

          <div className="h-4 w-px bg-[#C8A96A]/15" />

          <button
            onClick={logout}
            className="flex items-center gap-1.5 text-[#A8B0C0]/50 hover:text-red-400 transition-colors font-sans"
            style={{ fontSize: "13px" }}
            aria-label="Sign out"
          >
            <LogOut size={14} strokeWidth={1.5} />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      )}
    </header>
  )
}
