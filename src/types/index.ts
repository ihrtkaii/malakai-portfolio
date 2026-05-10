// Phase machine. The first run is:
//   loading → room → zooming → login → zooming-final → booting → desktop
// Switch-user from the desktop loops back through:
//   desktop → switching-out → login → switching-in → desktop
// Successful admin login from the logon screen takes:
//   login → admin-egg → desktop
export type Phase =
  | 'loading'
  | 'room'
  | 'zooming' // room camera → medium (full monitor visible)
  | 'login' // welcome screen at medium camera distance
  | 'zooming-final' // medium → deep (camera dives into the screen)
  | 'booting' // Horizon XP boot sequence
  | 'desktop' // main OS
  | 'admin-egg' // BSOD → reboot → secret terminal → secret about
  | 'switching-out' // desktop session paused, camera lerps deep → medium
  | 'switching-in' // medium → deep, returning to (preserved) desktop session

export type ProjectId = 'sentinel' | 'cyberready' | 'jobbot' | 'resumex'

// Folder/app windows + each project doc opens its own case-study window.
export type WindowId =
  | 'about'
  | 'projects'
  | 'skills'
  | 'certs'
  | 'experience'
  | 'cmd'
  | 'notes'
  | 'playbook'
  | 'splunk'
  | 'wireshark'
  | 'nmap'
  | 'metasploit'
  | 'kali'
  | 'siem'
  | `project:${ProjectId}`

// Desktop icons cover every window plus pseudo-icons (e.g. Resume.pdf, which
// triggers a download instead of opening a window).
export type IconId = WindowId | 'resume'

export interface Skill {
  name: string
  level: number
}

export interface Cert {
  name: string
  code?: string
  status: 'active' | 'in-progress' | 'planned'
  note?: string
}

export interface ProjectCaseStudy {
  objective: string
  tools: string[]
  methodology: string[]
  findings: string[]
  lessons: string[]
  screenshots?: string[] // placeholder paths — wired into Window in a later pass
}

export interface Project {
  id: ProjectId
  name: string
  status: string
  description: string
  tags: string[]
  link: string
  caseStudy: ProjectCaseStudy
}

export interface ExperienceEntry {
  company: string
  role: string
  period: string
  bullets: string[]
}

export interface ContactInfo {
  location: string
  target: string
  remote: string
  ucf: string
  status: string
  email: string
  linkedin: string
  github: string
}

export interface PlaybookSection {
  // PICERL phase, e.g. 'Preparation', 'Identification', etc.
  title: string
  // Short description of the phase's purpose
  summary: string
  items: string[]
}
