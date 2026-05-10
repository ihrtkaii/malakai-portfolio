'use client'

import Window from '../Window'
import { NotepadIcon } from '../Icons'
import { notes } from '@/lib/portfolioData'
import { getWindowTitles } from '../windowTitles'

const MENU_ITEMS = ['File', 'Edit', 'Format', 'View', 'Help']

// Notepad-style window holding the admin password hint. The hint is the
// content here — content lives in portfolioData.notes.
export default function NotesWindow() {
  return (
    <Window
      id="notes"
      title={getWindowTitles('notes').full}
      icon={<NotepadIcon size={14} />}
      initialX={460}
      initialY={70}
      width={420}
      height={260}
    >
      <div className="bg-[#ece9d8] border-b border-[#a0a0a0]">
        <div className="flex items-center gap-3 px-2 py-0.5 text-[11px]">
          {MENU_ITEMS.map((m) => (
            <span
              key={m}
              className="px-1 hover:bg-[var(--xp-blue)] hover:text-white cursor-default"
            >
              <u>{m[0]}</u>
              {m.slice(1)}
            </span>
          ))}
        </div>
      </div>
      <div
        className="bg-white p-3 overflow-y-auto h-full"
        style={{
          fontFamily:
            '"Lucida Console", Consolas, "Courier New", monospace',
          fontSize: '13px',
          color: '#000',
          lineHeight: 1.45,
          whiteSpace: 'pre-wrap',
        }}
      >
        {notes.body}
      </div>
    </Window>
  )
}
