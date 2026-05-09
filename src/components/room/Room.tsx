import WindowView from './WindowView'

// Window opening constants — shared with WindowView (which is centered at local origin)
const WIN_W = 2.0
const WIN_H = 1.5
const WIN_Y = 2.5   // center y of window opening
const WIN_TOP = WIN_Y + WIN_H / 2   // 3.25
const WIN_BOT = WIN_Y - WIN_H / 2   // 1.75
const WALL_Z = -4.0

const wallMat = <meshStandardMaterial color="#070b17" roughness={0.95} metalness={0} />
const frameMat = <meshStandardMaterial color="#1c1710" roughness={0.88} metalness={0.05} />

export default function Room() {
  return (
    <group>
      {/* ── Floor ──────────────────────────────────────────── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial color="#12100a" roughness={0.88} metalness={0} />
      </mesh>

      {/* ── Ceiling ────────────────────────────────────────── */}
      <mesh position={[0, 5.8, -1.0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[12, 10]} />
        <meshStandardMaterial color="#040609" roughness={1} metalness={0} />
      </mesh>

      {/* ── Back wall — 4 pieces around the window opening ── */}
      {/* Left section (x = -6 to -1) */}
      <mesh position={[-3.5, 3.0, WALL_Z]} receiveShadow>
        <planeGeometry args={[5.0, 6]} />
        {wallMat}
      </mesh>
      {/* Right section (x = 1 to 6) */}
      <mesh position={[3.5, 3.0, WALL_Z]} receiveShadow>
        <planeGeometry args={[5.0, 6]} />
        {wallMat}
      </mesh>
      {/* Top section */}
      <mesh position={[0, WIN_TOP + (6 - WIN_TOP) / 2, WALL_Z]}>
        <planeGeometry args={[WIN_W, 6 - WIN_TOP]} />
        {wallMat}
      </mesh>
      {/* Bottom section */}
      <mesh position={[0, WIN_BOT / 2, WALL_Z]}>
        <planeGeometry args={[WIN_W, WIN_BOT]} />
        {wallMat}
      </mesh>

      {/* ── Window frame border ──────────────────────────── */}
      {/* Top bar */}
      <mesh position={[0, WIN_TOP + 0.032, WALL_Z + 0.045]}>
        <boxGeometry args={[WIN_W + 0.13, 0.064, 0.09]} />
        {frameMat}
      </mesh>
      {/* Bottom bar */}
      <mesh position={[0, WIN_BOT - 0.032, WALL_Z + 0.045]}>
        <boxGeometry args={[WIN_W + 0.13, 0.064, 0.09]} />
        {frameMat}
      </mesh>
      {/* Left bar */}
      <mesh position={[-(WIN_W / 2) - 0.032, WIN_Y, WALL_Z + 0.045]}>
        <boxGeometry args={[0.064, WIN_H + 0.13, 0.09]} />
        {frameMat}
      </mesh>
      {/* Right bar */}
      <mesh position={[(WIN_W / 2) + 0.032, WIN_Y, WALL_Z + 0.045]}>
        <boxGeometry args={[0.064, WIN_H + 0.13, 0.09]} />
        {frameMat}
      </mesh>

      {/* Mullion cross */}
      <mesh position={[0, WIN_Y, WALL_Z + 0.065]}>
        <boxGeometry args={[WIN_W, 0.034, 0.07]} />
        {frameMat}
      </mesh>
      <mesh position={[0, WIN_Y, WALL_Z + 0.065]}>
        <boxGeometry args={[0.034, WIN_H, 0.07]} />
        {frameMat}
      </mesh>

      {/* Window sill */}
      <mesh position={[0, WIN_BOT - 0.1, WALL_Z + 0.12]}>
        <boxGeometry args={[WIN_W + 0.18, 0.07, 0.22]} />
        {frameMat}
      </mesh>

      {/* Window reveal — box jambs and soffit give the opening wall thickness / depth */}
      {/* Left jamb */}
      <mesh position={[-(WIN_W / 2), WIN_Y, WALL_Z - 0.1]}>
        <boxGeometry args={[0.05, WIN_H + 0.13, 0.22]} />
        {frameMat}
      </mesh>
      {/* Right jamb */}
      <mesh position={[(WIN_W / 2), WIN_Y, WALL_Z - 0.1]}>
        <boxGeometry args={[0.05, WIN_H + 0.13, 0.22]} />
        {frameMat}
      </mesh>
      {/* Top soffit */}
      <mesh position={[0, WIN_TOP, WALL_Z - 0.1]}>
        <boxGeometry args={[WIN_W + 0.05, 0.05, 0.22]} />
        {frameMat}
      </mesh>

      {/* WindowView — slightly behind wall plane so content reads as depth-behind-glass */}
      <group position={[0, WIN_Y, WALL_Z - 0.02]}>
        <WindowView />
      </group>

      {/* ── Side walls — angled inward ±15° for depth ─────── */}
      <mesh
        position={[-5.5, 3.0, -1.5]}
        rotation={[0, Math.PI / 2 + Math.PI / 12, 0]}
        receiveShadow
      >
        <planeGeometry args={[10, 6]} />
        {wallMat}
      </mesh>
      <mesh
        position={[5.5, 3.0, -1.5]}
        rotation={[0, -(Math.PI / 2 + Math.PI / 12), 0]}
        receiveShadow
      >
        <planeGeometry args={[10, 6]} />
        {wallMat}
      </mesh>
    </group>
  )
}
