'use client'

import { useEffect } from 'react'
import { useStore } from '@/lib/store'

export default function LoadingScreen() {
  const setPhase = useStore((s) => s.setPhase)

  useEffect(() => {
    const timer = setTimeout(() => setPhase('room'), 1800)
    return () => clearTimeout(timer)
  }, [setPhase])

  return (
    <div className="fixed inset-0 bg-[var(--bg-base)] flex flex-col items-center justify-center font-mono select-none">
      <div className="text-[var(--accent-green)] text-5xl font-bold tracking-[0.3em] mb-2">
        MALAKAI
      </div>
      <div className="text-[var(--text-muted)] text-xs tracking-[0.25em] mb-10">
        SOC ANALYST PORTFOLIO
      </div>
      <div className="flex gap-[3px]">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="w-[3px] h-5 bg-[var(--accent-green)] animate-pulse"
            style={{ animationDelay: `${i * 0.12}s` }}
          />
        ))}
      </div>
      <div className="text-[var(--text-dim)] text-[10px] tracking-widest mt-5">
        INITIALIZING...
      </div>
    </div>
  )
}
