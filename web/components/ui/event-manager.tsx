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

const CJPA_COLORS = [
  { name: "Gold", value: "gold", hex: "#C8A96A", bg: "bg-[#C8A96A]" },
  { name: "Blue", value: "blue", hex: "#63B3ED", bg: "bg-[#63B3ED]" },
  { name: "Green", value: "green", hex: "#68D391", bg: "bg-[#68D391]" },
  { name: "Amber", value: "amber", hex: "#F6AD55", bg: "bg-[#F6AD55]" },
  { name: "Red", value: "red", hex: "#FC8181", bg: "bg-[#FC8181]" },
  { name: "Purple", value: "purple", hex: "#9A89FF", bg: "bg-[#9A89FF]" },
]

const CAT_COLOR: Record<string, string> = {
  "Client Call": "gold",
  "Meeting": "blue",
  "Deadline": "red",
  "Internal": "green",
  "Travel": "amber",
}

function getHex(colorValue: string) {
  return CJPA_COLORS.find((c) => c.value === colorValue)?.hex ?? "#C8A96A"
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
  const [formErrors, setFormErrors] = useState<{ title?: string; startTime?: string; endTime?: string }>({})
  const [newEvent, setNewEvent] = useState<Partial<CalEvent>>({
    title: "", description: "", color: "gold", category: categories[0],
  })

  function defaultStartTime(): Date {
    const d = new Date(); d.setSeconds(0, 0); d.setMinutes(0); d.setHours(d.getHours() + 1); return d
  }
  function defaultEndTime(start: Date): Date {
    const d = new Date(start); d.setHours(d.getHours() + 1); return d
  }
  function toDatetimeLocal(d: Date): string {
    const p = (n: number) => n.toString().padStart(2, "0")
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`
  }

  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        if (!e.title.toLowerCase().includes(q) && !e.description?.toLowerCase().includes(q)) return false
      }
      if (selectedCategories.length > 0 && e.category && !selectedCategories.includes(e.category)) return false
      return true
    })
  }, [events, searchQuery, selectedCategories])

  const hasActiveFilters = selectedCategories.length > 0

  const handleCreateEvent = useCallback(() => {
    const errs: { title?: string; startTime?: string; endTime?: string } = {}
    if (!newEvent.title?.trim()) errs.title = "Event title is required"
    if (!newEvent.startTime) errs.startTime = "Start time is required"
    if (!newEvent.endTime) errs.endTime = "End time is required"
    if (Object.keys(errs).length) { setFormErrors(errs); return }

    const event: CalEvent = {
      id: Math.random().toString(36).slice(2, 9),
      title: newEvent.title!.trim(),
      description: newEvent.description,
      startTime: newEvent.startTime!,
      endTime: newEvent.endTime!,
      color: newEvent.color || "gold",
      category: newEvent.category,
      location: newEvent.location,
    }
    onEventCreate?.(event)
    setIsDialogOpen(false)
    setIsCreating(false)
    setFormErrors({})
    setNewEvent({ title: "", description: "", color: "gold", category: categories[0] })
  }, [newEvent, categories, onEventCreate])

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

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
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

        <div className="flex items-center gap-2">
          {/* View switcher */}
          <div className="flex items-center gap-0.5 rounded-sm border border-border bg-background p-0.5">
            {([["month", Calendar], ["week", Grid3x3], ["day", Clock], ["list", List]] as const).map(([v, Icon]) => (
              <Button key={v} variant={view === v ? "secondary" : "ghost"} size="sm" onClick={() => setView(v)} className="h-7 px-2.5 gap-1.5 capitalize">
                <Icon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline text-xs">{v.charAt(0).toUpperCase() + v.slice(1)}</span>
              </Button>
            ))}
          </div>

          <Button size="sm" onClick={() => {
            const start = defaultStartTime()
            setNewEvent({ title: "", description: "", color: "gold", category: categories[0], startTime: start, endTime: defaultEndTime(start) })
            setFormErrors({})
            setIsCreating(true)
            setIsDialogOpen(true)
          }} className="h-8 gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            <span className="hidden sm:inline text-xs">Add Event</span>
          </Button>
        </div>
      </div>

      {/* Search + filter */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search events…" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 h-9 text-sm" />
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

      {/* Views */}
      {view === "month" && <MonthView currentDate={currentDate} {...sharedProps} />}
      {view === "week" && <WeekView currentDate={currentDate} {...sharedProps} />}
      {view === "day" && <DayView currentDate={currentDate} {...sharedProps} />}
      {view === "list" && <ListView {...sharedProps} />}

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(v) => {
        if (!v) { setIsDialogOpen(false); setIsCreating(false); setSelectedEvent(null); setFormErrors({}) }
      }}>
        <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isCreating ? "Add Event" : selectedEvent?.title}</DialogTitle>
            <DialogDescription>{isCreating ? "Schedule a new calendar event." : selectedEvent?.category}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {isCreating ? (
              <>
                <div className="space-y-1.5">
                  <Label>Title <span className="text-red-400">*</span></Label>
                  <Input
                    value={newEvent.title ?? ""}
                    onChange={(e) => { setNewEvent((p) => ({ ...p, title: e.target.value })); setFormErrors((f) => ({ ...f, title: undefined })) }}
                    placeholder="Event title"
                    className={formErrors.title ? "border-red-500/60" : ""}
                  />
                  {formErrors.title && <p className="text-[12px] text-red-400">{formErrors.title}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label>Description</Label>
                  <Textarea value={newEvent.description ?? ""} onChange={(e) => setNewEvent((p) => ({ ...p, description: e.target.value }))} placeholder="Details or agenda" rows={3} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Start <span className="text-red-400">*</span></Label>
                    <Input
                      type="datetime-local"
                      value={newEvent.startTime ? toDatetimeLocal(newEvent.startTime) : ""}
                      onChange={(e) => {
                        if (!e.target.value) return
                        const start = new Date(e.target.value)
                        setNewEvent((p) => ({ ...p, startTime: start }))
                        setFormErrors((f) => ({ ...f, startTime: undefined }))
                      }}
                      className={formErrors.startTime ? "border-red-500/60" : ""}
                    />
                    {formErrors.startTime && <p className="text-[12px] text-red-400">{formErrors.startTime}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label>End <span className="text-red-400">*</span></Label>
                    <Input
                      type="datetime-local"
                      value={newEvent.endTime ? toDatetimeLocal(newEvent.endTime) : ""}
                      onChange={(e) => {
                        if (!e.target.value) return
                        setNewEvent((p) => ({ ...p, endTime: new Date(e.target.value) }))
                        setFormErrors((f) => ({ ...f, endTime: undefined }))
                      }}
                      className={formErrors.endTime ? "border-red-500/60" : ""}
                    />
                    {formErrors.endTime && <p className="text-[12px] text-red-400">{formErrors.endTime}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Category</Label>
                    <Select value={newEvent.category} onValueChange={(v) => setNewEvent((p) => ({ ...p, category: v, color: CAT_COLOR[v] ?? "gold" }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Color</Label>
                    <Select value={newEvent.color} onValueChange={(v) => setNewEvent((p) => ({ ...p, color: v }))}>
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
                <div className="space-y-1.5">
                  <Label>Location</Label>
                  <Input value={newEvent.location ?? ""} onChange={(e) => setNewEvent((p) => ({ ...p, location: e.target.value }))} placeholder="Office, Zoom, etc." />
                </div>
              </>
            ) : selectedEvent ? (
              <div className="space-y-4">
                {selectedEvent.description && (
                  <p className="font-sans text-muted-foreground text-sm leading-relaxed">{selectedEvent.description}</p>
                )}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground uppercase text-[10px] tracking-wider mb-1">Start</p>
                    <p className="text-foreground">{selectedEvent.startTime.toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground uppercase text-[10px] tracking-wider mb-1">End</p>
                    <p className="text-foreground">{selectedEvent.endTime.toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                  </div>
                </div>
                {selectedEvent.location && (
                  <div>
                    <p className="text-muted-foreground uppercase text-[10px] tracking-wider mb-1">Location</p>
                    <p className="text-foreground text-sm">{selectedEvent.location}</p>
                  </div>
                )}
                {selectedEvent.attendees && selectedEvent.attendees.length > 0 && (
                  <div>
                    <p className="text-muted-foreground uppercase text-[10px] tracking-wider mb-2">Attendees</p>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedEvent.attendees.map((a) => (
                        <Badge key={a} variant="outline" className="text-xs">{a}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>
          <DialogFooter>
            {!isCreating && selectedEvent && (
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

// ─── EventChip ────────────────────────────────────────────────────────────────

function EventChip({ event, onClick, variant = "compact" }: { event: CalEvent; onClick: (e: CalEvent) => void; variant?: "compact" | "full" }) {
  const hex = getHex(event.color)
  const fmt = (d: Date) => d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })

  if (variant === "full") {
    return (
      <button
        onClick={() => onClick(event)}
        className="w-full text-left rounded px-2.5 py-2 text-[13px] font-medium text-white truncate cursor-pointer hover:opacity-90 transition-opacity"
        style={{ background: `${hex}cc` }}
      >
        <div className="font-medium truncate">{event.title}</div>
        <div className="opacity-80 mt-0.5">{fmt(event.startTime)} – {fmt(event.endTime)}</div>
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

// ─── Month View ───────────────────────────────────────────────────────────────

function MonthView({ currentDate, events, onEventClick }: { currentDate: Date; events: CalEvent[]; onEventClick: (e: CalEvent) => void }) {
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
  const start = new Date(firstDay)
  start.setDate(start.getDate() - start.getDay())

  const days: Date[] = []
  const cur = new Date(start)
  for (let i = 0; i < 42; i++) { days.push(new Date(cur)); cur.setDate(cur.getDate() + 1) }

  const eventsForDay = (d: Date) => events.filter((e) => {
    const ed = new Date(e.startTime)
    return ed.getDate() === d.getDate() && ed.getMonth() === d.getMonth() && ed.getFullYear() === d.getFullYear()
  })

  const today = new Date()

  return (
    <Card className="overflow-hidden">
      <div className="grid grid-cols-7 border-b border-border">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="border-r border-border last:border-r-0 py-2 text-center text-[10px] font-medium text-muted-foreground uppercase tracking-wider">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {days.map((day, i) => {
          const dayEvents = eventsForDay(day)
          const isCurrentMonth = day.getMonth() === currentDate.getMonth()
          const isToday = day.toDateString() === today.toDateString()

          return (
            <div key={i} className={cn("min-h-[90px] border-b border-r border-border last:border-r-0 p-1.5", !isCurrentMonth && "opacity-30")}>
              <div className={cn("mb-1 flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium", isToday && "bg-primary text-primary-foreground", !isToday && "text-foreground")}>
                {day.getDate()}
              </div>
              <div className="space-y-0.5">
                {dayEvents.slice(0, 3).map((e) => <EventChip key={e.id} event={e} onClick={onEventClick} />)}
                {dayEvents.length > 3 && <p className="text-[11px] text-muted-foreground pl-1">+{dayEvents.length - 3} more</p>}
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}

// ─── Week View ────────────────────────────────────────────────────────────────

function WeekView({ currentDate, events, onEventClick }: { currentDate: Date; events: CalEvent[]; onEventClick: (e: CalEvent) => void }) {
  const start = new Date(currentDate)
  start.setDate(currentDate.getDate() - currentDate.getDay())
  const weekDays = Array.from({ length: 7 }, (_, i) => { const d = new Date(start); d.setDate(start.getDate() + i); return d })
  const hours = Array.from({ length: 24 }, (_, i) => i)

  const eventsAt = (d: Date, h: number) => events.filter((e) => {
    const ed = new Date(e.startTime)
    return ed.getDate() === d.getDate() && ed.getMonth() === d.getMonth() && ed.getHours() === h
  })

  return (
    <Card className="overflow-auto max-h-[600px]">
      <div className="grid border-b border-border" style={{ gridTemplateColumns: "48px repeat(7, 1fr)" }}>
        <div className="border-r border-border" />
        {weekDays.map((d) => (
          <div key={d.toISOString()} className="border-r border-border last:border-r-0 py-2 text-center">
            <p className="text-[11px] font-medium text-muted-foreground uppercase">{d.toLocaleDateString("en-US", { weekday: "short" })}</p>
            <p className={cn("text-sm font-medium mt-0.5", d.toDateString() === new Date().toDateString() ? "text-primary" : "text-foreground")}>{d.getDate()}</p>
          </div>
        ))}
      </div>
      {hours.map((h) => (
        <div key={h} className="grid border-b border-border" style={{ gridTemplateColumns: "48px repeat(7, 1fr)" }}>
          <div className="border-r border-border px-1.5 py-1 text-[11px] text-muted-foreground">{h.toString().padStart(2, "0")}:00</div>
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

// ─── Day View ─────────────────────────────────────────────────────────────────

function DayView({ currentDate, events, onEventClick }: { currentDate: Date; events: CalEvent[]; onEventClick: (e: CalEvent) => void }) {
  const hours = Array.from({ length: 24 }, (_, i) => i)
  const eventsAt = (h: number) => events.filter((e) => {
    const ed = new Date(e.startTime)
    return ed.getDate() === currentDate.getDate() && ed.getMonth() === currentDate.getMonth() && ed.getFullYear() === currentDate.getFullYear() && ed.getHours() === h
  })

  return (
    <Card className="overflow-auto max-h-[600px]">
      {hours.map((h) => {
        const hEvents = eventsAt(h)
        return (
          <div key={h} className="flex border-b border-border last:border-b-0">
            <div className="w-14 shrink-0 border-r border-border px-2 py-2 text-[11px] text-muted-foreground">{h.toString().padStart(2, "0")}:00</div>
            <div className="flex-1 min-h-[56px] p-1.5 space-y-1">
              {hEvents.map((e) => <EventChip key={e.id} event={e} onClick={onEventClick} variant="full" />)}
            </div>
          </div>
        )
      })}
    </Card>
  )
}

// ─── List View ────────────────────────────────────────────────────────────────

function ListView({ events, onEventClick }: { events: CalEvent[]; onEventClick: (e: CalEvent) => void }) {
  const sorted = [...events].sort((a, b) => a.startTime.getTime() - b.startTime.getTime())

  const grouped = sorted.reduce((acc, e) => {
    const key = e.startTime.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })
    if (!acc[key]) acc[key] = []
    acc[key].push(e)
    return acc
  }, {} as Record<string, CalEvent[]>)

  const fmt = (d: Date) => d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })

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
                        <div className="flex items-center gap-3 mt-1.5">
                          <div className="flex items-center gap-1 text-[12px] text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {fmt(e.startTime)} – {fmt(e.endTime)}
                          </div>
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
