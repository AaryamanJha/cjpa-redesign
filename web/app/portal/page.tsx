"use client"

import { useMemo } from "react"
import { motion, type Variants } from "framer-motion"
import {
  ClipboardList,
  FolderKanban,
  CalendarClock,
  TrendingUp,
  Clock,
  AlertCircle,
  CheckCircle2,
  Circle,
  Loader2,
  ChevronRight,
  TrendingDown,
} from "lucide-react"
import { Topbar } from "@/components/portal/Topbar"
import { RoleBadge } from "@/components/portal/RoleBadge"
import { usePortal } from "@/contexts/PortalContext"
import { mockAnnouncements } from "@/data/mockAnnouncements"
import { TaskStatus, ProjectStatus, Project } from "@/types/portal"

// ─── helpers ───────────────────────────────────────────────────────────────

function daysUntil(dateStr: string): number {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const [y, m, d] = dateStr.split("-").map(Number)
  const target = new Date(y, m - 1, d)
  return Math.ceil((target.getTime() - today.getTime()) / 86400000)
}

function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number)
  return new Date(y, m - 1, d).toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

const TASK_STATUS_ICON: Record<TaskStatus, React.ElementType> = {
  "Not Started": Circle,
  "In Progress": Loader2,
  "Waiting for Review": Clock,
  Completed: CheckCircle2,
}

const TASK_STATUS_COLOR: Record<TaskStatus, string> = {
  "Not Started": "#A8B0C0",
  "In Progress": "#C8A96A",
  "Waiting for Review": "#63B3ED",
  Completed: "#68D391",
}

const PROJECT_STATUS_COLOR: Record<ProjectStatus, string> = {
  Discovery: "#A8B0C0", Research: "#63B3ED", Analysis: "#C8A96A",
  Drafting: "#9A89FF", Review: "#F6AD55", "Client Ready": "#68D391",
  Delivered: "#68D391", Archived: "#4A5568",
}

// ─── stat card ────────────────────────────────────────────────────────────

function StatCard({
  label, value, sub, icon: Icon, accent, trend,
}: {
  label: string; value: string | number; sub?: string
  icon: React.ElementType; accent: string; trend?: "up" | "down" | "neutral"
}) {
  const TrendIcon = trend === "down" ? TrendingDown : TrendingUp
  const trendColor = trend === "down" ? "#FC8181" : trend === "up" ? "#68D391" : "#A8B0C0"

  return (
    <div className="bg-[#0D1520] border border-[#C8A96A]/10 rounded-sm p-5 flex flex-col gap-4 hover:border-[#C8A96A]/20 transition-colors group">
      <div className="flex items-start justify-between">
        <div
          className="w-9 h-9 rounded-sm flex items-center justify-center"
          style={{ background: `${accent}18`, border: `1px solid ${accent}28` }}
        >
          <Icon size={16} style={{ color: accent }} strokeWidth={1.5} />
        </div>
        {trend && trend !== "neutral" && (
          <TrendIcon size={14} style={{ color: trendColor }} strokeWidth={1.5} />
        )}
      </div>
      <div>
        <p className="font-sans text-[#A8B0C0]" style={{ fontSize: "13px" }}>{label}</p>
        <p className="font-serif text-[#F5F1E8] font-light mt-1" style={{ fontSize: "clamp(26px, 2.8vw, 34px)" }}>
          {value}
        </p>
        {sub && (
          <p className="font-sans text-[#A8B0C0]/60 mt-0.5" style={{ fontSize: "12px" }}>{sub}</p>
        )}
      </div>
    </div>
  )
}

// ─── activity row ─────────────────────────────────────────────────────────

function ActivityRow({
  icon: Icon, iconColor, iconBg, title, subtitle, right,
}: {
  icon: React.ElementType; iconColor: string; iconBg: string
  title: string; subtitle: string; right: string
}) {
  return (
    <div className="flex items-center gap-3.5 py-3 border-b border-[#C8A96A]/06 last:border-0 hover:bg-[#F5F1E8]/2 -mx-5 px-5 rounded-sm transition-colors cursor-default">
      <div
        className="w-8 h-8 rounded-sm flex items-center justify-center shrink-0"
        style={{ background: iconBg, border: `1px solid ${iconColor}22` }}
      >
        <Icon size={13} style={{ color: iconColor }} strokeWidth={1.5} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-sans font-medium text-[#F5F1E8] truncate" style={{ fontSize: "14px" }}>{title}</p>
        <p className="font-sans text-[#A8B0C0]/60 truncate mt-0.5" style={{ fontSize: "12px" }}>{subtitle}</p>
      </div>
      <span className="font-sans text-[#A8B0C0]/50 shrink-0 tabular-nums" style={{ fontSize: "12px" }}>{right}</span>
    </div>
  )
}

// ─── section card ─────────────────────────────────────────────────────────

function SectionCard({
  label, heading, count, children, action, actionHref,
}: {
  label: string; heading: string; count?: string
  children: React.ReactNode; action?: string; actionHref?: string
}) {
  return (
    <div className="bg-[#0D1520] border border-[#C8A96A]/10 rounded-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-[#C8A96A]/10 flex items-center justify-between">
        <div>
          <p className="font-sans text-[#A8B0C0] uppercase" style={{ fontSize: "10px", letterSpacing: "0.18em" }}>{label}</p>
          <p className="font-sans font-medium text-[#F5F1E8] mt-0.5" style={{ fontSize: "16px" }}>{heading}</p>
        </div>
        <div className="flex items-center gap-3">
          {count && <span className="font-sans text-[#A8B0C0]/50" style={{ fontSize: "12px" }}>{count}</span>}
          {action && actionHref && (
            <a
              href={actionHref}
              className="flex items-center gap-1 font-sans text-[#C8A96A] hover:text-[#d4b87e] transition-colors"
              style={{ fontSize: "13px" }}
            >
              {action} <ChevronRight size={11} strokeWidth={2} />
            </a>
          )}
        </div>
      </div>
      <div className="px-5">{children}</div>
    </div>
  )
}

// ─── progress bar item ────────────────────────────────────────────────────

function ProgressItem({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = Math.round((value / max) * 100)
  return (
    <div className="space-y-1.5 py-2.5 border-b border-[#C8A96A]/06 last:border-0">
      <div className="flex justify-between text-[12px]">
        <span className="text-[#A8B0C0]">{label}</span>
        <span className="text-[#F5F1E8] font-medium tabular-nums">{value}/{max}</span>
      </div>
      <div className="h-1.5 rounded-full bg-[#1a2535] overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  )
}

// ─── project mini row ─────────────────────────────────────────────────────

function ProjectMiniRow({ projectName, lead, status, targetDeadline }: {
  projectName: string; lead: string; status: ProjectStatus; targetDeadline: string
}) {
  const color = PROJECT_STATUS_COLOR[status]
  return (
    <div className="flex items-center gap-3 py-3 border-b border-[#C8A96A]/06 last:border-0">
      <div className="w-1.5 h-1.5 rounded-full shrink-0 mt-0.5" style={{ background: color }} />
      <div className="flex-1 min-w-0">
        <p className="font-sans font-medium text-[#F5F1E8] truncate" style={{ fontSize: "14px" }}>{projectName}</p>
        <p className="font-sans text-[#A8B0C0]/60 truncate mt-0.5" style={{ fontSize: "12px" }}>Lead: {lead}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span className="font-sans rounded-sm" style={{
          fontSize: "9.5px", letterSpacing: "0.1em", padding: "2px 6px",
          background: `${color}12`, color, border: `1px solid ${color}25`,
        }}>
          {status.toUpperCase()}
        </span>
        <span className="font-sans text-[#A8B0C0]/50" style={{ fontSize: "12px" }}>{formatDate(targetDeadline)}</span>
      </div>
    </div>
  )
}

// ─── announcement mini ────────────────────────────────────────────────────

function AnnouncementMini({ title, postedBy, date, priority }: {
  title: string; postedBy: string; date: string; priority: string
}) {
  const barColor = priority === "Urgent" ? "#FC8181" : priority === "Important" ? "#C8A96A" : "#A8B0C0"
  return (
    <div className="flex gap-3.5 py-3.5 border-b border-[#C8A96A]/06 last:border-0">
      <div className="w-0.5 self-stretch rounded-full shrink-0" style={{ background: barColor }} />
      <div className="flex-1 min-w-0">
        <p className="font-sans font-medium text-[#F5F1E8] leading-snug" style={{ fontSize: "14px" }}>{title}</p>
        <p className="font-sans text-[#A8B0C0]/50 mt-1" style={{ fontSize: "12px" }}>
          {postedBy} · {formatDate(date)}
        </p>
      </div>
      <span className="font-sans shrink-0 mt-0.5" style={{ fontSize: "10px", color: barColor, letterSpacing: "0.1em" }}>
        {priority.toUpperCase()}
      </span>
    </div>
  )
}

// ─── fade-up variant ──────────────────────────────────────────────────────

const FADE_UP: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
}

const PROJECT_PRIORITY_RANK = {
  Critical: 0,
  High: 1,
  Medium: 2,
  Low: 3,
} as const

function compareProjects(a: Project, b: Project) {
  const aRanked = typeof a.rank === "number"
  const bRanked = typeof b.rank === "number"

  if (aRanked && bRanked && a.rank !== b.rank) return (a.rank as number) - (b.rank as number)
  if (aRanked && !bRanked) return -1
  if (!aRanked && bRanked) return 1

  const priorityDelta = PROJECT_PRIORITY_RANK[a.priority] - PROJECT_PRIORITY_RANK[b.priority]
  if (priorityDelta !== 0) return priorityDelta

  return daysUntil(a.targetDeadline) - daysUntil(b.targetDeadline)
}

// ─── main ─────────────────────────────────────────────────────────────────

export default function PortalOverview() {
  const { user, hasPermission, tasks, projects } = usePortal()

  const myTasks = useMemo(() => {
    if (!user) return []
    if (hasPermission("all") || hasPermission("assign_tasks")) return tasks
    return tasks.filter((t) => t.assignedTo === user.id || t.assignedBy === user.name)
  }, [user, hasPermission, tasks])

  const myProjects = useMemo(() => {
    return projects
  }, [projects])

  const upcomingTasks = useMemo(() =>
    myTasks
      .filter((t) => t.status !== "Completed" && daysUntil(t.deadline) <= 14)
      .sort((a, b) => daysUntil(a.deadline) - daysUntil(b.deadline))
      .slice(0, 6),
    [myTasks]
  )

  const activeProjects = useMemo(() =>
    myProjects
      .filter((p) => !["Delivered", "Archived"].includes(p.status))
      .sort(compareProjects)
      .slice(0, 4),
    [myProjects]
  )

  const visibleAnnouncements = useMemo(() => {
    if (!user) return []
    return mockAnnouncements.filter((a) => {
      if (a.audience === "All Team") return true
      if (a.audience === "Advisors" && ["CEO", "Senior Advisor", "Advisor"].includes(user.role)) return true
      if (a.audience === "Analysts" && ["Analyst", "Intern Analyst"].includes(user.role)) return true
      return false
    })
  }, [user])

  const inProgressCount = myTasks.filter((t) => t.status === "In Progress").length
  const overdueCount = myTasks.filter((t) => daysUntil(t.deadline) < 0 && t.status !== "Completed").length
  const dueThisWeek = myTasks.filter((t) => daysUntil(t.deadline) <= 7 && daysUntil(t.deadline) >= 0).length
  const completedCount = myTasks.filter((t) => t.status === "Completed").length

  if (!user) return null

  const greeting = (() => {
    const h = new Date().getHours()
    if (h < 12) return "Good morning"
    if (h < 17) return "Good afternoon"
    return "Good evening"
  })()

  return (
    <>
      <Topbar
        title="Overview"
        subtitle={new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
      />

      <div className="flex-1 overflow-y-auto px-7 py-8">
        <div className="max-w-[1200px] space-y-8">

          {/* Greeting */}
          <motion.div custom={0} initial="hidden" animate="visible" variants={FADE_UP}>
            <div className="flex items-center gap-3">
              <h2 className="font-serif text-[#F5F1E8] font-light" style={{ fontSize: "clamp(22px, 2.5vw, 30px)" }}>
                {greeting}, {user.name.split(" ")[0]}.
              </h2>
              <RoleBadge role={user.role} />
            </div>
            <p className="font-sans text-[#A8B0C0] mt-1" style={{ fontSize: "13px" }}>
              {user.title} · CJPA Global Advisors
            </p>
          </motion.div>

          {/* Stat cards */}
          <motion.div custom={1} initial="hidden" animate="visible" variants={FADE_UP}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          >
            <StatCard
              label="Active Projects"    value={activeProjects.length}
              sub="currently in progress" icon={FolderKanban} accent="#C8A96A" trend="up"
            />
            <StatCard
              label="Assigned Tasks"     value={myTasks.length}
              sub={`${inProgressCount} in progress`} icon={ClipboardList} accent="#63B3ED"
              trend={inProgressCount > 0 ? "up" : "neutral"}
            />
            <StatCard
              label="Due This Week"      value={dueThisWeek}
              sub="next 7 days"          icon={CalendarClock} accent="#9A89FF"
              trend={dueThisWeek > 0 ? "neutral" : "up"}
            />
            <StatCard
              label="Overdue"            value={overdueCount}
              sub={overdueCount > 0 ? "requires attention" : "all on track"}
              icon={overdueCount > 0 ? AlertCircle : TrendingUp}
              accent={overdueCount > 0 ? "#FC8181" : "#68D391"}
              trend={overdueCount > 0 ? "down" : "up"}
            />
          </motion.div>

          {/* Main content grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left col: Upcoming Tasks (2/3 width) */}
            <motion.div custom={2} initial="hidden" animate="visible" variants={FADE_UP} className="lg:col-span-2">
              <SectionCard
                label="Tasks"
                heading="Upcoming Deadlines"
                count={`${upcomingTasks.length} items`}
                action="View all"
                actionHref="/portal/tasks"
              >
                {upcomingTasks.length === 0 ? (
                  <p className="py-8 text-center font-sans text-[#A8B0C0]/50" style={{ fontSize: "14px" }}>
                    No upcoming tasks in the next 14 days.
                  </p>
                ) : (
                  upcomingTasks.map((t) => {
                    const StatusIcon = TASK_STATUS_ICON[t.status]
                    const statusColor = TASK_STATUS_COLOR[t.status]
                    const days = daysUntil(t.deadline)
                    return (
                      <ActivityRow
                        key={t.id}
                        icon={StatusIcon}
                        iconColor={statusColor}
                        iconBg={`${statusColor}14`}
                        title={t.title}
                        subtitle={`${t.project} · ${t.assignedBy.split(" ").slice(-1)[0]}`}
                        right={days < 0 ? "Overdue" : days === 0 ? "Today" : `${days}d`}
                      />
                    )
                  })
                )}
              </SectionCard>
            </motion.div>

            {/* Right col: progress + announcements */}
            <div className="space-y-5">
              {/* Task progress */}
              <motion.div custom={3} initial="hidden" animate="visible" variants={FADE_UP}>
                <SectionCard label="Status" heading="Task Progress">
                  <ProgressItem label="Completed" value={completedCount} max={myTasks.length || 1} color="#68D391" />
                  <ProgressItem label="In Progress" value={inProgressCount} max={myTasks.length || 1} color="#C8A96A" />
                  <ProgressItem label="Due This Week" value={dueThisWeek} max={myTasks.length || 1} color="#9A89FF" />
                  <ProgressItem label="Overdue" value={overdueCount} max={myTasks.length || 1} color="#FC8181" />
                </SectionCard>
              </motion.div>

              {/* Announcements mini */}
              {visibleAnnouncements.length > 0 && (
                <motion.div custom={4} initial="hidden" animate="visible" variants={FADE_UP}>
                  <SectionCard
                    label="Communications" heading="Announcements"
                    action="View all" actionHref="/portal/announcements"
                  >
                    {visibleAnnouncements.map((a) => (
                      <AnnouncementMini
                        key={a.id} title={a.title} postedBy={a.postedBy}
                        date={a.date} priority={a.priority}
                      />
                    ))}
                  </SectionCard>
                </motion.div>
              )}
            </div>
          </div>

          {/* Active Mandates full-width */}
          <motion.div custom={5} initial="hidden" animate="visible" variants={FADE_UP}>
            <SectionCard
              label="Projects" heading="Active Mandates"
              count={`${activeProjects.length} active`}
              action="View all" actionHref="/portal/projects"
            >
              {activeProjects.length === 0 ? (
                <p className="py-6 text-center font-sans text-[#A8B0C0]/50" style={{ fontSize: "14px" }}>
                  No active mandates.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                  {activeProjects.map((p) => (
                    <ProjectMiniRow
                      key={p.id}
                      projectName={p.projectName} lead={p.lead}
                      status={p.status} targetDeadline={p.targetDeadline}
                    />
                  ))}
                </div>
              )}
            </SectionCard>
          </motion.div>

          {/* Prototype notice */}
          <motion.div custom={6} initial="hidden" animate="visible" variants={FADE_UP}
            className="flex items-center gap-3 border border-[#A8B0C0]/8 rounded-sm px-4 py-3"
          >
            <AlertCircle size={13} className="text-[#A8B0C0]/30 shrink-0" strokeWidth={1.5} />
            <p className="font-sans text-[#A8B0C0]/30" style={{ fontSize: "12px" }}>
              Prototype Portal — mock data only. Not production-grade.
            </p>
          </motion.div>

        </div>
      </div>
    </>
  )
}
