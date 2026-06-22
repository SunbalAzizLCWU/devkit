'use client'
import { useState } from 'react'
import CopyButton from '../ui/CopyButton'

const converters: Record<string, (s: string) => string> = {
  'camelCase': s => s.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase()),
  'PascalCase': s => s.replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase()).replace(/^./, c => c.toUpperCase()),
  'snake_case': s => s.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '').toLowerCase(),
  'kebab-case': s => s.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '').toLowerCase(),
  'UPPER_CASE': s => s.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '').toUpperCase(),
  'lowercase': s => s.toLowerCase(),
  'UPPERCASE': s => s.toUpperCase(),
  'Title Case': s => s.replace(/\w\S*/g, t => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase()),
  'Sentence case': s => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase(),
}

export default function CaseConverter() {
  const [input, setInput] = useState('')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <label className="label">Input Text</label>
        <textarea
          className="input-base"
          rows={4}
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type or paste text here..."
          style={{ resize: 'none' }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {Object.entries(converters).map(([name, fn]) => {
          const result = input ? fn(input) : ''
          return (
            <div key={name} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              padding: '0.65rem 0.875rem',
              gap: '1rem',
            }}>
              <span style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                color: 'var(--accent-text)',
                minWidth: '90px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}>{name}</span>
              <code style={{
                flex: 1,
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.85rem',
                color: 'var(--text-primary)',
                wordBreak: 'break-all',
              }}>
                {result || <span style={{ color: 'var(--text-muted)' }}>—</span>}
              </code>
              {result && <CopyButton text={result} />}
            </div>
          )
        })}
      </div>
    </div>
  )
}
