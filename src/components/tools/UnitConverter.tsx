'use client'
import { useState } from 'react'

type Category = 'Length' | 'Weight' | 'Temperature' | 'Volume' | 'Area' | 'Speed'

const UNITS: Record<Category, { label: string; toBase: (v: number) => number; fromBase: (v: number) => number }[]> = {
  Length: [
    { label: 'Millimeter (mm)',  toBase: v => v / 1000,     fromBase: v => v * 1000 },
    { label: 'Centimeter (cm)',  toBase: v => v / 100,      fromBase: v => v * 100 },
    { label: 'Meter (m)',        toBase: v => v,             fromBase: v => v },
    { label: 'Kilometer (km)',   toBase: v => v * 1000,     fromBase: v => v / 1000 },
    { label: 'Inch (in)',        toBase: v => v * 0.0254,   fromBase: v => v / 0.0254 },
    { label: 'Foot (ft)',        toBase: v => v * 0.3048,   fromBase: v => v / 0.3048 },
    { label: 'Yard (yd)',        toBase: v => v * 0.9144,   fromBase: v => v / 0.9144 },
    { label: 'Mile (mi)',        toBase: v => v * 1609.344, fromBase: v => v / 1609.344 },
  ],
  Weight: [
    { label: 'Milligram (mg)',  toBase: v => v / 1e6,   fromBase: v => v * 1e6 },
    { label: 'Gram (g)',        toBase: v => v / 1000,  fromBase: v => v * 1000 },
    { label: 'Kilogram (kg)',   toBase: v => v,         fromBase: v => v },
    { label: 'Metric ton (t)',  toBase: v => v * 1000,  fromBase: v => v / 1000 },
    { label: 'Ounce (oz)',      toBase: v => v * 0.02835, fromBase: v => v / 0.02835 },
    { label: 'Pound (lb)',      toBase: v => v * 0.4536, fromBase: v => v / 0.4536 },
    { label: 'Stone (st)',      toBase: v => v * 6.35,  fromBase: v => v / 6.35 },
  ],
  Temperature: [
    { label: 'Celsius (°C)',    toBase: v => v,                         fromBase: v => v },
    { label: 'Fahrenheit (°F)', toBase: v => (v - 32) * 5/9,           fromBase: v => v * 9/5 + 32 },
    { label: 'Kelvin (K)',      toBase: v => v - 273.15,                fromBase: v => v + 273.15 },
    { label: 'Rankine (°R)',    toBase: v => (v - 491.67) * 5/9,       fromBase: v => (v + 273.15) * 9/5 },
  ],
  Volume: [
    { label: 'Milliliter (ml)', toBase: v => v / 1000,  fromBase: v => v * 1000 },
    { label: 'Liter (L)',       toBase: v => v,          fromBase: v => v },
    { label: 'Cubic meter (m³)',toBase: v => v * 1000,  fromBase: v => v / 1000 },
    { label: 'Teaspoon (tsp)',  toBase: v => v * 0.00493, fromBase: v => v / 0.00493 },
    { label: 'Tablespoon (tbsp)',toBase: v => v * 0.01479, fromBase: v => v / 0.01479 },
    { label: 'Cup (US)',        toBase: v => v * 0.2366, fromBase: v => v / 0.2366 },
    { label: 'Pint (US)',       toBase: v => v * 0.4732, fromBase: v => v / 0.4732 },
    { label: 'Gallon (US)',     toBase: v => v * 3.7854, fromBase: v => v / 3.7854 },
    { label: 'Fluid oz (US)',   toBase: v => v * 0.02957, fromBase: v => v / 0.02957 },
  ],
  Area: [
    { label: 'Sq mm (mm²)',   toBase: v => v / 1e6,      fromBase: v => v * 1e6 },
    { label: 'Sq cm (cm²)',   toBase: v => v / 1e4,      fromBase: v => v * 1e4 },
    { label: 'Sq meter (m²)', toBase: v => v,             fromBase: v => v },
    { label: 'Sq km (km²)',   toBase: v => v * 1e6,      fromBase: v => v / 1e6 },
    { label: 'Sq inch (in²)', toBase: v => v * 0.000645, fromBase: v => v / 0.000645 },
    { label: 'Sq foot (ft²)', toBase: v => v * 0.0929,   fromBase: v => v / 0.0929 },
    { label: 'Acre',          toBase: v => v * 4046.86,  fromBase: v => v / 4046.86 },
    { label: 'Hectare (ha)',  toBase: v => v * 10000,    fromBase: v => v / 10000 },
  ],
  Speed: [
    { label: 'm/s',           toBase: v => v,          fromBase: v => v },
    { label: 'km/h',          toBase: v => v / 3.6,    fromBase: v => v * 3.6 },
    { label: 'mph',           toBase: v => v * 0.44704, fromBase: v => v / 0.44704 },
    { label: 'knot',          toBase: v => v * 0.51444, fromBase: v => v / 0.51444 },
    { label: 'ft/s',          toBase: v => v * 0.3048,  fromBase: v => v / 0.3048 },
  ],
}

const CATEGORIES = Object.keys(UNITS) as Category[]

function fmt(n: number): string {
  if (!isFinite(n)) return '—'
  if (Math.abs(n) >= 1e6 || (Math.abs(n) < 0.0001 && n !== 0)) return n.toExponential(4)
  return parseFloat(n.toPrecision(8)).toString()
}

export default function UnitConverter() {
  const [category, setCategory] = useState<Category>('Length')
  const [value, setValue] = useState('1')
  const [fromIdx, setFromIdx] = useState(2)

  const units = UNITS[category]
  const numVal = parseFloat(value)

  const converted = isNaN(numVal)
    ? []
    : units.map(u => fmt(u.fromBase(units[fromIdx].toBase(numVal))))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Category */}
      <div>
        <label className="label">Category</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => { setCategory(c); setFromIdx(0) }} style={{
              padding: '0.35rem 0.85rem', borderRadius: '100px',
              border: '1px solid var(--border)',
              background: category === c ? 'var(--accent)' : 'var(--bg-tertiary)',
              color: category === c ? '#fff' : 'var(--text-secondary)',
              fontSize: '0.82rem', fontWeight: 500, cursor: 'pointer',
            }}>{c}</button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '140px' }}>
          <label className="label">Value</label>
          <input className="input-base input-mono" type="number" value={value}
            onChange={e => setValue(e.target.value)} placeholder="1" />
        </div>
        <div style={{ flex: 2, minWidth: '200px' }}>
          <label className="label">From</label>
          <select className="input-base" value={fromIdx}
            onChange={e => setFromIdx(Number(e.target.value))}
            style={{ cursor: 'pointer' }}>
            {units.map((u, i) => <option key={u.label} value={i}>{u.label}</option>)}
          </select>
        </div>
      </div>

      {/* Results */}
      {!isNaN(numVal) && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          {units.map((u, i) => (
            <div key={u.label} style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.6rem 0.875rem',
              background: i === fromIdx ? 'var(--accent-subtle)' : 'var(--bg-tertiary)',
              border: `1px solid ${i === fromIdx ? 'var(--accent)' : 'var(--border)'}`,
              borderRadius: '8px',
            }}>
              <span style={{
                fontSize: '0.78rem', fontWeight: 600, color: i === fromIdx ? 'var(--accent-text)' : 'var(--text-secondary)',
                minWidth: '160px',
              }}>{u.label}</span>
              <code style={{
                flex: 1, fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: i === fromIdx ? 700 : 400,
              }}>{converted[i]}</code>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
