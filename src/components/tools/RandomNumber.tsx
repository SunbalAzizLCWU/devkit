'use client'
import { useState } from 'react'
import CopyButton from '../ui/CopyButton'

export default function RandomNumber() {
  const [min, setMin] = useState('1')
  const [max, setMax] = useState('100')
  const [count, setCount] = useState(1)
  const [unique, setUnique] = useState(false)
  const [decimals, setDecimals] = useState(0)
  const [results, setResults] = useState<number[]>([])

  const generate = () => {
    const lo = parseFloat(min), hi = parseFloat(max)
    if (isNaN(lo) || isNaN(hi) || lo >= hi) return
    const nums: number[] = []
    const used = new Set<number>()
    let attempts = 0

    while (nums.length < count && attempts < 10000) {
      attempts++
      const raw = lo + Math.random() * (hi - lo)
      const val = parseFloat(raw.toFixed(decimals))
      if (unique && used.has(val)) continue
      used.add(val)
      nums.push(val)
    }
    setResults(nums)
  }

  const lo = parseFloat(min), hi = parseFloat(max)
  const rangeOk = !isNaN(lo) && !isNaN(hi) && lo < hi

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.75rem' }}>
        {[
          { label: 'Min', value: min, set: setMin },
          { label: 'Max', value: max, set: setMax },
        ].map(({ label, value, set }) => (
          <div key={label}>
            <label className="label">{label}</label>
            <input className="input-base input-mono" type="number" value={value}
              onChange={e => set(e.target.value)} />
          </div>
        ))}
        <div>
          <label className="label">Count</label>
          <input className="input-base" type="number" min={1} max={1000} value={count}
            onChange={e => setCount(Math.max(1, Math.min(1000, Number(e.target.value))))} />
        </div>
        <div>
          <label className="label">Decimal places</label>
          <input className="input-base" type="number" min={0} max={10} value={decimals}
            onChange={e => setDecimals(Math.max(0, Math.min(10, Number(e.target.value))))} />
        </div>
      </div>

      <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
        <input type="checkbox" checked={unique} onChange={e => setUnique(e.target.checked)}
          style={{ accentColor: 'var(--accent)', width: '14px', height: '14px' }} />
        Unique numbers only
      </label>

      <button className="btn-primary" onClick={generate} disabled={!rangeOk}
        style={{ alignSelf: 'flex-start', opacity: !rangeOk ? 0.5 : 1 }}>
        Generate
      </button>

      {!rangeOk && min && max && (
        <p style={{ color: '#EF4444', fontSize: '0.8rem' }}>⚠ Min must be less than Max</p>
      )}

      {results.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {results.length === 1 ? (
            <div style={{
              background: 'var(--accent-subtle)', border: '1px solid var(--accent)',
              borderRadius: '14px', padding: '2rem', textAlign: 'center',
            }}>
              <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--accent)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '-0.02em' }}>
                {results[0]}
              </div>
              <CopyButton text={String(results[0])} overlay={false} />
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="label" style={{ margin: 0 }}>{results.length} numbers generated</label>
                <CopyButton text={results.join('\n')} overlay={false} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '0.35rem', maxHeight: '300px', overflowY: 'auto' }}>
                {results.map((n, i) => (
                  <div key={i} style={{
                    background: 'var(--bg-tertiary)', border: '1px solid var(--border)',
                    borderRadius: '7px', padding: '0.45rem 0.75rem', textAlign: 'center',
                    fontFamily: 'JetBrains Mono, monospace', fontSize: '0.88rem',
                    color: 'var(--text-primary)', fontWeight: 500,
                  }}>{n}</div>
                ))}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Sum: {results.reduce((a, b) => a + b, 0).toFixed(decimals)} · 
                Avg: {(results.reduce((a, b) => a + b, 0) / results.length).toFixed(decimals)} · 
                Min: {Math.min(...results)} · Max: {Math.max(...results)}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
