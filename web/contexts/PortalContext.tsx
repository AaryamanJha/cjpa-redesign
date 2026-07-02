"use client"

// PROTOTYPE ONLY — mock CJPA ID auth. Supabase sync is for shared prototype data,
// not production-grade authorization. Replace with real auth/RLS before sensitive use.

import React, { createContext, useContext, useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { PortalUser, PortalRole, Task, TaskStatus, Project, Client, CalendarEvent, Announcement, Contact } from "@/types/portal"
import { portalUsers } from "@/data/portalUsers"
import { mockTasks } from "@/data/mockTasks"
import { mockProjects } from "@/data/mockProjects"
import { mockClients } from "@/data/mockClients"
import { mockCalendarEvents } from "@/data/mockCalendarEvents"
import { mockAnnouncements } from "@/data/mockAnnouncements"
import {
  PortalCollection,
  deletePortalRecord,
  fetchPortalCollection,
  seedPortalCollection,
  subscribePortalRecords,
  upsertPortalRecord,
} from "@/lib/portalSync"
import { isSupabaseConfigured } from "@/lib/supabaseClient"

const AUTH_KEY      = "cjpa_portal_user_id"
const CONTACTS_KEY  = "cjpa_contacts_v1"
const TEAM_KEY     = "cjpa_team_members_v4"
const TASKS_KEY    = "cjpa_tasks_v2"
const PROJECTS_KEY = "cjpa_projects_v5"
const CLIENTS_KEY  = "cjpa_clients_v5"
const CAL_KEY      = "cjpa_calendar_v2"
const ANN_KEY      = "cjpa_announcements_v1"

const COLLECTIONS = {
  team: "team_members",
  tasks: "tasks",
  projects: "projects",
  clients: "clients",
  announcements: "announcements",
  calendar: "calendar_events",
} as const satisfies Record<string, PortalCollection>

// ─── shared CalEvent type (used by context + calendar page) ───────────────────

export interface CalEvent {
  id: string
  title: string
  description?: string
  startTime: Date
  endTime: Date
  color: string
  category?: string
  location?: string
  attendees?: string[]
  isAllDay?: boolean
  recurrenceId?: string
  recurrenceLabel?: string
  visibility?: "team"
}

// ─── role permission map ──────────────────────────────────────────────────────

const ROLE_PERMISSIONS: Record<PortalRole, string[]> = {
  "CEO": ["all"],
  "Senior Advisor": [
    "view_all_projects", "assign_tasks", "manage_calendar", "view_clients",
    "add_group_meeting", "upload_deliverables", "review_project_progress", "manage_team",
  ],
  "Advisor": [
    "view_projects", "assign_tasks", "manage_own_calendar",
    "add_project_notes", "update_project_status", "view_relevant_clients",
  ],
  "Associate": [
    "view_assigned_projects", "update_tasks", "manage_own_calendar",
    "add_research_notes", "upload_working_files",
  ],
  "Analyst": [
    "view_assigned_projects", "update_tasks", "manage_own_calendar",
    "add_research_notes", "view_deadlines", "view_group_meetings",
  ],
  "Intern Analyst": [
    "view_assigned_tasks", "update_tasks", "manage_own_calendar",
    "add_research_notes", "view_deadlines",
  ],
}

// ─── localStorage helpers ─────────────────────────────────────────────────────

function loadTeam(): PortalUser[] {
  try {
    const raw = localStorage.getItem(TEAM_KEY)
    if (raw) {
      const stored = JSON.parse(raw) as PortalUser[]
      const storedIds = new Set(stored.map((member) => member.id))
      const missingSeedMembers = portalUsers.filter((member) => !storedIds.has(member.id))

      if (missingSeedMembers.length > 0) {
        const merged = [...stored, ...missingSeedMembers]
        localStorage.setItem(TEAM_KEY, JSON.stringify(merged))
        return merged
      }

      return stored
    }
  } catch {}
  const seed = [...portalUsers]
  localStorage.setItem(TEAM_KEY, JSON.stringify(seed))
  return seed
}

function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(TASKS_KEY)
    if (raw) return JSON.parse(raw) as Task[]
  } catch {}
  const seed = [...mockTasks]
  localStorage.setItem(TASKS_KEY, JSON.stringify(seed))
  return seed
}

function loadProjects(): Project[] {
  try {
    const raw = localStorage.getItem(PROJECTS_KEY)
    if (raw) return JSON.parse(raw) as Project[]
  } catch {}
  const seed = [...mockProjects]
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(seed))
  return seed
}

function loadClients(): Client[] {
  try {
    const raw = localStorage.getItem(CLIENTS_KEY)
    if (raw) return JSON.parse(raw) as Client[]
  } catch {}
  const seed = [...mockClients]
  localStorage.setItem(CLIENTS_KEY, JSON.stringify(seed))
  return seed
}

function loadContacts(): Contact[] {
  try {
    const raw = localStorage.getItem(CONTACTS_KEY)
    if (raw) return JSON.parse(raw) as Contact[]
  } catch {}
  return []
}

function loadAnnouncements(): Announcement[] {
  try {
    const raw = localStorage.getItem(ANN_KEY)
    if (raw) return JSON.parse(raw) as Announcement[]
  } catch {}
  const seed = [...mockAnnouncements]
  localStorage.setItem(ANN_KEY, JSON.stringify(seed))
  return seed
}

const CAT_COLOR: Record<string, string> = {
  "Client Call": "gold", "Meeting": "blue", "Deadline": "red",
  "Internal": "green", "Travel": "amber",
}

function seedEventToCalEvent(e: CalendarEvent): CalEvent {
  const [y, m, d] = e.date.split("-").map(Number)
  let sh = 9, sm = 0
  if (e.time) { const [h, mn] = e.time.split(":").map(Number); sh = h; sm = mn }
  let eh = sh + 1, em = sm
  if (e.endTime) { const [h, mn] = e.endTime.split(":").map(Number); eh = h; em = mn }
  return {
    id: e.id,
    title: e.title,
    description: e.notes ?? (e.project ? `Project: ${e.project}` : undefined),
    startTime: new Date(y, m - 1, d, e.isAllDay ? 0 : sh, e.isAllDay ? 0 : sm),
    endTime:   new Date(y, m - 1, d, e.isAllDay ? 23 : eh, e.isAllDay ? 59 : em),
    color:     CAT_COLOR[e.type] ?? "blue",
    category:  e.type,
    location:  e.location,
    attendees: e.participants,
    isAllDay:  e.isAllDay,
    visibility: "team",
  }
}

function loadCalEvents(): CalEvent[] {
  try {
    const raw = localStorage.getItem(CAL_KEY)
    if (raw) {
      return (JSON.parse(raw) as Record<string, unknown>[]).map((e) => ({
        ...e,
        startTime: new Date(e.startTime as string),
        endTime:   new Date(e.endTime as string),
      })) as CalEvent[]
    }
  } catch {}
  const seed = mockCalendarEvents.map(seedEventToCalEvent)
  localStorage.setItem(CAL_KEY, JSON.stringify(seed))
  return seed
}

function normalizeCalEvents(events: CalEvent[]): CalEvent[] {
  return events.map((event) => ({
    ...event,
    startTime: new Date(event.startTime),
    endTime: new Date(event.endTime),
  }))
}

function persistLocal<T>(key: string, value: T[]) {
  localStorage.setItem(key, JSON.stringify(value))
}

function syncRecord<T extends { id: string }>(collection: PortalCollection, record: T) {
  if (!isSupabaseConfigured) return
  void upsertPortalRecord(collection, record)
}

function removeRemoteRecord(collection: PortalCollection, id: string) {
  if (!isSupabaseConfigured) return
  void deletePortalRecord(collection, id)
}

// ─── context interface ────────────────────────────────────────────────────────

interface PortalContextValue {
  user:          PortalUser | null
  isLoading:     boolean
  teamMembers:   PortalUser[]
  isAdmin:       boolean
  tasks:         Task[]
  projects:      Project[]
  clients:       Client[]
  announcements: Announcement[]
  contacts:      Contact[]
  calendarEvents: CalEvent[]
  login:               (userId: string) => { success: boolean; error?: string }
  logout:              () => void
  hasPermission:       (permission: string) => boolean
  addTeamMember:       (data: { name: string; title: string; role: PortalRole; id: string; email?: string }) => { success: boolean; error?: string }
  removeTeamMember:    (id: string) => void
  updateTeamMember:    (id: string, updates: Partial<PortalUser>) => void
  addTask:             (task: Task) => void
  updateTask:          (id: string, updates: Partial<Task>) => void
  updateTaskStatus:    (id: string, status: TaskStatus) => void
  deleteTask:          (id: string) => void
  addProject:          (project: Project) => void
  updateProject:       (id: string, updates: Partial<Project>) => void
  deleteProject:       (id: string) => void
  addClient:           (client: Client) => void
  updateClient:        (id: string, updates: Partial<Client>) => void
  deleteClient:        (id: string) => void
  addAnnouncement:     (announcement: Announcement) => void
  updateAnnouncement:  (id: string, updates: Partial<Announcement>) => void
  deleteAnnouncement:  (id: string) => void
  addContact:          (contact: Contact) => void
  updateContact:       (id: string, updates: Partial<Contact>) => void
  deleteContact:       (id: string) => void
  addCalendarEvent:    (event: CalEvent) => void
  updateCalendarEvent: (id: string, updates: Partial<CalEvent>) => void
  deleteCalendarEvent: (id: string) => void
}

const PortalContext = createContext<PortalContextValue | null>(null)

// ─── provider ─────────────────────────────────────────────────────────────────

export function PortalProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [user,           setUser]          = useState<PortalUser | null>(null)
  const [isLoading,      setIsLoading]     = useState(true)
  const [teamMembers,    setTeamMembers]   = useState<PortalUser[]>([])
  const [tasks,          setTasks]         = useState<Task[]>([])
  const [projects,       setProjects]      = useState<Project[]>([])
  const [clients,        setClients]       = useState<Client[]>([])
  const [announcements,  setAnnouncements] = useState<Announcement[]>([])
  const [contacts,       setContacts]      = useState<Contact[]>([])
  const [calendarEvents, setCalendarEvents] = useState<CalEvent[]>([])

  useEffect(() => {
    let mounted = true

    const team = loadTeam()
    setTeamMembers(team)
    setTasks(loadTasks())
    setProjects(loadProjects())
    setClients(loadClients())
    setAnnouncements(loadAnnouncements())
    setCalendarEvents(loadCalEvents())

    const storedId = localStorage.getItem(AUTH_KEY)
    if (storedId) {
      const found = team.find((u) => u.id === storedId.toLowerCase().trim())
      if (found) setUser(found)
      else localStorage.removeItem(AUTH_KEY)
    }
    setIsLoading(false)

    async function refreshCollection(collection: PortalCollection) {
      if (!mounted) return

      if (collection === COLLECTIONS.team) {
        const remote = await fetchPortalCollection<PortalUser>(collection)
        if (!remote || !mounted) return
        persistLocal(TEAM_KEY, remote)
        setTeamMembers(remote)
        setUser((prev) => prev ? remote.find((member) => member.id === prev.id) ?? prev : prev)
      }

      if (collection === COLLECTIONS.tasks) {
        const remote = await fetchPortalCollection<Task>(collection)
        if (!remote || !mounted) return
        persistLocal(TASKS_KEY, remote)
        setTasks(remote)
      }

      if (collection === COLLECTIONS.projects) {
        const remote = await fetchPortalCollection<Project>(collection)
        if (!remote || !mounted) return
        persistLocal(PROJECTS_KEY, remote)
        setProjects(remote)
      }

      if (collection === COLLECTIONS.clients) {
        const remote = await fetchPortalCollection<Client>(collection)
        if (!remote || !mounted) return
        persistLocal(CLIENTS_KEY, remote)
        setClients(remote)
      }

      if (collection === COLLECTIONS.announcements) {
        const remote = await fetchPortalCollection<Announcement>(collection)
        if (!remote || !mounted) return
        persistLocal(ANN_KEY, remote)
        setAnnouncements(remote)
      }

      if (collection === COLLECTIONS.calendar) {
        const remote = await fetchPortalCollection<CalEvent>(collection)
        if (!remote || !mounted) return
        const normalized = normalizeCalEvents(remote)
        persistLocal(CAL_KEY, normalized)
        setCalendarEvents(normalized)
      }
    }

    async function hydrateFromSupabase() {
      if (!isSupabaseConfigured) return

      const [
        remoteTeam,
        remoteTasks,
        remoteProjects,
        remoteClients,
        remoteAnnouncements,
        remoteCalendar,
      ] = await Promise.all([
        seedPortalCollection(COLLECTIONS.team, loadTeam(), { mergeMissing: true }),
        seedPortalCollection(COLLECTIONS.tasks, loadTasks()),
        seedPortalCollection(COLLECTIONS.projects, loadProjects()),
        seedPortalCollection(COLLECTIONS.clients, loadClients()),
        seedPortalCollection(COLLECTIONS.announcements, loadAnnouncements()),
        seedPortalCollection(COLLECTIONS.calendar, loadCalEvents()),
      ])

      if (!mounted) return

      if (remoteTeam) {
        persistLocal(TEAM_KEY, remoteTeam)
        setTeamMembers(remoteTeam)
        const storedId = localStorage.getItem(AUTH_KEY)
        if (storedId) setUser(remoteTeam.find((u) => u.id === storedId.toLowerCase().trim()) ?? null)
      }
      if (remoteTasks) {
        persistLocal(TASKS_KEY, remoteTasks)
        setTasks(remoteTasks)
      }
      if (remoteProjects) {
        persistLocal(PROJECTS_KEY, remoteProjects)
        setProjects(remoteProjects)
      }
      if (remoteClients) {
        persistLocal(CLIENTS_KEY, remoteClients)
        setClients(remoteClients)
      }
      if (remoteAnnouncements) {
        persistLocal(ANN_KEY, remoteAnnouncements)
        setAnnouncements(remoteAnnouncements)
      }
      if (remoteCalendar) {
        const normalized = normalizeCalEvents(remoteCalendar)
        persistLocal(CAL_KEY, normalized)
        setCalendarEvents(normalized)
      }
    }

    void hydrateFromSupabase()
    const unsubscribe = subscribePortalRecords((collection) => {
      void refreshCollection(collection)
    })

    return () => {
      mounted = false
      unsubscribe()
    }
  }, [])

  // ── auth ──

  const login = useCallback((userId: string): { success: boolean; error?: string } => {
    const id = userId.toLowerCase().trim()
    const team = loadTeam()
    const found = team.find((u) => u.id === id)
    if (!found) return { success: false, error: "Invalid portal ID. Contact your administrator." }
    const freshTeam = loadTeam()
    const freshUser = freshTeam.find((u) => u.id === id) ?? found
    localStorage.setItem(AUTH_KEY, freshUser.id)
    setTeamMembers(freshTeam)
    setUser(freshUser)
    setTasks(loadTasks())
    setProjects(loadProjects())
    setClients(loadClients())
    setAnnouncements(loadAnnouncements())
    setContacts(loadContacts())
    setCalendarEvents(loadCalEvents())
    return { success: true }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_KEY)
    setUser(null)
    router.push("/login")
  }, [router])

  const hasPermission = useCallback(
    (permission: string) => {
      if (!user) return false
      return user.permissions.includes("all") || user.permissions.includes(permission)
    },
    [user]
  )

  // isAdmin: CEO (all permissions) or CEO-granted portal admin
  const isAdmin = !!(user && (user.permissions.includes("all") || user.isPortalAdmin))

  // ── team management ──

  const addTeamMember = useCallback(
    (data: { name: string; title: string; role: PortalRole; id: string; email?: string }): { success: boolean; error?: string } => {
      const id = data.id.toLowerCase().trim().replace(/[^a-z0-9]/g, "")
      const current = loadTeam()
      if (current.some((u) => u.id === id)) {
        return { success: false, error: "Portal ID already exists. Choose a different one." }
      }
      const newMember: PortalUser = {
        id, name: data.name.trim(), title: data.title.trim(),
        role: data.role, permissions: ROLE_PERMISSIONS[data.role],
        ...(data.email?.trim() ? { email: data.email.trim().toLowerCase() } : {}),
      }
      const updated = [...current, newMember]
      persistLocal(TEAM_KEY, updated)
      setTeamMembers(updated)
      syncRecord(COLLECTIONS.team, newMember)
      return { success: true }
    },
    []
  )

  const removeTeamMember = useCallback((id: string) => {
    const current = loadTeam()
    const updated = current.filter((u) => u.id !== id)
    persistLocal(TEAM_KEY, updated)
    setTeamMembers(updated)
    removeRemoteRecord(COLLECTIONS.team, id)
  }, [])

  const updateTeamMember = useCallback((id: string, updates: Partial<PortalUser>) => {
    const current = loadTeam()
    const updated = current.map((u) => u.id === id ? { ...u, ...updates } : u)
    const updatedMember = updated.find((u) => u.id === id)
    persistLocal(TEAM_KEY, updated)
    setTeamMembers(updated)
    if (updatedMember) syncRecord(COLLECTIONS.team, updatedMember)
    // Keep current user's own state in sync if they edited themselves
    setUser((prev) => prev?.id === id ? { ...prev, ...updates } : prev)
  }, [])

  // ── task management ──

  const addTask = useCallback((task: Task) => {
    const current = loadTasks()
    const updated = [task, ...current]
    persistLocal(TASKS_KEY, updated)
    setTasks(updated)
    syncRecord(COLLECTIONS.tasks, task)
  }, [])

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    const current = loadTasks()
    const updated = current.map((t) =>
      t.id === id ? { ...t, ...updates, lastUpdated: new Date().toISOString().split("T")[0] } : t
    )
    const updatedTask = updated.find((t) => t.id === id)
    persistLocal(TASKS_KEY, updated)
    setTasks(updated)
    if (updatedTask) syncRecord(COLLECTIONS.tasks, updatedTask)
  }, [])

  const updateTaskStatus = useCallback((id: string, status: TaskStatus) => {
    const current = loadTasks()
    const updated = current.map((t) =>
      t.id === id ? { ...t, status, lastUpdated: new Date().toISOString().split("T")[0] } : t
    )
    const updatedTask = updated.find((t) => t.id === id)
    persistLocal(TASKS_KEY, updated)
    setTasks(updated)
    if (updatedTask) syncRecord(COLLECTIONS.tasks, updatedTask)
  }, [])

  const deleteTask = useCallback((id: string) => {
    const updated = loadTasks().filter((t) => t.id !== id)
    persistLocal(TASKS_KEY, updated)
    setTasks(updated)
    removeRemoteRecord(COLLECTIONS.tasks, id)
  }, [])

  // ── project management ──

  const addProject = useCallback((project: Project) => {
    const current = loadProjects()
    const updated = [project, ...current]
    persistLocal(PROJECTS_KEY, updated)
    setProjects(updated)
    syncRecord(COLLECTIONS.projects, project)
  }, [])

  const updateProject = useCallback((id: string, updates: Partial<Project>) => {
    const current = loadProjects()
    const updated = current.map((p) => p.id === id ? { ...p, ...updates } : p)
    const updatedProject = updated.find((p) => p.id === id)
    persistLocal(PROJECTS_KEY, updated)
    setProjects(updated)
    if (updatedProject) syncRecord(COLLECTIONS.projects, updatedProject)
  }, [])

  const deleteProject = useCallback((id: string) => {
    const updated = loadProjects().filter((p) => p.id !== id)
    persistLocal(PROJECTS_KEY, updated)
    setProjects(updated)
    removeRemoteRecord(COLLECTIONS.projects, id)
  }, [])

  // ── client management ──

  const addClient = useCallback((client: Client) => {
    const current = loadClients()
    const updated = [...current, client]
    persistLocal(CLIENTS_KEY, updated)
    setClients(updated)
    syncRecord(COLLECTIONS.clients, client)
  }, [])

  const updateClient = useCallback((id: string, updates: Partial<Client>) => {
    const current = loadClients()
    const updated = current.map((c) => c.id === id ? { ...c, ...updates } : c)
    const updatedClient = updated.find((c) => c.id === id)
    persistLocal(CLIENTS_KEY, updated)
    setClients(updated)
    if (updatedClient) syncRecord(COLLECTIONS.clients, updatedClient)
  }, [])

  const deleteClient = useCallback((id: string) => {
    const updated = loadClients().filter((c) => c.id !== id)
    persistLocal(CLIENTS_KEY, updated)
    setClients(updated)
    removeRemoteRecord(COLLECTIONS.clients, id)
  }, [])

  const addAnnouncement = useCallback((announcement: Announcement) => {
    const current = loadAnnouncements()
    const updated = [announcement, ...current]
    persistLocal(ANN_KEY, updated)
    setAnnouncements(updated)
    syncRecord(COLLECTIONS.announcements, announcement)
  }, [])

  const updateAnnouncement = useCallback((id: string, updates: Partial<Announcement>) => {
    const current = loadAnnouncements()
    const updated = current.map((a) => a.id === id ? { ...a, ...updates } : a)
    const updatedAnnouncement = updated.find((a) => a.id === id)
    persistLocal(ANN_KEY, updated)
    setAnnouncements(updated)
    if (updatedAnnouncement) syncRecord(COLLECTIONS.announcements, updatedAnnouncement)
  }, [])

  const deleteAnnouncement = useCallback((id: string) => {
    const updated = loadAnnouncements().filter((a) => a.id !== id)
    persistLocal(ANN_KEY, updated)
    setAnnouncements(updated)
    removeRemoteRecord(COLLECTIONS.announcements, id)
  }, [])

  // ── contact management ──

  const addContact = useCallback((contact: Contact) => {
    const current = loadContacts()
    const updated = [...current, contact]
    persistLocal(CONTACTS_KEY, updated)
    setContacts(updated)
  }, [])

  const updateContact = useCallback((id: string, updates: Partial<Contact>) => {
    const current = loadContacts()
    const updated = current.map((c) => c.id === id ? { ...c, ...updates } : c)
    persistLocal(CONTACTS_KEY, updated)
    setContacts(updated)
  }, [])

  const deleteContact = useCallback((id: string) => {
    const updated = loadContacts().filter((c) => c.id !== id)
    persistLocal(CONTACTS_KEY, updated)
    setContacts(updated)
  }, [])

  // ── calendar management ──

  const addCalendarEvent = useCallback((event: CalEvent) => {
    const current = loadCalEvents()
    const updated = [...current, event]
    persistLocal(CAL_KEY, updated)
    setCalendarEvents(updated)
    syncRecord(COLLECTIONS.calendar, event)
  }, [])

  const updateCalendarEvent = useCallback((id: string, updates: Partial<CalEvent>) => {
    const current = loadCalEvents()
    const updated = current.map((e) => e.id === id ? { ...e, ...updates } : e)
    const normalized = normalizeCalEvents(updated)
    const updatedEvent = normalized.find((e) => e.id === id)
    persistLocal(CAL_KEY, normalized)
    setCalendarEvents(normalized)
    if (updatedEvent) syncRecord(COLLECTIONS.calendar, updatedEvent)
  }, [])

  const deleteCalendarEvent = useCallback((id: string) => {
    const current = loadCalEvents()
    const updated = current.filter((e) => e.id !== id)
    persistLocal(CAL_KEY, updated)
    setCalendarEvents(updated)
    removeRemoteRecord(COLLECTIONS.calendar, id)
  }, [])

  return (
    <PortalContext.Provider value={{
      user, isLoading, teamMembers, isAdmin, tasks, projects, clients, announcements, contacts, calendarEvents,
      login, logout, hasPermission,
      addTeamMember, removeTeamMember, updateTeamMember,
      addTask, updateTask, updateTaskStatus, deleteTask,
      addProject, updateProject, deleteProject,
      addClient, updateClient, deleteClient,
      addAnnouncement, updateAnnouncement, deleteAnnouncement,
      addContact, updateContact, deleteContact,
      addCalendarEvent, updateCalendarEvent, deleteCalendarEvent,
    }}>
      {children}
    </PortalContext.Provider>
  )
}

export function usePortal(): PortalContextValue {
  const ctx = useContext(PortalContext)
  if (!ctx) throw new Error("usePortal must be used inside PortalProvider")
  return ctx
}

export function useRequireAuth() {
  const { user, isLoading } = usePortal()
  const router = useRouter()
  useEffect(() => {
    if (!isLoading && !user) router.push("/login")
  }, [user, isLoading, router])
  return { user, isLoading }
}
