'use client'
import { useState } from 'react'

function Result({ label, value }: { label: string; value: string }) {
  return (
    <div style={{
      background: 'var(--accent-subtle)', border: '1px solid var(--accent)',
      borderRadius: '10px', padding: '1rem', textAlign: 'center',
    }}>
      <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-text)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem' }}>{label}</div>
      <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent)', letterSpacing: '-0.02em' }}>{value}</div>
    </div>
  )
}

function Num({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div style={{ flex: 1, minWidth: '120px' }}>
      <label className="label">{label}</label>
      <input className="input-base" type="number" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  )
}

export default function PercentageCalc() {
  const [mode, setMode] = useState<'percent-of' | 'what-percent' | 'percent-change'>('percent-of')
  const [a, setA] = useState('')
  const [b, setB] = useState('')

  const na = parseFloat(a), nb = parseFloat(b)

  const result = (() => {
    if (isNaN(na) || isNaN(nb)) return null
    switch (mode) {
      case 'percent-of':     return { label: `${na}% of ${nb}`, value: ((na / 100) * nb).toFixed(4).replace(/\.?0+$/, '') }
      case 'what-percent':   return { label: `${na} is what % of ${nb}`, value: ((na / nb) * 100).toFixed(4).replace(/\.?0+$/, '') + '%' }
      case 'percent-change': return {
        label: `% change from ${na} to ${nb}`,
        value: (((nb - na) / Math.abs(na)) * 100).toFixed(2) + '%',
      }
    }
  })()

  const MODES = [
    { id: 'percent-of'     as const, label: '% of Number',     desc: 'What is X% of Y?' },
    { id: 'what-percent'   as const, label: 'What Percent?',   desc: 'X is what % of Y?' },
    { id: 'percent-change' as const, label: '% Change',        desc: '% change from X to Y' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
        {MODES.map(m => (
          <button key={m.id} onClick={() => setMode(m.id)} style={{
            padding: '0.65rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border)',
            background: mode === m.id ? 'var(--accent)' : 'var(--bg-tertiary)',
            color: mode === m.id ? '#fff' : 'var(--text-secondary)',
            cursor: 'pointer', textAlign: 'center',
          }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>{m.label}</div>
            <div style={{ fontSize: '0.7rem', opacity: 0.8, marginTop: '0.15rem' }}>{m.desc}</div>
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
        {mode === 'percent-of'     && <><Num label="Percentage (%)" value={a} onChange={setA} placeholder="25" /><Num label="of Number" value={b} onChange={setB} placeholder="200" /></>}
        {mode === 'what-percent'   && <><Num label="Value" value={a} onChange={setA} placeholder="50" /><Num label="out of" value={b} onChange={setB} placeholder="200" /></>}
        {mode === 'percent-change' && <><Num label="From" value={a} onChange={setA} placeholder="100" /><Num label="To" value={b} onChange={setB} placeholder="125" /></>}
      </div>

      {result && <Result label={result.label} value={result.value} />}

      {/* Quick reference */}
      <div>
        <label className="label">Quick Reference</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.4rem' }}>
          {[10,15,20,25,33.33,50,75,100].map(pct => {
            const val = nb ? ((pct / 100) * nb).toFixed(2) : '—'
            return (
              <div key={pct} style={{
                background: 'var(--bg-tertiary)', border: '1px solid var(--border)',
                borderRadius: '7px', padding: '0.5rem 0.75rem', textAlign: 'center',
              }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{pct}%</div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '0.15rem' }}>{val}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
