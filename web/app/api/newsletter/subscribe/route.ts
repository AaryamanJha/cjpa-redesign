import { NextRequest, NextResponse } from "next/server"

// Proxy to Mailchimp's post-json endpoint to avoid CORS
const MC_URL =
  "https://wixsite.us5.list-manage.com/subscribe/post-json" +
  "?u=fcd059de64a30442ebe7fecd3&id=a0e233bd98"

export async function POST(req: NextRequest) {
  const { email } = await req.json()

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ result: "error", msg: "Please enter a valid email address." }, { status: 400 })
  }

  try {
    const mcRes = await fetch(`${MC_URL}&EMAIL=${encodeURIComponent(email)}&c=c`, {
      method: "GET",
      headers: { "User-Agent": "CJPA-Portal/1.0" },
    })

    const raw = await mcRes.text()
    // Strip JSONP wrapper: c({...}) or ?({...})
    const json = raw.replace(/^[^(]*\(/, "").replace(/\)[^)]*$/, "")
    const data = JSON.parse(json) as { result: string; msg: string }
    return NextResponse.json(data)
  } catch {
    return NextResponse.json(
      { result: "error", msg: "Could not reach the subscription service. Try again shortly." },
      { status: 502 }
    )
  }
}
