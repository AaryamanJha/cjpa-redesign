import { NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"

// PATCH /api/invitations/[id] - production invitation system placeholder
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await req.json().catch(() => null)
  return NextResponse.json(
    {
      id,
      error: "Invitation APIs are disabled in the CJPA portal prototype. Team access is mocked in localStorage.",
    },
    { status: 501 }
  )
}
