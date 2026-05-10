'use client'

import TileAvatar from './TileAvatar'

interface Props {
  username: 'Kai' | 'Admin'
}

// "Logging in..." splash — chosen tile + spinner. Renders briefly between
// tile click and the next phase transition (boot or admin-egg).
export default function LoggingInView({ username }: Props) {
  return (
    <div className="flex flex-col items-center gap-4">
      <TileAvatar kind={username === 'Kai' ? 'kai' : 'admin'} />
      <div
        className="font-bold text-[20px]"
        style={{ color: '#ffe9a8', textShadow: '0 2px 3px rgba(0,0,0,0.55)' }}
      >
        {username}
      </div>
      <div
        className="flex items-center gap-2 opacity-90"
        style={{
          fontFamily: 'Consolas, "JetBrains Mono", monospace',
          fontSize: '14px',
          letterSpacing: '1px',
          textShadow: '0 1px 2px rgba(0,0,0,0.5)',
        }}
      >
        <Spinner />
        <span>logging in...</span>
      </div>
    </div>
  )
}

function Spinner() {
  return (
    <div
      style={{
        width: 16,
        height: 16,
        border: '2px solid rgba(255,255,255,0.3)',
        borderTopColor: '#ffe9a8',
        borderRadius: '50%',
        animation: 'loginSpin 0.9s linear infinite',
      }}
    />
  )
}
