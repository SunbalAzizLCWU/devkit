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
  { id: 'json-formatter', name: 'JSON Formatter', description: 'Format, validate, and minify JSON. Highlight syntax errors instantly.', category: 'Developer', icon: '{ }', tags: ['json', 'format', 'validate', 'pretty print'], popular: true },
  { id: 'jwt-decoder', name: 'JWT Decoder', description: 'Decode and inspect JWT tokens — header, payload, and signature.', category: 'Developer', icon: '🔑', tags: ['jwt', 'token', 'auth', 'decode'] },
  { id: 'regex-tester', name: 'Regex Tester', description: 'Test regular expressions with live match highlighting and flags.', category: 'Developer', icon: '.*', tags: ['regex', 'regexp', 'pattern', 'match'], popular: true },
  { id: 'uuid-generator', name: 'UUID Generator', description: 'Generate v4 UUIDs in bulk. Copy one or all at once.', category: 'Developer', icon: '⚡', tags: ['uuid', 'guid', 'unique', 'id'], popular: true },
  { id: 'cron-parser', name: 'Cron Expression Parser', description: 'Parse cron expressions into human-readable schedules.', category: 'Developer', icon: '⏱', tags: ['cron', 'schedule', 'parse', 'job'] },
  { id: 'color-converter', name: 'Color Converter', description: 'Convert between HEX, RGB, HSL, and CSS color formats.', category: 'Developer', icon: '🎨', tags: ['color', 'hex', 'rgb', 'hsl', 'css'] },
  { id: 'diff-checker', name: 'Text Diff Checker', description: 'Compare two texts side-by-side and highlight what changed.', category: 'Developer', icon: '↔', tags: ['diff', 'compare', 'difference', 'text'] },

  // Text
  { id: 'case-converter', name: 'Case Converter', description: 'Convert text to camelCase, snake_case, PascalCase, kebab-case, UPPER, lower.', category: 'Text', icon: 'Aa', tags: ['case', 'camel', 'snake', 'pascal', 'kebab', 'convert'], popular: true },
  { id: 'word-counter', name: 'Word & Char Counter', description: 'Count words, characters, sentences, paragraphs, and reading time.', category: 'Text', icon: '📝', tags: ['word count', 'character', 'paragraph', 'reading time'] },
  { id: 'lorem-ipsum', name: 'Lorem Ipsum Generator', description: 'Generate placeholder text by words, sentences, or paragraphs.', category: 'Text', icon: '¶', tags: ['lorem', 'ipsum', 'placeholder', 'dummy text'] },
  { id: 'markdown-preview', name: 'Markdown Preview', description: 'Write Markdown and see the live rendered HTML preview.', category: 'Text', icon: 'MD', tags: ['markdown', 'preview', 'render', 'md'] },
  { id: 'text-diff', name: 'String Escape/Unescape', description: 'Escape or unescape strings for JSON, HTML, URL, and SQL.', category: 'Text', icon: '\\"', tags: ['escape', 'unescape', 'string', 'html entities'] },

  // Security
  { id: 'password-generator', name: 'Password Generator', description: 'Generate strong, random passwords with custom length and character sets.', category: 'Security', icon: '🔐', tags: ['password', 'random', 'secure', 'generate'], popular: true },
  { id: 'hash-generator', name: 'Hash Generator', description: 'Generate MD5, SHA-1, SHA-256, SHA-512 hashes from any text.', category: 'Security', icon: '#', tags: ['hash', 'md5', 'sha', 'sha256', 'sha512'] },
  { id: 'bcrypt', name: 'Bcrypt Hash & Verify', description: 'Hash passwords with bcrypt and verify hashes — all in your browser.', category: 'Security', icon: '🔒', tags: ['bcrypt', 'hash', 'password', 'verify'] },
  { id: 'base64', name: 'Base64 Encode / Decode', description: 'Encode and decode text or files to/from Base64.', category: 'Security', icon: '64', tags: ['base64', 'encode', 'decode'], popular: true },

  // Converter
  { id: 'json-yaml', name: 'JSON ↔ YAML', description: 'Convert between JSON and YAML formats instantly.', category: 'Converter', icon: '⇄', tags: ['json', 'yaml', 'convert', 'transform'] },
  { id: 'csv-json', name: 'CSV ↔ JSON', description: 'Convert CSV data to JSON and back with column mapping.', category: 'Converter', icon: '📊', tags: ['csv', 'json', 'table', 'convert'] },
  { id: 'unix-timestamp', name: 'Unix Timestamp Converter', description: 'Convert between Unix timestamps and human-readable dates.', category: 'Converter', icon: '📅', tags: ['unix', 'timestamp', 'date', 'epoch', 'time'] },
  { id: 'number-base', name: 'Number Base Converter', description: 'Convert numbers between binary, octal, decimal, and hexadecimal.', category: 'Converter', icon: '01', tags: ['binary', 'octal', 'hex', 'decimal', 'base', 'convert'] },
  { id: 'url-encode', name: 'URL Encode / Decode', description: 'Encode and decode URLs and query strings.', category: 'Converter', icon: '🌐', tags: ['url', 'encode', 'decode', 'percent encoding'] },
  { id: 'html-entity', name: 'HTML Entity Encode', description: 'Encode/decode HTML entities like &amp; &lt; &gt;', category: 'Converter', icon: '&', tags: ['html', 'entity', 'encode', 'decode', 'escape'] },

  // Network
  { id: 'ip-info', name: 'IP Lookup', description: 'Look up geolocation, ISP, and info for any IP address.', category: 'Network', icon: '📡', tags: ['ip', 'geolocation', 'lookup', 'dns', 'isp'] },
  { id: 'http-status', name: 'HTTP Status Codes', description: 'Quick reference for all HTTP status codes with descriptions.', category: 'Network', icon: '200', tags: ['http', 'status', 'codes', '404', '200', '500'] },
  { id: 'url-parser', name: 'URL Parser', description: 'Break a URL into its components — protocol, host, path, params.', category: 'Network', icon: '🔗', tags: ['url', 'parse', 'query', 'params', 'path'] },

  // Image & Media
  { id: 'qr-generator', name: 'QR Code Generator', description: 'Generate QR codes for any URL, text, email, or phone number.', category: 'Image & Media', icon: '▦', tags: ['qr', 'qr code', 'barcode', 'scan'], popular: true },
  { id: 'svg-optimizer', name: 'SVG Viewer & Info', description: 'Paste SVG markup to preview it and inspect its dimensions.', category: 'Image & Media', icon: '◈', tags: ['svg', 'preview', 'vector', 'image'] },

  // Math
  { id: 'percentage-calc', name: 'Percentage Calculator', description: 'Calculate percentages, percentage changes, and percentage of totals.', category: 'Math', icon: '%', tags: ['percent', 'percentage', 'calculate', 'math'] },
  { id: 'unit-converter', name: 'Unit Converter', description: 'Convert length, weight, temperature, volume, and area units.', category: 'Math', icon: '📐', tags: ['unit', 'convert', 'metric', 'imperial', 'length', 'weight', 'temperature'] },

  // AI-Powered
  { id: 'ai-text-improver', name: 'AI Text Improver', description: 'Paste any text and get it rewritten for clarity, tone, or brevity.', category: 'AI-Powered', icon: '✨', tags: ['ai', 'rewrite', 'improve', 'grammar', 'clarity'], new: true },
  { id: 'ai-regex-builder', name: 'AI Regex Builder', description: 'Describe what you want to match in plain English — get a regex.', category: 'AI-Powered', icon: '🤖', tags: ['ai', 'regex', 'natural language', 'generate'], new: true },
  { id: 'ai-json-fixer', name: 'AI JSON Fixer', description: 'Paste broken JSON and AI will repair and explain what was wrong.', category: 'AI-Powered', icon: '🛠', tags: ['ai', 'json', 'fix', 'repair', 'validate'], new: true },
]

export const CATEGORIES: Category[] = [
  'Developer', 'Text', 'Security', 'Converter', 'Network', 'Image & Media', 'Math', 'AI-Powered'
]
