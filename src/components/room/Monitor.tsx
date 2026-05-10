'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import { RoundedBox, Text } from '@react-three/drei'
import * as THREE from 'three'
import { useStore } from '@/lib/store'

// Physical screen dimensions (meters) — geometry plane and canvas aspect
// stay in sync so text on the screen isn't squashed.
const SCREEN_W = 0.352
const SCREEN_H = 0.272
const TEX_W = 512
const TEX_H = 384

// Old-school chunky CRT body: 0.54 × 0.44 × 0.50 — wider/shorter than the
// screen, so bezels read as thick beige plastic on every side.
const BODY_W = 0.54
const BODY_H = 0.44
const BODY_D = 0.5
// Beige plastic — warm off-white with a touch of yellowing.
const BODY_COLOR = '#d8cdb0'
const BODY_DARKER = '#a89c80'

export default function Monitor() {
  const setPhase = useStore((s) => s.setPhase)
  const phase = useStore((s) => s.phase)
  const ledRef = useRef<THREE.Mesh>(null)

  // Overlapping meshes in the monitor group cause R3F to fire onClick once
  // per intersected mesh — guard with stopPropagation + a phase check so
  // exactly one transition kicks off.
  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    if (phase !== 'room') return
    setPhase('zooming')
  }

  useFrame(({ clock }) => {
    if (!ledRef.current) return
    const mat = ledRef.current.material as THREE.MeshStandardMaterial
    mat.emissiveIntensity = 0.55 + Math.sin(clock.getElapsedTime() * 1.6) * 0.35
  })

  return (
    <group
      position={[0, 0.75, -0.85]}
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation()
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={(e) => {
        e.stopPropagation()
        document.body.style.cursor = 'auto'
      }}
    >
      {/* Stand base disk */}
      <mesh position={[0, 0.01, 0.1]} receiveShadow>
        <cylinderGeometry args={[0.11, 0.13, 0.025, 16]} />
        <meshStandardMaterial color={BODY_COLOR} roughness={0.92} metalness={0} />
      </mesh>

      {/* Stand neck */}
      <mesh position={[0, 0.13, 0.06]}>
        <cylinderGeometry args={[0.03, 0.045, 0.22, 8]} />
        <meshStandardMaterial color={BODY_COLOR} roughness={0.92} metalness={0} />
      </mesh>

      {/* CRT body */}
      <group position={[0, 0.42, 0]}>
        {/* Main housing — chunky beige plastic, very low corner radius */}
        <RoundedBox
          args={[BODY_W, BODY_H, BODY_D]}
          radius={0.012}
          smoothness={3}
          castShadow
        >
          <meshStandardMaterial color={BODY_COLOR} roughness={0.92} metalness={0} />
        </RoundedBox>

        {/* Rear electron-gun housing bump */}
        <mesh position={[0, 0, -0.22]}>
          <cylinderGeometry args={[0.085, 0.16, 0.16, 14]} />
          <meshStandardMaterial color={BODY_DARKER} roughness={0.95} metalness={0} />
        </mesh>

        {/* Top vents (rows of slits) — old monitors always had these */}
        {Array.from({ length: 7 }, (_, i) => (
          <mesh key={`tv${i}`} position={[-0.18 + i * 0.06, BODY_H / 2 + 0.001, 0]}>
            <boxGeometry args={[0.04, 0.001, 0.18]} />
            <meshStandardMaterial color="#1a1a18" roughness={1} />
          </mesh>
        ))}

        {/* Side vents — left + right */}
        {Array.from({ length: 6 }, (_, i) => (
          <mesh key={`lv${i}`} position={[-BODY_W / 2 - 0.001, -0.08 + i * 0.04, 0]}>
            <boxGeometry args={[0.001, 0.025, 0.22]} />
            <meshStandardMaterial color="#1a1a18" roughness={1} />
          </mesh>
        ))}
        {Array.from({ length: 6 }, (_, i) => (
          <mesh key={`rv${i}`} position={[BODY_W / 2 + 0.001, -0.08 + i * 0.04, 0]}>
            <boxGeometry args={[0.001, 0.025, 0.22]} />
            <meshStandardMaterial color="#1a1a18" roughness={1} />
          </mesh>
        ))}

        {/* Bezel recess — thick black ring around the screen */}
        <mesh position={[0, 0.01, BODY_D / 2 - 0.01]}>
          <boxGeometry args={[0.42, 0.34, 0.018]} />
          <meshStandardMaterial color="#0a0a0a" roughness={1} />
        </mesh>

        {/* The actual screen — canvas-textured plane */}
        <ScreenContent />

        {/* Power LED */}
        <mesh ref={ledRef} position={[0.18, -0.18, BODY_D / 2 - 0.001]}>
          <sphereGeometry args={[0.006, 8, 8]} />
          <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={0.9} />
        </mesh>

        {/* Brand label — stamped into the bezel chin */}
        <Text
          position={[-0.16, -0.18, BODY_D / 2 - 0.001]}
          fontSize={0.014}
          color="#5e5546"
          anchorX="left"
          anchorY="middle"
        >
          VIEWMASTER CM-17
        </Text>

        {/* Tiny chin button row — power, menu, brightness */}
        {Array.from({ length: 4 }, (_, i) => (
          <mesh key={`btn${i}`} position={[0.04 + i * 0.022, -0.19, BODY_D / 2 - 0.001]}>
            <boxGeometry args={[0.012, 0.005, 0.005]} />
            <meshStandardMaterial color={BODY_DARKER} roughness={0.85} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

// Static canvas-textured plane that mirrors the HTML LoginScreen layout
// (Horizon XP header → two tiles → footer). The interactive logon happens
// in the HTML overlay rendered when phase === 'login'; this canvas is what
// you see from the room view and during the zoom-in.
function ScreenContent() {
  const { canvas, ctx, texture } = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = TEX_W
    c.height = TEX_H
    const context = c.getContext('2d')
    if (!context) {
      throw new Error('2D canvas context not available')
    }
    const tex = new THREE.CanvasTexture(c)
    tex.minFilter = THREE.LinearFilter
    tex.magFilter = THREE.LinearFilter
    tex.generateMipmaps = false
    tex.colorSpace = THREE.SRGBColorSpace
    return { canvas: c, ctx: context, texture: tex }
  }, [])

  useEffect(() => {
    drawWelcome(ctx)
    texture.needsUpdate = true
  }, [ctx, texture])

  useEffect(() => {
    return () => {
      texture.dispose()
      void canvas
    }
  }, [texture, canvas])

  return (
    <mesh position={[0, 0.01, BODY_D / 2 - 0.002]}>
      <planeGeometry args={[SCREEN_W, SCREEN_H]} />
      <meshStandardMaterial
        map={texture}
        emissiveMap={texture}
        emissive="#ffffff"
        emissiveIntensity={1.0}
        toneMapped={false}
        roughness={1}
        metalness={0}
      />
    </mesh>
  )
}

// Canvas drawing — Horizon XP welcome layout that mirrors the HTML overlay.
function drawWelcome(ctx: CanvasRenderingContext2D) {
  const bgGrad = ctx.createLinearGradient(0, 0, 0, TEX_H)
  bgGrad.addColorStop(0, '#1a4ec0')
  bgGrad.addColorStop(0.45, '#0f3a9c')
  bgGrad.addColorStop(1, '#021c5c')
  ctx.fillStyle = bgGrad
  ctx.fillRect(0, 0, TEX_W, TEX_H)

  drawDivider(ctx, 30, 90, TEX_W - 60)
  drawDivider(ctx, 30, TEX_H - 70, TEX_W - 60)

  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  ctx.fillStyle = 'rgba(220,230,255,0.85)'
  ctx.font = '10px Tahoma, sans-serif'
  ctx.fillText('MICROSOFT  ·  HORIZON XP PROFESSIONAL', TEX_W / 2, 36)

  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 28px Tahoma, "Segoe UI", sans-serif'
  ctx.shadowColor = 'rgba(0,0,0,0.55)'
  ctx.shadowBlur = 3
  ctx.shadowOffsetY = 2
  ctx.fillText('Welcome to Horizon XP', TEX_W / 2, 64)
  ctx.shadowBlur = 0
  ctx.shadowOffsetY = 0

  // Two tiles side-by-side.
  const tileW = 200
  const tileH = 80
  const gap = 24
  const totalW = tileW * 2 + gap
  const startX = (TEX_W - totalW) / 2
  const tileY = 130
  drawTile(ctx, startX, tileY, tileW, tileH, 'admin')
  drawTile(ctx, startX + tileW + gap, tileY, tileW, tileH, 'kai')

  ctx.fillStyle = 'rgba(220,230,255,0.9)'
  ctx.font = '12px Tahoma, sans-serif'
  ctx.shadowColor = 'rgba(0,0,0,0.5)'
  ctx.shadowBlur = 2
  ctx.shadowOffsetY = 1
  ctx.fillText('Click your user name to begin.', TEX_W / 2, TEX_H - 38)
  ctx.shadowBlur = 0
  ctx.shadowOffsetY = 0
}

function drawDivider(ctx: CanvasRenderingContext2D, x: number, y: number, w: number) {
  const grad = ctx.createLinearGradient(x, y, x + w, y)
  grad.addColorStop(0, 'rgba(255,255,255,0)')
  grad.addColorStop(0.18, 'rgba(255,255,255,0.55)')
  grad.addColorStop(0.82, 'rgba(255,255,255,0.55)')
  grad.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = grad
  ctx.fillRect(x, y, w, 1)
}

function drawTile(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  kind: 'admin' | 'kai',
) {
  const padding = 8
  const avatarSize = h - padding * 2
  const ax = x + padding
  const ay = y + padding

  const frameGrad = ctx.createLinearGradient(ax, ay, ax, ay + avatarSize)
  frameGrad.addColorStop(0, '#ffffff')
  frameGrad.addColorStop(0.55, '#b6cfee')
  frameGrad.addColorStop(1, '#6c95d0')
  ctx.fillStyle = frameGrad
  roundRect(ctx, ax, ay, avatarSize, avatarSize, 5)
  ctx.fill()

  const innerSize = avatarSize - 6
  const ix = ax + 3
  const iy = ay + 3
  const innerGrad = ctx.createLinearGradient(ix, iy, ix, iy + innerSize)
  if (kind === 'admin') {
    innerGrad.addColorStop(0, '#2c8a2c')
    innerGrad.addColorStop(1, '#1d5d1d')
  } else {
    innerGrad.addColorStop(0, '#4a82d8')
    innerGrad.addColorStop(0.6, '#2966bd')
    innerGrad.addColorStop(1, '#16489c')
  }
  ctx.fillStyle = innerGrad
  roundRect(ctx, ix, iy, innerSize, innerSize, 3)
  ctx.fill()

  const cx = ix + innerSize / 2
  const cy = iy + innerSize / 2
  if (kind === 'admin') {
    drawShield(ctx, cx, cy, innerSize * 0.42)
  } else {
    drawPerson(ctx, cx, cy + 2, innerSize * 0.5)
  }

  const textX = ax + avatarSize + 12
  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'
  ctx.fillStyle = '#ffe9a8'
  ctx.font = 'bold 18px Tahoma, "Segoe UI", sans-serif'
  ctx.shadowColor = 'rgba(0,0,0,0.55)'
  ctx.shadowBlur = 3
  ctx.shadowOffsetY = 1
  ctx.fillText(kind === 'admin' ? 'Admin' : 'Kai', textX, y + 36)

  ctx.fillStyle = 'rgba(220,230,255,0.95)'
  ctx.font = '11px Tahoma, sans-serif'
  ctx.fillText(
    kind === 'admin' ? 'Type your password' : 'Click here to log on',
    textX,
    y + 56,
  )
  ctx.shadowBlur = 0
  ctx.shadowOffsetY = 0
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

function drawShield(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number) {
  ctx.save()
  ctx.translate(cx, cy)
  ctx.scale(size / 20, size / 20)
  ctx.fillStyle = '#ffffff'
  ctx.beginPath()
  ctx.moveTo(0, -16)
  ctx.lineTo(14, -11)
  ctx.lineTo(14, 1)
  ctx.bezierCurveTo(14, 9, 7, 15, 0, 17)
  ctx.bezierCurveTo(-7, 15, -14, 9, -14, 1)
  ctx.lineTo(-14, -11)
  ctx.closePath()
  ctx.fill()
  ctx.fillStyle = '#1c5fd6'
  ctx.fillRect(-6, -2, 12, 10)
  ctx.strokeStyle = '#1c5fd6'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.arc(0, -2, 4, Math.PI, 0)
  ctx.stroke()
  ctx.restore()
}

function drawPerson(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number) {
  ctx.save()
  ctx.translate(cx, cy)
  ctx.scale(size / 24, size / 24)
  ctx.fillStyle = '#ffffff'
  ctx.beginPath()
  ctx.arc(0, -6, 5, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.moveTo(-10, 12)
  ctx.bezierCurveTo(-10, 4, -5, 1, 0, 1)
  ctx.bezierCurveTo(5, 1, 10, 4, 10, 12)
  ctx.closePath()
  ctx.fill()
  ctx.restore()
}
