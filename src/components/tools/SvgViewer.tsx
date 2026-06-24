'use client'
import { useState } from 'react'
import CopyButton from '../ui/CopyButton'

const SAMPLE = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="40" fill="#00D4AA" opacity="0.8"/>
  <text x="50" y="55" text-anchor="middle" fill="white" font-size="14" font-weight="bold">SVG</text>
</svg>`

export default function SvgViewer() {
  const [svg, setSvg] = useState(SAMPLE)

  const isSvg = svg.trim().startsWith('<svg')

  // Parse basic SVG info
  const widthMatch = svg.match(/width="([^"]+)"/)
  const heightMatch = svg.match(/height="([^"]+)"/)
  const viewBoxMatch = svg.match(/viewBox="([^"]+)"/)
  const elementCount = (svg.match(/<[a-z]/g) || []).length - 1

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label className="label">SVG Markup</label>
          <div style={{ position: 'relative' }}>
            <textarea className="input-base input-mono" rows={16} value={svg}
              onChange={e => setSvg(e.target.value)}
              placeholder="<svg xmlns=...>...</svg>"
              style={{ resize: 'vertical' }} />
            {svg && <CopyButton text={svg} />}
          </div>
        </div>
        <div>
          <label className="label">Preview</label>
          <div style={{
            background: 'repeating-conic-gradient(var(--bg-tertiary) 0% 25%, var(--bg-secondary) 0% 50%) 0 0 / 16px 16px',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            minHeight: '240px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            overflow: 'hidden',
          }}>
            {isSvg ? (
              <div dangerouslySetInnerHTML={{ __html: svg }} style={{ maxWidth: '100%', maxHeight: '100%' }} />
            ) : (
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                {svg ? '⚠ Not valid SVG markup' : 'Paste SVG markup to preview'}
              </span>
            )}
          </div>
        </div>
      </div>

      {isSvg && (
        <div>
          <label className="label">SVG Info</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.5rem' }}>
            {[
              { label: 'Width', value: widthMatch?.[1] ?? '—' },
              { label: 'Height', value: heightMatch?.[1] ?? '—' },
              { label: 'ViewBox', value: viewBoxMatch?.[1] ?? '—' },
              { label: 'Elements', value: String(elementCount) },
              { label: 'File size', value: `${new Blob([svg]).size} bytes` },
            ].map(({ label, value }) => (
              <div key={label} style={{
                background: 'var(--bg-tertiary)', border: '1px solid var(--border)',
                borderRadius: '8px', padding: '0.65rem 0.875rem', textAlign: 'center',
              }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '0.2rem' }}>{value}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {isSvg && (
        <button
          className="btn-secondary"
          style={{ alignSelf: 'flex-start' }}
          onClick={() => {
            const blob = new Blob([svg], { type: 'image/svg+xml' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url; a.download = 'image.svg'; a.click()
            URL.revokeObjectURL(url)
          }}
        >
          Download SVG
        </button>
      )}
    </div>
  )
}
