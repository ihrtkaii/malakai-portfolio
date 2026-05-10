'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { useStore } from '@/lib/store'
import {
  NotepadIcon,
  FolderIcon,
  ChartIcon,
  CertIcon,
  BriefcaseIcon,
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
import type { WindowId } from '@/types'

interface ProgramItem {
  windowId: WindowId
  label: string
  icon: ReactNode
}

const PROGRAMS: ProgramItem[] = [
  { windowId: 'about', label: 'About Me', icon: <NotepadIcon size={20} /> },
  { windowId: 'projects', label: 'Projects', icon: <FolderIcon size={20} /> },
  { windowId: 'skills', label: 'Skills', icon: <ChartIcon size={20} /> },
  { windowId: 'certs', label: 'Certifications', icon: <CertIcon size={20} /> },
  { windowId: 'experience', label: 'Experience', icon: <BriefcaseIcon size={20} /> },
  { windowId: 'playbook', label: 'IR Playbook', icon: <PlaybookIcon size={20} /> },
  { windowId: 'notes', label: 'notes.txt', icon: <NotesIcon size={20} /> },
  { windowId: 'cmd', label: 'cmd.exe', icon: <CmdIcon size={20} /> },
]

const SOC_TOOLS: ProgramItem[] = [
  { windowId: 'splunk', label: 'Splunk', icon: <SplunkIcon size={20} /> },
  { windowId: 'wireshark', label: 'Wireshark', icon: <WiresharkIcon size={20} /> },
  { windowId: 'nmap', label: 'Nmap', icon: <NmapIcon size={20} /> },
  { windowId: 'metasploit', label: 'Metasploit', icon: <MetasploitIcon size={20} /> },
  { windowId: 'kali', label: 'Kali Terminal', icon: <KaliIcon size={20} /> },
  { windowId: 'siem', label: 'SIEM Dashboard', icon: <SiemIcon size={20} /> },
]

interface Props {
  onClose: () => void
}

export default function StartMenu({ onClose }: Props) {
  const openWindow = useStore((s) => s.openWindow)
  const setPhase = useStore((s) => s.setPhase)
  const setSwitchUserLogin = useStore((s) => s.setSwitchUserLogin)
  const ref = useRef<HTMLDivElement>(null)

  // Click-outside / Escape closes the menu.
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!ref.current) return
      if (e.target instanceof Node && !ref.current.contains(e.target)) onClose()
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('mousedown', onDown)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  const open = (windowId: WindowId) => {
    openWindow(windowId)
    onClose()
  }

  const onSwitchUser = () => {
    setSwitchUserLogin(true)
    setPhase('switching-out')
    onClose()
  }

  return (
    <div
      ref={ref}
      role="menu"
      className="absolute left-0 select-none"
      style={{
        bottom: 32,
        width: 360,
        zIndex: 1100,
        fontFamily: 'Tahoma, sans-serif',
        boxShadow: '0 4px 20px rgba(0,0,0,0.45)',
        border: '1px solid #0a48b8',
      }}
    >
      {/* User band */}
      <div
        className="flex items-center gap-2 px-3 py-2"
        style={{
          background:
            'linear-gradient(to bottom, #2d7df7 0%, #1c5fd6 60%, #0a48b8 100%)',
          color: '#fff',
          borderBottom: '1px solid #ffe9a8',
          textShadow: '0 1px 2px rgba(0,0,0,0.5)',
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            background: 'linear-gradient(to bottom, #4a82d8, #16489c)',
            border: '2px solid #fff',
            borderRadius: 4,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            overflow: 'hidden',
            flexShrink: 0,
          }}
        >
          <svg width="32" height="32" viewBox="0 0 32 32" aria-hidden>
            <circle cx="16" cy="13" r="5" fill="#fff" />
            <path d="M7 30 C7 22 11 18 16 18 C21 18 25 22 25 30 Z" fill="#fff" />
          </svg>
        </div>
        <div className="font-bold text-[15px]">Kai</div>
      </div>

      {/* Two columns */}
      <div className="flex" style={{ background: '#fff' }}>
        {/* Left — programs */}
        <div className="flex-1 py-2" style={{ background: '#fff' }}>
          {PROGRAMS.map((p) => (
            <ProgramRow key={p.windowId} item={p} onClick={() => open(p.windowId)} />
          ))}
          <div className="mx-3 my-1 border-t border-[#dde5ef]" />
          <div className="px-3 py-1 text-[10px] uppercase tracking-wide text-[#5e7a9c]">
            Security tools
          </div>
          {SOC_TOOLS.map((p) => (
            <ProgramRow key={p.windowId} item={p} onClick={() => open(p.windowId)} />
          ))}
        </div>

        {/* Right — system actions (XP "right column" with darker bg) */}
        <div
          className="w-[140px] py-2"
          style={{ background: '#dfe5ee', borderLeft: '1px solid #b6cfee' }}
        >
          <SystemRow label="Switch User" icon={<KaliIcon size={20} />} onClick={onSwitchUser} />
          <SystemRow label="Log Off" icon={<CmdIcon size={20} />} disabled />
        </div>
      </div>

      {/* Footer */}
      <div
        className="flex items-center justify-end px-3 py-2 gap-3 text-[11px]"
        style={{
          background: 'linear-gradient(to bottom, #1c5fd6 0%, #0a48b8 100%)',
          color: '#fff',
          textShadow: '0 1px 2px rgba(0,0,0,0.5)',
        }}
      >
        <button type="button" className="opacity-70 cursor-not-allowed" disabled>
          Turn Off Computer
        </button>
      </div>
    </div>
  )
}

function ProgramRow({ item, onClick }: { item: ProgramItem; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 w-full px-3 py-1 text-[12px] hover:bg-[var(--xp-blue)] hover:text-white text-left"
    >
      {item.icon}
      <span>{item.label}</span>
    </button>
  )
}

function SystemRow({
  label,
  icon,
  onClick,
  disabled,
}: {
  label: string
  icon: ReactNode
  onClick?: () => void
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-2 w-full px-3 py-1.5 text-[12px] text-left ${
        disabled
          ? 'opacity-50 cursor-not-allowed'
          : 'hover:bg-[var(--xp-blue)] hover:text-white'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  )
}
