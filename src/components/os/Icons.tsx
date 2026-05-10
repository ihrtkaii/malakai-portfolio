'use client'

// Inline SVG icons for desktop + windows. Kept simple and chunky to evoke
// early-2000s Luna iconography without the licensing weight of real assets.

interface IconProps {
  size?: number
  className?: string
}

export function NotepadIcon({ size = 32, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} aria-hidden>
      <rect x="6" y="3" width="20" height="26" rx="1" fill="#fdfdfd" stroke="#9aa6b8" />
      <rect x="6" y="3" width="20" height="4" fill="#dbe5f2" />
      <line x1="9" y1="11" x2="23" y2="11" stroke="#7995b0" strokeWidth="1" />
      <line x1="9" y1="15" x2="23" y2="15" stroke="#7995b0" strokeWidth="1" />
      <line x1="9" y1="19" x2="21" y2="19" stroke="#7995b0" strokeWidth="1" />
      <line x1="9" y1="23" x2="22" y2="23" stroke="#7995b0" strokeWidth="1" />
    </svg>
  )
}

export function FolderIcon({ size = 32, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} aria-hidden>
      <path
        d="M3 8 L13 8 L15 11 L29 11 L29 26 L3 26 Z"
        fill="#f6c95a"
        stroke="#9a6f1c"
        strokeWidth="1"
      />
      <path d="M3 8 L13 8 L15 11 L29 11" fill="none" stroke="#fff7d0" strokeWidth="1" />
      <rect x="3" y="11" width="26" height="2" fill="#ffeaa3" />
    </svg>
  )
}

export function CertIcon({ size = 32, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} aria-hidden>
      <rect x="4" y="6" width="24" height="18" rx="1" fill="#fffbe9" stroke="#a18840" />
      <rect x="4" y="6" width="24" height="3" fill="#e8d27e" />
      <line x1="8" y1="13" x2="24" y2="13" stroke="#a18840" strokeWidth="1" />
      <line x1="8" y1="16" x2="22" y2="16" stroke="#a18840" strokeWidth="1" />
      <circle cx="22" cy="22" r="4" fill="#d83a2a" stroke="#7a1a10" />
      <path d="M21 26 L20 30 L22 28 L24 30 L23 26 Z" fill="#d83a2a" stroke="#7a1a10" />
    </svg>
  )
}

export function ChartIcon({ size = 32, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} aria-hidden>
      <rect x="3" y="3" width="26" height="26" rx="1" fill="#ecf3fb" stroke="#5e7a9c" />
      <rect x="7" y="18" width="3" height="8" fill="#3aa030" />
      <rect x="12" y="14" width="3" height="12" fill="#2867c8" />
      <rect x="17" y="10" width="3" height="16" fill="#f59e0b" />
      <rect x="22" y="6" width="3" height="20" fill="#d83a2a" />
    </svg>
  )
}

export function BriefcaseIcon({ size = 32, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} aria-hidden>
      <rect x="4" y="10" width="24" height="16" rx="1.5" fill="#7a5a3a" stroke="#3e2c18" />
      <rect x="11" y="6" width="10" height="5" rx="1" fill="none" stroke="#3e2c18" strokeWidth="1.5" />
      <line x1="4" y1="17" x2="28" y2="17" stroke="#3e2c18" strokeWidth="1" />
      <rect x="14" y="16" width="4" height="2" fill="#d6b878" stroke="#3e2c18" />
    </svg>
  )
}

export function PdfIcon({ size = 32, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} aria-hidden>
      <path
        d="M7 3 L22 3 L26 7 L26 29 L7 29 Z"
        fill="#fdfdfd"
        stroke="#9aa6b8"
      />
      <path d="M22 3 L22 7 L26 7" fill="#dde5f0" stroke="#9aa6b8" />
      <rect x="6" y="18" width="20" height="8" fill="#d83a2a" />
      <text
        x="16"
        y="24.5"
        textAnchor="middle"
        fontSize="6"
        fontWeight="bold"
        fontFamily="Tahoma, sans-serif"
        fill="#fff"
      >
        PDF
      </text>
    </svg>
  )
}

export function CmdIcon({ size = 32, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} aria-hidden>
      <rect x="3" y="5" width="26" height="22" rx="1" fill="#000" stroke="#444" />
      <text
        x="7"
        y="20"
        fontFamily="Consolas, monospace"
        fontSize="11"
        fill="#e8e8e8"
      >
        {'>_'}
      </text>
    </svg>
  )
}

export function StartFlagIcon({ size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <path d="M2 5 C7 3 12 7 17 5 L17 13 C12 15 7 11 2 13 Z" fill="#f6e7a3" />
      <path d="M2 11 C7 9 12 13 17 11 L17 19 C12 21 7 17 2 19 Z" fill="#7fbf4f" />
      <path d="M9 5 L9 19" stroke="#3a3a3a" strokeWidth="0.6" />
    </svg>
  )
}

export function WifiIcon({ size = 14 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" aria-hidden>
      <path
        d="M2 6 Q8 1 14 6"
        stroke="#fff"
        strokeWidth="1.4"
        fill="none"
        opacity="0.9"
      />
      <path
        d="M4 9 Q8 5 12 9"
        stroke="#fff"
        strokeWidth="1.4"
        fill="none"
        opacity="0.9"
      />
      <circle cx="8" cy="12" r="1.4" fill="#fff" />
    </svg>
  )
}

export function NotesIcon({ size = 32, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} aria-hidden>
      <rect x="5" y="3" width="22" height="26" rx="1" fill="#fff8c0" stroke="#a89c40" />
      <rect x="5" y="3" width="22" height="3" fill="#f0e07a" />
      <line x1="9" y1="11" x2="23" y2="11" stroke="#a89c40" strokeWidth="0.8" />
      <line x1="9" y1="15" x2="23" y2="15" stroke="#a89c40" strokeWidth="0.8" />
      <line x1="9" y1="19" x2="21" y2="19" stroke="#a89c40" strokeWidth="0.8" />
      <line x1="9" y1="23" x2="22" y2="23" stroke="#a89c40" strokeWidth="0.8" />
      <path d="M21 26 L27 26 L27 32 Z" fill="#fff8c0" stroke="#a89c40" />
    </svg>
  )
}

export function PlaybookIcon({ size = 32, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} aria-hidden>
      <rect x="6" y="4" width="20" height="26" rx="1" fill="#fdfdfd" stroke="#5e7a9c" />
      <rect x="11" y="2" width="10" height="4" rx="1" fill="#a8b8c8" stroke="#3e5c80" />
      <rect x="13" y="3" width="6" height="2" fill="#5e7a9c" />
      <line x1="9" y1="12" x2="23" y2="12" stroke="#5e7a9c" />
      <line x1="9" y1="16" x2="23" y2="16" stroke="#5e7a9c" />
      <line x1="9" y1="20" x2="20" y2="20" stroke="#5e7a9c" />
      <rect x="9" y="23" width="3" height="3" fill="#3aa030" />
      <text x="14" y="25.5" fontSize="3" fontFamily="Tahoma" fill="#5e7a9c">PICERL</text>
    </svg>
  )
}

export function SplunkIcon({ size = 32, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} aria-hidden>
      <rect x="3" y="3" width="26" height="26" rx="3" fill="#000" />
      <path d="M7 22 L13 16 L7 10 L11 10 L17 16 L11 22 Z" fill="#f7931e" />
      <path d="M16 22 L22 16 L16 10 L20 10 L26 16 L20 22 Z" fill="#65a637" />
    </svg>
  )
}

export function WiresharkIcon({ size = 32, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} aria-hidden>
      <rect x="3" y="3" width="26" height="26" rx="3" fill="#1679c2" />
      <path d="M6 22 Q10 8 16 18 Q22 28 26 14" stroke="#fff" strokeWidth="2.5" fill="none" />
      <circle cx="6" cy="22" r="1.5" fill="#fff" />
      <circle cx="16" cy="18" r="1.5" fill="#fff" />
      <circle cx="26" cy="14" r="1.5" fill="#fff" />
      <path d="M22 6 L25 9 L22 12 L25 9 Z" fill="#fff" />
    </svg>
  )
}

export function NmapIcon({ size = 32, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} aria-hidden>
      <rect x="3" y="3" width="26" height="26" rx="3" fill="#1a1a1a" />
      <circle cx="16" cy="16" r="10" fill="none" stroke="#00ff88" strokeWidth="1" />
      <circle cx="16" cy="16" r="6" fill="none" stroke="#00ff88" strokeWidth="1" />
      <circle cx="16" cy="16" r="2.5" fill="#00ff88" />
      <line x1="16" y1="3" x2="16" y2="29" stroke="#00ff88" strokeWidth="0.5" opacity="0.6" />
      <line x1="3" y1="16" x2="29" y2="16" stroke="#00ff88" strokeWidth="0.5" opacity="0.6" />
      <path d="M16 16 L25 8" stroke="#00ff88" strokeWidth="1.5" />
    </svg>
  )
}

export function MetasploitIcon({ size = 32, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} aria-hidden>
      <rect x="3" y="3" width="26" height="26" rx="3" fill="#0a0a0a" />
      <text
        x="16"
        y="22"
        textAnchor="middle"
        fontSize="18"
        fontWeight="bold"
        fontFamily="Consolas, monospace"
        fill="#d83a2a"
      >
        M
      </text>
      <circle cx="16" cy="13" r="2" fill="#d83a2a" />
      <circle cx="13" cy="11" r="0.8" fill="#0a0a0a" />
      <circle cx="19" cy="11" r="0.8" fill="#0a0a0a" />
    </svg>
  )
}

export function KaliIcon({ size = 32, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} aria-hidden>
      <rect x="3" y="3" width="26" height="26" rx="3" fill="#1a1a1a" />
      <text
        x="6"
        y="22"
        fontSize="14"
        fontFamily="Consolas, monospace"
        fill="#367bf0"
        fontWeight="bold"
      >
        $_
      </text>
      <text
        x="20"
        y="11"
        fontSize="9"
        fontFamily="Consolas, monospace"
        fill="#367bf0"
        fontWeight="bold"
      >
        K
      </text>
    </svg>
  )
}

export function SiemIcon({ size = 32, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} aria-hidden>
      <rect x="3" y="3" width="26" height="26" rx="3" fill="#0a2540" />
      <rect x="6" y="20" width="3" height="6" fill="#3aa030" />
      <rect x="11" y="14" width="3" height="12" fill="#1c5fd6" />
      <rect x="16" y="9" width="3" height="17" fill="#f59e0b" />
      <rect x="21" y="6" width="3" height="20" fill="#d83a2a" />
      <line x1="5" y1="6" x2="27" y2="6" stroke="#fff" strokeWidth="0.4" opacity="0.4" />
      <line x1="5" y1="11" x2="27" y2="11" stroke="#fff" strokeWidth="0.4" opacity="0.4" />
      <line x1="5" y1="16" x2="27" y2="16" stroke="#fff" strokeWidth="0.4" opacity="0.4" />
    </svg>
  )
}

export function SpeakerIcon({ size = 14 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" aria-hidden>
      <path d="M3 6 L6 6 L10 3 L10 13 L6 10 L3 10 Z" fill="#fff" />
      <path
        d="M11 5 Q13 8 11 11"
        stroke="#fff"
        strokeWidth="1.2"
        fill="none"
      />
    </svg>
  )
}
