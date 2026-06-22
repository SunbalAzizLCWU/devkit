'use client'
import { useState } from 'react'

const STATUS_CODES = [
  { code: 100, name: 'Continue', desc: 'The server has received the request headers.' },
  { code: 101, name: 'Switching Protocols', desc: 'The requester asked the server to switch protocols.' },
  { code: 200, name: 'OK', desc: 'Standard successful HTTP request.' },
  { code: 201, name: 'Created', desc: 'The request was fulfilled and a new resource was created.' },
  { code: 204, name: 'No Content', desc: 'Request processed, no content returned.' },
  { code: 206, name: 'Partial Content', desc: 'The server is delivering part of the resource due to a range header.' },
  { code: 301, name: 'Moved Permanently', desc: 'The URL has been permanently moved to a new location.' },
  { code: 302, name: 'Found', desc: 'The URL has been temporarily moved.' },
  { code: 304, name: 'Not Modified', desc: 'The resource has not been modified since last request.' },
  { code: 307, name: 'Temporary Redirect', desc: 'The resource resides temporarily at a different URI.' },
  { code: 308, name: 'Permanent Redirect', desc: 'The resource has been permanently moved; method must not change.' },
  { code: 400, name: 'Bad Request', desc: 'The server could not understand the request due to invalid syntax.' },
  { code: 401, name: 'Unauthorized', desc: 'Authentication is required and has failed or not been provided.' },
  { code: 403, name: 'Forbidden', desc: 'The server understood the request but refuses to authorize it.' },
  { code: 404, name: 'Not Found', desc: 'The requested resource could not be found.' },
  { code: 405, name: 'Method Not Allowed', desc: 'The request method is not supported for the requested resource.' },
  { code: 408, name: 'Request Timeout', desc: 'The server timed out waiting for the request.' },
  { code: 409, name: 'Conflict', desc: 'The request conflicts with the current state of the server.' },
  { code: 410, name: 'Gone', desc: 'The requested resource is no longer available and will not be available again.' },
  { code: 422, name: 'Unprocessable Entity', desc: 'The request was well-formed but semantic errors prevented fulfillment.' },
  { code: 429, name: 'Too Many Requests', desc: 'The user has sent too many requests in a given time — rate limiting.' },
  { code: 500, name: 'Internal Server Error', desc: 'A generic error message when an unexpected condition was encountered.' },
  { code: 501, name: 'Not Implemented', desc: 'The server does not support the functionality required.' },
  { code: 502, name: 'Bad Gateway', desc: 'The server received an invalid response from an upstream server.' },
  { code: 503, name: 'Service Unavailable', desc: 'The server is not ready to handle the request.' },
  { code: 504, name: 'Gateway Timeout', desc: 'The server acting as a gateway did not get a response in time.' },
]

function colorForCode(code: number) {
  if (code < 200) return { bg: '#6366F120', text: '#6366F1', border: '#6366F130' }
  if (code < 300) return { bg: '#10B98120', text: '#10B981', border: '#10B98130' }
  if (code < 400) return { bg: '#F59E0B20', text: '#F59E0B', border: '#F59E0B30' }
  if (code < 500) return { bg: '#EF444420', text: '#EF4444', border: '#EF444430' }
  return { bg: '#8B5CF620', text: '#8B5CF6', border: '#8B5CF630' }
}

export default function HttpStatus() {
  const [search, setSearch] = useState('')

  const filtered = STATUS_CODES.filter(s =>
    String(s.code).includes(search) ||
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.desc.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <input
        className="input-base"
        placeholder="Search by code, name, or description..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        {filtered.map(({ code, name, desc }) => {
          const colors = colorForCode(code)
          return (
            <div key={code} style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.875rem',
              padding: '0.75rem 0.875rem',
              background: 'var(--bg-tertiary)',
              border: `1px solid var(--border)`,
              borderRadius: '8px',
              transition: 'border-color 0.15s',
            }}>
              <span style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontWeight: 700,
                fontSize: '0.9rem',
                color: colors.text,
                background: colors.bg,
                border: `1px solid ${colors.border}`,
                borderRadius: '6px',
                padding: '0.2rem 0.5rem',
                minWidth: '52px',
                textAlign: 'center',
                flexShrink: 0,
              }}>{code}</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-primary)' }}>{name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>{desc}</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
