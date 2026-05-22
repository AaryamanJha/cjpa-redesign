import { NextRequest } from "next/server"

export const runtime = "nodejs"

type Mode = "swot" | "summary" | "qa"

interface Message {
  role: "user" | "assistant"
  content: string
}

function buildSystemPrompt(mode: Mode, documentText: string): string {
  const docBlock = `\n\n---BEGIN DOCUMENT---\n${documentText.slice(0, 80000)}\n---END DOCUMENT---`

  if (mode === "swot") {
    return `You are a senior strategic analyst advising an institutional advisory firm. Analyze the document below and produce a rigorous SWOT analysis.${docBlock}

Respond using exactly these markdown headers with bullet points under each:
## Strengths
## Weaknesses
## Opportunities
## Threats

Be specific, analytical, and cite evidence from the document. Each section should have 4–7 substantive bullet points.`
  }

  if (mode === "summary") {
    return `You are a senior institutional analyst. Produce a professional executive summary of the document below.${docBlock}

Respond using exactly this structure:
## Executive Summary
(3–4 concise paragraph summary)

## Key Findings
(6–8 bullet points)

## Strategic Implications
(3–4 bullet points)

Write in the style of a top-tier advisory firm — precise, authoritative, and jargon-free.`
  }

  // qa
  return `You are an expert document analyst. The following document has been provided for analysis.${docBlock}

Answer the user's questions about this document accurately and concisely. Cite specific sections or quotes when relevant. If the answer cannot be found in the document, say so clearly.`
}

export async function POST(req: NextRequest) {
  const body = await req.json() as {
    mode: Mode
    documentText: string
    messages: Message[]
  }

  const { mode, documentText, messages } = body

  if (!documentText?.trim()) {
    return new Response("No document text provided", { status: 400 })
  }

  const systemPrompt = buildSystemPrompt(mode, documentText)

  const userMessages: Message[] = mode === "swot" || mode === "summary"
    ? [{ role: "user", content: "Please analyze the document now." }]
    : messages

  const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        ...userMessages,
      ],
      stream: true,
      max_tokens: 4096,
      temperature: 0.2,
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
