'use client'

import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox, Html, Text } from '@react-three/drei'
import * as THREE from 'three'
import { useStore } from '@/lib/store'
import { useTypewriter } from '@/hooks/useTypewriter'

const STATIC_LINES = [
  '> nmap -sV 192.168.1.0/24',
  'PORT   STATE  SERVICE',
  '22     open   ssh',
  '80     open   http',
  '443    open   https',
  '> python3 soc_monitor.py',
  '[*] Monitoring active...',
  '[!] Alert: port 4444 traffic',
  '[*] Logging to Sentinel...',
]

const CMDS = [
  'netstat -an | grep ESTAB',
  'tail -f /var/log/auth.log',
  'sudo iptables -L --line-numbers',
  'nmap --script vuln 10.0.0.1',
  'cat alerts.json | python3 -m json.tool',
]

export default function Monitor() {
  const setPhase = useStore((s) => s.setPhase)
  const ledRef = useRef<THREE.Mesh>(null)
  const [cmdIdx, setCmdIdx] = useState(0)
  const typed = useTypewriter(CMDS[cmdIdx], 42)

  useEffect(() => {
    const t = setTimeout(() => setCmdIdx((i) => (i + 1) % CMDS.length), 4500)
    return () => clearTimeout(t)
  }, [cmdIdx])

  // Power LED slow pulse
  useFrame(({ clock }) => {
    if (!ledRef.current) return
    const mat = ledRef.current.material as THREE.MeshStandardMaterial
    mat.emissiveIntensity = 0.55 + Math.sin(clock.getElapsedTime() * 1.6) * 0.35
  })

  return (
    // Group origin at desk surface level; click anywhere on monitor
    <group
      position={[0, 0.75, -0.85]}
      onClick={() => setPhase('zooming')}
      onPointerOver={() => { document.body.style.cursor = 'pointer' }}
      onPointerOut={() => { document.body.style.cursor = 'auto' }}
    >
      {/* Stand base disk */}
      <mesh position={[0, 0.01, 0.1]} receiveShadow>
        <cylinderGeometry args={[0.09, 0.11, 0.02, 16]} />
        <meshStandardMaterial color="#3a3530" roughness={0.9} metalness={0} />
      </mesh>

      {/* Stand neck */}
      <mesh position={[0, 0.13, 0.055]}>
        <cylinderGeometry args={[0.024, 0.034, 0.22, 8]} />
        <meshStandardMaterial color="#3a3530" roughness={0.9} metalness={0} />
      </mesh>

      {/* CRT body — deeper z (0.46) for chunky CRT silhouette */}
      <group position={[0, 0.4, 0]}>
        {/* Main housing — dark beige/gray, high roughness so green light doesn't tint it */}
        <RoundedBox args={[0.46, 0.39, 0.46]} radius={0.03} smoothness={5} castShadow>
          <meshStandardMaterial color="#3a3530" roughness={0.95} metalness={0} />
        </RoundedBox>

        {/* Rear electron-gun housing bump */}
        <mesh position={[0, 0, -0.2]}>
          <cylinderGeometry args={[0.07, 0.13, 0.14, 14]} />
          <meshStandardMaterial color="#2e2a26" roughness={0.95} metalness={0} />
        </mesh>

        {/* Side vents — left */}
        {Array.from({ length: 5 }, (_, i) => (
          <mesh key={`lv${i}`} position={[-0.24, -0.06 + i * 0.04, 0.04]}>
            <boxGeometry args={[0.012, 0.022, 0.18]} />
            <meshStandardMaterial color="#252220" roughness={1} />
          </mesh>
        ))}

        {/* Bezel recess — front face of body is now at z=+0.23 */}
        <mesh position={[0, 0.01, 0.218]}>
          <boxGeometry args={[0.37, 0.295, 0.022]} />
          <meshStandardMaterial color="#080808" roughness={1} />
        </mesh>

        {/* Emissive screen — only this surface glows green */}
        <mesh position={[0, 0.01, 0.226]}>
          <planeGeometry args={[0.352, 0.272]} />
          <meshStandardMaterial
            color="#000e04"
            emissive="#00ff88"
            emissiveIntensity={0.65}
            roughness={1}
          />
        </mesh>

        {/* HTML terminal — dark bg so green text is crisp and readable */}
        <Html
          transform
          position={[0, 0.01, 0.230]}
          scale={0.00118}
          style={{ pointerEvents: 'none' }}
          zIndexRange={[1, 10]}
        >
          <div
            style={{
              width: '288px',
              height: '224px',
              background: 'rgba(0, 10, 3, 0.92)',
              color: '#00ff88',
              fontFamily: '"JetBrains Mono", "Courier New", monospace',
              fontSize: '11px',
              lineHeight: '1.55',
              padding: '8px 10px',
              overflow: 'hidden',
              userSelect: 'none',
              textShadow: '0 0 6px #00ff88',
            }}
          >
            {STATIC_LINES.map((line, i) => (
              <div key={i}>{line}</div>
            ))}
            <div style={{ marginTop: '3px' }}>
              {'> '}
              {typed}
              <span
                style={{
                  display: 'inline-block',
                  width: '7px',
                  height: '10px',
                  background: '#00ff88',
                  verticalAlign: 'text-bottom',
                  marginLeft: '1px',
                  opacity: 1,
                }}
              />
            </div>
          </div>
        </Html>

        {/* Power LED */}
        <mesh ref={ledRef} position={[0.17, -0.166, 0.228]}>
          <sphereGeometry args={[0.006, 8, 8]} />
          <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={0.9} />
        </mesh>

        {/* Brand label */}
        <Text
          position={[0, -0.173, 0.228]}
          fontSize={0.015}
          color="#777068"
          anchorX="center"
          anchorY="middle"
        >
          VIEWMASTER CM-17
        </Text>
      </group>
    </group>
  )
}
