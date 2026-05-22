"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Users, Calendar, Target, ChevronRight, Pencil } from "lucide-react"
import { Topbar } from "@/components/portal/Topbar"
import { usePortal } from "@/contexts/PortalContext"
import { Project, ProjectStatus, PortalUser } from "@/types/portal"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Client } from "@/types/portal"

// ─── config ──────────────────────────────────────────────────────────────────

const STATUS_COLOR: Record<ProjectStatus, string> = {
  Discovery: "#A8B0C0",
  Research: "#63B3ED",
  Analysis: "#C8A96A",
  Drafting: "#9A89FF",
  Review: "#F6AD55",
  "Client Ready": "#68D391",
  Delivered: "#68D391",
  Archived: "#4A5568",
}

const PRIORITY_COLOR: Record<string, string> = {
  Low: "#68D391",
  Medium: "#C8A96A",
  High: "#F6AD55",
  Critical: "#FC8181",
}

const ALL_STATUSES: ProjectStatus[] = ["Discovery", "Research", "Analysis", "Drafting", "Review", "Client Ready", "Delivered", "Archived"]

function daysUntil(dateStr: string) {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const [y, m, d] = dateStr.split("-").map(Number)
  return Math.ceil((new Date(y, m - 1, d).getTime() - today.getTime()) / 86400000)
}

function formatDate(s: string) {
  const [y, m, d] = s.split("-").map(Number)
  return new Date(y, m - 1, d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

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

// ─── edit project dialog ──────────────────────────────────────────────────────

interface EditForm {
  projectName: string
  clientId: string
  clientName: string
  projectType: string
  lead: string
  team: string[]
  status: ProjectStatus
  priority: "Low" | "Medium" | "High" | "Critical"
  startDate: string
  targetDeadline: string
  summary: string
  keyDeliverables: string
  driveLink: string
}

function toEditForm(p: Project): EditForm {
  return {
    projectName: p.projectName,
    clientId: p.clientId ?? "",
    clientName: p.clientName,
    projectType: p.projectType,
    lead: p.lead,
    team: p.team,
    status: p.status,
    priority: p.priority,
    startDate: p.startDate,
    targetDeadline: p.targetDeadline,
    summary: p.summary,
    keyDeliverables: p.keyDeliverables.join("\n"),
    driveLink: p.driveLink ?? "",
  }
}

function EditProjectDialog({ open, onClose, project, onSave, clients, teamMembers }: {
  open: boolean
  onClose: () => void
  project: Project
  onSave: (id: string, updates: Partial<Project>) => void
  clients: Client[]
  teamMembers: PortalUser[]
}) {
  const [form, setForm] = useState<EditForm>(() => toEditForm(project))
  const [errors, setErrors] = useState<Partial<Record<keyof EditForm, string>>>({})

  function set<K extends keyof EditForm>(k: K, v: EditForm[K]) {
    setForm((f) => ({ ...f, [k]: v }))
    setErrors((e) => ({ ...e, [k]: undefined }))
  }

  function toggleTeamMember(name: string) {
    setForm((f) => ({
      ...f,
      team: f.team.includes(name) ? f.team.filter((n) => n !== name) : [...f.team, name],
    }))
  }

  function validate() {
    const e: Partial<Record<keyof EditForm, string>> = {}
    if (!form.projectName.trim()) e.projectName = "Required"
    if (!form.lead.trim()) e.lead = "Required"
    if (!form.targetDeadline) e.targetDeadline = "Required"
    return e
  }

  function handleSave() {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }

    const selectedClient = clients.find((c) => c.id === form.clientId)
    const updates: Partial<Project> = {
      projectName: form.projectName.trim(),
      clientId: form.clientId || undefined,
      clientName: selectedClient?.name ?? form.clientName,
      projectType: form.projectType.trim(),
      lead: form.lead,
      team: form.team.filter((n) => n !== form.lead),
      status: form.status,
      priority: form.priority,
      startDate: form.startDate,
      targetDeadline: form.targetDeadline,
      summary: form.summary.trim(),
      keyDeliverables: form.keyDeliverables.split("\n").map((s) => s.trim()).filter(Boolean),
      driveLink: form.driveLink.trim() || undefined,
    }
    onSave(project.id, updates)
    onClose()
  }

  const leadOptions = teamMembers
  const teamOptions = teamMembers.filter((m) => m.name !== form.lead)

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose() }}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <Field label="Project Name" error={errors.projectName} required>
            <Input value={form.projectName} onChange={(e) => set("projectName", e.target.value)} />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Client">
              <Select value={form.clientId} onValueChange={(v) => set("clientId", v)}>
                <SelectTrigger><SelectValue placeholder="Select client" /></SelectTrigger>
                <SelectContent>
                  {clients.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Project Type">
              <Input value={form.projectType} onChange={(e) => set("projectType", e.target.value)} placeholder="e.g. Market Entry Strategy" />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Status">
              <Select value={form.status} onValueChange={(v) => set("status", v as ProjectStatus)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ALL_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Priority">
              <Select value={form.priority} onValueChange={(v) => set("priority", v as EditForm["priority"])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Low", "Medium", "High", "Critical"].map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
          </div>

          <Field label="Lead" error={errors.lead} required>
            <Select value={form.lead} onValueChange={(v) => set("lead", v)}>
              <SelectTrigger><SelectValue placeholder="Select lead" /></SelectTrigger>
              <SelectContent>
                {leadOptions.map((m) => <SelectItem key={m.id} value={m.name}>{m.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Team Members">
            <div className="flex flex-wrap gap-2 pt-1">
              {teamOptions.map((m) => {
                const active = form.team.includes(m.name)
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => toggleTeamMember(m.name)}
                    className="rounded-sm px-2.5 py-1 font-sans transition-colors cursor-pointer"
                    style={{
                      fontSize: "12px",
                      background: active ? "rgba(200,169,106,0.14)" : "rgba(168,176,192,0.06)",
                      color: active ? "#C8A96A" : "#A8B0C0",
                      border: `1px solid ${active ? "rgba(200,169,106,0.35)" : "rgba(168,176,192,0.15)"}`,
                    }}
                  >
                    {m.name}
                  </button>
                )
              })}
            </div>
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Start Date">
              <Input type="date" value={form.startDate} onChange={(e) => set("startDate", e.target.value)} className="cursor-pointer" />
            </Field>
            <Field label="Target Deadline" error={errors.targetDeadline} required>
              <Input type="date" value={form.targetDeadline} onChange={(e) => set("targetDeadline", e.target.value)} className="cursor-pointer" />
            </Field>
          </div>

          <Field label="Summary">
            <Textarea value={form.summary} onChange={(e) => set("summary", e.target.value)} rows={3} placeholder="Project overview..." />
          </Field>

          <Field label="Key Deliverables (one per line)">
            <Textarea value={form.keyDeliverables} onChange={(e) => set("keyDeliverables", e.target.value)} rows={4} placeholder="Political risk matrix&#10;Market entry framework&#10;Final report" />
          </Field>

          <Field label="Google Drive Folder Link">
            <Input type="url" value={form.driveLink} onChange={(e) => set("driveLink", e.target.value)} placeholder="https://drive.google.com/drive/folders/..." />
          </Field>
        </div>

        <div className="flex justify-end gap-2 mt-2 pt-4 border-t border-border">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ─── project detail panel ─────────────────────────────────────────────────────

function ProjectDetailPanel({ project, onClose, allTasks, onEdit }: {
  project: Project; onClose: () => void; allTasks: ReturnType<typeof usePortal>["tasks"]; onEdit: () => void
}) {
  const color = STATUS_COLOR[project.status]
  const projectTasks = allTasks.filter((t) => t.project === project.projectName)
  const days = daysUntil(project.targetDeadline)

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="w-[360px] shrink-0 bg-[#0A1120] border-l border-[#C8A96A]/10 flex flex-col sticky top-0 overflow-y-auto"
      style={{ maxHeight: "calc(100vh - 61px)" }}
    >
      <div className="px-6 py-5 border-b border-[#C8A96A]/10 flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-sans rounded-sm" style={{
              fontSize: "10px", letterSpacing: "0.1em", padding: "2px 7px",
              background: `${color}12`, color, border: `1px solid ${color}25`,
            }}>{project.status.toUpperCase()}</span>
            <span className="font-sans rounded-sm" style={{
              fontSize: "10px", letterSpacing: "0.1em", padding: "2px 7px",
              background: `${PRIORITY_COLOR[project.priority]}12`,
              color: PRIORITY_COLOR[project.priority],
              border: `1px solid ${PRIORITY_COLOR[project.priority]}25`,
            }}>{project.priority.toUpperCase()}</span>
          </div>
          <h3 className="font-serif text-[#F5F1E8] font-light leading-snug" style={{ fontSize: "18px" }}>{project.projectName}</h3>
          <p className="font-sans text-[#A8B0C0] mt-1" style={{ fontSize: "13px" }}>{project.clientName}</p>
        </div>
        <div className="flex items-center gap-2 mt-1 shrink-0">
          <button
            onClick={onEdit}
            className="flex items-center gap-1.5 rounded-sm px-2.5 py-1.5 font-sans transition-colors cursor-pointer hover:opacity-80"
            style={{ fontSize: "12px", background: "rgba(200,169,106,0.10)", color: "#C8A96A", border: "1px solid rgba(200,169,106,0.25)" }}
          >
            <Pencil size={11} strokeWidth={1.5} /> Edit
          </button>
          <button onClick={onClose} className="text-[#A8B0C0]/50 hover:text-[#A8B0C0] cursor-pointer transition-colors">
            <X size={16} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <div className="px-6 py-5 space-y-5 flex-1">
        <div>
          <p className="text-[#A8B0C0] font-sans uppercase mb-2" style={{ fontSize: "10px", letterSpacing: "0.15em" }}>Summary</p>
          <p className="font-sans text-[#A8B0C0] leading-relaxed" style={{ fontSize: "14px" }}>{project.summary}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-[#A8B0C0] font-sans uppercase mb-1.5" style={{ fontSize: "10px", letterSpacing: "0.15em" }}>Type</p>
            <p className="font-sans text-[#F5F1E8]" style={{ fontSize: "14px" }}>{project.projectType}</p>
          </div>
          <div>
            <p className="text-[#A8B0C0] font-sans uppercase mb-1.5" style={{ fontSize: "10px", letterSpacing: "0.15em" }}>Lead</p>
            <p className="font-sans text-[#F5F1E8]" style={{ fontSize: "14px" }}>{project.lead}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-[#A8B0C0] font-sans uppercase mb-1.5" style={{ fontSize: "10px", letterSpacing: "0.15em" }}>Start</p>
            <p className="font-sans text-[#F5F1E8]" style={{ fontSize: "14px" }}>{formatDate(project.startDate)}</p>
          </div>
          <div>
            <p className="text-[#A8B0C0] font-sans uppercase mb-1.5" style={{ fontSize: "10px", letterSpacing: "0.15em" }}>Deadline</p>
            <p className="font-sans font-medium" style={{ fontSize: "12.5px", color: days <= 14 ? "#F6AD55" : "#F5F1E8" }}>
              {formatDate(project.targetDeadline)}
            </p>
          </div>
        </div>

        <div>
          <p className="text-[#A8B0C0] font-sans uppercase mb-2" style={{ fontSize: "10px", letterSpacing: "0.15em" }}>Team</p>
          <div className="flex flex-wrap gap-2">
            {[project.lead, ...project.team].filter((v, i, a) => a.indexOf(v) === i).map((name) => (
              <span key={name} className="font-sans rounded-sm px-2.5 py-1" style={{
                fontSize: "12px", background: "rgba(168,176,192,0.08)", color: "#A8B0C0",
                border: "1px solid rgba(168,176,192,0.15)",
              }}>{name}</span>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[#A8B0C0] font-sans uppercase mb-2" style={{ fontSize: "10px", letterSpacing: "0.15em" }}>Key Deliverables</p>
          <ul className="space-y-2">
            {project.keyDeliverables.map((d, i) => (
              <li key={i} className="flex items-center gap-2.5">
                <Target size={11} className="text-[#C8A96A]/60 shrink-0" strokeWidth={1.5} />
                <span className="font-sans text-[#A8B0C0]" style={{ fontSize: "14px" }}>{d}</span>
              </li>
            ))}
          </ul>
        </div>

        {project.driveLink && (
          <div>
            <p className="text-[#A8B0C0] font-sans uppercase mb-2" style={{ fontSize: "10px", letterSpacing: "0.15em" }}>Drive Folder</p>
            <a
              href={project.driveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-[#C8A96A] hover:underline"
              style={{ fontSize: "13px" }}
            >
              Open in Google Drive
            </a>
          </div>
        )}

        {projectTasks.length > 0 && (
          <div>
            <p className="text-[#A8B0C0] font-sans uppercase mb-2" style={{ fontSize: "10px", letterSpacing: "0.15em" }}>
              Related Tasks ({projectTasks.length})
            </p>
            <div className="space-y-1.5">
              {projectTasks.map((t) => (
                <div key={t.id} className="flex items-center justify-between gap-2 py-1.5 border-b border-[#C8A96A]/8 last:border-0">
                  <p className="font-sans text-[#A8B0C0] truncate" style={{ fontSize: "13px" }}>{t.title}</p>
                  <span className="font-sans shrink-0" style={{ fontSize: "11px", color: t.status === "Completed" ? "#68D391" : "#C8A96A" }}>
                    {t.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

// ─── main page ────────────────────────────────────────────────────────────────

export default function ProjectsPage() {
  const { user, hasPermission, tasks, projects, clients, teamMembers, updateProject } = usePortal()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<ProjectStatus | "All">("All")

  const visibleProjects = useMemo(() => {
    let list = projects
    if (!hasPermission("view_all_projects") && !hasPermission("all")) {
      list = list.filter((p) => p.lead === user?.name || p.team.includes(user?.name ?? ""))
    }
    if (filterStatus !== "All") list = list.filter((p) => p.status === filterStatus)
    return list
  }, [user, hasPermission, filterStatus, projects])

  const selectedProject = projects.find((p) => p.id === selectedId) ?? null
  const editingProject  = projects.find((p) => p.id === editingId) ?? null
  const activeCount = visibleProjects.filter((p) => !["Delivered", "Archived"].includes(p.status)).length

  return (
    <>
      <Topbar title="Projects" subtitle={`${activeCount} active mandate${activeCount !== 1 ? "s" : ""}`} />
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 flex flex-col min-w-0">
          {/* Filters */}
          <div className="px-7 py-4 border-b border-[#C8A96A]/10 flex items-center gap-2 flex-wrap">
            {(["All", ...ALL_STATUSES] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className="font-sans rounded-sm px-3.5 py-2 transition-colors cursor-pointer"
                style={{
                  fontSize: "12px",
                  background: filterStatus === s ? "rgba(200,169,106,0.12)" : "rgba(168,176,192,0.06)",
                  color: filterStatus === s ? "#C8A96A" : s === "All" ? "#A8B0C0" : STATUS_COLOR[s as ProjectStatus],
                  border: `1px solid ${filterStatus === s ? "rgba(200,169,106,0.3)" : "rgba(168,176,192,0.12)"}`,
                }}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Project cards */}
          <div className="flex-1 overflow-y-auto px-7 py-6 grid grid-cols-1 xl:grid-cols-2 gap-4 content-start">
            {visibleProjects.map((p, i) => {
              const color = STATUS_COLOR[p.status]
              const days = daysUntil(p.targetDeadline)
              const isSelected = selectedId === p.id

              return (
                <motion.button
                  key={p.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  onClick={() => setSelectedId(isSelected ? null : p.id)}
                  className="text-left bg-[#0D1520] border rounded-sm p-5 transition-all cursor-pointer hover:border-[#C8A96A]/20"
                  style={{ borderColor: isSelected ? "rgba(200,169,106,0.3)" : "rgba(200,169,106,0.10)" }}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-sans rounded-sm" style={{
                        fontSize: "10px", letterSpacing: "0.1em", padding: "2px 7px",
                        background: `${color}12`, color, border: `1px solid ${color}25`,
                      }}>{p.status.toUpperCase()}</span>
                      <span className="font-sans rounded-sm" style={{
                        fontSize: "10px", letterSpacing: "0.1em", padding: "2px 7px",
                        background: `${PRIORITY_COLOR[p.priority]}12`, color: PRIORITY_COLOR[p.priority],
                        border: `1px solid ${PRIORITY_COLOR[p.priority]}25`,
                      }}>{p.priority.toUpperCase()}</span>
                    </div>
                    <ChevronRight size={14} className="text-[#A8B0C0]/40 shrink-0 mt-0.5" strokeWidth={1.5} />
                  </div>

                  <h3 className="font-serif text-[#F5F1E8] font-light leading-snug mb-1" style={{ fontSize: "17px" }}>{p.projectName}</h3>
                  <p className="font-sans text-[#A8B0C0] mb-4" style={{ fontSize: "13px" }}>{p.clientName} · {p.projectType}</p>

                  <p className="font-sans text-[#A8B0C0] leading-relaxed mb-4" style={{ fontSize: "13px" }}>
                    {p.summary.length > 120 ? p.summary.slice(0, 120) + "…" : p.summary}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 text-[#A8B0C0]/60">
                        <Users size={11} strokeWidth={1.5} />
                        <span className="font-sans" style={{ fontSize: "12px" }}>{p.team.length + 1}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[#A8B0C0]/60">
                        <Target size={11} strokeWidth={1.5} />
                        <span className="font-sans" style={{ fontSize: "12px" }}>{p.keyDeliverables.length}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar size={11} strokeWidth={1.5} className="text-[#A8B0C0]/50" />
                      <span className="font-sans" style={{ fontSize: "12px", color: days <= 14 ? "#F6AD55" : "#A8B0C0" }}>
                        {formatDate(p.targetDeadline)}
                      </span>
                    </div>
                  </div>
                </motion.button>
              )
            })}
          </div>
        </div>

        <AnimatePresence>
          {selectedProject && (
            <ProjectDetailPanel
              project={selectedProject}
              onClose={() => setSelectedId(null)}
              allTasks={tasks}
              onEdit={() => setEditingId(selectedProject.id)}
            />
          )}
        </AnimatePresence>
      </div>

      {editingProject && (
        <EditProjectDialog
          key={editingProject.id}
          open={!!editingId}
          onClose={() => setEditingId(null)}
          project={editingProject}
          onSave={updateProject}
          clients={clients}
          teamMembers={teamMembers}
        />
      )}
    </>
  )
}
