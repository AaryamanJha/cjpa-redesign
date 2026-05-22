import { PortalRole } from "@/types/portal"

const ROLE_CONFIG: Record<
  PortalRole,
  { label: string; bg: string; text: string; border: string }
> = {
  CEO: {
    label: "CEO",
    bg: "rgba(200, 169, 106, 0.12)",
    text: "#C8A96A",
    border: "rgba(200, 169, 106, 0.3)",
  },
  "Senior Advisor": {
    label: "Sr. Advisor",
    bg: "rgba(99, 179, 237, 0.10)",
    text: "#63B3ED",
    border: "rgba(99, 179, 237, 0.25)",
  },
  Advisor: {
    label: "Advisor",
    bg: "rgba(104, 211, 145, 0.10)",
    text: "#68D391",
    border: "rgba(104, 211, 145, 0.25)",
  },
  Associate: {
    label: "Associate",
    bg: "rgba(154, 137, 255, 0.10)",
    text: "#9A89FF",
    border: "rgba(154, 137, 255, 0.25)",
  },
  Analyst: {
    label: "Analyst",
    bg: "rgba(168, 176, 192, 0.10)",
    text: "#A8B0C0",
    border: "rgba(168, 176, 192, 0.25)",
  },
  "Intern Analyst": {
    label: "Intern",
    bg: "rgba(168, 176, 192, 0.07)",
    text: "#8A929E",
    border: "rgba(168, 176, 192, 0.18)",
  },
}

interface RoleBadgeProps {
  role: PortalRole
  size?: "sm" | "md"
}

export function RoleBadge({ role, size = "md" }: RoleBadgeProps) {
  const config = ROLE_CONFIG[role]
  const px = size === "sm" ? "6px 9px" : "5px 10px"
  const fs = size === "sm" ? "9px" : "10px"

  return (
    <span
      className="font-sans font-medium rounded-sm whitespace-nowrap"
      style={{
        background: config.bg,
        color: config.text,
        border: `1px solid ${config.border}`,
        padding: px,
        fontSize: fs,
        letterSpacing: "0.12em",
      }}
    >
      {config.label.toUpperCase()}
    </span>
  )
}
