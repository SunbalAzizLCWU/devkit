'use client'
import { useState } from 'react'
import CopyButton from '../ui/CopyButton'

function toSlug(text: string, separator: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')   // Remove accents
    .replace(/[^a-z0-9\s-]/g, '')      // Remove special chars
    .trim()
    .replace(/[\s-]+/g, separator)     // Replace spaces/hyphens with separator
}

const SEPARATORS = [
  { label: 'Hyphen (-)', value: '-' },
  { label: 'Underscore (_)', value: '_' },
  { label: 'Dot (.)', value: '.' },
]

export default function TextToSlug() {
  const [input, setInput] = useState('')
  const [separator, setSeparator] = useState('-')

  const slug = input ? toSlug(input, separator) : ''

  const examples = [
    'Hello World!',
    'My Blog Post Title — 2024',
    'Héllo Wörld & More',
    "What's New in Next.js 15?",
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div>
        <label className="label">Text</label>
        <input className="input-base" value={input} onChange={e => setInput(e.target.value)}
          placeholder="My Amazing Blog Post Title!" />
      </div>

      <div>
        <label className="label">Separator</label>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {SEPARATORS.map(s => (
            <button key={s.value} onClick={() => setSeparator(s.value)} style={{
              padding: '0.35rem 0.85rem', borderRadius: '6px', border: '1px solid var(--border)',
              background: separator === s.value ? 'var(--accent)' : 'var(--bg-tertiary)',
              color: separator === s.value ? '#fff' : 'var(--text-secondary)',
              fontSize: '0.82rem', fontWeight: 500, cursor: 'pointer',
            }}>{s.label}</button>
          ))}
        </div>
      </div>

      {slug && (
        <div style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: '10px', overflow: 'hidden' }}>
          <div style={{ padding: '0.5rem 0.875rem', background: 'var(--accent-subtle)', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-text)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Slug</span>
            <CopyButton text={slug} overlay={false} />
          </div>
          <code style={{ display: 'block', padding: '0.875rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '1rem', color: 'var(--text-primary)', wordBreak: 'break-all' }}>
            {slug}
          </code>
        </div>
      )}

      <div>
        <label className="label">Try an Example</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {examples.map(ex => (
            <button key={ex} onClick={() => setInput(ex)} style={{
              padding: '0.3rem 0.75rem', borderRadius: '100px',
              border: '1px solid var(--border)', background: 'var(--bg-tertiary)',
              color: 'var(--text-secondary)', fontSize: '0.78rem', cursor: 'pointer',
            }}>{ex}</button>
          ))}
        </div>
      </div>
    </div>
  )
}
