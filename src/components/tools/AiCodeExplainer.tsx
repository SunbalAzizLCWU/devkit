'use client'
import { useState } from 'react'
import CopyButton from '../ui/CopyButton'
import GroqKeyInput, { useGroqKey } from '../ui/GroqKeyInput'
import { groqChat } from '@/lib/groq'

const LANGS = ['Auto-detect', 'JavaScript', 'TypeScript', 'Python', 'Rust', 'Go', 'Java', 'C/C++', 'SQL', 'Bash', 'CSS', 'HTML']
const DEPTHS = ['Simple (ELI5)', 'Normal', 'Detailed (line by line)']

export default function AiCodeExplainer() {
  const { key, save } = useGroqKey()
  const [code, setCode] = useState('')
  const [lang, setLang] = useState(LANGS[0])
  const [depth, setDepth] = useState(DEPTHS[1])
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const explain = async () => {
    if (!code.trim() || !key) return
    setLoading(true); setError(''); setOutput('')
    try {
      const result = await groqChat(
        key,
        `Explain the following code in plain English.
Language: ${lang}
Depth: ${depth}
Return ONLY the explanation. No preamble, no "here is the explanation".

Code:
\`\`\`
${code}
\`\`\``,
        'You are a senior software engineer. Explain code clearly and concisely. Return only the explanation.'
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
          <label className="label">Language</label>
          <select className="input-base" value={lang} onChange={e => setLang(e.target.value)} style={{ cursor: 'pointer', width: 'auto' }}>
            {LANGS.map(l => <option key={l}>{l}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Detail Level</label>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {DEPTHS.map(d => (
              <button key={d} onClick={() => setDepth(d)} style={{
                padding: '0.35rem 0.75rem', borderRadius: '6px', border: '1px solid var(--border)',
                background: depth === d ? 'var(--accent)' : 'var(--bg-tertiary)',
                color: depth === d ? '#fff' : 'var(--text-secondary)',
                fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer',
              }}>{d}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label className="label">Code</label>
          <textarea className="input-base input-mono" rows={16} value={code}
            onChange={e => setCode(e.target.value)}
            placeholder="Paste your code here..." style={{ resize: 'vertical' }} />
        </div>
        <div>
          <label className="label">Explanation</label>
          <div style={{ position: 'relative' }}>
            <textarea className="input-base" rows={16}
              value={loading ? '💡 Analyzing...' : error ? error : output}
              readOnly style={{ resize: 'vertical', color: error ? '#EF4444' : 'var(--text-primary)', lineHeight: 1.7 }}
              placeholder="Plain-English explanation appears here..." />
            {output && !error && <CopyButton text={output} />}
          </div>
        </div>
      </div>

      <button className="btn-primary" onClick={explain}
        disabled={loading || !code.trim() || !key}
        style={{ alignSelf: 'flex-start', opacity: loading || !code.trim() || !key ? 0.6 : 1 }}>
        {loading ? '💡 Analyzing...' : '💡 Explain Code'}
      </button>
      {!key && <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>⚠ Enter your Groq API key above.</p>}
    </div>
  )
}
