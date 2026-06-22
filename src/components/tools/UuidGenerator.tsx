'use client'
import { useState } from 'react'
import { Copy, Check, RefreshCw } from 'lucide-react'

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
}

export default function UuidGenerator() {
  const [count, setCount] = useState(5)
  const [uuids, setUuids] = useState<string[]>(() => Array.from({ length: 5 }, generateUUID))
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [copiedAll, setCopiedAll] = useState(false)

  const regenerate = () => setUuids(Array.from({ length: count }, generateUUID))

  const copyOne = async (uuid: string, i: number) => {
    await navigator.clipboard.writeText(uuid)
    setCopiedIndex(i)
    setTimeout(() => setCopiedIndex(null), 1500)
  }

  const copyAll = async () => {
    await navigator.clipboard.writeText(uuids.join('\n'))
    setCopiedAll(true)
    setTimeout(() => setCopiedAll(false), 1500)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label className="label" style={{ margin: 0 }}>Count</label>
          <input
            type="number"
            min={1}
            max={50}
            value={count}
            onChange={e => setCount(Math.min(50, Math.max(1, +e.target.value)))}
            className="input-base"
            style={{ width: '70px' }}
          />
        </div>
        <button className="btn-primary" onClick={regenerate} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <RefreshCw size={13} /> Generate
        </button>
        <button className="btn-secondary" onClick={copyAll} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          {copiedAll ? <Check size={13} /> : <Copy size={13} />}
          {copiedAll ? 'Copied all!' : 'Copy all'}
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        {uuids.map((uuid, i) => (
          <div key={i} style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            padding: '0.6rem 0.875rem',
          }}>
            <code style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem', color: 'var(--text-primary)', letterSpacing: '0.03em' }}>
              {uuid}
            </code>
            <button
              onClick={() => copyOne(uuid, i)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: copiedIndex === i ? 'var(--accent)' : 'var(--text-muted)',
                padding: '0.2rem',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {copiedIndex === i ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
