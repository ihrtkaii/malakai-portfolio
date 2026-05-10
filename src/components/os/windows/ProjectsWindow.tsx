'use client'

import Window from '../Window'
import { FolderIcon } from '../Icons'
import { projects } from '@/lib/portfolioData'
import { useStore } from '@/lib/store'
import { getWindowTitles } from '../windowTitles'
import type { ProjectId } from '@/types'

const STATUS_PILL: Record<string, string> = {
  live: '#3aa030',
  MVP: '#0a48b8',
  running: '#1e88a0',
  beta: '#d68a07',
}

// Tiny icons for each project — generic doc tile colored by status, no
// real per-project art needed for v1.
function ProjectTileIcon({ color }: { color: string }) {
  return (
    <svg width="42" height="42" viewBox="0 0 32 32" aria-hidden>
      <path d="M7 3 L22 3 L26 7 L26 29 L7 29 Z" fill="#fdfdfd" stroke="#9aa6b8" />
      <path d="M22 3 L22 7 L26 7" fill="#dde5f0" stroke="#9aa6b8" />
      <rect x="6" y="18" width="20" height="8" fill={color} />
      <line x1="9" y1="11" x2="22" y2="11" stroke="#7995b0" strokeWidth="1" />
      <line x1="9" y1="14" x2="20" y2="14" stroke="#7995b0" strokeWidth="1" />
    </svg>
  )
}

export default function ProjectsWindow() {
  const openWindow = useStore((s) => s.openWindow)

  return (
    <Window
      id="projects"
      title={getWindowTitles('projects').full}
      icon={<FolderIcon size={14} />}
      initialX={140}
      initialY={80}
      width={620}
      height={440}
    >
      {/* Explorer-style chrome: address bar + body */}
      <div className="bg-[#ece9d8] border-b border-[#a0a0a0] text-[11px]">
        <div className="flex items-center gap-3 px-2 py-0.5">
          {['File', 'Edit', 'View', 'Favorites', 'Tools', 'Help'].map((m) => (
            <span key={m} className="px-1 cursor-default">
              <u>{m[0]}</u>
              {m.slice(1)}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2 px-2 py-1 border-t border-white">
          <span className="text-[#444]">Address</span>
          <div
            className="flex-1 bg-white border border-[#7c9bc1] px-1 py-0.5"
            style={{ fontFamily: 'Tahoma, sans-serif' }}
          >
            C:\Users\malakai\Documents\Projects
          </div>
        </div>
      </div>

      <div
        className="flex h-[calc(100%-52px)] bg-white"
        style={{ fontFamily: 'Tahoma, sans-serif' }}
      >
        {/* Left "Tasks" panel — XP Common Tasks pane */}
        <aside
          className="w-[170px] p-2 text-[11px] text-white"
          style={{
            background:
              'linear-gradient(to bottom, #5b8acb 0%, #2a64b1 30%, #1a4a98 100%)',
          }}
        >
          <div className="font-bold mb-1.5 border-b border-white/30 pb-1">File and Folder Tasks</div>
          <ul className="space-y-1 underline">
            <li>Open project</li>
            <li>View case study</li>
            <li>Read findings</li>
          </ul>
          <div className="font-bold mt-3 mb-1.5 border-b border-white/30 pb-1">Other Places</div>
          <ul className="space-y-1 underline opacity-90">
            <li>Desktop</li>
            <li>My Documents</li>
          </ul>
        </aside>

        {/* Project grid */}
        <div className="flex-1 p-3 grid grid-cols-2 gap-3 overflow-y-auto">
          {projects.map((p) => (
            <button
              key={p.id}
              type="button"
              onDoubleClick={() => openWindow(`project:${p.id as ProjectId}`)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') openWindow(`project:${p.id as ProjectId}`)
              }}
              className="flex items-start gap-2 p-2 rounded-sm border border-transparent text-left hover:bg-[#e8f0fb] hover:border-[#9bb6dd] focus:outline-none focus:border-[#2867c8]"
            >
              <ProjectTileIcon color={STATUS_PILL[p.status] ?? '#5e7a9c'} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-[11px] text-[#0a48b8] truncate">
                    {p.name}
                  </span>
                  <span
                    className="text-white text-[9px] px-1 rounded-sm uppercase tracking-wide"
                    style={{ background: STATUS_PILL[p.status] ?? '#5e7a9c' }}
                  >
                    {p.status}
                  </span>
                </div>
                <div className="text-[10px] text-[#444] mt-0.5 line-clamp-3">
                  {p.description}
                </div>
                <div className="text-[10px] text-[#5e7a9c] mt-1">
                  {p.tags.join(' · ')}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div
        className="h-[20px] border-t border-[#a0a0a0] bg-[#ece9d8] px-2 text-[11px] flex items-center"
        style={{ fontFamily: 'Tahoma, sans-serif' }}
      >
        {projects.length} object(s) · double-click to open case study
      </div>
    </Window>
  )
}
