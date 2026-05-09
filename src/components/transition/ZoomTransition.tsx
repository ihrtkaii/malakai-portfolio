'use client'

import { useEffect, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '@/lib/store'
import { playSound } from '@/lib/sounds'

// Phase 3 — cinematic dive into the monitor.
// Total budget: 1.2s camera lerp + 0.6s CRT flash = 1.8s before phase → 'booting'.
const ZOOM_DURATION = 1.2  // seconds
const FLASH_DURATION = 0.6 // seconds
const TOTAL_DURATION = ZOOM_DURATION + FLASH_DURATION

// Brief target. Monitor screen world center is ~(0, 1.16, -0.624); camera ends
// short of the screen so the CRT flash sells the "punch through" moment.
const TARGET_POS = new THREE.Vector3(0, 1.4, 1.2)
const TARGET_FOV = 15
// Look at the screen center so the lerp framing stays locked on the monitor.
const LOOK_AT = new THREE.Vector3(0, 1.16, -0.624)

// ease-in-out cubic — slow start, fast middle, soft arrival
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

// Inside-Canvas: lerps PerspectiveCamera position + fov toward the monitor while
// phase === 'zooming'. Mounted as a sibling of the scene so useFrame is available.
export default function ZoomTransition() {
  const phase = useStore((s) => s.phase)
  const { camera } = useThree()
  const startRef = useRef<{ pos: THREE.Vector3; fov: number; t0: number } | null>(null)

  useEffect(() => {
    if (phase !== 'zooming') {
      startRef.current = null
      return
    }
    if (!(camera instanceof THREE.PerspectiveCamera)) return
    // Snapshot the user's current orbit position so the lerp is from-wherever-they-are
    startRef.current = {
      pos: camera.position.clone(),
      fov: camera.fov,
      t0: performance.now(),
    }
  }, [phase, camera])

  useFrame(() => {
    if (phase !== 'zooming' || !startRef.current) return
    if (!(camera instanceof THREE.PerspectiveCamera)) return
    const elapsed = (performance.now() - startRef.current.t0) / 1000
    const t = Math.min(elapsed / ZOOM_DURATION, 1)
    const eased = easeInOutCubic(t)
    camera.position.lerpVectors(startRef.current.pos, TARGET_POS, eased)
    camera.fov = THREE.MathUtils.lerp(startRef.current.fov, TARGET_FOV, eased)
    camera.lookAt(LOOK_AT)
    camera.updateProjectionMatrix()
  })

  return null
}

// Outside-Canvas: full-screen DOM overlay that flashes after the camera lerp
// completes, then advances the phase machine. Honors prefers-reduced-motion by
// jump-cutting straight to 'booting' (no flash, no sound).
export function ZoomFlash() {
  const phase = useStore((s) => s.phase)
  const setPhase = useStore((s) => s.setPhase)
  const reducedMotion = useStore((s) => s.reducedMotion)
  const [flashing, setFlashing] = useState(false)

  useEffect(() => {
    if (phase !== 'zooming') {
      setFlashing(false)
      return
    }

    if (reducedMotion) {
      setPhase('booting')
      return
    }

    const flashAt = window.setTimeout(() => {
      setFlashing(true)
      playSound('crt-on')
    }, ZOOM_DURATION * 1000)

    const doneAt = window.setTimeout(
      () => setPhase('booting'),
      TOTAL_DURATION * 1000
    )

    return () => {
      window.clearTimeout(flashAt)
      window.clearTimeout(doneAt)
    }
  }, [phase, reducedMotion, setPhase])

  if (!flashing) return null

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-50 crt-flash"
      style={{
        background:
          'radial-gradient(circle at center, rgba(0,255,136,0.95) 0%, rgba(0,90,50,0.45) 45%, rgba(0,0,0,0) 80%)',
        animationDuration: `${FLASH_DURATION}s`,
      }}
    />
  )
}
