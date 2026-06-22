'use client'
import { useState } from 'react'
import CopyButton from '../ui/CopyButton'

async function hashText(text: string, algorithm: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(text)
  const hashBuffer = await crypto.subtle.digest(algorithm, data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

const ALGOS = [
  { label: 'SHA-1', algo: 'SHA-1' },
  { label: 'SHA-256', algo: 'SHA-256' },
  { label: 'SHA-384', algo: 'SHA-384' },
  { label: 'SHA-512', algo: 'SHA-512' },
]

export default function HashGenerator() {
  const [input, setInput] = useState('')
  const [hashes, setHashes] = useState<Record<string, string>>({})

  const generateAll = async () => {
    const results: Record<string, string> = {}
    for (const { label, algo } of ALGOS) {
      results[label] = await hashText(input, algo)
    }
    setHashes(results)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <label className="label">Input Text</label>
        <textarea
          className="input-base"
          rows={4}
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Enter text to hash..."
          style={{ resize: 'none' }}
        />
      </div>
      <button className="btn-primary" onClick={generateAll} style={{ alignSelf: 'flex-start' }}>
        Generate Hashes
      </button>

      {Object.keys(hashes).length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {ALGOS.map(({ label }) => (
            <div key={label} style={{
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              overflow: 'hidden',
            }}>
              <div style={{
                padding: '0.4rem 0.875rem',
                background: 'var(--accent-subtle)',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-text)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
                {hashes[label] && <CopyButton text={hashes[label]} />}
              </div>
              <code style={{
                display: 'block',
                padding: '0.65rem 0.875rem',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.8rem',
                color: 'var(--text-primary)',
                wordBreak: 'break-all',
                lineHeight: 1.6,
              }}>
                {hashes[label]}
              </code>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
