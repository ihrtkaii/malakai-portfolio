'use client'

import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import Window from '../Window'
import { CmdIcon } from '../Icons'
import { runCommand } from '@/lib/terminalCommands'
import { useStore } from '@/lib/store'
import { getWindowTitles } from '../windowTitles'

interface Line {
  kind: 'cmd' | 'out'
  text: string
}

const PROMPT = 'C:\\Users\\malakai>'

const HEADER: Line[] = [
  { kind: 'out', text: 'Microsoft Windows [Version 5.1.2600]' },
  { kind: 'out', text: '(C) Copyright 1985-2026 Malakai Corp.' },
  { kind: 'out', text: '' },
  { kind: 'out', text: 'Type "help" to see available commands.' },
  { kind: 'out', text: '' },
]

// Pulled from terminalCommands.ts — keep aligned for tab-complete.
const KNOWN_COMMANDS = [
  'help',
  'whoami',
  'skills',
  'projects',
  'certs',
  'experience',
  'contact',
  'ipconfig',
  'cls',
  'clear',
  'exit',
  'matrix',
  'coffee',
  'hire-malakai',
  'sudo',
]

export default function CmdWindow() {
  const closeWindow = useStore((s) => s.closeWindow)

  const [lines, setLines] = useState<Line[]>(HEADER)
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  // -1 means "live input"; 0..n-1 are prior entries indexed from newest.
  const [historyIdx, setHistoryIdx] = useState<number>(-1)

  const inputRef = useRef<HTMLInputElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)

  // Auto-scroll on every render where lines change.
  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight })
  }, [lines, input])

  // Auto-focus on mount and any time the body is clicked.
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const focusInput = useCallback(() => {
    inputRef.current?.focus()
  }, [])

  const submit = useCallback(() => {
    const raw = input
    const cmdLine: Line = { kind: 'cmd', text: `${PROMPT} ${raw}` }

    const result = runCommand(raw)

    if (result.shouldClose) {
      closeWindow('cmd')
      return
    }

    if (result.shouldClear) {
      setLines([])
    } else {
      setLines((prev) => [
        ...prev,
        cmdLine,
        ...result.output.map<Line>((t) => ({ kind: 'out', text: t })),
      ])
    }

    if (raw.trim()) {
      setHistory((prev) => [raw, ...prev].slice(0, 50))
    }
    setHistoryIdx(-1)
    setInput('')
  }, [input, closeWindow])

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      submit()
      return
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (history.length === 0) return
      const next = Math.min(history.length - 1, historyIdx + 1)
      setHistoryIdx(next)
      setInput(history[next])
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = historyIdx - 1
      if (next < 0) {
        setHistoryIdx(-1)
        setInput('')
      } else {
        setHistoryIdx(next)
        setInput(history[next])
      }
      return
    }
    if (e.key === 'Tab') {
      e.preventDefault()
      const partial = input.trim().toLowerCase()
      if (!partial) return
      const matches = KNOWN_COMMANDS.filter((c) => c.startsWith(partial))
      if (matches.length === 1) {
        setInput(matches[0])
      } else if (matches.length > 1) {
        setLines((prev) => [
          ...prev,
          { kind: 'cmd', text: `${PROMPT} ${input}` },
          { kind: 'out', text: matches.join('   ') },
          { kind: 'out', text: '' },
        ])
      }
    }
  }

  const renderedLines = useMemo(
    () =>
      lines.map((l, i) => (
        <div
          key={i}
          className={l.kind === 'cmd' ? 'text-[#e8e8e8]' : 'text-[#cfcfcf]'}
          style={{ whiteSpace: 'pre' }}
        >
          {l.text || ' '}
        </div>
      )),
    [lines],
  )

  return (
    <Window
      id="cmd"
      title={getWindowTitles('cmd').full}
      icon={<CmdIcon size={14} />}
      initialX={300}
      initialY={140}
      width={640}
      height={400}
    >
      <div
        ref={bodyRef}
        onClick={focusInput}
        className="bg-black text-[#cfcfcf] p-2 h-full overflow-y-auto cursor-text"
        style={{
          fontFamily: 'Consolas, "Lucida Console", monospace',
          fontSize: '13px',
          lineHeight: 1.3,
        }}
      >
        {renderedLines}
        <div className="flex items-center" style={{ whiteSpace: 'pre' }}>
          <span>{PROMPT} </span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            spellCheck={false}
            autoComplete="off"
            aria-label="Terminal input"
            className="flex-1 bg-transparent outline-none border-none text-[#e8e8e8] caret-transparent"
            style={{
              fontFamily: 'inherit',
              fontSize: 'inherit',
            }}
          />
          <span className="cmd-caret text-[#e8e8e8]">_</span>
        </div>
      </div>
    </Window>
  )
}
