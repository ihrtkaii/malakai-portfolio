'use client'

import Window from '../Window'
import { KaliIcon } from '../Icons'
import { getWindowTitles } from '../windowTitles'

interface Line {
  prompt?: boolean
  text: string
  color?: string
}

const PROMPT_PREFIX = '┌──(malakai㉿kali)-[~]\n└─$ '

const LINES: Line[] = [
  { prompt: true, text: 'whoami' },
  { text: 'malakai' },
  { prompt: true, text: 'uname -a' },
  { text: 'Linux kali 6.6.15-amd64 #1 SMP PREEMPT_DYNAMIC Kali 1 (2024-02-19) x86_64 GNU/Linux' },
  { prompt: true, text: 'cat /etc/os-release | head -3' },
  { text: 'PRETTY_NAME="Kali GNU/Linux Rolling"' },
  { text: 'NAME="Kali GNU/Linux"' },
  { text: 'VERSION="2024.1"' },
  { prompt: true, text: 'sudo netdiscover -i eth0' },
  { text: 'Currently scanning: 10.10.14.0/24', color: '#367bf0' },
  { text: '_____________________________________________________________________________', color: '#666' },
  { text: '   IP            At MAC Address     Count     Vendor', color: '#888' },
  { text: '   10.10.14.1    aa:bb:cc:00:00:01      4      VMware, Inc.' },
  { text: '   10.10.14.21   aa:bb:cc:00:00:14      8      VMware, Inc.' },
  { text: '   10.10.14.42   aa:bb:cc:00:00:2a      2      Microsoft' },
  { prompt: true, text: 'cd ~/htb && ls -la' },
  { text: 'drwxr-xr-x  6 malakai  malakai  192 May 09 02:14 .' },
  { text: 'drwx------ 18 malakai  malakai  576 May 09 02:14 ..' },
  { text: 'drwxr-xr-x  3 malakai  malakai   96 May 08 23:01 academy' },
  { text: 'drwxr-xr-x  3 malakai  malakai   96 May 09 02:13 active' },
  { text: 'drwxr-xr-x  3 malakai  malakai   96 May 09 01:42 retired' },
  { prompt: true, text: '' },
]

export default function KaliWindow() {
  return (
    <Window
      id="kali"
      title={getWindowTitles('kali').full}
      icon={<KaliIcon size={14} />}
      initialX={330}
      initialY={160}
      width={640}
      height={440}
      scrollable
    >
      <div
        className="p-3 h-full"
        style={{
          background: '#1a1a1a',
          color: '#e8e8e8',
          fontFamily: 'Consolas, "JetBrains Mono", monospace',
          fontSize: '12px',
          lineHeight: 1.45,
        }}
      >
        {LINES.map((line, i) => {
          if (line.prompt) {
            return (
              <div key={i} style={{ whiteSpace: 'pre', color: '#367bf0' }}>
                {PROMPT_PREFIX}
                <span style={{ color: '#e8e8e8' }}>{line.text}</span>
                {!line.text && <span className="cmd-caret">_</span>}
              </div>
            )
          }
          return (
            <div key={i} style={{ whiteSpace: 'pre', color: line.color ?? '#e8e8e8' }}>
              {line.text}
            </div>
          )
        })}
      </div>
    </Window>
  )
}
