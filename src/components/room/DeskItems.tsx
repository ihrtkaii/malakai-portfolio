import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox, Text } from '@react-three/drei'
import * as THREE from 'three'

// All items are positioned with y relative to desk surface (y=0.75)
export default function DeskItems() {
  const routerLedsRef = useRef<(THREE.Mesh | null)[]>([])

  // Router activity lights blink in a walking-light pattern
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    routerLedsRef.current.forEach((m, i) => {
      if (!m) return
      const mat = m.material as THREE.MeshStandardMaterial
      mat.emissiveIntensity = 0.1 + (Math.sin(t * 4.0 - i * 1.1) * 0.5 + 0.5) * 0.85
    })
  })

  return (
    <group>
      {/* ── Coffee mug (right side) ──────────────────────── */}
      <group position={[1.1, 0.75, -0.3]}>
        <mesh position={[0, 0.065, 0]} castShadow>
          <cylinderGeometry args={[0.034, 0.029, 0.13, 14]} />
          <meshStandardMaterial color="#f0ece2" roughness={0.8} />
        </mesh>
        {/* Handle */}
        <mesh position={[0.048, 0.065, 0]} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.022, 0.006, 5, 10, Math.PI]} />
          <meshStandardMaterial color="#f0ece2" roughness={0.8} />
        </mesh>
        {/* Coffee surface */}
        <mesh position={[0, 0.128, 0]}>
          <cylinderGeometry args={[0.032, 0.032, 0.002, 12]} />
          <meshStandardMaterial color="#1a0c05" roughness={0.9} />
        </mesh>
      </group>

      {/* ── Router (left back) ───────────────────────────── */}
      <group position={[-1.05, 0.75, -0.62]}>
        {/* Body */}
        <mesh position={[0, 0.03, 0]} castShadow>
          <boxGeometry args={[0.19, 0.055, 0.115]} />
          <meshStandardMaterial color="#181818" roughness={0.65} />
        </mesh>
        {/* Antennas */}
        {([-0.07, 0.07] as number[]).map((x, i) => (
          <mesh key={i} position={[x, 0.1, -0.025]}>
            <cylinderGeometry args={[0.005, 0.005, 0.11, 6]} />
            <meshStandardMaterial color="#111111" roughness={0.7} />
          </mesh>
        ))}
        {/* Activity LEDs */}
        {([0, 1, 2, 3] as number[]).map((i) => (
          <mesh
            key={i}
            ref={(el) => { routerLedsRef.current[i] = el }}
            position={[-0.062 + i * 0.042, 0.058, 0.042]}
          >
            <sphereGeometry args={[0.005, 6, 6]} />
            <meshStandardMaterial color="#00ff44" emissive="#00ff44" emissiveIntensity={0.6} />
          </mesh>
        ))}
      </group>

      {/* ── Raspberry Pi PCB ─────────────────────────────── */}
      <group position={[-0.35, 0.75, -0.96]}>
        <mesh castShadow>
          <boxGeometry args={[0.086, 0.004, 0.056]} />
          <meshStandardMaterial color="#1a6b3c" roughness={0.5} metalness={0.3} />
        </mesh>
        {/* Tiny chips */}
        {([[0, 0.004, 0], [-0.022, 0.004, 0.01]] as [number,number,number][]).map((p, i) => (
          <mesh key={i} position={p}>
            <boxGeometry args={[0.018, 0.004, 0.018]} />
            <meshStandardMaterial color="#111" roughness={0.4} metalness={0.6} />
          </mesh>
        ))}
      </group>

      {/* ── Flipper Zero ─────────────────────────────────── */}
      <RoundedBox args={[0.13, 0.015, 0.065]} radius={0.005} position={[0.72, 0.758, -0.72]} castShadow>
        <meshStandardMaterial color="#ff6800" roughness={0.4} metalness={0.1} />
      </RoundedBox>
      {/* Flipper screen */}
      <mesh position={[0.72, 0.767, -0.705]}>
        <planeGeometry args={[0.055, 0.03]} />
        <meshStandardMaterial color="#001a00" emissive="#00ff44" emissiveIntensity={0.3} roughness={1} />
      </mesh>

      {/* ── Samsung SSD ──────────────────────────────────── */}
      <RoundedBox args={[0.1, 0.013, 0.072]} radius={0.003} position={[1.12, 0.757, -0.76]} castShadow>
        <meshStandardMaterial color="#111214" roughness={0.55} metalness={0.85} />
      </RoundedBox>

      {/* ── USB drives ───────────────────────────────────── */}
      {([[-1.02, 0, -0.15], [-1.02, 0, -0.22]] as [number, number, number][]).map((p, i) => (
        <group key={i} position={[p[0], 0.754, p[2]]}>
          <mesh rotation={[0, i * 0.3, 0]}>
            <boxGeometry args={[0.055, 0.012, 0.02]} />
            <meshStandardMaterial color={i === 0 ? '#1144aa' : '#882222'} roughness={0.5} />
          </mesh>
          {/* Metal connector */}
          <mesh position={[0.032, 0, 0]} rotation={[0, i * 0.3, 0]}>
            <boxGeometry args={[0.014, 0.009, 0.016]} />
            <meshStandardMaterial color="#cccccc" roughness={0.3} metalness={0.9} />
          </mesh>
        </group>
      ))}

      {/* ── Sec+ book (standing upright, left side) ──────── */}
      <group position={[-1.22, 0.84, -0.46]}>
        <mesh castShadow>
          <boxGeometry args={[0.042, 0.18, 0.125]} />
          <meshStandardMaterial color="#8b1a1a" roughness={0.9} />
        </mesh>
        <Text position={[0.022, 0, 0]} rotation={[0, Math.PI / 2, 0]} fontSize={0.014} color="#f0e0c0" anchorX="center" anchorY="middle">
          {`Security+\nSY0-701`}
        </Text>
      </group>

      {/* ── Spiral notebook ──────────────────────────────── */}
      <mesh position={[0.5, 0.752, -0.08]} rotation={[0, 0.12, 0]} castShadow>
        <boxGeometry args={[0.145, 0.005, 0.105]} />
        <meshStandardMaterial color="#d8c890" roughness={0.9} />
      </mesh>

      {/* ── Sticky note ──────────────────────────────────── */}
      <group position={[0.18, 0.751, -0.24]}>
        <mesh rotation={[-Math.PI / 2, 0, 0.06]}>
          <planeGeometry args={[0.085, 0.075]} />
          <meshStandardMaterial color="#ffee77" roughness={0.88} side={THREE.DoubleSide} />
        </mesh>
        <Text position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0.06]} fontSize={0.009} color="#444400" anchorX="center" anchorY="middle" maxWidth={0.07}>
          {`todo:\n- CySA+ study\n- update resume\n- Sentinel lab`}
        </Text>
      </group>
    </group>
  )
}
