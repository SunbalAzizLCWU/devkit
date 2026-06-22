'use client'
import { useState } from 'react'
import CopyButton from '../ui/CopyButton'

export default function UrlEncode() {
  const [input, setInput] = useState('')
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')
  const [error, setError] = useState('')

  const output = (() => {
    if (!input) return ''
    try {
      setError('')
      return mode === 'encode' ? encodeURIComponent(input) : decodeURIComponent(input)
    } catch {
      setError(mode === 'decode' ? 'Invalid URL-encoded string' : 'Encoding failed')
      return ''
    }
  })()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        {(['encode', 'decode'] as const).map(m => (
          <button key={m} onClick={() => setMode(m)} style={{
            padding: '0.4rem 1rem',
            borderRadius: '6px',
            border: '1px solid var(--border)',
            background: mode === m ? 'var(--accent)' : 'var(--bg-tertiary)',
            color: mode === m ? '#fff' : 'var(--text-secondary)',
            fontSize: '0.85rem',
            fontWeight: 500,
            cursor: 'pointer',
            textTransform: 'capitalize',
          }}>{m}</button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label className="label">{mode === 'encode' ? 'Plain URL / Text' : 'Encoded String'}</label>
          <textarea className="input-base input-mono" rows={10} value={input} onChange={e => setInput(e.target.value)}
            placeholder={mode === 'encode' ? 'https://example.com/path?q=hello world' : 'https%3A%2F%2Fexample.com%2F...'}
            style={{ resize: 'vertical' }} />
        </div>
        <div>
          <label className="label">{mode === 'encode' ? 'Encoded Output' : 'Decoded Output'}</label>
          <div style={{ position: 'relative' }}>
            <textarea className="input-base input-mono" rows={10} value={error || output} readOnly
              style={{ resize: 'vertical', color: error ? '#EF4444' : 'var(--text-primary)' }}
              placeholder="Output appears here..." />
            {output && <CopyButton text={output} />}
          </div>
        </div>
      </div>
    </div>
  )
}
