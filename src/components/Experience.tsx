'use client'

import { Suspense, lazy } from 'react'
import { useStore } from '@/lib/store'
import LoadingScreen from '@/components/ui/LoadingScreen'
import RoomScene from '@/components/room/RoomScene'

// Lazy-load OS layers — only needed after the 3D phase
const BootSequence = lazy(() => import('@/components/os/BootSequence'))
const PortfolioOS = lazy(() => import('@/components/os/PortfolioOS'))

export default function Experience() {
  const phase = useStore((s) => s.phase)

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {phase === 'loading' && <LoadingScreen />}

      {/* RoomScene owns the R3F Canvas — stays mounted during zooming so the
          camera animation in ZoomTransition (inside Canvas) can run */}
      {(phase === 'room' || phase === 'zooming') && <RoomScene />}

      <Suspense fallback={null}>
        {phase === 'booting' && <BootSequence />}
      </Suspense>

      <Suspense fallback={null}>
        {phase === 'desktop' && <PortfolioOS />}
      </Suspense>
    </div>
  )
}
