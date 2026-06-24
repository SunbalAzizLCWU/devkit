'use client'
import { useState, useEffect } from 'react'
import CopyButton from '../ui/CopyButton'
import GroqKeyInput, { useGroqKey } from '../ui/GroqKeyInput'
import { groqChat } from '@/lib/groq'

const TONES = ['Clear & concise', 'Professional', 'Friendly', 'Formal', 'Simple (plain English)']

export default function AiTextImprover() {
  const { key, save } = useGroqKey()
  const [input, setInput] = useState('')
  const [tone, setTone] = useState(TONES[0])
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const improve = async () => {
    if (!input.trim() || !key) return
    setLoading(true); setError(''); setOutput('')
    try {
      const result = await groqChat(
        key,
        `Rewrite the following text to be "${tone}". Return ONLY the improved text with no preamble, no explanations, no quotation marks.\n\nText:\n${input}`,
        'You are a professional writing assistant. Return only the rewritten text, nothing else.'
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

      <div>
        <label className="label">Tone / Goal</label>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {TONES.map(t => (
            <button key={t} onClick={() => setTone(t)} style={{
              padding: '0.35rem 0.75rem', borderRadius: '6px', border: '1px solid var(--border)',
              background: tone === t ? 'var(--accent)' : 'var(--bg-tertiary)',
              color: tone === t ? '#fff' : 'var(--text-secondary)',
              fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer',
            }}>{t}</button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label className="label">Your Text</label>
          <textarea className="input-base" rows={12} value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Paste the text you want to improve..."
            style={{ resize: 'vertical' }} />
        </div>
        <div>
          <label className="label">Improved Version</label>
          <div style={{ position: 'relative' }}>
            <textarea className="input-base" rows={12}
              value={loading ? '✨ Improving...' : error ? error : output}
              readOnly
              style={{ resize: 'vertical', color: error ? '#EF4444' : 'var(--text-primary)' }}
              placeholder="Improved text appears here..." />
            {output && !error && <CopyButton text={output} />}
          </div>
        </div>
      </div>

      <button className="btn-primary" onClick={improve}
        disabled={loading || !input.trim() || !key}
        style={{ alignSelf: 'flex-start', opacity: loading || !input.trim() || !key ? 0.6 : 1 }}>
        {loading ? '✨ Improving...' : '✨ Improve Text'}
      </button>
      {!key && <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>⚠ Enter your Groq API key above to use this tool.</p>}
    </div>
  )
}
