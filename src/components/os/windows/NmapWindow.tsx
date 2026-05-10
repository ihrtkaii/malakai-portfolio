'use client'

import Window from '../Window'
import { NmapIcon } from '../Icons'
import { getWindowTitles } from '../windowTitles'

const OUTPUT = `Starting Nmap 7.94 ( https://nmap.org )
Nmap scan report for homelab.local (192.168.1.0/24)

Host is up (0.00043s latency).
Not shown: 994 closed tcp ports (reset)

PORT      STATE    SERVICE     VERSION
22/tcp    open     ssh         OpenSSH 9.2p1 Debian 2 (protocol 2.0)
53/tcp    open     domain      ISC BIND 9.18.19
80/tcp    open     http        nginx 1.24.0
443/tcp   open     ssl/https   nginx 1.24.0
3389/tcp  filtered ms-wbt-server
8080/tcp  open     http-proxy  Apache Tomcat 10.1.16

Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Host script results:
| smb-os-discovery:
|   OS: Windows Server 2019 (Build 17763)
|   Computer name: WIN-FILESVR-01
|   Workgroup: HOMELAB
|_  System time: 2026-05-09T12:04:31-05:00

Nmap done: 256 IP addresses (3 hosts up) scanned in 14.82 seconds
`

const SCAN_LINES = OUTPUT.split('\n')

export default function NmapWindow() {
  return (
    <Window
      id="nmap"
      title={getWindowTitles('nmap').full}
      icon={<NmapIcon size={14} />}
      initialX={250}
      initialY={120}
      width={620}
      height={440}
      scrollable
    >
      <div
        className="p-3 h-full"
        style={{
          background: '#0a0a0a',
          color: '#cfcfcf',
          fontFamily: 'Consolas, "JetBrains Mono", monospace',
          fontSize: '12px',
          lineHeight: 1.45,
        }}
      >
        <div style={{ color: '#00ff88', marginBottom: 8 }}>
          $ sudo nmap -sV -sC -p- 192.168.1.0/24
        </div>
        {SCAN_LINES.map((line, i) => (
          <div
            key={i}
            style={{
              whiteSpace: 'pre',
              color: line.includes('open')
                ? '#00ff88'
                : line.includes('filtered')
                  ? '#f59e0b'
                  : '#cfcfcf',
            }}
          >
            {line || ' '}
          </div>
        ))}
        <div style={{ color: '#00ff88', marginTop: 4 }}>
          $ <span className="cmd-caret">_</span>
        </div>
      </div>
    </Window>
  )
}
