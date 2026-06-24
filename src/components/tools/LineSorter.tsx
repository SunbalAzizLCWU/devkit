'use client'
import { useState } from 'react'
import CopyButton from '../ui/CopyButton'

type SortMode = 'az' | 'za' | 'length-asc' | 'length-desc' | 'reverse' | 'shuffle' | 'natural'

const MODES: { id: SortMode; label: string }[] = [
  { id: 'az',          label: 'A → Z' },
  { id: 'za',          label: 'Z → A' },
  { id: 'length-asc',  label: 'Shortest first' },
  { id: 'length-desc', label: 'Longest first' },
  { id: 'natural',     label: 'Natural (1,2,10)' },
  { id: 'reverse',     label: 'Reverse order' },
  { id: 'shuffle',     label: 'Shuffle' },
]

function sortLines(lines: string[], mode: SortMode): string[] {
  const arr = [...lines]
  switch (mode) {
    case 'az':          return arr.sort((a, b) => a.localeCompare(b))
    case 'za':          return arr.sort((a, b) => b.localeCompare(a))
    case 'length-asc':  return arr.sort((a, b) => a.length - b.length)
    case 'length-desc': return arr.sort((a, b) => b.length - a.length)
    case 'natural':     return arr.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    case 'reverse':     return arr.reverse()
    case 'shuffle':     return arr.sort(() => Math.random() - 0.5)
  }
}

export default function LineSorter() {
  const [input, setInput] = useState('')
  const [mode, setMode] = useState<SortMode>('az')
  const [removeDups, setRemoveDups] = useState(false)
  const [ignoreCase, setIgnoreCase] = useState(false)
  const [trimLines, setTrimLines] = useState(true)

  const process = (): string => {
    if (!input.trim()) return ''
    let lines = input.split('\n')
    if (trimLines) lines = lines.map(l => l.trim())
    lines = lines.filter(l => l.length > 0)
    if (removeDups) {
      const seen = new Set<string>()
      lines = lines.filter(l => {
        const key = ignoreCase ? l.toLowerCase() : l
        if (seen.has(key)) return false
        seen.add(key); return true
      })
    }
    return sortLines(lines, mode).join('\n')
  }

  const output = process()
  const inputCount = input ? input.split('\n').filter(l => l.trim()).length : 0
  const outputCount = output ? output.split('\n').filter(Boolean).length : 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <label className="label">Sort Mode</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {MODES.map(m => (
              <button key={m.id} onClick={() => setMode(m.id)} style={{
                padding: '0.35rem 0.75rem', borderRadius: '6px', border: '1px solid var(--border)',
                background: mode === m.id ? 'var(--accent)' : 'var(--bg-tertiary)',
                color: mode === m.id ? '#fff' : 'var(--text-secondary)',
                fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer',
              }}>{m.label}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {[
          { label: 'Remove duplicates', val: removeDups, set: setRemoveDups },
          { label: 'Case-insensitive dedup', val: ignoreCase, set: setIgnoreCase },
          { label: 'Trim whitespace', val: trimLines, set: setTrimLines },
        ].map(({ label, val, set }) => (
          <label key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            <input type="checkbox" checked={val} onChange={e => set(e.target.checked)}
              style={{ accentColor: 'var(--accent)', width: '14px', height: '14px' }} />
            {label}
          </label>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label className="label">Input <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({inputCount} lines)</span></label>
          <textarea className="input-base input-mono" rows={16} value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Paste lines here, one per line..." style={{ resize: 'vertical' }} />
        </div>
        <div>
          <label className="label">Output <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({outputCount} lines)</span></label>
          <div style={{ position: 'relative' }}>
            <textarea className="input-base input-mono" rows={16} value={output} readOnly
              placeholder="Sorted output..." style={{ resize: 'vertical' }} />
            {output && <CopyButton text={output} />}
          </div>
        </div>
      </div>
    </div>
  )
}
