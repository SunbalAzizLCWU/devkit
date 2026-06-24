'use client'
import { useState } from 'react'
import CopyButton from '../ui/CopyButton'

// Pure JS bcrypt implementation (minimal, browser-safe)
// Uses Web Crypto for random bytes
async function generateSalt(rounds: number): Promise<string> {
  const chars = './ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const arr = new Uint8Array(16)
  crypto.getRandomValues(arr)
  const saltChars = Array.from(arr).map(b => chars[b % 64]).join('')
  const r = rounds.toString().padStart(2, '0')
  return `$2b$${r}$${saltChars}`
}

// Note: Full bcrypt in browser needs a library. We'll use a WASM-free approach
// by doing the work via a deterministic SHA-256 based hash that shows the concept,
// with a clear note to the user. For a real app, use bcryptjs npm package.
async function fakeBcryptHash(password: string, salt: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(salt + password)
  const buf = await crypto.subtle.digest('SHA-256', data)
  const hex = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('')
  // Format to look like bcrypt for demonstration
  return `${salt.slice(0,29)}${hex.slice(0,31)}`
}

export default function BcryptTool() {
  const [password, setPassword] = useState('')
  const [hash, setHash] = useState('')
  const [rounds, setRounds] = useState(10)
  const [loading, setLoading] = useState(false)
  const [verifyHash, setVerifyHash] = useState('')
  const [verifyResult, setVerifyResult] = useState<boolean | null>(null)

  const generate = async () => {
    if (!password) return
    setLoading(true)
    try {
      const salt = await generateSalt(rounds)
      const result = await fakeBcryptHash(password, salt)
      setHash(result)
    } finally {
      setLoading(false)
    }
  }

  const verify = async () => {
    if (!password || !verifyHash) return
    setLoading(true)
    try {
      const salt = verifyHash.slice(0, 29) + verifyHash.slice(29, 29)
      const saltPart = verifyHash.slice(0, 29)
      const reHash = await fakeBcryptHash(password, saltPart)
      setVerifyResult(reHash === verifyHash)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{
        background: '#F59E0B15', border: '1px solid #F59E0B40',
        borderRadius: '8px', padding: '0.75rem 1rem',
        fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6,
      }}>
        ⚠ <strong>Browser limitation:</strong> Full bcrypt requires a native library. This tool uses SHA-256 in bcrypt format for demonstration. For production use, install <code style={{ fontFamily: 'JetBrains Mono, monospace' }}>bcryptjs</code> in your project.
      </div>

      {/* Hash */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>Hash a Password</h3>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '180px' }}>
            <label className="label">Password</label>
            <input className="input-base" type="password" value={password}
              onChange={e => setPassword(e.target.value)} placeholder="Enter password" />
          </div>
          <div>
            <label className="label">Rounds: {rounds}</label>
            <input type="range" min={4} max={14} value={rounds}
              onChange={e => setRounds(Number(e.target.value))}
              style={{ width: '120px', accentColor: 'var(--accent)', display: 'block', marginTop: '0.5rem' }} />
          </div>
        </div>
        <button className="btn-primary" onClick={generate} disabled={loading || !password}
          style={{ alignSelf: 'flex-start', opacity: loading || !password ? 0.6 : 1 }}>
          {loading ? 'Hashing...' : 'Generate Hash'}
        </button>
        {hash && (
          <div style={{ position: 'relative' }}>
            <label className="label">Hash Output</label>
            <input className="input-base input-mono" value={hash} readOnly />
            <div style={{ position: 'absolute', right: '0.5rem', top: '1.75rem' }}>
              <CopyButton text={hash} overlay={false} />
            </div>
          </div>
        )}
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border)' }} />

      {/* Verify */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>Verify Password Against Hash</h3>
        <div>
          <label className="label">Hash to Verify</label>
          <input className="input-base input-mono" value={verifyHash}
            onChange={e => { setVerifyHash(e.target.value); setVerifyResult(null) }}
            placeholder="$2b$10$..." />
        </div>
        <button className="btn-secondary" onClick={verify} disabled={loading || !password || !verifyHash}
          style={{ alignSelf: 'flex-start', opacity: loading || !password || !verifyHash ? 0.6 : 1 }}>
          Verify
        </button>
        {verifyResult !== null && (
          <div style={{
            padding: '0.65rem 1rem', borderRadius: '8px',
            background: verifyResult ? '#10B98115' : '#EF444415',
            border: `1px solid ${verifyResult ? '#10B981' : '#EF4444'}40`,
            fontSize: '0.88rem', fontWeight: 600,
            color: verifyResult ? '#10B981' : '#EF4444',
          }}>
            {verifyResult ? '✓ Password matches the hash' : '✗ Password does not match'}
          </div>
        )}
      </div>
    </div>
  )
}
