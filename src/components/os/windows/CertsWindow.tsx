'use client'

import Window from '../Window'
import { CertIcon } from '../Icons'
import { certs } from '@/lib/portfolioData'
import { getWindowTitles } from '../windowTitles'
import type { Cert } from '@/types'

const STATUS_STYLES: Record<Cert['status'], { label: string; border: string; bg: string; pill: string }> = {
  active: {
    label: 'Active',
    border: '#3aa030',
    bg: 'rgba(58, 160, 48, 0.08)',
    pill: '#3aa030',
  },
  'in-progress': {
    label: 'In progress',
    border: '#f59e0b',
    bg: 'rgba(245, 158, 11, 0.10)',
    pill: '#d68a07',
  },
  planned: {
    label: 'Planned',
    border: '#8aa0bf',
    bg: 'rgba(138, 160, 191, 0.12)',
    pill: '#5e7a9c',
  },
}

export default function CertsWindow() {
  return (
    <Window
      id="certs"
      title={getWindowTitles('certs').full}
      icon={<CertIcon size={14} />}
      initialX={220}
      initialY={110}
      width={500}
      height={420}
    >
      <div className="bg-white p-3 h-full overflow-y-auto" style={{ fontFamily: 'Tahoma, sans-serif' }}>
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#dfe5ef]">
          <CertIcon size={28} />
          <div>
            <div className="font-bold text-[13px] text-[#0a48b8]">Certifications</div>
            <div className="text-[11px] text-[#666]">
              {certs.filter((c) => c.status === 'active').length} active ·{' '}
              {certs.filter((c) => c.status === 'in-progress').length} in progress
            </div>
          </div>
        </div>

        <ul className="flex flex-col gap-2">
          {certs.map((c) => {
            const s = STATUS_STYLES[c.status]
            return (
              <li
                key={c.name}
                className="text-[11px] px-3 py-2 rounded-sm"
                style={{
                  border: `1px solid ${s.border}`,
                  borderLeft: `4px solid ${s.border}`,
                  background: s.bg,
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-bold text-[12px] text-[#111]">{c.name}</div>
                    {c.code && <div className="text-[#5e7a9c]">Exam: {c.code}</div>}
                    {c.note && <div className="text-[#444] mt-0.5 italic">{c.note}</div>}
                  </div>
                  <span
                    className="text-white text-[10px] font-bold px-2 py-0.5 rounded-sm whitespace-nowrap"
                    style={{ background: s.pill }}
                  >
                    {s.label}
                  </span>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </Window>
  )
}
