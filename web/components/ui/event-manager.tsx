"use client"

import { useState, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Plus, Calendar, Clock, Grid3x3, List, Search, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { CalEvent } from "@/contexts/PortalContext"

export type { CalEvent }

export interface EventManagerProps {
  events?: CalEvent[]
  onEventCreate?: (event: CalEvent) => void
  onEventUpdate?: (id: string, updates: Partial<CalEvent>) => void
  onEventDelete?: (id: string) => void
  categories?: string[]
  defaultView?: "month" | "week" | "day" | "list"
  className?: string
}

type Recurrence = "none" | "daily" | "weekly" | "monthly"

interface EventDraft {
  title: string
  description: string
  startDate: string
  startTime: string
  endDate: string
  endTime: string
  isAllDay: boolean
  category: string
  color: string
  location: string
  recurrence: Recurrence
  recurrenceCount: number
  recurrenceEndDate: string
}

const CJPA_COLORS = [
  { name: "Gold", value: "gold", hex: "#C8A96A" },
  { name: "Blue", value: "blue", hex: "#63B3ED" },
  { name: "Green", value: "green", hex: "#68D391" },
  { name: "Amber", value: "amber", hex: "#F6AD55" },
  { name: "Red", value: "red", hex: "#FC8181" },
  { name: "Purple", value: "purple", hex: "#9A89FF" },
]

const CAT_COLOR: Record<string, string> = {
  "Client Call": "gold",
  "Meeting": "blue",
  "Deadline": "red",
  "Internal": "green",
  "Travel": "amber",
}

const RECURRENCE_LABEL: Record<Recurrence, string> = {
  none: "Does not repeat",
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
}

const MAX_RECURRENCES = 120

function getHex(colorValue: string) {
  return CJPA_COLORS.find((c) => c.value === colorValue)?.hex ?? "#C8A96A"
}

function pad(n: number) {
  return n.toString().padStart(2, "0")
}

function dateValue(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

function timeValue(d: Date) {
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0)
}

function endOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999)
}

function addDays(d: Date, days: number) {
  const next = new Date(d)
  next.setDate(next.getDate() + days)
  return next
}

function addMonths(d: Date, months: number) {
  const next = new Date(d)
  const targetDate = next.getDate()
  next.setMonth(next.getMonth() + months)
  if (next.getDate() !== targetDate) next.setDate(0)
  return next
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function intersectsRange(event: CalEvent, start: Date, end: Date) {
  return event.startTime <= end && event.endTime >= start
}

function eventSpansMultipleDays(event: CalEvent) {
  return !isSameDay(event.startTime, event.endTime)
}

function clampEventToWeek(event: CalEvent, weekStart: Date) {
  const weekEnd = endOfDay(addDays(weekStart, 6))
  if (!intersectsRange(event, startOfDay(weekStart), weekEnd)) return null
  const start = event.startTime < startOfDay(weekStart) ? startOfDay(weekStart) : event.startTime
  const end = event.endTime > weekEnd ? weekEnd : event.endTime
  return {
    event,
    startCol: start.getDay(),
    endCol: end.getDay(),
  }
}

function defaultDraft(categories: string[]): EventDraft {
  const start = new Date()
  start.setSeconds(0, 0)
  start.setMinutes(0)
  start.setHours(start.getHours() + 1)
  const end = new Date(start)
  end.setHours(start.getHours() + 1)

  return {
    title: "",
    description: "",
    startDate: dateValue(start),
    startTime: timeValue(start),
    endDate: dateValue(end),
    endTime: timeValue(end),
    isAllDay: false,
    category: categories[0],
    color: CAT_COLOR[categories[0]] ?? "gold",
    location: "",
    recurrence: "none",
    recurrenceCount: 10,
    recurrenceEndDate: dateValue(addDays(start, 30)),
  }
}

function combineDateTime(date: string, time: string, endOfDayMode = false) {
  const [year, month, day] = date.split("-").map(Number)
  const [hour, minute] = time.split(":").map(Number)
  return new Date(year, month - 1, day, endOfDayMode ? 23 : hour, endOfDayMode ? 59 : minute)
}

function buildEventFromDraft(draft: EventDraft): CalEvent {
  const startTime = draft.isAllDay
    ? combineDateTime(draft.startDate, "00:00")
    : combineDateTime(draft.startDate, draft.startTime)
  const endTime = draft.isAllDay
    ? combineDateTime(draft.endDate, "23:59", true)
    : combineDateTime(draft.endDate, draft.endTime)

  return {
    id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    title: draft.title.trim(),
    description: draft.description.trim() || undefined,
    startTime,
    endTime,
    color: draft.color,
    category: draft.category,
    location: draft.location.trim() || undefined,
    isAllDay: draft.isAllDay,
    visibility: "team",
  }
}

function buildOccurrences(base: CalEvent, recurrence: Recurrence, count: number, endDate: string): CalEvent[] {
  if (recurrence === "none") return [base]

  const recurrenceId = `series-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
  const until = endOfDay(combineDateTime(endDate, "23:59", true))
  const duration = base.endTime.getTime() - base.startTime.getTime()
  const occurrences: CalEvent[] = []

  for (let i = 0; i < Math.min(count, MAX_RECURRENCES); i++) {
    const start = recurrence === "daily"
      ? addDays(base.startTime, i)
      : recurrence === "weekly"
      ? addDays(base.startTime, i * 7)
      : addMonths(base.startTime, i)

    if (start > until) break

    occurrences.push({
      ...base,
      id: i === 0 ? base.id : `${base.id}-${i + 1}`,
      startTime: start,
      endTime: new Date(start.getTime() + duration),
      recurrenceId,
      recurrenceLabel: RECURRENCE_LABEL[recurrence],
    })
  }

  return occurrences
}

function formatTimeRange(event: CalEvent) {
  if (event.isAllDay) return "All day"
  const opts: Intl.DateTimeFormatOptions = { hour: "2-digit", minute: "2-digit" }
  return `${event.startTime.toLocaleTimeString("en-US", opts)} - ${event.endTime.toLocaleTimeString("en-US", opts)}`
}

function formatDateRange(event: CalEvent) {
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" }
  if (isSameDay(event.startTime, event.endTime)) {
    return event.startTime.toLocaleDateString("en-US", opts)
  }
  return `${event.startTime.toLocaleDateString("en-US", opts)} - ${event.endTime.toLocaleDateString("en-US", opts)}`
}

export function EventManager({
  events = [],
  onEventCreate,
  onEventDelete,
  categories = ["Meeting", "Client Call", "Deadline", "Internal", "Travel"],
  defaultView = "month",
  className,
}: EventManagerProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<"month" | "week" | "day" | "list">(defaultView)
  const [selectedEvent, setSelectedEvent] = useState<CalEvent | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [formErrors, setFormErrors] = useState<{ title?: string; range?: string; recurrence?: string }>({})
  const [draft, setDraft] = useState<EventDraft>(() => defaultDraft(categories))

  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        const searchable = `${e.title} ${e.description ?? ""} ${e.location ?? ""}`.toLowerCase()
        if (!searchable.includes(q)) return false
      }
      if (selectedCategories.length > 0 && e.category && !selectedCategories.includes(e.category)) return false
      return true
    })
  }, [events, searchQuery, selectedCategories])

  const handleCreateEvent = useCallback(() => {
    const errs: { title?: string; range?: string; recurrence?: string } = {}
    if (!draft.title.trim()) errs.title = "Event title is required"

    const event = buildEventFromDraft(draft)
    if (event.endTime <= event.startTime) errs.range = "End must be after start"
    if (draft.recurrence !== "none" && draft.recurrenceCount < 1) errs.recurrence = "Choose at least one occurrence"

    if (Object.keys(errs).length) {
      setFormErrors(errs)
      return
    }

    const occurrences = buildOccurrences(event, draft.recurrence, draft.recurrenceCount, draft.recurrenceEndDate)
    occurrences.forEach((occurrence) => onEventCreate?.(occurrence))
    setIsDialogOpen(false)
    setIsCreating(false)
    setFormErrors({})
    setDraft(defaultDraft(categories))
  }, [draft, categories, onEventCreate])

  const handleDeleteEvent = useCallback((id: string) => {
    onEventDelete?.(id)
    setIsDialogOpen(false)
    setSelectedEvent(null)
  }, [onEventDelete])

  const navigateDate = useCallback((direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const d = new Date(prev)
      if (view === "month") d.setMonth(prev.getMonth() + (direction === "next" ? 1 : -1))
      else if (view === "week") d.setDate(prev.getDate() + (direction === "next" ? 7 : -7))
      else d.setDate(prev.getDate() + (direction === "next" ? 1 : -1))
      return d
    })
  }, [view])

  const viewLabel = view === "month"
    ? currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : view === "week"
    ? `Week of ${currentDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
    : view === "day"
    ? currentDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })
    : "All Events"

  const sharedProps = { events: filteredEvents, onEventClick: (e: CalEvent) => { setSelectedEvent(e); setIsDialogOpen(true) } }
  const hasActiveFilters = selectedCategories.length > 0

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="font-serif text-foreground font-light" style={{ fontSize: "clamp(17px, 2vw, 22px)" }}>{viewLabel}</h2>
          <div className="flex items-center gap-1.5">
            <Button variant="outline" size="icon" onClick={() => navigateDate("prev")} className="h-7 w-7">
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())} className="h-7 text-xs">Today</Button>
            <Button variant="outline" size="icon" onClick={() => navigateDate("next")} className="h-7 w-7">
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-0.5 rounded-sm border border-border bg-background p-0.5">
            {([["month", Calendar], ["week", Grid3x3], ["day", Clock], ["list", List]] as const).map(([v, Icon]) => (
              <Button key={v} variant={view === v ? "secondary" : "ghost"} size="sm" onClick={() => setView(v)} className="h-7 px-2.5 gap-1.5 capitalize">
                <Icon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline text-xs">{v.charAt(0).toUpperCase() + v.slice(1)}</span>
              </Button>
            ))}
          </div>

          <Button size="sm" onClick={() => {
            setDraft(defaultDraft(categories))
            setFormErrors({})
            setIsCreating(true)
            setIsDialogOpen(true)
          }} className="h-8 gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            <span className="hidden sm:inline text-xs">Add Event</span>
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search events..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 h-9 text-sm" />
          {searchQuery && (
            <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2" onClick={() => setSearchQuery("")}>
              <X className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 gap-2">
              Category
              {selectedCategories.length > 0 && <Badge variant="secondary" className="h-4 px-1 text-[10px]">{selectedCategories.length}</Badge>}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuLabel>Filter</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {categories.map((cat) => (
              <DropdownMenuCheckboxItem key={cat} checked={selectedCategories.includes(cat)} onCheckedChange={(checked) => setSelectedCategories((prev) => checked ? [...prev, cat] : prev.filter((c) => c !== cat))}>
                {cat}
              </DropdownMenuCheckboxItem>
            ))}
            {hasActiveFilters && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked={false} onCheckedChange={() => setSelectedCategories([])}>
                  Clear filters
                </DropdownMenuCheckboxItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {view === "month" && <MonthView currentDate={currentDate} {...sharedProps} />}
      {view === "week" && <WeekView currentDate={currentDate} {...sharedProps} />}
      {view === "day" && <DayView currentDate={currentDate} {...sharedProps} />}
      {view === "list" && <ListView {...sharedProps} />}

      <Dialog open={isDialogOpen} onOpenChange={(v) => {
        if (!v) { setIsDialogOpen(false); setIsCreating(false); setSelectedEvent(null); setFormErrors({}) }
      }}>
        <DialogContent className="max-w-2xl max-h-[88vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isCreating ? "Add Event" : selectedEvent?.title}</DialogTitle>
            <DialogDescription>
              {isCreating ? "Firm-wide calendar events are visible to every portal member, including new members added later." : selectedEvent?.category}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-5">
            {isCreating ? (
              <>
                <div className="space-y-1.5">
                  <Label htmlFor="event-title">Title <span className="text-red-400">*</span></Label>
                  <Input
                    id="event-title"
                    value={draft.title}
                    onChange={(e) => { setDraft((p) => ({ ...p, title: e.target.value })); setFormErrors((f) => ({ ...f, title: undefined })) }}
                    placeholder="Client call, team review, travel window..."
                    className={formErrors.title ? "border-red-500/60" : ""}
                  />
                  {formErrors.title && <p className="text-[12px] text-red-400">{formErrors.title}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="event-description">Description</Label>
                  <Textarea id="event-description" value={draft.description} onChange={(e) => setDraft((p) => ({ ...p, description: e.target.value }))} placeholder="Details or agenda" rows={3} />
                </div>

                <label className="flex items-center gap-2 rounded-sm border border-border bg-background px-3 py-2 text-sm text-foreground">
                  <input
                    type="checkbox"
                    checked={draft.isAllDay}
                    onChange={(e) => setDraft((p) => ({ ...p, isAllDay: e.target.checked }))}
                    className="h-4 w-4 accent-[#C8A96A]"
                  />
                  All-day or multi-day event
                </label>

                <div className="grid gap-3 md:grid-cols-2">
                  <div className="rounded-sm border border-border bg-background p-3">
                    <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">Start</p>
                    <div className={cn("grid gap-3", !draft.isAllDay && "sm:grid-cols-[1fr_120px]")}>
                      <div className="space-y-1.5">
                        <Label htmlFor="start-date">Date</Label>
                        <Input id="start-date" type="date" value={draft.startDate} onChange={(e) => setDraft((p) => ({ ...p, startDate: e.target.value, endDate: p.endDate < e.target.value ? e.target.value : p.endDate }))} />
                      </div>
                      {!draft.isAllDay && (
                        <div className="space-y-1.5">
                          <Label htmlFor="start-time">Time</Label>
                          <Input id="start-time" type="time" value={draft.startTime} onChange={(e) => setDraft((p) => ({ ...p, startTime: e.target.value }))} />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="rounded-sm border border-border bg-background p-3">
                    <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">End</p>
                    <div className={cn("grid gap-3", !draft.isAllDay && "sm:grid-cols-[1fr_120px]")}>
                      <div className="space-y-1.5">
                        <Label htmlFor="end-date">Date</Label>
                        <Input id="end-date" type="date" value={draft.endDate} min={draft.startDate} onChange={(e) => setDraft((p) => ({ ...p, endDate: e.target.value }))} />
                      </div>
                      {!draft.isAllDay && (
                        <div className="space-y-1.5">
                          <Label htmlFor="end-time">Time</Label>
                          <Input id="end-time" type="time" value={draft.endTime} onChange={(e) => setDraft((p) => ({ ...p, endTime: e.target.value }))} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {formErrors.range && <p className="text-[12px] text-red-400">{formErrors.range}</p>}

                <div className="grid gap-3 md:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label>Category</Label>
                    <Select value={draft.category} onValueChange={(v) => setDraft((p) => ({ ...p, category: v, color: CAT_COLOR[v] ?? p.color }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Color</Label>
                    <Select value={draft.color} onValueChange={(v) => setDraft((p) => ({ ...p, color: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {CJPA_COLORS.map((c) => (
                          <SelectItem key={c.value} value={c.value}>
                            <div className="flex items-center gap-2">
                              <div className="h-3 w-3 rounded-full" style={{ background: c.hex }} />
                              {c.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-[1fr_180px_160px]">
                  <div className="space-y-1.5">
                    <Label htmlFor="event-location">Location</Label>
                    <Input id="event-location" value={draft.location} onChange={(e) => setDraft((p) => ({ ...p, location: e.target.value }))} placeholder="Office, Zoom, client site" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Recurring</Label>
                    <Select value={draft.recurrence} onValueChange={(v) => setDraft((p) => ({ ...p, recurrence: v as Recurrence }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {Object.entries(RECURRENCE_LABEL).map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  {draft.recurrence !== "none" && (
                    <div className="space-y-1.5">
                      <Label htmlFor="repeat-count">Occurrences</Label>
                      <Input id="repeat-count" type="number" min={1} max={MAX_RECURRENCES} value={draft.recurrenceCount} onChange={(e) => setDraft((p) => ({ ...p, recurrenceCount: Number(e.target.value) || 1 }))} />
                    </div>
                  )}
                </div>

                {draft.recurrence !== "none" && (
                  <div className="space-y-1.5">
                    <Label htmlFor="repeat-until">Repeat until</Label>
                    <Input id="repeat-until" type="date" value={draft.recurrenceEndDate} min={draft.startDate} onChange={(e) => setDraft((p) => ({ ...p, recurrenceEndDate: e.target.value }))} />
                    {formErrors.recurrence && <p className="text-[12px] text-red-400">{formErrors.recurrence}</p>}
                  </div>
                )}
              </>
            ) : selectedEvent ? (
              <EventDetails event={selectedEvent} />
            ) : null}
          </div>
          <DialogFooter>
            {!isCreating && selectedEvent && !selectedEvent.id.startsWith("task-deadline-") && (
              <Button variant="destructive" size="sm" onClick={() => handleDeleteEvent(selectedEvent.id)} className="mr-auto">Delete</Button>
            )}
            <Button variant="outline" size="sm" onClick={() => { setIsDialogOpen(false); setIsCreating(false); setSelectedEvent(null); setFormErrors({}) }}>Close</Button>
            {isCreating && <Button size="sm" onClick={handleCreateEvent}>Create</Button>}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function EventDetails({ event }: { event: CalEvent }) {
  return (
    <div className="space-y-4">
      {event.description && (
        <p className="font-sans text-muted-foreground text-sm leading-relaxed">{event.description}</p>
      )}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-muted-foreground uppercase text-[10px] tracking-wider mb-1">Dates</p>
          <p className="text-foreground">{formatDateRange(event)}</p>
        </div>
        <div>
          <p className="text-muted-foreground uppercase text-[10px] tracking-wider mb-1">Time</p>
          <p className="text-foreground">{formatTimeRange(event)}</p>
        </div>
      </div>
      {event.recurrenceLabel && (
        <div>
          <p className="text-muted-foreground uppercase text-[10px] tracking-wider mb-1">Repeats</p>
          <p className="text-foreground text-sm">{event.recurrenceLabel}</p>
        </div>
      )}
      {event.location && (
        <div>
          <p className="text-muted-foreground uppercase text-[10px] tracking-wider mb-1">Location</p>
          <p className="text-foreground text-sm">{event.location}</p>
        </div>
      )}
      {event.attendees && event.attendees.length > 0 && (
        <div>
          <p className="text-muted-foreground uppercase text-[10px] tracking-wider mb-2">Attendees</p>
          <div className="flex flex-wrap gap-1.5">
            {event.attendees.map((a) => (
              <Badge key={a} variant="outline" className="text-xs">{a}</Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function EventChip({ event, onClick, variant = "compact" }: { event: CalEvent; onClick: (e: CalEvent) => void; variant?: "compact" | "full" }) {
  const hex = getHex(event.color)

  if (variant === "full") {
    return (
      <button
        onClick={() => onClick(event)}
        className="w-full text-left rounded px-2.5 py-2 text-[13px] font-medium text-white cursor-pointer hover:opacity-90 transition-opacity"
        style={{ background: `${hex}cc` }}
      >
        <div className="font-medium truncate">{event.title}</div>
        <div className="opacity-85 mt-0.5">{formatDateRange(event)} · {formatTimeRange(event)}</div>
      </button>
    )
  }

  return (
    <button
      onClick={() => onClick(event)}
      className="w-full text-left rounded px-1.5 py-0.5 text-[11px] font-medium text-white truncate cursor-pointer hover:opacity-90 transition-opacity"
      style={{ background: `${hex}cc` }}
    >
      {event.title}
    </button>
  )
}

function MonthBar({ event, startCol, endCol, row, onClick }: { event: CalEvent; startCol: number; endCol: number; row: number; onClick: (e: CalEvent) => void }) {
  const hex = getHex(event.color)
  return (
    <button
      onClick={() => onClick(event)}
      className="pointer-events-auto mx-0.5 h-6 min-w-0 rounded-sm px-2 text-left text-[11px] font-medium text-white shadow-sm transition-opacity hover:opacity-90"
      style={{ background: `${hex}dd`, gridColumn: `${startCol + 1} / ${endCol + 2}`, gridRow: row + 1 }}
      title={`${event.title} (${formatDateRange(event)})`}
    >
      <span className="block truncate">{event.title}</span>
    </button>
  )
}

function MonthView({ currentDate, events, onEventClick }: { currentDate: Date; events: CalEvent[]; onEventClick: (e: CalEvent) => void }) {
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
  const start = new Date(firstDay)
  start.setDate(start.getDate() - start.getDay())

  const days: Date[] = []
  const cur = new Date(start)
  for (let i = 0; i < 42; i++) { days.push(new Date(cur)); cur.setDate(cur.getDate() + 1) }

  const weeks = Array.from({ length: 6 }, (_, i) => days.slice(i * 7, i * 7 + 7))
  const today = new Date()

  return (
    <Card className="overflow-hidden">
      <div className="grid grid-cols-7 border-b border-border">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="border-r border-border last:border-r-0 py-2 text-center text-[10px] font-medium text-muted-foreground uppercase tracking-wider">{d}</div>
        ))}
      </div>

      {weeks.map((week, weekIndex) => {
        const weekStart = startOfDay(week[0])
        const weekEnd = endOfDay(week[6])
        const weekEvents = events
          .filter((e) => intersectsRange(e, weekStart, weekEnd))
          .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
        const visibleBars = weekEvents.map((event) => clampEventToWeek(event, weekStart)).filter(Boolean).slice(0, 4) as { event: CalEvent; startCol: number; endCol: number }[]

        return (
          <div key={weekIndex} className="relative grid grid-cols-7 border-b border-border last:border-b-0">
            {week.map((day, i) => {
              const isCurrentMonth = day.getMonth() === currentDate.getMonth()
              const isToday = isSameDay(day, today)
              return (
                <div key={day.toISOString()} className={cn("min-h-[118px] border-r border-border last:border-r-0 p-1.5 pt-2", !isCurrentMonth && "opacity-35")}>
                  <div className={cn("mb-1 flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium", isToday && "bg-primary text-primary-foreground", !isToday && "text-foreground")}>
                    {day.getDate()}
                  </div>
                  {i === 6 && weekEvents.length > 4 && (
                    <p className="absolute right-2 bottom-1 text-[11px] text-muted-foreground">+{weekEvents.length - 4} more</p>
                  )}
                </div>
              )
            })}
            <div className="pointer-events-none absolute inset-x-0 top-10 grid grid-cols-7 gap-y-1 px-1" style={{ gridTemplateRows: "repeat(4, 24px)" }}>
              {visibleBars.map((bar, row) => (
                <MonthBar key={`${bar.event.id}-${weekIndex}`} {...bar} row={row} onClick={onEventClick} />
              ))}
            </div>
          </div>
        )
      })}
    </Card>
  )
}

function WeekMultiDayStrip({ weekDays, events, onEventClick }: { weekDays: Date[]; events: CalEvent[]; onEventClick: (e: CalEvent) => void }) {
  const weekStart = startOfDay(weekDays[0])
  const weekEnd = endOfDay(weekDays[6])
  const bars = events
    .filter((e) => eventSpansMultipleDays(e) || e.isAllDay)
    .map((event) => clampEventToWeek(event, weekStart))
    .filter(Boolean)
    .slice(0, 4) as { event: CalEvent; startCol: number; endCol: number }[]

  if (!bars.length) return null

  return (
    <div className="grid border-b border-border" style={{ gridTemplateColumns: "48px 1fr" }}>
      <div className="border-r border-border px-1.5 py-2 text-[10px] uppercase tracking-wider text-muted-foreground">All day</div>
      <div className="grid grid-cols-7 gap-y-1 p-1" style={{ gridTemplateRows: `repeat(${bars.length}, 24px)` }}>
        {bars.map((bar, row) => (
          <MonthBar key={bar.event.id} {...bar} row={row} onClick={onEventClick} />
        ))}
      </div>
    </div>
  )
}

function WeekView({ currentDate, events, onEventClick }: { currentDate: Date; events: CalEvent[]; onEventClick: (e: CalEvent) => void }) {
  const start = new Date(currentDate)
  start.setDate(currentDate.getDate() - currentDate.getDay())
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(start, i))
  const hours = Array.from({ length: 24 }, (_, i) => i)

  const eventsAt = (d: Date, h: number) => events.filter((e) => {
    if (eventSpansMultipleDays(e) || e.isAllDay) return false
    return isSameDay(e.startTime, d) && e.startTime.getHours() === h
  })

  return (
    <Card className="overflow-auto max-h-[640px]">
      <div className="grid border-b border-border" style={{ gridTemplateColumns: "48px repeat(7, 1fr)" }}>
        <div className="border-r border-border" />
        {weekDays.map((d) => (
          <div key={d.toISOString()} className="border-r border-border last:border-r-0 py-2 text-center">
            <p className="text-[11px] font-medium text-muted-foreground uppercase">{d.toLocaleDateString("en-US", { weekday: "short" })}</p>
            <p className={cn("text-sm font-medium mt-0.5", isSameDay(d, new Date()) ? "text-primary" : "text-foreground")}>{d.getDate()}</p>
          </div>
        ))}
      </div>
      <WeekMultiDayStrip weekDays={weekDays} events={events} onEventClick={onEventClick} />
      {hours.map((h) => (
        <div key={h} className="grid border-b border-border" style={{ gridTemplateColumns: "48px repeat(7, 1fr)" }}>
          <div className="border-r border-border px-1.5 py-1 text-[11px] text-muted-foreground">{pad(h)}:00</div>
          {weekDays.map((d) => {
            const hEvents = eventsAt(d, h)
            return (
              <div key={d.toISOString()} className="border-r border-border last:border-r-0 min-h-[44px] p-0.5 space-y-0.5">
                {hEvents.map((e) => <EventChip key={e.id} event={e} onClick={onEventClick} />)}
              </div>
            )
          })}
        </div>
      ))}
    </Card>
  )
}

function DayView({ currentDate, events, onEventClick }: { currentDate: Date; events: CalEvent[]; onEventClick: (e: CalEvent) => void }) {
  const hours = Array.from({ length: 24 }, (_, i) => i)
  const dayEvents = events.filter((e) => intersectsRange(e, startOfDay(currentDate), endOfDay(currentDate)))
  const allDay = dayEvents.filter((e) => eventSpansMultipleDays(e) || e.isAllDay)
  const timedAt = (h: number) => dayEvents.filter((e) => !eventSpansMultipleDays(e) && !e.isAllDay && e.startTime.getHours() === h)

  return (
    <Card className="overflow-auto max-h-[640px]">
      {allDay.length > 0 && (
        <div className="border-b border-border p-3">
          <p className="mb-2 text-[10px] uppercase tracking-wider text-muted-foreground">All-day and multi-day</p>
          <div className="space-y-1">
            {allDay.map((e) => <EventChip key={e.id} event={e} onClick={onEventClick} variant="full" />)}
          </div>
        </div>
      )}
      {hours.map((h) => {
        const hEvents = timedAt(h)
        return (
          <div key={h} className="flex border-b border-border last:border-b-0">
            <div className="w-14 shrink-0 border-r border-border px-2 py-2 text-[11px] text-muted-foreground">{pad(h)}:00</div>
            <div className="flex-1 min-h-[56px] p-1.5 space-y-1">
              {hEvents.map((e) => <EventChip key={e.id} event={e} onClick={onEventClick} variant="full" />)}
            </div>
          </div>
        )
      })}
    </Card>
  )
}

function ListView({ events, onEventClick }: { events: CalEvent[]; onEventClick: (e: CalEvent) => void }) {
  const sorted = [...events].sort((a, b) => a.startTime.getTime() - b.startTime.getTime())

  const grouped = sorted.reduce((acc, e) => {
    const key = e.startTime.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })
    if (!acc[key]) acc[key] = []
    acc[key].push(e)
    return acc
  }, {} as Record<string, CalEvent[]>)

  return (
    <Card className="p-5">
      {Object.keys(grouped).length === 0 ? (
        <p className="text-center text-muted-foreground py-10 text-sm">No events found.</p>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([date, dateEvents]) => (
            <div key={date}>
              <h3 className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider mb-3 pb-2 border-b border-border">{date}</h3>
              <div className="space-y-2">
                {dateEvents.map((e) => {
                  const hex = getHex(e.color)
                  return (
                    <button key={e.id} onClick={() => onEventClick(e)} className="w-full text-left flex items-start gap-3 p-3 rounded-sm bg-card border border-border hover:border-primary/30 transition-colors cursor-pointer group">
                      <div className="w-0.5 self-stretch rounded-full shrink-0 mt-0.5" style={{ background: hex, minHeight: "12px" }} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-sans font-medium text-foreground text-[14px] truncate">{e.title}</p>
                          {e.category && <Badge variant="outline" className="text-[10px] shrink-0">{e.category}</Badge>}
                        </div>
                        {e.description && <p className="text-[13px] text-muted-foreground mt-0.5 truncate">{e.description}</p>}
                        <div className="flex flex-wrap items-center gap-3 mt-1.5">
                          <div className="flex items-center gap-1 text-[12px] text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {formatDateRange(e)} · {formatTimeRange(e)}
                          </div>
                          {e.recurrenceLabel && <span className="text-[12px] text-muted-foreground">{e.recurrenceLabel}</span>}
                          {e.location && <span className="text-[12px] text-muted-foreground truncate">{e.location}</span>}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
