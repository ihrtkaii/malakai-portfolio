'use client'

import Window from '../Window'
import { BriefcaseIcon } from '../Icons'
import { experience } from '@/lib/portfolioData'
import { getWindowTitles } from '../windowTitles'

export default function ExperienceWindow() {
  return (
    <Window
      id="experience"
      title={getWindowTitles('experience').full}
      icon={<BriefcaseIcon size={14} />}
      initialX={260}
      initialY={130}
      width={540}
      height={420}
    >
      <div className="bg-white p-4 h-full overflow-y-auto" style={{ fontFamily: 'Tahoma, sans-serif' }}>
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#dfe5ef]">
          <BriefcaseIcon size={28} />
          <div>
            <div className="font-bold text-[13px] text-[#0a48b8]">Work Experience</div>
            <div className="text-[11px] text-[#666]">Production IT &amp; security</div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {experience.map((e) => (
            <div
              key={e.company}
              className="border border-[#cad7e9] rounded-sm p-3"
              style={{ background: 'linear-gradient(to bottom, #f6faff, #e8f1fc)' }}
            >
              <div className="flex justify-between items-baseline">
                <div>
                  <div className="font-bold text-[12px] text-[#0a48b8]">{e.role}</div>
                  <div className="text-[11px] text-[#222]">{e.company}</div>
                </div>
                <div className="text-[11px] text-[#5e7a9c] italic">{e.period}</div>
              </div>
              <ul className="mt-2 list-disc pl-5 space-y-0.5 text-[11px] text-[#222]">
                {e.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </Window>
  )
}
