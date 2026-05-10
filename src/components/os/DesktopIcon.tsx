'use client'

import { useRef, type ReactNode } from 'react'
import { useStore } from '@/lib/store'
import type { IconId } from '@/types'

interface DesktopIconProps {
  id: IconId
  label: string
  icon: ReactNode
  onActivate: () => void
}

// Single-click selects, double-click activates. We watch raw mousedown so the
// selection visual updates on press (XP behaviour) and use onDoubleClick to
// trigger activation. Touch falls back to a 250ms tap interval.
export default function DesktopIcon({ id, label, icon, onActivate }: DesktopIconProps) {
  const selectedIcon = useStore((s) => s.selectedIcon)
  const selectIcon = useStore((s) => s.selectIcon)
  const isSelected = selectedIcon === id

  const lastTap = useRef<number>(0)

  return (
    <button
      type="button"
      aria-label={label}
      className={`flex flex-col items-center justify-start w-[78px] py-1 px-1 rounded ${
        isSelected ? 'icon-selected' : ''
      } focus:outline-none`}
      onClick={(e) => {
        e.stopPropagation()
        selectIcon(id)
      }}
      onDoubleClick={(e) => {
        e.stopPropagation()
        onActivate()
      }}
      onTouchEnd={(e) => {
        e.stopPropagation()
        const now = Date.now()
        if (now - lastTap.current < 350) {
          onActivate()
        } else {
          selectIcon(id)
        }
        lastTap.current = now
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onActivate()
      }}
    >
      <div className="drop-shadow-[1px_1px_0_rgba(0,0,0,0.5)]">{icon}</div>
      <span
        className={`text-white text-[11px] mt-1 leading-tight text-center break-words drop-shadow-[1px_1px_0_rgba(0,0,0,0.85)] ${
          isSelected ? 'bg-[rgba(20,60,140,0.7)] px-1' : ''
        }`}
        style={{ fontFamily: 'Tahoma, sans-serif' }}
      >
        {label}
      </span>
    </button>
  )
}
