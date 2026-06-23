'use client'
import { useState, useCallback } from 'react'
import { RefreshCw, Copy, Check } from 'lucide-react'

const CHARS = {
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()-_=+[]{}|;:,.<>?',
}

type CharKey = keyof typeof CHARS

function getStrength(password: string): { label: string; color: string; width: string } {
  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 14) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  if (score <= 1) return { label: 'Weak', color: '#EF4444', width: '20%' }
  if (score <= 3) return { label: 'Fair', color: '#F59E0B', width: '55%' }
  if (score === 4) return { label: 'Strong', color: '#10B981', width: '80%' }
  return { label: 'Very Strong', color: '#00D4AA', width: '100%' }
}

const TOGGLE_OPTIONS: { label: string; charKey: CharKey }[] = [
  { label: 'A–Z', charKey: 'upper' },
  { label: 'a–z', charKey: 'lower' },
  { label: '0–9', charKey: 'numbers' },
  { label: '!@#$', charKey: 'symbols' },
]

export default function PasswordGenerator() {
  const [length, setLength] = useState(16)
  const [options, setOptions] = useState<Record<CharKey, boolean>>({
    upper: true,
    lower: true,
    numbers: true,
    symbols: true,
  })
  const [passwords, setPasswords] = useState<string[]>([])
  const [copied, setCopied] = useState(false)
  const [count, setCount] = useState(1)

  const generate = useCallback(() => {
    const charset = (Object.keys(CHARS) as CharKey[])
      .filter(k => options[k])
      .map(k => CHARS[k])
      .join('')
    if (!charset) return
    const generated = Array.from({ length: count }, () =>
      Array.from({ length }, () => charset[Math.floor(Math.random() * charset.length)]).join('')
    )
    setPasswords(generated)
  }, [length, options, count])

  const copyAll = async () => {
    if (!passwords.length) return
    await navigator.clipboard.writeText(passwords.join('\n'))
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const strength = passwords[0] ? getStrength(passwords[0]) : null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Length slider */}
      <div>
        <label className="label">Length: {length}</label>
        <input
          type="range" min={4} max={64} value={length}
          onChange={e => setLength(Number(e.target.value))}
          style={{ width: '100%', accentColor: 'var(--accent)' }}
        />
      </div>

      {/* Character set toggles */}
      <div>
        <label className="label">Character Sets</label>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {TOGGLE_OPTIONS.map(({ label, charKey }) => (
            <button
              key={charKey}
              onClick={() => setOptions(o => ({ ...o, [charKey]: !o[charKey] }))}
              style={{
                padding: '0.4rem 0.75rem',
                borderRadius: '6px',
                border: '1px solid var(--border)',
                background: options[charKey] ? 'var(--accent)' : 'var(--bg-tertiary)',
                color: options[charKey] ? '#fff' : 'var(--text-secondary)',
                fontSize: '0.8rem',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Count + actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label className="label" style={{ margin: 0 }}>Count</label>
          <input
            type="number" min={1} max={20} value={count}
            onChange={e => setCount(Math.max(1, Math.min(20, Number(e.target.value))))}
            className="input-base"
            style={{ width: '65px' }}
          />
        </div>
        <button className="btn-primary" onClick={generate} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <RefreshCw size={13} /> Generate
        </button>
        {passwords.length > 0 && (
          <button className="btn-secondary" onClick={copyAll} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            {copied ? <Check size={13} /> : <Copy size={13} />}
            {copied ? 'Copied!' : count > 1 ? 'Copy all' : 'Copy'}
          </button>
        )}
      </div>

      {/* Results */}
      {passwords.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {passwords.map((pw, i) => (
            <div key={i} style={{
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              padding: '0.75rem 1rem',
            }}>
              <code style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.9rem',
                color: 'var(--text-primary)',
                wordBreak: 'break-all',
                display: 'block',
              }}>
                {pw}
              </code>
              {/* Strength bar only under first password */}
              {i === 0 && strength && (
                <div style={{ marginTop: '0.6rem' }}>
                  <div style={{ height: '4px', background: 'var(--border)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: strength.width,
                      background: strength.color,
                      borderRadius: '2px',
                      transition: 'width 0.3s ease',
                    }} />
                  </div>
                  <span style={{ fontSize: '0.72rem', color: strength.color, fontWeight: 600, marginTop: '0.3rem', display: 'block' }}>
                    {strength.label}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
