'use client'

import { useEffect, useState } from 'react'
import { useStore } from '@/lib/store'
import { playSound } from '@/lib/sounds'

// Boot timing — 8 lines × 400ms = 3.2s; bar fills over 3s, then last line sits ~200ms
const TOTAL_DURATION_MS = 3200
const BAR_DURATION_MS = 3000
const CHUNK_COUNT = 24
const BAR_TICK_MS = BAR_DURATION_MS / CHUNK_COUNT

const BOOT_LINES = [
  'starting up...',
  'detecting hardware...',
  'loading kernel modules...',
  'initializing network stack...',
  'mounting filesystem...',
  'loading user profile: malakai',
  'starting desktop environment...',
  'welcome.',
]
const LINE_INTERVAL_MS = TOTAL_DURATION_MS / BOOT_LINES.length

export default function BootSequence() {
  const setPhase = useStore((s) => s.setPhase)
  const reducedMotion = useStore((s) => s.reducedMotion)
  const [chunksFilled, setChunksFilled] = useState(0)
  const [lineIdx, setLineIdx] = useState(0)

  useEffect(() => {
    if (reducedMotion) {
      // Skip the cinematic boot — jump straight to the desktop
      setPhase('desktop')
      return
    }

    playSound('boot')

    const barTimer = window.setInterval(() => {
      setChunksFilled((c) => (c < CHUNK_COUNT ? c + 1 : c))
    }, BAR_TICK_MS)

    const lineTimer = window.setInterval(() => {
      setLineIdx((i) => (i < BOOT_LINES.length - 1 ? i + 1 : i))
    }, LINE_INTERVAL_MS)

    const done = window.setTimeout(() => setPhase('desktop'), TOTAL_DURATION_MS)

    return () => {
      window.clearInterval(barTimer)
      window.clearInterval(lineTimer)
      window.clearTimeout(done)
    }
  }, [reducedMotion, setPhase])

  // Render nothing for reduced-motion users; the effect above hands off to desktop
  if (reducedMotion) return null

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center font-mono">
      <div className="flex flex-col items-center gap-6">
        {/* Brand wordmark — letter-spaced; pl compensates for trailing tracking gap */}
        <div className="text-text-primary text-6xl font-semibold tracking-[0.4em] pl-[0.4em] select-none">
          SOC OS
        </div>

        {/* Version line */}
        <div className="text-text-dim text-xs tracking-widest">
          v5.1.2026 · kernel 6.1.0-malakai
        </div>

        {/* XP-style chunked progress bar */}
        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={CHUNK_COUNT}
          aria-valuenow={chunksFilled}
          aria-label="Boot progress"
          className="flex items-center gap-[2px] p-[3px] border border-text-dim bg-bg-surface"
          style={{ width: '240px', height: '18px' }}
        >
          {Array.from({ length: CHUNK_COUNT }).map((_, i) => {
            const lit = i < chunksFilled
            return (
              <div
                key={i}
                className="h-full flex-1 transition-colors duration-150"
                style={{
                  background: lit ? 'var(--accent-green)' : 'transparent',
                  boxShadow: lit ? '0 0 4px var(--accent-green)' : 'none',
                }}
              />
            )
          })}
        </div>

        {/* Rotating status — fixed height prevents layout shift between lines */}
        <div
          aria-live="polite"
          className="text-text-muted text-sm tracking-wide h-5 leading-5"
        >
          {BOOT_LINES[lineIdx]}
        </div>
      </div>
    </div>
  )
}
