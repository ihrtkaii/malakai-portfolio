'use client'

import { useEffect, useRef } from 'react'

// CRT static "warm-up" overlay — full-screen black with animated grayscale
// noise. Holds for ~1.4s then fades out (CSS handles the fade via the
// .crt-static-fade animation in globals.css). Calls onDone when the fade
// completes so the parent can advance state.
//
// Implementation note: noise is rendered to a 320×240 canvas, then CSS
// upscales to fill the viewport. Saves a ton of work compared to painting
// per-pixel at full resolution and gives a nicer chunky look anyway.
const STATIC_W = 320
const STATIC_H = 240
const HOLD_DURATION_MS = 1500

interface Props {
  onDone: () => void
}

export default function CrtStaticIntro({ onDone }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = STATIC_W
    canvas.height = STATIC_H
    ctx.imageSmoothingEnabled = false

    const imageData = ctx.createImageData(STATIC_W, STATIC_H)
    const data = imageData.data

    let alive = true
    const draw = () => {
      if (!alive) return
      for (let i = 0; i < data.length; i += 4) {
        const v = (Math.random() * 255) | 0
        data[i] = v
        data[i + 1] = v
        data[i + 2] = v
        data[i + 3] = 255
      }
      ctx.putImageData(imageData, 0, 0)
      rafRef.current = requestAnimationFrame(draw)
    }
    draw()

    const doneAt = window.setTimeout(onDone, HOLD_DURATION_MS)
    return () => {
      alive = false
      cancelAnimationFrame(rafRef.current)
      window.clearTimeout(doneAt)
    }
  }, [onDone])

  return (
    <div className="fixed inset-0 z-[60] bg-black crt-static-fade pointer-events-none">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ imageRendering: 'pixelated', opacity: 0.85 }}
        aria-hidden
      />
      {/* Subtle scanline overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'repeating-linear-gradient(to bottom, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 2px, rgba(0,0,0,0.25) 2px, rgba(0,0,0,0.25) 3px)',
        }}
      />
    </div>
  )
}
