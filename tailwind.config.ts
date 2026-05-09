import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-base': '#03060a',
        'bg-surface': '#0a0e14',
        'bg-elevated': '#14181f',
        'accent-green': '#00ff88',
        'accent-cyan': '#0ea5e9',
        'accent-amber': '#f59e0b',
        'accent-red': '#ef4444',
        'xp-blue': '#0058e6',
        'xp-blue-dark': '#0040b0',
        'xp-green': '#3aa030',
        'text-primary': '#e8e8e8',
        'text-muted': '#888888',
        'text-dim': '#555555',
      },
      fontFamily: {
        mono: ['var(--font-mono)', 'JetBrains Mono', 'monospace'],
        sans: ['var(--font-sans)', 'Plus Jakarta Sans', 'sans-serif'],
        tahoma: ['Tahoma', 'MS Sans Serif', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
