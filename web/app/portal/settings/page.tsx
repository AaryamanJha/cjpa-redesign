"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Topbar } from "@/components/portal/Topbar"
import { usePortal } from "@/contexts/PortalContext"
import { RoleBadge } from "@/components/portal/RoleBadge"

interface Toggle {
  id: string
  label: string
  description: string
  defaultOn: boolean
}

const NOTIFICATION_TOGGLES: Toggle[] = [
  { id: "task_assigned",   label: "Task Assignments",      description: "Notify when a task is assigned to you.",                  defaultOn: true  },
  { id: "task_due",        label: "Upcoming Deadlines",    description: "Receive reminders 48 hours before a task deadline.",      defaultOn: true  },
  { id: "project_update",  label: "Project Status Updates", description: "Notify when a project status changes.",                  defaultOn: true  },
  { id: "announcements",   label: "New Announcements",     description: "Notify on new firm-wide or role-specific announcements.", defaultOn: true  },
  { id: "newsletter",      label: "Newsletter Milestones", description: "Notify when a newsletter issue moves to In Review.",      defaultOn: false },
  { id: "calendar_invite", label: "Calendar Events",       description: "Notify when you are added to a meeting or event.",        defaultOn: true  },
]

const DISPLAY_TOGGLES: Toggle[] = [
  { id: "show_overdue",  label: "Highlight Overdue Items",  description: "Show red indicators for overdue tasks and deadlines.", defaultOn: true  },
  { id: "dense_mode",   label: "Compact Task View",        description: "Reduce padding in task and project lists.",            defaultOn: false },
  { id: "show_role",    label: "Show Role Badge",          description: "Display your role badge in the portal header.",       defaultOn: true  },
]

function ToggleSwitch({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "relative w-9 h-5 rounded-full transition-colors duration-200 shrink-0",
        on ? "bg-[#C8A96A]" : "bg-[#1a2535]"
      )}
      aria-pressed={on}
    >
      <span
        className={cn(
          "absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200",
          on ? "translate-x-4" : "translate-x-0"
        )}
      />
    </button>
  )
}

function ToggleRow({ toggle, on, onToggle }: { toggle: Toggle; on: boolean; onToggle: () => void }) {
  return (
    <div className="flex items-center justify-between gap-6 py-3.5 border-b border-[rgba(200,169,106,0.06)] last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-[15px] font-medium text-[#F5F1E8]">{toggle.label}</p>
        <p className="text-[13px] text-[#A8B0C0] mt-0.5 leading-snug">{toggle.description}</p>
      </div>
      <ToggleSwitch on={on} onToggle={onToggle} />
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-sm border border-[rgba(200,169,106,0.12)] bg-[#070B14] overflow-hidden">
      <div className="px-5 py-3 bg-[#0D1520] border-b border-[rgba(200,169,106,0.10)]">
        <p className="text-[11px] font-medium text-[#A8B0C0] tracking-widest uppercase">{title}</p>
      </div>
      <div className="px-5">{children}</div>
    </div>
  )
}

export default function SettingsPage() {
  const { user, logout } = usePortal()

  const [notifToggles, setNotifToggles] = useState<Record<string, boolean>>(
    Object.fromEntries(NOTIFICATION_TOGGLES.map((t) => [t.id, t.defaultOn]))
  )
  const [displayToggles, setDisplayToggles] = useState<Record<string, boolean>>(
    Object.fromEntries(DISPLAY_TOGGLES.map((t) => [t.id, t.defaultOn]))
  )

  if (!user) return null

  const firstName = user.name.split(" ")[0]

  return (
    <>
      <Topbar title="Settings" subtitle="Account profile and portal preferences" />
      <div className="flex-1 overflow-y-auto p-7"><div className="max-w-2xl space-y-5">
        {/* Profile */}
        <Section title="Profile">
          <div className="py-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-sm bg-[#1a2535] border border-[rgba(200,169,106,0.15)] flex items-center justify-center text-[#C8A96A] font-serif text-xl font-light select-none">
                  {firstName[0]}
                </div>
                <div>
                  <p className="text-[16px] font-medium text-[#F5F1E8]">{user.name}</p>
                  <p className="text-[13px] text-[#A8B0C0] mt-0.5">{user.title}</p>
                </div>
              </div>
              <RoleBadge role={user.role} />
            </div>

            <div className="grid grid-cols-2 gap-3 text-[14px]">
              <div>
                <p className="text-[11px] text-[#A8B0C0] tracking-widest uppercase mb-1">Portal ID</p>
                <p className="font-mono text-[#F5F1E8]">{user.id}</p>
              </div>
              <div>
                <p className="text-[11px] text-[#A8B0C0] tracking-widest uppercase mb-1">Role</p>
                <p className="text-[#F5F1E8]">{user.role}</p>
              </div>
            </div>

            <div className="rounded-sm bg-[#0D1520] border border-[rgba(200,169,106,0.08)] px-3.5 py-2.5 text-[12px] text-[#A8B0C0]/60 leading-snug">
              Profile management is handled by your firm administrator. Contact the CJPA operations team to update your name, title, or role.
            </div>
          </div>
        </Section>

        {/* Notifications */}
        <Section title="Notifications">
          {NOTIFICATION_TOGGLES.map((toggle) => (
            <ToggleRow
              key={toggle.id}
              toggle={toggle}
              on={notifToggles[toggle.id]}
              onToggle={() => setNotifToggles((prev) => ({ ...prev, [toggle.id]: !prev[toggle.id] }))}
            />
          ))}
          <div className="py-3 text-[12px] text-[#A8B0C0]/40 italic">
            Notifications are simulated — this is a prototype portal.
          </div>
        </Section>

        {/* Display */}
        <Section title="Display">
          {DISPLAY_TOGGLES.map((toggle) => (
            <ToggleRow
              key={toggle.id}
              toggle={toggle}
              on={displayToggles[toggle.id]}
              onToggle={() => setDisplayToggles((prev) => ({ ...prev, [toggle.id]: !prev[toggle.id] }))}
            />
          ))}
        </Section>

        {/* Session */}
        <Section title="Session">
          <div className="py-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#A8B0C0]">Authentication method</span>
              <span className="text-[#F5F1E8]/60 font-mono text-[12px]">CJPA ID mock + Supabase sync</span>
            </div>
            <div className="h-px bg-[rgba(200,169,106,0.06)]" />
            <button
              onClick={() => {
                if (confirm("Sign out of the CJPA portal?")) logout()
              }}
              className="w-full text-left text-sm text-red-400 hover:text-red-300 transition-colors py-0.5"
            >
              Sign out
            </button>
          </div>
        </Section>
      </div></div>
    </>
  )
}
