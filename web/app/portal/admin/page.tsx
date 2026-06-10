"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Plus, Trash2, ShieldCheck, AlertCircle, Shield } from "lucide-react"
import { Topbar } from "@/components/portal/Topbar"
import { usePortal } from "@/contexts/PortalContext"
import { PortalRole, PortalUser } from "@/types/portal"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// ─── id generation ───────────────────────────────────────────────────────────

const HONORIFICS = new Set(["dr.", "dr", "mr.", "mr", "mrs.", "mrs", "ms.", "ms", "prof.", "prof", "sir"])

function generatePortalId(name: string): string {
  const parts = name.toLowerCase().split(/\s+/).filter((w) => w.length > 0 && !HONORIFICS.has(w))
  if (parts.length === 0) return ""
  const first = parts[0].replace(/[^a-z]/g, "")
  const last = parts.length > 1 ? parts[parts.length - 1].replace(/[^a-z]/g, "") : ""
  return first + last
}

// ─── role options ─────────────────────────────────────────────────────────────

const ROLES: PortalRole[] = ["CEO", "Senior Advisor", "Advisor", "Associate", "Analyst", "Intern Analyst"]

const ROLE_COLOR: Record<PortalRole, string> = {
  "CEO":            "#C8A96A",
  "Senior Advisor": "#9A89FF",
  "Advisor":        "#63B3ED",
  "Associate":      "#68D391",
  "Analyst":        "#F6AD55",
  "Intern Analyst": "#A8B0C0",
}

// ─── add member dialog ────────────────────────────────────────────────────────

interface NewMemberForm { name: string; title: string; role: PortalRole; id: string; email: string }
const EMPTY: NewMemberForm = { name: "", title: "", role: "Analyst", id: "", email: "" }

function Field({ label, children, error, required, hint }: {
  label: string; children: React.ReactNode; error?: string; required?: boolean; hint?: string
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}{required && <span className="text-red-400 ml-0.5">*</span>}</Label>
      {hint && <p className="text-[12px] text-[#A8B0C0]/60">{hint}</p>}
      {children}
      {error && <p className="text-[12px] text-red-400 mt-1">{error}</p>}
    </div>
  )
}

function AddMemberDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { addTeamMember } = usePortal()
  const [form, setForm] = useState<NewMemberForm>(EMPTY)
  const [errors, setErrors] = useState<Partial<NewMemberForm>>({})
  const [serverError, setServerError] = useState("")
  const [idEdited, setIdEdited] = useState(false)

  function set<K extends keyof NewMemberForm>(k: K, v: NewMemberForm[K]) {
    setForm((f) => ({ ...f, [k]: v })); setErrors((e) => ({ ...e, [k]: undefined })); setServerError("")
  }

  function handleNameChange(name: string) {
    set("name", name)
    if (!idEdited) setForm((f) => ({ ...f, name, id: generatePortalId(name) }))
  }

  function handleIdChange(val: string) {
    setIdEdited(true); set("id", val.toLowerCase().replace(/[^a-z0-9]/g, ""))
  }

  function validate() {
    const e: Partial<NewMemberForm> = {}
    if (!form.name.trim()) e.name = "Required"
    if (!form.title.trim()) e.title = "Required"
    if (!form.id.trim()) e.id = "Required"
    return e
  }

  function handleSubmit() {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    const result = addTeamMember(form)
    if (!result.success) { setServerError(result.error ?? "Error"); return }
    setForm(EMPTY); setErrors({}); setServerError(""); setIdEdited(false); onClose()
  }

  function handleClose() {
    setForm(EMPTY); setErrors({}); setServerError(""); setIdEdited(false); onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose() }}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>Add Team Member</DialogTitle></DialogHeader>
        <div className="space-y-4 mt-2">
          <Field label="Full Name" error={errors.name} required>
            <Input placeholder="e.g. Sarah Hutchinson" value={form.name} onChange={(e) => handleNameChange(e.target.value)} />
          </Field>
          <Field label="Job Title" error={errors.title} required>
            <Input placeholder="e.g. Research Analyst" value={form.title} onChange={(e) => set("title", e.target.value)} />
          </Field>
          <Field label="Role" required>
            <Select value={form.role} onValueChange={(v) => set("role", v as PortalRole)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {ROLES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Portal Login ID" error={errors.id} required hint="Auto-generated as firstnamelastname. Letters and numbers only.">
            <Input placeholder="e.g. sarahhutchinson" value={form.id} onChange={(e) => handleIdChange(e.target.value)} className="font-mono" />
          </Field>
          <Field label="Microsoft Email" hint="Allows sign-in with Microsoft. Leave blank to use Portal ID only.">
            <Input placeholder="e.g. sarah@cjpa.us" value={form.email} onChange={(e) => set("email", e.target.value.toLowerCase())} />
          </Field>
          {serverError && (
            <div className="flex items-center gap-2 rounded-sm border border-red-700/30 bg-red-900/20 px-3 py-2.5">
              <AlertCircle size={13} className="text-red-400 shrink-0" strokeWidth={1.5} />
              <p className="text-[13px] text-red-400">{serverError}</p>
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2 mt-2 pt-4 border-t border-border">
          <Button variant="ghost" onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Add Member</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ─── confirm remove ───────────────────────────────────────────────────────────

function ConfirmRemoveDialog({ name, onConfirm, onCancel }: {
  name: string; onConfirm: () => void; onCancel: () => void
}) {
  return (
    <Dialog open onOpenChange={(v) => { if (!v) onCancel() }}>
      <DialogContent className="max-w-sm">
        <DialogHeader><DialogTitle>Remove team member?</DialogTitle></DialogHeader>
        <p className="text-sm text-[#A8B0C0] mt-1 leading-relaxed">
          <span className="text-[#F5F1E8] font-medium">{name}</span> will no longer be able to log in to the portal.
        </p>
        <div className="flex justify-end gap-2 pt-4 border-t border-border mt-2">
          <Button variant="ghost" onClick={onCancel}>Cancel</Button>
          <Button variant="destructive" onClick={onConfirm}>Remove</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ─── inline role select ───────────────────────────────────────────────────────

function RoleSelect({ member, disabled }: { member: PortalUser; disabled: boolean }) {
  const { updateTeamMember } = usePortal()
  return (
    <Select
      value={member.role}
      onValueChange={(v) => updateTeamMember(member.id, { role: v as PortalRole })}
      disabled={disabled}
    >
      <SelectTrigger
        className="h-7 border-0 bg-transparent p-0 focus:ring-0 cursor-pointer"
        style={{ width: "auto", minWidth: 0 }}
      >
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: ROLE_COLOR[member.role] }} />
          <span className="font-sans text-[#F5F1E8]" style={{ fontSize: "13px" }}>{member.role}</span>
        </div>
      </SelectTrigger>
      <SelectContent>
        {ROLES.map((r) => (
          <SelectItem key={r} value={r}>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: ROLE_COLOR[r] }} />
              {r}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

// ─── portal admin toggle ──────────────────────────────────────────────────────

function AdminToggle({ member, disabled }: { member: PortalUser; disabled: boolean }) {
  const { updateTeamMember } = usePortal()
  const isCEO = member.permissions.includes("all")
  const active = isCEO || !!member.isPortalAdmin

  if (isCEO) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-sm px-2 py-0.5 font-sans"
        style={{ fontSize: "10px", color: "#C8A96A", background: "rgba(200,169,106,0.10)", border: "1px solid rgba(200,169,106,0.25)" }}>
        <Shield size={10} strokeWidth={1.5} /> CEO
      </span>
    )
  }

  return (
    <button
      disabled={disabled}
      onClick={() => updateTeamMember(member.id, { isPortalAdmin: !member.isPortalAdmin })}
      title={active ? "Revoke admin access" : "Grant admin access"}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-sm px-2 py-0.5 font-sans transition-colors cursor-pointer",
        active
          ? "text-[#9A89FF]"
          : "text-[#A8B0C0]/50 hover:text-[#A8B0C0]",
        disabled && "opacity-40 cursor-not-allowed"
      )}
      style={{
        fontSize: "10px",
        background: active ? "rgba(154,137,255,0.10)" : "rgba(168,176,192,0.06)",
        border: `1px solid ${active ? "rgba(154,137,255,0.25)" : "rgba(168,176,192,0.15)"}`,
      }}
    >
      <Shield size={10} strokeWidth={1.5} />
      {active ? "Admin" : "Standard"}
    </button>
  )
}

// ─── inline email cell ───────────────────────────────────────────────────────

function EmailCell({ member }: { member: PortalUser }) {
  const { updateTeamMember } = usePortal()
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(member.email ?? "")
  const inputRef = useRef<HTMLInputElement>(null)

  function startEdit() { setValue(member.email ?? ""); setEditing(true); setTimeout(() => inputRef.current?.focus(), 0) }
  function save() { updateTeamMember(member.id, { email: value.trim().toLowerCase() || undefined }); setEditing(false) }
  function cancel() { setEditing(false) }

  if (editing) {
    return (
      <div className="pr-4 flex items-center gap-1">
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value.toLowerCase())}
          onKeyDown={(e) => { if (e.key === "Enter") save(); if (e.key === "Escape") cancel() }}
          onBlur={save}
          placeholder="email@cjpa.us"
          className="w-full bg-[#0D1520] border border-[#C8A96A]/30 text-[#F5F1E8] font-sans rounded-sm px-2 py-1 outline-none"
          style={{ fontSize: "12px" }}
        />
      </div>
    )
  }

  return (
    <button
      onClick={startEdit}
      title="Click to set Microsoft email"
      className="pr-4 text-left w-full group"
    >
      {member.email ? (
        <span className="font-sans text-[#A8B0C0]/80 group-hover:text-[#C8A96A] transition-colors truncate block" style={{ fontSize: "12px" }}>
          {member.email}
        </span>
      ) : (
        <span className="font-sans text-[#A8B0C0]/25 group-hover:text-[#A8B0C0]/50 transition-colors" style={{ fontSize: "12px" }}>
          + add email
        </span>
      )}
    </button>
  )
}

// ─── main page ────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const router = useRouter()
  const { user, isAdmin, teamMembers, removeTeamMember } = usePortal()
  const [addOpen, setAddOpen] = useState(false)
  const [confirmRemove, setConfirmRemove] = useState<{ id: string; name: string } | null>(null)

  // Guard — redirect non-admins
  if (user && !isAdmin) {
    router.replace("/portal")
    return null
  }

  const isCEO = !!user?.permissions.includes("all")

  return (
    <>
      <Topbar title="Admin" subtitle="Team access management — prototype portal only" />

      <div className="flex-1 overflow-y-auto p-7">
        <div className="max-w-4xl space-y-6">

          {/* Prototype notice */}
          <div className="flex items-start gap-3 rounded-sm border border-[#C8A96A]/15 bg-[#C8A96A]/06 px-4 py-3.5">
            <ShieldCheck size={14} className="text-[#C8A96A] shrink-0 mt-0.5" strokeWidth={1.5} />
            <p className="font-sans text-[#A8B0C0]" style={{ fontSize: "13px", lineHeight: 1.6 }}>
              <span className="text-[#C8A96A] font-medium">Prototype admin panel.</span>{" "}
              Changes sync through Supabase when configured, with localStorage fallback on this device.
              In production, this connects to a real user directory.
            </p>
          </div>

          {/* Team members table */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-sans text-[#A8B0C0] uppercase" style={{ fontSize: "10px", letterSpacing: "0.18em" }}>Team</p>
                <p className="font-sans font-medium text-[#F5F1E8] mt-0.5" style={{ fontSize: "16px" }}>Portal Members</p>
              </div>
              <button
                onClick={() => setAddOpen(true)}
                className="flex items-center gap-1.5 rounded-sm px-3 py-1.5 font-sans font-medium transition-colors cursor-pointer"
                style={{ fontSize: "13px", background: "rgba(200,169,106,0.12)", color: "#C8A96A", border: "1px solid rgba(200,169,106,0.3)" }}
              >
                <Plus size={13} strokeWidth={2} /> Add Member
              </button>
            </div>

            <div className="rounded-sm border border-[rgba(200,169,106,0.14)] overflow-hidden">
              {/* Header */}
              <div className="grid px-5 py-2.5 bg-[#0D1520] border-b border-[rgba(200,169,106,0.10)]"
                style={{ gridTemplateColumns: "1fr 1fr 160px 140px 180px 100px auto" }}>
                {["Name", "Title", "Role", "Portal ID", "Microsoft Email", "Admin Access", ""].map((h, i) => (
                  <span key={i} className="font-sans text-[#A8B0C0] uppercase" style={{ fontSize: "10.5px", letterSpacing: "0.15em" }}>{h}</span>
                ))}
              </div>

              {/* Rows */}
              {teamMembers.map((member) => {
                const isSelf    = member.id === user?.id
                const memberIsCEO = member.permissions.includes("all")
                const canEdit   = isCEO && !isSelf && !memberIsCEO
                const canRemove = isCEO && !isSelf && !memberIsCEO

                return (
                  <div
                    key={member.id}
                    className="grid px-5 py-3.5 border-b border-[rgba(200,169,106,0.06)] last:border-0 bg-[#070B14] items-center"
                    style={{ gridTemplateColumns: "1fr 1fr 160px 140px 180px 100px auto" }}
                  >
                    <div className="min-w-0 pr-4">
                      <p className="font-sans font-medium text-[#F5F1E8] truncate" style={{ fontSize: "14px" }}>
                        {member.name}
                        {isSelf && <span className="ml-2 text-[10px] text-[#C8A96A] font-normal">(you)</span>}
                      </p>
                    </div>

                    <p className="font-sans text-[#A8B0C0] truncate pr-4" style={{ fontSize: "13px" }}>{member.title}</p>

                    <div className="pr-4">
                      {canEdit ? (
                        <RoleSelect member={member} disabled={false} />
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: ROLE_COLOR[member.role] }} />
                          <span className="font-sans text-[#F5F1E8]" style={{ fontSize: "13px" }}>{member.role}</span>
                        </div>
                      )}
                    </div>

                    <p className="font-mono text-[#A8B0C0]/70 pr-4" style={{ fontSize: "12px" }}>{member.id}</p>

                    <EmailCell member={member} />

                    <div>
                      <AdminToggle member={member} disabled={!isCEO || isSelf} />
                    </div>

                    <div className="flex justify-end pl-2">
                      {canRemove ? (
                        <button
                          onClick={() => setConfirmRemove({ id: member.id, name: member.name })}
                          className="text-[#A8B0C0]/30 hover:text-red-400 transition-colors cursor-pointer p-1"
                          title="Remove member"
                        >
                          <Trash2 size={13} strokeWidth={1.5} />
                        </button>
                      ) : (
                        <div className="w-6" />
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            <p className="font-sans text-[#A8B0C0]/40 mt-3" style={{ fontSize: "12px" }}>
              {teamMembers.length} member{teamMembers.length !== 1 ? "s" : ""} · Login IDs are case-insensitive ·{" "}
              <span className="text-[#9A89FF]/60">Admin Access</span> grants access to this panel
            </p>
          </div>

          {/* Role reference */}
          <div className="rounded-sm border border-[rgba(200,169,106,0.10)] bg-[#070B14] overflow-hidden">
            <div className="px-5 py-3 bg-[#0D1520] border-b border-[rgba(200,169,106,0.08)]">
              <p className="font-sans text-[#A8B0C0] uppercase" style={{ fontSize: "10px", letterSpacing: "0.18em" }}>Reference</p>
              <p className="font-sans font-medium text-[#F5F1E8] mt-0.5" style={{ fontSize: "16px" }}>Role Hierarchy &amp; Access</p>
            </div>
            <div className="px-5 py-1">
              {ROLES.map((role) => (
                <div key={role} className="flex items-center gap-3 py-2.5 border-b border-[rgba(200,169,106,0.05)] last:border-0">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: ROLE_COLOR[role] }} />
                  <span className="font-sans text-[#F5F1E8] w-36 shrink-0" style={{ fontSize: "14px" }}>{role}</span>
                  <span className="font-sans text-[#A8B0C0]" style={{ fontSize: "13px" }}>
                    {role === "CEO" && "Full access — all sections, admin panel, all tasks and projects"}
                    {role === "Senior Advisor" && "All projects, task assignment, client visibility, calendar"}
                    {role === "Advisor" && "Project and task management, own calendar, clients"}
                    {role === "Associate" && "Assigned projects and tasks, own calendar, file uploads"}
                    {role === "Analyst" && "Assigned projects, tasks, deadlines, group calendar view"}
                    {role === "Intern Analyst" && "Assigned tasks only, own calendar, deadlines"}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      <AddMemberDialog open={addOpen} onClose={() => setAddOpen(false)} />

      {confirmRemove && (
        <ConfirmRemoveDialog
          name={confirmRemove.name}
          onConfirm={() => { removeTeamMember(confirmRemove.id); setConfirmRemove(null) }}
          onCancel={() => setConfirmRemove(null)}
        />
      )}
    </>
  )
}
