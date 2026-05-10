'use client'

import { useEffect, useRef, useState } from 'react'

const TICK_MS = 700
const COUNT_FROM = 10
const COUNT_STOP_AT = 1
const KIDDING_HOLD_MS = 1500

interface Props {
  onDone: () => void
}

// Black screen, green phosphor text. Counts down from 10, halts at 1 with a
// "just kidding." line, holds, then lets the parent move on.
export default function SecretTerminalView({ onDone }: Props) {
  const [lines, setLines] = useState<string[]>([
    '> SECURITY OVERRIDE ACCEPTED',
    '> root shell granted',
    '> initiating self-destruct sequence...',
    '',
  ])
  const tickRef = useRef<number | null>(null)
  const doneRef = useRef(false)

  useEffect(() => {
    let count = COUNT_FROM

    const tick = () => {
      if (doneRef.current) return
      if (count >= COUNT_STOP_AT) {
        setLines((prev) => [...prev, `T-MINUS ${count}...`])
        count -= 1
        tickRef.current = window.setTimeout(tick, TICK_MS)
      } else {
        setLines((prev) => [
          ...prev,
          '',
          'just kidding.',
          '',
          '> redirecting to: /backdoor/about',
        ])
        doneRef.current = true
        tickRef.current = window.setTimeout(onDone, KIDDING_HOLD_MS)
      }
    }

    tickRef.current = window.setTimeout(tick, TICK_MS)
    return () => {
      doneRef.current = true
      if (tickRef.current != null) window.clearTimeout(tickRef.current)
    }
  }, [onDone])

  return (
    <div
      className="fixed inset-0 z-[72] bg-black"
      style={{
        color: '#00ff88',
        fontFamily: '"JetBrains Mono", Consolas, monospace',
        fontSize: '15px',
        lineHeight: '1.5',
        padding: '8vh 8vw',
        textShadow: '0 0 6px #00ff88',
      }}
    >
      {lines.map((line, i) => (
        <div key={i} style={{ whiteSpace: 'pre' }}>
          {line || ' '}
        </div>
      ))}
      <span className="cmd-caret" style={{ display: 'inline-block', marginLeft: 4 }}>
        _
      </span>
    </div>
  )
}
