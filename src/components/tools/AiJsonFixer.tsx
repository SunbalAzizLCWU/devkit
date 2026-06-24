'use client'
import { useState } from 'react'
import CopyButton from '../ui/CopyButton'
import GroqKeyInput, { useGroqKey } from '../ui/GroqKeyInput'
import { groqChat } from '@/lib/groq'

interface FixResult { fixed: string; explanation: string }

function prettyPrint(json: string): string {
  try { return JSON.stringify(JSON.parse(json), null, 2) } catch { return json }
}

export default function AiJsonFixer() {
  const { key, save } = useGroqKey()
  const [input, setInput] = useState('')
  const [result, setResult] = useState<FixResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fix = async () => {
    if (!input.trim() || !key) return
    setLoading(true); setError(''); setResult(null)
    try {
      const text = await groqChat(
        key,
        `Fix the following broken JSON. Return ONLY a raw JSON object (no markdown, no backticks):
{"fixed":"<the fixed JSON as a JSON-encoded string>","explanation":"Brief description of what was fixed"}

Broken JSON:
${input}`,
        'You are a JSON repair expert. Return only the JSON object, nothing else.'
      )
      const parsed: FixResult = JSON.parse(text.replace(/```json|```/g, '').trim())
      setResult(parsed)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to fix JSON. Try again.')
    }
    setLoading(false)
  }

  const prettyFixed = result?.fixed ? prettyPrint(result.fixed) : ''

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <GroqKeyInput apiKey={key} onSave={save} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label className="label">Broken JSON</label>
          <textarea className="input-base input-mono" rows={14} value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={'{\n  name: "John",\n  age: 30,\n}'}
            style={{ resize: 'vertical' }} />
        </div>
        <div>
          <label className="label">Fixed JSON</label>
          <div style={{ position: 'relative' }}>
            <textarea className="input-base input-mono" rows={14}
              value={loading ? 'Fixing...' : error ? error : prettyFixed}
              readOnly style={{ resize: 'vertical', color: error ? '#EF4444' : 'var(--text-primary)' }}
              placeholder="Fixed JSON appears here..." />
            {prettyFixed && !error && <CopyButton text={prettyFixed} />}
          </div>
        </div>
      </div>

      <button className="btn-primary" onClick={fix}
        disabled={loading || !input.trim() || !key}
        style={{ alignSelf: 'flex-start', opacity: loading || !input.trim() || !key ? 0.6 : 1 }}>
        {loading ? '🛠 Fixing...' : '🛠 Fix JSON'}
      </button>
      {!key && <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>⚠ Enter your Groq API key above.</p>}

      {result?.explanation && (
        <div style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: '10px', padding: '0.875rem', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>What was fixed:</strong>
          {result.explanation}
        </div>
      )}
    </div>
  )
}
