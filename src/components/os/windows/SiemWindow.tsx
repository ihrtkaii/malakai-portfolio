'use client'

import Window from '../Window'
import { SiemIcon } from '../Icons'
import { getWindowTitles } from '../windowTitles'

interface Alert {
  time: string
  rule: string
  severity: 'high' | 'medium' | 'low'
  src: string
  status: 'open' | 'investigating' | 'closed'
}

const ALERTS: Alert[] = [
  { time: '12:04', rule: 'Brute force — 5+ failed logons / 60s', severity: 'high', src: '185.234.218.93', status: 'investigating' },
  { time: '12:03', rule: 'Encoded PowerShell execution', severity: 'high', src: 'WIN-WEB-02', status: 'open' },
  { time: '12:01', rule: 'Geo-impossible logon (FL → DE in 4m)', severity: 'high', src: 'malakai@corp', status: 'investigating' },
  { time: '11:58', rule: 'New service installed via psexec', severity: 'medium', src: 'WIN-FILESVR-01', status: 'closed' },
  { time: '11:42', rule: 'Outbound to known-bad ASN (AS9009)', severity: 'medium', src: '192.168.1.42', status: 'closed' },
  { time: '11:30', rule: 'NTLM authentication from Linux host', severity: 'low', src: 'kali-attacker', status: 'closed' },
]

const SEV_COLOR: Record<Alert['severity'], string> = {
  high: '#d83a2a',
  medium: '#f59e0b',
  low: '#5e7a9c',
}

const STATUS_COLOR: Record<Alert['status'], string> = {
  open: '#d83a2a',
  investigating: '#f59e0b',
  closed: '#3aa030',
}

interface MetricProps {
  label: string
  value: number
  color: string
}

function Metric({ label, value, color }: MetricProps) {
  return (
    <div className="flex-1 px-3 py-2 border border-[#cad7e9] rounded-sm bg-white">
      <div className="text-[10px] uppercase tracking-wide text-[#5e7a9c]">{label}</div>
      <div className="font-bold text-[24px] tabular-nums" style={{ color }}>
        {value}
      </div>
    </div>
  )
}

export default function SiemWindow() {
  const open = ALERTS.filter((a) => a.status === 'open').length
  const investigating = ALERTS.filter((a) => a.status === 'investigating').length
  const closed = ALERTS.filter((a) => a.status === 'closed').length

  return (
    <Window
      id="siem"
      title={getWindowTitles('siem').full}
      icon={<SiemIcon size={14} />}
      initialX={170}
      initialY={90}
      width={720}
      height={460}
      scrollable
    >
      <div className="bg-white" style={{ fontFamily: 'Tahoma, sans-serif', color: '#222' }}>
        <div
          className="px-4 py-3 border-b border-[#cad7e9]"
          style={{ background: 'linear-gradient(to bottom, #f6faff, #e8f1fc)' }}
        >
          <div className="flex items-center gap-3">
            <SiemIcon size={28} />
            <div>
              <div className="font-bold text-[14px] text-[#0a48b8]">SIEM Dashboard</div>
              <div className="text-[11px] text-[#5e7a9c]">
                Microsoft Sentinel · last refresh 12:04:22 EST
              </div>
            </div>
          </div>
        </div>

        <div className="p-3 grid grid-cols-3 gap-2">
          <Metric label="Open" value={open} color={STATUS_COLOR.open} />
          <Metric label="Investigating" value={investigating} color={STATUS_COLOR.investigating} />
          <Metric label="Closed (24h)" value={closed} color={STATUS_COLOR.closed} />
        </div>

        <div className="px-3 pb-3">
          <div className="text-[12px] font-bold text-[#0a48b8] mb-1">Recent Alerts</div>
          <div className="border border-[#cad7e9]">
            <div
              className="grid px-2 py-1 text-[10px] uppercase tracking-wide font-bold"
              style={{
                background: '#dfe5ee',
                gridTemplateColumns: '60px 1fr 80px 160px 110px',
              }}
            >
              <span>Time</span>
              <span>Rule</span>
              <span>Sev</span>
              <span>Source</span>
              <span>Status</span>
            </div>
            {ALERTS.map((a, i) => (
              <div
                key={i}
                className="grid px-2 py-1.5 text-[11px] border-t border-[#f0f0f0]"
                style={{ gridTemplateColumns: '60px 1fr 80px 160px 110px' }}
              >
                <span className="text-[#666]">{a.time}</span>
                <span>{a.rule}</span>
                <span className="font-bold" style={{ color: SEV_COLOR[a.severity] }}>
                  {a.severity}
                </span>
                <span className="text-[#0a48b8] truncate">{a.src}</span>
                <span style={{ color: STATUS_COLOR[a.status] }}>{a.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Window>
  )
}
