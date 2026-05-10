'use client'

import { Suspense, lazy, useEffect, useRef } from 'react'
import { useStore } from '@/lib/store'
import { playSound, stopSound } from '@/lib/sounds'
import RoomScene from '@/components/room/RoomScene'

const LoginScreen = lazy(() => import('@/components/login/LoginScreen'))
const BootSequence = lazy(() => import('@/components/os/BootSequence'))
const PortfolioOS = lazy(() => import('@/components/os/PortfolioOS'))
const AdminEggSequence = lazy(
  () => import('@/components/adminEgg/AdminEggSequence'),
)

// RoomScene must stay mounted for every phase that uses the 3D camera —
// including 'login' (so the camera can hold at MEDIUM until the next zoom
// kicks off without the Canvas remounting and resetting position).
const ROOM_PHASES = new Set([
  'room',
  'zooming',
  'login',
  'zooming-final',
  'switching-out',
  'switching-in',
])

// Rain plays from the first room load through the zoom-in toward the
// monitor. It cuts the moment the logon screen appears.
const RAIN_PHASES = new Set(['room', 'zooming'])

export default function Experience() {
  const phase = useStore((s) => s.phase)

  // Stop rain when leaving the room/login phases. Starting it is handled by
  // the one-shot interaction listener below — browser autoplay policy blocks
  // a play() call before the user has touched the page.
  useEffect(() => {
    if (!RAIN_PHASES.has(phase)) {
      stopSound('rain')
    }
  }, [phase])

  // Hold the latest phase in a ref so the one-shot interaction listener can
  // read it without resubscribing each phase change.
  const phaseRef = useRef(phase)
  phaseRef.current = phase

  // Browsers gate audio behind a user gesture. Wait for the first interaction
  // anywhere on the page, then start rain if we're still in a phase that
  // wants it. The `started` flag guards against pointerdown + keydown both
  // firing before either listener detaches.
  useEffect(() => {
    let started = false
    const start = () => {
      if (started) return
      started = true
      if (RAIN_PHASES.has(phaseRef.current)) {
        playSound('rain')
      }
    }
    document.addEventListener('pointerdown', start, { once: true })
    document.addEventListener('keydown', start, { once: true })
    return () => {
      document.removeEventListener('pointerdown', start)
      document.removeEventListener('keydown', start)
    }
  }, [])

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">
      {ROOM_PHASES.has(phase) && (
        <div className="room-fade-in absolute inset-0">
          <RoomScene />
        </div>
      )}

      <Suspense fallback={null}>
        {phase === 'login' && <LoginScreen />}
      </Suspense>

      <Suspense fallback={null}>
        {phase === 'booting' && <BootSequence />}
      </Suspense>

      <Suspense fallback={null}>
        {phase === 'desktop' && <PortfolioOS />}
      </Suspense>

      <Suspense fallback={null}>
        {phase === 'admin-egg' && <AdminEggSequence />}
      </Suspense>
    </div>
  )
}
