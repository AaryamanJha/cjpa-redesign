"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Topbar } from "@/components/portal/Topbar"
import { mockNewsletterDrafts } from "@/data/mockNewsletterDrafts"
import { NewsletterDraft, NewsletterStatus } from "@/types/portal"

const STATUS_STYLE: Record<NewsletterStatus, string> = {
  "Draft":      "bg-zinc-800/50 text-zinc-400 border border-zinc-700/25",
  "In Review":  "bg-blue-900/30 text-blue-300 border border-blue-700/25",
  "Approved":   "bg-emerald-900/30 text-emerald-300 border border-emerald-700/25",
  "Published":  "bg-[rgba(200,169,106,0.15)] text-[#C8A96A] border border-[rgba(200,169,106,0.25)]",
}

const STATUS_BAR: Record<NewsletterStatus, string> = {
  "Draft":      "#A8B0C0",
  "In Review":  "#63B3ED",
  "Approved":   "#68D391",
  "Published":  "#C8A96A",
}

function DraftPanel({ draft, onClose }: { draft: NewsletterDraft; onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-[#0D1520] border-l border-[rgba(200,169,106,0.14)] flex flex-col shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-[rgba(200,169,106,0.10)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] text-[#A8B0C0] tracking-widest uppercase mb-1.5">{draft.issue}</p>
              <h3 className="text-[18px] font-serif font-light text-[#F5F1E8] leading-snug">{draft.title}</h3>
              <div className="flex items-center gap-2 mt-2.5">
                <span className={cn("rounded-sm px-2 py-0.5 text-[10px] font-medium tracking-wide uppercase", STATUS_STYLE[draft.status])}>
                  {draft.status}
                </span>
              </div>
            </div>
            <button onClick={onClose} className="text-[#A8B0C0] hover:text-[#F5F1E8] transition-colors shrink-0">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <Section label="Cover Theme">
            <p className="text-[14px] text-[#F5F1E8]/80 leading-relaxed italic">&ldquo;{draft.coverTheme}&rdquo;</p>
          </Section>

          <div className="h-px bg-[rgba(200,169,106,0.10)]" />

          <div className="grid grid-cols-2 gap-y-4 text-[14px]">
            <StatRow label="Author"      value={draft.author} />
            <StatRow label="Last Edited" value={draft.lastEdited} />
            {draft.publishDate && <StatRow label="Publish Date" value={draft.publishDate} />}
            {draft.wordCount   && <StatRow label="Word Count"   value={`${draft.wordCount.toLocaleString()} words`} />}
          </div>

          <div className="h-px bg-[rgba(200,169,106,0.10)]" />

          <Section label="Sections">
            <ol className="space-y-2">
              {draft.sections.map((s, i) => (
                <li key={i} className="flex gap-3 text-[14px]">
                  <span className="text-[#C8A96A] font-mono text-[11px] tabular-nums mt-0.5 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-[#F5F1E8]/80 leading-snug">{s}</span>
                </li>
              ))}
            </ol>
          </Section>

          {draft.tags.length > 0 && (
            <>
              <div className="h-px bg-[rgba(200,169,106,0.10)]" />
              <Section label="Tags">
                <div className="flex flex-wrap gap-1.5">
                  {draft.tags.map((t) => (
                    <span key={t} className="rounded-sm px-2 py-0.5 text-[10px] text-[#A8B0C0] bg-[#101827] border border-[rgba(200,169,106,0.10)]">
                      {t}
                    </span>
                  ))}
                </div>
              </Section>
            </>
          )}
        </div>
      </div>
    </>
  )
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[11px] text-[#A8B0C0] tracking-widest uppercase mb-2">{label}</p>
      {children}
    </div>
  )
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] text-[#A8B0C0] tracking-wide uppercase mb-0.5">{label}</p>
      <p className="text-[14px] text-[#F5F1E8]/80">{value}</p>
    </div>
  )
}

export default function NewsletterPage() {
  const [selected, setSelected] = useState<NewsletterDraft | null>(null)
  const [filter, setFilter] = useState<"All" | NewsletterStatus>("All")

  const statuses: Array<"All" | NewsletterStatus> = ["All", "Draft", "In Review", "Approved", "Published"]
  const filtered = mockNewsletterDrafts.filter((d) => filter === "All" || d.status === filter)
  const sorted = [...filtered].sort((a, b) => {
    const order = { "In Review": 0, "Draft": 1, "Approved": 2, "Published": 3 }
    return (order[a.status] ?? 9) - (order[b.status] ?? 9)
  })

  return (
    <>
      <Topbar title="Newsletter" subtitle="CJPA Intelligence · editorial pipeline and issue tracker" />
      <div className="flex-1 overflow-y-auto p-7"><div className="max-w-4xl">

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2 mb-6">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={cn(
              "rounded-sm px-3.5 py-2 text-[13px] font-medium tracking-wide transition-colors",
              filter === s
                ? "bg-[#C8A96A] text-[#070B14]"
                : "bg-[#101827] text-[#A8B0C0] hover:text-[#F5F1E8] border border-[rgba(200,169,106,0.12)] hover:border-[rgba(200,169,106,0.25)]"
            )}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Draft list */}
      <div className="space-y-3">
        {sorted.map((draft) => (
          <button
            key={draft.id}
            onClick={() => setSelected(draft)}
            className="w-full text-left rounded-sm border border-[rgba(200,169,106,0.12)] bg-[#070B14] hover:bg-[#101827] hover:border-[rgba(200,169,106,0.22)] transition-all flex gap-0 overflow-hidden group"
          >
            {/* Status bar */}
            <div className="w-0.5 self-stretch shrink-0" style={{ backgroundColor: STATUS_BAR[draft.status] }} />

            <div className="flex-1 p-4 pl-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-[#A8B0C0] tracking-wide uppercase mb-1">{draft.issue}</p>
                  <h3 className="text-[16px] font-medium text-[#F5F1E8] leading-snug group-hover:text-white transition-colors">
                    {draft.title}
                  </h3>
                  <p className="text-[13px] text-[#A8B0C0]/70 mt-1.5 leading-snug line-clamp-2">{draft.coverTheme}</p>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className={cn("rounded-sm px-2 py-0.5 text-[10px] font-medium tracking-wide uppercase", STATUS_STYLE[draft.status])}>
                    {draft.status}
                  </span>
                  {draft.wordCount && (
                    <span className="text-[12px] text-[#A8B0C0]/50 font-mono tabular-nums">{draft.wordCount.toLocaleString()}w</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 mt-3 text-[12px] text-[#A8B0C0]/60">
                <span>{draft.author}</span>
                <span>·</span>
                <span>Edited {draft.lastEdited}</span>
                {draft.publishDate && (
                  <>
                    <span>·</span>
                    <span>Publishes {draft.publishDate}</span>
                  </>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      {selected && <DraftPanel draft={selected} onClose={() => setSelected(null)} />}
      </div></div>
    </>
  )
}
