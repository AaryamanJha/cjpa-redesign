import * as XLSX from "xlsx"
import { Contact } from "@/types/portal"

const HEADER_ALIASES: Record<keyof Omit<Contact, "id">, string[]> = {
  name:    ["name", "fullname", "contactname", "full name", "contact name", "contact"],
  email:   ["email", "emailaddress", "e-mail", "email address"],
  phone:   ["phone", "phonenumber", "mobile", "tel", "telephone", "phone number", "cell"],
  company: ["company", "organization", "org", "firm", "employer"],
  title:   ["title", "jobtitle", "position", "role", "job title"],
}

const FIRST_NAME_ALIASES = ["first name", "firstname", "given name"]
const LAST_NAME_ALIASES = ["last name", "lastname", "surname", "family name"]

// How many leading rows to scan for a real header before giving up. Handles
// exports (e.g. LinkedIn's "Connections.csv") that prepend a disclaimer/notes
// block before the actual column headers.
const MAX_HEADER_SCAN_ROWS = 20

interface ColumnMap {
  fields: Partial<Record<keyof Omit<Contact, "id">, number>>
  firstNameIdx?: number
  lastNameIdx?: number
}

function normalizeHeader(h: unknown): string {
  return String(h ?? "").trim().toLowerCase()
}

function detectColumnMap(headerRow: unknown[]): ColumnMap | null {
  const normalized = headerRow.map(normalizeHeader)
  const fields: Partial<Record<keyof Omit<Contact, "id">, number>> = {}

  for (const [field, aliases] of Object.entries(HEADER_ALIASES) as [keyof Omit<Contact, "id">, string[]][]) {
    const idx = normalized.findIndex((h) => aliases.includes(h))
    if (idx !== -1) fields[field] = idx
  }

  const firstNameIdx = normalized.findIndex((h) => FIRST_NAME_ALIASES.includes(h))
  const lastNameIdx = normalized.findIndex((h) => LAST_NAME_ALIASES.includes(h))

  const hasName = fields.name !== undefined || firstNameIdx !== -1 || lastNameIdx !== -1
  if (!hasName && fields.email === undefined) return null

  return {
    fields,
    ...(firstNameIdx !== -1 ? { firstNameIdx } : {}),
    ...(lastNameIdx !== -1 ? { lastNameIdx } : {}),
  }
}

function findHeaderRow(rows: unknown[][]): { map: ColumnMap; dataStart: number } | null {
  const limit = Math.min(rows.length, MAX_HEADER_SCAN_ROWS)
  for (let i = 0; i < limit; i++) {
    const map = detectColumnMap(rows[i])
    if (map) return { map, dataStart: i + 1 }
  }
  return null
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

  const found = findHeaderRow(rows)
  const columnMap = found?.map ?? null
  const dataRows = found ? rows.slice(found.dataStart) : rows
  const fallbackOrder: (keyof Omit<Contact, "id">)[] = ["name", "email", "phone", "company", "title"]

  const contacts: Omit<Contact, "id">[] = []
  let skippedRows = 0

  for (const row of dataRows) {
    const get = (field: keyof Omit<Contact, "id">): string => {
      const idx = columnMap ? columnMap.fields[field] : fallbackOrder.indexOf(field)
      if (idx === undefined || idx === -1 || idx >= row.length) return ""
      return String(row[idx] ?? "").trim()
    }

    let name = get("name")
    if (!name && columnMap && (columnMap.firstNameIdx !== undefined || columnMap.lastNameIdx !== undefined)) {
      const first = columnMap.firstNameIdx !== undefined ? String(row[columnMap.firstNameIdx] ?? "").trim() : ""
      const last = columnMap.lastNameIdx !== undefined ? String(row[columnMap.lastNameIdx] ?? "").trim() : ""
      name = [first, last].filter(Boolean).join(" ")
    }

    const contact = {
      name,
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
