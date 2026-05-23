import { NewsletterDraft } from "@/types/portal"

export const mockNewsletterDrafts: NewsletterDraft[] = [
  {
    id: "nl-may-2026",
    title: "CJPA May 2026 Project Brief",
    issue: "May 2026",
    coverTheme:
      "A concise update on the September book project, contracted symposium, project finance pipeline, and CJPA's public thought leadership program.",
    status: "In Review",
    author: "Lorena James",
    lastEdited: "2026-05-22",
    publishDate: "2026-05-31",
    wordCount: 1650,
    sections: [
      "Founder Note",
      "September Book Project",
      "Project Finance Pipeline",
      "Contracted Symposium: Oil and Markets",
      "Social Growth and Outreach",
    ],
    tags: ["CJPA", "Project Finance", "Thought Leadership", "May 2026"],
  },
  {
    id: "nl-book-launch",
    title: "September Book Launch Campaign",
    issue: "Special Release",
    coverTheme:
      "Pre-launch positioning and media copy for CJPA's upcoming book release, including chapter editing progress and research support.",
    status: "Draft",
    author: "Georgia Pollard",
    lastEdited: "2026-05-21",
    publishDate: "2026-08-15",
    wordCount: 720,
    sections: [
      "Launch Positioning",
      "Press Release Copy",
      "Chapter Themes",
      "Ambassador Campbell Research Notes",
    ],
    tags: ["Book", "Press", "Research"],
  },
  {
    id: "nl-infra-pipeline",
    title: "Infrastructure Fund Pipeline Watch",
    issue: "Project Finance Note",
    coverTheme:
      "Investor-readiness notes on SunTerra, Renouvo, Draper International, ZamGrow, Belize RFP, Coaqua, Bridgeway Advisors, Hiely's, Taoyuan government, and Spectrum Robotics.",
    status: "Draft",
    author: "Zack Kennedy",
    lastEdited: "2026-05-22",
    wordCount: 980,
    sections: [
      "Pipeline Overview",
      "Renewables and Agritech",
      "Defense Technology and Taiwan",
      "Belize RFP",
      "Consumer and Training Partnerships",
    ],
    tags: ["Infrastructure", "Project Finance", "Taiwan", "Belize"],
  },
]
