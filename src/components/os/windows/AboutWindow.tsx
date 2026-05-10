'use client'

import Window from '../Window'
import { NotepadIcon } from '../Icons'
import { about, profile } from '@/lib/portfolioData'
import { getWindowTitles } from '../windowTitles'

const MENU_ITEMS = ['File', 'Edit', 'Format', 'View', 'Help']

export default function AboutWindow() {
  return (
    <Window
      id="about"
      title={getWindowTitles('about').full}
      icon={<NotepadIcon size={14} />}
      initialX={120}
      initialY={70}
      width={520}
      height={380}
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
          fontSize: '12px',
          color: '#000',
          lineHeight: 1.45,
          whiteSpace: 'pre-wrap',
        }}
      >
        {`> ${profile.name} — ${profile.title}\n` +
          `> ${profile.location}\n` +
          `\n` +
          about}
      </div>
    </Window>
  )
}
