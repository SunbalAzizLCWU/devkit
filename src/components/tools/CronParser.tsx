'use client'
import { useState } from 'react'

const EXAMPLES = [
  { expr: '* * * * *',       label: 'Every minute' },
  { expr: '0 * * * *',       label: 'Every hour' },
  { expr: '0 0 * * *',       label: 'Daily at midnight' },
  { expr: '0 9 * * 1-5',     label: 'Weekdays at 9am' },
  { expr: '0 0 * * 0',       label: 'Every Sunday at midnight' },
  { expr: '*/15 * * * *',    label: 'Every 15 minutes' },
  { expr: '0 0 1 * *',       label: '1st of every month' },
  { expr: '0 0 1 1 *',       label: 'Every January 1st' },
]

function parseCron(expr: string): { human: string; fields: Record<string, string>; error?: string } {
  const parts = expr.trim().split(/\s+/)
  if (parts.length !== 5) return { human: '', fields: {}, error: 'Cron expression must have exactly 5 fields.' }

  const [min, hour, dom, month, dow] = parts

  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  const DAYS   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

  const parseField = (val: string, min: number, max: number, names?: string[]): string => {
    if (val === '*') return 'every'
    if (val.startsWith('*/')) {
      const step = parseInt(val.slice(2))
      return `every ${step}`
    }
    if (val.includes('-')) {
      const [s, e] = val.split('-').map(Number)
      const sn = names ? names[s - min] || String(s) : String(s)
      const en = names ? names[e - min] || String(e) : String(e)
      return `${sn}–${en}`
    }
    if (val.includes(',')) {
      return val.split(',').map(v => names ? names[parseInt(v) - min] || v : v).join(', ')
    }
    const n = parseInt(val)
    return names ? (names[n - min] || val) : val
  }

  try {
    const minStr   = parseField(min, 0, 59)
    const hourStr  = parseField(hour, 0, 23)
    const domStr   = parseField(dom, 1, 31)
    const monthStr = parseField(month, 1, 12, MONTHS)
    const dowStr   = parseField(dow, 0, 6, DAYS)

    let human = 'Runs '

    if (min === '*' && hour === '*') human += 'every minute'
    else if (min.startsWith('*/') && hour === '*') human += `every ${min.slice(2)} minutes`
    else if (hour === '*') human += `at minute ${minStr} of every hour`
    else human += `at ${hourStr === 'every' ? 'every hour' : hourStr.padStart(2,'0') + ':' + (min === '0' ? '00' : minStr.padStart(2,'0'))}`

    if (dom !== '*') human += `, on day ${domStr} of the month`
    if (month !== '*') human += `, in ${monthStr}`
    if (dow !== '*') human += `, on ${dowStr}`

    const fields: Record<string, string> = {
      Minute: minStr,
      Hour: hourStr,
      'Day (month)': domStr,
      Month: monthStr,
      'Day (week)': dowStr,
    }

    return { human, fields }
  } catch {
    return { human: '', fields: {}, error: 'Could not parse this expression.' }
  }
}

function nextRuns(expr: string, count = 5): string[] {
  const parts = expr.trim().split(/\s+/)
  if (parts.length !== 5) return []
  const runs: string[] = []
  const now = new Date()
  now.setSeconds(0, 0)
  const [minField, hourField] = parts

  for (let i = 0; runs.length < count && i < 10000; i++) {
    now.setMinutes(now.getMinutes() + 1)
    const m = now.getMinutes(), h = now.getHours()
    const minOk = minField === '*' || (minField.startsWith('*/') ? m % parseInt(minField.slice(2)) === 0 : minField.split(',').includes(String(m)))
    const hOk = hourField === '*' || hourField.split(',').includes(String(h))
    if (minOk && hOk) runs.push(now.toLocaleString())
  }
  return runs
}

export default function CronParser() {
  const [expr, setExpr] = useState('0 9 * * 1-5')
  const parsed = parseCron(expr)
  const runs = !parsed.error ? nextRuns(expr) : []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div>
        <label className="label">Cron Expression</label>
        <input className="input-base input-mono" value={expr} onChange={e => setExpr(e.target.value)} placeholder="* * * * *" />
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>
          {['MIN','HOUR','DOM','MON','DOW'].map(f => (
            <span key={f} style={{ flex: 1, textAlign: 'center', background: 'var(--bg-tertiary)', borderRadius: '4px', padding: '0.2rem 0' }}>{f}</span>
          ))}
        </div>
      </div>

      {/* Examples */}
      <div>
        <label className="label">Examples</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {EXAMPLES.map(({ expr: e, label }) => (
            <button key={e} onClick={() => setExpr(e)} style={{
              padding: '0.3rem 0.75rem',
              borderRadius: '100px',
              border: '1px solid var(--border)',
              background: expr === e ? 'var(--accent)' : 'var(--bg-tertiary)',
              color: expr === e ? '#fff' : 'var(--text-secondary)',
              fontSize: '0.75rem',
              cursor: 'pointer',
            }}>{label}</button>
          ))}
        </div>
      </div>

      {parsed.error && (
        <p style={{ color: '#EF4444', fontSize: '0.85rem' }}>⚠ {parsed.error}</p>
      )}

      {!parsed.error && (
        <>
          <div style={{
            background: 'var(--accent-subtle)',
            border: '1px solid var(--accent)',
            borderRadius: '10px',
            padding: '0.875rem 1rem',
            fontSize: '0.95rem',
            fontWeight: 500,
            color: 'var(--accent-text)',
          }}>
            {parsed.human}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem' }}>
            {Object.entries(parsed.fields).map(([label, value]) => (
              <div key={label} style={{
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '0.6rem 0.75rem',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>{label}</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'JetBrains Mono, monospace' }}>{value}</div>
              </div>
            ))}
          </div>

          {runs.length > 0 && (
            <div>
              <label className="label">Next {runs.length} Runs</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                {runs.map((r, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.5rem 0.875rem',
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border)',
                    borderRadius: '7px',
                    fontSize: '0.85rem',
                    fontFamily: 'JetBrains Mono, monospace',
                    color: 'var(--text-primary)',
                  }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem', minWidth: '16px' }}>#{i + 1}</span>
                    {r}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
