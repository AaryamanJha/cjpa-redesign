"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Topbar } from "@/components/portal/Topbar"
import { usePortal } from "@/contexts/PortalContext"
import { Announcement, AnnouncementPriority, AnnouncementAudience } from "@/types/portal"
import { Plus, Pencil } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

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

const AUDIENCES: AnnouncementAudience[] = ["All Team", "Advisors", "Analysts", "Project Team"]
const PRIORITIES: AnnouncementPriority[] = ["Standard", "Important", "Urgent"]

interface AnnouncementFormData {
  title: string
  message: string
  priority: AnnouncementPriority
  audience: AnnouncementAudience
}

const EMPTY_FORM: AnnouncementFormData = {
  title: "",
  message: "",
  priority: "Standard",
  audience: "All Team",
}

function AnnouncementDialog({
  open,
  onClose,
  initial,
  currentUser,
  onSave,
}: {
  open: boolean
  onClose: () => void
  initial?: Announcement
  currentUser: string
  onSave: (announcement: Announcement) => void
}) {
  const [form, setForm] = useState<AnnouncementFormData>(() => initial ? {
    title: initial.title,
    message: initial.message,
    priority: initial.priority,
    audience: initial.audience,
  } : EMPTY_FORM)
  const [errors, setErrors] = useState<Partial<Record<keyof AnnouncementFormData, string>>>({})

  function set<K extends keyof AnnouncementFormData>(key: K, value: AnnouncementFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  function handleSave() {
    const nextErrors: Partial<Record<keyof AnnouncementFormData, string>> = {}
    if (!form.title.trim()) nextErrors.title = "Required"
    if (!form.message.trim()) nextErrors.message = "Required"
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors)
      return
    }

    const today = new Date().toISOString().split("T")[0]
    onSave({
      id: initial?.id ?? `ann-${Date.now()}`,
      title: form.title.trim(),
      message: form.message.trim(),
      priority: form.priority,
      audience: form.audience,
      postedBy: initial?.postedBy ?? currentUser,
      date: initial?.date ?? today,
    })
    setForm(EMPTY_FORM)
    setErrors({})
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => { if (!nextOpen) onClose() }}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{initial ? "Edit Announcement" : "New Announcement"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label htmlFor="announcement-title">Title<span className="text-red-400 ml-0.5">*</span></Label>
            <Input id="announcement-title" value={form.title} onChange={(event) => set("title", event.target.value)} />
            {errors.title && <p className="text-[12px] text-red-400">{errors.title}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Priority</Label>
              <Select value={form.priority} onValueChange={(value) => set("priority", value as AnnouncementPriority)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PRIORITIES.map((priority) => <SelectItem key={priority} value={priority}>{priority}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Audience</Label>
              <Select value={form.audience} onValueChange={(value) => set("audience", value as AnnouncementAudience)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {AUDIENCES.map((audience) => <SelectItem key={audience} value={audience}>{audience}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="announcement-message">Message<span className="text-red-400 ml-0.5">*</span></Label>
            <Textarea id="announcement-message" rows={6} value={form.message} onChange={(event) => set("message", event.target.value)} />
            {errors.message && <p className="text-[12px] text-red-400">{errors.message}</p>}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-border">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>{initial ? "Save Changes" : "Publish"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function AnnouncementsPage() {
  const { user, announcements, isAdmin, hasPermission, addAnnouncement, updateAnnouncement } = usePortal()
  const [expanded, setExpanded] = useState<string | null>(announcements[0]?.id ?? null)
  const [createOpen, setCreateOpen] = useState(false)
  const [editing, setEditing] = useState<Announcement | null>(null)
  const canManage = isAdmin || hasPermission("manage_team")

  const visible = announcements.filter((a) => {
    if (!user) return false
    return AUDIENCE_ROLES[a.audience]?.includes(user.role)
  })

  function handleSave(announcement: Announcement) {
    if (editing) {
      updateAnnouncement(editing.id, announcement)
      setEditing(null)
      return
    }
    addAnnouncement(announcement)
    setExpanded(announcement.id)
  }

  return (
    <>
      <Topbar title="Announcements" subtitle="Firm-wide communications and operational notices" />
      <div className="flex-1 overflow-y-auto p-7">
        <div className="max-w-3xl">
          {canManage && (
            <div className="mb-5 flex justify-end">
              <button
                onClick={() => setCreateOpen(true)}
                className="flex items-center gap-1.5 rounded-sm px-3 py-1.5 font-sans font-medium transition-colors cursor-pointer shrink-0"
                style={{ fontSize: "13px", background: "rgba(200,169,106,0.12)", color: "#C8A96A", border: "1px solid rgba(200,169,106,0.3)" }}
              >
                <Plus size={13} strokeWidth={2} /> New Announcement
              </button>
            </div>
          )}

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
                    <div className="flex items-center gap-2 shrink-0 mt-0.5">
                      {canManage && (
                        <span
                          onClick={(event) => {
                            event.stopPropagation()
                            setEditing(ann)
                          }}
                          className="text-[#A8B0C0]/60 hover:text-[#C8A96A] transition-colors"
                          role="button"
                          aria-label={`Edit ${ann.title}`}
                        >
                          <Pencil size={14} strokeWidth={1.5} />
                        </span>
                      )}
                      <div className={cn("text-[#A8B0C0] transition-transform duration-200", isOpen && "rotate-180")}>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
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

      {user && (
        <AnnouncementDialog
          open={createOpen}
          onClose={() => setCreateOpen(false)}
          currentUser={user.name}
          onSave={handleSave}
        />
      )}

      {user && editing && (
        <AnnouncementDialog
          key={editing.id}
          open={!!editing}
          onClose={() => setEditing(null)}
          initial={editing}
          currentUser={user.name}
          onSave={handleSave}
        />
      )}
    </>
  )
}
