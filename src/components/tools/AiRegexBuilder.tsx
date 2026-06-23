'use client'
import { useState } from 'react'
import CopyButton from '../ui/CopyButton'

interface RegexResult {
  pattern: string
  flags: string
  explanation: string
}

export default function AiRegexBuilder() {
  const [description, setDescription] = useState('')
  const [testStr, setTestStr] = useState('')
  const [result, setResult] = useState<RegexResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const generate = async () => {
    if (!description.trim()) return
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
            content: `Generate a JavaScript regular expression for: "${description}".
Respond ONLY with valid JSON in this exact format, no markdown, no backticks, no explanation outside JSON:
{"pattern":"regex_pattern_here","flags":"gi","explanation":"Short plain-English explanation of how it works"}`,
          }],
        }),
      })
      const data = await res.json()
      const text: string = data.content?.[0]?.text || ''
      const cleaned = text.replace(/```json|```/g, '').trim()
      const parsed: RegexResult = JSON.parse(cleaned)
      setResult(parsed)
    } catch {
      setError('Failed to generate regex. Please try again.')
    }
    setLoading(false)
  }

  const getRegex = (): RegExp | null => {
    if (!result) return null
    try {
      // Ensure global flag for matchAll
      const flags = result.flags.includes('g') ? result.flags : result.flags + 'g'
      return new RegExp(result.pattern, flags)
    } catch {
      return null
    }
  }

  const regex = getRegex()
  const matchCount = regex && testStr ? [...testStr.matchAll(regex)].length : 0

  const getHighlighted = (): string => {
    if (!regex || !testStr) return testStr
    try {
      return testStr.replace(
        new RegExp(result!.pattern, result!.flags.includes('g') ? result!.flags : result!.flags + 'g'),
        m => `<mark style="background:var(--accent);color:#fff;border-radius:3px;padding:0 2px">${m}</mark>`
      )
    } catch {
      return testStr
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <label className="label">Describe What You Want to Match</label>
        <input
          className="input-base"
          value={description}
          onChange={e => setDescription(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && generate()}
          placeholder='e.g. "email addresses", "phone numbers starting with +1", "hex color codes"'
        />
      </div>

      <button
        className="btn-primary"
        onClick={generate}
        disabled={loading || !description.trim()}
        style={{ alignSelf: 'flex-start', opacity: loading || !description.trim() ? 0.6 : 1 }}
      >
        {loading ? '🤖 Building...' : '🤖 Build Regex'}
      </button>

      {error && <p style={{ color: '#EF4444', fontSize: '0.85rem' }}>⚠ {error}</p>}

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', animation: 'fadeIn 0.2s ease-out' }}>
          {/* Pattern */}
          <div style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: '10px', overflow: 'hidden' }}>
            <div style={{
              padding: '0.5rem 0.875rem',
              background: 'var(--accent-subtle)',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-text)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Generated Regex
              </span>
              <CopyButton text={`/${result.pattern}/${result.flags}`} />
            </div>
            <code style={{
              display: 'block',
              padding: '0.875rem',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '1rem',
              color: 'var(--accent-text)',
            }}>
              /{result.pattern}/{result.flags}
            </code>
          </div>

          {/* Explanation */}
          <p style={{
            fontSize: '0.85rem',
            color: 'var(--text-secondary)',
            background: 'var(--bg-tertiary)',
            padding: '0.75rem',
            borderRadius: '8px',
            border: '1px solid var(--border)',
            lineHeight: 1.6,
          }}>
            💡 {result.explanation}
          </p>

          {/* Tester */}
          <div>
            <label className="label">Test String</label>
            <textarea
              className="input-base"
              rows={4}
              value={testStr}
              onChange={e => setTestStr(e.target.value)}
              placeholder="Paste text here to test the regex..."
              style={{ resize: 'none' }}
            />
            {testStr && (
              <>
                <div
                  style={{
                    marginTop: '0.5rem',
                    padding: '0.75rem',
                    background: 'var(--bg-tertiary)',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    fontSize: '0.88rem',
                    lineHeight: 1.7,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                  dangerouslySetInnerHTML={{ __html: getHighlighted() }}
                />
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                  {matchCount} match{matchCount !== 1 ? 'es' : ''} found
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
