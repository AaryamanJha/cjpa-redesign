import { NextRequest } from "next/server"
import { pickRelevantContacts } from "@/lib/contactMatch"
import { Contact } from "@/types/portal"

export const runtime = "nodejs"

interface Message {
  role: "user" | "assistant"
  content: string
}

const MAX_CANDIDATES = 80

function buildSystemPrompt(query: string, contacts: Contact[]): string {
  const candidates = pickRelevantContacts(contacts, query, MAX_CANDIDATES)

  const directory = candidates
    .map((c, i) => {
      const parts = [c.name || "(no name)"]
      if (c.title) parts.push(c.title)
      if (c.company) parts.push(`at ${c.company}`)
      if (c.email) parts.push(`— ${c.email}`)
      return `${i + 1}. ${parts.join(" ")}`
    })
    .join("\n")

  return `You are CJPA Global Advisors' internal business-development assistant. The firm's shared Contact Book is listed below (name, title, company, email where known). A team member will describe an outreach goal — help them decide who on this list to contact and why.

Rules:
- Only recommend people who appear in the list below. Never invent a name, title, or company that isn't listed.
- Recommend 3–6 contacts, ranked by relevance.
- For each, give a one-line reason grounded in their listed title/company — not generic flattery.
- Include their email if it's listed, so the reason is actionable.
- If nothing in the list is a strong match, say so plainly and suggest what kind of contact would help instead of forcing weak recommendations.
- Format as a numbered markdown list: **Name** — reason. (email if known)

---BEGIN CONTACT BOOK (${candidates.length} of ${contacts.length} total contacts shown, pre-filtered for relevance)---
${directory || "(no contacts matched — Contact Book may be empty or unrelated to this query)"}
---END CONTACT BOOK---`
}

export async function POST(req: NextRequest) {
  const { query, contacts, messages } = await req.json() as {
    query: string
    contacts: Contact[]
    messages: Message[]
  }

  if (!query?.trim()) {
    return new Response("No query provided", { status: 400 })
  }
  if (!Array.isArray(contacts)) {
    return new Response("No contacts provided", { status: 400 })
  }

  const system = buildSystemPrompt(query, contacts)

  const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "system", content: system }, ...(messages ?? [])],
      stream: true,
      max_tokens: 1024,
      temperature: 0.4,
    }),
  })

  if (!groqRes.ok) {
    const err = await groqRes.text()
    return new Response(`GROQ error: ${err}`, { status: 502 })
  }

  return new Response(groqRes.body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}
