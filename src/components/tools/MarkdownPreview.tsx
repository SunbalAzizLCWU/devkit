'use client'
import { useState } from 'react'

const SAMPLE = `# Hello, Markdown!

This is a **live preview**. Edit on the left.

## Features
- _Italic_ and **bold** text
- \`inline code\`
- [Links](https://example.com)

## Code Block

\`\`\`javascript
const greet = name => \`Hello, \${name}!\`
\`\`\`

> Blockquotes look great too.

---

1. Ordered lists
2. Work perfectly
3. Out of the box
`

function parseMarkdown(md: string): string {
  let html = md
    // Escape HTML special chars first
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    // Code blocks
    .replace(/```[\w]*\n?([\s\S]*?)```/g, '<pre style="background:var(--bg-tertiary);border:1px solid var(--border);border-radius:8px;padding:1rem;overflow-x:auto;margin:0.75rem 0"><code style="font-family:JetBrains Mono,monospace;font-size:0.82rem">$1</code></pre>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code style="background:var(--bg-tertiary);border:1px solid var(--border);border-radius:4px;padding:0.1em 0.4em;font-family:JetBrains Mono,monospace;font-size:0.85em">$1</code>')
    // Headers
    .replace(/^### (.+)$/gm, '<h3 style="font-size:1rem;font-weight:700;color:var(--text-primary);margin:1rem 0 0.4rem">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 style="font-size:1.2rem;font-weight:700;color:var(--text-primary);margin:1.25rem 0 0.5rem">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 style="font-size:1.5rem;font-weight:800;color:var(--text-primary);margin:0 0 0.75rem">$1</h1>')
    // Bold + italic
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/_(.+?)_/g, '<em>$1</em>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" style="color:var(--accent-text);text-decoration:underline">$1</a>')
    // Blockquote
    .replace(/^&gt; (.+)$/gm, '<blockquote style="border-left:3px solid var(--accent);margin:0.5rem 0;padding:0.4rem 0.875rem;color:var(--text-secondary);font-style:italic">$1</blockquote>')
    // HR
    .replace(/^---$/gm, '<hr style="border:none;border-top:1px solid var(--border);margin:1rem 0">')
    // Unordered lists
    .replace(/^[\-\*] (.+)$/gm, '<li style="margin:0.2rem 0;padding-left:0.25rem">$1</li>')
    // Ordered lists
    .replace(/^\d+\. (.+)$/gm, '<li style="margin:0.2rem 0;padding-left:0.25rem;list-style-type:decimal">$1</li>')
    // Paragraphs (double newlines)
    .replace(/\n\n+/g, '</p><p style="margin:0.5rem 0;line-height:1.7">')
    // Single newlines
    .replace(/\n/g, '<br>')

  return `<p style="margin:0;line-height:1.7">${html}</p>`
}

export default function MarkdownPreview() {
  const [md, setMd] = useState(SAMPLE)

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
      <div>
        <label className="label">Markdown</label>
        <textarea
          className="input-base input-mono"
          rows={24}
          value={md}
          onChange={e => setMd(e.target.value)}
          style={{ resize: 'vertical' }}
        />
      </div>
      <div>
        <label className="label">Preview</label>
        <div
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            padding: '1rem',
            minHeight: '300px',
            color: 'var(--text-primary)',
            fontSize: '0.9rem',
            lineHeight: 1.7,
            overflow: 'auto',
          }}
          dangerouslySetInnerHTML={{ __html: parseMarkdown(md) }}
        />
      </div>
    </div>
  )
}
