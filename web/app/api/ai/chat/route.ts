import { NextRequest } from "next/server"

export const runtime = "nodejs"

interface Message {
  role: "user" | "assistant"
  content: string
}

const SYSTEM = `You are an expert institutional analyst and senior advisor at CJPA Global Advisors — a premier geopolitical intelligence and capital strategy advisory firm. Your areas of expertise include:

- Geopolitical risk analysis and sovereign affairs
- Cross-border capital strategy and investment frameworks
- International finance, development economics, and multilateral institutions
- Regulatory environments across emerging and developed markets
- Strategic advisory, political risk, and diplomatic engagement

You assist the CJPA internal team with analysis, research, drafting, and strategic thinking. Be concise, precise, and authoritative. Structure responses with headers or bullet points when it aids clarity. Write in the tone of a senior practitioner, not a generic AI assistant.`

export async function POST(req: NextRequest) {
  const { messages } = await req.json() as { messages: Message[] }

  if (!messages?.length) {
    return new Response("No messages provided", { status: 400 })
  }

  const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "system", content: SYSTEM }, ...messages],
      stream: true,
      max_tokens: 2048,
      temperature: 0.65,
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
