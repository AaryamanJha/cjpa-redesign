"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Topbar } from "@/components/portal/Topbar"
import { usePortal } from "@/contexts/PortalContext"
import { Announcement, AnnouncementPriority, AnnouncementAudience } from "@/types/portal"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"
import { teamMembers } from "@/data/teamMembers"

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
  canNotify,
}: {
  open: boolean
  onClose: () => void
  initial?: Announcement
  currentUser: string
  onSave: (announcement: Announcement, notify: boolean) => void
  canNotify: boolean
}) {
  const [form, setForm] = useState<AnnouncementFormData>(() => initial ? {
    title: initial.title,
    message: initial.message,
    priority: initial.priority,
    audience: initial.audience,
  } : EMPTY_FORM)
  const [errors, setErrors] = useState<Partial<Record<keyof AnnouncementFormData, string>>>({})
  const [notify, setNotify] = useState(false)

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
    }, notify)
    setForm(EMPTY_FORM)
    setErrors({})
    setNotify(false)
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

          {!initial && canNotify && (
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={notify}
                onChange={(e) => setNotify(e.target.checked)}
                className="rounded border-[#A8B0C0]/40 accent-[#C8A96A] w-3.5 h-3.5"
              />
              <span className="text-[13px] text-[#A8B0C0]">
                Notify team by email
              </span>
            </label>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-border">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>{initial ? "Save Changes" : "Publish"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function DeleteConfirmDialog({
  announcement,
  onConfirm,
  onCancel,
}: {
  announcement: Announcement
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <Dialog open onOpenChange={(open) => { if (!open) onCancel() }}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Delete Announcement</DialogTitle>
        </DialogHeader>
        <p className="text-[14px] text-[#A8B0C0] mt-1">
          Are you sure you want to delete <span className="text-[#F5F1E8]">&ldquo;{announcement.title}&rdquo;</span>? This cannot be undone.
        </p>
        <div className="flex justify-end gap-2 pt-4 border-t border-border mt-2">
          <Button variant="ghost" onClick={onCancel}>Cancel</Button>
          <Button variant="destructive" onClick={onConfirm}>Delete</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

async function sendTeamNotification(
  announcement: Announcement,
  accessToken: string,
  senderEmail: string
) {
  const audienceRoles = AUDIENCE_ROLES[announcement.audience] ?? []
  const recipientEmails = teamMembers
    .filter((m) => m.email && audienceRoles.includes(m.portalRole))
    .map((m) => m.email as string)
    .filter((e) => e !== senderEmail)

  if (recipientEmails.length === 0) return

  const priorityLabel = announcement.priority === "Urgent" ? "🔴 URGENT" :
    announcement.priority === "Important" ? "🟡 Important" : "📋"

  const subject = `${priorityLabel} CJPA Announcement: ${announcement.title}`
  const body = `<div style="font-family:sans-serif;color:#1a1a1a;max-width:600px">
<p style="color:#888;font-size:12px;margin-bottom:16px">
  CJPA Internal — ${announcement.audience} · ${announcement.date}
</p>
<h2 style="font-size:20px;margin:0 0 16px">${announcement.title}</h2>
<p style="font-size:15px;line-height:1.7;white-space:pre-wrap">${announcement.message}</p>
<hr style="margin:24px 0;border:none;border-top:1px solid #eee"/>
<p style="font-size:12px;color:#aaa">Posted by ${announcement.postedBy} via the CJPA Portal</p>
</div>`

  await fetch("/api/email/graph-send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      to: senderEmail,
      bcc: recipientEmails.join(","),
      subject,
      body,
      bodyType: "HTML",
      accessToken,
    }),
  })
}

export default function AnnouncementsPage() {
  const { user, announcements, isAdmin, hasPermission, addAnnouncement, updateAnnouncement, deleteAnnouncement } = usePortal()
  const { data: session } = useSession()
  const [expanded, setExpanded] = useState<string | null>(announcements[0]?.id ?? null)
  const [createOpen, setCreateOpen] = useState(false)
  const [editing, setEditing] = useState<Announcement | null>(null)
  const [deleting, setDeleting] = useState<Announcement | null>(null)
  const canManage = isAdmin || hasPermission("manage_team")
  const hasOutlook = !!(session as { accessToken?: string } | null)?.accessToken

  const visible = announcements.filter((a) => {
    if (!user) return false
    return AUDIENCE_ROLES[a.audience]?.includes(user.role)
  })

  async function handleSave(announcement: Announcement, notify: boolean) {
    if (editing) {
      updateAnnouncement(editing.id, announcement)
      setEditing(null)
      return
    }
    addAnnouncement(announcement)
    setExpanded(announcement.id)

    if (notify && hasOutlook && session?.user?.email) {
      const token = (session as { accessToken?: string }).accessToken
      if (token) {
        sendTeamNotification(announcement, token, session.user.email).catch(console.error)
      }
    }
  }

  function handleDelete(announcement: Announcement) {
    deleteAnnouncement(announcement.id)
    setDeleting(null)
    if (expanded === announcement.id) setExpanded(null)
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
                        <>
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
                          <span
                            onClick={(event) => {
                              event.stopPropagation()
                              setDeleting(ann)
                            }}
                            className="text-[#A8B0C0]/60 hover:text-red-400 transition-colors"
                            role="button"
                            aria-label={`Delete ${ann.title}`}
                          >
                            <Trash2 size={14} strokeWidth={1.5} />
                          </span>
                        </>
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
          canNotify={hasOutlook}
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
          canNotify={false}
        />
      )}

      {deleting && (
        <DeleteConfirmDialog
          announcement={deleting}
          onConfirm={() => handleDelete(deleting)}
          onCancel={() => setDeleting(null)}
        />
      )}
    </>
  )
}
