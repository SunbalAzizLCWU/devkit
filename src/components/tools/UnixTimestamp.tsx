'use client'
import { useState } from 'react'
import CopyButton from '../ui/CopyButton'

function toDate(unix: string): Date | null {
  const ts = parseInt(unix)
  if (isNaN(ts)) return null
  return new Date(ts < 1e12 ? ts * 1000 : ts)
}

export default function UnixTimestamp() {
  const [unix, setUnix] = useState('')
  const [human, setHuman] = useState('')

  const handleToHuman = () => {
    const d = toDate(unix)
    if (d && !isNaN(d.getTime())) setHuman(d.toISOString())
  }

  const handleToUnix = () => {
    const d = new Date(human)
    if (!isNaN(d.getTime())) setUnix(String(Math.floor(d.getTime() / 1000)))
  }

  const useNow = () => {
    const now = new Date()
    setUnix(String(Math.floor(now.getTime() / 1000)))
    setHuman(now.toISOString())
  }

  const parsed = toDate(unix)
  const isValid = parsed !== null && !isNaN(parsed.getTime())

  const Row = ({ label, value }: { label: string; value: string }) => (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0.65rem 0.875rem',
      background: 'var(--bg-tertiary)',
      borderRadius: '8px',
      border: '1px solid var(--border)',
      gap: '0.5rem',
    }}>
      <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', minWidth: '140px', flexShrink: 0 }}>
        {label}
      </span>
      <code style={{ flex: 1, fontFamily: 'JetBrains Mono, monospace', fontSize: '0.82rem', color: 'var(--text-primary)', wordBreak: 'break-all' }}>
        {value}
      </code>
      <div style={{ flexShrink: 0 }}>
        <CopyButton text={value} />
      </div>
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <label className="label">Unix Timestamp</label>
          <input
            className="input-base input-mono"
            value={unix}
            onChange={e => setUnix(e.target.value)}
            placeholder="1700000000"
          />
        </div>
        <button className="btn-primary" onClick={handleToHuman} style={{ alignSelf: 'flex-end' }}>
          → Human
        </button>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <label className="label">ISO / Human Date</label>
          <input
            className="input-base input-mono"
            value={human}
            onChange={e => setHuman(e.target.value)}
            placeholder="2024-11-14T22:13:20.000Z"
          />
        </div>
        <button className="btn-primary" onClick={handleToUnix} style={{ alignSelf: 'flex-end' }}>
          → Unix
        </button>
      </div>

      <button className="btn-secondary" onClick={useNow} style={{ alignSelf: 'flex-start' }}>
        Use current time
      </button>

      {isValid && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <Row label="ISO 8601" value={parsed.toISOString()} />
          <Row label="UTC" value={parsed.toUTCString()} />
          <Row label="Local" value={parsed.toLocaleString()} />
          <Row label="Unix (seconds)" value={String(Math.floor(parsed.getTime() / 1000))} />
          <Row label="Unix (ms)" value={String(parsed.getTime())} />
        </div>
      )}
    </div>
  )
}
