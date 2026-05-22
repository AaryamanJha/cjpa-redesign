import { NextResponse } from "next/server"

export const runtime = "nodejs"

export async function GET() {
  return NextResponse.json(
    {
      team: [],
      message: "Team API is disabled in the CJPA portal prototype. Use localStorage-backed mock users.",
    },
    { status: 501 }
  )
}
