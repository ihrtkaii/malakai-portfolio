'use client'

// Top branding band — Horizon XP wordmark + horizontal divider, mirrors the
// XP welcome chrome.

export default function HorizonHeader() {
  return (
    <div className="relative pt-[6vh] px-[10vw]">
      <div className="text-center">
        <div
          className="text-[10px] tracking-[3px] opacity-80 uppercase"
          style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
        >
          Microsoft · Horizon XP Professional
        </div>
        <h1
          className="font-bold mt-2 inline-flex items-center gap-3"
          style={{
            fontSize: 'clamp(28px, 4.5vw, 56px)',
            letterSpacing: '1px',
            textShadow: '0 2px 4px rgba(0,0,0,0.55)',
          }}
        >
          <span>Welcome to</span>
          <span
            style={{
              color: '#ffe9a8',
              fontStyle: 'italic',
            }}
          >
            Horizon
          </span>
          <span style={{ color: '#bbe6ff' }}>XP</span>
        </h1>
      </div>
      <div
        className="mt-4"
        style={{
          height: '2px',
          background:
            'linear-gradient(to right, transparent 0%, rgba(255,255,255,0.65) 20%, rgba(255,255,255,0.65) 80%, transparent 100%)',
        }}
      />
    </div>
  )
}
