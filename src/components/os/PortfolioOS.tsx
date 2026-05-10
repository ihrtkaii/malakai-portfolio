'use client'

import { useEffect } from 'react'
import { useStore } from '@/lib/store'
import { playSound } from '@/lib/sounds'
import Desktop from './Desktop'
import Taskbar from './Taskbar'
import AboutWindow from './windows/AboutWindow'
import ProjectsWindow from './windows/ProjectsWindow'
import SkillsWindow from './windows/SkillsWindow'
import CertsWindow from './windows/CertsWindow'
import ExperienceWindow from './windows/ExperienceWindow'
import CmdWindow from './windows/CmdWindow'
import ProjectCaseStudyWindow from './windows/ProjectCaseStudyWindow'
import NotesWindow from './windows/NotesWindow'
import PlaybookWindow from './windows/PlaybookWindow'
import SplunkWindow from './windows/SplunkWindow'
import WiresharkWindow from './windows/WiresharkWindow'
import NmapWindow from './windows/NmapWindow'
import MetasploitWindow from './windows/MetasploitWindow'
import KaliWindow from './windows/KaliWindow'
import SiemWindow from './windows/SiemWindow'
import type { ProjectId, WindowId } from '@/types'

function renderWindow(id: WindowId) {
  if (id.startsWith('project:')) {
    const projectId = id.slice('project:'.length) as ProjectId
    return <ProjectCaseStudyWindow key={id} projectId={projectId} />
  }
  switch (id) {
    case 'about':
      return <AboutWindow key={id} />
    case 'projects':
      return <ProjectsWindow key={id} />
    case 'skills':
      return <SkillsWindow key={id} />
    case 'certs':
      return <CertsWindow key={id} />
    case 'experience':
      return <ExperienceWindow key={id} />
    case 'cmd':
      return <CmdWindow key={id} />
    case 'notes':
      return <NotesWindow key={id} />
    case 'playbook':
      return <PlaybookWindow key={id} />
    case 'splunk':
      return <SplunkWindow key={id} />
    case 'wireshark':
      return <WiresharkWindow key={id} />
    case 'nmap':
      return <NmapWindow key={id} />
    case 'metasploit':
      return <MetasploitWindow key={id} />
    case 'kali':
      return <KaliWindow key={id} />
    case 'siem':
      return <SiemWindow key={id} />
    default:
      return null
  }
}

export default function PortfolioOS() {
  const openWindows = useStore((s) => s.openWindows)
  const selectIcon = useStore((s) => s.selectIcon)
  const hasPlayedStartup = useStore((s) => s.hasPlayedStartup)
  const markStartupPlayed = useStore((s) => s.markStartupPlayed)

  // Play the desktop arrival jingle exactly once. Switching user → returning
  // to desktop unmounts/remounts this component but the flag persists in
  // the zustand store, so the sound doesn't replay.
  useEffect(() => {
    if (!hasPlayedStartup) {
      playSound('startup')
      markStartupPlayed()
    }
  }, [hasPlayedStartup, markStartupPlayed])

  return (
    <div
      className="fixed inset-0 aero-wallpaper overflow-hidden os-cursor"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) selectIcon(null)
      }}
    >
      <div className="aero-watermark">Horizon XP · build 2026.05</div>

      <Desktop />

      {openWindows.map((id) => renderWindow(id))}

      <Taskbar />
    </div>
  )
}
