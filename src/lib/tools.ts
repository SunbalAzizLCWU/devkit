export type Category = 'Developer' | 'Text' | 'Security' | 'Converter' | 'Network' | 'Image & Media' | 'Math' | 'AI-Powered'

export interface Tool {
  id: string
  name: string
  description: string
  category: Category
  icon: string
  tags: string[]
  new?: boolean
  popular?: boolean
}

export const TOOLS: Tool[] = [
  // Developer
  { id: 'json-formatter',    name: 'JSON Formatter',           description: 'Format, validate, and minify JSON with syntax error highlighting.',          category: 'Developer',     icon: '{ }', tags: ['json', 'format', 'validate', 'pretty print'], popular: true },
  { id: 'jwt-decoder',       name: 'JWT Decoder',              description: 'Decode and inspect JWT tokens — header, payload, expiry, and signature.',     category: 'Developer',     icon: '🔑',  tags: ['jwt', 'token', 'auth', 'decode'] },
  { id: 'regex-tester',      name: 'Regex Tester',             description: 'Test regular expressions with live match highlighting, flags, and groups.',    category: 'Developer',     icon: '.*',  tags: ['regex', 'regexp', 'pattern', 'match'], popular: true },
  { id: 'uuid-generator',    name: 'UUID Generator',           description: 'Generate v4 UUIDs in bulk. Copy one or all at once.',                         category: 'Developer',     icon: '⚡',  tags: ['uuid', 'guid', 'unique', 'id'], popular: true },
  { id: 'cron-parser',       name: 'Cron Parser',              description: 'Parse cron expressions into plain-English schedules with next run times.',     category: 'Developer',     icon: '⏱',  tags: ['cron', 'schedule', 'parse', 'job'] },
  { id: 'color-converter',   name: 'Color Converter',          description: 'Convert between HEX, RGB, HSL and CSS formats with a live color picker.',      category: 'Developer',     icon: '🎨',  tags: ['color', 'hex', 'rgb', 'hsl', 'css', 'picker'] },
  { id: 'diff-checker',      name: 'Text Diff',                description: 'Paste two texts and see line-by-line differences highlighted instantly.',      category: 'Developer',     icon: '↔',   tags: ['diff', 'compare', 'difference', 'text'] },
  { id: 'json-yaml',         name: 'JSON ↔ YAML',              description: 'Convert between JSON and YAML formats instantly, with bidirectional swap.',    category: 'Developer',     icon: '⇄',   tags: ['json', 'yaml', 'convert', 'transform'] },

  // Text
  { id: 'case-converter',    name: 'Case Converter',           description: 'Convert text to camelCase, snake_case, PascalCase, kebab-case and more.',     category: 'Text',          icon: 'Aa',  tags: ['case', 'camel', 'snake', 'pascal', 'kebab'], popular: true },
  { id: 'word-counter',      name: 'Word Counter',             description: 'Count words, characters, sentences, paragraphs, and reading time.',            category: 'Text',          icon: '📝',  tags: ['word count', 'character', 'paragraph', 'reading time'] },
  { id: 'text-stats',        name: 'Text Statistics',          description: 'Deep text analysis: unique words, letter frequency, avg word length and more.', category: 'Text',         icon: '📊',  tags: ['text', 'stats', 'frequency', 'analysis', 'counter'], new: true },
  { id: 'lorem-ipsum',       name: 'Lorem Ipsum',              description: 'Generate placeholder text by words, sentences, or paragraphs.',                category: 'Text',          icon: '¶',   tags: ['lorem', 'ipsum', 'placeholder', 'dummy text'] },
  { id: 'markdown-preview',  name: 'Markdown Preview',         description: 'Write Markdown on the left, see the rendered preview live on the right.',      category: 'Text',          icon: 'MD',  tags: ['markdown', 'preview', 'render', 'md'] },
  { id: 'string-escape',     name: 'String Escape / Unescape', description: 'Escape or unescape strings for JSON, HTML, URL, and SQL contexts.',           category: 'Text',          icon: '\\"', tags: ['escape', 'unescape', 'string', 'html entities'] },
  { id: 'text-to-slug',      name: 'Text to Slug',             description: 'Convert any title or phrase into a clean URL slug (-, _, or .) separator.',   category: 'Text',          icon: '🔗',  tags: ['slug', 'url', 'permalink', 'seo', 'kebab'], new: true },
  { id: 'line-sorter',       name: 'Line Sorter',              description: 'Sort lines A-Z, by length, reverse, shuffle, and remove duplicates.',         category: 'Text',          icon: '≡',   tags: ['sort', 'lines', 'deduplicate', 'order', 'arrange'], new: true },
  { id: 'morse-code',        name: 'Morse Code',               description: 'Convert text to Morse code or decode Morse to text. Play audio.',             category: 'Text',          icon: '·−',  tags: ['morse', 'code', 'telegraph', 'encode', 'decode'], new: true },

  // Security
  { id: 'password-generator',name: 'Password Generator',       description: 'Generate strong random passwords with custom length and character sets.',      category: 'Security',      icon: '🔐',  tags: ['password', 'random', 'secure', 'generate'], popular: true },
  { id: 'hash-generator',    name: 'Hash Generator',           description: 'Generate SHA-1, SHA-256, SHA-384, SHA-512 hashes from any text.',             category: 'Security',      icon: '#',   tags: ['hash', 'sha', 'sha256', 'sha512', 'checksum'] },
  { id: 'bcrypt',            name: 'Bcrypt Hash & Verify',     description: 'Hash passwords with bcrypt and verify hashes — all in your browser.',         category: 'Security',      icon: '🔒',  tags: ['bcrypt', 'hash', 'password', 'verify'] },
  { id: 'base64',            name: 'Base64 Encode / Decode',   description: 'Encode and decode text to/from Base64 — live as you type.',                   category: 'Security',      icon: '64',  tags: ['base64', 'encode', 'decode'], popular: true },

  // Converter
  { id: 'csv-json',          name: 'CSV ↔ JSON',               description: 'Convert CSV to JSON array or JSON array back to CSV with auto-headers.',      category: 'Converter',     icon: '📋',  tags: ['csv', 'json', 'table', 'convert'] },
  { id: 'unix-timestamp',    name: 'Unix Timestamp',           description: 'Convert between Unix timestamps and human-readable dates. Use current time.', category: 'Converter',     icon: '📅',  tags: ['unix', 'timestamp', 'date', 'epoch', 'time'] },
  { id: 'number-base',       name: 'Number Base Converter',    description: 'Convert numbers between binary, octal, decimal, and hexadecimal.',            category: 'Converter',     icon: '01',  tags: ['binary', 'octal', 'hex', 'decimal', 'base'] },
  { id: 'url-encode',        name: 'URL Encode / Decode',      description: 'Encode and decode URLs and query strings — live as you type.',                category: 'Converter',     icon: '🌐',  tags: ['url', 'encode', 'decode', 'percent encoding'] },
  { id: 'html-entity',       name: 'HTML Entity Encode',       description: 'Encode/decode HTML special characters like & < > " \'.',                     category: 'Converter',     icon: '&',   tags: ['html', 'entity', 'encode', 'decode', 'escape'] },

  // Network
  { id: 'ip-lookup',         name: 'IP Lookup',                description: 'Look up geolocation, ISP, timezone, and info for any IP address.',           category: 'Network',       icon: '📡',  tags: ['ip', 'geolocation', 'lookup', 'isp', 'location'] },
  { id: 'http-status',       name: 'HTTP Status Codes',        description: 'Quick reference for all HTTP status codes with descriptions and categories.', category: 'Network',       icon: '200', tags: ['http', 'status', 'codes', '404', '200', '500'] },
  { id: 'url-parser',        name: 'URL Parser',               description: 'Break any URL into protocol, host, path, query params, and fragment.',        category: 'Network',       icon: '🔗',  tags: ['url', 'parse', 'query', 'params', 'path'] },

  // Image & Media
  { id: 'qr-generator',      name: 'QR Code Generator',        description: 'Generate QR codes for URLs, text, emails, or phone numbers. Download PNG.', category: 'Image & Media', icon: '▦',   tags: ['qr', 'qr code', 'barcode', 'scan'], popular: true },
  { id: 'svg-viewer',        name: 'SVG Viewer',               description: 'Paste SVG markup to preview it, inspect dimensions, and download.',          category: 'Image & Media', icon: '◈',   tags: ['svg', 'preview', 'vector', 'image'] },
  { id: 'color-palette',     name: 'Color Palette Generator',  description: 'Generate a full 50–950 shade palette from any base color. Export to CSS or Tailwind.', category: 'Image & Media', icon: '🎨', tags: ['color', 'palette', 'tailwind', 'css', 'shades', 'design'], new: true },

  // Math
  { id: 'percentage-calc',   name: 'Percentage Calculator',    description: 'Three modes: % of number, what %, and % change between two values.',          category: 'Math',          icon: '%',   tags: ['percent', 'percentage', 'calculate', 'math'] },
  { id: 'unit-converter',    name: 'Unit Converter',           description: 'Convert length, weight, temperature, volume, area, and speed.',               category: 'Math',          icon: '📐',  tags: ['unit', 'convert', 'metric', 'imperial', 'length', 'weight', 'temp'] },
  { id: 'random-number',     name: 'Random Number Generator',  description: 'Generate random numbers with custom range, count, decimals, and uniqueness.', category: 'Math',          icon: '🎲',  tags: ['random', 'number', 'generate', 'dice', 'range'], new: true },

  // AI-Powered
  { id: 'ai-text-improver',  name: 'AI Text Improver',         description: 'Paste any text and get it rewritten for clarity, tone, or brevity.',          category: 'AI-Powered',    icon: '✨',  tags: ['ai', 'rewrite', 'improve', 'grammar', 'clarity'], popular: true },
  { id: 'ai-regex-builder',  name: 'AI Regex Builder',         description: 'Describe what you want to match in plain English — get a working regex.',     category: 'AI-Powered',    icon: '🤖',  tags: ['ai', 'regex', 'natural language', 'generate'] },
  { id: 'ai-json-fixer',     name: 'AI JSON Fixer',            description: 'Paste broken JSON and AI repairs it, explaining exactly what was wrong.',     category: 'AI-Powered',    icon: '🛠',  tags: ['ai', 'json', 'fix', 'repair', 'validate'] },
  { id: 'ai-summarizer',     name: 'AI Summarizer',            description: 'Paste any article or document and get a clean bullet-point summary.',         category: 'AI-Powered',    icon: '📋',  tags: ['ai', 'summarize', 'summary', 'tldr', 'abstract'] },
  { id: 'ai-code-explainer', name: 'AI Code Explainer',        description: 'Paste any code snippet and get a plain-English explanation of what it does.', category: 'AI-Powered',    icon: '💡',  tags: ['ai', 'code', 'explain', 'documentation', 'comment'] },
]

export const CATEGORIES: Category[] = [
  'Developer', 'Text', 'Security', 'Converter', 'Network', 'Image & Media', 'Math', 'AI-Powered'
]
