\# CJPA Global Advisors Website Redesign



We are redesigning https://www.cjpa.us/ into a premium institutional advisory website.



\## Goal



Build a website that feels like a world-class global advisory firm, not a generic AI landing page.



Target feel:

\- Global advisory

\- Geopolitical intelligence

\- Capital strategy

\- Cross-border consulting

\- Institutional credibility

\- Premium, sharp, restrained



Avoid:

\- Generic SaaS gradients

\- Purple AI startup visuals

\- Random cards everywhere

\- Cheap stock-photo feeling

\- Overanimation

\- Clutter

\- Placeholder lorem ipsum



\## Required stack



\- Next.js

\- TypeScript

\- Tailwind CSS

\- Motion / Framer Motion

\- shadcn/ui if useful

\- Lucide icons

\- Playwright for QA



\## Installed design skills



Use these intentionally:



\- UI UX Pro Max: layout, spacing, UX structure, responsive sections

\- Taste Skill: premium frontend taste, anti-generic design, hierarchy, typography

\- Huashu Design: splash screen, high-fidelity visual direction, cinematic concepts

\- Impeccable: audit, critique, polish, layout, type, color, responsiveness

\- Playwright: browser QA, screenshots, responsive testing

\- 21st.dev: component inspiration only, especially hero section references



Do not randomly blend every skill. Use this sequence:

1\. Plan site architecture

2\. Create visual direction

3\. Build components

4\. Add motion

5\. Run Playwright QA

6\. Use Impeccable/Taste to polish



\## Required sections



\- Landing Page with cinematic splash screen

\- About Us

\- Meet the Team

\- Services

\- Login / Client Portal placeholder

\- Partners / Clients / How Can We Help You

\- Newsletter

\- Contact Us



\## Visual direction



Use:

\- Dark navy / charcoal background

\- Ivory text

\- Muted gold accents

\- Subtle global map, grid, and connection-line visuals

\- Premium serif headings

\- Clean sans-serif body text

\- Institutional spacing

\- Glass or dark-card accents only where useful



Suggested colors:

\- Background: #070B14

\- Card: #101827

\- Gold: #C8A96A

\- Text: #F5F1E8

\- Muted: #A8B0C0

\- Accent Blue: #3B82F6



\## Behavior



Before major edits, create a plan.



After building:

\- Run npm build

\- Run Playwright tests

\- Inspect desktop, tablet, and mobile

\- Fix broken nav, forms, responsiveness, contrast, and animation issues

\- Use Impeccable audit/polish before finalizing

## Client Portal / Login Instructions

Build the login and portal as a polished prototype. Do not connect to a real database yet. No real auth, OAuth, Supabase, Firebase, Clerk, Auth.js, or Microsoft Graph. Use mock users, local state, and localStorage only.

**Important:** Make it clear in UI/comments that this is a prototype, not production-grade.

### Login System

\- `/login` page with CJPA ID only (no password yet)
\- Each ID maps to title and permission level
\- Mock users in `data/portalUsers.ts`
\- Valid ID → localStorage → `/portal`; Invalid → error message
\- Logout clears localStorage → `/login`

Role hierarchy: CEO > Senior Advisor > Advisor > Associate > Analyst > Intern Analyst

### Portal Dashboard

Dark navy premium internal dashboard matching CJPA brand. Sidebar nav: Overview, My Calendar, Group Calendar, Tasks, Projects, Clients, Documents, Newsletter Drafts, Team, Settings.

### Data Files

\- `data/portalUsers.ts` — mock users
\- `data/mockTasks.ts` — mock tasks
\- `data/mockProjects.ts` — mock projects
\- `data/mockAnnouncements.ts` — announcements
\- `types/portal.ts` — TypeScript types

### Build Sequence

\- Phase 1: Login page, mock user system, portal layout, overview dashboard
\- Phase 2: Personal calendar, group calendar, Outlook sync placeholder
\- Phase 3: Task scheduler, role-based assignment rules
\- Phase 4: Projects and client folders, mock documents
\- Phase 5: Clients, announcements, newsletter draft tracker
\- Phase 6: Playwright QA, role-by-role testing, responsive cleanup

