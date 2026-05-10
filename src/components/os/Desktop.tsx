'use client'

import { useStore } from '@/lib/store'
import DesktopIcon from './DesktopIcon'
import {
  NotepadIcon,
  FolderIcon,
  PdfIcon,
  CmdIcon,
  NotesIcon,
  PlaybookIcon,
  SplunkIcon,
  WiresharkIcon,
  NmapIcon,
  MetasploitIcon,
  KaliIcon,
  SiemIcon,
} from './Icons'
import type { IconId, WindowId } from '@/types'

interface IconConfig {
  id: IconId
  label: string
  icon: React.ReactNode
  windowId?: WindowId
  download?: { href: string; filename: string }
}

// Main grid (top-left). Notes.txt is pinned to bottom-right separately.
const GRID_ICONS: IconConfig[] = [
  { id: 'about', label: 'About Me', icon: <NotepadIcon size={36} />, windowId: 'about' },
  { id: 'projects', label: 'Projects', icon: <FolderIcon size={36} />, windowId: 'projects' },
  { id: 'cmd', label: 'cmd.exe', icon: <CmdIcon size={36} />, windowId: 'cmd' },
  {
    id: 'resume',
    label: 'Resume.pdf',
    icon: <PdfIcon size={36} />,
    download: { href: '/resume.pdf', filename: 'Malakai-Resume.pdf' },
  },
  { id: 'splunk', label: 'Splunk', icon: <SplunkIcon size={36} />, windowId: 'splunk' },
  { id: 'wireshark', label: 'Wireshark', icon: <WiresharkIcon size={36} />, windowId: 'wireshark' },
  { id: 'nmap', label: 'Nmap', icon: <NmapIcon size={36} />, windowId: 'nmap' },
  { id: 'metasploit', label: 'Metasploit', icon: <MetasploitIcon size={36} />, windowId: 'metasploit' },
  { id: 'kali', label: 'Kali Terminal', icon: <KaliIcon size={36} />, windowId: 'kali' },
  { id: 'siem', label: 'SIEM Dashboard', icon: <SiemIcon size={36} />, windowId: 'siem' },
  { id: 'playbook', label: 'Playbook', icon: <PlaybookIcon size={36} />, windowId: 'playbook' },
]

const NOTES_ICON: IconConfig = {
  id: 'notes',
  label: 'notes.txt',
  icon: <NotesIcon size={36} />,
  windowId: 'notes',
}

export default function Desktop() {
  const openWindow = useStore((s) => s.openWindow)
  const selectIcon = useStore((s) => s.selectIcon)

  const activate = (cfg: IconConfig) => {
    if (cfg.windowId) {
      openWindow(cfg.windowId)
    } else if (cfg.download) {
      const a = document.createElement('a')
      a.href = cfg.download.href
      a.download = cfg.download.filename
      a.click()
    }
  }

  return (
    <div
      className="absolute inset-0"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) selectIcon(null)
      }}
    >
      {/* Main grid — top-left, 2 columns */}
      <div className="absolute top-3 left-3 grid grid-cols-2 gap-y-2 gap-x-1 pointer-events-auto">
        {GRID_ICONS.map((cfg) => (
          <DesktopIcon
            key={cfg.id}
            id={cfg.id}
            label={cfg.label}
            icon={cfg.icon}
            onActivate={() => activate(cfg)}
          />
        ))}
      </div>

      {/* notes.txt — pinned to bottom-right (above the taskbar) */}
      <div className="absolute right-3 bottom-[44px] pointer-events-auto">
        <DesktopIcon
          id={NOTES_ICON.id}
          label={NOTES_ICON.label}
          icon={NOTES_ICON.icon}
          onActivate={() => activate(NOTES_ICON)}
        />
      </div>
    </div>
  )
}
