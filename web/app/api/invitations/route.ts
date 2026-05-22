import { NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"

const prototypeMessage =
  "Invitation APIs are disabled in the CJPA portal prototype. Team access is mocked in localStorage."

// GET /api/invitations - production invitation system placeholder
export async function GET() {
  return NextResponse.json({ invitations: [], message: prototypeMessage }, { status: 501 })
}

// POST /api/invitations - production invitation system placeholder
export async function POST(req: NextRequest) {
  await req.json().catch(() => null)
  return NextResponse.json({ error: prototypeMessage }, { status: 501 })
}
