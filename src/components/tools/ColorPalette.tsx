'use client'
import { useState } from 'react'
import CopyButton from '../ui/CopyButton'

function hexToHsl(hex: string): [number, number, number] | null {
  const c = hex.replace('#','')
  if (c.length !== 6) return null
  const r = parseInt(c.slice(0,2),16)/255, g = parseInt(c.slice(2,4),16)/255, b = parseInt(c.slice(4,6),16)/255
  const max = Math.max(r,g,b), min = Math.min(r,g,b)
  const l = (max+min)/2
  if (max === min) return [0, 0, Math.round(l*100)]
  const d = max-min
  const s = l > 0.5 ? d/(2-max-min) : d/(max+min)
  let h = max===r ? (g-b)/d+(g<b?6:0) : max===g ? (b-r)/d+2 : (r-g)/d+4
  return [Math.round(h*60), Math.round(s*100), Math.round(l*100)]
}

function hslToHex(h: number, s: number, l: number): string {
  const sl = s/100, ll = l/100
  const a = sl * Math.min(ll, 1-ll)
  const f = (n: number) => {
    const k = (n + h/30) % 12
    const color = ll - a*Math.max(Math.min(k-3,9-k,1),-1)
    return Math.round(255*color).toString(16).padStart(2,'0')
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

function generatePalette(hex: string): { name: string; color: string }[] {
  const hsl = hexToHsl(hex)
  if (!hsl) return []
  const [h, s] = hsl
  return [
    { name: '50',  color: hslToHex(h, Math.min(s,50), 95) },
    { name: '100', color: hslToHex(h, Math.min(s,60), 90) },
    { name: '200', color: hslToHex(h, Math.min(s,70), 80) },
    { name: '300', color: hslToHex(h, s, 70) },
    { name: '400', color: hslToHex(h, s, 60) },
    { name: '500', color: hex },
    { name: '600', color: hslToHex(h, s, 40) },
    { name: '700', color: hslToHex(h, s, 30) },
    { name: '800', color: hslToHex(h, s, 22) },
    { name: '900', color: hslToHex(h, Math.min(s,60), 14) },
    { name: '950', color: hslToHex(h, Math.min(s,50), 8) },
  ]
}

function isLight(hex: string): boolean {
  const c = hex.replace('#','')
  const r = parseInt(c.slice(0,2),16), g = parseInt(c.slice(2,4),16), b = parseInt(c.slice(4,6),16)
  return (r*299 + g*587 + b*114) / 1000 > 128
}

export default function ColorPalette() {
  const [base, setBase] = useState('#00D4AA')
  const palette = generatePalette(base)

  const cssVars = palette.map(({name, color}) => `  --color-${name}: ${color.toUpperCase()};`).join('\n')
  const tailwindConfig = `{\n${palette.map(({name, color}) => `  '${name}': '${color.toUpperCase()}'`).join(',\n')}\n}`

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '160px' }}>
          <label className="label">Base Color (500)</label>
          <input className="input-base input-mono" value={base} onChange={e => setBase(e.target.value)} placeholder="#00D4AA" />
        </div>
        <input type="color" value={base.length === 7 ? base : '#000000'}
          onChange={e => setBase(e.target.value)}
          style={{ width: '48px', height: '42px', border: '1px solid var(--border)', borderRadius: '8px', padding: '2px', cursor: 'pointer', background: 'var(--bg-tertiary)' }} />
      </div>

      {palette.length > 0 && (
        <>
          {/* Palette swatches */}
          <div style={{ display: 'flex', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border)' }}>
            {palette.map(({name, color}) => (
              <div key={name} style={{ flex: 1, background: color, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', padding: '0.75rem 0.25rem', gap: '0.15rem', minHeight: '80px', cursor: 'pointer', transition: 'flex 0.15s ease' }}
                onClick={() => navigator.clipboard.writeText(color.toUpperCase())}
                title={`Click to copy ${color.toUpperCase()}`}>
                <span style={{ fontSize: '0.6rem', fontWeight: 700, color: isLight(color) ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.7)', fontFamily: 'JetBrains Mono, monospace' }}>{name}</span>
              </div>
            ))}
          </div>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '-0.75rem' }}>Click any swatch to copy its hex code</p>

          {/* Hex values */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {palette.map(({name, color}) => (
              <div key={name} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0.75rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: '7px' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '5px', background: color, border: '1px solid var(--border)', flexShrink: 0 }} />
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', minWidth: '36px' }}>{name}</span>
                <code style={{ flex: 1, fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem', color: 'var(--text-primary)' }}>{color.toUpperCase()}</code>
                <CopyButton text={color.toUpperCase()} overlay={false} />
              </div>
            ))}
          </div>

          {/* Export */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <label className="label" style={{ margin: 0 }}>CSS Variables</label>
                <CopyButton text={`:root {\n${cssVars}\n}`} overlay={false} />
              </div>
              <pre style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: '8px', padding: '0.75rem', fontSize: '0.72rem', fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-primary)', overflow: 'auto', lineHeight: 1.6 }}>
                {`:root {\n${cssVars}\n}`}
              </pre>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <label className="label" style={{ margin: 0 }}>Tailwind Config</label>
                <CopyButton text={tailwindConfig} overlay={false} />
              </div>
              <pre style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: '8px', padding: '0.75rem', fontSize: '0.72rem', fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-primary)', overflow: 'auto', lineHeight: 1.6 }}>
                {tailwindConfig}
              </pre>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
