import { Announcement } from "@/types/portal"

export const mockAnnouncements: Announcement[] = [
  {
    id: "ann-001",
    title: "Q2 Strategy Review — All Hands",
    message:
      "All advisors and senior staff are required to attend the Q2 strategy review on June 3rd at 10:00 AM EST. The session will cover active mandates, pipeline status, and firm-wide priorities for the second half of 2026. Calendar invites have been issued.",
    postedBy: "Carlton J. Porter",
    date: "2026-05-16",
    priority: "Important",
    audience: "All Team",
  },
  {
    id: "ann-002",
    title: "New Engagement: Gulf Sovereign Fund — Phase II Scope Confirmed",
    message:
      "Phase II of the Gulf Sovereign Capital Redeployment mandate has been formally confirmed. Scope includes portfolio stress-testing and regulatory pre-clearance review for the EU corridor. Project team to coordinate with James Whitmore directly for role assignments.",
    postedBy: "Dr. Amara Singh",
    date: "2026-05-14",
    priority: "Standard",
    audience: "Advisors",
  },
  {
    id: "ann-003",
    title: "Updated Deliverable Submission Protocol",
    message:
      "Effective immediately, all client-ready deliverables must be uploaded to the project folder at least 48 hours before the scheduled client presentation. Internal review requests should be submitted through the portal task system. Please update any active timelines accordingly.",
    postedBy: "Carlton J. Porter",
    date: "2026-05-10",
    priority: "Urgent",
    audience: "All Team",
  },
]
