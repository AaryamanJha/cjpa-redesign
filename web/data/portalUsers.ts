// PROTOTYPE ONLY — not production authentication
// These are mock users with local state. No real auth, no passwords, no session tokens.
// Future version: replace with real auth (Clerk, Auth.js, or Microsoft Entra ID).

import { PortalUser } from "@/types/portal"

export const portalUsers: PortalUser[] = [
  {
    id: "carltonporter",
    name: "Carlton J. Porter",
    title: "Chief Executive Officer",
    role: "CEO",
    permissions: ["all"],
  },
  {
    id: "amarasingh",
    name: "Dr. Amara Singh",
    title: "Managing Director",
    role: "Senior Advisor",
    permissions: [
      "view_all_projects",
      "assign_tasks",
      "manage_calendar",
      "view_clients",
      "add_group_meeting",
      "upload_deliverables",
      "review_project_progress",
      "manage_team",
    ],
  },
  {
    id: "jameswhitmore",
    name: "James Whitmore",
    title: "Senior Advisor, Capital Markets",
    role: "Advisor",
    permissions: [
      "view_projects",
      "assign_tasks",
      "manage_own_calendar",
      "add_project_notes",
      "update_project_status",
      "view_relevant_clients",
    ],
  },
  {
    id: "marcusreid",
    name: "Marcus Reid",
    title: "Senior Associate",
    role: "Associate",
    permissions: [
      "view_assigned_projects",
      "update_tasks",
      "manage_own_calendar",
      "add_research_notes",
      "upload_working_files",
    ],
  },
  {
    id: "priyamenon",
    name: "Priya Menon",
    title: "Research Analyst",
    role: "Analyst",
    permissions: [
      "view_assigned_projects",
      "update_tasks",
      "manage_own_calendar",
      "add_research_notes",
      "view_deadlines",
      "view_group_meetings",
    ],
  },
  {
    id: "thomasosei",
    name: "Thomas Osei",
    title: "Intern Analyst",
    role: "Intern Analyst",
    permissions: [
      "view_assigned_tasks",
      "update_tasks",
      "manage_own_calendar",
      "add_research_notes",
      "view_deadlines",
    ],
  },
]

export function findUser(id: string): PortalUser | undefined {
  return portalUsers.find((u) => u.id === id.toLowerCase().trim())
}
