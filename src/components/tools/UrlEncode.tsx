'use client'
import { useState } from 'react'
import CopyButton from '../ui/CopyButton'

type Mode = 'encode' | 'decode'

function process(input: string, mode: Mode): { result: string; error: string } {
  if (!input) return { result: '', error: '' }
  try {
    if (mode === 'encode') {
      return { result: encodeURIComponent(input), error: '' }
    } else {
      return { result: decodeURIComponent(input), error: '' }
    }
  } catch {
    return { result: '', error: 'Invalid URL-encoded string.' }
  }
}

export default function UrlEncode() {
  const [input, setInput] = useState('')
  const [mode, setMode] = useState<Mode>('encode')

  const { result: output, error } = process(input, mode)

  const swap = () => {
    if (!output) return
    setInput(output)
    setMode(m => (m === 'encode' ? 'decode' : 'encode'))
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
          >
            {m}
          </button>
        ))}
        {output && <button className="btn-secondary" onClick={swap}>⇄ Swap</button>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label className="label">{mode === 'encode' ? 'Plain URL / Text' : 'Encoded String'}</label>
          <textarea
            className="input-base input-mono"
            rows={10}
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={
              mode === 'encode'
                ? 'https://example.com/path?q=hello world'
                : 'https%3A%2F%2Fexample.com%2F...'
            }
            style={{ resize: 'vertical' }}
          />
        </div>
        <div>
          <label className="label">{mode === 'encode' ? 'Encoded Output' : 'Decoded Output'}</label>
          <div style={{ position: 'relative' }}>
            <textarea
              className="input-base input-mono"
              rows={10}
              value={error || output}
              readOnly
              style={{
                resize: 'vertical',
                color: error ? '#EF4444' : 'var(--text-primary)',
              }}
              placeholder="Output appears here..."
            />
            {output && !error && <CopyButton text={output} />}
          </div>
        </div>
      </div>
    </div>
  )
}
