'use client'
import { useState } from 'react'
import CopyButton from '../ui/CopyButton'

// Minimal JSON→YAML converter (no external deps)
function jsonToYaml(obj: unknown, indent = 0): string {
  const pad = '  '.repeat(indent)
  if (obj === null) return 'null'
  if (typeof obj === 'boolean') return obj.toString()
  if (typeof obj === 'number') return obj.toString()
  if (typeof obj === 'string') {
    if (obj.includes('\n') || obj.includes(':') || obj.includes('#') || obj.startsWith(' ') || obj === '')
      return `"${obj.replace(/"/g, '\\"')}"`
    return obj
  }
  if (Array.isArray(obj)) {
    if (obj.length === 0) return '[]'
    return obj.map(item => {
      const val = jsonToYaml(item, indent + 1)
      if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
        return `${pad}- ${val.trimStart()}`
      }
      return `${pad}- ${val}`
    }).join('\n')
  }
  if (typeof obj === 'object') {
    const entries = Object.entries(obj as Record<string, unknown>)
    if (entries.length === 0) return '{}'
    return entries.map(([k, v]) => {
      if (typeof v === 'object' && v !== null) {
        const nested = jsonToYaml(v, indent + 1)
        if (Array.isArray(v)) return `${pad}${k}:\n${nested}`
        return `${pad}${k}:\n${nested}`
      }
      return `${pad}${k}: ${jsonToYaml(v, indent + 1)}`
    }).join('\n')
  }
  return String(obj)
}

// Minimal YAML→JSON parser (handles common cases)
function yamlToJson(yaml: string): unknown {
  const lines = yaml.split('\n')
  const stack: { indent: number; obj: unknown }[] = [{ indent: -1, obj: {} }]

  function parseValue(v: string): unknown {
    v = v.trim()
    if (v === 'null' || v === '~') return null
    if (v === 'true') return true
    if (v === 'false') return false
    if (v.startsWith('"') && v.endsWith('"')) return v.slice(1, -1).replace(/\\"/g, '"')
    if (v.startsWith("'") && v.endsWith("'")) return v.slice(1, -1)
    const n = Number(v)
    if (!isNaN(n) && v !== '') return n
    return v
  }

  const root: Record<string, unknown> = {}
  const indentStack: { indent: number; target: Record<string, unknown> | unknown[] }[] = [{ indent: -1, target: root }]

  for (const line of lines) {
    if (!line.trim() || line.trim().startsWith('#')) continue
    const indent = line.search(/\S/)
    const content = line.trim()

    if (content.startsWith('- ')) {
      // list item
      const val = parseValue(content.slice(2))
      const current = indentStack[indentStack.length - 1].target
      if (Array.isArray(current)) current.push(val)
    } else if (content.includes(': ') || content.endsWith(':')) {
      const colonIdx = content.indexOf(': ')
      const key = colonIdx >= 0 ? content.slice(0, colonIdx) : content.slice(0, -1)
      const val = colonIdx >= 0 ? content.slice(colonIdx + 2) : ''

      while (indentStack.length > 1 && indentStack[indentStack.length - 1].indent >= indent)
        indentStack.pop()

      const current = indentStack[indentStack.length - 1].target as Record<string, unknown>

      if (!val) {
        const newObj: Record<string, unknown> = {}
        current[key] = newObj
        indentStack.push({ indent, target: newObj })
      } else {
        current[key] = parseValue(val)
      }
    }
  }
  return root
}

type Mode = 'json-to-yaml' | 'yaml-to-json'

export default function JsonYaml() {
  const [input, setInput] = useState('{\n  "name": "DevKit",\n  "version": "1.0",\n  "tools": ["json", "yaml", "base64"],\n  "active": true\n}')
  const [mode, setMode] = useState<Mode>('json-to-yaml')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')

  const convert = () => {
    setError('')
    try {
      if (mode === 'json-to-yaml') {
        const parsed = JSON.parse(input)
        setOutput(jsonToYaml(parsed))
      } else {
        const parsed = yamlToJson(input)
        setOutput(JSON.stringify(parsed, null, 2))
      }
    } catch (e: unknown) {
      setError((e as Error).message)
      setOutput('')
    }
  }

  const swap = () => {
    if (!output) return
    setInput(output)
    setOutput('')
    setMode(m => m === 'json-to-yaml' ? 'yaml-to-json' : 'json-to-yaml')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        {([['json-to-yaml', 'JSON → YAML'], ['yaml-to-json', 'YAML → JSON']] as const).map(([val, label]) => (
          <button key={val} onClick={() => { setMode(val); setOutput(''); setError('') }} style={{
            padding: '0.4rem 1rem', borderRadius: '6px', border: '1px solid var(--border)',
            background: mode === val ? 'var(--accent)' : 'var(--bg-tertiary)',
            color: mode === val ? '#fff' : 'var(--text-secondary)',
            fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer',
          }}>{label}</button>
        ))}
        <button className="btn-primary" onClick={convert}>Convert</button>
        {output && <button className="btn-secondary" onClick={swap}>⇄ Swap</button>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label className="label">{mode === 'json-to-yaml' ? 'JSON Input' : 'YAML Input'}</label>
          <textarea className="input-base input-mono" rows={16} value={input}
            onChange={e => setInput(e.target.value)} style={{ resize: 'vertical' }} />
        </div>
        <div>
          <label className="label">{mode === 'json-to-yaml' ? 'YAML Output' : 'JSON Output'}</label>
          <div style={{ position: 'relative' }}>
            <textarea className="input-base input-mono" rows={16}
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
