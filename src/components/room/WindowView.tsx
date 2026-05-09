import { useRef, useMemo, useLayoutEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const RAIN_COUNT = 180
const BUILDING_COUNT = 28

// Positions buildings and rain within the 2×1.5 window opening
export default function WindowView() {
  const rainRef = useRef<THREE.InstancedMesh>(null)
  const buildingRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  // Building layout: random widths/heights across the window width
  const buildings = useMemo(() =>
    Array.from({ length: BUILDING_COUNT }, (_, i) => ({
      x: -0.95 + (i / BUILDING_COUNT) * 1.9 + (Math.random() - 0.5) * 0.04,
      h: 0.25 + Math.random() * 0.55,
      w: 0.04 + Math.random() * 0.06,
    })), [])

  // Rain: thin vertical streaks positioned randomly across the window
  const rain = useMemo(() =>
    Array.from({ length: RAIN_COUNT }, () => ({
      x: (Math.random() - 0.5) * 1.8,
      y: (Math.random() - 0.5) * 1.4,
      speed: 0.8 + Math.random() * 0.6,
    })), [])

  // Set static building matrices once on mount
  useLayoutEffect(() => {
    const mesh = buildingRef.current
    if (!mesh) return
    buildings.forEach((b, i) => {
      // z=-0.15 keeps buildings behind the wall plane (local z=0)
      dummy.position.set(b.x, -0.75 + b.h / 2 - 0.1, -0.15)
      dummy.scale.set(b.w, b.h, 0.05)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    })
    dummy.scale.set(1, 1, 1) // reset dummy scale
    mesh.instanceMatrix.needsUpdate = true
  }, [buildings, dummy])

  // Animate rain falling downward, reset above window when below
  useFrame((_, delta) => {
    const mesh = rainRef.current
    if (!mesh) return
    for (let i = 0; i < RAIN_COUNT; i++) {
      const r = rain[i]
      r.y -= delta * r.speed
      if (r.y < -0.75) r.y = 0.75

      // z=-0.08 keeps rain behind the wall plane
      dummy.position.set(r.x, r.y, -0.08)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    }
    mesh.instanceMatrix.needsUpdate = true
  })

  return (
    <group>
      {/* Night sky — pushed well behind wall plane (local z=0) to anchor it in space */}
      <mesh position={[0, 0, -0.45]}>
        <planeGeometry args={[2.2, 1.7]} />
        <meshBasicMaterial color="#060d1a" />
      </mesh>

      {/* Subtle blue atmospheric glow near horizon */}
      <mesh position={[0, -0.55, -0.42]}>
        <planeGeometry args={[2.2, 0.35]} />
        <meshBasicMaterial color="#0a1e3d" transparent opacity={0.8} />
      </mesh>

      {/* City buildings silhouette */}
      <instancedMesh ref={buildingRef} args={[undefined, undefined, BUILDING_COUNT]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#08101e" />
      </instancedMesh>

      {/* Rain streaks — thin elongated quads */}
      <instancedMesh ref={rainRef} args={[undefined, undefined, RAIN_COUNT]}>
        <planeGeometry args={[0.003, 0.07]} />
        <meshBasicMaterial
          color="#8ab4d4"
          transparent
          opacity={0.35}
          depthWrite={false}
        />
      </instancedMesh>

      {/* Building window lights — a few static bright points */}
      {Array.from({ length: 18 }, (_, i) => (
        <mesh
          key={i}
          position={[
            -0.85 + Math.random() * 1.7,
            -0.6 + Math.random() * 0.5,
            -0.10,
          ]}
        >
          <planeGeometry args={[0.01, 0.01]} />
          <meshBasicMaterial color={i % 3 === 0 ? '#ffe8a0' : '#c8e4ff'} />
        </mesh>
      ))}
    </group>
  )
}
