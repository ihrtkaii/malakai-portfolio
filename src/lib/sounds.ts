// Browser-only — only call from 'use client' components
// Howler instances are lazy-initialized so missing files don't throw at load time

import type { Howl as HowlType } from 'howler'

type SoundName =
  | 'boot'
  | 'click'
  | 'crt-on'
  | 'keypress'
  | 'rain'
  | 'startup'
  | 'desktop-ambient'
  | 'error'

interface SoundConfig {
  volume?: number
  loop?: boolean
}

const config: Record<SoundName, SoundConfig> = {
  boot: { volume: 0.7 },
  click: { volume: 0.5 },
  'crt-on': { volume: 0.7 },
  keypress: { volume: 0.3 },
  rain: { volume: 0.25, loop: true },
  startup: { volume: 0.7 },
  'desktop-ambient': { volume: 0.3, loop: true },
  error: { volume: 0.8 },
}

const cache = new Map<SoundName, HowlType>()

function load(name: SoundName): HowlType | null {
  if (typeof window === 'undefined') return null
  if (cache.has(name)) return cache.get(name)!

  try {
    const { Howl } = require('howler') as { Howl: typeof HowlType }
    const { volume = 0.7, loop = false } = config[name]
    const howl = new Howl({
      src: [`/sounds/${name}.mp3`],
      volume,
      loop,
      html5: true,
      onloaderror: () => { /* file not yet available */ },
    })
    cache.set(name, howl)
    return howl
  } catch {
    return null
  }
}

export function playSound(name: SoundName): void {
  try {
    load(name)?.play()
  } catch {
    // sound file not yet available
  }
}

export function stopSound(name: SoundName): void {
  try {
    load(name)?.stop()
  } catch {
    // sound file not yet available
  }
}

export function pauseSound(name: SoundName): void {
  try {
    load(name)?.pause()
  } catch {
    // sound file not yet available
  }
}
