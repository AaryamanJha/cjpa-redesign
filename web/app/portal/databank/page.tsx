"use client"

import { useCallback, useState } from "react"
import { Check, Copy, Eye, EyeOff, ExternalLink, Lock, Pencil, Plus, Trash2, User, Building2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Topbar } from "@/components/portal/Topbar"
import { usePortal } from "@/contexts/PortalContext"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

// ═══════════════════════════════════════════════════════════
//  CONTACTS TAB
// ═══════════════════════════════════════════════════════════

interface ContactFormData { name: string; email: string; title: string; company: string; phone: string }
const EMPTY_CONTACT: ContactFormData = { name: "", email: "", title: "", company: "", phone: "" }

function ContactDialog({ open, onClose, initial, onSave, title: dialogTitle }: {
  open: boolean; onClose: () => void; initial: ContactFormData
  onSave: (data: ContactFormData) => void; title: string
}) {
  const [form, setForm] = useState<ContactFormData>(initial)
  const [errors, setErrors] = useState<Partial<ContactFormData>>({})

  function set<K extends keyof ContactFormData>(k: K, v: string) {
    setForm(f => ({ ...f, [k]: v }))
    setErrors(e => ({ ...e, [k]: undefined }))
  }

  function handleSave() {
    const e: Partial<ContactFormData> = {}
    if (!form.name.trim()) e.name = "Required"
    if (!form.email.trim()) e.email = "Required"
    if (Object.keys(e).length) { setErrors(e); return }
    onSave({ name: form.name.trim(), email: form.email.trim(), title: form.title.trim(), company: form.company.trim(), phone: form.phone.trim() })
  }

  return (
    <Dialog open={open} onOpenChange={v => { if (!v) onClose() }}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>{dialogTitle}</DialogTitle></DialogHeader>
        <div className="space-y-4 mt-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Full Name <span className="text-red-400">*</span></Label>
              <Input placeholder="Jane Smith" value={form.name} onChange={e => set("name", e.target.value)} />
              {errors.name && <p className="text-[12px] text-red-400">{errors.name}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Email <span className="text-red-400">*</span></Label>
              <Input type="email" placeholder="jane@example.com" value={form.email} onChange={e => set("email", e.target.value)} />
              {errors.email && <p className="text-[12px] text-red-400">{errors.email}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Title / Role</Label>
              <Input placeholder="e.g. Managing Director" value={form.title} onChange={e => set("title", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Company / Org</Label>
              <Input placeholder="e.g. Acme Corp" value={form.company} onChange={e => set("company", e.target.value)} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Phone</Label>
            <Input type="tel" placeholder="+1 (555) 000-0000" value={form.phone} onChange={e => set("phone", e.target.value)} />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-border">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function ClientContactDialog({ open, onClose, clientId, initial, onSave }: {
  open: boolean; onClose: () => void; clientId: string
  initial: { contactName: string; contactTitle: string; contactEmail: string }
  onSave: (contactName: string, contactTitle: string, contactEmail: string) => void
}) {
  const [form, setForm] = useState(initial)
  return (
    <Dialog open={open} onOpenChange={v => { if (!v) onClose() }}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>Edit Client Contact</DialogTitle></DialogHeader>
        <div className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label>Contact Name</Label>
            <Input value={form.contactName} onChange={e => setForm(f => ({ ...f, contactName: e.target.value }))} />
          </div>
          <div className="space-y-1.5">
            <Label>Title</Label>
            <Input value={form.contactTitle} onChange={e => setForm(f => ({ ...f, contactTitle: e.target.value }))} />
          </div>
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input type="email" value={form.contactEmail} onChange={e => setForm(f => ({ ...f, contactEmail: e.target.value }))} />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-border">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={() => onSave(form.contactName, form.contactTitle, form.contactEmail)}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function CopyBtn({ value }: { value: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(value).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500) }) }}
      className="p-1 text-[#A8B0C0]/30 hover:text-[#C8A96A]/70 transition-colors cursor-pointer shrink-0"
      title="Copy"
    >
      {copied ? <Check size={12} strokeWidth={2} className="text-emerald-400" /> : <Copy size={12} strokeWidth={1.5} />}
    </button>
  )
}

type SourceTag = "Team" | "Client" | "Contact"

interface ContactRow {
  id: string
  name: string
  email: string
  title: string
  company: string
  phone: string
  source: SourceTag
  sourceId?: string
}

const SOURCE_STYLE: Record<SourceTag, { badge: string; label: string }> = {
  Team:    { badge: "bg-blue-900/30 text-blue-300 border border-blue-700/25",    label: "Team"    },
  Client:  { badge: "bg-amber-900/30 text-amber-300 border border-amber-700/25", label: "Client"  },
  Contact: { badge: "bg-zinc-800/40 text-zinc-400 border border-zinc-700/25",    label: "Contact" },
}

function ContactsTab() {
  const { teamMembers, clients, contacts, addContact, updateContact, deleteContact, updateClient } = usePortal()
  const [search, setSearch] = useState("")
  const [addOpen, setAddOpen] = useState(false)
  const [editContact, setEditContact] = useState<ContactRow | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<ContactRow | null>(null)
  const [editClient, setEditClient] = useState<{ id: string; contactName: string; contactTitle: string; contactEmail: string } | null>(null)

  // Build unified rows
  const rows: ContactRow[] = [
    ...teamMembers
      .filter(m => m.email)
      .map(m => ({ id: m.id, name: m.name, email: m.email!, title: m.title, company: "CJPA", phone: "", source: "Team" as SourceTag })),
    ...clients
      .filter(c => c.contactName)
      .map(c => ({ id: c.id, name: c.contactName, email: c.contactEmail || "", title: c.contactTitle, company: c.name, phone: "", source: "Client" as SourceTag, sourceId: c.id })),
    ...contacts.map(c => ({ id: c.id, name: c.name, email: c.email, title: c.title || "", company: c.company || "", phone: c.phone || "", source: "Contact" as SourceTag })),
  ]

  const q = search.toLowerCase()
  const filtered = q
    ? rows.filter(r =>
        r.name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.company.toLowerCase().includes(q) ||
        r.title.toLowerCase().includes(q)
      )
    : rows

  function handleAddContact(data: ContactFormData) {
    addContact({ id: `contact-${Date.now()}`, name: data.name, email: data.email, title: data.title, company: data.company, phone: data.phone })
    setAddOpen(false)
  }

  function handleEditContact(data: ContactFormData) {
    if (!editContact) return
    if (editContact.source === "Contact") {
      updateContact(editContact.id, { name: data.name, email: data.email, title: data.title, company: data.company, phone: data.phone })
    }
    setEditContact(null)
  }

  function handleDeleteContact() {
    if (!deleteTarget) return
    deleteContact(deleteTarget.id)
    setDeleteTarget(null)
  }

  function handleSaveClientContact(contactName: string, contactTitle: string, contactEmail: string) {
    if (!editClient) return
    updateClient(editClient.id, { contactName, contactTitle, contactEmail })
    setEditClient(null)
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-5 flex-wrap">
        <input
          type="text"
          placeholder="Search by name, email, or company…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="bg-[#0D1520] border border-[rgba(200,169,106,0.14)] text-[#F5F1E8] placeholder:text-[#A8B0C0]/40 font-sans rounded-sm px-3.5 py-2 focus:outline-none focus:border-[#C8A96A]/35 transition-colors"
          style={{ fontSize: "13px", minWidth: "220px" }}
        />
        <button
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-1.5 rounded-sm px-3 py-1.5 font-sans font-medium transition-colors cursor-pointer shrink-0"
          style={{ fontSize: "13px", background: "rgba(200,169,106,0.12)", color: "#C8A96A", border: "1px solid rgba(200,169,106,0.3)" }}
        >
          <Plus size={13} strokeWidth={2} /> New Contact
        </button>
      </div>

      <div className="rounded-sm border border-[rgba(200,169,106,0.14)] overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-[1.6fr_1.8fr_1.4fr_1.4fr_100px_auto] bg-[#0D1520] border-b border-[rgba(200,169,106,0.10)]">
          {["Name", "Email", "Title", "Company / Org", "Type", ""].map((h, i) => (
            <div key={i} className="px-4 py-2.5 text-[10px] text-[#A8B0C0] tracking-widest uppercase font-medium">{h}</div>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="py-16 text-center font-sans text-[#A8B0C0]/30" style={{ fontSize: "13px" }}>
            {rows.length === 0 ? "No contacts yet." : "No results match your search."}
          </div>
        ) : (
          filtered.map(row => {
            const style = SOURCE_STYLE[row.source]
            return (
              <div
                key={`${row.source}-${row.id}`}
                className="grid grid-cols-[1.6fr_1.8fr_1.4fr_1.4fr_100px_auto] items-center border-b border-[rgba(200,169,106,0.06)] hover:bg-[#101827] transition-colors group"
              >
                {/* Name */}
                <div className="px-4 py-3.5 flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-sm bg-[#C8A96A]/08 border border-[#C8A96A]/15 flex items-center justify-center shrink-0">
                    {row.source === "Team"
                      ? <User size={11} strokeWidth={1.5} className="text-blue-400/70" />
                      : row.source === "Client"
                        ? <Building2 size={11} strokeWidth={1.5} className="text-amber-400/70" />
                        : <User size={11} strokeWidth={1.5} className="text-[#C8A96A]/60" />
                    }
                  </div>
                  <span className="font-sans font-medium text-[#F5F1E8] truncate" style={{ fontSize: "14px" }}>{row.name}</span>
                </div>

                {/* Email */}
                <div className="px-4 py-3.5 min-w-0 flex items-center gap-1">
                  {row.email ? (
                    <>
                      <a
                        href={`mailto:${row.email}`}
                        className="font-sans text-[#A8B0C0] hover:text-[#C8A96A] transition-colors truncate flex-1"
                        style={{ fontSize: "13px" }}
                      >
                        {row.email}
                      </a>
                      <CopyBtn value={row.email} />
                    </>
                  ) : (
                    <span className="text-[#A8B0C0]/25 font-sans" style={{ fontSize: "13px" }}>—</span>
                  )}
                </div>

                {/* Title */}
                <div className="px-4 py-3.5 min-w-0">
                  <span className="font-sans text-[#A8B0C0]/70 truncate" style={{ fontSize: "13px" }}>
                    {row.title || "—"}
                  </span>
                </div>

                {/* Company */}
                <div className="px-4 py-3.5 min-w-0">
                  <span className="font-sans text-[#A8B0C0]/70 truncate" style={{ fontSize: "13px" }}>
                    {row.company || "—"}
                  </span>
                </div>

                {/* Type badge */}
                <div className="px-4 py-3.5">
                  <span className={cn("rounded-sm px-1.5 py-0.5 text-[10px] font-medium tracking-wide uppercase", style.badge)}>
                    {style.label}
                  </span>
                </div>

                {/* Actions */}
                <div className="px-4 py-3.5 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {row.source !== "Team" && (
                    <button
                      onClick={() => {
                        if (row.source === "Client") {
                          const client = clients.find(c => c.id === row.id)
                          if (client) setEditClient({ id: client.id, contactName: client.contactName, contactTitle: client.contactTitle, contactEmail: client.contactEmail })
                        } else {
                          setEditContact(row)
                        }
                      }}
                      className="p-1.5 text-[#A8B0C0]/50 hover:text-[#C8A96A] transition-colors cursor-pointer"
                      title="Edit"
                    >
                      <Pencil size={13} strokeWidth={1.5} />
                    </button>
                  )}
                  {row.source === "Contact" && (
                    <button
                      onClick={() => setDeleteTarget(row)}
                      className="p-1.5 text-[#A8B0C0]/50 hover:text-red-400 transition-colors cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 size={13} strokeWidth={1.5} />
                    </button>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>

      <p className="text-[12px] text-[#A8B0C0]/30 mt-4">{filtered.length} contact{filtered.length !== 1 ? "s" : ""}</p>

      {/* Dialogs */}
      <ContactDialog
        key={addOpen ? "add-open" : "add-closed"}
        open={addOpen}
        onClose={() => setAddOpen(false)}
        initial={EMPTY_CONTACT}
        onSave={handleAddContact}
        title="New Contact"
      />

      {editContact && editContact.source === "Contact" && (
        <ContactDialog
          key={editContact.id}
          open={!!editContact}
          onClose={() => setEditContact(null)}
          initial={{ name: editContact.name, email: editContact.email, title: editContact.title, company: editContact.company, phone: editContact.phone }}
          onSave={handleEditContact}
          title="Edit Contact"
        />
      )}

      {editClient && (
        <ClientContactDialog
          key={editClient.id}
          open={!!editClient}
          onClose={() => setEditClient(null)}
          clientId={editClient.id}
          initial={{ contactName: editClient.contactName, contactTitle: editClient.contactTitle, contactEmail: editClient.contactEmail }}
          onSave={handleSaveClientContact}
        />
      )}

      {deleteTarget && (
        <Dialog open={!!deleteTarget} onOpenChange={v => { if (!v) setDeleteTarget(null) }}>
          <DialogContent className="max-w-sm">
            <DialogHeader><DialogTitle>Remove Contact</DialogTitle></DialogHeader>
            <p className="text-[14px] text-[#A8B0C0] mt-1">
              Remove <span className="text-[#F5F1E8] font-medium">{deleteTarget.name}</span> from your contacts?
            </p>
            <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-border">
              <Button variant="ghost" onClick={() => setDeleteTarget(null)}>Cancel</Button>
              <Button onClick={handleDeleteContact} className="bg-red-900/40 text-red-300 border border-red-700/30 hover:bg-red-900/60">Remove</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
//  CREDENTIALS TAB
// ═══════════════════════════════════════════════════════════

interface Credential { id: string; name: string; link: string; username: string; password: string }

const CRED_KEY = "cjpa_databank_v1"

function loadCredentials(): Credential[] {
  try { const raw = localStorage.getItem(CRED_KEY); if (raw) return JSON.parse(raw) as Credential[] } catch {}
  return []
}
function saveCredentials(data: Credential[]) { localStorage.setItem(CRED_KEY, JSON.stringify(data)) }

interface CredFormData { name: string; link: string; username: string; password: string }
const EMPTY_CRED: CredFormData = { name: "", link: "", username: "", password: "" }

function CopyButton({ value, label }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button onClick={() => { navigator.clipboard.writeText(value).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500) }) }}
      className="p-1 text-[#A8B0C0]/40 hover:text-[#C8A96A]/70 transition-colors cursor-pointer" title={label ? `Copy ${label}` : "Copy"}>
      {copied ? <Check size={13} strokeWidth={2} className="text-emerald-400" /> : <Copy size={13} strokeWidth={1.5} />}
    </button>
  )
}

function CredDialog({ open, onClose, initial, onSave, title }: {
  open: boolean; onClose: () => void; initial: CredFormData; onSave: (d: CredFormData) => void; title: string
}) {
  const [form, setForm] = useState<CredFormData>(initial)
  const [showPw, setShowPw] = useState(false)
  const [errors, setErrors] = useState<Partial<CredFormData>>({})
  function set<K extends keyof CredFormData>(k: K, v: string) { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: undefined })) }
  function handleSave() {
    const e: Partial<CredFormData> = {}
    if (!form.name.trim()) e.name = "Required"
    if (Object.keys(e).length) { setErrors(e); return }
    onSave({ name: form.name.trim(), link: form.link.trim(), username: form.username.trim(), password: form.password })
  }
  return (
    <Dialog open={open} onOpenChange={v => { if (!v) onClose() }}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>{title}</DialogTitle></DialogHeader>
        <div className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label>Name <span className="text-red-400">*</span></Label>
            <Input placeholder="e.g. Client Drive Portal" value={form.name} onChange={e => set("name", e.target.value)} />
            {errors.name && <p className="text-[12px] text-red-400">{errors.name}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>URL / Link</Label>
            <Input type="url" placeholder="https://..." value={form.link} onChange={e => set("link", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Username / Email</Label>
            <Input placeholder="username or email" value={form.username} onChange={e => set("username", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Password / Passcode</Label>
            <div className="relative">
              <Input type={showPw ? "text" : "password"} placeholder="••••••••" value={form.password} onChange={e => set("password", e.target.value)} className="pr-10" />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A8B0C0]/50 hover:text-[#A8B0C0] transition-colors cursor-pointer">
                {showPw ? <EyeOff size={15} strokeWidth={1.5} /> : <Eye size={15} strokeWidth={1.5} />}
              </button>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-border">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function CredRow({ cred, onEdit, onDelete }: { cred: Credential; onEdit: () => void; onDelete: () => void }) {
  const [showPw, setShowPw] = useState(false)
  return (
    <div className="grid grid-cols-[1.4fr_1.5fr_1.5fr_1.5fr_auto] items-center gap-0 border-b border-[rgba(200,169,106,0.06)] hover:bg-[#101827] transition-colors group">
      <div className="px-4 py-4 flex items-center gap-2 min-w-0">
        <div className="w-7 h-7 rounded-sm bg-[#C8A96A]/08 border border-[#C8A96A]/15 flex items-center justify-center shrink-0">
          <Lock size={11} strokeWidth={1.5} className="text-[#C8A96A]/60" />
        </div>
        <span className="font-sans font-medium text-[#F5F1E8] truncate" style={{ fontSize: "14px" }}>{cred.name}</span>
      </div>
      <div className="px-4 py-4 min-w-0">
        {cred.link ? (
          <a href={cred.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[#C8A96A]/70 hover:text-[#C8A96A] transition-colors font-sans truncate" style={{ fontSize: "13px" }}>
            <ExternalLink size={11} strokeWidth={1.5} className="shrink-0" />
            <span className="truncate">{cred.link.replace(/^https?:\/\//, "")}</span>
          </a>
        ) : <span className="text-[#A8B0C0]/25 font-sans" style={{ fontSize: "13px" }}>—</span>}
      </div>
      <div className="px-4 py-4 min-w-0 flex items-center gap-1.5">
        <span className="text-[#A8B0C0] font-sans truncate flex-1" style={{ fontSize: "13px" }}>{cred.username || "—"}</span>
        {cred.username && <CopyButton value={cred.username} label="username" />}
      </div>
      <div className="px-4 py-4 min-w-0 flex items-center gap-1.5">
        <span className={cn("font-sans flex-1 truncate", showPw ? "text-[#A8B0C0]" : "text-[#A8B0C0]/60 tracking-[0.2em]")} style={{ fontSize: showPw ? "13px" : "11px" }}>
          {cred.password ? (showPw ? cred.password : "••••••••") : "—"}
        </span>
        {cred.password && (
          <>
            <button onClick={() => setShowPw(!showPw)} className="p-1 text-[#A8B0C0]/40 hover:text-[#A8B0C0] transition-colors cursor-pointer shrink-0">
              {showPw ? <EyeOff size={13} strokeWidth={1.5} /> : <Eye size={13} strokeWidth={1.5} />}
            </button>
            <CopyButton value={cred.password} label="password" />
          </>
        )}
      </div>
      <div className="px-4 py-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={onEdit} className="p-1.5 text-[#A8B0C0]/50 hover:text-[#C8A96A] transition-colors cursor-pointer"><Pencil size={13} strokeWidth={1.5} /></button>
        <button onClick={onDelete} className="p-1.5 text-[#A8B0C0]/50 hover:text-red-400 transition-colors cursor-pointer"><Trash2 size={13} strokeWidth={1.5} /></button>
      </div>
    </div>
  )
}

function CredentialsTab() {
  const [credentials, setCredentials] = useState<Credential[]>(() => typeof window === "undefined" ? [] : loadCredentials())
  const [addOpen, setAddOpen]         = useState(false)
  const [editTarget, setEditTarget]   = useState<Credential | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Credential | null>(null)
  const [search, setSearch]           = useState("")

  const filtered = credentials.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.username.toLowerCase().includes(search.toLowerCase())
  )

  const persist = useCallback((updated: Credential[]) => { setCredentials(updated); saveCredentials(updated) }, [])

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-5 flex-wrap">
        <input
          type="text"
          placeholder="Search by name or username…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="bg-[#0D1520] border border-[rgba(200,169,106,0.14)] text-[#F5F1E8] placeholder:text-[#A8B0C0]/40 font-sans rounded-sm px-3.5 py-2 focus:outline-none focus:border-[#C8A96A]/35 transition-colors"
          style={{ fontSize: "13px", minWidth: "220px" }}
        />
        <button
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-1.5 rounded-sm px-3 py-1.5 font-sans font-medium transition-colors cursor-pointer shrink-0"
          style={{ fontSize: "13px", background: "rgba(200,169,106,0.12)", color: "#C8A96A", border: "1px solid rgba(200,169,106,0.3)" }}
        >
          <Plus size={13} strokeWidth={2} /> New Credential
        </button>
      </div>

      <div className="rounded-sm border border-[rgba(200,169,106,0.14)] overflow-hidden">
        <div className="grid grid-cols-[1.4fr_1.5fr_1.5fr_1.5fr_auto] bg-[#0D1520] border-b border-[rgba(200,169,106,0.10)]">
          {["Name", "URL", "Username", "Password", ""].map((h, i) => (
            <div key={i} className="px-4 py-2.5 text-[10px] text-[#A8B0C0] tracking-widest uppercase font-medium">{h}</div>
          ))}
        </div>
        {filtered.length === 0 ? (
          <div className="py-16 text-center font-sans text-[#A8B0C0]/30" style={{ fontSize: "13px" }}>
            {credentials.length === 0 ? "No credentials stored. Add your first entry above." : "No results match your search."}
          </div>
        ) : (
          filtered.map(cred => (
            <CredRow key={cred.id} cred={cred}
              onEdit={() => setEditTarget(cred)}
              onDelete={() => setDeleteTarget(cred)}
            />
          ))
        )}
      </div>

      <p className="text-[12px] text-[#A8B0C0]/30 mt-4">{filtered.length} entr{filtered.length !== 1 ? "ies" : "y"}</p>

      <CredDialog key={addOpen ? "c-open" : "c-closed"} open={addOpen} onClose={() => setAddOpen(false)} initial={EMPTY_CRED} onSave={data => { persist([...credentials, { id: `cred-${Date.now()}`, ...data }]); setAddOpen(false) }} title="New Credential" />
      {editTarget && (
        <CredDialog key={editTarget.id} open={!!editTarget} onClose={() => setEditTarget(null)} initial={{ name: editTarget.name, link: editTarget.link, username: editTarget.username, password: editTarget.password }}
          onSave={data => { persist(credentials.map(c => c.id === editTarget.id ? { ...c, ...data } : c)); setEditTarget(null) }} title="Edit Credential" />
      )}
      {deleteTarget && (
        <Dialog open={!!deleteTarget} onOpenChange={v => { if (!v) setDeleteTarget(null) }}>
          <DialogContent className="max-w-sm">
            <DialogHeader><DialogTitle>Delete Credential</DialogTitle></DialogHeader>
            <p className="text-[14px] text-[#A8B0C0] mt-1">Remove <span className="text-[#F5F1E8] font-medium">{deleteTarget.name}</span>? This cannot be undone.</p>
            <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-border">
              <Button variant="ghost" onClick={() => setDeleteTarget(null)}>Cancel</Button>
              <Button onClick={() => { persist(credentials.filter(c => c.id !== deleteTarget.id)); setDeleteTarget(null) }} className="bg-red-900/40 text-red-300 border border-red-700/30 hover:bg-red-900/60">Delete</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
//  MAIN PAGE
// ═══════════════════════════════════════════════════════════

type Tab = "contacts" | "credentials"

export default function DatabankPage() {
  const [tab, setTab] = useState<Tab>("contacts")

  return (
    <>
      <Topbar title="Databank" subtitle="Contacts directory and internal access credentials" />

      <div className="flex-1 overflow-y-auto p-7">
        <div className="max-w-5xl">

          {/* Tab switcher */}
          <div className="flex gap-1 mb-7 border-b border-[rgba(200,169,106,0.10)]">
            {([
              { id: "contacts",    label: "Contacts"    },
              { id: "credentials", label: "Credentials" },
            ] as const).map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  "px-5 py-3 font-sans font-medium transition-colors cursor-pointer border-b-2 -mb-px",
                  tab === t.id
                    ? "text-[#C8A96A] border-[#C8A96A]"
                    : "text-[#A8B0C0] border-transparent hover:text-[#F5F1E8]"
                )}
                style={{ fontSize: "13px" }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === "contacts"    && <ContactsTab />}
          {tab === "credentials" && <CredentialsTab />}
        </div>
      </div>
    </>
  )
}
