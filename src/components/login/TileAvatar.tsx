'use client'

// Glossy 64×64 user-pic frame, XP-style — used by every login subview.

interface Props {
  kind: 'admin' | 'kai'
}

export default function TileAvatar({ kind }: Props) {
  return (
    <div
      style={{
        width: 64,
        height: 64,
        padding: 3,
        borderRadius: 6,
        background:
          'linear-gradient(to bottom, #ffffff 0%, #b6cfee 55%, #6c95d0 100%)',
        boxShadow: '0 2px 5px rgba(0,0,0,0.5)',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 4,
          background:
            kind === 'admin'
              ? 'linear-gradient(to bottom, #2c8a2c 0%, #1d5d1d 100%)'
              : 'linear-gradient(to bottom, #4a82d8 0%, #2966bd 60%, #16489c 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {kind === 'admin' ? <ShieldGlyph /> : <UserGlyph />}
      </div>
    </div>
  )
}

function ShieldGlyph() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden>
      <path
        d="M20 4 L34 9 L34 21 C34 29 27 35 20 37 C13 35 6 29 6 21 L6 9 Z"
        fill="#fff"
        stroke="#0c3878"
        strokeWidth="1"
      />
      <rect x="14" y="18" width="12" height="10" rx="1" fill="#1c5fd6" />
      <path
        d="M16 18 L16 15 A4 4 0 0 1 24 15 L24 18"
        fill="none"
        stroke="#1c5fd6"
        strokeWidth="2"
      />
    </svg>
  )
}

function UserGlyph() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" aria-hidden>
      <circle cx="24" cy="18" r="8" fill="#fff" />
      <path d="M10 44 C10 33 16 27 24 27 C32 27 38 33 38 44 Z" fill="#fff" />
    </svg>
  )
}
