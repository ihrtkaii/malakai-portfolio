import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Reused each frame — avoids per-frame allocation
const _color = new THREE.Color()

export default function Lighting() {
  const rgbRef = useRef<THREE.PointLight>(null)

  // RGB strip: cycles purple → cyan → green on a slow sine wave
  useFrame(({ clock }) => {
    if (!rgbRef.current) return
    const t = clock.getElapsedTime()
    // hue sweeps 0.55–0.85 (blue → purple → magenta range)
    const hue = 0.55 + Math.sin(t * 0.25) * 0.15
    _color.setHSL(hue, 0.95, 0.55)
    rgbRef.current.color.copy(_color)
  })

  return (
    <>
      {/* Lifted fill — dark but legible; keeps shadow areas from crushing to black */}
      <ambientLight intensity={0.4} color="#1a2040" />

      {/* Sky/ground gradient */}
      <hemisphereLight args={['#1a3050', '#0a0e14', 0.45]} />

      {/* Moonlight from upper-right through window, soft blue, casts shadows */}
      <directionalLight
        position={[4, 5, -2]}
        intensity={0.55}
        color="#5588cc"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.1}
        shadow-camera-far={20}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={6}
        shadow-camera-bottom={-2}
      />

      {/* CRT monitor glow — accent-green point light at screen face; kept modest to avoid green-washing the bezel */}
      <pointLight
        position={[0, 1.2, 0.3]}
        color="#00ff88"
        intensity={0.55}
        distance={3.0}
        decay={2}
      />

      {/* RGB LED strip mounted on upper back wall */}
      <pointLight
        ref={rgbRef}
        position={[0, 5.0, -3.6]}
        intensity={1.4}
        distance={7}
        decay={2}
      />

      {/* Desk lamp — warm narrow cone, off to the right */}
      <pointLight
        position={[1.3, 1.6, -0.2]}
        color="#ffcc66"
        intensity={0.45}
        distance={2.5}
        decay={2}
      />
    </>
  )
}
