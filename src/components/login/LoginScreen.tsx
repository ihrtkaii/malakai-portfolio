'use client'

import { useEffect, useRef, useState } from 'react'
import { useStore } from '@/lib/store'
import type { Phase } from '@/types'
import HorizonHeader from './HorizonHeader'
import UserTile from './UserTile'
import LoggingInView from './LoggingInView'
import AdminPasswordView from './AdminPasswordView'
import CrtStaticIntro from './CrtStaticIntro'

type ScreenState = 'static' | 'select' | 'logging-in' | 'admin-password' | 'access-denied'

const KAI_LOGIN_DELAY_MS = 1400
const ADMIN_DENIED_HOLD_MS = 1300

// Fullscreen DOM overlay rendered when phase === 'login'. Hosts the welcome
// screen + interactive logon. Handles four flows:
//   - Cold-boot first login (static intro → tiles → Kai picks → boot)
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
      // Switch-user skips the boot sequence — drop straight back into the
      // (preserved) desktop session via the deep zoom-in.
      advanceTo(isSwitchUserLogin ? 'switching-in' : 'zooming-final')
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

      <HorizonHeader />

      <div className="flex-1 flex items-center justify-center px-[6vw]">
        {screen === 'select' && (
          <div className="flex gap-[3vw] flex-wrap justify-center">
            <UserTile kind="kai" onClick={onSelectKai} />
            <UserTile kind="admin" onClick={onSelectAdmin} />
          </div>
        )}

        {screen === 'static' && (
          <div className="flex gap-[3vw] flex-wrap justify-center opacity-60">
            <UserTile kind="kai" onClick={() => undefined} />
            <UserTile kind="admin" onClick={() => undefined} />
          </div>
        )}

        {screen === 'logging-in' && <LoggingInView username="Kai" />}

        {screen === 'admin-password' && (
          <AdminPasswordView onResolve={onAdminResolve} />
        )}

        {screen === 'access-denied' && (
          <AdminPasswordView onResolve={() => undefined} denied />
        )}
      </div>

      <div className="pb-[5vh] px-[10vw]">
        <div
          style={{
            height: '2px',
            background:
              'linear-gradient(to right, transparent 0%, rgba(255,255,255,0.65) 20%, rgba(255,255,255,0.65) 80%, transparent 100%)',
          }}
        />
        <div className="flex items-center justify-between mt-3">
          <div
            className="opacity-90"
            style={{ fontSize: '13px', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
          >
            {screen === 'select' && 'Click your user name to begin.'}
            {screen === 'logging-in' && 'After you log on, you can add or change accounts.'}
            {screen === 'admin-password' && 'Type your password, then press Enter.'}
            {screen === 'access-denied' && 'Returning to user select…'}
            {screen === 'static' && ' '}
          </div>

          {/* Cancel button — only when this is a Switch User interlude.
              Cancel returns to the (preserved) desktop session via the
              switch-in zoom. */}
          {isSwitchUserLogin && screen !== 'logging-in' && (
            <button
              type="button"
              onClick={onCancel}
              className="aero-task-btn px-4 h-[26px] text-[12px]"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
