import { create } from 'zustand'
import type { Phase, WindowId, IconId } from '@/types'

interface State {
  phase: Phase
  setPhase: (p: Phase) => void

  // openWindows is z-ordered: index 0 = bottom, last = top (focused).
  openWindows: WindowId[]
  focusedWindow: WindowId | null
  // Minimized windows stay in openWindows (so the taskbar still tracks them)
  // but render hidden so per-window state (cmd history, scroll, position) is
  // preserved across hide/restore cycles.
  minimizedWindows: WindowId[]
  maximizedWindows: WindowId[]

  openWindow: (id: WindowId) => void
  closeWindow: (id: WindowId) => void
  focusWindow: (id: WindowId) => void
  minimizeWindow: (id: WindowId) => void
  restoreWindow: (id: WindowId) => void
  toggleMaximize: (id: WindowId) => void

  selectedIcon: IconId | null
  selectIcon: (id: IconId | null) => void

  // Played the desktop arrival jingle exactly once. Without this, switching
  // user → returning to desktop would replay it on every cycle.
  hasPlayedStartup: boolean
  markStartupPlayed: () => void

  // True while the logon screen is being shown as a "Switch User" interlude
  // rather than the initial cold-boot login. Drives the Cancel button +
  // determines whether successful login skips the boot sequence.
  isSwitchUserLogin: boolean
  setSwitchUserLogin: (v: boolean) => void

  reducedMotion: boolean
}

// Pick the topmost open, non-minimized window — used when the focused window
// goes away (closed or minimized) and we need to hand focus to whatever the
// user can still see.
function nextVisibleFocus(
  openWindows: WindowId[],
  minimized: WindowId[],
  excluding?: WindowId,
): WindowId | null {
  for (let i = openWindows.length - 1; i >= 0; i--) {
    const id = openWindows[i]
    if (id === excluding) continue
    if (minimized.includes(id)) continue
    return id
  }
  return null
}

export const useStore = create<State>((set) => ({
  phase: 'loading',
  setPhase: (p) => set({ phase: p }),

  openWindows: [],
  focusedWindow: null,
  minimizedWindows: [],
  maximizedWindows: [],

  // Open or raise: remove any existing instance, then push to top of stack.
  // Always un-minimizes — clicking a desktop icon for a minimized window
  // should behave like restoring it.
  openWindow: (id) =>
    set((s) => {
      const without = s.openWindows.filter((w) => w !== id)
      return {
        openWindows: [...without, id],
        minimizedWindows: s.minimizedWindows.filter((w) => w !== id),
        focusedWindow: id,
      }
    }),

  closeWindow: (id) =>
    set((s) => {
      const next = s.openWindows.filter((w) => w !== id)
      const minimized = s.minimizedWindows.filter((w) => w !== id)
      return {
        openWindows: next,
        minimizedWindows: minimized,
        maximizedWindows: s.maximizedWindows.filter((w) => w !== id),
        focusedWindow:
          s.focusedWindow === id ? nextVisibleFocus(next, minimized) : s.focusedWindow,
      }
    }),

  // Raise window to top of z-stack and mark focused.
  focusWindow: (id) =>
    set((s) => {
      if (!s.openWindows.includes(id)) return { focusedWindow: id }
      const without = s.openWindows.filter((w) => w !== id)
      return {
        openWindows: [...without, id],
        minimizedWindows: s.minimizedWindows.filter((w) => w !== id),
        focusedWindow: id,
      }
    }),

  minimizeWindow: (id) =>
    set((s) => {
      if (!s.openWindows.includes(id)) return {}
      const minimized = s.minimizedWindows.includes(id)
        ? s.minimizedWindows
        : [...s.minimizedWindows, id]
      return {
        minimizedWindows: minimized,
        focusedWindow:
          s.focusedWindow === id
            ? nextVisibleFocus(s.openWindows, minimized, id)
            : s.focusedWindow,
      }
    }),

  // Bring back from minimized + focus on top.
  restoreWindow: (id) =>
    set((s) => {
      const without = s.openWindows.filter((w) => w !== id)
      return {
        openWindows: s.openWindows.includes(id) ? [...without, id] : s.openWindows,
        minimizedWindows: s.minimizedWindows.filter((w) => w !== id),
        focusedWindow: id,
      }
    }),

  toggleMaximize: (id) =>
    set((s) => {
      const isMax = s.maximizedWindows.includes(id)
      return {
        maximizedWindows: isMax
          ? s.maximizedWindows.filter((w) => w !== id)
          : [...s.maximizedWindows, id],
        // Toggling max also focuses the window (XP/Luna behaviour).
        openWindows: s.openWindows.includes(id)
          ? [...s.openWindows.filter((w) => w !== id), id]
          : s.openWindows,
        minimizedWindows: s.minimizedWindows.filter((w) => w !== id),
        focusedWindow: id,
      }
    }),

  selectedIcon: null,
  selectIcon: (id) => set({ selectedIcon: id }),

  hasPlayedStartup: false,
  markStartupPlayed: () => set({ hasPlayedStartup: true }),

  isSwitchUserLogin: false,
  setSwitchUserLogin: (v) => set({ isSwitchUserLogin: v }),

  reducedMotion:
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false,
}))
