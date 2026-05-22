import { NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"

// GET /api/invitations/verify?token=<rawToken> - production invitation placeholder
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token")
  return NextResponse.json({
    valid: false,
    tokenPresent: Boolean(token),
    error: "Invitation verification is disabled in the CJPA portal prototype.",
  })
}
