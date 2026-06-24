'use client'
import { useState } from 'react'
import CopyButton from '../ui/CopyButton'

function hexToRgb(hex: string): [number, number, number] | null {
  const clean = hex.replace('#', '')
  if (clean.length !== 6) return null
  const r = parseInt(clean.slice(0, 2), 16)
  const g = parseInt(clean.slice(2, 4), 16)
  const b = parseInt(clean.slice(4, 6), 16)
  if (isNaN(r) || isNaN(g) || isNaN(b)) return null
  return [r, g, b]
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  const rn = r / 255, gn = g / 255, bn = b / 255
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn)
  const l = (max + min) / 2
  if (max === min) return [0, 0, Math.round(l * 100)]
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h = 0
  if (max === rn) h = (gn - bn) / d + (gn < bn ? 6 : 0)
  else if (max === gn) h = (bn - rn) / d + 2
  else h = (rn - gn) / d + 4
  return [Math.round(h * 60), Math.round(s * 100), Math.round(l * 100)]
}

function componentToHex(c: number) {
  return c.toString(16).padStart(2, '0')
}

function rgbToHex(r: number, g: number, b: number) {
  return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b)
}

export default function ColorConverter() {
  const [hex, setHex] = useState('#00D4AA')
  const [pickerHex, setPickerHex] = useState('#00D4AA')

  const syncFromHex = (value: string) => {
    setHex(value)
    const full = value.startsWith('#') ? value : '#' + value
    if (/^#[0-9a-fA-F]{6}$/.test(full)) setPickerHex(full)
  }

  const syncFromPicker = (value: string) => {
    setPickerHex(value)
    setHex(value)
  }

  const cleanHex = hex.startsWith('#') ? hex : '#' + hex
  const rgb = hexToRgb(cleanHex)
  const hsl = rgb ? rgbToHsl(...rgb) : null
  const isValid = rgb !== null

  const rows: { label: string; value: string }[] = isValid && rgb && hsl ? [
    { label: 'HEX', value: cleanHex.toUpperCase() },
    { label: 'RGB', value: `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})` },
    { label: 'RGB (values)', value: `${rgb[0]}, ${rgb[1]}, ${rgb[2]}` },
    { label: 'HSL', value: `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)` },
    { label: 'CSS background', value: `background: ${cleanHex.toUpperCase()};` },
    { label: 'Tailwind approx.', value: `(use closest Tailwind color)` },
  ] : []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Color input */}
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <label className="label">HEX Color</label>
          <input
            className="input-base input-mono"
            value={hex}
            onChange={e => syncFromHex(e.target.value)}
            placeholder="#00D4AA"
          />
        </div>
        <div>
          <label className="label">Picker</label>
          <input
            type="color"
            value={pickerHex}
            onChange={e => syncFromPicker(e.target.value)}
            style={{
              width: '48px',
              height: '42px',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              padding: '2px',
              cursor: 'pointer',
              background: 'var(--bg-tertiary)',
            }}
          />
        </div>
      </div>

      {/* Preview swatch */}
      {isValid && (
        <div style={{
          height: '80px',
          borderRadius: '10px',
          background: cleanHex,
          border: '1px solid var(--border)',
          transition: 'background 0.15s ease',
        }} />
      )}

      {/* Conversion results */}
      {!isValid && hex.length > 1 && (
        <p style={{ color: '#EF4444', fontSize: '0.82rem' }}>⚠ Invalid hex color. Use format #RRGGBB</p>
      )}

      {isValid && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {rows.map(({ label, value }) => (
            <div key={label} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.6rem 0.875rem',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
            }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-text)', minWidth: '110px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {label}
              </span>
              <code style={{ flex: 1, fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                {value}
              </code>
              {!value.includes('closest') && <CopyButton text={value} overlay={false} />}
            </div>
          ))}
        </div>
      )}

      {/* RGB sliders */}
      {isValid && rgb && (
        <div>
          <label className="label">RGB Sliders</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {(['R', 'G', 'B'] as const).map((channel, i) => {
              const colors = ['#EF4444', '#22C55E', '#3B82F6']
              return (
                <div key={channel} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem', fontWeight: 700, color: colors[i], minWidth: '14px' }}>{channel}</span>
                  <input
                    type="range" min={0} max={255} value={rgb[i]}
                    onChange={e => {
                      const newRgb: [number, number, number] = [...rgb] as [number, number, number]
                      newRgb[i] = Number(e.target.value)
                      const newHex = rgbToHex(...newRgb)
                      setHex(newHex)
                      setPickerHex(newHex)
                    }}
                    style={{ flex: 1, accentColor: colors[i] }}
                  />
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem', color: 'var(--text-secondary)', minWidth: '28px', textAlign: 'right' }}>
                    {rgb[i]}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
