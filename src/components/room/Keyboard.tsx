import { useRef, useLayoutEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

const ROWS = 4
const COLS = 13
const KEY_COUNT = ROWS * COLS
// Key size and spacing in Three.js units
const KEY_W = 0.025
const KEY_H = 0.006
const KEY_D = 0.024
const STEP_X = 0.028   // key width + gap
const STEP_Z = 0.028   // key depth + gap

// WASD-area key indices get the emissive backlight treatment
const GLOW_INDICES = new Set([COLS + 1, COLS + 2, COLS * 2, COLS * 2 + 1, COLS * 2 + 2])

// Module-level dummy — Object3D has no browser APIs so SSR is safe
const _dummy = new THREE.Object3D()

export default function Keyboard() {
  const keysRef = useRef<THREE.InstancedMesh>(null)
  const glowRefs = useRef<(THREE.Mesh | null)[]>([])

  // Pre-compute all key positions in local space (y is raised above keyboard top)
  const keyPositions = useMemo<[number, number, number][]>(() => {
    const startX = -((COLS - 1) * STEP_X) / 2
    const startZ = -((ROWS - 1) * STEP_Z) / 2
    return Array.from({ length: KEY_COUNT }, (_, idx) => {
      const col = idx % COLS
      const row = Math.floor(idx / COLS)
      return [startX + col * STEP_X, 0.013, startZ + row * STEP_Z]
    })
  }, [])

  // Set static instance matrices once before first paint
  useLayoutEffect(() => {
    const mesh = keysRef.current
    if (!mesh) return
    keyPositions.forEach((pos, i) => {
      _dummy.position.set(pos[0], pos[1], pos[2])
      _dummy.updateMatrix()
      mesh.setMatrixAt(i, _dummy.matrix)
    })
    mesh.instanceMatrix.needsUpdate = true
  }, [keyPositions])

  // Slow sin-wave pulse on the glow keys
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    glowRefs.current.forEach((mesh, i) => {
      if (!mesh) return
      const mat = mesh.material as THREE.MeshStandardMaterial
      // Offset each key so they don't all pulse in sync
      mat.emissiveIntensity = 0.25 + Math.sin(t * 1.1 + i * 1.3) * 0.22
    })
  })

  const glowPositions = useMemo(
    () => Array.from(GLOW_INDICES).map((idx) => keyPositions[idx]),
    [keyPositions],
  )

  return (
    // Positioned at front-centre of desk, on surface
    <group position={[0, 0.75, -0.1]}>
      {/* Keyboard chassis */}
      <RoundedBox args={[0.4, 0.02, 0.15]} radius={0.006} smoothness={3} castShadow>
        <meshStandardMaterial color="#1c1a16" roughness={0.84} metalness={0.12} />
      </RoundedBox>

      {/* All standard key caps — single instanced draw call */}
      <instancedMesh ref={keysRef} args={[undefined, undefined, KEY_COUNT]}>
        <boxGeometry args={[KEY_W, KEY_H, KEY_D]} />
        <meshStandardMaterial color="#252320" roughness={0.72} metalness={0} />
      </instancedMesh>

      {/* Backlit WASD-area keys — cyan/blue emissive with pulse */}
      {glowPositions.map((pos, i) => (
        <mesh
          key={i}
          position={pos}
          ref={(el) => { glowRefs.current[i] = el }}
        >
          <boxGeometry args={[KEY_W, KEY_H + 0.001, KEY_D]} />
          <meshStandardMaterial
            color="#001e33"
            emissive="#00aaff"
            emissiveIntensity={0.35}
            roughness={0.5}
          />
        </mesh>
      ))}
    </group>
  )
}
