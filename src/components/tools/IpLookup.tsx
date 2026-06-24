'use client'
import { useState } from 'react'

interface IpData {
  ip: string
  city?: string
  region?: string
  country_name?: string
  postal?: string
  latitude?: number
  longitude?: number
  timezone?: string
  org?: string
  asn?: string
}

export default function IpLookup() {
  const [input, setInput] = useState('')
  const [data, setData] = useState<IpData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const lookup = async (target?: string) => {
    const ip = target ?? input.trim()
    setLoading(true)
    setError('')
    setData(null)
    try {
      const res = await fetch(`https://ipapi.co/${ip ? ip + '/' : ''}json/`)
      if (!res.ok) throw new Error(`Request failed: ${res.status}`)
      const json = await res.json()
      if (json.error) throw new Error(json.reason || 'Invalid IP address')
      setData(json)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Lookup failed. Please try again.')
    }
    setLoading(false)
  }

  const Field = ({ icon, label, value }: { icon: string; label: string; value: string | undefined }) =>
    value ? (
      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
        padding: '0.65rem 0.875rem', background: 'var(--bg-tertiary)',
        border: '1px solid var(--border)', borderRadius: '8px',
      }}>
        <span style={{ fontSize: '1rem', minWidth: '24px' }}>{icon}</span>
        <div>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 500, marginTop: '0.1rem' }}>{value}</div>
        </div>
      </div>
    ) : null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <label className="label">IP Address (leave blank for your IP)</label>
          <input className="input-base input-mono" value={input} onChange={e => setInput(e.target.value)}
            placeholder="8.8.8.8" onKeyDown={e => e.key === 'Enter' && lookup()} />
        </div>
        <button className="btn-primary" onClick={() => lookup()} disabled={loading} style={{ alignSelf: 'flex-end', opacity: loading ? 0.6 : 1 }}>
          {loading ? 'Looking up...' : 'Lookup'}
        </button>
        <button className="btn-secondary" onClick={() => lookup('')} disabled={loading} style={{ alignSelf: 'flex-end' }}>
          My IP
        </button>
      </div>

      {error && <p style={{ color: '#EF4444', fontSize: '0.85rem' }}>⚠ {error}</p>}

      {data && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', animation: 'fadeIn 0.2s ease-out' }}>
          {/* IP badge */}
          <div style={{
            background: 'var(--accent-subtle)', border: '1px solid var(--accent)',
            borderRadius: '10px', padding: '0.875rem 1rem',
            display: 'flex', alignItems: 'center', gap: '0.75rem',
          }}>
            <span style={{ fontSize: '1.5rem' }}>📡</span>
            <div>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent-text)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>IP Address</div>
              <div style={{ fontSize: '1.2rem', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: 'var(--accent-text)' }}>{data.ip}</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <Field icon="🏙" label="City" value={data.city} />
            <Field icon="🗺" label="Region" value={data.region} />
            <Field icon="🌍" label="Country" value={data.country_name} />
            <Field icon="📮" label="Postal Code" value={data.postal} />
            <Field icon="🕐" label="Timezone" value={data.timezone} />
            <Field icon="🏢" label="Organization" value={data.org} />
            <Field icon="📍" label="Latitude" value={data.latitude?.toString()} />
            <Field icon="📍" label="Longitude" value={data.longitude?.toString()} />
          </div>

          {data.latitude && data.longitude && (
            <a
              href={`https://www.openstreetmap.org/?mlat=${data.latitude}&mlon=${data.longitude}&zoom=10`}
              target="_blank" rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                color: 'var(--accent-text)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 500,
              }}
            >
              🗺 View on map →
            </a>
          )}
        </div>
      )}
    </div>
  )
}
