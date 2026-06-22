'use client'
import { useState } from 'react'

export default function WordCounter() {
  const [text, setText] = useState('')

  const words = text.trim() ? text.trim().split(/\s+/).length : 0
  const chars = text.length
  const charsNoSpaces = text.replace(/\s/g, '').length
  const sentences = text.trim() ? text.split(/[.!?]+/).filter(s => s.trim()).length : 0
  const paragraphs = text.trim() ? text.split(/\n\s*\n/).filter(p => p.trim()).length : 0
  const readingTime = Math.max(1, Math.ceil(words / 200))

  const stats = [
    { label: 'Words', value: words },
    { label: 'Characters', value: chars },
    { label: 'Chars (no spaces)', value: charsNoSpaces },
    { label: 'Sentences', value: sentences },
    { label: 'Paragraphs', value: paragraphs },
    { label: 'Reading time', value: `~${readingTime} min` },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <textarea
        className="input-base"
        rows={12}
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Paste or type your text here..."
        style={{ resize: 'vertical' }}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
        {stats.map(({ label, value }) => (
          <div key={label} style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            borderRadius: '10px',
            padding: '0.875rem 1rem',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent)', fontVariantNumeric: 'tabular-nums' }}>
              {value}
            </div>
            <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.2rem' }}>
              {label}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
