'use client'

import { useEffect, useRef, useState } from 'react'
import TileAvatar from './TileAvatar'

const TIMEOUT_SECONDS = 7
const CORRECT_PASSWORD = 'admin'

interface Props {
  // Settles the prompt: true = correct password (egg), false = wrong / timeout
  // (access denied).
  onResolve: (correct: boolean) => void
  // Replaces the input with a red "Access Denied" line.
  denied?: boolean
}

// Admin password challenge. The prompt is live for at most TIMEOUT_SECONDS.
// Pressing Enter ends it early — correct password fires the egg, anything
// else falls through to access-denied. A timeout while idle also denies.
export default function AdminPasswordView({ onResolve, denied = false }: Props) {
  const [password, setPassword] = useState('')
  const [secondsLeft, setSecondsLeft] = useState(TIMEOUT_SECONDS)
  const inputRef = useRef<HTMLInputElement>(null)
  const intervalRef = useRef<number | null>(null)
  const settledRef = useRef(false)

  useEffect(() => {
    if (denied) return
    inputRef.current?.focus()

    intervalRef.current = window.setInterval(() => {
      setSecondsLeft((s) => {
        const next = s - 1
        if (next <= 0 && !settledRef.current) {
          settledRef.current = true
          if (intervalRef.current != null) window.clearInterval(intervalRef.current)
          // defer to avoid setState during a render cycle
          window.setTimeout(() => onResolve(false), 0)
          return 0
        }
        return next
      })
    }, 1000)

    return () => {
      if (intervalRef.current != null) window.clearInterval(intervalRef.current)
    }
  }, [denied, onResolve])

  const submit = () => {
    if (settledRef.current) return
    settledRef.current = true
    if (intervalRef.current != null) window.clearInterval(intervalRef.current)
    onResolve(password === CORRECT_PASSWORD)
  }

  return (
    <div className="flex items-center gap-4">
      <TileAvatar kind="admin" />
      <div className="flex flex-col gap-2">
        <div
          className="font-bold"
          style={{
            fontSize: '22px',
            color: '#ffe9a8',
            textShadow: '0 2px 3px rgba(0,0,0,0.55)',
          }}
        >
          Admin
        </div>

        {denied ? (
          <div
            className="font-bold"
            style={{
              color: '#ff8a78',
              fontSize: '15px',
              letterSpacing: '0.5px',
              textShadow: '0 1px 3px rgba(0,0,0,0.6)',
            }}
          >
            Access Denied
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <span
                style={{
                  fontSize: '12px',
                  color: 'rgba(220,230,255,0.9)',
                  textShadow: '0 1px 2px rgba(0,0,0,0.55)',
                }}
              >
                Password
              </span>
              <input
                ref={inputRef}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') submit()
                }}
                autoComplete="off"
                className="px-2 py-0.5 text-black"
                style={{
                  width: 180,
                  background: '#fff',
                  border: '1px inset #4a6c9c',
                  fontFamily: 'Tahoma, sans-serif',
                  fontSize: '13px',
                }}
              />
            </div>
            <div
              className="text-[11px] opacity-75 tabular-nums"
              style={{ color: 'rgba(220,230,255,0.85)' }}
            >
              Press Enter · timeout in {secondsLeft}s
            </div>
          </>
        )}
      </div>
    </div>
  )
}
