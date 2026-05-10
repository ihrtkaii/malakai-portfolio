'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { useStore } from '@/lib/store'
import { useDraggable } from '@/hooks/useDraggable'
import type { WindowId } from '@/types'

interface WindowProps {
  id: WindowId
  title: string
  icon?: ReactNode
  // Default top-left placement when first opened. Real OS would cascade — we
  // accept an explicit per-window initial so the registry can fan windows out.
  initialX?: number
  initialY?: number
  width?: number
  height?: number
  // Most windows have a fixed body height; project case studies need to scroll.
  scrollable?: boolean
  children: ReactNode
}

// Taskbar height — kept in sync with Taskbar.tsx so maximized windows stop
// just above it.
const TASKBAR_PX = 32

export default function Window({
  id,
  title,
  icon,
  initialX = 80,
  initialY = 70,
  width = 540,
  height,
  scrollable = false,
  children,
}: WindowProps) {
  const { position, handleMouseDown, handleTouchStart } = useDraggable({
    x: initialX,
    y: initialY,
  })

  const closeWindow = useStore((s) => s.closeWindow)
  const focusWindow = useStore((s) => s.focusWindow)
  const minimizeWindow = useStore((s) => s.minimizeWindow)
  const toggleMaximize = useStore((s) => s.toggleMaximize)
  const openWindows = useStore((s) => s.openWindows)
  const focusedWindow = useStore((s) => s.focusedWindow)
  const isMinimized = useStore((s) => s.minimizedWindows.includes(id))
  const isMaximized = useStore((s) => s.maximizedWindows.includes(id))

  // Z-order from store stack — base 100 so the taskbar (z-1000) stays on top.
  const stackIndex = openWindows.indexOf(id)
  const z = 100 + (stackIndex < 0 ? 0 : stackIndex)
  const isFocused = focusedWindow === id

  // Bring to front on any pointer-down anywhere in the window.
  const onFocusGrab = () => {
    if (!isFocused) focusWindow(id)
  }

  // ESC closes the focused window — accessibility per BRIEF.
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!isFocused) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeWindow(id)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isFocused, id, closeWindow])

  // Compute frame position/size. Maximized fills the viewport above the
  // taskbar; minimized hides via display:none (component stays mounted so
  // CMD history etc. survive).
  const frameStyle: React.CSSProperties = isMaximized
    ? {
        left: 0,
        top: 0,
        width: '100vw',
        height: `calc(100vh - ${TASKBAR_PX}px)`,
        zIndex: z,
      }
    : {
        left: position.x,
        top: position.y,
        width,
        zIndex: z,
      }

  if (isMinimized) {
    frameStyle.display = 'none'
  }

  // When maximized, the body fills the remaining frame height so child
  // panes can scroll naturally instead of getting cut off.
  const maxBodyHeight = `calc(100vh - ${TASKBAR_PX + 26}px)`

  return (
    <div
      ref={ref}
      role="dialog"
      aria-label={title}
      className="absolute aero-window aero-window-anim font-tahoma text-[11px] text-[#111]"
      style={frameStyle}
      onMouseDown={onFocusGrab}
      onTouchStart={onFocusGrab}
    >
      {/* ── Title bar ───────────────────────────────────────────── */}
      <div
        className={`flex items-center select-none px-1 h-[26px] ${
          isMaximized ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'
        } ${isFocused ? 'aero-titlebar' : 'aero-titlebar-inactive'}`}
        onMouseDown={(e) => {
          // Avoid drag-starting when grabbing a control button, and lock
          // dragging while maximized (XP behaviour).
          const target = e.target as HTMLElement
          if (target.closest('[data-titlebar-ctrl]')) return
          if (isMaximized) return
          handleMouseDown(e)
        }}
        onTouchStart={(e) => {
          if (isMaximized) return
          handleTouchStart(e)
        }}
        onDoubleClick={(e) => {
          e.preventDefault()
          // XP: double-click title bar toggles maximize.
          toggleMaximize(id)
        }}
      >
        {icon && <div className="ml-1 mr-1.5 flex items-center">{icon}</div>}
        <div className="flex-1 text-white text-[11px] font-bold tracking-tight truncate drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
          {title}
        </div>
        <div className="flex items-center gap-[2px]" data-titlebar-ctrl>
          <button
            type="button"
            aria-label="Minimize"
            className="aero-ctrl-btn aero-ctrl-min"
            onClick={(e) => {
              e.stopPropagation()
              minimizeWindow(id)
            }}
          >
            _
          </button>
          <button
            type="button"
            aria-label={isMaximized ? 'Restore' : 'Maximize'}
            className="aero-ctrl-btn aero-ctrl-max"
            onClick={(e) => {
              e.stopPropagation()
              toggleMaximize(id)
            }}
          >
            {isMaximized ? '❐' : '□'}
          </button>
          <button
            type="button"
            aria-label="Close"
            className="aero-ctrl-btn aero-ctrl-close"
            onClick={(e) => {
              e.stopPropagation()
              closeWindow(id)
            }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* ── Body ────────────────────────────────────────────────── */}
      <div
        className={scrollable ? 'overflow-y-auto' : 'overflow-hidden'}
        style={{
          height: isMaximized ? maxBodyHeight : (height ?? 'auto'),
          maxHeight: isMaximized ? maxBodyHeight : 'calc(100vh - 120px)',
          padding: 0,
        }}
      >
        {children}
      </div>
    </div>
  )
}
