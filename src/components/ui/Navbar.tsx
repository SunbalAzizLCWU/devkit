'use client'
import Link from 'next/link'
import ThemeToggle from './ThemeToggle'
import { Zap } from 'lucide-react'

export default function Navbar() {
  return (
    <header style={{
      background: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 1.5rem',
        height: '56px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            background: 'var(--accent)',
            borderRadius: '8px',
            padding: '5px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Zap size={14} color="#fff" fill="#fff" />
          </div>
          <span style={{
            fontSize: '1rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
          }}>
            DevKit
          </span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <a
            href="https://github.com/SunbalAzizLCWU/devkit"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: '0.8rem',
              fontWeight: 500,
              color: 'var(--text-secondary)',
              textDecoration: 'none',
              padding: '0.35rem 0.75rem',
              borderRadius: '6px',
              border: '1px solid var(--border)',
              background: 'var(--bg-tertiary)',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.borderColor = 'var(--accent)'
              el.style.color = 'var(--accent-text)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.borderColor = 'var(--border)'
              el.style.color = 'var(--text-secondary)'
            }}
          >
            GitHub
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
