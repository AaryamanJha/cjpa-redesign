"use client"

import { useState, useCallback } from "react"
import { Plus, Eye, EyeOff, Pencil, Trash2, Copy, Check, ExternalLink, Lock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Topbar } from "@/components/portal/Topbar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

// ─── types ────────────────────────────────────────────────────────────────────

interface Credential {
  id: string
  name: string
  link: string
  username: string
  password: string
}

const STORAGE_KEY = "cjpa_databank_v1"

function loadCredentials(): Credential[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as Credential[]
  } catch {}
  return []
}

function saveCredentials(data: Credential[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

// ─── copy button ──────────────────────────────────────────────────────────────

function CopyButton({ value, label }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false)
  function handleCopy() {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }
  return (
    <button
      onClick={handleCopy}
      className="p-1 text-[#A8B0C0]/40 hover:text-[#C8A96A]/70 transition-colors cursor-pointer"
      title={label ? `Copy ${label}` : "Copy"}
    >
      {copied ? <Check size={13} strokeWidth={2} className="text-emerald-400" /> : <Copy size={13} strokeWidth={1.5} />}
    </button>
  )
}

// ─── credential form ──────────────────────────────────────────────────────────

interface CredentialFormData {
  name: string; link: string; username: string; password: string
}

const EMPTY: CredentialFormData = { name: "", link: "", username: "", password: "" }

function credToForm(c: Credential): CredentialFormData {
  return { name: c.name, link: c.link, username: c.username, password: c.password }
}

function CredentialDialog({ open, onClose, initial, onSave, title }: {
  open: boolean
  onClose: () => void
  initial: CredentialFormData
  onSave: (data: CredentialFormData) => void
  title: string
}) {
  const [form, setForm] = useState<CredentialFormData>(initial)
  const [showPw, setShowPw] = useState(false)
  const [errors, setErrors] = useState<Partial<CredentialFormData>>({})

  function set<K extends keyof CredentialFormData>(k: K, v: string) {
    setForm(f => ({ ...f, [k]: v }))
    setErrors(e => ({ ...e, [k]: undefined }))
  }

  function handleSave() {
    const e: Partial<CredentialFormData> = {}
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
              <Input
                type={showPw ? "text" : "password"}
                placeholder="••••••••"
                value={form.password}
                onChange={e => set("password", e.target.value)}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A8B0C0]/50 hover:text-[#A8B0C0] transition-colors cursor-pointer"
              >
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

// ─── delete confirm dialog ────────────────────────────────────────────────────

function DeleteDialog({ open, name, onClose, onConfirm }: {
  open: boolean; name: string; onClose: () => void; onConfirm: () => void
}) {
  return (
    <Dialog open={open} onOpenChange={v => { if (!v) onClose() }}>
      <DialogContent className="max-w-sm">
        <DialogHeader><DialogTitle>Delete Credential</DialogTitle></DialogHeader>
        <p className="text-[14px] text-[#A8B0C0] mt-1">
          Remove <span className="text-[#F5F1E8] font-medium">{name}</span> from the databank? This cannot be undone.
        </p>
        <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-border">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button
            onClick={onConfirm}
            className="bg-red-900/40 text-red-300 border border-red-700/30 hover:bg-red-900/60"
          >
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ─── row ──────────────────────────────────────────────────────────────────────

function CredentialRow({ cred, onEdit, onDelete }: {
  cred: Credential
  onEdit: () => void
  onDelete: () => void
}) {
  const [showPw, setShowPw] = useState(false)

  return (
    <div className="grid grid-cols-[1.4fr_1.5fr_1.5fr_1.5fr_auto] items-center gap-0 border-b border-[rgba(200,169,106,0.06)] hover:bg-[#101827] transition-colors group">
      {/* Name */}
      <div className="px-4 py-4 flex items-center gap-2 min-w-0">
        <div className="w-7 h-7 rounded-sm bg-[#C8A96A]/08 border border-[#C8A96A]/15 flex items-center justify-center shrink-0">
          <Lock size={11} strokeWidth={1.5} className="text-[#C8A96A]/60" />
        </div>
        <span className="font-sans font-medium text-[#F5F1E8] truncate" style={{ fontSize: "14px" }}>
          {cred.name}
        </span>
      </div>

      {/* URL */}
      <div className="px-4 py-4 min-w-0">
        {cred.link ? (
          <a
            href={cred.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[#C8A96A]/70 hover:text-[#C8A96A] transition-colors font-sans truncate"
            style={{ fontSize: "13px" }}
          >
            <ExternalLink size={11} strokeWidth={1.5} className="shrink-0" />
            <span className="truncate">{cred.link.replace(/^https?:\/\//, "")}</span>
          </a>
        ) : (
          <span className="text-[#A8B0C0]/25 font-sans" style={{ fontSize: "13px" }}>—</span>
        )}
      </div>

      {/* Username */}
      <div className="px-4 py-4 min-w-0 flex items-center gap-1.5">
        <span className="text-[#A8B0C0] font-sans truncate flex-1" style={{ fontSize: "13px" }}>
          {cred.username || "—"}
        </span>
        {cred.username && <CopyButton value={cred.username} label="username" />}
      </div>

      {/* Password */}
      <div className="px-4 py-4 min-w-0 flex items-center gap-1.5">
        <span
          className={cn("font-sans flex-1 truncate", showPw ? "text-[#A8B0C0]" : "text-[#A8B0C0]/60 tracking-[0.2em]")}
          style={{ fontSize: showPw ? "13px" : "11px" }}
        >
          {cred.password ? (showPw ? cred.password : "••••••••") : "—"}
        </span>
        {cred.password && (
          <>
            <button
              onClick={() => setShowPw(!showPw)}
              className="p-1 text-[#A8B0C0]/40 hover:text-[#A8B0C0] transition-colors cursor-pointer shrink-0"
              title={showPw ? "Hide" : "Reveal"}
            >
              {showPw ? <EyeOff size={13} strokeWidth={1.5} /> : <Eye size={13} strokeWidth={1.5} />}
            </button>
            <CopyButton value={cred.password} label="password" />
          </>
        )}
      </div>

      {/* Actions */}
      <div className="px-4 py-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={onEdit}
          className="p-1.5 text-[#A8B0C0]/50 hover:text-[#C8A96A] transition-colors cursor-pointer"
          title="Edit"
        >
          <Pencil size={13} strokeWidth={1.5} />
        </button>
        <button
          onClick={onDelete}
          className="p-1.5 text-[#A8B0C0]/50 hover:text-red-400 transition-colors cursor-pointer"
          title="Delete"
        >
          <Trash2 size={13} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  )
}

// ─── main page ────────────────────────────────────────────────────────────────

export default function DatabankPage() {
  const [credentials, setCredentials] = useState<Credential[]>(() =>
    typeof window === "undefined" ? [] : loadCredentials()
  )
  const [addOpen, setAddOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Credential | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Credential | null>(null)
  const [search, setSearch] = useState("")

  const filtered = credentials.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.username.toLowerCase().includes(search.toLowerCase())
  )

  const persist = useCallback((updated: Credential[]) => {
    setCredentials(updated)
    saveCredentials(updated)
  }, [])

  function handleAdd(data: CredentialFormData) {
    persist([...credentials, { id: `cred-${Date.now()}`, ...data }])
    setAddOpen(false)
  }

  function handleEdit(data: CredentialFormData) {
    if (!editTarget) return
    persist(credentials.map(c => c.id === editTarget.id ? { ...c, ...data } : c))
    setEditTarget(null)
  }

  function handleDelete() {
    if (!deleteTarget) return
    persist(credentials.filter(c => c.id !== deleteTarget.id))
    setDeleteTarget(null)
  }

  return (
    <>
      <Topbar
        title="Databank"
        subtitle="Internal access credentials and reference links"
      />

      <div className="flex-1 overflow-y-auto p-7">
        <div className="max-w-5xl">

          {/* Warning banner */}
          <div className="flex items-start gap-3 border border-amber-700/25 bg-amber-900/10 rounded-sm px-4 py-3 mb-6">
            <Lock size={13} strokeWidth={1.5} className="text-amber-400/70 mt-0.5 shrink-0" />
            <p className="text-[#A8B0C0]/70 font-sans" style={{ fontSize: "12px" }}>
              <span className="text-amber-400/80 font-medium">Prototype only.</span>{" "}
              Credentials are stored in browser localStorage. Do not store production secrets or sensitive passwords here.
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between gap-4 mb-5 flex-wrap">
            <input
              type="text"
              placeholder="Search by name or username..."
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

          {/* Table */}
          <div className="rounded-sm border border-[rgba(200,169,106,0.14)] overflow-hidden">
            {/* Header */}
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
                <CredentialRow
                  key={cred.id}
                  cred={cred}
                  onEdit={() => setEditTarget(cred)}
                  onDelete={() => setDeleteTarget(cred)}
                />
              ))
            )}
          </div>

          <p className="text-[12px] text-[#A8B0C0]/30 mt-4">{filtered.length} entr{filtered.length !== 1 ? "ies" : "y"}</p>
        </div>
      </div>

      <CredentialDialog
        key={addOpen ? "add-open" : "add-closed"}
        open={addOpen}
        onClose={() => setAddOpen(false)}
        initial={EMPTY}
        onSave={handleAdd}
        title="New Credential"
      />

      {editTarget && (
        <CredentialDialog
          key={editTarget.id}
          open={!!editTarget}
          onClose={() => setEditTarget(null)}
          initial={credToForm(editTarget)}
          onSave={handleEdit}
          title="Edit Credential"
        />
      )}

      {deleteTarget && (
        <DeleteDialog
          open={!!deleteTarget}
          name={deleteTarget.name}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}
    </>
  )
}
