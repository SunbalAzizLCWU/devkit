'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import Navbar from '@/components/ui/Navbar'
import { TOOLS, CATEGORIES, type Category } from '@/lib/tools'
import { Search, Zap, Star, Sparkles } from 'lucide-react'

export default function HomePage() {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All')

  const filtered = useMemo(() => {
    return TOOLS.filter(tool => {
      const matchCat = activeCategory === 'All' || tool.category === activeCategory
      const q = query.toLowerCase()
      const matchSearch = !q || tool.name.toLowerCase().includes(q) || tool.description.toLowerCase().includes(q) || tool.tags.some(t => t.includes(q))
      return matchCat && matchSearch
    })
  }, [query, activeCategory])

  const popular = TOOLS.filter(t => t.popular)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />

      {/* Hero */}
      <div style={{
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border)',
        padding: '3rem 1.5rem 2.5rem',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'var(--accent-subtle)', border: '1px solid var(--accent)', borderRadius: '100px', padding: '0.3rem 0.75rem', marginBottom: '1.25rem' }}>
            <Sparkles size={11} color='var(--accent-text)' />
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-text)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Free · No Login · Privacy First</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 2.75rem)',
            fontWeight: 800,
            color: 'var(--text-primary)',
            letterSpacing: '-0.03em',
            lineHeight: 1.15,
            marginBottom: '0.75rem',
          }}>
            Every tool you reach for,<br />
            <span style={{ color: 'var(--accent)' }}>in one place.</span>
          </h1>

          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '1.75rem', lineHeight: 1.6 }}>
            {TOOLS.length} fast, free, browser-based tools for developers and everyone. Nothing leaves your device.
          </p>

          {/* Live Search */}
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{
              position: 'absolute',
              left: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
              pointerEvents: 'none',
            }} />
            <input
              className="input-base"
              style={{
                paddingLeft: '2.75rem',
                fontSize: '1rem',
                height: '50px',
                borderRadius: '12px',
                boxShadow: 'var(--shadow-md)',
              }}
              placeholder="Search tools — try 'base64', 'uuid', 'password'..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              autoFocus
            />
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>

        {/* Popular — only show when not filtering */}
        {!query && activeCategory === 'All' && (
          <section style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Star size={14} color='var(--accent-text)' fill='var(--accent)' />
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Popular</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
              {popular.map(tool => (
                <Link key={tool.id} href={`/tools/${tool.id}`} style={{ textDecoration: 'none' }}>
                  <div className="tool-card" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem 1rem' }}>
                    <span style={{ fontSize: '1.2rem', minWidth: '28px', textAlign: 'center', fontFamily: 'JetBrains Mono, monospace', color: 'var(--accent)' }}>{tool.icon}</span>
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>{tool.name}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>{tool.category}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Category Filter */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          {(['All', ...CATEGORIES] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '0.35rem 0.875rem',
                borderRadius: '100px',
                border: '1px solid var(--border)',
                background: activeCategory === cat ? 'var(--accent)' : 'var(--bg-secondary)',
                color: activeCategory === cat ? '#fff' : 'var(--text-secondary)',
                fontSize: '0.8rem',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >{cat}</button>
          ))}
        </div>

        {/* Results count */}
        {(query || activeCategory !== 'All') && (
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            {filtered.length} tool{filtered.length !== 1 ? 's' : ''} found
          </p>
        )}

        {/* Tool Grid */}
        {filtered.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.875rem' }}>
            {filtered.map(tool => (
              <Link key={tool.id} href={`/tools/${tool.id}`} style={{ textDecoration: 'none' }}>
                <div className="tool-card" style={{ height: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                    <span style={{
                      fontSize: '1.1rem',
                      fontFamily: 'JetBrains Mono, monospace',
                      color: 'var(--accent)',
                      fontWeight: 700,
                      minWidth: '32px',
                    }}>{tool.icon}</span>
                    <div style={{ display: 'flex', gap: '0.3rem' }}>
                      {tool.new && <span className="tag">New</span>}
                      {tool.popular && <span className="tag">Popular</span>}
                    </div>
                  </div>
                  <h3 style={{ fontSize: '0.93rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.3rem' }}>{tool.name}</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{tool.description}</p>
                  <div style={{ marginTop: '0.75rem' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {tool.category}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🔍</div>
            <p style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-secondary)' }}>No tools found for &ldquo;{query}&rdquo;</p>
            <p style={{ fontSize: '0.85rem', marginTop: '0.35rem' }}>Try a different search term</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border)',
        padding: '1.5rem',
        textAlign: 'center',
        marginTop: '3rem',
      }}>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          DevKit: {TOOLS.length} tools · All processing happens in your browser · No tracking.
          <br />
          <span style={{ display: 'inline-block', marginTop: '0.5rem' }}>
            Built by <a href="https://github.com/SunbalAzizLCWU" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>@SunbalAziz</a> while high on ☕.
          </span>
        </p>
      </footer>
    </div>
  )
}