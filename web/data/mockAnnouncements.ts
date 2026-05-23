import { Announcement } from "@/types/portal"

export const mockAnnouncements: Announcement[] = [
  {
    id: "ann-projects-may-2026",
    title: "May 2026 Project Pipeline Loaded",
    message:
      "The portal now reflects the May 2026 project list: September book release, monthly newsletter, social growth, contracted symposium, thought leadership, and William Adjei project finance pipeline. Please review assignments and flag any scope gaps.",
    postedBy: "Earl Carr",
    date: "2026-05-22",
    priority: "Important",
    audience: "All Team",
  },
  {
    id: "ann-infra-diligence",
    title: "Infrastructure Fund Pipeline Requires First-Pass Diligence",
    message:
      "Associates and analysts should prioritize the infrastructure fund diligence matrix across SunTerra, Renouvo, Draper International, ZamGrow, Belize RFP, Coaqua, Bridgeway Advisors, Hiely's, Taoyuan government, and Spectrum Robotics.",
    postedBy: "Earl Carr",
    date: "2026-05-22",
    priority: "Urgent",
    audience: "Project Team",
  },
  {
    id: "ann-portal-prototype",
    title: "Prototype Portal Reminder",
    message:
      "This portal remains a prototype. Login IDs, team data, project records, and task assignments are stored locally in the browser and are not production authentication or a secure document system.",
    postedBy: "Earl Carr",
    date: "2026-05-22",
    priority: "Standard",
    audience: "All Team",
  },
]
