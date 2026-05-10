'use client'

import Window from '../Window'
import { ChartIcon } from '../Icons'
import { skills } from '@/lib/portfolioData'
import { getWindowTitles } from '../windowTitles'

const TOTAL_CHUNKS = 10

export default function SkillsWindow() {
  return (
    <Window
      id="skills"
      title={getWindowTitles('skills').full}
      icon={<ChartIcon size={14} />}
      initialX={170}
      initialY={90}
      width={520}
      height={420}
    >
      <div className="bg-white p-4 h-full overflow-y-auto" style={{ fontFamily: 'Tahoma, sans-serif' }}>
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#dfe5ef]">
          <ChartIcon size={28} />
          <div>
            <div className="font-bold text-[13px] text-[#0a48b8]">Technical Skills</div>
            <div className="text-[11px] text-[#666]">
              Self-assessed proficiency · cybersecurity / IT focus
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {skills.map((s) => {
            const filled = Math.min(TOTAL_CHUNKS, Math.floor(s.level / 10))
            return (
              <div key={s.name} className="flex items-center gap-3 text-[11px]">
                <div className="w-[150px] truncate font-bold text-[#222]">{s.name}</div>
                <div className="flex-1 skill-bar-track" aria-label={`${s.name} ${s.level}%`}>
                  {Array.from({ length: TOTAL_CHUNKS }).map((_, i) => (
                    <div
                      key={i}
                      className={`skill-bar-chunk ${i < filled ? '' : 'empty'}`}
                    />
                  ))}
                </div>
                <div className="w-[36px] tabular-nums text-right text-[#444]">{s.level}%</div>
              </div>
            )
          })}
        </div>

        <div className="mt-4 pt-2 border-t border-[#dfe5ef] text-[11px] text-[#666]">
          OK · Apply · Cancel
        </div>
      </div>
    </Window>
  )
}
