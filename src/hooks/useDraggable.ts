import { useState, useRef, useCallback, useEffect } from 'react'

interface Position {
  x: number
  y: number
}

interface UseDraggableReturn {
  position: Position
  handleMouseDown: (e: React.MouseEvent) => void
  handleTouchStart: (e: React.TouchEvent) => void
}

export function useDraggable(initial: Position = { x: 100, y: 60 }): UseDraggableReturn {
  const [position, setPosition] = useState<Position>(initial)
  // Track current position in a ref so the mousedown callback never goes stale
  const posRef = useRef(position)
  posRef.current = position

  const dragging = useRef(false)
  const offset = useRef<Position>({ x: 0, y: 0 })

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    dragging.current = true
    offset.current = {
      x: e.clientX - posRef.current.x,
      y: e.clientY - posRef.current.y,
    }
  }, [])

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0]
    dragging.current = true
    offset.current = {
      x: touch.clientX - posRef.current.x,
      y: touch.clientY - posRef.current.y,
    }
  }, [])

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!dragging.current) return
      setPosition({
        x: e.clientX - offset.current.x,
        y: e.clientY - offset.current.y,
      })
    }

    const onTouchMove = (e: TouchEvent) => {
      if (!dragging.current) return
      const touch = e.touches[0]
      setPosition({
        x: touch.clientX - offset.current.x,
        y: touch.clientY - offset.current.y,
      })
    }

    const onUp = () => {
      dragging.current = false
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('mouseup', onUp)
    window.addEventListener('touchend', onUp)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('touchend', onUp)
    }
  }, [])

  return { position, handleMouseDown, handleTouchStart }
}
