'use client'
import { useState } from 'react'

type DiffLine = { type: 'same' | 'added' | 'removed'; text: string; lineA?: number; lineB?: number }

function computeDiff(a: string, b: string): DiffLine[] {
  const linesA = a.split('\n')
  const linesB = b.split('\n')

  // Simple LCS-based line diff
  const m = linesA.length, n = linesB.length
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0))
  for (let i = m - 1; i >= 0; i--)
    for (let j = n - 1; j >= 0; j--)
      dp[i][j] = linesA[i] === linesB[j] ? dp[i+1][j+1] + 1 : Math.max(dp[i+1][j], dp[i][j+1])

  const result: DiffLine[] = []
  let i = 0, j = 0, ai = 1, bi = 1
  while (i < m || j < n) {
    if (i < m && j < n && linesA[i] === linesB[j]) {
      result.push({ type: 'same', text: linesA[i], lineA: ai++, lineB: bi++ }); i++; j++
    } else if (j < n && (i >= m || dp[i][j+1] >= dp[i+1][j])) {
      result.push({ type: 'added', text: linesB[j], lineB: bi++ }); j++
    } else {
      result.push({ type: 'removed', text: linesA[i], lineA: ai++ }); i++
    }
  }
  return result
}

export default function DiffChecker() {
  const [textA, setTextA] = useState('')
  const [textB, setTextB] = useState('')
  const [diffed, setDiffed] = useState(false)

  const diff = computeDiff(textA, textB)
  const added = diff.filter(d => d.type === 'added').length
  const removed = diff.filter(d => d.type === 'removed').length

  const bgColor = { same: 'transparent', added: '#10B98115', removed: '#EF444415' }
  const textColor = { same: 'var(--text-primary)', added: '#059669', removed: '#DC2626' }
  const prefix = { same: ' ', added: '+', removed: '−' }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label className="label">Original Text (A)</label>
          <textarea className="input-base input-mono" rows={12} value={textA}
            onChange={e => { setTextA(e.target.value); setDiffed(false) }}
            placeholder="Paste original text here..." style={{ resize: 'vertical' }} />
        </div>
        <div>
          <label className="label">Modified Text (B)</label>
          <textarea className="input-base input-mono" rows={12} value={textB}
            onChange={e => { setTextB(e.target.value); setDiffed(false) }}
            placeholder="Paste modified text here..." style={{ resize: 'vertical' }} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        <button className="btn-primary" onClick={() => setDiffed(true)} disabled={!textA && !textB}>
          Compare
        </button>
        {diffed && (
          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.82rem', fontWeight: 600 }}>
            <span style={{ color: '#059669' }}>+{added} added</span>
            <span style={{ color: '#DC2626' }}>−{removed} removed</span>
          </div>
        )}
      </div>

      {diffed && (textA || textB) && (
        <div>
          <label className="label">Diff Output</label>
          <div style={{
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border)',
            borderRadius: '10px',
            overflow: 'hidden',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.82rem',
            lineHeight: '1.7',
          }}>
            {diff.map((line, i) => (
              <div key={i} style={{
                display: 'flex',
                background: bgColor[line.type],
                borderBottom: '1px solid var(--border)',
                padding: '0 0',
              }}>
                <span style={{
                  minWidth: '36px',
                  padding: '0 0.5rem',
                  color: 'var(--text-muted)',
                  fontSize: '0.72rem',
                  textAlign: 'right',
                  userSelect: 'none',
                  borderRight: '1px solid var(--border)',
                }}>
                  {line.lineA ?? ''}
                </span>
                <span style={{
                  minWidth: '36px',
                  padding: '0 0.5rem',
                  color: 'var(--text-muted)',
                  fontSize: '0.72rem',
                  textAlign: 'right',
                  userSelect: 'none',
                  borderRight: '1px solid var(--border)',
                }}>
                  {line.lineB ?? ''}
                </span>
                <span style={{
                  minWidth: '20px',
                  padding: '0 0.4rem',
                  fontWeight: 700,
                  color: textColor[line.type],
                  userSelect: 'none',
                }}>
                  {prefix[line.type]}
                </span>
                <span style={{ flex: 1, padding: '0 0.5rem', color: textColor[line.type], whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                  {line.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
