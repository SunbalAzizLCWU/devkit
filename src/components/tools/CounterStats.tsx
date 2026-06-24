'use client'
import { useState } from 'react'

// Character frequency + text statistics — a deeper complement to WordCounter
export default function CounterStats() {
  const [text, setText] = useState('')

  const words = text.trim() ? text.trim().split(/\s+/).length : 0
  const chars = text.length
  const charsNoSpaces = text.replace(/\s/g, '').length
  const lines = text ? text.split('\n').length : 0
  const sentences = text.trim() ? (text.match(/[.!?]+/g) || []).length : 0
  const paragraphs = text.trim() ? text.split(/\n\s*\n/).filter(p => p.trim()).length : 0
  const readingTime = Math.max(1, Math.ceil(words / 200))
  const uniqueWords = text.trim() ? new Set(text.toLowerCase().match(/\b\w+\b/g) || []).size : 0
  const avgWordLen = words > 0 ? (text.match(/\b\w+\b/g) || []).reduce((s, w) => s + w.length, 0) / words : 0

  // Character frequency
  const freq: Record<string, number> = {}
  for (const c of text.toLowerCase()) {
    if (/[a-z]/.test(c)) freq[c] = (freq[c] || 0) + 1
  }
  const freqEntries = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 10)
  const maxFreq = freqEntries[0]?.[1] || 1

  const stats = [
    { label: 'Words', value: words },
    { label: 'Unique words', value: uniqueWords },
    { label: 'Characters', value: chars },
    { label: 'No spaces', value: charsNoSpaces },
    { label: 'Lines', value: lines },
    { label: 'Sentences', value: sentences },
    { label: 'Paragraphs', value: paragraphs },
    { label: 'Read time', value: `~${readingTime}m` },
    { label: 'Avg word len', value: avgWordLen.toFixed(1) },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <textarea className="input-base" rows={10} value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Paste or type your text here..." style={{ resize: 'vertical' }} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem' }}>
        {stats.map(({ label, value }) => (
          <div key={label} style={{
            background: 'var(--bg-secondary)', border: '1px solid var(--border)',
            borderRadius: '10px', padding: '0.875rem 1rem', textAlign: 'center',
          }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--accent)', fontVariantNumeric: 'tabular-nums' }}>{value}</div>
            <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.2rem' }}>{label}</div>
          </div>
        ))}
      </div>

      {freqEntries.length > 0 && (
        <div>
          <label className="label">Top Letter Frequency</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            {freqEntries.map(([char, count]) => (
              <div key={char} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: 'var(--accent)', width: '18px', textAlign: 'center', textTransform: 'uppercase' }}>{char}</span>
                <div style={{ flex: 1, height: '8px', background: 'var(--bg-tertiary)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${(count / maxFreq) * 100}%`, background: 'var(--accent)', borderRadius: '4px', transition: 'width 0.3s ease' }} />
                </div>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', color: 'var(--text-muted)', minWidth: '28px', textAlign: 'right' }}>{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
