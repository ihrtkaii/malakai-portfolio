'use client'

import { Suspense, lazy } from 'react'
import { useStore } from '@/lib/store'
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

export default function Experience() {
  const phase = useStore((s) => s.phase)

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
