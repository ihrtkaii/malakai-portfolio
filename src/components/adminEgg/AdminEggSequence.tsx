'use client'

import { useEffect, useState } from 'react'
import BluescreenView from './BluescreenView'
import RebootFlash from './RebootFlash'
import SecretTerminalView from './SecretTerminalView'
import SecretAboutView from './SecretAboutView'

const BSOD_HOLD_MS = 5000
const REBOOT_HOLD_MS = 600

type Stage = 'bsod' | 'reboot' | 'terminal' | 'about'

// Orchestrates the four-stage admin easter egg. Each stage either auto-
// advances after a hold OR (in the case of the secret about page) waits for
// user action.
export default function AdminEggSequence() {
  const [stage, setStage] = useState<Stage>('bsod')

  useEffect(() => {
    if (stage === 'bsod') {
      const t = window.setTimeout(() => setStage('reboot'), BSOD_HOLD_MS)
      return () => window.clearTimeout(t)
    }
    if (stage === 'reboot') {
      const t = window.setTimeout(() => setStage('terminal'), REBOOT_HOLD_MS)
      return () => window.clearTimeout(t)
    }
    // 'terminal' advances itself via onDone; 'about' waits for hire-button.
    return undefined
  }, [stage])

  switch (stage) {
    case 'bsod':
      return <BluescreenView />
    case 'reboot':
      return <RebootFlash />
    case 'terminal':
      return <SecretTerminalView onDone={() => setStage('about')} />
    case 'about':
      return <SecretAboutView />
  }
}
