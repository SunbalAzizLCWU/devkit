# DevKit ⚡

A fast, free, privacy-first collection of tools for developers and everyone.
All processing happens in your browser — nothing is ever sent to a server (except the AI-powered tools which use the Anthropic API).

## Tools Included

### Developer
- JSON Formatter & Validator
- JWT Decoder
- UUID Generator
- Cron Expression Parser *(coming soon)*
- Color Converter *(coming soon)*
- Text Diff Checker *(coming soon)*

### Text
- Case Converter (camelCase, snake_case, PascalCase, kebab-case, and more)
- Word & Character Counter
- Lorem Ipsum Generator
- Markdown Preview *(coming soon)*
- String Escape/Unescape *(coming soon)*

### Security
- Password Generator (with strength meter)
- Hash Generator (SHA-1, SHA-256, SHA-384, SHA-512)
- Bcrypt Hash & Verify *(coming soon)*
- Base64 Encode / Decode

### Converter
- JSON ↔ YAML *(coming soon)*
- CSV ↔ JSON *(coming soon)*
- Unix Timestamp Converter
- Number Base Converter (binary/octal/decimal/hex)
- URL Encode / Decode
- HTML Entity Encode *(coming soon)*

### Network
- IP Lookup *(coming soon)*
- HTTP Status Codes Reference
- URL Parser *(coming soon)*

### Image & Media
- QR Code Generator
- SVG Viewer *(coming soon)*

### AI-Powered (uses Anthropic API)
- AI Text Improver
- AI Regex Builder
- AI JSON Fixer

---

## Tech Stack

- **Framework:** Next.js 14 (App Router, static export)
- **Styling:** Tailwind CSS + CSS Variables (light/dark theme)
- **Fonts:** Inter + JetBrains Mono
- **Theme:** next-themes
- **Deployment:** Cloudflare Pages (free tier)

---

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deploy to Cloudflare Pages

1. Push this repo to GitHub
2. Go to [Cloudflare Pages](https://pages.cloudflare.com/)
3. Create a new project → connect your GitHub repo
4. Set build settings:
   - **Build command:** `npm run build`
   - **Output directory:** `out`
5. Hit **Save and Deploy**

### Optional: Mount at a subdirectory (e.g. `yourdomain.com/tools`)

See the `cloudflare-worker.js` file for a Worker proxy script.

---

## Adding a New Tool

1. Add the tool entry to `src/lib/tools.ts`
2. Create a component in `src/components/tools/YourTool.tsx`
3. Import and register it in `src/app/tools/[id]/page.tsx`

---

## Contributing

PRs welcome! Open an issue to suggest a new tool.
