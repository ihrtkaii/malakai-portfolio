'use client'

import { useEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'

// Subtle hint that fades in 3s after the room first renders, then breathes.
// Unmounts when phase leaves 'room' (parent gates it), so click → vanish is automatic.
const APPEAR_DELAY_MS = 3000
const FADE_IN_S = 1.0
// Just below the monitor screen lower edge (~y 1.02), floating above the keyboard area.
const HINT_POSITION: [number, number, number] = [0, 0.92, -0.45]

// Opt-out of raycasting so the hint never intercepts pointer events meant for the monitor
const noRaycast = () => null

export default function MonitorHint() {
  const matRef = useRef<THREE.MeshBasicMaterial>(null)
  const [appearedAt, setAppearedAt] = useState<number | null>(null)

  useEffect(() => {
    const t = window.setTimeout(() => setAppearedAt(performance.now()), APPEAR_DELAY_MS)
    return () => window.clearTimeout(t)
  }, [])

  useFrame(({ clock }) => {
    if (!matRef.current || appearedAt === null) return
    const elapsed = (performance.now() - appearedAt) / 1000
    // Gentle envelope: ramp up to 1 over FADE_IN_S
    const fadeIn = Math.min(elapsed / FADE_IN_S, 1)
    // Slow breathing pulse, ~4.5s period — subtle, not blinking
    const pulse = 0.7 + Math.sin(clock.getElapsedTime() * 1.4) * 0.25
    matRef.current.opacity = fadeIn * pulse
  })

  return (
    <Text
      position={HINT_POSITION}
      fontSize={0.05}
      letterSpacing={0.04}
      anchorX="center"
      anchorY="middle"
      raycast={noRaycast}
    >
      ▸ click to enter
      {/* toneMapped=false keeps the green crisp through the bloom pass */}
      <meshBasicMaterial
        ref={matRef}
        color="#00ff88"
        transparent
        opacity={0}
        toneMapped={false}
        depthWrite={false}
      />
    </Text>
  )
}
