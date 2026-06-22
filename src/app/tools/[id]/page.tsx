'use client'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/ui/Navbar'
import { TOOLS } from '@/lib/tools'
import { ArrowLeft } from 'lucide-react'

// Tool components
import JsonFormatter from '@/components/tools/JsonFormatter'
import JwtDecoder from '@/components/tools/JwtDecoder'
import UuidGenerator from '@/components/tools/UuidGenerator'
import PasswordGenerator from '@/components/tools/PasswordGenerator'
import Base64Tool from '@/components/tools/Base64Tool'
import CaseConverter from '@/components/tools/CaseConverter'
import HashGenerator from '@/components/tools/HashGenerator'
import QrGenerator from '@/components/tools/QrGenerator'
import UnixTimestamp from '@/components/tools/UnixTimestamp'
import WordCounter from '@/components/tools/WordCounter'
import UrlEncode from '@/components/tools/UrlEncode'
import HttpStatus from '@/components/tools/HttpStatus'
import NumberBase from '@/components/tools/NumberBase'
import LoremIpsum from '@/components/tools/LoremIpsum'
import AiTextImprover from '@/components/tools/AiTextImprover'
import AiRegexBuilder from '@/components/tools/AiRegexBuilder'
import AiJsonFixer from '@/components/tools/AiJsonFixer'

const TOOL_COMPONENTS: Record<string, React.ComponentType> = {
  'json-formatter': JsonFormatter,
  'jwt-decoder': JwtDecoder,
  'uuid-generator': UuidGenerator,
  'password-generator': PasswordGenerator,
  'base64': Base64Tool,
  'case-converter': CaseConverter,
  'hash-generator': HashGenerator,
  'qr-generator': QrGenerator,
  'unix-timestamp': UnixTimestamp,
  'word-counter': WordCounter,
  'url-encode': UrlEncode,
  'http-status': HttpStatus,
  'number-base': NumberBase,
  'lorem-ipsum': LoremIpsum,
  'ai-text-improver': AiTextImprover,
  'ai-regex-builder': AiRegexBuilder,
  'ai-json-fixer': AiJsonFixer,
}

const COMING_SOON = [
  'regex-tester', 'cron-parser', 'color-converter', 'diff-checker',
  'markdown-preview', 'text-diff', 'bcrypt', 'json-yaml', 'csv-json',
  'ip-info', 'url-parser', 'svg-optimizer', 'percentage-calc', 'unit-converter',
  'html-entity',
]

export default function ToolPage({ params }: { params: { id: string } }) {
  const tool = TOOLS.find(t => t.id === params.id)
  if (!tool) notFound()

  const Component = TOOL_COMPONENTS[tool.id]
  const isComingSoon = COMING_SOON.includes(tool.id)

  const related = TOOLS.filter(t => t.category === tool.category && t.id !== tool.id).slice(0, 4)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        {/* Back */}
        <Link href="/" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          color: 'var(--text-secondary)',
          textDecoration: 'none',
          fontSize: '0.85rem',
          marginBottom: '1.5rem',
          transition: 'color 0.15s ease',
        }}
          onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = 'var(--accent-text)'}
          onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-secondary)'}
        >
          <ArrowLeft size={14} /> All Tools
        </Link>

        {/* Tool header */}
        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          borderRadius: '14px',
          padding: '1.5rem',
          marginBottom: '1.5rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                background: 'var(--accent-subtle)',
                border: '1px solid var(--accent)',
                borderRadius: '10px',
                padding: '0.6rem 0.875rem',
                fontSize: '1.1rem',
                fontFamily: 'JetBrains Mono, monospace',
                color: 'var(--accent)',
                fontWeight: 700,
              }}>{tool.icon}</div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <h1 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>{tool.name}</h1>
                  {tool.new && <span className="tag">New</span>}
                  {tool.popular && <span className="tag">Popular</span>}
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{tool.description}</p>
              </div>
            </div>
            <span style={{
              fontSize: '0.72rem',
              fontWeight: 600,
              color: 'var(--text-muted)',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border)',
              borderRadius: '6px',
              padding: '0.3rem 0.65rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              flexShrink: 0,
            }}>{tool.category}</span>
          </div>
        </div>

        {/* Tool body */}
        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          borderRadius: '14px',
          padding: '1.5rem',
          marginBottom: '1.5rem',
        }}>
          {Component ? (
            <Component />
          ) : isComingSoon ? (
            <div style={{ textAlign: 'center', padding: '3rem 2rem' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🚧</div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Coming Soon</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>This tool is being built. Check back soon!</p>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem 2rem', color: 'var(--text-muted)' }}>Tool not found.</div>
          )}
        </div>

        {/* Related tools */}
        {related.length > 0 && (
          <div>
            <h2 style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>
              More {tool.category} Tools
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.6rem' }}>
              {related.map(t => (
                <Link key={t.id} href={`/tools/${t.id}`} style={{ textDecoration: 'none' }}>
                  <div className="tool-card" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem' }}>
                    <span style={{ fontSize: '1rem', fontFamily: 'JetBrains Mono, monospace', color: 'var(--accent)' }}>{t.icon}</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-primary)' }}>{t.name}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export function generateStaticParams() {
  return TOOLS.map(t => ({ id: t.id }))
}
