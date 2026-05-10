'use client'

import { secret, contact } from '@/lib/portfolioData'
import { useStore } from '@/lib/store'

// Final stage of the egg — fourth-wall-breaking bio + glowing hire button.
// Clicking the button opens a mailto: and drops the user back to the desktop
// so they can keep exploring the OS.
export default function SecretAboutView() {
  const setPhase = useStore((s) => s.setPhase)
  const markStartupPlayed = useStore((s) => s.markStartupPlayed)

  const onHire = () => {
    // Don't replay the desktop startup jingle for this re-entry — we're
    // already mid-experience.
    markStartupPlayed()
    if (typeof window !== 'undefined' && contact.email && contact.email !== 'YOUR_EMAIL_HERE') {
      window.location.href = `mailto:${contact.email}?subject=hire%20malakai`
    }
    setPhase('desktop')
  }

  const onSkip = () => {
    markStartupPlayed()
    setPhase('desktop')
  }

  return (
    <div
      className="fixed inset-0 z-[73] overflow-y-auto"
      style={{
        background:
          'radial-gradient(circle at 30% 20%, rgba(0,255,136,0.08), transparent 50%), linear-gradient(to bottom, #03060a 0%, #0a0e14 100%)',
        color: '#e8e8e8',
        fontFamily: '"Plus Jakarta Sans", -apple-system, system-ui, sans-serif',
      }}
    >
      <div className="max-w-[680px] mx-auto px-8 py-[10vh]">
        {/* Heading */}
        <div
          className="text-[12px] tracking-[6px] uppercase mb-2"
          style={{
            color: '#00ff88',
            textShadow: '0 0 8px rgba(0,255,136,0.55)',
          }}
        >
          /backdoor/about
        </div>
        <h1
          className="font-bold leading-tight mb-1"
          style={{
            fontSize: 'clamp(34px, 5vw, 56px)',
            background: 'linear-gradient(to right, #ffffff, #00ff88)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {secret.heading}
        </h1>
        <h2
          className="text-[20px] mb-8"
          style={{ color: '#bbe6ff', fontWeight: 500 }}
        >
          {secret.subheading}
        </h2>

        {/* Bio */}
        <div className="space-y-4 text-[16px] leading-relaxed text-[#cfd6df]">
          {secret.bio.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        {/* Fun facts */}
        <h3
          className="text-[14px] tracking-[3px] uppercase mt-10 mb-3"
          style={{ color: '#00ff88' }}
        >
          while you&apos;re here
        </h3>
        <ul className="space-y-2 text-[15px] text-[#cfd6df]">
          {secret.funFacts.map((fact, i) => (
            <li key={i} className="flex gap-3">
              <span style={{ color: '#00ff88' }}>›</span>
              <span>{fact}</span>
            </li>
          ))}
        </ul>

        {/* Sign-off + hire button */}
        <div className="mt-12 flex flex-col items-start gap-4">
          <div
            className="text-[20px] font-bold"
            style={{
              color: '#ffffff',
              textShadow: '0 1px 4px rgba(0,0,0,0.5)',
            }}
          >
            {secret.signoff}
          </div>
          <div className="flex gap-3 items-center">
            <button
              type="button"
              onClick={onHire}
              className="hire-glow px-6 py-3 rounded-md font-bold text-[16px] tracking-wide"
              style={{
                background: 'linear-gradient(to bottom, #00ff88 0%, #00cc6c 100%)',
                color: '#03060a',
                border: '1px solid #00ff88',
              }}
            >
              → hire malakai
            </button>
            <button
              type="button"
              onClick={onSkip}
              className="px-4 py-3 text-[14px] underline"
              style={{ color: '#888' }}
            >
              just take me to the desktop
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
