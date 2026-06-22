'use client'
import { useState } from 'react'
import CopyButton from '../ui/CopyButton'

const LOREM_WORDS = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum'.split(' ')

function generateWords(count: number) {
  return Array.from({ length: count }, (_, i) => {
    const word = LOREM_WORDS[i % LOREM_WORDS.length]
    return i === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word
  }).join(' ') + '.'
}

function generateParagraphs(count: number) {
  return Array.from({ length: count }, () => generateWords(40 + Math.floor(Math.random() * 40))).join('\n\n')
}

export default function LoremIpsum() {
  const [type, setType] = useState<'words' | 'sentences' | 'paragraphs'>('paragraphs')
  const [count, setCount] = useState(3)
  const [output, setOutput] = useState('')

  const generate = () => {
    if (type === 'words') setOutput(generateWords(count).replace('.', ''))
    else if (type === 'sentences') setOutput(Array.from({ length: count }, () => generateWords(10 + Math.floor(Math.random() * 10))).join(' '))
    else setOutput(generateParagraphs(count))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {(['words', 'sentences', 'paragraphs'] as const).map(t => (
            <button key={t} onClick={() => setType(t)} style={{
              padding: '0.35rem 0.75rem',
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label className="label" style={{ margin: 0 }}>Count</label>
          <input type="number" min={1} max={50} value={count} onChange={e => setCount(+e.target.value)}
            className="input-base" style={{ width: '65px' }} />
        </div>
        <button className="btn-primary" onClick={generate}>Generate</button>
      </div>

      {output && (
        <div style={{ position: 'relative' }}>
          <textarea
            className="input-base"
            rows={10}
            value={output}
            readOnly
            style={{ resize: 'vertical', lineHeight: 1.7 }}
          />
          <CopyButton text={output} />
        </div>
      )}
    </div>
  )
}
