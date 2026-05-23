export type PortalRole =
  | "CEO"
  | "Senior Advisor"
  | "Advisor"
  | "Associate"
  | "Analyst"
  | "Intern Analyst"

export type TaskPriority = "Low" | "Medium" | "High" | "Urgent"
export type TaskStatus = "Not Started" | "In Progress" | "Waiting for Review" | "Completed"
export type ProjectStatus =
  | "Discovery"
  | "Research"
  | "Analysis"
  | "Drafting"
  | "Review"
  | "Client Ready"
  | "Delivered"
  | "Archived"
export type AnnouncementPriority = "Standard" | "Important" | "Urgent"
export type AnnouncementAudience = "All Team" | "Advisors" | "Analysts" | "Project Team"
export type NewsletterStatus = "Draft" | "In Review" | "Approved" | "Published"
export type CalendarEventType = "Meeting" | "Deadline" | "Client Call" | "Internal" | "Travel"

export interface PortalUser {
  id: string
  name: string
  title: string
  role: PortalRole
  permissions: string[]
  image?: string
  bio?: string
  email?: string
  region?: string
  publicRole?: string
  group?: string
  isPortalAdmin?: boolean
}

export interface Task {
  id: string
  title: string
  description: string
  assignedBy: string
  assignedTo: string
  roleOfAssignee: PortalRole
  project: string
  deadline: string
  priority: TaskPriority
  status: TaskStatus
  notes: string
  createdDate: string
  lastUpdated: string
}

export interface Project {
  id: string
  clientId?: string
  clientName: string
  projectName: string
  projectType: string
  lead: string
  team: string[]
  status: ProjectStatus
  priority: "Low" | "Medium" | "High" | "Critical"
  startDate: string
  targetDeadline: string
  summary: string
  keyDeliverables: string[]
  driveLink?: string
}

export interface Announcement {
  id: string
  title: string
  message: string
  postedBy: string
  date: string
  priority: AnnouncementPriority
  audience: AnnouncementAudience
}

export type ClientStatus = "Active" | "Proposal" | "Raising Capital" | "Retainer" | "Past"

export interface Client {
  id: string
  name: string
  shortName: string
  industry: string
  region: string
  contactName: string
  contactTitle: string
  contactEmail: string
  linkedProjects: string[]
  status: ClientStatus
  since: string
  notes: string
  driveLink?: string
}

export interface CalendarEvent {
  id: string
  title: string
  date: string
  time?: string
  endTime?: string
  type: CalendarEventType
  project?: string
  participants?: string[]
  location?: string
  notes?: string
  isAllDay?: boolean
}

export interface NewsletterDraft {
  id: string
  title: string
  issue: string
  coverTheme: string
  status: NewsletterStatus
  author: string
  lastEdited: string
  publishDate?: string
  wordCount?: number
  sections: string[]
  tags: string[]
}
