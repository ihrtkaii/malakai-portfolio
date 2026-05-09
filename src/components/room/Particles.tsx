import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const COUNT = 80

interface ParticleData {
  x: number
  y: number
  z: number
  speed: number
}

export default function Particles() {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  // Initial positions spread across an 8×4×4 box above the scene
  const particles = useMemo<ParticleData[]>(() =>
    Array.from({ length: COUNT }, () => ({
      x: (Math.random() - 0.5) * 8,
      y: Math.random() * 4,
      z: (Math.random() - 0.5) * 4,
      speed: 0.025 + Math.random() * 0.04,
    })), [])

  useFrame((_, delta) => {
    const mesh = meshRef.current
    if (!mesh) return

    for (let i = 0; i < COUNT; i++) {
      const p = particles[i]
      p.y += delta * p.speed
      if (p.y > 4.5) p.y = 0

      dummy.position.set(p.x, p.y, p.z)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    }
    mesh.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, COUNT]}>
      <sphereGeometry args={[0.006, 4, 4]} />
      <meshStandardMaterial
        color="#ffffff"
        transparent
        opacity={0.22}
        depthWrite={false}
      />
    </instancedMesh>
  )
}
