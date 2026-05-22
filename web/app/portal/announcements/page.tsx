"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Topbar } from "@/components/portal/Topbar"
import { mockAnnouncements } from "@/data/mockAnnouncements"
import { usePortal } from "@/contexts/PortalContext"
import { AnnouncementPriority, AnnouncementAudience } from "@/types/portal"

const PRIORITY_STYLE: Record<AnnouncementPriority, { badge: string; bar: string; label: string }> = {
  Urgent:    { badge: "bg-red-900/30 text-red-300 border border-red-700/25",       bar: "#FC8181", label: "Urgent"    },
  Important: { badge: "bg-amber-900/30 text-amber-300 border border-amber-700/25", bar: "#C8A96A", label: "Important" },
  Standard:  { badge: "bg-zinc-800/40 text-zinc-400 border border-zinc-700/25",    bar: "#A8B0C0", label: "Standard"  },
}

const AUDIENCE_ROLES: Record<AnnouncementAudience, string[]> = {
  "All Team":     ["CEO", "Senior Advisor", "Advisor", "Associate", "Analyst", "Intern Analyst"],
  "Advisors":     ["CEO", "Senior Advisor", "Advisor"],
  "Analysts":     ["Analyst", "Intern Analyst"],
  "Project Team": ["CEO", "Senior Advisor", "Advisor", "Associate", "Analyst", "Intern Analyst"],
}

export default function AnnouncementsPage() {
  const { user } = usePortal()
  const [expanded, setExpanded] = useState<string | null>(mockAnnouncements[0]?.id ?? null)

  const visible = mockAnnouncements.filter((a) => {
    if (!user) return false
    return AUDIENCE_ROLES[a.audience]?.includes(user.role)
  })

  return (
    <>
      <Topbar title="Announcements" subtitle="Firm-wide communications and operational notices" />
      <div className="flex-1 overflow-y-auto p-7">
        <div className="max-w-3xl">
          <div className="space-y-3">
            {visible.map((ann) => {
              const style = PRIORITY_STYLE[ann.priority]
              const isOpen = expanded === ann.id

              return (
                <div
                  key={ann.id}
                  className="rounded-sm border border-[rgba(200,169,106,0.12)] overflow-hidden bg-[#070B14]"
                >
                  <button
                    onClick={() => setExpanded(isOpen ? null : ann.id)}
                    className="w-full flex items-start gap-4 p-5 text-left hover:bg-[#101827] transition-colors"
                  >
                    <div className="w-0.5 self-stretch rounded-full shrink-0 mt-0.5" style={{ backgroundColor: style.bar }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className={cn("rounded-sm px-1.5 py-0.5 text-[10px] font-medium tracking-wide uppercase", style.badge)}>
                          {style.label}
                        </span>
                        <span className="text-[10px] text-[#A8B0C0]/50 uppercase tracking-wide">{ann.audience}</span>
                      </div>
                      <h3 className="text-[16px] font-medium text-[#F5F1E8] leading-snug">{ann.title}</h3>
                      <p className="text-[13px] text-[#A8B0C0] mt-1.5">{ann.postedBy} · {ann.date}</p>
                    </div>
                    <div className={cn("text-[#A8B0C0] transition-transform duration-200 shrink-0 mt-0.5", isOpen && "rotate-180")}>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 border-t border-[rgba(200,169,106,0.08)]">
                      <div className="pl-4 pt-4">
                        <p className="text-[14px] text-[#F5F1E8]/80 leading-relaxed">{ann.message}</p>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {visible.length === 0 && (
            <p className="text-sm text-[#A8B0C0]/50 italic">No announcements for your role.</p>
          )}
        </div>
      </div>
    </>
  )
}
