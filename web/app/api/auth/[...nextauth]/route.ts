import { NextResponse } from "next/server"

const message =
  "Production authentication is disabled in this CJPA portal prototype. Use the CJPA ID login at /login."

export async function GET() {
  return NextResponse.json({ error: message }, { status: 501 })
}

export async function POST() {
  return NextResponse.json({ error: message }, { status: 501 })
}
