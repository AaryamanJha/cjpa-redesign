// PROTOTYPE ONLY: localStorage-backed portal users. No real auth, passwords, or sessions.
// Future version: replace with production authentication before using real credentials.

import { PortalRole, PortalUser } from "@/types/portal"
import { teamMembers } from "@/data/teamMembers"

const ROLE_PERMISSIONS: Record<PortalRole, string[]> = {
  CEO: ["all"],
  "Senior Advisor": [
    "view_all_projects",
    "assign_tasks",
    "manage_calendar",
    "view_clients",
    "add_group_meeting",
    "upload_deliverables",
    "review_project_progress",
    "manage_team",
  ],
  Advisor: [
    "view_projects",
    "assign_tasks",
    "manage_own_calendar",
    "add_project_notes",
    "update_project_status",
    "view_relevant_clients",
  ],
  Associate: [
    "view_assigned_projects",
    "update_tasks",
    "manage_own_calendar",
    "add_research_notes",
    "upload_working_files",
  ],
  Analyst: [
    "view_assigned_projects",
    "update_tasks",
    "manage_own_calendar",
    "add_research_notes",
    "view_deadlines",
    "view_group_meetings",
  ],
  "Intern Analyst": [
    "view_assigned_tasks",
    "update_tasks",
    "manage_own_calendar",
    "add_research_notes",
    "view_deadlines",
  ],
}

export const portalUsers: PortalUser[] = teamMembers
  .filter((member) => member.portalEnabled)
  .map((member) => ({
    id: member.id,
    name: member.name,
    title: member.title,
    role: member.portalRole,
    permissions: ROLE_PERMISSIONS[member.portalRole],
    image: member.image,
    bio: member.bio,
    email: member.email,
    region: member.region,
    publicRole: member.publicRole,
    group: member.group,
    isPortalAdmin: member.isPortalAdmin,
  }))

export function findUser(id: string): PortalUser | undefined {
  return portalUsers.find((u) => u.id === id.toLowerCase().trim())
}
