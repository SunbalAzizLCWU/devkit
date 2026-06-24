'use client'
import { useState } from 'react'
import CopyButton from '../ui/CopyButton'

export default function UrlParser() {
  const [url, setUrl] = useState('https://example.com:8080/path/to/page?name=Alice&age=30&city=NYC#section-1')

  let parsed: URL | null = null
  let error = ''
  try {
    parsed = new URL(url)
  } catch {
    error = 'Invalid URL. Make sure it starts with https:// or http://'
  }

  const params: [string, string][] = parsed ? [...parsed.searchParams.entries()] : []

  const Field = ({ label, value }: { label: string; value: string }) =>
    value ? (
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.75rem',
        padding: '0.6rem 0.875rem', background: 'var(--bg-tertiary)',
        border: '1px solid var(--border)', borderRadius: '8px',
      }}>
        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-text)', minWidth: '90px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
        <code style={{ flex: 1, fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem', color: 'var(--text-primary)', wordBreak: 'break-all' }}>{value}</code>
        <CopyButton text={value} overlay={false} />
      </div>
    ) : null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div>
        <label className="label">URL</label>
        <input className="input-base input-mono" value={url} onChange={e => setUrl(e.target.value)}
          placeholder="https://example.com/path?query=value#hash" />
        {error && <p style={{ color: '#EF4444', fontSize: '0.82rem', marginTop: '0.35rem' }}>⚠ {error}</p>}
      </div>

      {parsed && (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <Field label="Protocol" value={parsed.protocol.replace(':', '')} />
            <Field label="Host" value={parsed.host} />
            <Field label="Hostname" value={parsed.hostname} />
            <Field label="Port" value={parsed.port} />
            <Field label="Pathname" value={parsed.pathname} />
            <Field label="Search" value={parsed.search} />
            <Field label="Hash" value={parsed.hash} />
            <Field label="Origin" value={parsed.origin} />
          </div>

          {params.length > 0 && (
            <div>
              <label className="label">Query Parameters ({params.length})</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {params.map(([k, v]) => (
                  <div key={k} style={{
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                    padding: '0.5rem 0.875rem', background: 'var(--accent-subtle)',
                    border: '1px solid var(--accent)', borderRadius: '8px',
                  }}>
                    <code style={{ minWidth: '80px', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.82rem', color: 'var(--accent-text)', fontWeight: 600 }}>{k}</code>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>=</span>
                    <code style={{ flex: 1, fontFamily: 'JetBrains Mono, monospace', fontSize: '0.82rem', color: 'var(--text-primary)' }}>{v}</code>
                    <CopyButton text={v} overlay={false} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
