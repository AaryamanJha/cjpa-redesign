"use client"

import { useMemo, useState } from "react"
import { EventManager } from "@/components/ui/event-manager"
import { Topbar } from "@/components/portal/Topbar"
import { usePortal, useRequireAuth, CalEvent } from "@/contexts/PortalContext"
import { cn } from "@/lib/utils"
import { Task } from "@/types/portal"

function taskToCalEvent(t: Task, getMemberName: (id: string) => string): CalEvent {
  const [y, m, d] = t.deadline.split("-").map(Number)
  const color = t.priority === "Urgent" ? "red" : t.priority === "High" ? "amber" : "gold"
  return {
    id:          `task-deadline-${t.id}`,
    title:       `Deadline: ${t.title}`,
    description: `${t.project} · Assigned to ${getMemberName(t.assignedTo)}`,
    startTime:   new Date(y, m - 1, d, 23, 0),
    endTime:     new Date(y, m - 1, d, 23, 59),
    color,
    category:    "Deadline",
  }
}

export default function CalendarPage() {
  const { user, isLoading } = useRequireAuth()
  const {
    tasks, calendarEvents, teamMembers,
    addCalendarEvent, updateCalendarEvent, deleteCalendarEvent,
  } = usePortal()

  const getMemberName = (id: string) =>
    teamMembers.find((m) => m.id === id)?.name ?? id

  const [myTasksOnly, setMyTasksOnly] = useState(false)

  // Task deadline events derived from the tasks list (not persisted separately)
  const taskDeadlineEvents = useMemo((): CalEvent[] =>
    tasks.filter((t) => t.deadline).map((t) => taskToCalEvent(t, getMemberName)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tasks, teamMembers]
  )

  // All events: shared calendar + task deadlines merged
  const allEvents = useMemo(
    () => [...calendarEvents, ...taskDeadlineEvents],
    [calendarEvents, taskDeadlineEvents]
  )

  // "My Tasks" mode: only task deadline events for current user
  const myTaskEvents = useMemo((): CalEvent[] => {
    if (!user) return []
    return tasks
      .filter((t) => t.deadline && (t.assignedTo === user.id || t.assignedBy === user.name))
      .map((t) => taskToCalEvent(t, getMemberName))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasks, user, teamMembers])

  const displayEvents = myTasksOnly ? myTaskEvents : allEvents

  function handleCreate(event: CalEvent) {
    setMyTasksOnly(false)
    addCalendarEvent(event)
  }

  function handleUpdate(id: string, updates: Partial<CalEvent>) {
    if (id.startsWith("task-deadline-")) return  // read-only derived events
    updateCalendarEvent(id, updates)
  }

  function handleDelete(id: string) {
    if (id.startsWith("task-deadline-")) return  // can't delete task deadlines from calendar
    deleteCalendarEvent(id)
  }

  if (isLoading) return null

  return (
    <>
      <Topbar title="Calendar" subtitle="Firm-wide schedule, deadlines, and client engagements" />
      <div className="flex-1 flex flex-col min-h-0 p-7">

        {/* Filter strip */}
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={() => setMyTasksOnly(false)}
            className={cn(
              "px-3.5 py-2 text-[13px] font-medium rounded-sm border transition-colors cursor-pointer",
              !myTasksOnly
                ? "bg-[#C8A96A]/12 border-[#C8A96A]/30 text-[#C8A96A]"
                : "border-border text-[#A8B0C0] hover:text-[#F5F1E8]"
            )}
          >
            All Events
          </button>
          <button
            onClick={() => setMyTasksOnly(true)}
            className={cn(
              "px-3.5 py-2 text-[13px] font-medium rounded-sm border transition-colors cursor-pointer",
              myTasksOnly
                ? "bg-[#C8A96A]/12 border-[#C8A96A]/30 text-[#C8A96A]"
                : "border-border text-[#A8B0C0] hover:text-[#F5F1E8]"
            )}
          >
            My Tasks
          </button>
          {myTasksOnly && (
            <span className="text-[13px] text-[#A8B0C0]/60 ml-1">
              Showing task deadlines assigned to you
            </span>
          )}
        </div>

        <EventManager
          events={displayEvents}
          categories={["Client Call", "Meeting", "Deadline", "Internal", "Travel"]}
          defaultView="month"
          onEventCreate={handleCreate}
          onEventUpdate={handleUpdate}
          onEventDelete={handleDelete}
        />
      </div>
    </>
  )
}
