'use client'
import { useState } from 'react'
import CopyButton from '../ui/CopyButton'

const FLAG_OPTIONS = [
  { flag: 'g', label: 'g', title: 'Global' },
  { flag: 'i', label: 'i', title: 'Case-insensitive' },
  { flag: 'm', label: 'm', title: 'Multiline' },
  { flag: 's', label: 's', title: 'Dot all' },
]

export default function RegexTester() {
  const [pattern, setPattern] = useState('')
  const [flags, setFlags] = useState<Set<string>>(new Set(['g']))
  const [testStr, setTestStr] = useState('')

  const toggleFlag = (f: string) => {
    setFlags(prev => {
      const next = new Set(prev)
      next.has(f) ? next.delete(f) : next.add(f)
      return next
    })
  }

  const flagStr = FLAG_OPTIONS.map(f => f.flag).filter(f => flags.has(f)).join('')

  type RegexResult = { regex: RegExp; matches: RegExpMatchArray[]; highlighted: string; groups: string[][] } | { error: string }

  const result: RegexResult = (() => {
    if (!pattern) return { regex: /(?:)/, matches: [], highlighted: testStr, groups: [] }
    try {
      const activeFlags = flagStr.includes('g') ? flagStr : flagStr + 'g'
      const regex = new RegExp(pattern, activeFlags)
      const matches = [...testStr.matchAll(new RegExp(pattern, activeFlags))]
      const highlighted = testStr.replace(
        new RegExp(pattern, activeFlags),
        m => `<mark style="background:#00D4AA;color:#fff;border-radius:3px;padding:0 2px;font-weight:600">${m.replace(/</g, '&lt;')}</mark>`
      )
      const groups = matches.map(m => m.slice(1).filter(Boolean))
      return { regex, matches, highlighted, groups }
    } catch (e: unknown) {
      return { error: (e as Error).message }
    }
  })()

  const hasError = 'error' in result
  const matchCount = hasError ? 0 : result.matches.length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Pattern input */}
      <div>
        <label className="label">Regular Expression</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-muted)', fontSize: '1.1rem' }}>/</span>
          <input
            className="input-base input-mono"
            value={pattern}
            onChange={e => setPattern(e.target.value)}
            placeholder="[a-z]+"
            style={{ flex: 1 }}
          />
          <span style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-muted)', fontSize: '1.1rem' }}>/</span>
          <span style={{
            fontFamily: 'JetBrains Mono, monospace',
            color: 'var(--accent-text)',
            fontSize: '1rem',
            minWidth: '30px',
          }}>{flagStr}</span>
        </div>
        {hasError && (
          <p style={{ color: '#EF4444', fontSize: '0.78rem', marginTop: '0.35rem' }}>⚠ {result.error}</p>
        )}
      </div>

      {/* Flags */}
      <div>
        <label className="label">Flags</label>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {FLAG_OPTIONS.map(({ flag, label, title }) => (
            <button
              key={flag}
              title={title}
              onClick={() => toggleFlag(flag)}
              style={{
                padding: '0.3rem 0.75rem',
                borderRadius: '6px',
                border: '1px solid var(--border)',
                background: flags.has(flag) ? 'var(--accent)' : 'var(--bg-tertiary)',
                color: flags.has(flag) ? '#fff' : 'var(--text-secondary)',
                fontSize: '0.85rem',
                fontFamily: 'JetBrains Mono, monospace',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Test string */}
      <div>
        <label className="label">Test String</label>
        <textarea
          className="input-base"
          rows={5}
          value={testStr}
          onChange={e => setTestStr(e.target.value)}
          placeholder="Enter text to test against..."
          style={{ resize: 'none' }}
        />
      </div>

      {/* Results */}
      {testStr && pattern && !hasError && (
        <>
          <div style={{
            padding: '0.5rem 0.875rem',
            borderRadius: '8px',
            background: matchCount > 0 ? 'var(--accent-subtle)' : 'var(--bg-tertiary)',
            border: `1px solid ${matchCount > 0 ? 'var(--accent)' : 'var(--border)'}`,
            fontSize: '0.82rem',
            fontWeight: 600,
            color: matchCount > 0 ? 'var(--accent-text)' : 'var(--text-muted)',
          }}>
            {matchCount > 0 ? `✓ ${matchCount} match${matchCount !== 1 ? 'es' : ''} found` : '✗ No matches'}
          </div>

          {/* Highlighted */}
          <div>
            <label className="label">Match Highlights</label>
            <div
              style={{
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '0.75rem',
                fontSize: '0.9rem',
                lineHeight: 1.7,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                fontFamily: 'JetBrains Mono, monospace',
              }}
              dangerouslySetInnerHTML={{ __html: result.highlighted }}
            />
          </div>

          {/* Match list */}
          {matchCount > 0 && (
            <div>
              <label className="label">Matches</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {result.matches.map((m, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border)',
                    borderRadius: '7px',
                    padding: '0.5rem 0.875rem',
                  }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', minWidth: '24px', fontWeight: 700 }}>#{i + 1}</span>
                    <code style={{ flex: 1, fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem', color: 'var(--accent-text)' }}>{m[0]}</code>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>idx {m.index}</span>
                    <CopyButton text={m[0]} overlay={false} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
