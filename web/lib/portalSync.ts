import { supabaseBrowser } from "@/lib/supabaseClient"

export type PortalCollection =
  | "team_members"
  | "tasks"
  | "projects"
  | "clients"
  | "announcements"
  | "calendar_events"
  | "project_notes"

interface PortalRecordRow<T> {
  collection: PortalCollection
  record_id: string
  data: T
  updated_at?: string
}

export async function fetchPortalCollection<T>(collection: PortalCollection): Promise<T[] | null> {
  if (!supabaseBrowser) return null

  const { data, error } = await supabaseBrowser
    .from("portal_records")
    .select("data, updated_at")
    .eq("collection", collection)
    .order("updated_at", { ascending: true })

  if (error) {
    console.warn(`Supabase fetch failed for ${collection}:`, error.message)
    return null
  }

  return (data ?? []).map((row) => row.data as T)
}

export async function upsertPortalRecord<T extends { id: string }>(
  collection: PortalCollection,
  record: T
) {
  if (!supabaseBrowser) return

  const row: PortalRecordRow<T> = {
    collection,
    record_id: record.id,
    data: record,
  }

  const { error } = await supabaseBrowser
    .from("portal_records")
    .upsert(row, { onConflict: "collection,record_id" })

  if (error) console.warn(`Supabase upsert failed for ${collection}:`, error.message)
}

export async function deletePortalRecord(collection: PortalCollection, id: string) {
  if (!supabaseBrowser) return

  const { error } = await supabaseBrowser
    .from("portal_records")
    .delete()
    .eq("collection", collection)
    .eq("record_id", id)

  if (error) console.warn(`Supabase delete failed for ${collection}:`, error.message)
}

export async function seedPortalCollection<T extends { id: string }>(
  collection: PortalCollection,
  records: T[],
  options: { mergeMissing?: boolean } = {}
) {
  if (!supabaseBrowser) return null

  const existing = await fetchPortalCollection<T>(collection)
  if (existing === null) return null

  if (existing.length === 0) {
    await Promise.all(records.map((record) => upsertPortalRecord(collection, record)))
    return records
  }

  if (options.mergeMissing) {
    const existingIds = new Set(existing.map((record) => record.id))
    const missing = records.filter((record) => !existingIds.has(record.id))
    if (missing.length > 0) {
      await Promise.all(missing.map((record) => upsertPortalRecord(collection, record)))
      return [...existing, ...missing]
    }
  }

  return existing
}

export function subscribePortalRecords(onChange: (collection: PortalCollection) => void) {
  if (!supabaseBrowser) return () => {}

  const client = supabaseBrowser
  const channel = client
    .channel("cjpa-portal-records")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "portal_records" },
      (payload) => {
        const row = (payload.new ?? payload.old) as Partial<PortalRecordRow<unknown>>
        if (row.collection) onChange(row.collection)
      }
    )
    .subscribe()

  return () => {
    void client.removeChannel(channel)
  }
}
