'use client'

import { useState } from 'react'
import { pauseSound, playSound } from '@/lib/sounds'

const TRACK_NAME = 'Frutiger Aero Mix'

export default function MediaPlayerWidget() {
  const [isPlaying, setIsPlaying] = useState(false)

  const toggle = () => {
    if (isPlaying) {
      pauseSound('desktop-ambient')
      setIsPlaying(false)
    } else {
      playSound('desktop-ambient')
      setIsPlaying(true)
    }
  }

  return (
    <div
      className="flex items-center h-[22px] px-1.5 gap-1.5 rounded-sm select-none"
      style={{
        background:
          'linear-gradient(to bottom, rgba(255,255,255,0.18) 0%, rgba(0,0,0,0.22) 100%)',
        border: '1px solid rgba(255,255,255,0.18)',
        boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.18)',
      }}
      title={TRACK_NAME}
    >
      <button
        type="button"
        aria-label={isPlaying ? 'Pause' : 'Play'}
        onClick={toggle}
        className="flex items-center justify-center w-[16px] h-[16px] text-white"
        style={{
          background:
            'linear-gradient(to bottom, #cfe6ff 0%, #6aa6e8 60%, #2e74c7 100%)',
          border: '1px solid #1d4f8f',
          borderRadius: '2px',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.55)',
          cursor: 'pointer',
        }}
      >
        {isPlaying ? (
          <svg width="8" height="8" viewBox="0 0 8 8" aria-hidden>
            <rect x="1" y="1" width="2" height="6" fill="#fff" />
            <rect x="5" y="1" width="2" height="6" fill="#fff" />
          </svg>
        ) : (
          <svg width="8" height="8" viewBox="0 0 8 8" aria-hidden>
            <polygon points="1,1 7,4 1,7" fill="#fff" />
          </svg>
        )}
      </button>

      <div
        className="overflow-hidden"
        style={{
          width: 80,
          fontSize: '10px',
          color: '#fff',
          textShadow: '0 1px 1px rgba(0,0,0,0.55)',
        }}
      >
        <div className="aero-mp-marquee whitespace-nowrap">
          <span>{TRACK_NAME}</span>
          <span style={{ paddingLeft: 24 }}>{TRACK_NAME}</span>
        </div>
      </div>
    </div>
  )
}
