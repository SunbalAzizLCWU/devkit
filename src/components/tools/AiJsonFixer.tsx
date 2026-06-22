'use client'
import { useState } from 'react'
import CopyButton from '../ui/CopyButton'

export default function AiJsonFixer() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<{ fixed: string; explanation: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fix = async () => {
    if (!input.trim()) return
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: `Fix the following broken JSON. Respond ONLY with valid JSON in this exact structure, nothing else:
{"fixed": "the_fixed_json_string_here", "explanation": "Brief bullet-point list of what was wrong and fixed"}

Broken JSON:
${input}`,
          }],
        }),
      })
      const data = await res.json()
      const text = data.content?.[0]?.text || ''
      const parsed = JSON.parse(text.replace(/```json|```/g, '').trim())
      setResult(parsed)
    } catch {
      setError('Failed to fix JSON. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label className="label">Broken JSON</label>
          <textarea className="input-base input-mono" rows={14} value={input} onChange={e => setInput(e.target.value)}
            placeholder={'{\n  name: "John",\n  age: 30,\n  city: \'NYC\'\n}'}
            style={{ resize: 'vertical' }} />
        </div>
        <div>
          <label className="label">Fixed JSON</label>
          <div style={{ position: 'relative' }}>
            <textarea className="input-base input-mono" rows={14}
              value={loading ? 'Fixing your JSON...' : (error || (result?.fixed ? JSON.stringify(JSON.parse(result.fixed), null, 2) : ''))}
              readOnly style={{ resize: 'vertical', color: error ? '#EF4444' : 'var(--text-primary)' }}
              placeholder="Fixed JSON will appear here..." />
            {result?.fixed && <CopyButton text={JSON.stringify(JSON.parse(result.fixed), null, 2)} />}
          </div>
        </div>
      </div>

      <button className="btn-primary" onClick={fix} disabled={loading || !input.trim()}
        style={{ alignSelf: 'flex-start', opacity: loading || !input.trim() ? 0.6 : 1 }}>
        {loading ? '🛠 Fixing...' : '🛠 Fix JSON'}
      </button>

      {result?.explanation && (
        <div style={{
          background: 'var(--bg-tertiary)',
          border: '1px solid var(--border)',
          borderRadius: '10px',
          padding: '0.875rem',
          fontSize: '0.85rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.7,
        }}>
          <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>What was fixed:</strong>
          {result.explanation}
        </div>
      )}
    </div>
  )
}
