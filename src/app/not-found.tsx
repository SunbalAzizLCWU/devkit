import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      textAlign: 'center',
    }}>
      <div style={{
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '4rem',
        fontWeight: 800,
        color: 'var(--accent)',
        lineHeight: 1,
        marginBottom: '0.5rem',
      }}>404</div>
      <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
        Page not found
      </h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
        The tool or page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link href="/" style={{
        background: 'var(--accent)',
        color: '#fff',
        textDecoration: 'none',
        padding: '0.6rem 1.25rem',
        borderRadius: '8px',
        fontSize: '0.875rem',
        fontWeight: 500,
      }}>
        ← Back to all tools
      </Link>
    </div>
  )
}
