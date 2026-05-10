'use client'

import { useEffect, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '@/lib/store'
import { playSound } from '@/lib/sounds'
import type { Phase } from '@/types'

// ── Camera waypoints ──────────────────────────────────────────────
// MEDIUM = full monitor visible (bezels + screen). Where the logon screen sits.
// DEEP   = camera dives close to the screen face, used right before booting.
const MEDIUM_POS = new THREE.Vector3(0, 1.4, 2.0)
const MEDIUM_FOV = 30
const DEEP_POS = new THREE.Vector3(0, 1.4, 1.2)
const DEEP_FOV = 15
const LOOK_AT = new THREE.Vector3(0, 1.18, -0.602)

interface Lerp {
  startPos: THREE.Vector3
  startFov: number
  endPos: THREE.Vector3
  endFov: number
  duration: number // seconds
  // Phase to advance to when the lerp finishes.
  next: Phase
  // Whether to play the CRT flash overlay between this lerp and the next phase.
  flashOnComplete: boolean
}

const ZOOM_DURATION = 1.2
const FLASH_DURATION = 0.6
const SWITCH_DURATION = 1.0

// What kind of lerp does each animated phase use? "current" means snapshot
// the camera's current position at lerp-start (used for the initial room
// → medium zoom where the user could be at any orbit angle).
function lerpFor(phase: Phase, currentPos: THREE.Vector3, currentFov: number): Lerp | null {
  switch (phase) {
    case 'zooming':
      return {
        startPos: currentPos.clone(),
        startFov: currentFov,
        endPos: MEDIUM_POS,
        endFov: MEDIUM_FOV,
        duration: ZOOM_DURATION,
        next: 'login',
        flashOnComplete: false,
      }
    case 'zooming-final':
      return {
        startPos: MEDIUM_POS.clone(),
        startFov: MEDIUM_FOV,
        endPos: DEEP_POS,
        endFov: DEEP_FOV,
        duration: 0.9,
        next: 'booting',
        flashOnComplete: true,
      }
    case 'switching-out':
      return {
        startPos: DEEP_POS.clone(),
        startFov: DEEP_FOV,
        endPos: MEDIUM_POS,
        endFov: MEDIUM_FOV,
        duration: SWITCH_DURATION,
        next: 'login',
        flashOnComplete: false,
      }
    case 'switching-in':
      return {
        startPos: MEDIUM_POS.clone(),
        startFov: MEDIUM_FOV,
        endPos: DEEP_POS,
        endFov: DEEP_FOV,
        duration: SWITCH_DURATION,
        next: 'desktop',
        flashOnComplete: false,
      }
    default:
      return null
  }
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

// Inside-Canvas: lerps PerspectiveCamera position + fov whenever phase is one
// of the animated zoom states. Mounted as a sibling of the scene so useFrame
// is available.
export default function ZoomTransition() {
  const phase = useStore((s) => s.phase)
  const { camera } = useThree()
  const lerpRef = useRef<{ lerp: Lerp; t0: number } | null>(null)

  useEffect(() => {
    if (!(camera instanceof THREE.PerspectiveCamera)) return

    const lerp = lerpFor(phase, camera.position, camera.fov)
    if (!lerp) {
      lerpRef.current = null
      return
    }

    // For switch-user-out, the camera was just (re)mounted at room defaults
    // — snap to the deep position so the lerp visually pulls back from
    // "inside the screen". For other phases, the camera is already at the
    // right starting waypoint thanks to the previous phase's end state.
    if (phase === 'switching-out') {
      camera.position.copy(DEEP_POS)
      camera.fov = DEEP_FOV
      camera.lookAt(LOOK_AT)
      camera.updateProjectionMatrix()
    }

    lerpRef.current = { lerp, t0: performance.now() }
  }, [phase, camera])

  useFrame(() => {
    if (!lerpRef.current) return
    if (!(camera instanceof THREE.PerspectiveCamera)) return
    const { lerp, t0 } = lerpRef.current
    const elapsed = (performance.now() - t0) / 1000
    const t = Math.min(elapsed / lerp.duration, 1)
    const eased = easeInOutCubic(t)
    camera.position.lerpVectors(lerp.startPos, lerp.endPos, eased)
    camera.fov = THREE.MathUtils.lerp(lerp.startFov, lerp.endFov, eased)
    camera.lookAt(LOOK_AT)
    camera.updateProjectionMatrix()
  })

  return null
}

// Outside-Canvas: phase-completion overlay. Plays the CRT flash for
// 'zooming-final' (the dive-into-screen) and advances phases on completion
// for every animated zoom. Honors prefers-reduced-motion by jump-cutting.
export function ZoomFlash() {
  const phase = useStore((s) => s.phase)
  const setPhase = useStore((s) => s.setPhase)
  const reducedMotion = useStore((s) => s.reducedMotion)
  const [flashing, setFlashing] = useState(false)

  useEffect(() => {
    setFlashing(false)
    // Use a fake current pos — the lerpFor call here only needs the phase
    // metadata (duration, next, flashOnComplete), not the actual start
    // position which the inner camera lerp owns.
    const dummyPos = new THREE.Vector3()
    const lerp = lerpFor(phase, dummyPos, 0)
    if (!lerp) return

    if (reducedMotion) {
      // Jump cut: no flash, no sound, advance immediately.
      setPhase(lerp.next)
      return
    }

    const flashAt = lerp.flashOnComplete
      ? window.setTimeout(() => {
          setFlashing(true)
          playSound('crt-on')
        }, lerp.duration * 1000)
      : null

    const total = lerp.flashOnComplete ? lerp.duration + FLASH_DURATION : lerp.duration
    const doneAt = window.setTimeout(() => setPhase(lerp.next), total * 1000)

    return () => {
      if (flashAt != null) window.clearTimeout(flashAt)
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
