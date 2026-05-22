import { NextResponse } from "next/server"

export default function middleware() {
  // Prototype only: /portal access is guarded client-side by PortalContext
  // using localStorage. Do not enable server auth until production auth is added.
  return NextResponse.next()
}

export const config = {
  matcher: ["/portal/:path*"],
}
