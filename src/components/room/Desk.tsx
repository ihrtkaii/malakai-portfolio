import { MeshReflectorMaterial } from '@react-three/drei'

// Desk top sits at y=0.75; center z=-0.5 (spans z=-1.1 to z=0.1)
const DESK_Z = -0.5
const DESK_W = 3.0
const DESK_D = 1.2
const DESK_H = 0.75  // height from floor to top surface

const darkWood = <meshStandardMaterial color="#14100c" roughness={0.88} metalness={0} />

export default function Desk() {
  // Leg positions [x, zOffset] relative to desk center
  const legPositions: [number, number][] = [
    [-1.42, 0.47],   // front left
    [1.42, 0.47],    // front right
    [-1.42, -0.52],  // back left
    [1.42, -0.52],   // back right
  ]

  return (
    <group>
      {/* ── Reflective desk top surface ── */}
      <mesh
        position={[0, DESK_H, DESK_Z]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[DESK_W, DESK_D]} />
        {/* MeshReflectorMaterial lets monitor glow reflect subtly */}
        <MeshReflectorMaterial
          blur={[200, 100]}
          mixBlur={0.65}
          mixStrength={0.8}
          resolution={256}
          mirror={0}
          roughness={0.72}
          metalness={0.12}
          color="#1a1208"
        />
      </mesh>

      {/* ── Front panel ── */}
      <mesh
        position={[0, DESK_H / 2, DESK_Z + DESK_D / 2 - 0.022]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[DESK_W, DESK_H, 0.038]} />
        {darkWood}
      </mesh>

      {/* ── Back panel ── */}
      <mesh
        position={[0, DESK_H / 2 - 0.1, DESK_Z - DESK_D / 2 + 0.022]}
        castShadow
      >
        <boxGeometry args={[DESK_W, DESK_H - 0.2, 0.03]} />
        {darkWood}
      </mesh>

      {/* ── Legs ── */}
      {legPositions.map(([x, zOff], i) => (
        <mesh
          key={i}
          position={[x, DESK_H / 2, DESK_Z + zOff]}
          castShadow
        >
          <boxGeometry args={[0.038, DESK_H, 0.038]} />
          {darkWood}
        </mesh>
      ))}

      {/* ── Under-desk crossbar ── */}
      <mesh position={[0, 0.11, DESK_Z - 0.3]} castShadow>
        <boxGeometry args={[DESK_W - 0.08, 0.028, 0.035]} />
        {darkWood}
      </mesh>
    </group>
  )
}
