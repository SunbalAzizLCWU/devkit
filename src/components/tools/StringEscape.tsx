'use client'
import { useState } from 'react'
import CopyButton from '../ui/CopyButton'

type EscapeMode = 'json' | 'html' | 'url' | 'sql'

const MODES: { id: EscapeMode; label: string }[] = [
  { id: 'json', label: 'JSON' },
  { id: 'html', label: 'HTML' },
  { id: 'url',  label: 'URL' },
  { id: 'sql',  label: 'SQL' },
]

function escapeStr(input: string, mode: EscapeMode): string {
  switch (mode) {
    case 'json': return JSON.stringify(input).slice(1, -1)
    case 'html': return input.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;')
    case 'url':  return encodeURIComponent(input)
    case 'sql':  return input.replace(/'/g,"''").replace(/\\/g,'\\\\')
  }
}

function unescapeStr(input: string, mode: EscapeMode): string {
  try {
    switch (mode) {
      case 'json': return JSON.parse(`"${input}"`)
      case 'html': {
        const ta = document.createElement('textarea')
        ta.innerHTML = input
        return ta.value
      }
      case 'url': return decodeURIComponent(input)
      case 'sql': return input.replace(/''/g,"'").replace(/\\\\/g,'\\')
    }
  } catch { return 'Invalid input for unescape' }
}

export default function StringEscape() {
  const [input, setInput] = useState('')
  const [mode, setMode] = useState<EscapeMode>('json')
  const [action, setAction] = useState<'escape' | 'unescape'>('escape')

  const output = input ? (action === 'escape' ? escapeStr(input, mode) : unescapeStr(input, mode)) : ''

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          {MODES.map(m => (
            <button key={m.id} onClick={() => setMode(m.id)} style={{
              padding: '0.35rem 0.75rem', borderRadius: '6px', border: '1px solid var(--border)',
              background: mode === m.id ? 'var(--accent)' : 'var(--bg-tertiary)',
              color: mode === m.id ? '#fff' : 'var(--text-secondary)',
              fontSize: '0.82rem', fontWeight: 500, cursor: 'pointer',
            }}>{m.label}</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          {(['escape', 'unescape'] as const).map(a => (
            <button key={a} onClick={() => setAction(a)} style={{
              padding: '0.35rem 0.75rem', borderRadius: '6px', border: '1px solid var(--border)',
              background: action === a ? '#6366F1' : 'var(--bg-tertiary)',
              color: action === a ? '#fff' : 'var(--text-secondary)',
              fontSize: '0.82rem', fontWeight: 500, cursor: 'pointer', textTransform: 'capitalize',
            }}>{a}</button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label className="label">Input</label>
          <textarea className="input-base input-mono" rows={10} value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={action === 'escape' ? 'Enter raw string...' : 'Enter escaped string...'}
            style={{ resize: 'vertical' }} />
        </div>
        <div>
          <label className="label">Output</label>
          <div style={{ position: 'relative' }}>
            <textarea className="input-base input-mono" rows={10} value={output} readOnly
              placeholder="Result appears here..." style={{ resize: 'vertical' }} />
            {output && <CopyButton text={output} />}
          </div>
        </div>
      </div>
    </div>
  )
}
