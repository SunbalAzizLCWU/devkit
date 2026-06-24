'use client'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import Navbar from '@/components/ui/Navbar'
import { TOOLS, type Tool } from '@/lib/tools'
import { ArrowLeft } from 'lucide-react'

const TOOL_COMPONENTS: Record<string, React.ComponentType> = {
  // Developer
  'json-formatter':    dynamic(() => import('@/components/tools/JsonFormatter'),   { ssr: false }),
  'jwt-decoder':       dynamic(() => import('@/components/tools/JwtDecoder'),      { ssr: false }),
  'regex-tester':      dynamic(() => import('@/components/tools/RegexTester'),     { ssr: false }),
  'uuid-generator':    dynamic(() => import('@/components/tools/UuidGenerator'),   { ssr: false }),
  'cron-parser':       dynamic(() => import('@/components/tools/CronParser'),      { ssr: false }),
  'color-converter':   dynamic(() => import('@/components/tools/ColorConverter'),  { ssr: false }),
  'diff-checker':      dynamic(() => import('@/components/tools/DiffChecker'),     { ssr: false }),
  'json-yaml':         dynamic(() => import('@/components/tools/JsonYaml'),        { ssr: false }),
  // Text
  'case-converter':    dynamic(() => import('@/components/tools/CaseConverter'),   { ssr: false }),
  'word-counter':      dynamic(() => import('@/components/tools/WordCounter'),     { ssr: false }),
  'text-stats':        dynamic(() => import('@/components/tools/CounterStats'),    { ssr: false }),
  'lorem-ipsum':       dynamic(() => import('@/components/tools/LoremIpsum'),      { ssr: false }),
  'markdown-preview':  dynamic(() => import('@/components/tools/MarkdownPreview'), { ssr: false }),
  'string-escape':     dynamic(() => import('@/components/tools/StringEscape'),    { ssr: false }),
  'text-to-slug':      dynamic(() => import('@/components/tools/TextToSlug'),      { ssr: false }),
  'line-sorter':       dynamic(() => import('@/components/tools/LineSorter'),      { ssr: false }),
  'morse-code':        dynamic(() => import('@/components/tools/MorseCode'),       { ssr: false }),
  // Security
  'password-generator':dynamic(() => import('@/components/tools/PasswordGenerator'),{ ssr: false }),
  'hash-generator':    dynamic(() => import('@/components/tools/HashGenerator'),   { ssr: false }),
  'bcrypt':            dynamic(() => import('@/components/tools/BcryptTool'),      { ssr: false }),
  'base64':            dynamic(() => import('@/components/tools/Base64Tool'),      { ssr: false }),
  // Converter
  'csv-json':          dynamic(() => import('@/components/tools/CsvJson'),         { ssr: false }),
  'unix-timestamp':    dynamic(() => import('@/components/tools/UnixTimestamp'),   { ssr: false }),
  'number-base':       dynamic(() => import('@/components/tools/NumberBase'),      { ssr: false }),
  'url-encode':        dynamic(() => import('@/components/tools/UrlEncode'),       { ssr: false }),
  'html-entity':       dynamic(() => import('@/components/tools/HtmlEntity'),      { ssr: false }),
  // Network
  'ip-lookup':         dynamic(() => import('@/components/tools/IpLookup'),        { ssr: false }),
  'http-status':       dynamic(() => import('@/components/tools/HttpStatus'),      { ssr: false }),
  'url-parser':        dynamic(() => import('@/components/tools/UrlParser'),       { ssr: false }),
  // Image & Media
  'qr-generator':      dynamic(() => import('@/components/tools/QrGenerator'),    { ssr: false }),
  'svg-viewer':        dynamic(() => import('@/components/tools/SvgViewer'),       { ssr: false }),
  'color-palette':     dynamic(() => import('@/components/tools/ColorPalette'),    { ssr: false }),
  // Math
  'percentage-calc':   dynamic(() => import('@/components/tools/PercentageCalc'), { ssr: false }),
  'unit-converter':    dynamic(() => import('@/components/tools/UnitConverter'),   { ssr: false }),
  'random-number':     dynamic(() => import('@/components/tools/RandomNumber'),    { ssr: false }),
  // AI
  'ai-text-improver':  dynamic(() => import('@/components/tools/AiTextImprover'),  { ssr: false }),
  'ai-regex-builder':  dynamic(() => import('@/components/tools/AiRegexBuilder'),  { ssr: false }),
  'ai-json-fixer':     dynamic(() => import('@/components/tools/AiJsonFixer'),     { ssr: false }),
  'ai-summarizer':     dynamic(() => import('@/components/tools/AiSummarizer'),    { ssr: false }),
  'ai-code-explainer': dynamic(() => import('@/components/tools/AiCodeExplainer'), { ssr: false }),
}

export default function ToolPageClient({ tool }: { tool: Tool }) {
  const Component = TOOL_COMPONENTS[tool.id]
  const related = TOOLS.filter(t => t.category === tool.category && t.id !== tool.id).slice(0, 4)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1.5rem' }}>

        <Link href="/" style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
          color: 'var(--text-secondary)', textDecoration: 'none',
          fontSize: '0.85rem', marginBottom: '1.5rem', transition: 'color 0.15s ease',
        }}>
          <ArrowLeft size={14} /> All Tools
        </Link>

        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '14px', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ background: 'var(--accent-subtle)', border: '1px solid var(--accent)', borderRadius: '10px', padding: '0.6rem 0.875rem', fontSize: '1.1rem', fontFamily: 'JetBrains Mono, monospace', color: 'var(--accent)', fontWeight: 700, minWidth: '52px', textAlign: 'center' }}>
                {tool.icon}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <h1 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>{tool.name}</h1>
                  {tool.new && <span className="tag">New</span>}
                  {tool.popular && <span className="tag">Popular</span>}
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem', lineHeight: 1.5 }}>{tool.description}</p>
              </div>
            </div>
            <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: '6px', padding: '0.3rem 0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em', flexShrink: 0 }}>
              {tool.category}
            </span>
          </div>
        </div>

        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '14px', padding: '1.5rem', marginBottom: '1.5rem' }}>
          {Component ? <Component /> : (
            <div style={{ textAlign: 'center', padding: '3rem 2rem' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🚧</div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Coming Soon</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>This tool is being built.</p>
            </div>
          )}
        </div>

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
