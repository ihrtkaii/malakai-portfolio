'use client'

import { Suspense, lazy, useEffect } from 'react'
import { useStore } from '@/lib/store'
import { playSound, stopSound } from '@/lib/sounds'
import LoadingScreen from '@/components/ui/LoadingScreen'
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

// Rain plays while the room is visible. Stops as soon as the camera dives
// into the screen ('zooming-final') so the boot sequence lands in silence.
const RAIN_PHASES = new Set(['room', 'zooming', 'login'])

export default function Experience() {
  const phase = useStore((s) => s.phase)

  useEffect(() => {
    if (RAIN_PHASES.has(phase)) {
      playSound('rain')
    } else {
      stopSound('rain')
    }
  }, [phase])

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {phase === 'loading' && <LoadingScreen />}

      {ROOM_PHASES.has(phase) && <RoomScene />}

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
