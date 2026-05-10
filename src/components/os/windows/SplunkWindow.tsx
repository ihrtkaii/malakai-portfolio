'use client'

import Window from '../Window'
import { SplunkIcon } from '../Icons'
import { getWindowTitles } from '../windowTitles'

const QUERY = 'index=main sourcetype=WinEventLog:Security EventCode=4625 | stats count by src_ip'

interface Row {
  time: string
  src: string
  msg: string
  level: 'info' | 'warn' | 'crit'
}

const ROWS: Row[] = [
  { time: '12:04:18', src: 'WIN-FILESVR-01', msg: 'EventCode=4625 Account=Administrator src=185.234.218.93', level: 'crit' },
  { time: '12:04:17', src: 'WIN-FILESVR-01', msg: 'EventCode=4625 Account=admin src=185.234.218.93', level: 'crit' },
  { time: '12:04:11', src: 'WIN-FILESVR-01', msg: 'EventCode=4625 Account=user src=185.234.218.93', level: 'warn' },
  { time: '12:03:58', src: 'WIN-WEB-02', msg: 'EventCode=4624 Account=svc_backup logon=NewCredentials', level: 'info' },
  { time: '12:03:42', src: 'PFSENSE-01', msg: 'block on wan: src=185.234.218.93 dst=:3389 proto=tcp', level: 'warn' },
  { time: '12:03:30', src: 'WIN-FILESVR-01', msg: 'EventCode=4625 Account=Administrator src=92.118.39.241', level: 'crit' },
  { time: '12:02:51', src: 'EDR-AGENT', msg: 'malicious_powershell detected: encoded base64 payload blocked', level: 'crit' },
  { time: '12:02:30', src: 'WIN-DC-01', msg: 'EventCode=4768 Account=malakai status=success', level: 'info' },
]

const COLOR: Record<Row['level'], string> = {
  info: '#3aa030',
  warn: '#f59e0b',
  crit: '#d83a2a',
}

export default function SplunkWindow() {
  return (
    <Window
      id="splunk"
      title={getWindowTitles('splunk').full}
      icon={<SplunkIcon size={14} />}
      initialX={170}
      initialY={80}
      width={680}
      height={460}
      scrollable
    >
      <div className="bg-white" style={{ fontFamily: 'Tahoma, sans-serif', color: '#222' }}>
        {/* Splunk-orange header band */}
        <div
          className="px-3 py-2 flex items-center gap-2"
          style={{ background: 'linear-gradient(to bottom, #1a1a1a, #2a2a2a)', color: '#fff' }}
        >
          <SplunkIcon size={20} />
          <div className="font-bold text-[12px] tracking-wide">Splunk Enterprise</div>
          <div className="text-[10px] opacity-70 ml-auto">App: Search & Reporting</div>
        </div>

        {/* Search bar */}
        <div className="p-3 border-b border-[#dde5ef]">
          <div className="flex items-center gap-2">
            <div
              className="flex-1 px-2 py-1 font-mono text-[11px]"
              style={{
                background: '#fff',
                border: '1px solid #65a637',
                borderRadius: 2,
                color: '#222',
              }}
            >
              {QUERY}
            </div>
            <button
              type="button"
              className="px-3 py-1 text-[11px] text-white font-bold rounded-sm"
              style={{ background: '#65a637' }}
            >
              Search
            </button>
          </div>
          <div className="mt-1 text-[10px] text-[#666]">
            Last 15 minutes · 8 events · 4 unique src_ip
          </div>
        </div>

        {/* Results */}
        <div className="text-[11px] font-mono">
          {ROWS.map((r, i) => (
            <div
              key={i}
              className="px-3 py-1.5 flex gap-3 border-b border-[#f0f0f0]"
              style={{ background: i % 2 === 0 ? '#ffffff' : '#fafbfd' }}
            >
              <span className="text-[#666] w-[64px]">{r.time}</span>
              <span
                className="font-bold w-[60px]"
                style={{ color: COLOR[r.level] }}
              >
                {r.level.toUpperCase()}
              </span>
              <span className="text-[#0a48b8] w-[140px] truncate">{r.src}</span>
              <span className="flex-1 text-[#222] truncate">{r.msg}</span>
            </div>
          ))}
        </div>

        <div className="px-3 py-2 text-[10px] text-[#5e7a9c] border-t border-[#dde5ef] italic">
          Tip: pipe results into a workbook for trend visualization.
        </div>
      </div>
    </Window>
  )
}
