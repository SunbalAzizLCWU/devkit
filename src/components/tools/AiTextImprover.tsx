'use client'
import { useState } from 'react'
import CopyButton from '../ui/CopyButton'

const TONES = [
  'Clear & concise',
  'Professional',
  'Friendly',
  'Formal',
  'Simple (plain English)',
]

export default function AiTextImprover() {
  const [input, setInput] = useState('')
  const [tone, setTone] = useState(TONES[0])
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const improve = async () => {
    if (!input.trim()) return
    setLoading(true)
    setError('')
    setOutput('')
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: `Rewrite the following text to be "${tone}". Return ONLY the improved text with no preamble, no explanations, and no quotation marks around it.\n\nText:\n${input}`,
          }],
        }),
      })

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error((errData as { error?: { message?: string } }).error?.message || `Request failed: ${res.status}`)
      }

      const data = await res.json()
      const text: string = data.content?.[0]?.text || ''
      if (!text) throw new Error('Empty response from AI.')
      setOutput(text)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Tone selector */}
      <div>
        <label className="label">Tone / Goal</label>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {TONES.map(t => (
            <button
              key={t}
              onClick={() => setTone(t)}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: '6px',
                border: '1px solid var(--border)',
                background: tone === t ? 'var(--accent)' : 'var(--bg-tertiary)',
                color: tone === t ? '#fff' : 'var(--text-secondary)',
                fontSize: '0.8rem',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Text areas */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label className="label">Your Text</label>
          <textarea
            className="input-base"
            rows={12}
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Paste the text you want to improve..."
            style={{ resize: 'vertical' }}
          />
        </div>
        <div>
          <label className="label">Improved Version</label>
          <div style={{ position: 'relative' }}>
            <textarea
              className="input-base"
              rows={12}
              value={loading ? '✨ Improving your text...' : error ? error : output}
              readOnly
              style={{
                resize: 'vertical',
                color: error ? '#EF4444' : 'var(--text-primary)',
              }}
              placeholder="AI-improved text appears here..."
            />
            {output && !error && <CopyButton text={output} />}
          </div>
        </div>
      </div>

      <button
        className="btn-primary"
        onClick={improve}
        disabled={loading || !input.trim()}
        style={{ alignSelf: 'flex-start', opacity: loading || !input.trim() ? 0.6 : 1, cursor: loading || !input.trim() ? 'not-allowed' : 'pointer' }}
      >
        {loading ? '✨ Improving...' : '✨ Improve Text'}
      </button>
    </div>
  )
}
