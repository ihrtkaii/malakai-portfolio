'use client'

import Window from '../Window'
import { WiresharkIcon } from '../Icons'
import { getWindowTitles } from '../windowTitles'

interface Packet {
  no: number
  time: string
  src: string
  dst: string
  proto: string
  len: number
  info: string
  flag?: 'tcp' | 'http' | 'tls' | 'arp' | 'icmp'
}

const PACKETS: Packet[] = [
  { no: 1, time: '0.000000', src: '192.168.1.42', dst: '8.8.8.8', proto: 'DNS', len: 74, info: 'Standard query 0x6e3a A homelab.local', flag: 'tcp' },
  { no: 2, time: '0.012450', src: '8.8.8.8', dst: '192.168.1.42', proto: 'DNS', len: 90, info: 'Standard query response A 10.0.0.5', flag: 'tcp' },
  { no: 3, time: '0.024100', src: '192.168.1.42', dst: '10.0.0.5', proto: 'TCP', len: 66, info: '54312 → 443 [SYN] Seq=0 Win=64240 Len=0', flag: 'tcp' },
  { no: 4, time: '0.024890', src: '10.0.0.5', dst: '192.168.1.42', proto: 'TCP', len: 66, info: '443 → 54312 [SYN, ACK] Seq=0 Ack=1', flag: 'tcp' },
  { no: 5, time: '0.025010', src: '192.168.1.42', dst: '10.0.0.5', proto: 'TLSv1.3', len: 583, info: 'Client Hello (SNI=homelab.local)', flag: 'tls' },
  { no: 6, time: '0.041220', src: '10.0.0.5', dst: '192.168.1.42', proto: 'TLSv1.3', len: 1462, info: 'Server Hello, Certificate, Server Key Exchange', flag: 'tls' },
  { no: 7, time: '0.052800', src: '185.234.218.93', dst: '192.168.1.42', proto: 'TCP', len: 60, info: '47281 → 3389 [SYN] Seq=0 Win=1024 Len=0', flag: 'tcp' },
  { no: 8, time: '0.052810', src: '192.168.1.42', dst: '185.234.218.93', proto: 'TCP', len: 60, info: '3389 → 47281 [RST, ACK] Seq=1 Ack=1', flag: 'tcp' },
  { no: 9, time: '0.071100', src: '192.168.1.1', dst: '192.168.1.42', proto: 'ARP', len: 42, info: 'Who has 192.168.1.42? Tell 192.168.1.1', flag: 'arp' },
  { no: 10, time: '0.071150', src: '192.168.1.42', dst: '192.168.1.1', proto: 'ARP', len: 42, info: '192.168.1.42 is at aa:bb:cc:dd:ee:ff', flag: 'arp' },
  { no: 11, time: '0.103420', src: '192.168.1.42', dst: '10.0.0.5', proto: 'HTTP', len: 412, info: 'GET /api/alerts HTTP/1.1', flag: 'http' },
  { no: 12, time: '0.115600', src: '10.0.0.5', dst: '192.168.1.42', proto: 'HTTP', len: 980, info: 'HTTP/1.1 200 OK (application/json)', flag: 'http' },
]

const ROW_COLOR: Record<string, string> = {
  tcp: '#e8f1fc',
  http: '#e8fce8',
  tls: '#f8e8fc',
  arp: '#fcf2e8',
  icmp: '#fce8e8',
}

export default function WiresharkWindow() {
  return (
    <Window
      id="wireshark"
      title={getWindowTitles('wireshark').full}
      icon={<WiresharkIcon size={14} />}
      initialX={210}
      initialY={100}
      width={760}
      height={460}
      scrollable
    >
      <div className="bg-white text-[11px]" style={{ fontFamily: 'Tahoma, sans-serif', color: '#222' }}>
        <div className="px-3 py-1 border-b border-[#a0a0a0] bg-[#ece9d8] flex items-center gap-3">
          {['File', 'Edit', 'View', 'Capture', 'Analyze', 'Statistics'].map((m) => (
            <span key={m} className="cursor-default"><u>{m[0]}</u>{m.slice(1)}</span>
          ))}
        </div>

        <div className="px-3 py-1.5 border-b border-[#a0a0a0] bg-[#dfe5ee] flex items-center gap-2">
          <span className="text-[10px] text-[#444]">Filter:</span>
          <div className="flex-1 px-2 py-0.5 font-mono text-[11px] bg-white border border-[#7c9bc1]">
            tcp.port == 3389 or http or arp
          </div>
          <button type="button" className="px-2 py-0.5 text-[10px]" style={{ background: '#3aa030', color: '#fff' }}>
            Apply
          </button>
        </div>

        {/* Header */}
        <div
          className="grid px-2 py-1 font-bold border-b border-[#a0a0a0]"
          style={{ gridTemplateColumns: '38px 80px 130px 130px 60px 50px 1fr', background: '#f4f4f4' }}
        >
          <span>No.</span>
          <span>Time</span>
          <span>Source</span>
          <span>Destination</span>
          <span>Proto</span>
          <span>Len</span>
          <span>Info</span>
        </div>

        {/* Rows */}
        {PACKETS.map((p) => (
          <div
            key={p.no}
            className="grid px-2 py-0.5 font-mono text-[11px] border-b border-[#f4f4f4]"
            style={{
              gridTemplateColumns: '38px 80px 130px 130px 60px 50px 1fr',
              background: ROW_COLOR[p.flag ?? 'tcp'],
            }}
          >
            <span className="text-[#666]">{p.no}</span>
            <span>{p.time}</span>
            <span className="text-[#0a48b8] truncate">{p.src}</span>
            <span className="text-[#0a48b8] truncate">{p.dst}</span>
            <span className="font-bold">{p.proto}</span>
            <span className="text-[#666]">{p.len}</span>
            <span className="truncate">{p.info}</span>
          </div>
        ))}

        <div className="px-3 py-1 border-t border-[#a0a0a0] bg-[#ece9d8] text-[10px] text-[#444]">
          Packets: {PACKETS.length} · Displayed: {PACKETS.length} · Profile: Default
        </div>
      </div>
    </Window>
  )
}
