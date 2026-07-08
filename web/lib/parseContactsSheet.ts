import * as XLSX from "xlsx"
import { Contact } from "@/types/portal"

const HEADER_ALIASES: Record<keyof Omit<Contact, "id">, string[]> = {
  name:    ["name", "fullname", "contactname", "full name", "contact name", "contact"],
  email:   ["email", "emailaddress", "e-mail", "email address"],
  phone:   ["phone", "phonenumber", "mobile", "tel", "telephone", "phone number", "cell"],
  company: ["company", "organization", "org", "firm", "employer"],
  title:   ["title", "jobtitle", "position", "role", "job title"],
}

function normalizeHeader(h: unknown): string {
  return String(h ?? "").trim().toLowerCase()
}

function detectColumnMap(headerRow: unknown[]): Partial<Record<keyof Omit<Contact, "id">, number>> | null {
  const normalized = headerRow.map(normalizeHeader)
  const map: Partial<Record<keyof Omit<Contact, "id">, number>> = {}

  for (const [field, aliases] of Object.entries(HEADER_ALIASES) as [keyof Omit<Contact, "id">, string[]][]) {
    const idx = normalized.findIndex((h) => aliases.includes(h))
    if (idx !== -1) map[field] = idx
  }

  // Require at least a name or email column recognized as a real header row,
  // otherwise treat the sheet as headerless (first row is already data).
  return (map.name !== undefined || map.email !== undefined) ? map : null
}

export interface ParsedContactsResult {
  contacts: Omit<Contact, "id">[]
  skippedRows: number
}

export async function parseContactsSheet(file: File): Promise<ParsedContactsResult> {
  const buffer = await file.arrayBuffer()
  const workbook = XLSX.read(buffer, { type: "array" })
  const firstSheetName = workbook.SheetNames[0]
  if (!firstSheetName) return { contacts: [], skippedRows: 0 }

  const sheet = workbook.Sheets[firstSheetName]
  const rows = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, defval: "" })
  if (rows.length === 0) return { contacts: [], skippedRows: 0 }

  const columnMap = detectColumnMap(rows[0])
  const dataRows = columnMap ? rows.slice(1) : rows
  const fallbackOrder: (keyof Omit<Contact, "id">)[] = ["name", "email", "phone", "company", "title"]

  const contacts: Omit<Contact, "id">[] = []
  let skippedRows = 0

  for (const row of dataRows) {
    const get = (field: keyof Omit<Contact, "id">): string => {
      const idx = columnMap ? columnMap[field] : fallbackOrder.indexOf(field)
      if (idx === undefined || idx === -1 || idx >= row.length) return ""
      return String(row[idx] ?? "").trim()
    }

    const contact = {
      name: get("name"),
      email: get("email"),
      phone: get("phone"),
      company: get("company"),
      title: get("title"),
    }

    if (!contact.name && !contact.email) {
      skippedRows++
      continue
    }
    contacts.push(contact)
  }

  return { contacts, skippedRows }
}
