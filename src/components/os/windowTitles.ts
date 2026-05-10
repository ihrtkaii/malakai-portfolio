import { projects } from '@/lib/portfolioData'
import type { WindowId } from '@/types'

// Window title lookup. Used by both the title bar (full chrome string) and
// the taskbar button (short label). Keep them aligned in one place so a
// rename only needs to happen once.

interface TitleSet {
  full: string
  short: string
}

const STATIC: Record<Exclude<WindowId, `project:${string}`>, TitleSet> = {
  about: { full: 'about_me.txt - Notepad', short: 'about_me.txt' },
  projects: { full: 'My Projects', short: 'Projects' },
  skills: { full: 'skills.json - Properties', short: 'Skills' },
  certs: { full: 'My Certifications', short: 'Certifications' },
  experience: { full: 'Work Experience', short: 'Experience' },
  cmd: { full: 'C:\\WINDOWS\\system32\\cmd.exe', short: 'cmd.exe' },
  notes: { full: 'notes.txt - Notepad', short: 'notes.txt' },
  playbook: { full: 'IR Playbook — PICERL', short: 'Playbook' },
  splunk: { full: 'Splunk Enterprise — Search & Reporting', short: 'Splunk' },
  wireshark: { full: 'The Wireshark Network Analyzer', short: 'Wireshark' },
  nmap: { full: 'Nmap — Network Scanner', short: 'Nmap' },
  metasploit: { full: 'Metasploit Framework Console', short: 'Metasploit' },
  kali: { full: 'malakai@kali — bash', short: 'Kali Terminal' },
  siem: { full: 'SIEM Dashboard — Microsoft Sentinel', short: 'SIEM' },
}

export function getWindowTitles(id: WindowId): TitleSet {
  if (id.startsWith('project:')) {
    const projectId = id.slice('project:'.length)
    const project = projects.find((p) => p.id === projectId)
    const name = project?.name ?? 'Project'
    return { full: `${name} — Case Study`, short: name }
  }
  return STATIC[id as Exclude<WindowId, `project:${string}`>]
}
