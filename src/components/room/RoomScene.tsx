'use client'

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import Room from './Room'
import Desk from './Desk'
import Monitor from './Monitor'
import Keyboard from './Keyboard'
import DeskItems from './DeskItems'
import Lighting from './Lighting'
import Particles from './Particles'
import PostFX from './PostFX'
import ZoomTransition from '@/components/transition/ZoomTransition'

export default function RoomScene() {
  return (
    <div className="fixed inset-0">
      <Canvas
        shadows
        // Starting camera: eye-level above desk, looking slightly down at the workspace
        camera={{ position: [0, 1.4, 3.5], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, toneMappingExposure: 1.2 }}
      >
        <Suspense fallback={null}>
          <Room />
          <Desk />
          <Monitor />
          <Keyboard />
          <DeskItems />
        </Suspense>

        {/* Lighting and particles don't need Suspense */}
        <Lighting />
        <Particles />

        {/* PostFX last — composites over the full scene */}
        <PostFX />

        {/* ZoomTransition lives inside Canvas so Phase 3 can use useFrame */}
        <ZoomTransition />

        {/*
          Orbit limits keep the camera near eye-level — no floor/ceiling dives.
          minAzimuth/maxAzimuth restrict left-right to ±15° for a cinematic feel.
        */}
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
      </Canvas>
    </div>
  )
}
