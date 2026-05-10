'use client'

import { useEffect, useState } from 'react'
import { useStore } from '@/lib/store'
import { getWindowTitles } from './windowTitles'
import { StartFlagIcon, WifiIcon, SpeakerIcon } from './Icons'
import StartMenu from './StartMenu'

function formatClock(d: Date): string {
  let hours = d.getHours()
  const minutes = d.getMinutes()
  const ampm = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12 || 12
  return `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`
}

export default function Taskbar() {
  const openWindows = useStore((s) => s.openWindows)
  const focusedWindow = useStore((s) => s.focusedWindow)
  const minimizedWindows = useStore((s) => s.minimizedWindows)
  const focusWindow = useStore((s) => s.focusWindow)
  const minimizeWindow = useStore((s) => s.minimizeWindow)
  const restoreWindow = useStore((s) => s.restoreWindow)

  const [startOpen, setStartOpen] = useState(false)

  // Tick the clock every 30s — minute resolution doesn't need a 1Hz timer.
  const [now, setNow] = useState<Date | null>(null)
  useEffect(() => {
    setNow(new Date())
    const t = setInterval(() => setNow(new Date()), 30_000)
    return () => clearInterval(t)
  }, [])

  return (
    <div
      className="absolute bottom-0 left-0 right-0 h-[32px] flex items-stretch aero-taskbar select-none"
      style={{ zIndex: 1000, fontFamily: 'Tahoma, sans-serif' }}
    >
      {/* Start button + menu */}
      <div className="relative">
        <button
          type="button"
          aria-label="Start"
          aria-expanded={startOpen}
          onClick={(e) => {
            e.stopPropagation()
            setStartOpen((o) => !o)
          }}
          className={`aero-start flex items-center gap-1.5 pl-2 pr-4 h-full font-bold italic text-[13px] ${
            startOpen ? 'is-open' : ''
          }`}
          style={startOpen ? { filter: 'brightness(0.88)' } : undefined}
        >
          <StartFlagIcon size={18} />
          <span>start</span>
        </button>
        {startOpen && <StartMenu onClose={() => setStartOpen(false)} />}
      </div>

      {/* Open task buttons */}
      <div className="flex-1 flex items-center gap-1 px-2 overflow-hidden">
        {openWindows.map((id) => {
          const { short } = getWindowTitles(id)
          const isFocused = focusedWindow === id
          const isMinimized = minimizedWindows.includes(id)
          return (
            <button
              key={id}
              type="button"
              onClick={() => {
                // XP behaviour: click your own focused button → minimize.
                // Click a minimized one → restore. Otherwise → focus.
                if (isMinimized) restoreWindow(id)
                else if (isFocused) minimizeWindow(id)
                else focusWindow(id)
              }}
              className={`aero-task-btn h-[24px] px-3 text-[11px] truncate max-w-[160px] ${
                isFocused && !isMinimized ? 'is-focused' : ''
              }`}
              title={short}
            >
              {short}
            </button>
          )
        })}
      </div>

      {/* System tray */}
      <div
        className="flex items-center gap-2 px-3 h-full text-white text-[11px]"
        style={{
          background:
            'linear-gradient(to bottom, rgba(255,255,255,0.18) 0%, rgba(0,0,0,0.18) 100%)',
          borderLeft: '1px solid #5e8de0',
          textShadow: '0 1px 1px rgba(0,0,0,0.5)',
        }}
      >
        <WifiIcon size={14} />
        <SpeakerIcon size={14} />
        <span className="tabular-nums" suppressHydrationWarning>
          {now ? formatClock(now) : ''}
        </span>
      </div>
    </div>
  )
}
