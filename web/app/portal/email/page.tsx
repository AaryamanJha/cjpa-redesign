"use client"

import { useEffect, useRef, useState } from "react"
import { signIn, useSession } from "next-auth/react"
import { Send, CheckCircle2, Info, ChevronDown, Sparkles, Loader2, Plug } from "lucide-react"
import { cn } from "@/lib/utils"
import { Topbar } from "@/components/portal/Topbar"
import { usePortal } from "@/contexts/PortalContext"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// ─── templates ────────────────────────────────────────────────────────────────

interface Template { label: string; subject: string; body: string }

function connectOutlook() {
  signIn("microsoft-entra-id", { callbackUrl: "/portal/email" })
}

const CLIENT_TEMPLATES: Record<string, Template> = {
  "meeting-followup": {
    label: "Meeting Follow-Up",
    subject: "Follow-Up: Our Meeting",
    body: "Dear [Contact Name],\n\nThank you for taking the time to meet with us. I wanted to follow up on the key points we discussed and confirm next steps.\n\n[Insert meeting summary and action items here]\n\nPlease do not hesitate to reach out if you have any questions or require any clarification.\n\nBest regards,\n[Your Name]\nCJPA Global Advisors",
  },
  "proposal": {
    label: "Proposal Delivery",
    subject: "CJPA Advisory Proposal",
    body: "Dear [Contact Name],\n\nThank you for the opportunity to submit a proposal for your consideration. Please find attached our advisory proposal outlining our recommended approach and engagement framework.\n\n[Insert brief proposal summary here]\n\nWe look forward to discussing this further at your convenience and remain available for any questions.\n\nBest regards,\n[Your Name]\nCJPA Global Advisors",
  },
  "status-update": {
    label: "Engagement Status Update",
    subject: "Engagement Update",
    body: "Dear [Contact Name],\n\nI wanted to provide you with a brief update on our ongoing engagement.\n\n[Insert current status, key developments, and any items requiring client input here]\n\nPlease let us know if you would like to schedule a call to discuss any of these points in greater detail.\n\nBest regards,\n[Your Name]\nCJPA Global Advisors",
  },
  "intel-brief": {
    label: "Intelligence Brief",
    subject: "CJPA Intelligence Brief",
    body: "Dear [Contact Name],\n\nPlease find enclosed our latest intelligence brief prepared specifically for your review.\n\n[Insert brief summary or key takeaways here]\n\nThis brief is strictly confidential and intended solely for the addressee. We are happy to arrange a call to walk through the findings.\n\nBest regards,\n[Your Name]\nCJPA Global Advisors",
  },
}

const NEWSLETTER_TEMPLATES: Record<string, Template> = {
  "monthly-intel": {
    label: "Monthly Intelligence Digest",
    subject: "CJPA Intelligence — Issue [Number]",
    body: "## CJPA Global Advisors Intelligence Digest\n\n**Issue [Number] · [Month Year]**\n\n---\n\n### From the Desk of the Principal\n\n[Opening remarks — 2–3 sentences from Carlton J. Porter]\n\n---\n\n### This Month in Focus\n\n**[Topic 1 Headline]**\n[2–3 paragraph analysis]\n\n**[Topic 2 Headline]**\n[2–3 paragraph analysis]\n\n---\n\n### Market Intelligence\n\n- [Bullet point 1]\n- [Bullet point 2]\n- [Bullet point 3]\n\n---\n\n### Upcoming Events\n\n[Event name, date, location]\n\n---\n\n*This newsletter is intended exclusively for CJPA clients and partners. Do not distribute without authorization.*",
  },
  "special-report": {
    label: "Special Report",
    subject: "CJPA Special Report: [Topic]",
    body: "## CJPA Special Report\n\n**[Report Title]**\n\n*Prepared by CJPA Global Advisors · [Date]*\n\n---\n\n### Executive Summary\n\n[2–3 sentence summary of the report]\n\n---\n\n### Background\n\n[Context and background — 2 paragraphs]\n\n### Key Findings\n\n1. [Finding 1]\n2. [Finding 2]\n3. [Finding 3]\n\n### Analysis\n\n[In-depth analysis — 3–4 paragraphs]\n\n### Implications\n\n[Strategic implications for clients — 1–2 paragraphs]\n\n---\n\n*CJPA Global Advisors · Confidential*",
  },
}

// ─── sse helper ───────────────────────────────────────────────────────────────

async function readStream(res: Response, onChunk: (t: string) => void) {
  const reader = res.body!.getReader()
  const dec = new TextDecoder()
  let buf = ""
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buf += dec.decode(value, { stream: true })
    const lines = buf.split("\n")
    buf = lines.pop() ?? ""
    for (const line of lines) {
      if (!line.startsWith("data: ")) continue
      const json = line.slice(6).trim()
      if (json === "[DONE]") return
      try {
        const delta = JSON.parse(json).choices?.[0]?.delta?.content
        if (delta) onChunk(delta)
      } catch {}
    }
  }
}

// ─── draft parser ─────────────────────────────────────────────────────────────

function parseDraft(raw: string): { subject: string; body: string } {
  const subjectMatch = raw.match(/^SUBJECT:\s*(.+)$/m)
  const subject = subjectMatch ? subjectMatch[1].trim() : ""
  const body = raw
    .replace(/^SUBJECT:\s*.+\n?/m, "")
    .replace(/^---\n?/m, "")
    .trim()
  return { subject, body }
}

// ─── sent toast ───────────────────────────────────────────────────────────────

function SentBanner({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2.5 border border-emerald-700/30 bg-emerald-900/15 rounded-sm px-4 py-3">
      <CheckCircle2 size={15} strokeWidth={1.5} className="text-emerald-400 shrink-0" />
      <p className="font-sans text-emerald-300/80" style={{ fontSize: "13px" }}>{label}</p>
    </div>
  )
}

// ─── placeholder API info ─────────────────────────────────────────────────────

function PlaceholderNote({ service }: { service: string }) {
  return (
    <div className="flex items-start gap-2.5 border border-[#C8A96A]/15 bg-[#C8A96A]/04 rounded-sm px-4 py-3 mt-2">
      <Info size={13} strokeWidth={1.5} className="text-[#C8A96A]/60 shrink-0 mt-0.5" />
      <p className="font-sans text-[#A8B0C0]/60" style={{ fontSize: "12px" }}>
        <span className="text-[#C8A96A]/70 font-medium">Prototype mode.</span>{" "}
        To enable real sending, add <code className="text-[#C8A96A]/60 bg-[#C8A96A]/08 px-1 rounded">{service}</code> to your{" "}
        <code className="text-[#C8A96A]/60 bg-[#C8A96A]/08 px-1 rounded">.env.local</code> file.
      </p>
    </div>
  )
}

// ─── To combobox ─────────────────────────────────────────────────────────────

interface Contact { label: string; sublabel: string; email: string; group: "Team" | "Clients" }

function ToCombobox({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const { teamMembers, clients } = usePortal()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState(value)
  const ref = useRef<HTMLDivElement>(null)

  const all: Contact[] = [
    ...teamMembers
      .filter((m) => m.email)
      .map((m) => ({ label: m.name, sublabel: m.title, email: m.email!, group: "Team" as const })),
    ...clients
      .filter((c) => c.contactEmail)
      .map((c) => ({ label: c.contactName || c.name, sublabel: c.name, email: c.contactEmail!, group: "Clients" as const })),
  ]

  const filtered = query.trim()
    ? all.filter(
        (c) =>
          c.label.toLowerCase().includes(query.toLowerCase()) ||
          c.email.toLowerCase().includes(query.toLowerCase()) ||
          c.sublabel.toLowerCase().includes(query.toLowerCase())
      )
    : all

  const byGroup = {
    Team: filtered.filter((c) => c.group === "Team"),
    Clients: filtered.filter((c) => c.group === "Clients"),
  }

  useEffect(() => {
    if (!open) return
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handle)
    return () => document.removeEventListener("mousedown", handle)
  }, [open])

  function select(email: string) {
    onChange(email)
    setQuery(email)
    setOpen(false)
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value)
    onChange(e.target.value)
    setOpen(true)
  }

  return (
    <div className="relative" ref={ref}>
      <input
        type="text"
        value={query}
        onChange={handleChange}
        onFocus={() => setOpen(true)}
        placeholder="Type an email address or search team / clients…"
        className="w-full rounded-sm border border-input bg-background px-3 py-2 font-sans text-[#F5F1E8] placeholder:text-[#A8B0C0]/35 focus:outline-none focus:ring-1 focus:ring-[#C8A96A]/30 focus:border-[#C8A96A]/40 transition-colors"
        style={{ fontSize: "14px" }}
        autoComplete="off"
      />

      {open && filtered.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-1 rounded-sm border border-[#C8A96A]/15 bg-[#0D1526] shadow-2xl z-50 max-h-60 overflow-y-auto">
          {(["Team", "Clients"] as const).map((group) => {
            const items = byGroup[group]
            if (!items.length) return null
            return (
              <div key={group}>
                <div className="px-3 py-1.5 font-sans uppercase tracking-widest text-[#A8B0C0]/40 border-b border-[rgba(200,169,106,0.06)]" style={{ fontSize: "10px" }}>
                  {group}
                </div>
                {items.map((c) => (
                  <button
                    key={c.email}
                    type="button"
                    onClick={() => select(c.email)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-[#101827] transition-colors"
                  >
                    <div className="w-6 h-6 rounded-sm bg-[#C8A96A]/08 border border-[#C8A96A]/15 flex items-center justify-center shrink-0">
                      <span className="font-sans text-[#C8A96A]/60 font-medium" style={{ fontSize: "10px" }}>
                        {c.label.charAt(0)}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-sans text-[#F5F1E8] truncate" style={{ fontSize: "13px" }}>{c.label}</p>
                      <p className="font-sans text-[#A8B0C0]/50 truncate" style={{ fontSize: "11px" }}>
                        {c.email} · {c.sublabel}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── compose tab ──────────────────────────────────────────────────────────────

const TONES = [
  { value: "professional", label: "Professional" },
  { value: "concise",      label: "Concise"      },
  { value: "formal",       label: "Formal"       },
  { value: "warm",         label: "Warm"         },
]

function ComposeTab() {
  const { clients, teamMembers } = usePortal()
  const { data: session } = useSession()
  const outlookConnected = !!session?.accessToken

  const [to, setTo]             = useState("")
  const [cc, setCc]             = useState("")
  const [subject, setSubject]   = useState("")
  const [body, setBody]         = useState("")
  const [template, setTemplate] = useState("")
  const [sending, setSending]   = useState(false)
  const [sent, setSent]         = useState(false)
  const [sendError, setSendError] = useState("")

  // AI compose
  const [aiPrompt, setAiPrompt]         = useState("")
  const [aiTone, setAiTone]             = useState("professional")
  const [aiDraft, setAiDraft]           = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [aiError, setAiError]           = useState("")

  function applyTemplate(key: string) {
    setTemplate(key)
    if (!key) return
    const tpl = CLIENT_TEMPLATES[key]
    setSubject(tpl.subject)
    setBody(tpl.body)
  }

  async function handleSend() {
    if (!subject.trim() || !body.trim()) return
    setSending(true)
    setSendError("")

    if (outlookConnected && to) {
      try {
        const res = await fetch("/api/email/graph-send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ to, cc: cc || undefined, subject, body }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || "Send failed")
        setSent(true)
        setTimeout(() => setSent(false), 4000)
      } catch (err) {
        setSendError(err instanceof Error ? err.message : "Failed to send email.")
      }
    } else {
      await new Promise(r => setTimeout(r, 1000))
      setSent(true)
      setTimeout(() => setSent(false), 4000)
    }

    setSending(false)
  }

  function recipientCtx() {
    const allContacts = [
      ...teamMembers.filter((m) => m.email).map((m) => ({ email: m.email!, name: m.name, org: "CJPA" })),
      ...clients.filter((c) => c.contactEmail).map((c) => ({ email: c.contactEmail!, name: c.contactName || c.name, org: c.name })),
    ]
    const match = allContacts.find((c) => c.email.toLowerCase() === to.toLowerCase())
    return match ? `${match.name} at ${match.org}` : to || "the recipient"
  }

  async function generateDraft() {
    if (!aiPrompt.trim() || isGenerating) return
    setAiDraft("")
    setAiError("")
    setIsGenerating(true)

    const userMsg = `Draft a professional client email for CJPA Global Advisors.\nTone: ${aiTone}\nRecipient: ${recipientCtx()}\n\nInstructions: ${aiPrompt}\n\nFormat your response exactly as:\nSUBJECT: [subject line here]\n\n---\n\n[email body here]\n\nSign off with "[Your Name]\\nCJPA Global Advisors"`

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [{ role: "user", content: userMsg }] }),
      })
      if (!res.ok) throw new Error("GROQ request failed")
      await readStream(res, chunk => setAiDraft(d => d + chunk))
    } catch {
      setAiError("Generation failed. Check your connection and try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  function useDraft() {
    const { subject: s, body: b } = parseDraft(aiDraft)
    if (s) setSubject(s)
    if (b) setBody(b)
  }

  return (
    <div className="grid lg:grid-cols-[1fr_360px] gap-7 items-start max-w-5xl">

      {/* ── Left: Email form ── */}
      <div className="space-y-5">
        {sent && (
          <SentBanner label={outlookConnected ? "Email sent via Outlook." : "Email sent (simulated)."} />
        )}
        {sendError && (
          <div className="flex items-center gap-2.5 border border-red-700/30 bg-red-900/15 rounded-sm px-4 py-3">
            <Info size={13} strokeWidth={1.5} className="text-red-400 shrink-0" />
            <p className="font-sans text-red-300/80" style={{ fontSize: "13px" }}>{sendError}</p>
          </div>
        )}
        {outlookConnected ? (
          <div className="flex items-center gap-2.5 border border-emerald-700/20 bg-emerald-900/10 rounded-sm px-4 py-3">
            <Plug size={13} strokeWidth={1.5} className="text-emerald-400 shrink-0" />
            <p className="font-sans text-emerald-300/70" style={{ fontSize: "12px" }}>
              <span className="text-emerald-400 font-medium">Outlook connected.</span>{" "}
              Emails send directly from your Microsoft account via Graph API.
            </p>
          </div>
        ) : (
          <div>
            <PlaceholderNote service="AZURE_AD_CLIENT_ID / AZURE_AD_CLIENT_SECRET / AUTH_SECRET" />
            <button
              type="button"
              onClick={connectOutlook}
              className="mt-3 inline-flex items-center gap-2 rounded-sm border border-[#C8A96A]/20 bg-[#101827] px-3 py-2 font-sans text-[#F5F1E8] transition-colors hover:border-[#C8A96A]/35 hover:bg-[#111d2e]"
              style={{ fontSize: "12px" }}
            >
              <Plug size={13} strokeWidth={1.5} />
              Connect Outlook
            </button>
          </div>
        )}

        {/* Template selector */}
        <div className="space-y-1.5">
          <Label>Start from a template (optional)</Label>
          <div className="flex flex-wrap gap-2">
            {Object.entries(CLIENT_TEMPLATES).map(([key, tpl]) => (
              <button
                key={key}
                onClick={() => applyTemplate(template === key ? "" : key)}
                className={cn(
                  "rounded-sm px-3 py-1.5 font-sans text-[12px] transition-colors cursor-pointer border",
                  template === key
                    ? "bg-[#C8A96A]/12 text-[#C8A96A] border-[#C8A96A]/30"
                    : "bg-[#101827] text-[#A8B0C0] border-[rgba(200,169,106,0.10)] hover:border-[rgba(200,169,106,0.22)] hover:text-[#F5F1E8]"
                )}
              >
                {tpl.label}
              </button>
            ))}
          </div>
        </div>

        <div className="h-px bg-[rgba(200,169,106,0.08)]" />

        {/* To */}
        <div className="space-y-1.5">
          <Label>To</Label>
          <ToCombobox value={to} onChange={setTo} />
        </div>

        {/* CC */}
        <div className="space-y-1.5">
          <Label>CC (optional)</Label>
          <Input placeholder="email@example.com, email2@example.com" value={cc} onChange={e => setCc(e.target.value)} />
        </div>

        {/* Subject */}
        <div className="space-y-1.5">
          <Label>Subject <span className="text-red-400">*</span></Label>
          <Input placeholder="Email subject line" value={subject} onChange={e => setSubject(e.target.value)} />
        </div>

        {/* Body */}
        <div className="space-y-1.5">
          <Label>Message <span className="text-red-400">*</span></Label>
          <Textarea
            value={body}
            onChange={e => setBody(e.target.value)}
            rows={14}
            placeholder="Compose your email…"
            className="font-sans resize-y"
            style={{ fontSize: "14px" }}
          />
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={handleSend} disabled={!subject.trim() || !body.trim() || sending} className="flex items-center gap-2">
            {sending ? <>Sending…</> : <><Send size={13} strokeWidth={1.5} /> Send Email</>}
          </Button>
          <button
            onClick={() => { setTo(""); setCc(""); setSubject(""); setBody(""); setTemplate(""); }}
            className="text-[#A8B0C0]/40 hover:text-[#A8B0C0] font-sans transition-colors cursor-pointer"
            style={{ fontSize: "12px" }}
          >
            Clear
          </button>
        </div>
      </div>

      {/* ── Right: AI Compose panel ── */}
      <div className="border border-[rgba(200,169,106,0.16)] rounded-sm bg-[#080E19] p-5 space-y-4 sticky top-6">
        {/* Header */}
        <div className="flex items-center gap-2 pb-1">
          <div className="w-6 h-6 rounded-sm bg-[#C8A96A]/10 border border-[#C8A96A]/20 flex items-center justify-center">
            <Sparkles size={11} strokeWidth={1.5} className="text-[#C8A96A]/80" />
          </div>
          <h3 className="font-sans font-semibold text-[#F5F1E8]" style={{ fontSize: "13px" }}>AI Compose</h3>
          <span className="ml-auto text-[10px] font-sans text-[#A8B0C0]/30 tracking-widest uppercase">GROQ</span>
        </div>

        <p className="text-[#A8B0C0]/50 font-sans leading-relaxed" style={{ fontSize: "12px" }}>
          Describe what you want to say and the AI will draft the email. Click <strong className="text-[#A8B0C0]/70">Use This Draft</strong> to populate the form.
        </p>

        {/* Tone selector */}
        <div className="space-y-2">
          <p className="font-sans text-[#A8B0C0]/60 font-medium uppercase tracking-widest" style={{ fontSize: "10px" }}>Tone</p>
          <div className="flex flex-wrap gap-1.5">
            {TONES.map(t => (
              <button
                key={t.value}
                onClick={() => setAiTone(t.value)}
                className={cn(
                  "rounded-sm px-2.5 py-1 font-sans text-[11px] transition-colors cursor-pointer border",
                  aiTone === t.value
                    ? "bg-[#C8A96A]/12 text-[#C8A96A] border-[#C8A96A]/30"
                    : "bg-[#0D1520] text-[#A8B0C0]/60 border-[rgba(200,169,106,0.10)] hover:text-[#A8B0C0] hover:border-[rgba(200,169,106,0.20)]"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Prompt input */}
        <div className="space-y-1.5">
          <Textarea
            value={aiPrompt}
            onChange={e => setAiPrompt(e.target.value)}
            rows={4}
            placeholder="e.g. Follow up on the Q2 proposal we sent last week. Mention we're available for a call and ask if they have any questions."
            className="font-sans resize-none bg-[#0D1520] border-[rgba(200,169,106,0.14)] text-[#F5F1E8] placeholder:text-[#A8B0C0]/30 focus:border-[#C8A96A]/30"
            style={{ fontSize: "12.5px" }}
            onKeyDown={e => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) generateDraft() }}
          />
          <p className="text-[11px] text-[#A8B0C0]/25 font-sans">⌘ Enter to generate</p>
        </div>

        <Button
          onClick={generateDraft}
          disabled={!aiPrompt.trim() || isGenerating}
          className="w-full flex items-center justify-center gap-2"
        >
          {isGenerating
            ? <><Loader2 size={13} className="animate-spin" strokeWidth={2} /> Generating…</>
            : <><Sparkles size={13} strokeWidth={1.5} /> Generate Draft</>
          }
        </Button>

        {/* Error */}
        {aiError && (
          <p className="text-[12px] text-red-400/80 font-sans">{aiError}</p>
        )}

        {/* Draft output */}
        {(aiDraft || isGenerating) && (
          <div className="space-y-2 pt-1">
            <div className="h-px bg-[rgba(200,169,106,0.08)]" />
            <p className="font-sans text-[#A8B0C0]/40 uppercase tracking-widest" style={{ fontSize: "10px" }}>Draft</p>
            <div className="rounded-sm border border-[rgba(200,169,106,0.10)] bg-[#0D1520] p-3.5 max-h-64 overflow-y-auto">
              {isGenerating && !aiDraft ? (
                <div className="flex items-center gap-2 text-[#A8B0C0]/30">
                  <Loader2 size={12} className="animate-spin" />
                  <span className="font-sans" style={{ fontSize: "12px" }}>Thinking…</span>
                </div>
              ) : (
                <pre className="font-sans text-[#A8B0C0]/80 whitespace-pre-wrap leading-relaxed" style={{ fontSize: "12px" }}>
                  {aiDraft}
                  {isGenerating && <span className="inline-block w-1.5 h-3.5 bg-[#C8A96A]/50 ml-0.5 animate-pulse align-middle" />}
                </pre>
              )}
            </div>

            {!isGenerating && aiDraft && (
              <button
                onClick={useDraft}
                className="w-full flex items-center justify-center gap-1.5 rounded-sm border border-[#C8A96A]/25 bg-[#C8A96A]/06 text-[#C8A96A]/80 hover:bg-[#C8A96A]/12 hover:text-[#C8A96A] transition-colors font-sans font-medium cursor-pointer py-2"
                style={{ fontSize: "12px" }}
              >
                Use This Draft →
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── newsletter campaign tab ──────────────────────────────────────────────────

function CampaignTab() {
  const [campaignName, setCampaignName] = useState("")
  const [subject, setSubject]           = useState("")
  const [previewText, setPreviewText]   = useState("")
  const [fromName, setFromName]         = useState("CJPA Global Advisors")
  const [audience, setAudience]         = useState("all")
  const [body, setBody]                 = useState("")
  const [template, setTemplate]         = useState("")
  const [sending, setSending]           = useState(false)
  const [sent, setSent]                 = useState(false)
  const [showMailchimpInfo, setShowMailchimpInfo] = useState(false)

  function applyTemplate(key: string) {
    setTemplate(key)
    if (!key) return
    const tpl = NEWSLETTER_TEMPLATES[key]
    setSubject(tpl.subject)
    setBody(tpl.body)
  }

  async function handleExport() {
    setSending(true)
    await new Promise(r => setTimeout(r, 1000))
    setSending(false)
    setSent(true)
    setTimeout(() => setSent(false), 4000)
  }

  return (
    <div className="space-y-5 max-w-2xl">
      {sent && <SentBanner label="Campaign exported to Mailchimp (simulated)." />}
      <PlaceholderNote service="MAILCHIMP_API_KEY + MAILCHIMP_LIST_ID" />

      {/* Template selector */}
      <div className="space-y-1.5">
        <Label>Start from a template (optional)</Label>
        <div className="flex flex-wrap gap-2">
          {Object.entries(NEWSLETTER_TEMPLATES).map(([key, tpl]) => (
            <button
              key={key}
              onClick={() => applyTemplate(template === key ? "" : key)}
              className={cn(
                "rounded-sm px-3 py-1.5 font-sans text-[12px] transition-colors cursor-pointer border",
                template === key
                  ? "bg-[#C8A96A]/12 text-[#C8A96A] border-[#C8A96A]/30"
                  : "bg-[#101827] text-[#A8B0C0] border-[rgba(200,169,106,0.10)] hover:border-[rgba(200,169,106,0.22)] hover:text-[#F5F1E8]"
              )}
            >
              {tpl.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-px bg-[rgba(200,169,106,0.08)]" />

      {/* Campaign metadata */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Campaign Name</Label>
          <Input placeholder="e.g. CJPA Intelligence — Issue 12" value={campaignName} onChange={e => setCampaignName(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label>From Name</Label>
          <Input value={fromName} onChange={e => setFromName(e.target.value)} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Subject Line <span className="text-red-400">*</span></Label>
        <Input placeholder="Email subject" value={subject} onChange={e => setSubject(e.target.value)} />
      </div>

      <div className="space-y-1.5">
        <Label>Preview Text</Label>
        <Input placeholder="Short preview shown in inbox…" value={previewText} onChange={e => setPreviewText(e.target.value)} />
      </div>

      {/* Audience */}
      <div className="space-y-1.5">
        <Label>Audience</Label>
        <Select value={audience} onValueChange={setAudience}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subscribers</SelectItem>
            <SelectItem value="active">Active Clients Only</SelectItem>
            <SelectItem value="retainer">Retainer Clients Only</SelectItem>
            <SelectItem value="custom">Custom Segment</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Body */}
      <div className="space-y-1.5">
        <Label>Email Body <span className="text-red-400">*</span></Label>
        <Textarea
          value={body}
          onChange={e => setBody(e.target.value)}
          rows={18}
          placeholder="Write your newsletter content…&#10;&#10;Tip: Use ## for section headers, - for bullet points."
          className="font-mono resize-y"
          style={{ fontSize: "13px" }}
        />
        <p className="text-[11px] text-[#A8B0C0]/30">Markdown-style formatting: ## Heading, - Bullet, **bold**</p>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <Button onClick={handleExport} disabled={!subject.trim() || !body.trim() || sending} className="flex items-center gap-2">
          {sending ? <>Exporting…</> : <>Export to Mailchimp</>}
        </Button>

        <button
          onClick={() => setShowMailchimpInfo(!showMailchimpInfo)}
          className="flex items-center gap-1.5 text-[#A8B0C0]/40 hover:text-[#A8B0C0] font-sans transition-colors cursor-pointer"
          style={{ fontSize: "12px" }}
        >
          <ChevronDown size={12} className={cn("transition-transform", showMailchimpInfo && "rotate-180")} />
          How to connect Mailchimp
        </button>
      </div>

      {showMailchimpInfo && (
        <div className="border border-[rgba(200,169,106,0.12)] bg-[#0A1018] rounded-sm p-5 space-y-2">
          <p className="font-sans text-[#F5F1E8]/70 font-medium" style={{ fontSize: "13px" }}>Connecting Mailchimp</p>
          <ol className="space-y-1.5">
            {[
              "Log in to Mailchimp and go to Account → Extras → API Keys",
              "Generate a new API key and copy it",
              "Find your Audience ID under Audience → Settings → Audience name and defaults",
              `Add to .env.local:\nMAILCHIMP_API_KEY=your_key\nMAILCHIMP_LIST_ID=your_audience_id`,
              "Restart the dev server — the Export button will call the Mailchimp Campaigns API",
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-2.5 font-sans text-[#A8B0C0]/60" style={{ fontSize: "13px" }}>
                <span className="text-[#C8A96A]/50 tabular-nums shrink-0 mt-0.5" style={{ fontSize: "11px" }}>{i + 1}.</span>
                <span className="whitespace-pre-line leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  )
}

// ─── main page ────────────────────────────────────────────────────────────────

export default function EmailPage() {
  const [tab, setTab] = useState<"compose" | "campaign">("compose")

  return (
    <>
      <Topbar title="Email" subtitle="Client correspondence and newsletter campaigns" />
      <div className="flex-1 overflow-y-auto p-7">

        {/* Tab switcher */}
        <div className="flex gap-1 mb-7 border-b border-[rgba(200,169,106,0.10)]">
          {([
            { id: "compose",  label: "Compose Email"      },
            { id: "campaign", label: "Newsletter Campaign" },
          ] as const).map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "px-5 py-3 font-sans font-medium transition-colors cursor-pointer border-b-2 -mb-px",
                tab === t.id
                  ? "text-[#C8A96A] border-[#C8A96A]"
                  : "text-[#A8B0C0] border-transparent hover:text-[#F5F1E8]"
              )}
              style={{ fontSize: "13px" }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "compose"  && <ComposeTab />}
        {tab === "campaign" && <CampaignTab />}
      </div>
    </>
  )
}
