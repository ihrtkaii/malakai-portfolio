'use client'

import { useState } from 'react'
import TileAvatar from './TileAvatar'

interface Props {
  kind: 'admin' | 'kai'
  onClick: () => void
}

export default function UserTile({ kind, onClick }: Props) {
  const [hovered, setHovered] = useState(false)
  const label = kind === 'admin' ? 'Admin' : 'Kai'
  const helper = kind === 'admin' ? 'Type your password' : 'Click here to log on'

  return (
    <button
      type="button"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-3 rounded-md focus:outline-none transition-all"
      style={{
        background: hovered
          ? 'linear-gradient(to bottom, rgba(255,255,255,0.22) 0%, rgba(120,180,255,0.18) 100%)'
          : 'transparent',
        border: hovered ? '1px solid rgba(180,210,255,0.55)' : '1px solid transparent',
        boxShadow: hovered ? '0 0 18px rgba(140,190,255,0.3)' : 'none',
        minWidth: '260px',
        textAlign: 'left',
      }}
    >
      <TileAvatar kind={kind} />
      <div className="flex flex-col">
        <span
          className="font-bold"
          style={{
            fontSize: '20px',
            color: '#ffe9a8',
            textShadow: '0 2px 3px rgba(0,0,0,0.55)',
          }}
        >
          {label}
        </span>
        <span
          className="opacity-90"
          style={{
            fontSize: '12px',
            color: 'rgba(220,230,255,0.95)',
            textShadow: '0 1px 2px rgba(0,0,0,0.55)',
          }}
        >
          {helper}
        </span>
      </div>
    </button>
  )
}
