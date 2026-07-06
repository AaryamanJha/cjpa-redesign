// Reads the firm-wide global calendar (Earl Carr's Outlook calendar) via app-only
// Microsoft Graph access, so it shows up on every portal user's calendar regardless
// of who is signed in. Requires the Azure app registration to have the application
// permission Calendars.Read (or Calendars.ReadBasic.All) with admin consent granted,
// and AZURE_AD_TENANT_ID set to the real tenant ID (not "common").
import { NextRequest, NextResponse } from "next/server"
import { getGraphAppToken, GraphAppAuthError } from "@/lib/graphAppToken"

const GLOBAL_CALENDAR_MAILBOX = process.env.GLOBAL_CALENDAR_MAILBOX || "earl@cjpa.us"

interface GraphEvent {
  id: string
  subject: string
  bodyPreview?: string
  start: { dateTime: string; timeZone: string }
  end: { dateTime: string; timeZone: string }
  location?: { displayName?: string }
  isAllDay?: boolean
  attendees?: { emailAddress?: { name?: string } }[]
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const now = new Date()
  const startDateTime = searchParams.get("start") ??
    new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString()
  const endDateTime = searchParams.get("end") ??
    new Date(now.getFullYear(), now.getMonth() + 3, 1).toISOString()

  let accessToken: string
  try {
    accessToken = await getGraphAppToken()
  } catch (err) {
    const message = err instanceof GraphAppAuthError ? err.message : "Graph app-auth failed"
    return NextResponse.json({ error: message }, { status: 500 })
  }

  const url = new URL(`https://graph.microsoft.com/v1.0/users/${encodeURIComponent(GLOBAL_CALENDAR_MAILBOX)}/calendarView`)
  url.searchParams.set("startDateTime", startDateTime)
  url.searchParams.set("endDateTime", endDateTime)
  url.searchParams.set("$orderby", "start/dateTime")
  url.searchParams.set("$top", "999")

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Prefer: 'outlook.timezone="UTC"',
    },
    // This route is a thin passthrough over live Graph data — never cache.
    cache: "no-store",
  })

  if (!res.ok) {
    let errMsg = `Graph API error: ${res.status}`
    try {
      const data = await res.json()
      errMsg = data.error?.message || errMsg
    } catch {}
    if (res.status === 403) {
      errMsg = `Missing permission to read ${GLOBAL_CALENDAR_MAILBOX}'s calendar. Grant the Calendars.Read application permission (with admin consent) to the Azure app registration. (${errMsg})`
    }
    return NextResponse.json({ error: errMsg }, { status: res.status })
  }

  const data = await res.json()
  const events = (data.value as GraphEvent[]).map((e) => ({
    id: `global-cal-${e.id}`,
    title: e.subject || "(No subject)",
    description: e.bodyPreview || undefined,
    startTime: e.start.dateTime + "Z",
    endTime: e.end.dateTime + "Z",
    location: e.location?.displayName || undefined,
    isAllDay: e.isAllDay ?? false,
    color: "purple",
    category: "Global Calendar",
  }))

  return NextResponse.json({ events, mailbox: GLOBAL_CALENDAR_MAILBOX })
}
