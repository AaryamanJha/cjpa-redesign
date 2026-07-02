// Sends email via Microsoft Graph API using the signed-in user's access token.
import { NextRequest, NextResponse } from "next/server"

interface GraphSendBody {
  to: string
  cc?: string
  bcc?: string
  subject: string
  body: string
  bodyType?: "Text" | "HTML"
  accessToken?: string
}

function parseAddresses(list?: string) {
  return list
    ?.split(",")
    .map((a) => a.trim())
    .filter(Boolean)
    .map((address) => ({ emailAddress: { address } }))
}

export async function POST(req: NextRequest) {
  const { to, cc, bcc, subject, body, bodyType = "Text", accessToken }: GraphSendBody = await req.json()

  if (!accessToken) {
    return NextResponse.json(
      { error: "No Outlook session. Sign in with Microsoft to send real emails." },
      { status: 401 }
    )
  }

  if (!to || !subject || !body) {
    return NextResponse.json({ error: "Missing required fields: to, subject, body" }, { status: 400 })
  }

  const ccRecipients = parseAddresses(cc)
  const bccRecipients = parseAddresses(bcc)

  const message = {
    subject,
    body: { contentType: bodyType, content: body },
    toRecipients: [{ emailAddress: { address: to } }],
    ...(ccRecipients?.length ? { ccRecipients } : {}),
    ...(bccRecipients?.length ? { bccRecipients } : {}),
  }

  const res = await fetch("https://graph.microsoft.com/v1.0/me/sendMail", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message, saveToSentItems: true }),
  })

  if (!res.ok) {
    let errMsg = `Graph API error: ${res.status}`
    try {
      const data = await res.json()
      errMsg = data.error?.message || errMsg
    } catch {}
    return NextResponse.json({ error: errMsg }, { status: res.status })
  }

  return NextResponse.json({ success: true })
}
