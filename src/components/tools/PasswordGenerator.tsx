'use client'
import { useState, useCallback } from 'react'
import { RefreshCw, Copy, Check } from 'lucide-react'

const CHARS = {
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()-_=+[]{}|;:,.<>?',
}

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

export default function PasswordGenerator() {
  const [length, setLength] = useState(16)
  const [options, setOptions] = useState({ upper: true, lower: true, numbers: true, symbols: true })
  const [password, setPassword] = useState('')
  const [copied, setCopied] = useState(false)
  const [count, setCount] = useState(1)
  const [passwords, setPasswords] = useState<string[]>([])

  const generate = useCallback(() => {
    const charset = Object.entries(options)
      .filter(([, v]) => v)
      .map(([k]) => CHARS[k as keyof typeof CHARS])
      .join('')
    if (!charset) return
    const generated = Array.from({ length: count }, () =>
      Array.from({ length }, () => charset[Math.floor(Math.random() * charset.length)]).join('')
    )
    setPasswords(generated)
    setPassword(generated[0])
  }, [length, options, count])

  const copy = async () => {
    await navigator.clipboard.writeText(count > 1 ? passwords.join('\n') : password)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const strength = password ? getStrength(password) : null

  const Toggle = ({ label, key: k }: { label: string; key: keyof typeof options }) => (
    <button
      onClick={() => setOptions(o => ({ ...o, [k]: !o[k] }))}
      style={{
        padding: '0.4rem 0.75rem',
        borderRadius: '6px',
        border: '1px solid var(--border)',
        background: options[k] ? 'var(--accent)' : 'var(--bg-tertiary)',
        color: options[k] ? '#fff' : 'var(--text-secondary)',
        fontSize: '0.8rem',
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'all 0.15s ease',
      }}
    >{label}</button>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label className="label" style={{ margin: 0 }}>Length: {length}</label>
        </div>
        <input
          type="range" min={4} max={64} value={length}
          onChange={e => setLength(+e.target.value)}
          style={{ width: '100%', accentColor: 'var(--accent)' }}
        />
      </div>

      <div>
        <label className="label">Character Sets</label>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <Toggle label="A–Z" key="upper" />
          <Toggle label="a–z" key="lower" />
          <Toggle label="0–9" key="numbers" />
          <Toggle label="!@#$" key="symbols" />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label className="label" style={{ margin: 0 }}>Count</label>
          <input type="number" min={1} max={20} value={count} onChange={e => setCount(+e.target.value)}
            className="input-base" style={{ width: '65px' }} />
        </div>
        <button className="btn-primary" onClick={generate} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <RefreshCw size={13} /> Generate
        </button>
        {password && (
          <button className="btn-secondary" onClick={copy} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            {copied ? <Check size={13} /> : <Copy size={13} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        )}
      </div>

      {passwords.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {passwords.map((pw, i) => (
            <div key={i} style={{
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              padding: '0.75rem 1rem',
            }}>
              <code style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.9rem', color: 'var(--text-primary)', wordBreak: 'break-all' }}>
                {pw}
              </code>
              {i === 0 && strength && (
                <div style={{ marginTop: '0.6rem' }}>
                  <div style={{ height: '4px', background: 'var(--border)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: strength.width, background: strength.color, borderRadius: '2px', transition: 'width 0.3s ease' }} />
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
