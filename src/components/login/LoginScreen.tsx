'use client'

import { useEffect, useRef, useState } from 'react'
import { useStore } from '@/lib/store'
import type { Phase } from '@/types'
import UserTile from './UserTile'
import LoggingInView from './LoggingInView'
import AdminPasswordView from './AdminPasswordView'
import CrtStaticIntro from './CrtStaticIntro'

type ScreenState = 'static' | 'select' | 'logging-in' | 'admin-password' | 'access-denied'

const KAI_LOGIN_DELAY_MS = 1400
const ADMIN_DENIED_HOLD_MS = 1300

// Fullscreen DOM overlay rendered when phase === 'login'. Hosts the welcome
// screen + interactive logon. Handles four flows:
//   - Cold-boot first login (static intro → tiles → boot)
//   - Cold-boot admin egg unlock (admin + correct password → admin-egg phase)
//   - Switch-user re-login (no static intro, includes Cancel)
//   - Wrong / timeout admin password (Access Denied → back to tiles)
export default function LoginScreen() {
  const setPhase = useStore((s) => s.setPhase)
  const isSwitchUserLogin = useStore((s) => s.isSwitchUserLogin)
  const setSwitchUserLogin = useStore((s) => s.setSwitchUserLogin)

  // Static intro plays only on cold-boot login. Switch-user skips straight
  // to the tiles since the user is already mid-flow.
  const [screen, setScreen] = useState<ScreenState>(
    isSwitchUserLogin ? 'select' : 'static',
  )

  const timerRef = useRef<number | null>(null)
  const clearTimer = () => {
    if (timerRef.current != null) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }
  useEffect(() => clearTimer, [])

  const advanceTo = (next: Phase) => {
    setSwitchUserLogin(false)
    setPhase(next)
  }

  const onSelectKai = () => {
    if (screen !== 'select') return
    setScreen('logging-in')
    clearTimer()
    timerRef.current = window.setTimeout(() => {
      // Cold-boot: jump straight to booting. No zooming-final lerp, no CRT
      // flash — the LoginScreen overlay hands off directly to the BootSequence
      // overlay so the 3D room never re-appears between them.
      // Switch-user keeps its deep zoom back into the preserved desktop.
      advanceTo(isSwitchUserLogin ? 'switching-in' : 'booting')
    }, KAI_LOGIN_DELAY_MS)
  }

  const onSelectAdmin = () => {
    if (screen !== 'select') return
    setScreen('admin-password')
  }

  const onAdminResolve = (correct: boolean) => {
    if (correct) {
      advanceTo('admin-egg')
      return
    }
    setScreen('access-denied')
    clearTimer()
    timerRef.current = window.setTimeout(() => {
      setScreen('select')
    }, ADMIN_DENIED_HOLD_MS)
  }

  const onCancel = () => {
    advanceTo('switching-in')
  }

  const helperText =
    screen === 'logging-in'
      ? 'After you log on, you can add or change accounts.'
      : screen === 'admin-password'
      ? 'Type your password, then press Enter.'
      : screen === 'access-denied'
      ? 'Returning to user select…'
      : 'To begin, click your user name.'

  // ── Render ───────────────────────────────────────────────────────
  return (
    <div
      className="fixed inset-0 z-40 flex flex-col"
      style={{
        background:
          'linear-gradient(to bottom, #1a4ec0 0%, #0f3a9c 35%, #062b80 70%, #021c5c 100%)',
        fontFamily: 'Tahoma, "Segoe UI", sans-serif',
        color: '#fff',
        userSelect: 'none',
      }}
    >
      {screen === 'static' && (
        <CrtStaticIntro onDone={() => setScreen('select')} />
      )}

      {/* Top branding band — Microsoft · Horizon XP Professional + divider */}
      <div className="pt-[3vh] px-[6vw]">
        <div
          className="text-[10px] tracking-[3px] opacity-80 uppercase text-center"
          style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
        >
          Microsoft · Horizon XP Professional
        </div>
        <div
          className="mt-2"
          style={{
            height: '2px',
            background:
              'linear-gradient(to right, transparent 0%, rgba(255,255,255,0.65) 20%, rgba(255,255,255,0.65) 80%, transparent 100%)',
          }}
        />
      </div>

      {/* Middle: split layout — left brand/instruction panel, right user list */}
      <div className="flex-1 flex items-stretch px-[6vw] py-[4vh] gap-[4vw]">
        {/* Left panel */}
        <div className="flex-1 flex flex-col justify-center">
          <h1
            className="font-bold leading-none"
            style={{
              fontSize: 'clamp(36px, 5vw, 64px)',
              letterSpacing: '1px',
              textShadow: '0 2px 4px rgba(0,0,0,0.55)',
            }}
          >
            <span style={{ color: '#ffe9a8', fontStyle: 'italic' }}>Horizon</span>{' '}
            <span style={{ color: '#bbe6ff' }}>XP</span>
          </h1>
          <div
            className="mt-6 max-w-[26ch]"
            style={{
              fontSize: '15px',
              color: 'rgba(220,230,255,0.95)',
              textShadow: '0 1px 2px rgba(0,0,0,0.55)',
              lineHeight: 1.45,
            }}
          >
            {helperText}
          </div>
        </div>

        {/* Vertical divider */}
        <div
          aria-hidden
          style={{
            width: '2px',
            background:
              'linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.55) 20%, rgba(255,255,255,0.55) 80%, transparent 100%)',
          }}
        />

        {/* Right panel — stacked tiles / password / spinner */}
        <div className="flex-1 flex flex-col justify-center gap-3">
          {(screen === 'select' || screen === 'static') && (
            <>
              <UserTile
                kind="admin"
                onClick={screen === 'select' ? onSelectAdmin : () => undefined}
              />
              <UserTile
                kind="kai"
                onClick={screen === 'select' ? onSelectKai : () => undefined}
              />
            </>
          )}

          {screen === 'logging-in' && <LoggingInView username="Kai" />}

          {screen === 'admin-password' && (
            <AdminPasswordView onResolve={onAdminResolve} />
          )}

          {screen === 'access-denied' && (
            <AdminPasswordView onResolve={() => undefined} denied />
          )}
        </div>
      </div>

      {/* Bottom bar — full-width divider, Turn off computer left, helper right */}
      <div className="px-[6vw] pb-[3vh]">
        <div
          style={{
            height: '2px',
            background:
              'linear-gradient(to right, transparent 0%, rgba(255,255,255,0.65) 20%, rgba(255,255,255,0.65) 80%, transparent 100%)',
          }}
        />
        <div className="flex items-center justify-between mt-3">
          <button
            type="button"
            className="flex items-center gap-2 opacity-90 hover:opacity-100"
            style={{
              fontSize: '12px',
              color: 'rgba(220,230,255,0.95)',
              textShadow: '0 1px 2px rgba(0,0,0,0.55)',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
            aria-label="Turn off computer"
          >
            <PowerIcon />
            <span>Turn off computer</span>
          </button>

          <div className="flex items-center gap-3">
            {/* Cancel button — only visible during a Switch User interlude.
                Returns to the (preserved) desktop session via switching-in. */}
            {isSwitchUserLogin && screen !== 'logging-in' && (
              <button
                type="button"
                onClick={onCancel}
                className="aero-task-btn px-4 h-[26px] text-[12px]"
              >
                Cancel
              </button>
            )}
            <div
              className="opacity-90"
              style={{
                fontSize: '12px',
                color: 'rgba(220,230,255,0.9)',
                textShadow: '0 1px 2px rgba(0,0,0,0.55)',
              }}
            >
              {helperText}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Power glyph for the Turn off computer button. Inline so it inherits color
// and stays in sync with the surrounding text shadow.
function PowerIcon() {
  return (
    <span
      aria-hidden
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 22,
        height: 22,
        borderRadius: '50%',
        background:
          'radial-gradient(circle at 35% 30%, #ffd5d5 0%, #d8493a 55%, #8a1a10 100%)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.55), 0 1px 2px rgba(0,0,0,0.5)',
        border: '1px solid rgba(0,0,0,0.45)',
      }}
    >
      <svg width="10" height="10" viewBox="0 0 10 10">
        <line x1="5" y1="2" x2="5" y2="5" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" />
        <path
          d="M3 4 A 2.6 2.6 0 1 0 7 4"
          fill="none"
          stroke="#fff"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    </span>
  )
}
