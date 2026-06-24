'use client'
import { useState } from 'react'
import CopyButton from '../ui/CopyButton'
import GroqKeyInput, { useGroqKey } from '../ui/GroqKeyInput'
import { groqChat } from '@/lib/groq'

const STYLES = ['Bullet points', 'Short paragraph', 'TL;DR (1 sentence)', 'Executive summary']
const LENGTHS = ['Brief', 'Medium', 'Detailed']

export default function AiSummarizer() {
  const { key, save } = useGroqKey()
  const [input, setInput] = useState('')
  const [style, setStyle] = useState(STYLES[0])
  const [length, setLength] = useState(LENGTHS[1])
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const summarize = async () => {
    if (!input.trim() || !key) return
    setLoading(true); setError(''); setOutput('')
    try {
      const result = await groqChat(
        key,
        `Summarize the following text.
Style: ${style}
Length: ${length}
Return ONLY the summary, no preamble, no meta-commentary.

Text:
${input}`,
        'You are a professional summarizer. Return only the summary, nothing else.'
      )
      setOutput(result)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
    }
    setLoading(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <GroqKeyInput apiKey={key} onSave={save} />

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <label className="label">Style</label>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {STYLES.map(s => (
              <button key={s} onClick={() => setStyle(s)} style={{
                padding: '0.35rem 0.75rem', borderRadius: '6px', border: '1px solid var(--border)',
                background: style === s ? 'var(--accent)' : 'var(--bg-tertiary)',
                color: style === s ? '#fff' : 'var(--text-secondary)',
                fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer',
              }}>{s}</button>
            ))}
          </div>
        </div>
        <div>
          <label className="label">Length</label>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            {LENGTHS.map(l => (
              <button key={l} onClick={() => setLength(l)} style={{
                padding: '0.35rem 0.75rem', borderRadius: '6px', border: '1px solid var(--border)',
                background: length === l ? '#6366F1' : 'var(--bg-tertiary)',
                color: length === l ? '#fff' : 'var(--text-secondary)',
                fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer',
              }}>{l}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label className="label">Text to Summarize</label>
          <textarea className="input-base" rows={14} value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Paste any article, document, or text here..."
            style={{ resize: 'vertical' }} />
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
            {input.trim().split(/\s+/).filter(Boolean).length} words
          </div>
        </div>
        <div>
          <label className="label">Summary</label>
          <div style={{ position: 'relative' }}>
            <textarea className="input-base" rows={14}
              value={loading ? '📋 Summarizing...' : error ? error : output}
              readOnly style={{ resize: 'vertical', color: error ? '#EF4444' : 'var(--text-primary)' }}
              placeholder="AI summary appears here..." />
            {output && !error && <CopyButton text={output} />}
          </div>
        </div>
      </div>

      <button className="btn-primary" onClick={summarize}
        disabled={loading || !input.trim() || !key}
        style={{ alignSelf: 'flex-start', opacity: loading || !input.trim() || !key ? 0.6 : 1 }}>
        {loading ? '📋 Summarizing...' : '📋 Summarize'}
      </button>
      {!key && <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>⚠ Enter your Groq API key above.</p>}
    </div>
  )
}
