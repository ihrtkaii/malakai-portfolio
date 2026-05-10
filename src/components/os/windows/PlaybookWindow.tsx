'use client'

import Window from '../Window'
import { PlaybookIcon } from '../Icons'
import { playbook } from '@/lib/portfolioData'
import { getWindowTitles } from '../windowTitles'

// XP-style document window for the PICERL incident-response playbook.
// Six sections with summary + bullets each. The Preparation section
// includes the deliberate hint for the admin easter egg.
export default function PlaybookWindow() {
  return (
    <Window
      id="playbook"
      title={getWindowTitles('playbook').full}
      icon={<PlaybookIcon size={14} />}
      initialX={140}
      initialY={70}
      width={620}
      height={500}
      scrollable
    >
      <div
        className="bg-white"
        style={{ fontFamily: 'Tahoma, sans-serif', color: '#222' }}
      >
        <div className="px-5 py-4 border-b border-[#cad7e9]" style={{ background: 'linear-gradient(to bottom, #f6faff, #e8f1fc)' }}>
          <div className="flex items-center gap-3">
            <PlaybookIcon size={28} />
            <div>
              <div className="font-bold text-[14px] text-[#0a48b8]">
                Incident Response Playbook
              </div>
              <div className="text-[11px] text-[#5e7a9c]">
                NIST-aligned · PICERL · authored by Malakai
              </div>
            </div>
          </div>
        </div>

        <div className="px-5 py-4 space-y-5">
          {playbook.map((section) => (
            <section key={section.title}>
              <h3
                className="font-bold text-[13px] uppercase tracking-wide mb-1"
                style={{ color: '#0a48b8' }}
              >
                {section.title}
              </h3>
              <p className="text-[11px] text-[#5e7a9c] italic mb-1.5">
                {section.summary}
              </p>
              <ul className="list-disc pl-5 space-y-1 text-[11px] text-[#222]">
                {section.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <div
          className="px-5 py-2 text-[11px] text-[#5e7a9c] border-t border-[#cad7e9] italic"
          style={{ background: '#f6faff' }}
        >
          v1.3 · last updated by analyst:malakai · classification: internal
        </div>
      </div>
    </Window>
  )
}
