"use client"

import { useState, useEffect, useCallback } from "react"
import { MeetingNote } from "@/types/portal"
import {
  fetchPortalCollection,
  seedPortalCollection,
  subscribePortalRecords,
  upsertPortalRecord,
  deletePortalRecord,
} from "@/lib/portalSync"
import { isSupabaseConfigured } from "@/lib/supabaseClient"

const NOTES_KEY = "cjpa_project_notes_v1"

function loadAll(): Record<string, MeetingNote[]> {
  try {
    const raw = typeof window !== "undefined" && localStorage.getItem(NOTES_KEY)
    if (raw) return JSON.parse(raw) as Record<string, MeetingNote[]>
  } catch {}
  return {}
}

function persistLocal(all: Record<string, MeetingNote[]>) {
  localStorage.setItem(NOTES_KEY, JSON.stringify(all))
}

function groupByProject(notes: MeetingNote[]): Record<string, MeetingNote[]> {
  const grouped: Record<string, MeetingNote[]> = {}
  for (const note of notes) {
    grouped[note.projectId] = [...(grouped[note.projectId] ?? []), note]
  }
  return grouped
}

function flatten(all: Record<string, MeetingNote[]>): MeetingNote[] {
  return Object.values(all).flat()
}

export function useProjectNotes(projectId: string) {
  const [all, setAll] = useState<Record<string, MeetingNote[]>>({})

  useEffect(() => {
    let mounted = true
    setAll(loadAll())

    async function refresh() {
      const remote = await fetchPortalCollection<MeetingNote>("project_notes")
      if (!remote || !mounted) return
      const grouped = groupByProject(remote)
      persistLocal(grouped)
      setAll(grouped)
    }

    async function hydrate() {
      if (!isSupabaseConfigured) return
      const remote = await seedPortalCollection("project_notes", flatten(loadAll()), { mergeMissing: true })
      if (!remote || !mounted) return
      const grouped = groupByProject(remote)
      persistLocal(grouped)
      setAll(grouped)
    }

    void hydrate()
    const unsubscribe = subscribePortalRecords((collection) => {
      if (collection === "project_notes") void refresh()
    })

    return () => {
      mounted = false
      unsubscribe()
    }
  }, [])

  const save = useCallback((next: Record<string, MeetingNote[]>) => {
    setAll(next)
    persistLocal(next)
  }, [])

  const notes = [...(all[projectId] ?? [])].sort((a, b) =>
    b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt)
  )

  function addNote(fields: Omit<MeetingNote, "id" | "projectId" | "createdAt">) {
    const note: MeetingNote = {
      ...fields,
      id: `note-${Date.now()}`,
      projectId,
      createdAt: new Date().toISOString(),
    }
    const current = all[projectId] ?? []
    save({ ...all, [projectId]: [...current, note] })
    void upsertPortalRecord("project_notes", note)
    return note
  }

  function updateNote(id: string, updates: Partial<MeetingNote>) {
    const current = all[projectId] ?? []
    const updated = current.map((n) => (n.id === id ? { ...n, ...updates } : n))
    save({ ...all, [projectId]: updated })
    const updatedNote = updated.find((n) => n.id === id)
    if (updatedNote) void upsertPortalRecord("project_notes", updatedNote)
  }

  function deleteNote(id: string) {
    const current = all[projectId] ?? []
    save({ ...all, [projectId]: current.filter((n) => n.id !== id) })
    void deletePortalRecord("project_notes", id)
  }

  return { notes, addNote, updateNote, deleteNote }
}
