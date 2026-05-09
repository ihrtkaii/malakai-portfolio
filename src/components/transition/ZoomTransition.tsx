import { useEffect } from 'react'
import { useStore } from '@/lib/store'

// Phase 3 replaces this with useFrame camera lerp + CRT flash overlay
export default function ZoomTransition() {
  const phase = useStore((s) => s.phase)
  const setPhase = useStore((s) => s.setPhase)

  useEffect(() => {
    if (phase !== 'zooming') return
    const t = setTimeout(() => setPhase('booting'), 300)
    return () => clearTimeout(t)
  }, [phase, setPhase])

  return null
}
