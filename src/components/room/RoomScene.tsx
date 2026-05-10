'use client'

import { Suspense, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useStore } from '@/lib/store'
import Room from './Room'
import Desk from './Desk'
import Monitor from './Monitor'
import MonitorHint from './MonitorHint'
import Keyboard from './Keyboard'
import DeskItems from './DeskItems'
import Lighting from './Lighting'
import Particles from './Particles'
import PostFX from './PostFX'
import ZoomTransition, { ZoomFlash } from '@/components/transition/ZoomTransition'

export default function RoomScene() {
  const phase = useStore((s) => s.phase)

  // Pick initial camera based on the phase we're remounting into. Switch-out
  // remounts RoomScene fresh — the camera should already be "inside" the
  // screen when the user clicks Switch User, so the lerp visually pulls back.
  // ZoomTransition's useEffect also re-snaps these the same frame, but the
  // initial prop avoids a single-frame flash at room defaults.
  const initialCamera = useMemo<{ position: [number, number, number]; fov: number }>(
    () =>
      phase === 'switching-out'
        ? { position: [0, 1.4, 1.2], fov: 15 }
        : { position: [0, 1.4, 3.5], fov: 45 },
    [phase],
  )

  return (
    <div className="fixed inset-0">
      <Canvas
        shadows
        camera={initialCamera}
        dpr={[1, 2]}
        gl={{ antialias: true, toneMappingExposure: 1.2 }}
      >
        <Suspense fallback={null}>
          <Room />
          <Desk />
          <Monitor />
          {phase === 'room' && <MonitorHint />}
          <Keyboard />
          <DeskItems />
        </Suspense>

        {/* Lighting and particles don't need Suspense */}
        <Lighting />
        <Particles />

        {/* PostFX last — composites over the full scene */}
        <PostFX />

        {/* Camera lerp during the zoom phase. Inside Canvas for useFrame access. */}
        <ZoomTransition />

        {/*
          Orbit limits keep the camera near eye-level — no floor/ceiling dives.
          Disabled during 'zooming' so OrbitControls doesn't fight the lerp.
        */}
        {phase === 'room' && (
          <OrbitControls
            target={[0, 1.0, 0]}
            enableZoom={false}
            enablePan={false}
            minPolarAngle={Math.PI / 2.4}
            maxPolarAngle={Math.PI / 2}
            minAzimuthAngle={-Math.PI / 12}
            maxAzimuthAngle={Math.PI / 12}
            enableDamping
            dampingFactor={0.05}
          />
        )}
      </Canvas>

      {/* CRT flash overlay — DOM, must live outside the Canvas */}
      <ZoomFlash />
    </div>
  )
}
