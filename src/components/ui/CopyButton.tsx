'use client'
import { useState } from 'react'
import { Check, Copy } from 'lucide-react'

interface CopyButtonProps {
  text: string
  /** If true, renders as an absolute-positioned overlay (default). If false, renders inline. */
  overlay?: boolean
}

export default function CopyButton({ text, overlay = true }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      // Fallback for browsers without clipboard API
      const el = document.createElement('textarea')
      el.value = text
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    }
  }

  return (
    <button
      onClick={copy}
      title="Copy to clipboard"
      style={{
        position: overlay ? 'absolute' : 'relative',
        ...(overlay ? { top: '0.5rem', right: '0.5rem' } : {}),
        background: 'var(--bg-tertiary)',
        border: '1px solid var(--border)',
        borderRadius: '6px',
        padding: '0.25rem 0.55rem',
        fontSize: '0.72rem',
        fontWeight: 500,
        color: copied ? 'var(--accent-text)' : 'var(--text-secondary)',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.25rem',
        transition: 'all 0.15s ease',
        borderColor: copied ? 'var(--accent)' : 'var(--border)',
        whiteSpace: 'nowrap',
      }}
    >
      {copied ? <Check size={11} /> : <Copy size={11} />}
      {copied ? 'Copied!' : 'Copy'}
    </button>
  )
}
