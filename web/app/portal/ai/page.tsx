"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { Upload, FileText, X, Loader2, Send, RotateCcw, ChevronDown, ChevronUp, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"
import { Topbar } from "@/components/portal/Topbar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

// ─── types ────────────────────────────────────────────────────────────────────

type Mode = "swot" | "summary" | "qa" | "chat"

interface ChatMessage {
  role: "user" | "assistant"
  content: string
  streaming?: boolean
}

const MODES: { id: Mode; label: string; description: string }[] = [
  { id: "swot",    label: "SWOT Analysis",    description: "Strengths, Weaknesses, Opportunities, Threats" },
  { id: "summary", label: "Executive Summary", description: "Key findings and strategic implications" },
  { id: "qa",      label: "Document Q&A",      description: "Ask questions about the document" },
  { id: "chat",    label: "GROQ Chat",         description: "Talk to the AI directly — no document needed" },
]

// ─── stream reader ────────────────────────────────────────────────────────────

async function readStream(response: Response, onChunk: (text: string) => void) {
  const reader = response.body?.getReader()
  if (!reader) return
  const decoder = new TextDecoder()
  let buffer = ""

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split("\n")
    buffer = lines.pop() ?? ""
    for (const line of lines) {
      if (!line.startsWith("data: ")) continue
      const data = line.slice(6).trim()
      if (data === "[DONE]") return
      try {
        const parsed = JSON.parse(data)
        const content = parsed.choices?.[0]?.delta?.content ?? ""
        if (content) onChunk(content)
      } catch {}
    }
  }
}

// ─── markdown renderer ────────────────────────────────────────────────────────

function renderMarkdown(text: string) {
  const lines = text.split("\n")
  const elements: React.ReactNode[] = []
  let listItems: string[] = []
  let key = 0

  function flushList() {
    if (!listItems.length) return
    elements.push(
      <ul key={key++} className="space-y-2 my-2 ml-1">
        {listItems.map((item, i) => (
          <li key={i} className="flex items-start gap-2.5 font-sans text-[#A8B0C0]" style={{ fontSize: "14px" }}>
            <span className="mt-[6px] w-1.5 h-1.5 rounded-full bg-[#C8A96A]/50 shrink-0" />
            <span className="leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    )
    listItems = []
  }

  for (const line of lines) {
    if (line.startsWith("## ")) {
      flushList()
      elements.push(
        <h3 key={key++} className="font-serif text-[#F5F1E8] font-light mt-5 mb-2 pb-1.5 border-b border-[#C8A96A]/12" style={{ fontSize: "17px" }}>
          {line.slice(3)}
        </h3>
      )
    } else if (line.startsWith("### ")) {
      flushList()
      elements.push(
        <h4 key={key++} className="font-sans text-[#F5F1E8]/80 font-medium mt-3 mb-1" style={{ fontSize: "14px" }}>
          {line.slice(4)}
        </h4>
      )
    } else if (line.startsWith("- ") || line.startsWith("* ") || line.match(/^\d+\. /)) {
      listItems.push(line.replace(/^[-*]\s+/, "").replace(/^\d+\.\s+/, ""))
    } else if (line.trim()) {
      flushList()
      elements.push(
        <p key={key++} className="font-sans text-[#A8B0C0] leading-[1.8]" style={{ fontSize: "14px" }}>
          {line}
        </p>
      )
    } else {
      flushList()
    }
  }

  flushList()
  return elements
}

// ─── chat message bubble ──────────────────────────────────────────────────────

function MessageBubble({ msg, isUser }: { msg: ChatMessage; isUser: boolean }) {
  return (
    <div className={cn("px-5 py-4", isUser ? "bg-[#0D1520]" : "bg-[#0A1018]")}>
      <p
        className="font-sans uppercase mb-2"
        style={{ fontSize: "10px", letterSpacing: "0.15em", color: isUser ? "#C8A96A" : "#A8B0C0" }}
      >
        {isUser ? "You" : "AI Analyst"}
      </p>
      {isUser ? (
        <p className="font-sans text-[#F5F1E8]/80 leading-relaxed" style={{ fontSize: "14px" }}>
          {msg.content}
        </p>
      ) : (
        <div className="space-y-1">
          {msg.content
            ? renderMarkdown(msg.content)
            : <Loader2 size={14} className="animate-spin text-[#A8B0C0]/40" />}
          {msg.streaming && msg.content && (
            <span className="inline-block w-1.5 h-4 bg-[#C8A96A]/40 animate-pulse ml-0.5 align-middle" />
          )}
        </div>
      )}
    </div>
  )
}

// ─── upload zone ──────────────────────────────────────────────────────────────

function UploadZone({ onFile }: { onFile: (file: File) => void }) {
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleDrop(e: React.DragEvent) {
    e.preventDefault(); setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file?.type === "application/pdf") onFile(file)
  }

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={e => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={cn(
        "border-2 border-dashed rounded-sm p-10 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all duration-300",
        dragging ? "border-[#C8A96A]/50 bg-[#C8A96A]/04" : "border-[#C8A96A]/15 hover:border-[#C8A96A]/30 hover:bg-[#C8A96A]/02"
      )}
    >
      <div className="w-12 h-12 rounded-full bg-[#C8A96A]/08 border border-[#C8A96A]/15 flex items-center justify-center">
        <Upload size={20} strokeWidth={1.5} className="text-[#C8A96A]/60" />
      </div>
      <div className="text-center">
        <p className="font-sans text-[#F5F1E8]/70 mb-1" style={{ fontSize: "14px" }}>
          Drop a PDF here or <span className="text-[#C8A96A]">browse</span>
        </p>
        <p className="font-sans text-[#A8B0C0]/40" style={{ fontSize: "12px" }}>PDF files only</p>
      </div>
      <input ref={inputRef} type="file" accept=".pdf" className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) onFile(f) }} />
    </div>
  )
}

// ─── main page ────────────────────────────────────────────────────────────────

export default function AIServicePage() {
  const [mode, setMode] = useState<Mode>("swot")

  // Document modes state
  const [file, setFile]               = useState<File | null>(null)
  const [documentText, setDocumentText] = useState("")
  const [pages, setPages]             = useState(0)
  const [isExtracting, setIsExtracting] = useState(false)
  const [extractError, setExtractError] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [output, setOutput]           = useState("")
  const [docMessages, setDocMessages] = useState<ChatMessage[]>([])
  const [question, setQuestion]       = useState("")
  const [showSource, setShowSource]   = useState(false)

  // Chat mode state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [chatInput, setChatInput]       = useState("")
  const [isChatting, setIsChatting]     = useState(false)

  const docChatEndRef  = useRef<HTMLDivElement>(null)
  const chatEndRef     = useRef<HTMLDivElement>(null)

  useEffect(() => { docChatEndRef.current?.scrollIntoView({ behavior: "smooth" }) }, [docMessages])
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }) }, [chatMessages])

  // ── PDF extraction ──

  const extractPDF = useCallback(async (f: File) => {
    setIsExtracting(true); setExtractError(""); setDocumentText(""); setOutput(""); setDocMessages([])
    const fd = new FormData(); fd.append("file", f)
    try {
      const res = await fetch("/api/ai/extract", { method: "POST", body: fd })
      const data = await res.json() as { text?: string; pages?: number; error?: string }
      if (data.error) { setExtractError(data.error); return }
      setDocumentText(data.text ?? ""); setPages(data.pages ?? 0)
    } catch { setExtractError("Network error — could not extract PDF text.") }
    finally { setIsExtracting(false) }
  }, [])

  function handleFile(f: File) { setFile(f); extractPDF(f) }

  function clearDocument() {
    setFile(null); setDocumentText(""); setPages(0)
    setOutput(""); setDocMessages([]); setExtractError("")
  }

  function switchMode(m: Mode) {
    setMode(m)
    setOutput("")
    setDocMessages([])
  }

  // ── SWOT / Summary ──

  async function runAnalysis() {
    if (!documentText || isAnalyzing) return
    setIsAnalyzing(true); setOutput("")
    try {
      const res = await fetch("/api/ai/analyze", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, documentText, messages: [] }),
      })
      if (!res.ok) { setOutput("Error calling AI service. Check your API key."); return }
      await readStream(res, chunk => setOutput(prev => prev + chunk))
    } finally { setIsAnalyzing(false) }
  }

  // ── Document Q&A ──

  async function sendQuestion() {
    const q = question.trim()
    if (!q || !documentText || isAnalyzing) return
    setQuestion("")
    const newMsgs: ChatMessage[] = [...docMessages, { role: "user", content: q }]
    setDocMessages([...newMsgs, { role: "assistant", content: "", streaming: true }])
    setIsAnalyzing(true)
    let acc = ""
    try {
      const res = await fetch("/api/ai/analyze", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "qa", documentText, messages: newMsgs }),
      })
      if (!res.ok) {
        setDocMessages(prev => prev.map((m, i) => i === prev.length - 1 ? { ...m, content: "Error calling AI service.", streaming: false } : m))
        return
      }
      await readStream(res, chunk => {
        acc += chunk
        setDocMessages(prev => prev.map((m, i) => i === prev.length - 1 ? { ...m, content: acc } : m))
      })
    } finally {
      setDocMessages(prev => prev.map((m, i) => i === prev.length - 1 ? { ...m, streaming: false } : m))
      setIsAnalyzing(false)
    }
  }

  // ── GROQ Chat ──

  async function sendChat() {
    const q = chatInput.trim()
    if (!q || isChatting) return
    setChatInput("")
    const newMsgs: ChatMessage[] = [...chatMessages, { role: "user", content: q }]
    setChatMessages([...newMsgs, { role: "assistant", content: "", streaming: true }])
    setIsChatting(true)
    let acc = ""
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMsgs }),
      })
      if (!res.ok) {
        setChatMessages(prev => prev.map((m, i) => i === prev.length - 1 ? { ...m, content: "Error calling AI service.", streaming: false } : m))
        return
      }
      await readStream(res, chunk => {
        acc += chunk
        setChatMessages(prev => prev.map((m, i) => i === prev.length - 1 ? { ...m, content: acc } : m))
      })
    } finally {
      setChatMessages(prev => prev.map((m, i) => i === prev.length - 1 ? { ...m, streaming: false } : m))
      setIsChatting(false)
    }
  }

  const docReady = !!documentText && !isExtracting

  return (
    <>
      <Topbar title="AI Service" subtitle="Document intelligence and direct chat powered by GROQ" />
      <div className="flex-1 overflow-y-auto p-7">
        <div className="max-w-3xl space-y-6">

          {/* Mode selector */}
          <div className="flex gap-2 flex-wrap">
            {MODES.map(m => (
              <button
                key={m.id}
                onClick={() => switchMode(m.id)}
                className={cn(
                  "rounded-sm px-4 py-2.5 font-sans font-medium transition-all cursor-pointer text-left",
                  mode === m.id
                    ? "bg-[#C8A96A]/12 text-[#C8A96A] border border-[#C8A96A]/30"
                    : "bg-[#101827] text-[#A8B0C0] border border-[rgba(200,169,106,0.10)] hover:border-[rgba(200,169,106,0.22)] hover:text-[#F5F1E8]"
                )}
              >
                <span style={{ fontSize: "13px" }}>{m.label}</span>
                <span className="block text-[11px] opacity-60 mt-0.5 font-normal">{m.description}</span>
              </button>
            ))}
          </div>

          {/* ── GROQ Chat (no document) ── */}
          {mode === "chat" && (
            <div className="space-y-4">
              <div className="border border-[rgba(200,169,106,0.10)] bg-[#0A1018] rounded-sm overflow-hidden">
                {chatMessages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-3 py-16 px-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-[#C8A96A]/08 border border-[#C8A96A]/15 flex items-center justify-center">
                      <MessageSquare size={18} strokeWidth={1.5} className="text-[#C8A96A]/60" />
                    </div>
                    <p className="font-sans text-[#A8B0C0]/50" style={{ fontSize: "13px" }}>
                      Start a conversation with GROQ — ask anything about geopolitics,<br />capital strategy, or get help drafting a document.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-[rgba(200,169,106,0.06)] max-h-[520px] overflow-y-auto">
                    {chatMessages.map((msg, i) => (
                      <MessageBubble key={i} msg={msg} isUser={msg.role === "user"} />
                    ))}
                    <div ref={chatEndRef} />
                  </div>
                )}
              </div>

              <div className="flex gap-2 items-end">
                <Textarea
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendChat() } }}
                  placeholder="Ask anything… (Enter to send, Shift+Enter for new line)"
                  rows={2}
                  className="flex-1 resize-none"
                  disabled={isChatting}
                />
                <div className="flex flex-col gap-1.5 shrink-0 self-end">
                  <Button onClick={sendChat} disabled={!chatInput.trim() || isChatting}>
                    {isChatting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                  </Button>
                  {chatMessages.length > 0 && (
                    <button
                      onClick={() => setChatMessages([])}
                      className="flex items-center justify-center gap-1 text-[#A8B0C0]/30 hover:text-[#A8B0C0]/60 transition-colors cursor-pointer font-sans px-2 py-1.5"
                      title="Clear chat"
                      style={{ fontSize: "11px" }}
                    >
                      <RotateCcw size={11} strokeWidth={1.5} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── Document modes (swot, summary, qa) ── */}
          {mode !== "chat" && (
            <>
              {/* Document input */}
              {!file ? (
                <UploadZone onFile={handleFile} />
              ) : (
                <div className="border border-[rgba(200,169,106,0.14)] rounded-sm bg-[#0D1520]">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-[rgba(200,169,106,0.08)]">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FileText size={15} strokeWidth={1.5} className="text-[#C8A96A]/60 shrink-0" />
                      <span className="font-sans text-[#F5F1E8] truncate" style={{ fontSize: "13px" }}>{file.name}</span>
                      {isExtracting && <Loader2 size={12} className="text-[#A8B0C0]/50 animate-spin shrink-0" />}
                      {docReady && <span className="text-emerald-400/70 font-sans shrink-0" style={{ fontSize: "11px" }}>✓ {pages > 0 ? `${pages}p` : ""} Ready</span>}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {docReady && (
                        <button
                          onClick={() => setShowSource(!showSource)}
                          className="flex items-center gap-1 text-[#A8B0C0]/40 hover:text-[#A8B0C0] transition-colors cursor-pointer font-sans"
                          style={{ fontSize: "11px" }}
                        >
                          {showSource ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                          {showSource ? "Hide" : "Preview"}
                        </button>
                      )}
                      <button onClick={clearDocument} className="text-[#A8B0C0]/40 hover:text-[#A8B0C0] transition-colors cursor-pointer p-1">
                        <X size={14} strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>
                  {showSource && docReady && (
                    <div className="px-4 py-3 border-b border-[rgba(200,169,106,0.06)] max-h-40 overflow-y-auto">
                      <p className="font-sans text-[#A8B0C0]/50 leading-relaxed whitespace-pre-wrap" style={{ fontSize: "12px" }}>
                        {documentText.slice(0, 2000)}{documentText.length > 2000 ? "…" : ""}
                      </p>
                    </div>
                  )}
                  {extractError && (
                    <div className="px-4 py-3 border-b border-red-700/20 bg-red-900/10">
                      <p className="font-sans text-red-400/80" style={{ fontSize: "12px" }}>{extractError}</p>
                    </div>
                  )}
                </div>
              )}

              {/* SWOT / Summary */}
              {(mode === "swot" || mode === "summary") && (
                <>
                  <div className="flex items-center gap-3">
                    <Button onClick={runAnalysis} disabled={!docReady || isAnalyzing} className="flex items-center gap-2">
                      {isAnalyzing
                        ? <><Loader2 size={14} className="animate-spin" /> Analyzing…</>
                        : `Run ${mode === "swot" ? "SWOT Analysis" : "Executive Summary"}`}
                    </Button>
                    {output && (
                      <button
                        onClick={() => setOutput("")}
                        className="flex items-center gap-1.5 text-[#A8B0C0]/40 hover:text-[#A8B0C0] transition-colors cursor-pointer font-sans"
                        style={{ fontSize: "12px" }}
                      >
                        <RotateCcw size={12} strokeWidth={1.5} /> Clear
                      </button>
                    )}
                  </div>
                  {(output || isAnalyzing) && (
                    <div className="border border-[rgba(200,169,106,0.12)] bg-[#0A1018] rounded-sm p-6">
                      {output
                        ? <div className="space-y-1">{renderMarkdown(output)}</div>
                        : <div className="flex items-center gap-2 text-[#A8B0C0]/40 font-sans" style={{ fontSize: "13px" }}><Loader2 size={14} className="animate-spin" /> Generating analysis…</div>
                      }
                    </div>
                  )}
                </>
              )}

              {/* Document Q&A */}
              {mode === "qa" && (
                <div className="space-y-4">
                  {docMessages.length > 0 && (
                    <div className="border border-[rgba(200,169,106,0.10)] bg-[#0A1018] rounded-sm divide-y divide-[rgba(200,169,106,0.06)] max-h-[520px] overflow-y-auto">
                      {docMessages.map((msg, i) => (
                        <MessageBubble key={i} msg={msg} isUser={msg.role === "user"} />
                      ))}
                      <div ref={docChatEndRef} />
                    </div>
                  )}
                  {!docReady && !file && (
                    <p className="text-[#A8B0C0]/40 font-sans" style={{ fontSize: "13px" }}>
                      Upload a document above to start a Q&amp;A session.
                    </p>
                  )}
                  {docReady && (
                    <div className="flex gap-2 items-end">
                      <Textarea
                        value={question}
                        onChange={e => setQuestion(e.target.value)}
                        onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendQuestion() } }}
                        placeholder="Ask anything about the document… (Enter to send)"
                        rows={2}
                        className="flex-1 resize-none"
                        disabled={isAnalyzing}
                      />
                      <Button onClick={sendQuestion} disabled={!question.trim() || isAnalyzing} className="shrink-0 self-end">
                        {isAnalyzing ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}
