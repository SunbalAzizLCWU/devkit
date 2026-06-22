'use client'
import { useState } from 'react'
import CopyButton from '../ui/CopyButton'

export default function Base64Tool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')
  const [error, setError] = useState('')

  const process = () => {
    setError('')
    try {
      if (mode === 'encode') {
        setOutput(btoa(unescape(encodeURIComponent(input))))
      } else {
        setOutput(decodeURIComponent(escape(atob(input))))
      }
    } catch {
      setError(mode === 'decode' ? 'Invalid Base64 string' : 'Encoding failed')
      setOutput('')
    }
  }

  const swap = () => {
    setInput(output)
    setOutput('')
    setMode(m => m === 'encode' ? 'decode' : 'encode')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
        {(['encode', 'decode'] as const).map(m => (
          <button
            key={m}
            onClick={() => setMode(m)}
            style={{
              padding: '0.4rem 1rem',
              borderRadius: '6px',
              border: '1px solid var(--border)',
              background: mode === m ? 'var(--accent)' : 'var(--bg-tertiary)',
              color: mode === m ? '#fff' : 'var(--text-secondary)',
              fontSize: '0.85rem',
              fontWeight: 500,
              cursor: 'pointer',
              textTransform: 'capitalize',
            }}
          >{m}</button>
        ))}
        <button className="btn-primary" onClick={process}>{mode === 'encode' ? 'Encode →' : 'Decode →'}</button>
        {output && <button className="btn-secondary" onClick={swap}>⇄ Swap</button>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label className="label">{mode === 'encode' ? 'Plain Text' : 'Base64 Input'}</label>
          <textarea
            className="input-base input-mono"
            rows={12}
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter Base64 to decode...'}
            style={{ resize: 'vertical' }}
          />
        </div>
        <div>
          <label className="label">{mode === 'encode' ? 'Base64 Output' : 'Decoded Text'}</label>
          <div style={{ position: 'relative' }}>
            <textarea
              className="input-base input-mono"
              rows={12}
              value={error || output}
              readOnly
              placeholder="Result will appear here..."
              style={{ resize: 'vertical', color: error ? '#EF4444' : 'var(--text-primary)' }}
            />
            {output && <CopyButton text={output} />}
          </div>
        </div>
      </div>
    </div>
  )
}
