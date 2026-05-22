"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Task, TaskStatus, TaskPriority } from "@/types/portal"

// ─── Column config ───────────────────────────────────────────────────────────

interface Column {
  id: TaskStatus
  label: string
  accent: string
  headerBg: string
}

const COLUMNS: Column[] = [
  { id: "Not Started",        label: "Not Started",        accent: "#A8B0C0", headerBg: "rgba(168,176,192,0.08)" },
  { id: "In Progress",        label: "In Progress",        accent: "#C8A96A", headerBg: "rgba(200,169,106,0.08)" },
  { id: "Waiting for Review", label: "Waiting for Review", accent: "#3B82F6", headerBg: "rgba(59,130,246,0.08)"  },
  { id: "Completed",          label: "Completed",          accent: "#4ade80", headerBg: "rgba(74,222,128,0.08)"  },
]

const PRIORITY_STYLE: Record<TaskPriority, string> = {
  "Urgent": "bg-red-900/40 text-red-300 border border-red-700/30",
  "High":   "bg-amber-900/40 text-amber-300 border border-amber-700/30",
  "Medium": "bg-blue-900/30 text-blue-300 border border-blue-700/30",
  "Low":    "bg-zinc-800/60 text-zinc-400 border border-zinc-700/30",
}

// ─── Props ───────────────────────────────────────────────────────────────────

interface KanbanProps {
  tasks: Task[]
  onTaskUpdate?: (taskId: string, newStatus: TaskStatus) => void
  getMemberName?: (id: string) => string
  className?: string
}

// ─── Card ─────────────────────────────────────────────────────────────────────

function KanbanCard({
  task,
  onDragStart,
  onClick,
  getMemberName,
}: {
  task: Task
  onDragStart: (e: React.DragEvent, taskId: string) => void
  onClick: (task: Task) => void
  getMemberName?: (id: string) => string
}) {
  const [y, m, d] = task.deadline.split("-").map(Number)
  const deadlineDate = new Date(y, m - 1, d)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const daysLeft = Math.ceil((deadlineDate.getTime() - today.getTime()) / 86400000)
  const isOverdue = daysLeft < 0
  const isDueSoon = daysLeft >= 0 && daysLeft <= 3

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      onClick={() => onClick(task)}
      className="group relative rounded-sm border border-[rgba(200,169,106,0.10)] bg-[#101827] p-3.5 cursor-grab active:cursor-grabbing hover:border-[rgba(200,169,106,0.25)] hover:bg-[#111d2e] transition-all duration-150 select-none"
    >
      {/* Priority */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className={cn("inline-block rounded-sm px-1.5 py-0.5 text-[10px] font-medium tracking-wide uppercase", PRIORITY_STYLE[task.priority])}>
          {task.priority}
        </span>
        <span className={cn(
          "text-[10px] tabular-nums font-mono shrink-0",
          isOverdue ? "text-red-400" : isDueSoon ? "text-amber-400" : "text-[#A8B0C0]"
        )}>
          {isOverdue ? `${Math.abs(daysLeft)}d overdue` : daysLeft === 0 ? "due today" : `${daysLeft}d`}
        </span>
      </div>

      {/* Title */}
      <p className="text-[14px] font-medium text-[#F5F1E8] leading-snug mb-2 group-hover:text-white transition-colors">
        {task.title}
      </p>

      {/* Meta */}
      <div className="flex flex-col gap-1">
        <span className="text-[12px] text-[#A8B0C0] truncate">{task.project}</span>
        <span className="text-[12px] text-[#A8B0C0]/60">→ {getMemberName ? getMemberName(task.assignedTo) : task.assignedTo}</span>
      </div>
    </div>
  )
}

// ─── Detail Panel ─────────────────────────────────────────────────────────────

function KanbanDetailPanel({ task, onClose, onStatusChange, getMemberName }: {
  task: Task | null
  onClose: () => void
  onStatusChange: (taskId: string, status: TaskStatus) => void
  getMemberName?: (id: string) => string
}) {
  if (!task) return null

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-sm bg-[#0D1520] border-l border-[rgba(200,169,106,0.14)] flex flex-col shadow-2xl">
        <div className="flex items-start justify-between p-6 border-b border-[rgba(200,169,106,0.10)]">
          <div>
            <p className="text-[11px] text-[#C8A96A] tracking-widest uppercase mb-1">{task.id}</p>
            <h3 className="text-base font-serif font-light text-[#F5F1E8] leading-snug">{task.title}</h3>
          </div>
          <button onClick={onClose} className="text-[#A8B0C0] hover:text-[#F5F1E8] transition-colors ml-4 mt-0.5 shrink-0">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Status change */}
          <div>
            <p className="text-[10px] text-[#A8B0C0] tracking-widest uppercase mb-2">Status</p>
            <div className="grid grid-cols-2 gap-1.5">
              {COLUMNS.map((col) => (
                <button
                  key={col.id}
                  onClick={() => onStatusChange(task.id, col.id)}
                  className={cn(
                    "rounded-sm px-2.5 py-1.5 text-[12px] font-medium text-left transition-all",
                    task.status === col.id
                      ? "text-[#070B14]"
                      : "bg-[#101827] text-[#A8B0C0] hover:text-[#F5F1E8] border border-[rgba(200,169,106,0.10)] hover:border-[rgba(200,169,106,0.25)]"
                  )}
                  style={task.status === col.id ? { backgroundColor: col.accent, color: "#070B14" } : {}}
                >
                  {col.label}
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-[rgba(200,169,106,0.10)]" />

          <Row label="Priority"   value={task.priority} />
          <Row label="Project"    value={task.project} />
          <Row label="Assigned to" value={getMemberName ? getMemberName(task.assignedTo) : task.assignedTo} />
          <Row label="Assigned by" value={task.assignedBy} />
          <Row label="Deadline"   value={task.deadline} />
          <Row label="Created"    value={task.createdDate} />
          <Row label="Updated"    value={task.lastUpdated} />

          <div className="h-px bg-[rgba(200,169,106,0.10)]" />

          <div>
            <p className="text-[10px] text-[#A8B0C0] tracking-widest uppercase mb-2">Description</p>
            <p className="text-sm text-[#F5F1E8]/80 leading-relaxed">{task.description}</p>
          </div>

          {task.notes && (
            <div>
              <p className="text-[10px] text-[#A8B0C0] tracking-widest uppercase mb-2">Notes</p>
              <p className="text-sm text-[#F5F1E8]/60 leading-relaxed italic">{task.notes}</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 text-[13px]">
      <span className="text-[#A8B0C0] text-[11px] uppercase tracking-wide shrink-0">{label}</span>
      <span className="text-[#F5F1E8]/80 text-right">{value}</span>
    </div>
  )
}

// ─── Main Kanban ──────────────────────────────────────────────────────────────

export function Kanban({ tasks: initialTasks, onTaskUpdate, getMemberName, className }: KanbanProps) {
  const [dragging, setDragging] = React.useState<string | null>(null)
  const [dragOver, setDragOver] = React.useState<TaskStatus | null>(null)
  const [selected, setSelected] = React.useState<Task | null>(null)

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData("taskId", taskId)
    setDragging(taskId)
  }

  const handleDragEnd = () => {
    setDragging(null)
    setDragOver(null)
  }

  const handleDrop = (e: React.DragEvent, colId: TaskStatus) => {
    e.preventDefault()
    const taskId = e.dataTransfer.getData("taskId")
    handleStatusChange(taskId, colId)
    setDragOver(null)
    setDragging(null)
  }

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    const lastUpdated = new Date().toISOString().split("T")[0]
    setSelected((prev) => prev?.id === taskId ? { ...prev, status: newStatus, lastUpdated } : prev)
    onTaskUpdate?.(taskId, newStatus)
  }

  return (
    <div className={cn("h-full", className)}>
      {/* Board */}
      <div className="flex gap-4 h-full overflow-x-auto pb-4">
        {COLUMNS.map((col) => {
          const colTasks = initialTasks.filter((t) => t.status === col.id)
          const isOver = dragOver === col.id

          return (
            <div
              key={col.id}
              onDragOver={(e) => { e.preventDefault(); setDragOver(col.id) }}
              onDragLeave={() => setDragOver(null)}
              onDrop={(e) => handleDrop(e, col.id)}
              onDragEnd={handleDragEnd}
              className={cn(
                "flex flex-col rounded-sm min-w-[260px] w-[260px] shrink-0 transition-all duration-150",
                isOver ? "ring-1 ring-[rgba(200,169,106,0.35)]" : ""
              )}
            >
              {/* Column header */}
              <div
                className="flex items-center justify-between px-3.5 py-2.5 rounded-t-sm border border-b-0 border-[rgba(200,169,106,0.12)]"
                style={{ backgroundColor: col.headerBg }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: col.accent }} />
                  <span className="text-[13px] font-medium tracking-wide" style={{ color: col.accent }}>
                    {col.label}
                  </span>
                </div>
                <span className="text-[11px] tabular-nums font-mono text-[#A8B0C0]/70 bg-[rgba(0,0,0,0.2)] px-1.5 py-0.5 rounded-sm">
                  {colTasks.length}
                </span>
              </div>

              {/* Task list */}
              <div
                className={cn(
                  "flex-1 flex flex-col gap-2 p-2.5 border border-t-0 border-[rgba(200,169,106,0.12)] rounded-b-sm min-h-[120px] transition-colors duration-150",
                  isOver ? "bg-[rgba(200,169,106,0.04)]" : "bg-[#070B14]"
                )}
              >
                {colTasks.length === 0 && (
                  <div className="flex-1 flex items-center justify-center">
                    <span className="text-[11px] text-[#A8B0C0]/30 italic">Drop tasks here</span>
                  </div>
                )}
                {colTasks.map((task) => (
                  <div
                    key={task.id}
                    className={cn("transition-opacity duration-150", dragging === task.id ? "opacity-40" : "opacity-100")}
                  >
                    <KanbanCard
                      task={task}
                      onDragStart={handleDragStart}
                      onClick={setSelected}
                      getMemberName={getMemberName}
                    />
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Detail panel */}
      <KanbanDetailPanel
        task={selected}
        onClose={() => setSelected(null)}
        onStatusChange={handleStatusChange}
        getMemberName={getMemberName}
      />
    </div>
  )
}
