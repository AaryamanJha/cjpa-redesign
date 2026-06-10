// Sends email via Microsoft Graph API using the signed-in user's Outlook account.
// Requires: AZURE_AD_CLIENT_ID, AZURE_AD_CLIENT_SECRET, AUTH_SECRET in environment.
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"

interface GraphSendBody {
  to: string
  cc?: string
  subject: string
  body: string
  bodyType?: "Text" | "HTML"
}

export async function POST(req: NextRequest) {
  const session = await auth()

  if (!session?.accessToken) {
    return NextResponse.json(
      { error: "No Outlook session. Sign in with Microsoft to send real emails." },
      { status: 401 }
    )
  }

  const { to, cc, subject, body, bodyType = "Text" }: GraphSendBody = await req.json()

  if (!to || !subject || !body) {
    return NextResponse.json({ error: "Missing required fields: to, subject, body" }, { status: 400 })
  }

  const ccRecipients = cc
    ?.split(",")
    .map((address) => address.trim())
    .filter(Boolean)
    .map((address) => ({ emailAddress: { address } }))

  const message = {
    subject,
    body: { contentType: bodyType, content: body },
    toRecipients: [{ emailAddress: { address: to } }],
    ...(ccRecipients?.length ? { ccRecipients } : {}),
  }

  const res = await fetch("https://graph.microsoft.com/v1.0/me/sendMail", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
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
