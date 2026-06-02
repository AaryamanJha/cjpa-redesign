"use client"

import { useState, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Filter, ChevronDown, X, Clock, CheckCircle2, Circle, Loader2, AlertCircle, LayoutList, Columns3, Plus, Pencil, Trash2, Search } from "lucide-react"
import { Topbar } from "@/components/portal/Topbar"
import { usePortal } from "@/contexts/PortalContext"
import { Task, TaskStatus, TaskPriority } from "@/types/portal"
import { Kanban } from "@/components/ui/kanban"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

// ─── config ──────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<TaskStatus, { icon: React.ElementType; color: string; bg: string }> = {
  "Not Started":        { icon: Circle,       color: "#A8B0C0", bg: "rgba(168,176,192,0.08)" },
  "In Progress":        { icon: Loader2,      color: "#C8A96A", bg: "rgba(200,169,106,0.08)" },
  "Waiting for Review": { icon: Clock,        color: "#63B3ED", bg: "rgba(99,179,237,0.08)"  },
  "Completed":          { icon: CheckCircle2, color: "#68D391", bg: "rgba(104,211,145,0.08)" },
}

const PRIORITY_COLOR: Record<TaskPriority, string> = {
  Low: "#68D391", Medium: "#C8A96A", High: "#F6AD55", Urgent: "#FC8181",
}

const ALL_STATUSES: TaskStatus[] = ["Not Started", "In Progress", "Waiting for Review", "Completed"]

function daysUntil(dateStr: string) {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const [y, m, d] = dateStr.split("-").map(Number)
  return Math.ceil((new Date(y, m - 1, d).getTime() - today.getTime()) / 86400000)
}

function formatDate(s: string) {
  const [y, m, d] = s.split("-").map(Number)
  return new Date(y, m - 1, d).toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

// ─── status dropdown ──────────────────────────────────────────────────────────

function StatusDropdown({ current, onChange }: { current: TaskStatus; onChange: (s: TaskStatus) => void }) {
  const [open, setOpen] = useState(false)
  const cfg = STATUS_CONFIG[current]
  const Icon = cfg.icon

  return (
    <div className="relative">
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(!open) }}
        className="flex items-center gap-2 rounded-sm px-2.5 py-1.5 transition-colors hover:opacity-80 cursor-pointer"
        style={{ background: cfg.bg, border: `1px solid ${cfg.color}20` }}
      >
        <Icon size={12} style={{ color: cfg.color }} strokeWidth={1.5} />
        <span className="font-sans font-medium whitespace-nowrap" style={{ fontSize: "12px", color: cfg.color }}>
          {current}
        </span>
        <ChevronDown size={10} style={{ color: cfg.color }} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-1 z-50 bg-[#111927] border border-[#C8A96A]/15 rounded-sm overflow-hidden shadow-xl"
            style={{ minWidth: "170px" }}
          >
            {ALL_STATUSES.map((s) => {
              const c = STATUS_CONFIG[s]; const SI = c.icon
              return (
                <button key={s} onClick={(e) => { e.stopPropagation(); onChange(s); setOpen(false) }}
                  className="flex items-center gap-2.5 w-full px-3 py-2.5 hover:bg-[#F5F1E8]/4 transition-colors">
                  <SI size={12} style={{ color: c.color }} strokeWidth={1.5} />
                  <span className="font-sans" style={{ fontSize: "13px", color: c.color }}>{s}</span>
                </button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── task detail panel ────────────────────────────────────────────────────────

function TaskDetailPanel({ task, onClose, onStatusChange, onEdit, onDelete, getMemberName }: {
  task: Task; onClose: () => void; onStatusChange: (id: string, s: TaskStatus) => void
  onEdit: () => void; onDelete: () => void
  getMemberName: (id: string) => string
}) {
  const days = daysUntil(task.deadline)

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 24 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
      className="w-[340px] shrink-0 bg-[#0A1120] border-l border-[#C8A96A]/10 flex flex-col h-full sticky top-0 overflow-y-auto"
      style={{ maxHeight: "calc(100vh - 61px)" }}
    >
      <div className="px-6 py-5 border-b border-[#C8A96A]/10 flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-sans text-[#A8B0C0] uppercase mb-1" style={{ fontSize: "10px", letterSpacing: "0.18em" }}>Task Detail</p>
          <h3 className="font-serif text-[#F5F1E8] font-light leading-snug" style={{ fontSize: "18px" }}>{task.title}</h3>
        </div>
        <div className="flex items-center gap-1.5 mt-1 shrink-0">
          <button
            onClick={onEdit}
            className="flex items-center gap-1 rounded-sm px-2.5 py-1.5 font-sans transition-colors cursor-pointer hover:opacity-80"
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
          <button onClick={onClose} className="text-[#A8B0C0]/50 hover:text-[#A8B0C0] cursor-pointer transition-colors ml-0.5">
            <X size={16} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <div className="px-6 py-5 space-y-5 flex-1">
        <div>
          <p className="text-[#A8B0C0] font-sans uppercase mb-2" style={{ fontSize: "10px", letterSpacing: "0.15em" }}>Status</p>
          <StatusDropdown current={task.status} onChange={(s) => onStatusChange(task.id, s)} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-[#A8B0C0] font-sans uppercase mb-1.5" style={{ fontSize: "10px", letterSpacing: "0.15em" }}>Priority</p>
            <span className="font-sans font-medium" style={{ fontSize: "13px", color: PRIORITY_COLOR[task.priority] }}>{task.priority}</span>
          </div>
          <div>
            <p className="text-[#A8B0C0] font-sans uppercase mb-1.5" style={{ fontSize: "10px", letterSpacing: "0.15em" }}>Due</p>
            <span className="font-sans font-medium" style={{ fontSize: "13px", color: days < 0 ? "#FC8181" : days <= 3 ? "#F6AD55" : "#F5F1E8" }}>
              {formatDate(task.deadline)} {days < 0 ? "(Overdue)" : days === 0 ? "(Today)" : `(${days}d)`}
            </span>
          </div>
        </div>

        <div>
          <p className="text-[#A8B0C0] font-sans uppercase mb-1.5" style={{ fontSize: "9px", letterSpacing: "0.15em" }}>Project</p>
          <p className="font-sans text-[#F5F1E8]" style={{ fontSize: "14px" }}>{task.project}</p>
        </div>
        <div>
          <p className="text-[#A8B0C0] font-sans uppercase mb-1.5" style={{ fontSize: "9px", letterSpacing: "0.15em" }}>Assigned To</p>
          <p className="font-sans text-[#F5F1E8]" style={{ fontSize: "14px" }}>{getMemberName(task.assignedTo)}</p>
        </div>
        <div>
          <p className="text-[#A8B0C0] font-sans uppercase mb-1.5" style={{ fontSize: "9px", letterSpacing: "0.15em" }}>Assigned By</p>
          <p className="font-sans text-[#F5F1E8]" style={{ fontSize: "14px" }}>{task.assignedBy}</p>
        </div>
        <div>
          <p className="text-[#A8B0C0] font-sans uppercase mb-2" style={{ fontSize: "9px", letterSpacing: "0.15em" }}>Description</p>
          <p className="font-sans text-[#A8B0C0] leading-relaxed" style={{ fontSize: "14px" }}>{task.description}</p>
        </div>
        {task.notes && (
          <div>
            <p className="text-[#A8B0C0] font-sans uppercase mb-2" style={{ fontSize: "9px", letterSpacing: "0.15em" }}>Notes</p>
            <div className="border-l-2 border-[#C8A96A]/30 pl-3">
              <p className="font-sans text-[#A8B0C0] leading-relaxed" style={{ fontSize: "13px" }}>{task.notes}</p>
            </div>
          </div>
        )}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[#C8A96A]/10">
          <div>
            <p className="text-[#A8B0C0]/60 font-sans uppercase mb-1" style={{ fontSize: "10px", letterSpacing: "0.12em" }}>Created</p>
            <p className="font-sans text-[#A8B0C0]" style={{ fontSize: "12px" }}>{formatDate(task.createdDate)}</p>
          </div>
          <div>
            <p className="text-[#A8B0C0]/60 font-sans uppercase mb-1" style={{ fontSize: "10px", letterSpacing: "0.12em" }}>Updated</p>
            <p className="font-sans text-[#A8B0C0]" style={{ fontSize: "12px" }}>{formatDate(task.lastUpdated)}</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ─── create task dialog ───────────────────────────────────────────────────────

interface NewTaskForm {
  title: string; project: string; assignedTo: string; priority: TaskPriority
  deadline: string; description: string; notes: string
}

function nextDayISO() {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().split("T")[0]
}

const EMPTY_FORM: NewTaskForm = {
  title: "", project: "", assignedTo: "", priority: "Medium",
  deadline: nextDayISO(), description: "", notes: "",
}

function CreateTaskDialog({ open, onClose, onSave, user }: {
  open: boolean; onClose: () => void
  onSave: (task: Task) => void; user: { name: string } | null
}) {
  const { teamMembers, projects } = usePortal()
  const [form, setForm] = useState<NewTaskForm>(EMPTY_FORM)
  const [errors, setErrors] = useState<Partial<NewTaskForm>>({})

  const today = new Date().toISOString().split("T")[0]

  function set<K extends keyof NewTaskForm>(k: K, v: NewTaskForm[K]) {
    setForm((f) => ({ ...f, [k]: v }))
    setErrors((e) => ({ ...e, [k]: undefined }))
  }

  function validate() {
    const e: Partial<NewTaskForm> = {}
    if (!form.title.trim()) e.title = "Required"
    if (!form.project.trim()) e.project = "Required"
    if (!form.assignedTo.trim()) e.assignedTo = "Required"
    if (!form.deadline) e.deadline = "Required"
    return e
  }

  function handleSubmit() {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }

    const now = today
    const assigneeMember = teamMembers.find((m) => m.id === form.assignedTo)
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: form.title.trim(),
      description: form.description.trim() || "No description provided.",
      assignedBy: user?.name ?? "Unknown",
      assignedTo: form.assignedTo,
      roleOfAssignee: assigneeMember?.role ?? "Analyst",
      project: form.project.trim(),
      deadline: form.deadline,
      priority: form.priority,
      status: "Not Started",
      notes: form.notes.trim(),
      createdDate: now,
      lastUpdated: now,
    }
    onSave(newTask)
    setForm(EMPTY_FORM)
    setErrors({})
    onClose()
  }

  function handleClose() {
    setForm(EMPTY_FORM); setErrors({}); onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose() }}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>New Task</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* Title */}
          <Field label="Title" error={errors.title} required>
            <Input
              placeholder="Task title"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
            />
          </Field>

          {/* Project */}
          <Field label="Project" error={errors.project} required>
            <Select value={form.project} onValueChange={(v) => set("project", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a project" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((p) => (
                  <SelectItem key={p.id} value={p.projectName}>{p.projectName}</SelectItem>
                ))}
                <SelectItem value="__other__">Other / Independent</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          {/* Project override (if Other selected) */}
          {form.project === "__other__" && (
            <Field label="Project name">
              <Input
                placeholder="Enter project name"
                onChange={(e) => set("project", e.target.value || "__other__")}
              />
            </Field>
          )}

          <div className="grid grid-cols-2 gap-4">
            {/* Assigned to */}
            <Field label="Assign to" error={errors.assignedTo} required>
              <Select value={form.assignedTo} onValueChange={(v) => set("assignedTo", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select person" />
                </SelectTrigger>
                <SelectContent>
                  {teamMembers.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            {/* Priority */}
            <Field label="Priority">
              <Select value={form.priority} onValueChange={(v) => set("priority", v as TaskPriority)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(["Low", "Medium", "High", "Urgent"] as TaskPriority[]).map((p) => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>

          {/* Deadline */}
          <Field label="Deadline" error={errors.deadline} required>
            <Input
              type="date"
              min={today}
              value={form.deadline}
              onChange={(e) => set("deadline", e.target.value)}
              className="cursor-pointer"
            />
          </Field>

          {/* Description */}
          <Field label="Description">
            <Textarea
              placeholder="What needs to be done?"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={3}
            />
          </Field>

          {/* Notes */}
          <Field label="Notes (optional)">
            <Textarea
              placeholder="Internal notes or context"
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              rows={2}
            />
          </Field>
        </div>

        <div className="flex justify-end gap-2 mt-2 pt-4 border-t border-border">
          <Button variant="ghost" onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Create Task</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ─── edit task dialog ─────────────────────────────────────────────────────────

function EditTaskDialog({ open, onClose, task, onSave }: {
  open: boolean; onClose: () => void; task: Task; onSave: (id: string, updates: Partial<Task>) => void
}) {
  const { teamMembers, projects } = usePortal()
  const [form, setForm] = useState<NewTaskForm>({
    title: task.title, project: task.project, assignedTo: task.assignedTo,
    priority: task.priority, deadline: task.deadline, description: task.description, notes: task.notes,
  })
  const [errors, setErrors] = useState<Partial<NewTaskForm>>({})

  useEffect(() => {
    setForm({
      title: task.title, project: task.project, assignedTo: task.assignedTo,
      priority: task.priority, deadline: task.deadline, description: task.description, notes: task.notes,
    })
    setErrors({})
  }, [task.id])

  function set<K extends keyof NewTaskForm>(k: K, v: NewTaskForm[K]) {
    setForm((f) => ({ ...f, [k]: v }))
    setErrors((e) => ({ ...e, [k]: undefined }))
  }

  function validate() {
    const e: Partial<NewTaskForm> = {}
    if (!form.title.trim()) e.title = "Required"
    if (!form.project.trim()) e.project = "Required"
    if (!form.assignedTo.trim()) e.assignedTo = "Required"
    if (!form.deadline) e.deadline = "Required"
    return e
  }

  function handleSubmit() {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    const assigneeMember = teamMembers.find((m) => m.id === form.assignedTo)
    onSave(task.id, {
      title: form.title.trim(), project: form.project.trim(), assignedTo: form.assignedTo,
      roleOfAssignee: assigneeMember?.role ?? task.roleOfAssignee,
      priority: form.priority, deadline: form.deadline,
      description: form.description.trim(), notes: form.notes.trim(),
    })
    onClose()
  }

  const projectNames = [...new Set(projects.map((p) => p.projectName))]

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose() }}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>Edit Task</DialogTitle></DialogHeader>
        <div className="space-y-4 mt-2">
          <Field label="Title" error={errors.title} required>
            <Input value={form.title} onChange={(e) => set("title", e.target.value)} />
          </Field>
          <Field label="Project" error={errors.project} required>
            <Select value={form.project} onValueChange={(v) => set("project", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {projectNames.map((n) => <SelectItem key={n} value={n}>{n}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Assigned To" error={errors.assignedTo} required>
              <Select value={form.assignedTo} onValueChange={(v) => set("assignedTo", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {teamMembers.map((m) => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Priority">
              <Select value={form.priority} onValueChange={(v) => set("priority", v as TaskPriority)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Low","Medium","High","Urgent"].map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
          </div>
          <Field label="Deadline" error={errors.deadline} required>
            <Input type="date" value={form.deadline} onChange={(e) => set("deadline", e.target.value)} />
          </Field>
          <Field label="Description">
            <Textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={3} />
          </Field>
          <Field label="Notes">
            <Textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} rows={2} />
          </Field>
        </div>
        <div className="flex justify-end gap-2 mt-2 pt-4 border-t border-border">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ─── delete confirm dialog ────────────────────────────────────────────────────

function DeleteConfirmDialog({ open, label, onClose, onConfirm }: {
  open: boolean; label: string; onClose: () => void; onConfirm: () => void
}) {
  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose() }}>
      <DialogContent className="max-w-sm">
        <DialogHeader><DialogTitle>Delete {label}?</DialogTitle></DialogHeader>
        <p className="font-sans text-[#A8B0C0] mt-1" style={{ fontSize: "14px" }}>
          This cannot be undone.
        </p>
        <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-border">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button
            onClick={() => { onConfirm(); onClose() }}
            className="bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30"
          >
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function Field({ label, children, error, required }: {
  label: string; children: React.ReactNode; error?: string; required?: boolean
}) {
  return (
    <div className="space-y-1.5">
      <Label>
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </Label>
      {children}
      {error && <p className="text-[12px] text-red-400">{error}</p>}
    </div>
  )
}

// ─── main page ────────────────────────────────────────────────────────────────

export default function TasksPage() {
  const { user, hasPermission, teamMembers, tasks, addTask, updateTask, updateTaskStatus, deleteTask } = usePortal()

  function getMemberName(id: string): string {
    return teamMembers.find((m) => m.id === id)?.name ?? id
  }

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<TaskStatus | "All">("All")
  const [filterPriority, setFilterPriority] = useState<TaskPriority | "All">("All")
  const [filterAssignee, setFilterAssignee] = useState<string>("All")
  const [search, setSearch] = useState("")
  const [view, setView] = useState<"list" | "kanban">("list")
  const [createOpen, setCreateOpen] = useState(false)
  const [editTask, setEditTask] = useState<Task | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Task | null>(null)

  // All unique assignees across tasks the current user can see
  const allAssignees = useMemo(() => {
    const ids = [...new Set(tasks.map((t) => t.assignedTo))]
    return ids.map((id) => ({ id, name: getMemberName(id) })).sort((a, b) => a.name.localeCompare(b.name))
  }, [tasks, teamMembers])

  const visibleTasks = useMemo(() => {
    let list = tasks
    if (!hasPermission("all") && !hasPermission("assign_tasks")) {
      list = list.filter((t) => t.assignedTo === user?.id || t.assignedBy === user?.name)
    }
    if (filterStatus !== "All") list = list.filter((t) => t.status === filterStatus)
    if (filterPriority !== "All") list = list.filter((t) => t.priority === filterPriority)
    if (filterAssignee !== "All") list = list.filter((t) => t.assignedTo === filterAssignee)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter((t) =>
        t.title.toLowerCase().includes(q) ||
        t.project.toLowerCase().includes(q) ||
        getMemberName(t.assignedTo).toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q)
      )
    }
    return [...list].sort((a, b) => daysUntil(a.deadline) - daysUntil(b.deadline))
  }, [tasks, user, hasPermission, filterStatus, filterPriority, filterAssignee, search])

  const selectedTask = tasks.find((t) => t.id === selectedId) ?? null

  return (
    <>
      <Topbar title="Tasks" subtitle="Track and manage assigned work" />
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 flex flex-col min-w-0">

          {/* Filters + controls */}
          <div className="px-7 py-4 border-b border-[#C8A96A]/10 space-y-3">
            {/* Row 1: Search + New Task */}
            <div className="flex items-center gap-3">
              <div className="relative flex-1 max-w-xs">
                <Search size={13} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A8B0C0]/40 pointer-events-none" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search title, project, assignee…"
                  className="w-full bg-[#0D1520] border border-[rgba(200,169,106,0.15)] rounded-sm pl-8 pr-3 py-2 font-sans text-[#F5F1E8] placeholder:text-[#A8B0C0]/35 outline-none focus:border-[#C8A96A]/40 transition-colors"
                  style={{ fontSize: "13px" }}
                />
              </div>
              <span className="font-sans text-[#A8B0C0]/50" style={{ fontSize: "12px" }}>
                {visibleTasks.length} task{visibleTasks.length !== 1 ? "s" : ""}
              </span>
              <div className="ml-auto flex items-center gap-2">
              <button
                onClick={() => setCreateOpen(true)}
                className="flex items-center gap-1.5 rounded-sm px-3 py-1.5 font-sans font-medium transition-colors cursor-pointer"
                style={{ fontSize: "13px", background: "rgba(200,169,106,0.12)", color: "#C8A96A", border: "1px solid rgba(200,169,106,0.3)" }}
              >
                <Plus size={13} strokeWidth={2} /> New Task
              </button>

              {/* View toggle */}
              <div className="flex items-center gap-1 rounded-sm border border-[rgba(200,169,106,0.12)] p-0.5 bg-[#0D1520]">
                <button onClick={() => setView("list")} title="List view"
                  className={`p-1.5 rounded-sm transition-colors ${view === "list" ? "bg-[#C8A96A] text-[#070B14]" : "text-[#A8B0C0] hover:text-[#F5F1E8]"}`}>
                  <LayoutList size={13} />
                </button>
                <button onClick={() => setView("kanban")} title="Kanban view"
                  className={`p-1.5 rounded-sm transition-colors ${view === "kanban" ? "bg-[#C8A96A] text-[#070B14]" : "text-[#A8B0C0] hover:text-[#F5F1E8]"}`}>
                  <Columns3 size={13} />
                </button>
              </div>
              </div>
            </div>

            {/* Row 2: Status + Priority + Assignee chips */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 text-[#A8B0C0]/60">
                <Filter size={12} strokeWidth={1.5} />
              </div>

              {/* Status */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {(["All", ...ALL_STATUSES] as const).map((s) => (
                  <button key={s} onClick={() => setFilterStatus(s)}
                    className="font-sans rounded-sm px-3 py-1.5 transition-colors cursor-pointer"
                    style={{
                      fontSize: "12px",
                      background: filterStatus === s ? "rgba(200,169,106,0.12)" : "rgba(168,176,192,0.06)",
                      color: filterStatus === s ? "#C8A96A" : "#A8B0C0",
                      border: `1px solid ${filterStatus === s ? "rgba(200,169,106,0.3)" : "rgba(168,176,192,0.12)"}`,
                    }}>{s}</button>
                ))}
              </div>

              <div className="h-4 w-px bg-[#C8A96A]/15" />

              {/* Priority */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {(["All", "Urgent", "High", "Medium", "Low"] as const).map((p) => (
                  <button key={p} onClick={() => setFilterPriority(p)}
                    className="font-sans rounded-sm px-3 py-1.5 transition-colors cursor-pointer"
                    style={{
                      fontSize: "12px",
                      background: filterPriority === p ? "rgba(200,169,106,0.12)" : "rgba(168,176,192,0.06)",
                      color: filterPriority === p ? "#C8A96A" : p === "All" ? "#A8B0C0" : PRIORITY_COLOR[p as TaskPriority],
                      border: `1px solid ${filterPriority === p ? "rgba(200,169,106,0.3)" : "rgba(168,176,192,0.12)"}`,
                    }}>{p}</button>
                ))}
              </div>

              <div className="h-4 w-px bg-[#C8A96A]/15" />

              {/* Assignee */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <button onClick={() => setFilterAssignee("All")}
                  className="font-sans rounded-sm px-3 py-1.5 transition-colors cursor-pointer"
                  style={{
                    fontSize: "12px",
                    background: filterAssignee === "All" ? "rgba(200,169,106,0.12)" : "rgba(168,176,192,0.06)",
                    color: filterAssignee === "All" ? "#C8A96A" : "#A8B0C0",
                    border: `1px solid ${filterAssignee === "All" ? "rgba(200,169,106,0.3)" : "rgba(168,176,192,0.12)"}`,
                  }}>All</button>
                {allAssignees.map(({ id, name }) => (
                  <button key={id} onClick={() => setFilterAssignee(filterAssignee === id ? "All" : id)}
                    className="font-sans rounded-sm px-3 py-1.5 transition-colors cursor-pointer"
                    style={{
                      fontSize: "12px",
                      background: filterAssignee === id ? "rgba(200,169,106,0.12)" : "rgba(168,176,192,0.06)",
                      color: filterAssignee === id ? "#C8A96A" : "#A8B0C0",
                      border: `1px solid ${filterAssignee === id ? "rgba(200,169,106,0.3)" : "rgba(168,176,192,0.12)"}`,
                    }}>{name}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Kanban view */}
          {view === "kanban" && (
            <div className="flex-1 overflow-auto px-7 py-5">
              <Kanban tasks={visibleTasks} onTaskUpdate={updateTaskStatus} getMemberName={getMemberName} />
            </div>
          )}

          {/* List view */}
          {view === "list" && (
            <>
              <div className="px-7 py-3 border-b border-[#C8A96A]/8 grid gap-4 text-[#A8B0C0]"
                style={{ gridTemplateColumns: "1fr 180px 110px 80px 90px" }}>
                {["Task", "Project", "Assigned To", "Priority", "Due"].map((h) => (
                  <span key={h} className="font-sans uppercase" style={{ fontSize: "10.5px", letterSpacing: "0.15em" }}>{h}</span>
                ))}
              </div>
              <div className="flex-1 overflow-y-auto px-7">
                {visibleTasks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <AlertCircle size={24} className="text-[#A8B0C0]/30 mb-3" strokeWidth={1.5} />
                    <p className="font-sans text-[#A8B0C0]/50" style={{ fontSize: "14px" }}>No tasks match the current filters.</p>
                  </div>
                ) : (
                  visibleTasks.map((task) => {
                    const cfg = STATUS_CONFIG[task.status]
                    const Icon = cfg.icon
                    const days = daysUntil(task.deadline)
                    const isSelected = selectedId === task.id

                    return (
                      <div key={task.id}
                        onClick={() => setSelectedId(isSelected ? null : task.id)}
                        className="w-full grid gap-4 py-4 border-b border-[#C8A96A]/8 hover:bg-[#F5F1E8]/2 transition-colors cursor-pointer"
                        style={{ gridTemplateColumns: "1fr 180px 110px 80px 90px", background: isSelected ? "rgba(200,169,106,0.04)" : undefined }}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <Icon size={14} style={{ color: cfg.color, flexShrink: 0 }} strokeWidth={1.5} />
                          <div className="min-w-0">
                            <p className="font-sans font-medium text-[#F5F1E8] truncate" style={{ fontSize: "14px" }}>{task.title}</p>
                            <StatusDropdown current={task.status} onChange={(s) => updateTaskStatus(task.id, s)} />
                          </div>
                        </div>
                        <p className="font-sans text-[#A8B0C0] truncate self-center" style={{ fontSize: "13px" }}>{task.project}</p>
                        <p className="font-sans text-[#A8B0C0] truncate self-center" style={{ fontSize: "13px" }}>{getMemberName(task.assignedTo)}</p>
                        <span className="font-sans font-medium self-center" style={{ fontSize: "13px", color: PRIORITY_COLOR[task.priority] }}>{task.priority}</span>
                        <span className="font-sans self-center" style={{ fontSize: "13px", color: days < 0 ? "#FC8181" : days <= 3 ? "#F6AD55" : "#A8B0C0" }}>
                          {days < 0 ? "Overdue" : days === 0 ? "Today" : `${days}d`}
                        </span>
                      </div>
                    )
                  })
                )}
              </div>
            </>
          )}
        </div>

        {/* Detail panel */}
        {view === "list" && (
          <AnimatePresence>
            {selectedTask && (
              <TaskDetailPanel
                task={selectedTask}
                onClose={() => setSelectedId(null)}
                onStatusChange={updateTaskStatus}
                onEdit={() => setEditTask(selectedTask)}
                onDelete={() => setDeleteTarget(selectedTask)}
                getMemberName={getMemberName}
              />
            )}
          </AnimatePresence>
        )}
      </div>

      <CreateTaskDialog open={createOpen} onClose={() => setCreateOpen(false)} onSave={addTask} user={user} />

      {editTask && (
        <EditTaskDialog
          open={!!editTask}
          onClose={() => setEditTask(null)}
          task={editTask}
          onSave={updateTask}
        />
      )}

      <DeleteConfirmDialog
        open={!!deleteTarget}
        label={deleteTarget?.title ?? "Task"}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) {
            deleteTask(deleteTarget.id)
            if (selectedId === deleteTarget.id) setSelectedId(null)
          }
          setDeleteTarget(null)
        }}
      />
    </>
  )
}
