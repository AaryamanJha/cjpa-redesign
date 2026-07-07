"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Plus, Search, Trash2 } from "lucide-react"
import { Topbar } from "@/components/portal/Topbar"
import { usePortal, useRequireAuth } from "@/contexts/PortalContext"
import { Contact } from "@/types/portal"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const COLUMNS: { key: keyof Contact; label: string; placeholder: string }[] = [
  { key: "name",    label: "Name",    placeholder: "Full name" },
  { key: "email",   label: "Email",   placeholder: "name@company.com" },
  { key: "phone",   label: "Phone",   placeholder: "+1 555 000 0000" },
  { key: "company", label: "Company", placeholder: "Company name" },
  { key: "title",   label: "Title",   placeholder: "Job title" },
]

export default function ContactBookPage() {
  const { isLoading } = useRequireAuth()
  const { contacts, addContact, updateContact, deleteContact } = usePortal()
  const [search, setSearch] = useState("")
  const [deleteTarget, setDeleteTarget] = useState<Contact | null>(null)
  const [rows, setRows] = useState<Contact[]>(contacts)
  const activeCellRef = useRef<string | null>(null) // `${contactId}:${field}`

  // Sync from shared context whenever the team's contacts change (another user
  // edited/added/deleted), but don't clobber the cell this user is mid-typing in.
  useEffect(() => {
    setRows((prev) => contacts.map((c) => {
      if (activeCellRef.current?.startsWith(`${c.id}:`)) {
        return prev.find((p) => p.id === c.id) ?? c
      }
      return c
    }))
  }, [contacts])

  const filtered = useMemo(() => {
    if (!search.trim()) return rows
    const q = search.toLowerCase()
    return rows.filter((c) =>
      [c.name, c.email, c.phone, c.company, c.title].some((v) => v?.toLowerCase().includes(q))
    )
  }, [rows, search])

  function handleCellChange(id: string, field: keyof Contact, value: string) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)))
  }

  function handleCellBlur(id: string, field: keyof Contact, value: string) {
    activeCellRef.current = null
    updateContact(id, { [field]: value } as Partial<Contact>)
  }

  function handleAddRow() {
    const newContact: Contact = {
      id: `contact-${Date.now()}`,
      name: "", email: "", phone: "", company: "", title: "",
    }
    setRows((prev) => [...prev, newContact])
    addContact(newContact)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>, rowIndex: number, colIndex: number) {
    if (e.key !== "Enter") return
    e.preventDefault()
    e.currentTarget.blur()
    const next = document.querySelector<HTMLInputElement>(`[data-cell="${rowIndex + 1}:${colIndex}"]`)
    next?.focus()
  }

  if (isLoading) return null

  return (
    <>
      <Topbar title="Contact Book" subtitle="Firm-wide contact directory — editable by everyone, synced live" />
      <div className="flex-1 flex flex-col min-h-0 p-7">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search size={14} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A8B0C0]/40" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search contacts…"
              className="w-full bg-[#101827] border border-[#C8A96A]/15 rounded-sm pl-9 pr-3 py-2 text-[13px] text-[#F5F1E8] placeholder:text-[#A8B0C0]/40 focus:outline-none focus:border-[#C8A96A]/40 font-sans"
            />
          </div>
          <button
            onClick={handleAddRow}
            className="flex items-center gap-1.5 rounded-sm px-3.5 py-2 font-sans font-medium transition-colors cursor-pointer hover:opacity-90"
            style={{ fontSize: "13px", background: "rgba(200,169,106,0.12)", color: "#C8A96A", border: "1px solid rgba(200,169,106,0.3)" }}
          >
            <Plus size={14} strokeWidth={2} /> Add Row
          </button>
          <span className="ml-auto font-sans text-[#A8B0C0]/50" style={{ fontSize: "12px" }}>
            {rows.length} {rows.length === 1 ? "contact" : "contacts"}
          </span>
        </div>

        <div className="flex-1 min-h-0 overflow-auto rounded-sm border border-[#C8A96A]/10">
          <table className="w-full border-collapse" style={{ fontSize: "13px" }}>
            <thead className="sticky top-0 bg-[#0D1526] z-10">
              <tr>
                <th
                  className="w-12 px-3 py-2.5 text-left font-sans font-medium text-[#A8B0C0]/60 border-b border-r border-[#C8A96A]/10"
                  style={{ fontSize: "11px", letterSpacing: "0.08em" }}
                >
                  #
                </th>
                {COLUMNS.map((col) => (
                  <th
                    key={col.key}
                    className="px-3 py-2.5 text-left font-sans font-medium text-[#A8B0C0]/60 border-b border-r border-[#C8A96A]/10 uppercase"
                    style={{ fontSize: "11px", letterSpacing: "0.08em" }}
                  >
                    {col.label}
                  </th>
                ))}
                <th className="w-10 px-2 py-2.5 border-b border-[#C8A96A]/10" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, rowIndex) => (
                <tr key={row.id} className="group hover:bg-[#F5F1E8]/[0.02]">
                  <td
                    className="px-3 py-1.5 text-[#A8B0C0]/40 border-b border-r border-[#C8A96A]/[0.06] font-sans"
                    style={{ fontSize: "12px" }}
                  >
                    {rowIndex + 1}
                  </td>
                  {COLUMNS.map((col, colIndex) => (
                    <td key={col.key} className="border-b border-r border-[#C8A96A]/[0.06] p-0">
                      <input
                        data-cell={`${rowIndex}:${colIndex}`}
                        value={(row[col.key] as string) ?? ""}
                        placeholder={col.placeholder}
                        onFocus={() => { activeCellRef.current = `${row.id}:${col.key}` }}
                        onChange={(e) => handleCellChange(row.id, col.key, e.target.value)}
                        onBlur={(e) => handleCellBlur(row.id, col.key, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
                        className={cn(
                          "w-full bg-transparent px-3 py-1.5 text-[#F5F1E8] font-sans focus:outline-none",
                          "focus:bg-[#C8A96A]/[0.06] focus:ring-1 focus:ring-inset focus:ring-[#C8A96A]/30"
                        )}
                      />
                    </td>
                  ))}
                  <td className="px-2 py-1.5 border-b border-[#C8A96A]/[0.06] text-center">
                    <button
                      onClick={() => setDeleteTarget(row)}
                      className="opacity-0 group-hover:opacity-100 text-[#A8B0C0]/40 hover:text-red-400 transition-all cursor-pointer"
                      aria-label="Delete contact"
                    >
                      <Trash2 size={13} strokeWidth={1.5} />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={COLUMNS.length + 2}
                    className="text-center py-14 text-[#A8B0C0]/40 font-sans"
                    style={{ fontSize: "13px" }}
                  >
                    {rows.length === 0 ? 'No contacts yet. Click "Add Row" to create one.' : "No results match your search."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Delete Contact?</DialogTitle></DialogHeader>
          <p className="text-[14px] text-[#A8B0C0] mt-1">
            Remove <span className="text-[#F5F1E8] font-medium">{deleteTarget?.name || "this contact"}</span> for
            everyone in the firm. This can&apos;t be undone.
          </p>
          <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-border">
            <Button variant="ghost" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={() => { if (deleteTarget) deleteContact(deleteTarget.id); setDeleteTarget(null) }}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
