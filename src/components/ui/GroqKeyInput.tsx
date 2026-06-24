'use client'
import { useState, useEffect } from 'react'
import { Key, Eye, EyeOff, Check } from 'lucide-react'

export function useGroqKey() {
  const [key, setKey] = useState('')
  useEffect(() => {
    const k = sessionStorage.getItem('groq_api_key') || ''
    setKey(k)
  }, [])
  const save = (k: string) => {
    sessionStorage.setItem('groq_api_key', k)
    setKey(k)
  }
  return { key, save }
}

export default function GroqKeyInput({ apiKey, onSave }: { apiKey: string; onSave: (k: string) => void }) {
  const [draft, setDraft] = useState(apiKey)
  const [show, setShow] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => { setDraft(apiKey) }, [apiKey])

  const handleSave = () => {
    onSave(draft.trim())
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div style={{
      background: 'var(--bg-tertiary)',
      border: '1px solid var(--border)',
      borderRadius: '10px',
      padding: '0.875rem 1rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.6rem',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Key size={13} color='var(--accent-text)' />
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-text)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Groq API Key
        </span>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginLeft: '0.25rem' }}>
          — stored in session only, never sent anywhere except Groq
        </span>
      </div>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <input
            className="input-base input-mono"
            type={show ? 'text' : 'password'}
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSave()}
            placeholder="gsk_..."
            style={{ paddingRight: '2.5rem' }}
          />
          <button
            onClick={() => setShow(s => !s)}
            style={{
              position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex',
            }}
          >
            {show ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>
        <button className="btn-primary" onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', whiteSpace: 'nowrap' }}>
          {saved ? <><Check size={13} /> Saved!</> : 'Save Key'}
        </button>
      </div>
      <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
        Get a free key at{' '}
        <a href="https://console.groq.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-text)', textDecoration: 'underline' }}>
          console.groq.com
        </a>
        {' '}— uses llama-3.3-70b-versatile on the free tier.
      </p>
    </div>
  )
}
