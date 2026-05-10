'use client'

// Brief black-with-flicker between BSOD and the secret terminal. Just a
// visual punctuation — no interactivity, parent times it.
export default function RebootFlash() {
  return (
    <div className="fixed inset-0 z-[71] bg-black flex items-center justify-center">
      <div
        style={{
          width: '40vw',
          height: '2px',
          background: 'rgba(255,255,255,0.85)',
          boxShadow: '0 0 20px rgba(255,255,255,0.85)',
          opacity: 0.9,
        }}
      />
    </div>
  )
}
