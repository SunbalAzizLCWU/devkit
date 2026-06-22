'use client'
import { useState, useEffect, useRef } from 'react'

export default function QrGenerator() {
  const [input, setInput] = useState('https://example.com')
  const [size, setSize] = useState(200)
  const [type, setType] = useState<'url' | 'text' | 'email' | 'phone'>('url')
  const imgRef = useRef<HTMLImageElement>(null)

  const prefixes: Record<string, string> = {
    url: '',
    text: '',
    email: 'mailto:',
    phone: 'tel:',
  }

  const qrValue = encodeURIComponent(prefixes[type] + input)
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${qrValue}&color=0F172A&bgcolor=F8FAFC`

  const download = () => {
    const link = document.createElement('a')
    link.href = qrUrl
    link.download = 'qrcode.png'
    link.click()
  }

  const placeholders: Record<string, string> = {
    url: 'https://your-website.com',
    text: 'Enter any text...',
    email: 'you@example.com',
    phone: '+1 234 567 8900',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div>
        <label className="label">Type</label>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {(['url', 'text', 'email', 'phone'] as const).map(t => (
            <button key={t} onClick={() => setType(t)} style={{
              padding: '0.35rem 0.85rem',
              borderRadius: '6px',
              border: '1px solid var(--border)',
              background: type === t ? 'var(--accent)' : 'var(--bg-tertiary)',
              color: type === t ? '#fff' : 'var(--text-secondary)',
              fontSize: '0.82rem',
              fontWeight: 500,
              cursor: 'pointer',
              textTransform: 'capitalize',
            }}>{t}</button>
          ))}
        </div>
      </div>

      <div>
        <label className="label">{type === 'url' ? 'URL' : type === 'email' ? 'Email Address' : type === 'phone' ? 'Phone Number' : 'Text'}</label>
        <input
          className="input-base"
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={placeholders[type]}
        />
      </div>

      <div>
        <label className="label">Size: {size}×{size}px</label>
        <input type="range" min={100} max={400} step={50} value={size}
          onChange={e => setSize(+e.target.value)}
          style={{ width: '100%', accentColor: 'var(--accent)' }}
        />
      </div>

      {input && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            background: '#fff',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '1rem',
            display: 'inline-block',
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img ref={imgRef} src={qrUrl} alt="QR Code" width={size} height={size} />
          </div>
          <button className="btn-primary" onClick={download}>Download PNG</button>
        </div>
      )}
    </div>
  )
}
