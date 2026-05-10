'use client'

import Window from '../Window'
import { NotepadIcon } from '../Icons'
import { projects } from '@/lib/portfolioData'
import { getWindowTitles } from '../windowTitles'
import type { ProjectId, WindowId } from '@/types'

interface Props {
  projectId: ProjectId
}

interface SectionProps {
  title: string
  items: string[]
  numbered?: boolean
}

function Section({ title, items, numbered }: SectionProps) {
  return (
    <section className="mt-4">
      <h3 className="font-bold text-[12px] text-[#0a48b8] border-b border-[#cad7e9] pb-0.5 mb-1">
        {title}
      </h3>
      {numbered ? (
        <ol className="list-decimal pl-5 space-y-1 text-[11px] text-[#222]">
          {items.map((it, i) => (
            <li key={i}>{it}</li>
          ))}
        </ol>
      ) : (
        <ul className="list-disc pl-5 space-y-1 text-[11px] text-[#222]">
          {items.map((it, i) => (
            <li key={i}>{it}</li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default function ProjectCaseStudyWindow({ projectId }: Props) {
  const project = projects.find((p) => p.id === projectId)
  const windowId: WindowId = `project:${projectId}`

  if (!project) {
    return (
      <Window id={windowId} title="Project not found" initialX={200} initialY={120} width={420}>
        <div className="bg-white p-4 text-[11px]">
          No project found for id: {projectId}
        </div>
      </Window>
    )
  }

  const cs = project.caseStudy

  // Cascade case-study windows so multiple project docs don't pile up at the
  // exact same offset. We hash the project id to a small offset.
  const offsetIndex = projects.findIndex((p) => p.id === projectId)
  const initialX = 180 + offsetIndex * 28
  const initialY = 90 + offsetIndex * 24

  return (
    <Window
      id={windowId}
      title={getWindowTitles(windowId).full}
      icon={<NotepadIcon size={14} />}
      initialX={initialX}
      initialY={initialY}
      width={620}
      height={500}
      scrollable
    >
      <div
        className="bg-white p-4"
        style={{ fontFamily: 'Tahoma, sans-serif', color: '#222' }}
      >
        <div className="flex items-start justify-between gap-3 pb-2 border-b border-[#cad7e9]">
          <div>
            <div className="text-[14px] font-bold text-[#0a48b8]">{project.name}</div>
            <div className="text-[11px] text-[#5e7a9c]">{project.tags.join(' · ')}</div>
          </div>
          <span
            className="text-white text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wide whitespace-nowrap"
            style={{
              background:
                project.status === 'live'
                  ? '#3aa030'
                  : project.status === 'beta'
                    ? '#d68a07'
                    : '#0a48b8',
            }}
          >
            {project.status}
          </span>
        </div>

        <section className="mt-3">
          <h3 className="font-bold text-[12px] text-[#0a48b8] mb-1">Objective</h3>
          <p className="text-[11px] leading-snug">{cs.objective}</p>
        </section>

        <Section title="Tools &amp; Stack" items={cs.tools} />
        <Section title="Methodology" items={cs.methodology} numbered />
        <Section title="Findings" items={cs.findings} />
        <Section title="Lessons" items={cs.lessons} />

        {cs.screenshots && cs.screenshots.length > 0 && (
          <section className="mt-4">
            <h3 className="font-bold text-[12px] text-[#0a48b8] border-b border-[#cad7e9] pb-0.5 mb-1">
              Screenshots
            </h3>
            <div className="text-[11px] text-[#5e7a9c] italic">
              {cs.screenshots.map((s) => s.split('/').pop()).join(' · ')} (placeholders)
            </div>
          </section>
        )}
      </div>
    </Window>
  )
}
