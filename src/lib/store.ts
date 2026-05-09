import { create } from 'zustand'
import type { Phase, WindowId } from '@/types'

interface State {
  phase: Phase
  setPhase: (p: Phase) => void
  openWindows: WindowId[]
  focusedWindow: WindowId | null
  openWindow: (id: WindowId) => void
  closeWindow: (id: WindowId) => void
  focusWindow: (id: WindowId) => void
  reducedMotion: boolean
}

export const useStore = create<State>((set) => ({
  phase: 'loading',
  setPhase: (p) => set({ phase: p }),

  openWindows: [],
  focusedWindow: null,

  openWindow: (id) =>
    set((s) => ({
      openWindows: s.openWindows.includes(id) ? s.openWindows : [...s.openWindows, id],
      focusedWindow: id,
    })),

  closeWindow: (id) =>
    set((s) => ({
      openWindows: s.openWindows.filter((w) => w !== id),
      focusedWindow: s.focusedWindow === id ? null : s.focusedWindow,
    })),

  focusWindow: (id) => set({ focusedWindow: id }),

  reducedMotion:
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false,
}))
