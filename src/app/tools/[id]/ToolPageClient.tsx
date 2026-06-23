'use client'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import Navbar from '@/components/ui/Navbar'
import { TOOLS, type Tool } from '@/lib/tools'
import { ArrowLeft } from 'lucide-react'

// Dynamically import all tool components (client-side only)
const TOOL_COMPONENTS: Record<string, React.ComponentType> = {
  'json-formatter':   dynamic(() => import('@/components/tools/JsonFormatter'), { ssr: false }),
  'jwt-decoder':      dynamic(() => import('@/components/tools/JwtDecoder'), { ssr: false }),
  'uuid-generator':   dynamic(() => import('@/components/tools/UuidGenerator'), { ssr: false }),
  'password-generator': dynamic(() => import('@/components/tools/PasswordGenerator'), { ssr: false }),
  'base64':           dynamic(() => import('@/components/tools/Base64Tool'), { ssr: false }),
  'case-converter':   dynamic(() => import('@/components/tools/CaseConverter'), { ssr: false }),
  'hash-generator':   dynamic(() => import('@/components/tools/HashGenerator'), { ssr: false }),
  'qr-generator':     dynamic(() => import('@/components/tools/QrGenerator'), { ssr: false }),
  'unix-timestamp':   dynamic(() => import('@/components/tools/UnixTimestamp'), { ssr: false }),
  'word-counter':     dynamic(() => import('@/components/tools/WordCounter'), { ssr: false }),
  'url-encode':       dynamic(() => import('@/components/tools/UrlEncode'), { ssr: false }),
  'http-status':      dynamic(() => import('@/components/tools/HttpStatus'), { ssr: false }),
  'number-base':      dynamic(() => import('@/components/tools/NumberBase'), { ssr: false }),
  'lorem-ipsum':      dynamic(() => import('@/components/tools/LoremIpsum'), { ssr: false }),
  'ai-text-improver': dynamic(() => import('@/components/tools/AiTextImprover'), { ssr: false }),
  'ai-regex-builder': dynamic(() => import('@/components/tools/AiRegexBuilder'), { ssr: false }),
  'ai-json-fixer':    dynamic(() => import('@/components/tools/AiJsonFixer'), { ssr: false }),
}

const COMING_SOON = new Set([
  'regex-tester', 'cron-parser', 'color-converter', 'diff-checker',
  'markdown-preview', 'text-diff', 'bcrypt', 'json-yaml', 'csv-json',
  'ip-info', 'url-parser', 'svg-optimizer', 'percentage-calc',
  'unit-converter', 'html-entity',
])

export default function ToolPageClient({ tool }: { tool: Tool }) {
  const Component = TOOL_COMPONENTS[tool.id]
  const isComingSoon = COMING_SOON.has(tool.id)
  const related = TOOLS.filter(t => t.category === tool.category && t.id !== tool.id).slice(0, 4)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1.5rem' }}>

        {/* Back link */}
        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: 'var(--text-secondary)',
            textDecoration: 'none',
            fontSize: '0.85rem',
            marginBottom: '1.5rem',
            transition: 'color 0.15s ease',
          }}
          onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.color = 'var(--accent-text)')}
          onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-secondary)')}
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
                minWidth: '52px',
                textAlign: 'center',
              }}>
                {tool.icon}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <h1 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                    {tool.name}
                  </h1>
                  {tool.new && <span className="tag">New</span>}
                  {tool.popular && <span className="tag">Popular</span>}
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem', lineHeight: 1.5 }}>
                  {tool.description}
                </p>
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
            }}>
              {tool.category}
            </span>
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
              <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                Coming Soon
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                This tool is being built. Check back soon!
              </p>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem 2rem', color: 'var(--text-muted)' }}>
              Tool not available.
            </div>
          )}
        </div>

        {/* Related tools */}
        {related.length > 0 && (
          <div>
            <h2 style={{
              fontSize: '0.78rem',
              fontWeight: 700,
              color: 'var(--text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '0.75rem',
            }}>
              More {tool.category} Tools
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.6rem' }}>
              {related.map(t => (
                <Link key={t.id} href={`/tools/${t.id}`} style={{ textDecoration: 'none' }}>
                  <div className="tool-card" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem' }}>
                    <span style={{ fontSize: '1rem', fontFamily: 'JetBrains Mono, monospace', color: 'var(--accent)' }}>
                      {t.icon}
                    </span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-primary)' }}>
                      {t.name}
                    </span>
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
