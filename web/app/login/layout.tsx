import { PortalProvider } from "@/contexts/PortalContext"

export const metadata = {
  title: "Portal Login — CJPA Global Advisors",
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <PortalProvider>{children}</PortalProvider>
}
