"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Plus, Pencil, Trash2, Search } from "lucide-react"
import { Topbar } from "@/components/portal/Topbar"
import { usePortal } from "@/contexts/PortalContext"
import { Client, ClientStatus } from "@/types/portal"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

// ─── config ──────────────────────────────────────────────────────────────────

const STATUS_STYLE: Record<string, string> = {
  Active:           "bg-emerald-900/30 text-emerald-300 border border-emerald-700/25",
  Retainer:         "bg-sky-900/30     text-sky-300     border border-sky-700/25",
  Proposal:         "bg-amber-900/30   text-amber-300   border border-amber-700/25",
  "Raising Capital":"bg-violet-900/30  text-violet-300  border border-violet-700/25",
  Past:             "bg-zinc-800/40    text-zinc-400    border border-zinc-700/25",
}

const REGION_DOT: Record<string, string> = {
  "East Africa":              "#C8A96A",
  "Gulf Cooperation Council": "#63B3ED",
  "European Union":           "#9A89FF",
  "Southeast Asia":           "#68D391",
  "North America":            "#F6AD55",
}

const REGIONS = [
  "New York, Global",
  "United States",
  "Global Emerging Markets",
  "Belize, Caribbean",
  "Taiwan",
  "Taiwan and United States",
  "Latin America",
  "Germany",
  "Africa",
  "East Africa",
  "Gulf Cooperation Council",
  "European Union",
  "Southeast Asia",
  "North America",
  "Middle East & North Africa",
  "Sub-Saharan Africa",
  "South Asia",
  "Latin America",
  "Other",
]

// ─── shared field component ───────────────────────────────────────────────────

function Field({ label, children, error, required }: {
  label: string; children: React.ReactNode; error?: string; required?: boolean
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}{required && <span className="text-red-400 ml-0.5">*</span>}</Label>
      {children}
      {error && <p className="text-[12px] text-red-400">{error}</p>}
    </div>
  )
}

// ─── client form (shared between create + edit) ───────────────────────────────

interface ClientFormData {
  name: string; shortName: string; industry: string; region: string
  status: "Active" | "Proposal" | "Raising Capital" | "Retainer" | "Past"
  contactName: string; contactTitle: string; contactEmail: string
  since: string; notes: string; driveLink: string
}

const EMPTY_FORM: ClientFormData = {
  name: "", shortName: "", industry: "", region: "",
  status: "Proposal",
  contactName: "", contactTitle: "", contactEmail: "",
  since: "", notes: "", driveLink: "",
}

function clientToForm(c: Client): ClientFormData {
  return {
    name: c.name, shortName: c.shortName, industry: c.industry, region: c.region,
    status: c.status as ClientFormData["status"],
    contactName: c.contactName, contactTitle: c.contactTitle,
    contactEmail: c.contactEmail, since: c.since, notes: c.notes,
    driveLink: c.driveLink ?? "",
  }
}

function ClientFormFields({ form, setField, errors, today }: {
  form: ClientFormData
  setField: <K extends keyof ClientFormData>(k: K, v: ClientFormData[K]) => void
  errors: Partial<ClientFormData>
  today: string
}) {
  return (
    <div className="space-y-4">
      <Field label="Organization Name" error={errors.name} required>
        <Input placeholder="Full organization name" value={form.name} onChange={(e) => setField("name", e.target.value)} />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Short Name / Acronym">
          <Input placeholder="e.g. NIP, GCSF" value={form.shortName} onChange={(e) => setField("shortName", e.target.value)} />
        </Field>
        <Field label="Status">
          <Select value={form.status} onValueChange={(v) => setField("status", v as ClientFormData["status"])}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Proposal">Proposal</SelectItem>
              <SelectItem value="Raising Capital">Raising Capital</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Retainer">Retainer</SelectItem>
              <SelectItem value="Past">Past</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Industry / Sector" error={errors.industry} required>
          <Input placeholder="e.g. Sovereign Wealth & Capital Markets" value={form.industry} onChange={(e) => setField("industry", e.target.value)} />
        </Field>
        <Field label="Region" error={errors.region} required>
          <Select value={form.region} onValueChange={(v) => setField("region", v)}>
            <SelectTrigger><SelectValue placeholder="Select region" /></SelectTrigger>
            <SelectContent>
              {REGIONS.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
            </SelectContent>
          </Select>
        </Field>
      </div>

      <div className="h-px bg-border" />

      <Field label="Primary Contact" error={errors.contactName} required>
        <Input placeholder="Contact full name" value={form.contactName} onChange={(e) => setField("contactName", e.target.value)} />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Title / Role">
          <Input placeholder="e.g. Managing Partner" value={form.contactTitle} onChange={(e) => setField("contactTitle", e.target.value)} />
        </Field>
        <Field label="Email">
          <Input type="email" placeholder="contact@org.com" value={form.contactEmail} onChange={(e) => setField("contactEmail", e.target.value)} />
        </Field>
      </div>

      <Field label="Relationship Since">
        <Input type="date" max={today} value={form.since} onChange={(e) => setField("since", e.target.value)} className="cursor-pointer" />
      </Field>

      <Field label="Internal Notes">
        <Textarea placeholder="Background, sensitivities, context..." value={form.notes} onChange={(e) => setField("notes", e.target.value)} rows={3} />
      </Field>

      <Field label="Source or Folder Link">
        <Input placeholder="/portal/cjpa-projects-may-2026.pdf or https://drive.google.com/..." value={form.driveLink} onChange={(e) => setField("driveLink", e.target.value)} />
      </Field>
    </div>
  )
}

// ─── create client dialog ─────────────────────────────────────────────────────

function CreateClientDialog({ open, onClose, onSave }: {
  open: boolean; onClose: () => void; onSave: (client: Client) => void
}) {
  const [form, setForm] = useState<ClientFormData>(EMPTY_FORM)
  const [errors, setErrors] = useState<Partial<ClientFormData>>({})
  const today = new Date().toISOString().split("T")[0]

  function setField<K extends keyof ClientFormData>(k: K, v: ClientFormData[K]) {
    setForm((f) => ({ ...f, [k]: v })); setErrors((e) => ({ ...e, [k]: undefined }))
  }

  function validate() {
    const e: Partial<ClientFormData> = {}
    if (!form.name.trim()) e.name = "Required"
    if (!form.industry.trim()) e.industry = "Required"
    if (!form.region) e.region = "Required"
    if (!form.contactName.trim()) e.contactName = "Required"
    return e
  }

  function handleSubmit() {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    const initials = form.shortName.trim() || form.name.trim().split(/\s+/).map((w) => w[0]).join("").toUpperCase().slice(0, 5)
    onSave({
      id: `client-${Date.now()}`,
      name: form.name.trim(), shortName: initials,
      industry: form.industry.trim(), region: form.region, status: form.status as ClientStatus,
      contactName: form.contactName.trim(), contactTitle: form.contactTitle.trim() || "—",
      contactEmail: form.contactEmail.trim(), linkedProjects: [],
      since: form.since || today, notes: form.notes.trim(),
      driveLink: form.driveLink.trim() || undefined,
    })
    setForm(EMPTY_FORM); setErrors({}); onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { setForm(EMPTY_FORM); setErrors({}); onClose() } }}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>New Client</DialogTitle></DialogHeader>
        <div className="mt-2">
          <ClientFormFields form={form} setField={setField} errors={errors} today={today} />
        </div>
        <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-border">
          <Button variant="ghost" onClick={() => { setForm(EMPTY_FORM); setErrors({}); onClose() }}>Cancel</Button>
          <Button onClick={handleSubmit}>Add Client</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ─── edit client dialog ───────────────────────────────────────────────────────

function EditClientDialog({ open, onClose, client, onSave }: {
  open: boolean; onClose: () => void; client: Client; onSave: (id: string, updates: Partial<Client>) => void
}) {
  const [form, setFormState] = useState<ClientFormData>(() => clientToForm(client))
  const [errors, setErrors] = useState<Partial<ClientFormData>>({})
  const today = new Date().toISOString().split("T")[0]

  // Sync form when client changes
  useState(() => { setFormState(clientToForm(client)) })

  function setField<K extends keyof ClientFormData>(k: K, v: ClientFormData[K]) {
    setFormState((f) => ({ ...f, [k]: v })); setErrors((e) => ({ ...e, [k]: undefined }))
  }

  function validate() {
    const e: Partial<ClientFormData> = {}
    if (!form.name.trim()) e.name = "Required"
    if (!form.industry.trim()) e.industry = "Required"
    if (!form.region) e.region = "Required"
    if (!form.contactName.trim()) e.contactName = "Required"
    return e
  }

  function handleSave() {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    onSave(client.id, {
      name: form.name.trim(),
      shortName: form.shortName.trim() || form.name.trim().split(/\s+/).map((w) => w[0]).join("").toUpperCase().slice(0, 5),
      industry: form.industry.trim(),
      region: form.region,
      status: form.status as ClientStatus,
      contactName: form.contactName.trim(),
      contactTitle: form.contactTitle.trim() || "—",
      contactEmail: form.contactEmail.trim(),
      since: form.since || today,
      notes: form.notes.trim(),
      driveLink: form.driveLink.trim() || undefined,
    })
    setErrors({}); onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { setErrors({}); onClose() } }}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Edit Client</DialogTitle></DialogHeader>
        <div className="mt-2">
          <ClientFormFields form={form} setField={setField} errors={errors} today={today} />
        </div>
        <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-border">
          <Button variant="ghost" onClick={() => { setErrors({}); onClose() }}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ─── client detail panel ─────────────────────────────────────────────────────

function ClientPanel({ client, onClose, onEdit, onDelete, linkedProjects }: {
  client: Client
  onClose: () => void
  onEdit: () => void
  onDelete: () => void
  linkedProjects: { id: string; projectName: string; projectType: string; lead: string; targetDeadline: string }[]
}) {
  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-sm bg-[#0D1520] border-l border-[rgba(200,169,106,0.14)] flex flex-col shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-[rgba(200,169,106,0.10)]">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: REGION_DOT[client.region] ?? "#C8A96A" }} />
                <span className="text-[10px] text-[#A8B0C0] tracking-widest uppercase">{client.region}</span>
              </div>
              <h3 className="text-lg font-serif font-light text-[#F5F1E8] leading-snug">{client.name}</h3>
              <p className="text-sm text-[#A8B0C0] mt-0.5">{client.shortName} · {client.industry}</p>
            </div>
            <div className="flex items-center gap-2 ml-4 shrink-0">
              <button
                onClick={onEdit}
                className="flex items-center gap-1.5 rounded-sm px-2.5 py-1.5 font-sans transition-colors cursor-pointer hover:opacity-80"
                style={{ fontSize: "12px", background: "rgba(200,169,106,0.10)", color: "#C8A96A", border: "1px solid rgba(200,169,106,0.25)" }}
              >
                <Pencil size={11} strokeWidth={1.5} /> Edit
              </button>
              <button
                onClick={onDelete}
                className="flex items-center gap-1 rounded-sm px-2.5 py-1.5 font-sans transition-colors cursor-pointer hover:opacity-80"
                style={{ fontSize: "12px", background: "rgba(252,129,129,0.08)", color: "#FC8181", border: "1px solid rgba(252,129,129,0.20)" }}
              >
                <Trash2 size={11} strokeWidth={1.5} />
              </button>
              <button onClick={onClose} className="text-[#A8B0C0] hover:text-[#F5F1E8] transition-colors cursor-pointer">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          <span className={cn("inline-block mt-3 rounded-sm px-2 py-0.5 text-[10px] font-medium tracking-wide uppercase", STATUS_STYLE[client.status])}>
            {client.status}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <PanelSection label="Primary Contact">
            <p className="text-[14px] text-[#F5F1E8]">{client.contactName}</p>
            <p className="text-[13px] text-[#A8B0C0]">{client.contactTitle}</p>
            {client.contactEmail && (
              <a href={`mailto:${client.contactEmail}`} className="text-[13px] text-[#C8A96A] hover:underline mt-0.5 block">
                {client.contactEmail}
              </a>
            )}
          </PanelSection>

          <div className="h-px bg-[rgba(200,169,106,0.10)]" />

          <PanelSection label="Client Since">
            <p className="text-[14px] text-[#F5F1E8]">{client.since}</p>
          </PanelSection>

          {client.driveLink && (
            <>
              <div className="h-px bg-[rgba(200,169,106,0.10)]" />
              <PanelSection label="Source / Folder">
                <a
                  href={client.driveLink}
                  target={client.driveLink.startsWith("/") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  className="text-[13px] text-[#C8A96A] hover:underline break-all"
                >
                  Open source document
                </a>
              </PanelSection>
            </>
          )}

          {linkedProjects.length > 0 && (
            <>
              <div className="h-px bg-[rgba(200,169,106,0.10)]" />
              <PanelSection label={`Projects (${linkedProjects.length})`}>
                <div className="space-y-2">
                  {linkedProjects.map((p) => (
                    <div key={p.id} className="rounded-sm border border-[rgba(200,169,106,0.10)] bg-[#101827] px-3 py-2.5">
                      <p className="text-[12px] text-[#C8A96A] tracking-wide uppercase mb-0.5">{p.projectType}</p>
                      <p className="text-[14px] text-[#F5F1E8] font-medium leading-snug">{p.projectName}</p>
                      <p className="text-[13px] text-[#A8B0C0] mt-1">Lead: {p.lead}</p>
                      <p className="text-[13px] text-[#A8B0C0]">Deadline: {p.targetDeadline}</p>
                    </div>
                  ))}
                </div>
              </PanelSection>
            </>
          )}

          {client.notes && (
            <>
              <div className="h-px bg-[rgba(200,169,106,0.10)]" />
              <PanelSection label="Internal Notes">
                <p className="text-[14px] text-[#F5F1E8]/70 leading-relaxed italic">{client.notes}</p>
              </PanelSection>
            </>
          )}
        </div>
      </div>
    </>
  )
}

function PanelSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[11px] text-[#A8B0C0] tracking-widest uppercase mb-2">{label}</p>
      {children}
    </div>
  )
}

// ─── main page ────────────────────────────────────────────────────────────────

export default function ClientsPage() {
  const { clients, projects, addClient, updateClient, deleteClient } = usePortal()
  const [selected, setSelected] = useState<Client | null>(null)
  const [editing, setEditing] = useState<Client | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Client | null>(null)
  const [filter, setFilter] = useState<"All" | ClientStatus>("All")
  const [search, setSearch] = useState("")
  const [createOpen, setCreateOpen] = useState(false)

  const filtered = clients.filter((c) => {
    if (filter !== "All" && c.status !== filter) return false
    if (search.trim()) {
      const q = search.toLowerCase()
      return (
        c.name.toLowerCase().includes(q) ||
        c.industry?.toLowerCase().includes(q) ||
        c.contactName?.toLowerCase().includes(q) ||
        c.region?.toLowerCase().includes(q) ||
        c.shortName?.toLowerCase().includes(q)
      )
    }
    return true
  })

  function handleCreate(client: Client) {
    addClient(client)
  }

  function handleEdit(id: string, updates: Partial<Client>) {
    updateClient(id, updates)
    // Refresh selected/editing state with updated data
    setSelected((prev) => prev?.id === id ? { ...prev, ...updates } : prev)
    setEditing(null)
  }

  // Derive linked projects from project clientId
  function getLinkedProjects(clientId: string) {
    return projects.filter((p) => p.clientId === clientId)
  }

  return (
    <>
      <Topbar title="Clients" subtitle="Active mandates, prospective engagements, and relationship intelligence" />
      <div className="flex-1 overflow-y-auto p-7">
        <div className="max-w-5xl">

          {/* Controls row */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3">
              <div className="relative flex-1 max-w-xs">
                <Search size={13} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A8B0C0]/40 pointer-events-none" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search name, industry, contact, region…"
                  className="w-full bg-[#0D1520] border border-[rgba(200,169,106,0.15)] rounded-sm pl-8 pr-3 py-2 font-sans text-[#F5F1E8] placeholder:text-[#A8B0C0]/35 outline-none focus:border-[#C8A96A]/40 transition-colors"
                  style={{ fontSize: "13px" }}
                />
              </div>
              <button
                onClick={() => setCreateOpen(true)}
                className="ml-auto flex items-center gap-1.5 rounded-sm px-3 py-1.5 font-sans font-medium transition-colors cursor-pointer shrink-0"
                style={{ fontSize: "13px", background: "rgba(200,169,106,0.12)", color: "#C8A96A", border: "1px solid rgba(200,169,106,0.3)" }}
              >
                <Plus size={13} strokeWidth={2} /> New Client
              </button>
            </div>
            <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex gap-2">
              {(["All", "Active", "Retainer", "Proposal", "Raising Capital", "Past"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className={cn(
                    "rounded-sm px-3.5 py-2 text-[13px] font-medium tracking-wide transition-colors cursor-pointer",
                    filter === s
                      ? "bg-[#C8A96A] text-[#070B14]"
                      : "bg-[#101827] text-[#A8B0C0] hover:text-[#F5F1E8] border border-[rgba(200,169,106,0.12)] hover:border-[rgba(200,169,106,0.25)]"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
            </div>
          </div>

          {/* Client table */}
          <div className="rounded-sm border border-[rgba(200,169,106,0.14)] overflow-hidden">
            <div className="grid grid-cols-[auto_1fr_1fr_auto_auto] gap-0">
              {/* Header */}
              <div className="contents">
                {["Rank", "Client", "Industry", "Region", "Status"].map((h, i) => (
                  <div key={i} className="px-4 py-2.5 bg-[#0D1520] text-[10px] text-[#A8B0C0] tracking-widest uppercase font-medium border-b border-[rgba(200,169,106,0.10)]">
                    {h}
                  </div>
                ))}
              </div>

              {/* Rows */}
              {filtered.length === 0 ? (
                <div className="col-span-5 py-12 text-center font-sans text-[#A8B0C0]/50" style={{ fontSize: "13px" }}>
                  No clients match the current filter.
                </div>
              ) : (
                filtered.map((client, index) => (
                  <button key={client.id} onClick={() => setSelected(client)} className="contents group cursor-pointer">
                    <div className="flex items-center justify-center gap-2 px-4 py-4 border-b border-[rgba(200,169,106,0.06)] bg-[#070B14] group-hover:bg-[#101827] transition-colors">
                      <span className="min-w-6 text-right text-[12px] font-medium tabular-nums text-[#C8A96A]">#{index + 1}</span>
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: REGION_DOT[client.region] ?? "#A8B0C0" }} />
                    </div>
                    <div className="flex flex-col justify-center px-4 py-4 border-b border-[rgba(200,169,106,0.06)] bg-[#070B14] group-hover:bg-[#101827] transition-colors">
                      <span className="text-[15px] font-medium text-[#F5F1E8] group-hover:text-white transition-colors text-left">{client.name}</span>
                      <span className="text-[13px] text-[#A8B0C0]/70 mt-0.5 text-left">{client.contactName}</span>
                    </div>
                    <div className="flex items-center px-4 py-4 border-b border-[rgba(200,169,106,0.06)] bg-[#070B14] group-hover:bg-[#101827] transition-colors">
                      <span className="text-[13px] text-[#A8B0C0] text-left">{client.industry}</span>
                    </div>
                    <div className="flex items-center px-4 py-4 border-b border-[rgba(200,169,106,0.06)] bg-[#070B14] group-hover:bg-[#101827] transition-colors">
                      <span className="text-[13px] text-[#A8B0C0]">{client.region}</span>
                    </div>
                    <div className="flex items-center px-4 py-4 border-b border-[rgba(200,169,106,0.06)] bg-[#070B14] group-hover:bg-[#101827] transition-colors">
                      <span className={cn("rounded-sm px-2 py-0.5 text-[10px] font-medium tracking-wide uppercase", STATUS_STYLE[client.status])}>
                        {client.status}
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          <p className="text-[12px] text-[#A8B0C0]/40 mt-4">{filtered.length} client{filtered.length !== 1 ? "s" : ""}</p>
        </div>
      </div>

      {selected && (
        <ClientPanel
          client={selected}
          onClose={() => setSelected(null)}
          onEdit={() => setEditing(selected)}
          onDelete={() => setDeleteTarget(selected)}
          linkedProjects={getLinkedProjects(selected.id)}
        />
      )}

      <CreateClientDialog open={createOpen} onClose={() => setCreateOpen(false)} onSave={handleCreate} />

      {editing && (
        <EditClientDialog
          open={!!editing}
          onClose={() => setEditing(null)}
          client={editing}
          onSave={handleEdit}
        />
      )}

      <Dialog open={!!deleteTarget} onOpenChange={(v) => { if (!v) setDeleteTarget(null) }}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Delete Client?</DialogTitle></DialogHeader>
          <p className="font-sans text-[#A8B0C0] mt-1" style={{ fontSize: "14px" }}>
            <strong className="text-[#F5F1E8]">{deleteTarget?.name}</strong> will be permanently removed. This cannot be undone.
          </p>
          <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-border">
            <Button variant="ghost" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button
              onClick={() => { if (deleteTarget) { deleteClient(deleteTarget.id); setSelected(null) }; setDeleteTarget(null) }}
              className="bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30"
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
