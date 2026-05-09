# Malakai Portfolio — Build Brief

You are building a cinematic, immersive cybersecurity portfolio for Malakai — an 18-year-old SOC analyst in training based in Kissimmee, FL. Help Desk / CRT Technician at Micro Key Solutions. CompTIA Security+ and Network+ certified. Heading to UCF Fall 2026 for a B.S. in IT with a cybersecurity focus.

The project is already scaffolded as a Next.js 14 App Router project with TypeScript, Tailwind, and the dependencies listed in package.json. Read package.json before you start.

**Read this entire brief before writing a single line of code. Then build it phase by phase, asking the user to verify between phases. Do not try to one-shot the whole thing.**

---

## The Experience

A two-act portfolio:

**Act 1** — A real 3D late-night cybersecurity workstation rendered with React Three Fiber. Rain outside the window, glowing CRT monitor with terminal output, ambient lighting from an RGB strip + monitor + window. The user can subtly orbit the camera. Clicking the monitor triggers a cinematic zoom-in.

**Act 2** — Camera flies into the screen, CRT flash transition, then a Windows XP-inspired operating system boots up. Desktop has icons (About, Projects, Skills, Certs, Contact, CMD). Windows are draggable, taskbar is functional, CMD is fully interactive.

**The vibe:** A real cybersecurity enthusiast's lived-in late-night workspace, not a hacker movie cliche. Nostalgic, technical, authentic, cinematic. Inspired by early-2000s computer culture but with modern frontend polish.

**Avoid:** cyberpunk overload, neon everywhere, gaming/anime aesthetics, generic templates, flat 2D look.

---

## Tech Stack (locked in)

- Next.js 14 (App Router)
- TypeScript (strict mode)
- Tailwind CSS
- React Three Fiber (`@react-three/fiber`)
- drei (`@react-three/drei`) — for OrbitControls, Environment, useGLTF, MeshReflectorMaterial, ContactShadows, Html, useTexture, RoundedBox, Text
- postprocessing (`@react-three/postprocessing`) — Bloom, DepthOfField, Vignette, ChromaticAberration, Noise
- Framer Motion (UI animations only, NOT 3D)
- Zustand (global state — phase machine: loading | room | zooming | booting | desktop)
- Howler (sound effects)
- Three.js types (`@types/three`)

Do NOT add other 3D libs. Do NOT use Babylon, p5, or vanilla Three.

---

## File Structure (build exactly this)

```
src/
├── app/
│   ├── layout.tsx              # metadata, OG tags, font loading
│   ├── page.tsx                # entry — renders <Experience />
│   └── globals.css             # Tailwind, CSS vars, scrollbar
├── components/
│   ├── Experience.tsx          # top-level state machine
│   ├── room/
│   │   ├── RoomScene.tsx       # <Canvas> wrapper with R3F setup
│   │   ├── Room.tsx            # walls, floor, ceiling, window cutout
│   │   ├── Desk.tsx            # desk geometry + reflective material
│   │   ├── Monitor.tsx         # CRT monitor — clickable, has terminal Html
│   │   ├── Keyboard.tsx        # mechanical keyboard with backlit keys
│   │   ├── DeskItems.tsx       # mug, router, Pi, Flipper, SSD, books, USB drives, notebook
│   │   ├── WindowView.tsx      # rain + cityscape outside window
│   │   ├── Lighting.tsx        # all light sources
│   │   ├── PostFX.tsx          # bloom, DoF, vignette, noise
│   │   └── Particles.tsx       # dust particles instanced mesh
│   ├── transition/
│   │   └── ZoomTransition.tsx  # camera flythrough + CRT flash overlay
│   ├── os/
│   │   ├── PortfolioOS.tsx     # XP desktop shell
│   │   ├── BootSequence.tsx    # boot screen with progress bar
│   │   ├── Desktop.tsx         # wallpaper + icon grid
│   │   ├── Taskbar.tsx         # start menu, task list, system tray
│   │   ├── Window.tsx          # base draggable window component
│   │   ├── DesktopIcon.tsx
│   │   └── windows/
│   │       ├── AboutWindow.tsx
│   │       ├── ProjectsWindow.tsx
│   │       ├── SkillsWindow.tsx
│   │       ├── CertsWindow.tsx
│   │       ├── ContactWindow.tsx
│   │       └── CmdWindow.tsx   # interactive terminal
│   └── ui/
│       └── LoadingScreen.tsx
├── lib/
│   ├── store.ts                # Zustand: phase, openWindows, focusedWindow
│   ├── portfolioData.ts        # all content (single source of truth)
│   ├── terminalCommands.ts     # cmd handlers, including easter eggs
│   └── sounds.ts               # Howler instances + lazy preload
├── hooks/
│   ├── useTypewriter.ts
│   ├── useReducedMotion.ts
│   └── useDraggable.ts         # window dragging logic
└── types/
    └── index.ts

public/
├── models/                     # GLTF models added later — primitives for now
├── textures/
├── sounds/
│   ├── boot.mp3
│   ├── click.mp3
│   ├── crt-on.mp3
│   ├── keypress.mp3
│   └── rain.mp3
├── fonts/
└── favicon.ico
```

---

## Design System

**Colors** (define in globals.css and re-export via tailwind.config.ts):
```
--bg-base: #03060a
--bg-surface: #0a0e14
--bg-elevated: #14181f
--accent-green: #00ff88        (primary CRT/SOC)
--accent-cyan: #0ea5e9         (secondary)
--accent-amber: #f59e0b        (warnings, retro accent)
--accent-red: #ef4444          (errors)
--xp-blue: #0058e6             (XP title bar)
--xp-blue-dark: #0040b0
--xp-green: #3aa030            (XP start button)
--text-primary: #e8e8e8
--text-muted: #888
--text-dim: #555
```

**Fonts** (load via next/font):
- JetBrains Mono — terminal, code, CRT screen
- Plus Jakarta Sans — modern UI text (NOT used in XP windows)
- Tahoma stack — XP windows specifically (Tahoma → MS Sans Serif → sans-serif)

---

## Phase 1 — Project Scaffolding & State

Build in this order:

1. `tailwind.config.ts` with the color palette and font extensions
2. `globals.css` with CSS variables and base styles
3. `lib/store.ts` — Zustand store:
```ts
   type Phase = 'loading' | 'room' | 'zooming' | 'booting' | 'desktop'
   type WindowId = 'about' | 'projects' | 'skills' | 'certs' | 'contact' | 'cmd'
   interface State {
     phase: Phase
     setPhase: (p: Phase) => void
     openWindows: WindowId[]
     focusedWindow: WindowId | null
     openWindow: (id: WindowId) => void
     closeWindow: (id: WindowId) => void
     focusWindow: (id: WindowId) => void
     reducedMotion: boolean
   }
```
4. `lib/portfolioData.ts` — see CONTENT section below
5. `types/index.ts` — shared types
6. `components/Experience.tsx` — renders LoadingScreen | RoomScene | ZoomTransition | BootSequence | PortfolioOS based on phase
7. `app/page.tsx` — just renders `<Experience />`
8. `app/layout.tsx` — metadata, OG tags, font setup

**After Phase 1, stop.** Run `npm run dev`. Confirm no errors. Show the user a placeholder loading state.

---

## Phase 2 — The 3D Room

Build `RoomScene.tsx` as the R3F Canvas root:

```tsx

  
    
    
    
    
    
    
    
    
    
    
    <OrbitControls
      enableZoom={false}
      enablePan={false}
      minPolarAngle={Math.PI / 2.4}
      maxPolarAngle={Math.PI / 2}
      minAzimuthAngle={-Math.PI / 12}
      maxAzimuthAngle={Math.PI / 12}
      enableDamping
      dampingFactor={0.05}
    />
  

```

**Geometry approach:** DO NOT load external GLTF models in this phase. Build everything from primitives (BoxGeometry, CylinderGeometry, PlaneGeometry, drei's RoundedBox). Models can be swapped in later. Goal: get the lit, materialed scene working with primitives first.

### Room (Room.tsx)
- Floor: 12×12 plane, dark wood material with MeshStandardMaterial, roughness 0.7
- Back wall: 12×6 plane behind the desk, dark navy material
- Side walls: 12×6 planes angled inward (rotateY by ±15°) for atmospheric depth
- Window cutout in back wall: 2×1.5m frame with mullion cross, WindowView mounted inside

### Desk (Desk.tsx)
- Top surface: 3.0 × 0.05 × 1.2 RoundedBox, MeshReflectorMaterial with mixStrength 0.8 so monitor glow reflects subtly
- Front panel + legs: BoxGeometry with dark matte material
- Cast shadow onto floor

### Monitor (Monitor.tsx) — hero object
- CRT body: chunky RoundedBox, beige-gray material with high roughness
- Screen recess: black inner box with emissive green tint
- Bezel-bottom: 14px tall with a small power LED (emissive green, pulsing)
- Screen content: drei `<Html transform>` inside the recess, rendering a div with terminal output (use useTypewriter hook)
- Make the entire monitor group clickable (onClick → `store.setPhase('zooming')`)
- onPointerOver: cursor pointer + slight emissive boost
- Stand: cylinder + small base, anchored on the desk
- Brand label "VIEWMASTER" or similar (use drei `<Text>`)

### Keyboard (Keyboard.tsx)
- Body: RoundedBox 0.4 × 0.02 × 0.15
- Keys: instanced mesh, ~60 small RoundedBoxes arranged in 4 rows
- 3-5 random keys have emissive blue/cyan material on a slow pulse (useFrame for opacity sin wave)

### Desk Items (DeskItems.tsx)
Group of small detailed objects on the desk. Place with realistic spacing — don't crowd:
- Coffee mug: cylinder + handle (torus), with steam particles (small sprite)
- Router: rectangular box with two cylindrical antennas, 4 emissive light dots on top (animate opacity)
- Raspberry Pi: thin green PCB with tiny components (small extruded boxes)
- Flipper Zero: orange rounded box with tiny black screen (emissive)
- Samsung SSD: black rounded box with tiny blue LED
- 2 USB drives: cylinders with metal connector tips
- Hardcover book (red, "Sec+"): box with extruded text via drei `<Text>`
- Spiral notebook: tan box, slight rotation
- Sticky note: small square, yellow material with text via `<Text>`

### Window View (WindowView.tsx)
What you see through the window:
- Far back plane with sky gradient (custom shader material OR tiled texture)
- Cityscape silhouette: instanced boxes with random heights
- Building lights: instanced points with emissive material, some flickering
- Rain: instanced thin lines falling, animate y position in useFrame, reset when below bound
- Slight blue volumetric glow

### Lighting (Lighting.tsx)
- Ambient light: 0.15 intensity, slight blue tint
- Hemisphere light: sky `#1a3050`, ground `#0a0e14`
- Directional "moonlight" through window: position `[4, 5, -2]`, soft, slight blue, casts shadows
- Point light from monitor: position at monitor screen, color `#00ff88`, intensity 0.8, distance 3
- Point light from RGB strip: position high on back wall, color cycles through purple → cyan → green using useFrame
- Optional spot light from desk lamp: warm yellow, narrow cone

### Particles (Particles.tsx)
- InstancedMesh with ~80 tiny spheres
- Random positions in 8×4×4 box
- useFrame: drift slowly upward, reset when out of bounds
- Slightly transparent white material

### PostFX (PostFX.tsx)
```tsx

  
  
  
  
  

```

**After Phase 2, stop.** Show a screenshot or describe the visual state. Iterate on materials, lighting, and proportions before moving on.

---

## Phase 3 — Transition

`ZoomTransition.tsx`:
- Listens for `phase === 'zooming'`
- Animates the R3F camera using useFrame: lerp position toward the monitor `(0, 1.4, 1.2)`, lerp fov from 45 to 15
- After 1.2s, trigger CRT flash overlay (full-screen div, opacity keyframe: 0 → 0.7 → 0.2 → 0.95 → 0 over 0.6s, green radial gradient)
- Play `crt-on.mp3`
- On completion, `store.setPhase('booting')`

---

## Phase 4 — Boot Sequence

`BootSequence.tsx`:
- Full-screen black div
- Centered: "SOC OS" logo (large, letter-spaced), version line, progress bar (XP-style chunked bar, 240px wide, animates fill over 3s)
- Below progress bar: rotating boot text:
```
  starting up...
  detecting hardware...
  loading kernel modules...
  initializing network stack...
  mounting filesystem...
  loading user profile: malakai
  starting desktop environment...
  welcome.
```
- After 3.2s, `store.setPhase('desktop')`
- Play `boot.mp3` once at start

---

## Phase 5 — XP-Inspired Portfolio OS

### PortfolioOS.tsx
- Full-screen Bliss-inspired wallpaper: CSS gradient (blue sky top → green hills bottom) with 2-3 cloud divs (white blurred ellipses)
- Sun glow in top-right
- Renders `<Desktop />` + `<Taskbar />` + all `<Window />` instances (controlled by `openWindows` from store)

### Desktop.tsx
- Grid of icons in top-left (2 columns)
- Icons: About, Projects, Skills, Certs, Contact, CMD
- Each icon = inline SVG + label in white with text shadow (Tahoma)
- Single-click selects (blue dotted outline + light bg), double-click opens window
- Click empty desktop deselects

### Taskbar.tsx
- 32px tall, gradient blue (`var(--xp-blue)` → darker)
- Left: "start" button — green gradient, italic bold, rounded-right corner
- Middle: open window task buttons (one per open window, max-width 140px, ellipsis overflow)
- Right: system tray with wifi icon, speaker icon, live clock (HH:MM AM/PM)

### Window.tsx — base draggable window
- Title bar: blue gradient, white text, app icon, minimize/maximize/close buttons (XP style, only close functional)
- Body: white background, padding 14px, font: Tahoma 11px
- Drag handler on title bar (use `useDraggable` hook with mouse + touch events)
- Stack order via z-index = `focusedWindow ? high : low`
- Min/max buttons can be cosmetic only
- Open animation: scale from 0.95 to 1, opacity 0 to 1, 200ms ease

### Window contents
- **AboutWindow**: title "about_me.txt - Notepad", plain text body with menubar (File/Edit/Format/View/Help — non-functional)
- **SkillsWindow**: title "skills.json - Properties", skill bars with XP-style chunked progress bars
- **CertsWindow**: title "My Certifications", list of cert cards with green/amber border accents
- **ProjectsWindow**: title "My Projects", list of project cards with hover background change, status pills
- **ContactWindow**: title "contact.eml - Outlook Express", table of contact info
- **CmdWindow**: title "C:\\WINDOWS\\system32\\cmd.exe", black bg, gray text (Consolas), full interactive terminal

### CmdWindow specifics
- Header: `Microsoft Windows [Version 5.1.2600]` and `(C) Copyright 1985-2026 Malakai Corp.`
- Prompt: `C:\Users\malakai>`
- Input: transparent, white text, blinking caret
- ArrowUp/ArrowDown cycles through history
- Tab autocomplete (bonus)
- Commands defined in `lib/terminalCommands.ts`
- Auto-focus input when window opens or is clicked
- Auto-scroll to bottom on output

---

## Content (lib/portfolioData.ts)

```ts
export const profile = {
  name: 'Malakai',
  title: 'SOC Analyst in training',
  location: 'Kissimmee, FL',
  age: 18,
  tagline: 'Help Desk / CRT Tech building toward cybersecurity',
}

export const about = `Malakai — SOC Analyst in training. Help Desk / CRT Technician @ Micro Key Solutions. CompTIA Security+ & Network+ certified before age 18.

Building toward a cybersecurity career — UCF IT (Cybersecurity focus), Fall 2026, expected May 2028.

Nearly 1 year hands-on production IT: AWS EC2, ransomware incident response, Windows Server, SQL Anywhere, TCP/IP troubleshooting, SOC fundamentals.`

export const skills = [
  { name: 'Network security', level: 85 },
  { name: 'Windows Server', level: 80 },
  { name: 'Incident response', level: 75 },
  { name: 'Python', level: 72 },
  { name: 'AWS EC2', level: 70 },
  { name: 'SQL / Database', level: 65 },
  { name: 'Sentinel / KQL', level: 60 },
  { name: 'Splunk', level: 50 },
]

export const certs = [
  { name: 'CompTIA Security+', code: 'SY0-701', status: 'active', note: 'earned before age 18' },
  { name: 'CompTIA Network+', code: 'N10-008', status: 'active' },
  { name: 'CompTIA CySA+', status: 'in-progress', note: 'target Q2 2026' },
  { name: 'Splunk Core User', status: 'planned', note: 'TryHackMe path active' },
]

export const projects = [
  {
    name: 'Microsoft Sentinel Homelab',
    status: 'live',
    description: 'Honeypot VM (LEGACY-FILESVR-EAST-01) in Azure. Log Analytics + Sentinel, KQL log ingestion, real attack data captured.',
    tags: ['Azure', 'KQL', 'SIEM'],
    link: '#',
  },
  {
    name: 'CyberReady SaaS',
    status: 'MVP',
    description: 'Cyber insurance readiness tool for SMBs. 20-question assessment → AI-scored risk tier + branded PDF report. $39 monetization.',
    tags: ['React', 'Node.js', 'Claude API'],
    link: '#',
  },
  {
    name: 'JobBot',
    status: 'running',
    description: 'Automated Python job search pipeline — multi-API sourcing, semantic scoring, daily ranked email digest.',
    tags: ['Python', 'NLP', 'APIs'],
    link: '#',
  },
  {
    name: 'ResumeX',
    status: 'beta',
    description: 'AI resume tailoring engine — JD-aware bullet rewriting with LaTeX output for clean PDFs.',
    tags: ['React/Vite', 'Claude API', 'LaTeX'],
    link: '#',
  },
]

export const experience = [
  {
    company: 'Micro Key Solutions',
    role: 'Help Desk / CRT Technician',
    period: 'Apr 2025 – present',
    bullets: [
      'Tier 1-2 support across alarm/monitoring stack',
      'AWS EC2 setup, security groups, monitoring',
      'Ransomware incident response',
      'SQL Anywhere troubleshooting + queries',
      'End-to-end ticket ownership w/ direct customer comms',
    ],
  },
]

export const contact = {
  location: 'Kissimmee, FL',
  target: 'SOC analyst, IT security, Tier 2 helpdesk',
  remote: 'yes — or Orlando area',
  ucf: 'Fall 2026 IT/Cyber',
  status: 'available immediately',
  email: 'YOUR_EMAIL_HERE',
  linkedin: 'YOUR_LINKEDIN_URL_HERE',
  github: 'YOUR_GITHUB_URL_HERE',
}
```

The user will fill in `YOUR_EMAIL_HERE` etc. themselves. Use placeholders for now.

---

## Terminal Commands (lib/terminalCommands.ts)

**Standard:** `help`, `whoami`, `skills`, `projects`, `certs`, `experience`, `contact`, `ipconfig`, `cls`, `clear`, `exit`

**Hidden:** `matrix`, `coffee`, `hire-malakai`, `sudo`

Each command returns a string (or array of lines). Pull from `portfolioData`. Format outputs to look like authentic Windows CMD — use ASCII art for borders, plain text for tables.

`ipconfig` should output realistic Windows IP Configuration text:
```
Windows IP Configuration

Ethernet adapter Local Area Connection:
  Connection-specific DNS Suffix . : home.local
  IPv4 Address. . . . . . . . . . . : 192.168.1.42
  Subnet Mask . . . . . . . . . . . : 255.255.255.0
  Default Gateway . . . . . . . . . : 192.168.1.1
```

`hire-malakai` outputs an ASCII-bordered call to action.

`sudo` returns "Permission denied. Nice try though."

`matrix` outputs binary text representing "MALAKAI".

`coffee` shows a brewing progress bar that ends "Out of beans. Send help."

---

## Performance & Accessibility (non-negotiable)

- Lighthouse Performance score must be 80+
- All R3F components: wrap in Suspense, use useMemo/useCallback aggressively
- Use InstancedMesh for any group of 5+ identical objects
- Lazy-load PortfolioOS (only mount when phase !== 'room')
- Lazy-load PostFX (only mount on desktop, not mobile)
- `useReducedMotion` hook: if true, skip the zoom transition (jump cut), disable particles, disable post-fx noise
- Mobile: detect touch, replace OrbitControls with single static camera angle, simplify lighting, lower DPR
- All windows keyboard-navigable: Tab through icons, Enter opens, Escape closes focused window
- aria-labels on all clickable 3D elements (use drei's `<Html>` with sr-only spans)
- Color contrast: white-on-XP-blue passes WCAG AA

---

## SEO & Metadata (app/layout.tsx)

```ts
export const metadata = {
  title: 'Malakai — SOC Analyst Portfolio',
  description: 'Cybersecurity portfolio of Malakai. Security+, Network+, building toward SOC analyst roles.',
  openGraph: {
    title: 'Malakai — SOC Analyst Portfolio',
    description: 'An immersive cybersecurity workstation experience.',
    type: 'website',
    images: ['/og-image.png'],
  },
  twitter: { card: 'summary_large_image' },
}
```

---

## Working Rules (read carefully)

1. **STOP between phases.** Don't try to build everything at once. After each phase, summarize what was built and ask the user to verify before continuing.

2. **NEVER create a component over 200 lines.** Split aggressively. If a 3D component gets big, extract sub-components.

3. **ALWAYS run `npm run typecheck` and `npm run lint`** after major changes. Fix all errors before reporting "done".

4. **ALWAYS run `npm run dev`** after Phase 1, 2, 3, 4, 5 completes. Confirm no console errors.

5. **NEVER use `any` types.** Use proper Three.js types from `@types/three`.

6. **NEVER use external GLTF models in v1.** Primitives only. Models added in a later iteration.

7. **NEVER hardcode content into components.** Pull from `lib/portfolioData.ts`.

8. **NEVER use raw px in Tailwind for layout** — use Tailwind's spacing scale. Exception: precise 3D coordinates and pixel-tight XP UI elements can use px.

9. **Comment 3D math** (camera position, light positions, easing curves). Future-me needs to tweak these.

10. **If something is ambiguous, ASK** before guessing. Better to ask 3 questions upfront than refactor twice.

11. **Commit after every passing phase** with a clear message: `git commit -m "Phase 2: 3D room with lighting and primitives"`

12. **Sound files don't exist yet.** Reference them in code (`/sounds/boot.mp3` etc.) but wrap Howler calls in try/catch so missing files don't break the app. The user will add sound files later.

---

## Start Here

Begin with Phase 1. Build the scaffolding and state. Show the user the file tree you create, then the contents of `store.ts`, `portfolioData.ts`, `Experience.tsx`, and `globals.css`. Run dev server. Confirm it works. Then ask if ready for Phase 2.

**Do not start Phase 2 until the user says go.**