'use client'
import { useState } from 'react'
import CopyButton from '../ui/CopyButton'

export default function NumberBase() {
  const [value, setValue] = useState('')
  const [fromBase, setFromBase] = useState(10)

  const bases = [
    { label: 'Binary', base: 2, prefix: '0b' },
    { label: 'Octal', base: 8, prefix: '0o' },
    { label: 'Decimal', base: 10, prefix: '' },
    { label: 'Hexadecimal', base: 16, prefix: '0x' },
  ]

  const decimal = value ? parseInt(value.replace(/^0[xXbBoO]/, ''), fromBase) : NaN

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div>
        <label className="label">Input Base</label>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
          {bases.map(({ label, base }) => (
            <button key={base} onClick={() => setFromBase(base)} style={{
              padding: '0.35rem 0.85rem',
              borderRadius: '6px',
              border: '1px solid var(--border)',
              background: fromBase === base ? 'var(--accent)' : 'var(--bg-tertiary)',
              color: fromBase === base ? '#fff' : 'var(--text-secondary)',
              fontSize: '0.82rem',
              fontWeight: 500,
              cursor: 'pointer',
            }}>{label}</button>
          ))}
        </div>
        <input
          className="input-base input-mono"
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder={`Enter ${bases.find(b => b.base === fromBase)?.label.toLowerCase()} number...`}
        />
      </div>

      {!isNaN(decimal) && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {bases.map(({ label, base, prefix }) => {
            const result = decimal.toString(base).toUpperCase()
            return (
              <div key={base} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.875rem',
                padding: '0.65rem 0.875rem',
                background: fromBase === base ? 'var(--accent-subtle)' : 'var(--bg-tertiary)',
                border: `1px solid ${fromBase === base ? 'var(--accent)' : 'var(--border)'}`,
                borderRadius: '8px',
              }}>
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: 'var(--accent-text)',
                  minWidth: '90px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>{label}</span>
                <code style={{ flex: 1, fontFamily: 'JetBrains Mono, monospace', fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                  {prefix}{result}
                </code>
                <CopyButton text={prefix + result} />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
