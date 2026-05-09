export type Phase = 'loading' | 'room' | 'zooming' | 'booting' | 'desktop'

export type WindowId = 'about' | 'projects' | 'skills' | 'certs' | 'contact' | 'cmd'

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

export interface Project {
  name: string
  status: string
  description: string
  tags: string[]
  link: string
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
