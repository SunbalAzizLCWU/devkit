'use client'
import { useState } from 'react'
import CopyButton from '../ui/CopyButton'

function base64UrlDecode(str: string) {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64 + '='.repeat((4 - base64.length % 4) % 4)
  try {
    return JSON.parse(atob(padded))
  } catch {
    return atob(padded)
  }
}

export default function JwtDecoder() {
  const [token, setToken] = useState('')

  const parts = token.trim().split('.')
  const isValid = parts.length === 3

  let header: unknown = null, payload: unknown = null, error = ''
  if (token && isValid) {
    try {
      header = base64UrlDecode(parts[0])
      payload = base64UrlDecode(parts[1])
    } catch {
      error = 'Invalid JWT token'
    }
  }

  const exp = payload && typeof payload === 'object' && (payload as Record<string, unknown>).exp
  const isExpired = exp ? (exp as number) * 1000 < Date.now() : null

  const Section = ({ label, data, color }: { label: string; data: unknown; color: string }) => (
    <div style={{
      background: 'var(--bg-tertiary)',
      borderRadius: '10px',
      border: `1px solid ${color}30`,
      overflow: 'hidden',
    }}>
      <div style={{
        padding: '0.5rem 0.875rem',
        background: `${color}15`,
        borderBottom: `1px solid ${color}30`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
        <CopyButton text={JSON.stringify(data, null, 2)} />
      </div>
      <pre style={{
        padding: '0.875rem',
        fontSize: '0.8rem',
        fontFamily: 'JetBrains Mono, monospace',
        color: 'var(--text-primary)',
        overflowX: 'auto',
        margin: 0,
        lineHeight: 1.6,
      }}>
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <label className="label">JWT Token</label>
        <textarea
          className="input-base input-mono"
          rows={4}
          value={token}
          onChange={e => setToken(e.target.value)}
          placeholder="Paste your JWT token here..."
          style={{ resize: 'none' }}
        />
      </div>

      {token && !isValid && <p style={{ color: '#EF4444', fontSize: '0.85rem' }}>⚠ Not a valid JWT (expected 3 parts separated by dots)</p>}
      {error && <p style={{ color: '#EF4444', fontSize: '0.85rem' }}>⚠ {error}</p>}

      {isValid && header && payload && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {isExpired !== null && (
            <div style={{
              padding: '0.6rem 0.875rem',
              borderRadius: '8px',
              background: isExpired ? '#EF444415' : '#10B98115',
              border: `1px solid ${isExpired ? '#EF4444' : '#10B981'}30`,
              fontSize: '0.83rem',
              fontWeight: 500,
              color: isExpired ? '#EF4444' : '#10B981',
            }}>
              {isExpired ? '⚠ This token has expired' : '✓ Token is still valid'}
              {exp && ` — expires ${new Date((exp as number) * 1000).toLocaleString()}`}
            </div>
          )}
          <Section label="Header" data={header} color="#6366F1" />
          <Section label="Payload" data={payload} color="#00D4AA" />
          <div style={{
            background: 'var(--bg-tertiary)',
            borderRadius: '10px',
            border: '1px solid #F59E0B30',
            overflow: 'hidden',
          }}>
            <div style={{ padding: '0.5rem 0.875rem', background: '#F59E0B15', borderBottom: '1px solid #F59E0B30' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#F59E0B', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Signature</span>
            </div>
            <p style={{ padding: '0.875rem', fontSize: '0.78rem', fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-secondary)', wordBreak: 'break-all', margin: 0 }}>
              {parts[2]}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
