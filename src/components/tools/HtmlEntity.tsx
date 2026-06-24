'use client'
import { useState } from 'react'
import CopyButton from '../ui/CopyButton'

function encodeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/\//g, '&#x2F;')
    .replace(/`/g, '&#x60;')
    .replace(/=/g, '&#x3D;')
}

function decodeHtml(str: string): string {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x2F;/g, '/')
    .replace(/&#x60;/g, '`')
    .replace(/&#x3D;/g, '=')
    .replace(/&nbsp;/g, ' ')
    .replace(/&copy;/g, '©')
    .replace(/&reg;/g, '®')
    .replace(/&trade;/g, '™')
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/&hellip;/g, '…')
}

const REFERENCE = [
  { char: '&', entity: '&amp;', hex: '&#x26;' },
  { char: '<', entity: '&lt;', hex: '&#x3C;' },
  { char: '>', entity: '&gt;', hex: '&#x3E;' },
  { char: '"', entity: '&quot;', hex: '&#x22;' },
  { char: "'", entity: '&#39;', hex: '&#x27;' },
  { char: '©', entity: '&copy;', hex: '&#xA9;' },
  { char: '®', entity: '&reg;', hex: '&#xAE;' },
  { char: '™', entity: '&trade;', hex: '&#x2122;' },
  { char: '—', entity: '&mdash;', hex: '&#x2014;' },
  { char: '–', entity: '&ndash;', hex: '&#x2013;' },
  { char: '…', entity: '&hellip;', hex: '&#x2026;' },
  { char: ' ', entity: '&nbsp;', hex: '&#xA0;' },
]

export default function HtmlEntity() {
  const [input, setInput] = useState('')
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')

  const output = input ? (mode === 'encode' ? encodeHtml(input) : decodeHtml(input)) : ''

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        {(['encode', 'decode'] as const).map(m => (
          <button key={m} onClick={() => setMode(m)} style={{
            padding: '0.4rem 1rem', borderRadius: '6px', border: '1px solid var(--border)',
            background: mode === m ? 'var(--accent)' : 'var(--bg-tertiary)',
            color: mode === m ? '#fff' : 'var(--text-secondary)',
            fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer', textTransform: 'capitalize',
          }}>{m}</button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label className="label">{mode === 'encode' ? 'Plain Text' : 'HTML Entities'}</label>
          <textarea className="input-base input-mono" rows={8} value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={mode === 'encode' ? '<div class="hello">World & More</div>' : '&lt;div&gt;Hello &amp; World&lt;/div&gt;'}
            style={{ resize: 'vertical' }} />
        </div>
        <div>
          <label className="label">{mode === 'encode' ? 'HTML Entities' : 'Decoded Text'}</label>
          <div style={{ position: 'relative' }}>
            <textarea className="input-base input-mono" rows={8} value={output} readOnly
              placeholder="Result appears here..." style={{ resize: 'vertical' }} />
            {output && <CopyButton text={output} />}
          </div>
        </div>
      </div>

      {/* Reference table */}
      <div>
        <label className="label">Common Entities Reference</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.4rem' }}>
          {REFERENCE.map(({ char, entity, hex }) => (
            <div key={entity} style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              background: 'var(--bg-tertiary)', border: '1px solid var(--border)',
              borderRadius: '7px', padding: '0.45rem 0.75rem',
            }}>
              <span style={{ fontWeight: 700, color: 'var(--accent)', minWidth: '20px', fontFamily: 'JetBrains Mono, monospace' }}>{char}</span>
              <code style={{ flex: 1, fontSize: '0.78rem', fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-primary)' }}>{entity}</code>
              <code style={{ fontSize: '0.72rem', fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-muted)' }}>{hex}</code>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
