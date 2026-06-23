'use client'
import { useState } from 'react'
import CopyButton from '../ui/CopyButton'

export default function JsonFormatter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [indent, setIndent] = useState(2)

  const format = () => {
    try {
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed, null, indent))
      setError('')
    } catch (e: unknown) {
      setError((e as Error).message)
      setOutput('')
    }
  }

  const minify = () => {
    try {
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed))
      setError('')
    } catch (e: unknown) {
      setError((e as Error).message)
      setOutput('')
    }
  }

  const clear = () => {
    setInput('')
    setOutput('')
    setError('')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label className="label" style={{ margin: 0 }}>Indent</label>
          {[2, 4].map(n => (
            <button
              key={n}
              onClick={() => setIndent(n)}
              style={{
                padding: '0.3rem 0.7rem',
                borderRadius: '6px',
                border: '1px solid var(--border)',
                background: indent === n ? 'var(--accent)' : 'var(--bg-tertiary)',
                color: indent === n ? '#fff' : 'var(--text-secondary)',
                fontSize: '0.8rem',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              {n}
            </button>
          ))}
        </div>
        <button className="btn-primary" onClick={format}>Format</button>
        <button className="btn-secondary" onClick={minify}>Minify</button>
        <button className="btn-secondary" onClick={clear}>Clear</button>
      </div>

      {/* Editor panels */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label className="label">Input JSON</label>
          <textarea
            className="input-base input-mono"
            rows={18}
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={'{\n  "name": "world"\n}'}
            style={{ resize: 'vertical' }}
          />
        </div>
        <div>
          <label className="label">Output</label>
          <div style={{ position: 'relative' }}>
            <textarea
              className="input-base input-mono"
              rows={18}
              value={error || output}
              readOnly
              style={{
                resize: 'vertical',
                color: error ? '#EF4444' : 'var(--text-primary)',
              }}
              placeholder="Formatted JSON appears here..."
            />
            {output && !error && <CopyButton text={output} />}
          </div>
        </div>
      </div>
    </div>
  )
}
