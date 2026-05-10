'use client'

import { useMemo } from 'react'

// Authentic-feeling XP BSOD: classic blue, white Lucida-Console-esque text,
// continuous slight shake. Held for 2s by the orchestrator.
export default function BluescreenView() {
  // Stable per-mount fake addresses so the shake doesn't re-randomize them.
  const addrs = useMemo(
    () =>
      Array.from({ length: 4 }, () =>
        `0x${Math.floor(Math.random() * 0xffffffff)
          .toString(16)
          .padStart(8, '0')
          .toUpperCase()}`,
      ),
    [],
  )

  const driver = useMemo(() => {
    const drivers = ['ntoskrnl.exe', 'win32k.sys', 'kbdclass.sys', 'krnl-sec.sys']
    return drivers[Math.floor(Math.random() * drivers.length)]
  }, [])

  return (
    <div
      className="fixed inset-0 z-[70] bsod-shake"
      style={{
        background: '#0024aa',
        color: '#ffffff',
        fontFamily: '"Lucida Console", "Courier New", monospace',
        fontSize: '16px',
        lineHeight: '1.45',
        padding: '6vh 8vw',
        overflow: 'hidden',
      }}
    >
      <p>
        A problem has been detected and SOC OS has been shut down to prevent
        damage to your computer.
      </p>
      <p style={{ marginTop: '1em' }}>UNAUTHORIZED_ACCESS_DETECTED</p>
      <p style={{ marginTop: '1em' }}>
        If this is the first time you&apos;ve seen this Stop error screen,
        restart your computer. If this screen appears again, follow these
        steps:
      </p>
      <p style={{ marginTop: '1em' }}>
        Check that any new hardware or software is properly installed. If this
        is a new installation, ask your hardware or software manufacturer for
        any SOC OS updates you might need.
      </p>
      <p style={{ marginTop: '1em' }}>
        If problems continue, disable or remove any newly installed hardware or
        software. Disable BIOS memory options such as caching or shadowing. If
        you need to use Safe Mode to remove or disable components, restart your
        computer, press F8 to select Advanced Startup Options, and then select
        Safe Mode.
      </p>
      <p style={{ marginTop: '1em' }}>Technical information:</p>
      <p>
        *** STOP: 0xC000DEAD ({addrs.join(', ')})
      </p>
      <p style={{ marginTop: '1em' }}>*** {driver} - Address {addrs[0]} base at {addrs[1]}, DateStamp 4DAB1234</p>
      <p style={{ marginTop: '2em' }}>
        Beginning dump of physical memory
      </p>
      <p>Physical memory dump complete.</p>
      <p>Contact your system administrator or technical support group for further assistance.</p>
    </div>
  )
}
