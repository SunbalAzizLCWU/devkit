'use client'
import { useState } from 'react'
import CopyButton from '../ui/CopyButton'

function csvToJson(csv: string): string {
  const lines = csv.trim().split('\n').filter(Boolean)
  if (lines.length < 2) throw new Error('CSV must have a header row and at least one data row.')
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''))
  const rows = lines.slice(1).map(line => {
    const vals = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''))
    const obj: Record<string, string | number> = {}
    headers.forEach((h, i) => {
      const v = vals[i] ?? ''
      obj[h] = isNaN(Number(v)) || v === '' ? v : Number(v)
    })
    return obj
  })
  return JSON.stringify(rows, null, 2)
}

function jsonToCsv(json: string): string {
  const data = JSON.parse(json)
  if (!Array.isArray(data) || data.length === 0) throw new Error('JSON must be a non-empty array of objects.')
  const headers = Object.keys(data[0])
  const rows = data.map((row: Record<string, unknown>) =>
    headers.map(h => {
      const v = String(row[h] ?? '')
      return v.includes(',') || v.includes('"') ? `"${v.replace(/"/g, '""')}"` : v
    }).join(',')
  )
  return [headers.join(','), ...rows].join('\n')
}

export default function CsvJson() {
  const [input, setInput] = useState('')
  const [mode, setMode] = useState<'csv-to-json' | 'json-to-csv'>('csv-to-json')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')

  const convert = () => {
    setError('')
    try {
      setOutput(mode === 'csv-to-json' ? csvToJson(input) : jsonToCsv(input))
    } catch (e: unknown) {
      setError((e as Error).message)
      setOutput('')
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        {([['csv-to-json', 'CSV → JSON'], ['json-to-csv', 'JSON → CSV']] as const).map(([val, label]) => (
          <button key={val} onClick={() => { setMode(val); setOutput(''); setError('') }} style={{
            padding: '0.4rem 1rem', borderRadius: '6px', border: '1px solid var(--border)',
            background: mode === val ? 'var(--accent)' : 'var(--bg-tertiary)',
            color: mode === val ? '#fff' : 'var(--text-secondary)',
            fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer',
          }}>{label}</button>
        ))}
        <button className="btn-primary" onClick={convert}>Convert</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label className="label">{mode === 'csv-to-json' ? 'CSV Input' : 'JSON Input'}</label>
          <textarea className="input-base input-mono" rows={14} value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={mode === 'csv-to-json'
              ? 'name,age,city\nAlice,30,NYC\nBob,25,LA'
              : '[{"name":"Alice","age":30}]'}
            style={{ resize: 'vertical' }} />
        </div>
        <div>
          <label className="label">{mode === 'csv-to-json' ? 'JSON Output' : 'CSV Output'}</label>
          <div style={{ position: 'relative' }}>
            <textarea className="input-base input-mono" rows={14}
              value={error || output} readOnly
              style={{ resize: 'vertical', color: error ? '#EF4444' : 'var(--text-primary)' }}
              placeholder="Output appears here..." />
            {output && !error && <CopyButton text={output} />}
          </div>
        </div>
      </div>
    </div>
  )
}
