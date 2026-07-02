"use client"

import { useState, useEffect, useCallback } from "react"
import { MeetingNote } from "@/types/portal"

const NOTES_KEY = "cjpa_project_notes_v1"

function loadAll(): Record<string, MeetingNote[]> {
  try {
    const raw = typeof window !== "undefined" && localStorage.getItem(NOTES_KEY)
    if (raw) return JSON.parse(raw) as Record<string, MeetingNote[]>
  } catch {}
  return {}
}

export function useProjectNotes(projectId: string) {
  const [all, setAll] = useState<Record<string, MeetingNote[]>>({})

  useEffect(() => {
    setAll(loadAll())
  }, [projectId])

  const save = useCallback((next: Record<string, MeetingNote[]>) => {
    setAll(next)
    localStorage.setItem(NOTES_KEY, JSON.stringify(next))
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
    return note
  }

  function updateNote(id: string, updates: Partial<MeetingNote>) {
    const current = all[projectId] ?? []
    save({ ...all, [projectId]: current.map((n) => (n.id === id ? { ...n, ...updates } : n)) })
  }

  function deleteNote(id: string) {
    const current = all[projectId] ?? []
    save({ ...all, [projectId]: current.filter((n) => n.id !== id) })
  }

  return { notes, addNote, updateNote, deleteNote }
}
