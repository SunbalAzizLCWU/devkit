'use client'
import { useState } from 'react'
import CopyButton from '../ui/CopyButton'

const MORSE: Record<string, string> = {
  A:'.-', B:'-...', C:'-.-.', D:'-..', E:'.', F:'..-.', G:'--.', H:'....', I:'..', J:'.---',
  K:'-.-', L:'.-..', M:'--', N:'-.', O:'---', P:'.--.', Q:'--.-', R:'.-.', S:'...', T:'-',
  U:'..-', V:'...-', W:'.--', X:'-..-', Y:'-.--', Z:'--..',
  '0':'-----','1':'.----','2':'..---','3':'...--','4':'....-','5':'.....',
  '6':'-....','7':'--...','8':'---..','9':'----.',
  '.':'.-.-.-',',':'--..--','?':'..--..','!':'-.-.--','/':'-..-.','(':'-.--.',')':'-.--.-',
  '&':'.-...',':':'---...',';':'-.-.-.','=':'-...-','+':'.-.-.','-':'-....-','_':'..--.-',
  '"':'.-..-.','$':'...-..-','@':'.--.-.', ' ':'/'
}

const MORSE_REVERSE = Object.fromEntries(Object.entries(MORSE).map(([k, v]) => [v, k]))

function textToMorse(text: string): string {
  return text.toUpperCase().split('').map(c => MORSE[c] || '?').join(' ')
}

function morseToText(morse: string): string {
  return morse.split(' ').map(code => {
    if (code === '/') return ' '
    return MORSE_REVERSE[code] || '?'
  }).join('')
}

export default function MorseCode() {
  const [input, setInput] = useState('Hello World')
  const [mode, setMode] = useState<'text-to-morse' | 'morse-to-text'>('text-to-morse')

  const output = mode === 'text-to-morse' ? textToMorse(input) : morseToText(input)

  // Audio playback
  const playMorse = () => {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    const ctx = new AudioCtx()
    const morse = mode === 'text-to-morse' ? output : textToMorse(morseToText(input))
    const wpm = 15
    const dotDuration = 1.2 / wpm
    let time = ctx.currentTime + 0.1

    for (const symbol of morse.split('')) {
      if (symbol === '.') {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain); gain.connect(ctx.destination)
        osc.frequency.value = 600
        osc.start(time); osc.stop(time + dotDuration)
        time += dotDuration * 1.5
      } else if (symbol === '-') {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain); gain.connect(ctx.destination)
        osc.frequency.value = 600
        osc.start(time); osc.stop(time + dotDuration * 3)
        time += dotDuration * 4.5
      } else if (symbol === ' ') {
        time += dotDuration * 2
      } else if (symbol === '/') {
        time += dotDuration * 5
      }
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        {([['text-to-morse', 'Text → Morse'], ['morse-to-text', 'Morse → Text']] as const).map(([val, label]) => (
          <button key={val} onClick={() => { setMode(val); setInput('') }} style={{
            padding: '0.4rem 1rem', borderRadius: '6px', border: '1px solid var(--border)',
            background: mode === val ? 'var(--accent)' : 'var(--bg-tertiary)',
            color: mode === val ? '#fff' : 'var(--text-secondary)',
            fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer',
          }}>{label}</button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label className="label">{mode === 'text-to-morse' ? 'Text' : 'Morse Code'}</label>
          <textarea className="input-base input-mono" rows={8} value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={mode === 'text-to-morse' ? 'Type text here...' : '... --- ...'}
            style={{ resize: 'none' }} />
        </div>
        <div>
          <label className="label">{mode === 'text-to-morse' ? 'Morse Code' : 'Text'}</label>
          <div style={{ position: 'relative' }}>
            <textarea className="input-base input-mono" rows={8} value={output} readOnly
              style={{ resize: 'none' }} placeholder="Output appears here..." />
            {output && <CopyButton text={output} />}
          </div>
        </div>
      </div>

      {output && mode === 'text-to-morse' && (
        <button className="btn-secondary" onClick={playMorse} style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          🔊 Play Morse Audio
        </button>
      )}

      {/* Reference */}
      <div>
        <label className="label">Morse Reference</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '0.3rem' }}>
          {Object.entries(MORSE).filter(([k]) => k !== ' ').map(([char, code]) => (
            <div key={char} style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              background: 'var(--bg-tertiary)', border: '1px solid var(--border)',
              borderRadius: '6px', padding: '0.3rem 0.5rem',
            }}>
              <span style={{ fontWeight: 700, color: 'var(--accent)', minWidth: '14px', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.82rem' }}>{char}</span>
              <code style={{ fontSize: '0.72rem', fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-secondary)' }}>{code}</code>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
