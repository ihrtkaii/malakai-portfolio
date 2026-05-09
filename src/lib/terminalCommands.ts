import { profile, about, skills, certs, projects, experience, contact } from './portfolioData'

export interface CommandResult {
  output: string[]
  shouldClear?: boolean
  shouldClose?: boolean
}

type CommandHandler = (args: string[]) => CommandResult

const commands: Record<string, CommandHandler> = {
  help: () => ({
    output: [
      '',
      'Available commands:',
      '  help         — show this help',
      '  whoami       — about Malakai',
      '  skills       — technical skill levels',
      '  projects     — project portfolio',
      '  certs        — certifications',
      '  experience   — work history',
      '  contact      — contact info',
      '  ipconfig     — IP configuration',
      '  cls / clear  — clear terminal',
      '  exit         — close window',
      '',
      'Easter eggs: try something... creative.',
      '',
    ],
  }),

  whoami: () => ({
    output: [
      '',
      `  ${profile.name}`,
      `  ${profile.title}`,
      `  ${profile.location}`,
      `  ${profile.tagline}`,
      '',
      ...about.split('\n').map((l) => `  ${l}`),
      '',
    ],
  }),

  skills: () => ({
    output: [
      '',
      '  Technical Skills',
      '  ─────────────────────────────────────',
      ...skills.map((s) => {
        const filled = Math.floor(s.level / 10)
        const bar = '█'.repeat(filled) + '░'.repeat(10 - filled)
        return `  ${s.name.padEnd(22)} [${bar}] ${s.level}%`
      }),
      '',
    ],
  }),

  projects: () => ({
    output: [
      '',
      '  Projects',
      '  ────────────────────────────────────────',
      ...projects.flatMap((p) => [
        `  [${p.status.toUpperCase()}] ${p.name}`,
        `    ${p.description}`,
        `    Tags: ${p.tags.join(', ')}`,
        '',
      ]),
    ],
  }),

  certs: () => ({
    output: [
      '',
      '  Certifications',
      '  ────────────────────────────────────────',
      ...certs.map((c) => {
        const code = c.code ? ` (${c.code})` : ''
        const note = c.note ? ` — ${c.note}` : ''
        const badge =
          c.status === 'active'
            ? '[ACTIVE]     '
            : c.status === 'in-progress'
              ? '[IN PROGRESS]'
              : '[PLANNED]    '
        return `  ${badge}  ${c.name}${code}${note}`
      }),
      '',
    ],
  }),

  experience: () => ({
    output: [
      '',
      '  Work Experience',
      '  ────────────────────────────────────────',
      ...experience.flatMap((e) => [
        `  ${e.company} — ${e.role}`,
        `  ${e.period}`,
        ...e.bullets.map((b) => `    • ${b}`),
        '',
      ]),
    ],
  }),

  contact: () => ({
    output: [
      '',
      '  Contact',
      '  ────────────────────────────────────────',
      `  Email     :  ${contact.email}`,
      `  LinkedIn  :  ${contact.linkedin}`,
      `  GitHub    :  ${contact.github}`,
      `  Location  :  ${contact.location}`,
      `  Status    :  ${contact.status}`,
      `  Target    :  ${contact.target}`,
      `  Remote    :  ${contact.remote}`,
      `  UCF       :  ${contact.ucf}`,
      '',
    ],
  }),

  ipconfig: () => ({
    output: [
      '',
      'Windows IP Configuration',
      '',
      'Ethernet adapter Local Area Connection:',
      '   Connection-specific DNS Suffix  . : home.local',
      '   IPv4 Address. . . . . . . . . . . : 192.168.1.42',
      '   Subnet Mask . . . . . . . . . . . : 255.255.255.0',
      '   Default Gateway . . . . . . . . . : 192.168.1.1',
      '',
      'Wireless LAN adapter Wi-Fi:',
      '   Connection-specific DNS Suffix  . : local',
      '   IPv4 Address. . . . . . . . . . . : 192.168.1.108',
      '   Subnet Mask . . . . . . . . . . . : 255.255.255.0',
      '   Default Gateway . . . . . . . . . : 192.168.1.1',
      '',
    ],
  }),

  exit: () => ({ output: [], shouldClose: true }),

  cls: () => ({ output: [], shouldClear: true }),

  clear: () => ({ output: [], shouldClear: true }),

  // ── Easter eggs ──────────────────────────────────────────────

  matrix: () => ({
    output: [
      '',
      // MALAKAI in binary (ASCII values)
      '  01001101 01000001 01001100 01000001 01001011 01000001 01001001',
      '  10110100 11010010 01001101 10101101 01000001 11001010 01001100',
      '  01000001 01001011 01000001 01001001 00100000 01000001 01001100',
      '',
      '  M  A  L  A  K  A  I',
      '',
    ],
  }),

  coffee: () => ({
    output: [
      '',
      '  Brewing...',
      '  [▓▓▓░░░░░░░░░░░░░░░░░]  12%  heating water',
      '  [▓▓▓▓▓▓▓▓░░░░░░░░░░░]  40%  grinding beans',
      '  [▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░]  68%  brewing',
      '  [▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░]  92%  almost ready',
      '',
      '  ERROR 0x0CAFFEINE: Out of beans. Send help.',
      '',
    ],
  }),

  'hire-malakai': () => ({
    output: [
      '',
      '  ╔══════════════════════════════════════════╗',
      '  ║          ✦  HIRE  MALAKAI  ✦             ║',
      '  ╠══════════════════════════════════════════╣',
      '  ║  CompTIA Security+ & Network+ certified  ║',
      '  ║  Real-world ransomware incident response ║',
      '  ║  AWS · Azure Sentinel · SIEM · Python    ║',
      '  ║  Available immediately                   ║',
      '  ║  Kissimmee, FL  /  Remote OK             ║',
      `  ║  ${contact.email.padEnd(42)}║`,
      '  ╚══════════════════════════════════════════╝',
      '',
    ],
  }),

  sudo: () => ({
    output: ['  Permission denied. Nice try though.', ''],
  }),
}

export function runCommand(raw: string): CommandResult {
  const trimmed = raw.trim()
  if (!trimmed) return { output: [''] }

  const [cmd, ...args] = trimmed.toLowerCase().split(/\s+/)
  const handler = commands[cmd]

  if (!handler) {
    return {
      output: [
        `'${cmd}' is not recognized as an internal or external command,`,
        'operable program or batch file.',
        '',
      ],
    }
  }

  return handler(args)
}
