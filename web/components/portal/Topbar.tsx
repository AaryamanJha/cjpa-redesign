"use client"

import { useEffect, useRef, useState } from "react"
import { LogOut, Bell } from "lucide-react"
import { useRouter } from "next/navigation"
import { usePortal } from "@/contexts/PortalContext"
import { RoleBadge } from "./RoleBadge"
import { ThemeToggle } from "@/components/theme/ThemeToggle"

const AUDIENCE_ROLES: Record<string, string[]> = {
  "All Team":     ["CEO", "Senior Advisor", "Advisor", "Associate", "Analyst", "Intern Analyst"],
  "Advisors":     ["CEO", "Senior Advisor", "Advisor"],
  "Analysts":     ["Analyst", "Intern Analyst"],
  "Project Team": ["CEO", "Senior Advisor", "Advisor", "Associate", "Analyst", "Intern Analyst"],
}

const PRIORITY_BAR: Record<string, string> = {
  Urgent: "#FC8181",
  Important: "#C8A96A",
  Standard: "#A8B0C0",
}

function readKey(userId: string) {
  return `cjpa_read_ann_${userId}`
}

function loadReadIds(userId: string): Set<string> {
  try {
    const raw = localStorage.getItem(readKey(userId))
    if (raw) return new Set(JSON.parse(raw) as string[])
  } catch {}
  return new Set()
}

function saveReadIds(userId: string, ids: Set<string>) {
  localStorage.setItem(readKey(userId), JSON.stringify([...ids]))
}

interface TopbarProps {
  title: string
  subtitle?: string
}

export function Topbar({ title, subtitle }: TopbarProps) {
  const { user, logout, announcements } = usePortal()
  const router = useRouter()
  const [bellOpen, setBellOpen] = useState(false)
  const [readIds, setReadIds] = useState<Set<string>>(new Set())
  const bellRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (user) setReadIds(loadReadIds(user.id))
  }, [user?.id])

  // Refresh unread count when announcements list changes (new ones posted)
  useEffect(() => {
    if (user) setReadIds(loadReadIds(user.id))
  }, [announcements.length, user?.id])

  useEffect(() => {
    if (!bellOpen) return
    function handleClickOutside(e: MouseEvent) {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) {
        setBellOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [bellOpen])

  const visible = user
    ? announcements.filter((a) => AUDIENCE_ROLES[a.audience]?.includes(user.role))
    : []

  const unreadCount = visible.filter((a) => !readIds.has(a.id)).length

  function handleBellClick() {
    const next = !bellOpen
    setBellOpen(next)
    if (next && user && unreadCount > 0) {
      const updated = new Set(readIds)
      visible.forEach((a) => updated.add(a.id))
      setReadIds(updated)
      saveReadIds(user.id, updated)
    }
  }

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
          <ThemeToggle compact />

          <div className="h-4 w-px bg-[#C8A96A]/15" />

          {/* Bell with badge + dropdown */}
          <div className="relative" ref={bellRef}>
            <button
              onClick={handleBellClick}
              className="relative text-[#A8B0C0]/50 hover:text-[#A8B0C0] transition-colors"
              aria-label="Announcements"
            >
              <Bell size={16} strokeWidth={1.5} />
              {unreadCount > 0 && (
                <span
                  className="absolute -top-1.5 -right-1.5 flex items-center justify-center rounded-full bg-red-500 text-white font-sans font-semibold leading-none"
                  style={{ fontSize: "9px", minWidth: "15px", height: "15px", padding: "0 3px" }}
                >
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {bellOpen && (
              <div className="absolute right-0 top-full mt-2 w-[320px] rounded-sm border border-[#C8A96A]/15 bg-[#0D1526] shadow-2xl z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-[#C8A96A]/10 flex items-center justify-between">
                  <span className="font-sans font-medium text-[#F5F1E8]" style={{ fontSize: "13px" }}>
                    Announcements
                  </span>
                  <span className="font-sans text-[#A8B0C0]/40" style={{ fontSize: "11px" }}>
                    {visible.length} total
                  </span>
                </div>

                <div className="max-h-[320px] overflow-y-auto">
                  {visible.length === 0 ? (
                    <p className="px-4 py-5 font-sans text-[#A8B0C0]/50 italic" style={{ fontSize: "13px" }}>
                      No announcements for your role.
                    </p>
                  ) : (
                    visible.map((ann) => (
                      <div
                        key={ann.id}
                        className="px-4 py-3 border-b border-[rgba(200,169,106,0.06)] hover:bg-[#101827] transition-colors"
                      >
                        <div className="flex items-start gap-2.5">
                          <div
                            className="w-0.5 self-stretch rounded-full shrink-0 mt-0.5"
                            style={{ backgroundColor: PRIORITY_BAR[ann.priority] ?? "#A8B0C0" }}
                          />
                          <div className="min-w-0">
                            <p
                              className="font-sans font-medium text-[#F5F1E8] leading-snug"
                              style={{ fontSize: "13px", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden" }}
                            >
                              {ann.title}
                            </p>
                            <p
                              className="font-sans text-[#A8B0C0]/70 mt-0.5"
                              style={{ fontSize: "12px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}
                            >
                              {ann.message}
                            </p>
                            <p className="font-sans text-[#A8B0C0]/40 mt-1" style={{ fontSize: "11px" }}>
                              {ann.postedBy} · {ann.date}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <button
                  onClick={() => { setBellOpen(false); router.push("/portal/announcements") }}
                  className="w-full px-4 py-2.5 font-sans font-medium text-[#C8A96A] hover:bg-[#101827] transition-colors text-center border-t border-[#C8A96A]/10"
                  style={{ fontSize: "12px" }}
                >
                  View all announcements →
                </button>
              </div>
            )}
          </div>

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
            {user.image && (
              <img
                src={user.image}
                alt={user.name}
                className="h-9 w-9 rounded-sm object-cover ring-1 ring-[#C8A96A]/25"
              />
            )}
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
