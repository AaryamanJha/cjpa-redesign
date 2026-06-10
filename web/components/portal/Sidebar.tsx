"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users,
  CalendarDays,
  Megaphone,
  Mail,
  Send,
  Settings,
  ShieldCheck,
  LogOut,
  ChevronsRight,
  Database,
  Sparkles,
  FileDown,
} from "lucide-react"
import { useState } from "react"
import { signOut, useSession } from "next-auth/react"
import { usePortal } from "@/contexts/PortalContext"
import { RoleBadge } from "./RoleBadge"

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
  adminOnly?: boolean
}

const NAV_ITEMS: NavItem[] = [
  { label: "Overview",      href: "/portal",               icon: LayoutDashboard },
  { label: "Projects",      href: "/portal/projects",      icon: FolderKanban },
  { label: "Tasks",         href: "/portal/tasks",         icon: CheckSquare },
  { label: "Calendar",      href: "/portal/calendar",      icon: CalendarDays },
  { label: "Clients",       href: "/portal/clients",       icon: Users },
  { label: "Databank",      href: "/portal/databank",      icon: Database },
  { label: "AI Service",    href: "/portal/ai",            icon: Sparkles },
  { label: "File Resizer",  href: "/portal/file-resizer",  icon: FileDown },
  { label: "Email",         href: "/portal/email",         icon: Send },
  { label: "Announcements", href: "/portal/announcements", icon: Megaphone },
  { label: "Newsletter",    href: "/portal/newsletter",    icon: Mail },
  { label: "Admin",         href: "/portal/admin",         icon: ShieldCheck, adminOnly: true },
  { label: "Settings",      href: "/portal/settings",      icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user, logout, isAdmin } = usePortal()
  const { data: session } = useSession()
  const [open, setOpen] = useState(true)

  function handleLogout() {
    logout()
    if (session) signOut({ callbackUrl: "/login" })
  }

  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.adminOnly || isAdmin
  )

  return (
    <aside
      className="relative flex flex-col shrink-0 bg-[#0A1120] border-r border-[#C8A96A]/10 h-screen sticky top-0 overflow-y-auto transition-all duration-300 ease-in-out"
      style={{ width: open ? "220px" : "60px" }}
    >
      {/* Logo */}
      <div className={`pt-7 pb-6 border-b border-[#C8A96A]/10 overflow-hidden ${open ? "px-6" : "px-0 flex flex-col items-center"}`}>
        <Link href="/" className="inline-block">
          <span
            className="font-serif text-[#F5F1E8] tracking-widest uppercase"
            style={{ fontSize: open ? "18px" : "13px", letterSpacing: open ? "0.3em" : "0.1em" }}
          >
            {open ? "CJPA" : "C"}
          </span>
        </Link>
        {open && (
          <>
            <p className="mt-0.5 text-[#A8B0C0] font-sans uppercase" style={{ fontSize: "10px", letterSpacing: "0.2em" }}>
              Global Advisors
            </p>
            <div className="mt-3 h-px w-6 bg-[#C8A96A]/50" />
            <p className="mt-2 text-[#A8B0C0]/60 font-sans uppercase" style={{ fontSize: "9.5px", letterSpacing: "0.18em" }}>
              Secure Portal
            </p>
          </>
        )}
      </div>

      {/* Nav */}
      <nav className={`flex-1 py-4 space-y-0.5 ${open ? "px-3" : "px-1.5"}`}>
        {visibleItems.map((item) => {
          const isActive = item.href === "/portal"
            ? pathname === "/portal"
            : pathname.startsWith(item.href)
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              title={!open ? item.label : undefined}
              className={[
                "flex items-center gap-3 rounded-sm transition-colors",
                open ? "px-3 py-2.5" : "px-0 py-2.5 justify-center",
                isActive
                  ? "bg-[#C8A96A]/10 text-[#C8A96A]"
                  : "text-[#A8B0C0] hover:text-[#F5F1E8] hover:bg-[#F5F1E8]/4",
              ].join(" ")}
            >
              <Icon size={15} strokeWidth={1.5} className="shrink-0" />
              {open && (
                <span className="font-sans font-medium truncate" style={{ fontSize: "14px" }}>
                  {item.label}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* User footer */}
      {user && open && (
        <div className="px-4 py-4 border-t border-[#C8A96A]/10 space-y-2">
          <div className="flex items-center gap-3">
            {user.image && (
              <img
                src={user.image}
                alt={user.name}
                className="h-9 w-9 rounded-sm object-cover ring-1 ring-[#C8A96A]/25"
              />
            )}
            <div className="min-w-0">
              <p className="font-sans font-medium text-[#F5F1E8] truncate" style={{ fontSize: "13px" }}>{user.name}</p>
              <p className="font-sans text-[#A8B0C0] truncate" style={{ fontSize: "12px" }}>{user.title}</p>
            </div>
          </div>
          <RoleBadge role={user.role} size="sm" />
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-[#A8B0C0]/60 hover:text-red-400 font-sans transition-colors pt-1"
            style={{ fontSize: "13px" }}
          >
            <LogOut size={13} strokeWidth={1.5} />
            <span>Sign Out</span>
          </button>
        </div>
      )}

      {/* Collapse icon when closed */}
      {!open && user && (
        <div className="py-4 border-t border-[#C8A96A]/10 flex justify-center">
          <button onClick={handleLogout} className="text-[#A8B0C0]/40 hover:text-red-400 transition-colors" title="Sign out">
            <LogOut size={14} strokeWidth={1.5} />
          </button>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className="sticky bottom-0 w-full border-t border-[#C8A96A]/10 bg-[#0A1120] hover:bg-[#111d2e] transition-colors"
      >
        <div className={`flex items-center p-3 ${open ? "" : "justify-center"}`}>
          <div className="grid w-8 h-8 place-content-center shrink-0">
            <ChevronsRight
              size={15}
              strokeWidth={1.5}
              className={`text-[#A8B0C0]/50 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
            />
          </div>
          {open && (
            <span className="font-sans text-[#A8B0C0]/50 ml-1" style={{ fontSize: "12px" }}>
              Collapse
            </span>
          )}
        </div>
      </button>
    </aside>
  )
}
