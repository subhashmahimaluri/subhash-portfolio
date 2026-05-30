# Architecture

Technical architecture for the **Subhash Mahimaluri resume website** — a Next.js 16 App Router application that renders a single source of resume data into five country-tailored web pages and on-demand PDFs, plus a React/JavaScript interview-questions reference.

---

## 1. Overview

This is a **content-driven, statically-generated site** with two server-rendered PDF endpoints. There is no database, no authentication, and no client-side state management. All content lives in version-controlled JSON and Markdown files; the application's job is to transform that content into:

1. **HTML pages** — pre-rendered at build time (SSG) for each market.
2. **PDF documents** — generated on demand at request time via headless Chromium.

The central architectural idea is **one base dataset + per-country overrides**. A single [base.json](lib/data/resume/base.json) holds the canonical resume; small override files reshape it for each target market without duplicating content.

| Property        | Value                                             |
| --------------- | ------------------------------------------------- |
| Framework       | Next.js 16.1 (App Router, React 19 Server Components) |
| Language        | TypeScript 5.7 (strict mode)                      |
| Styling         | Tailwind CSS 3.4                                  |
| PDF engine      | Puppeteer 23 (headless Chromium)                  |
| Rendering       | SSG for pages, `force-dynamic` for PDF routes     |
| Output          | `standalone` (self-contained Node server)         |
| Deployment      | Docker (multi-stage), port `3005`                 |
| Persistence     | None — flat JSON/Markdown files                   |

---

## 2. High-Level Architecture

```
                          ┌─────────────────────────────────────────┐
                          │          Content (source of truth)       │
                          │                                          │
                          │  lib/data/resume/base.json   (canonical) │
                          │  lib/data/resume/<country>.json (deltas) │
                          │  lib/data/portfolio/projects.json        │
                          │  data/interview-questions.md             │
                          └────────────────────┬─────────────────────┘
                                               │
                  ┌────────────────────────────┼────────────────────────────┐
                  │                            │                            │
                  ▼                            ▼                            ▼
        ┌──────────────────┐        ┌────────────────────┐       ┌────────────────────┐
        │  resume-loader   │        │ parse-interview-   │       │  direct JSON import │
        │  deepMerge +     │        │ questions (regex   │       │  (portfolio)        │
        │  truncate        │        │ Markdown parser)   │       │                     │
        └────────┬─────────┘        └─────────┬──────────┘       └─────────┬──────────┘
                 │                            │                            │
   ┌─────────────┼─────────────┐   ┌──────────┼──────────┐                 │
   ▼             ▼             ▼   ▼          ▼          ▼                 ▼
┌────────┐ ┌──────────┐  ┌──────────┐  ┌──────────┐ ┌──────────┐    ┌──────────┐
│ /resume│ │ /api/    │  │ /react-  │  │ /api/    │ │ Interview│    │/portfolio│
│/[ctry] │ │ resume-  │  │interview-│  │interview-│ │ Client   │    │          │
│ (SSG)  │ │ pdf (GET)│  │questions │  │ pdf (GET)│ │ Page     │    │          │
└────────┘ └────┬─────┘  └──────────┘  └────┬─────┘ └──────────┘    └──────────┘
   HTML         │ HTML→PDF                   │ HTML→PDF
                ▼                            ▼
          ┌──────────────────────────────────────┐
          │   Puppeteer (headless Chromium)       │
          │   page.setContent(html) → page.pdf()  │
          └──────────────────────────────────────┘
```

**Two distinct rendering paths share the same data but not the same templates:**

- **Web pages** are React Server Components styled with Tailwind utility classes.
- **PDFs** are produced from **hand-written HTML+CSS string templates** embedded directly in the API route handlers (print-optimized, A4, inline styles). The web JSX and the PDF HTML are maintained separately and intentionally diverge in layout.

---

## 3. Directory Structure

```
.
├── app/                              # Next.js App Router (routes + route handlers)
│   ├── layout.tsx                    # Root layout: global metadata, fonts, <html>
│   ├── page.tsx                      # Home / landing page
│   ├── globals.css                   # Tailwind layers + print utilities
│   ├── resume/
│   │   ├── page.tsx                  # Country selector
│   │   └── [country]/page.tsx        # Country resume (SSG via generateStaticParams)
│   ├── react-interview-questions/
│   │   ├── page.tsx                  # Server page: parses MD, passes to client
│   │   └── InterviewClientPage.tsx   # Client component: interactive filtering/UI
│   ├── portfolio/page.tsx            # Portfolio (imports projects.json directly)
│   ├── education/page.tsx            # Education & certifications
│   ├── contact/page.tsx              # Contact information
│   └── api/
│       ├── resume-pdf/route.ts       # GET → country resume PDF
│       └── interview-pdf/route.ts    # GET → interview questions PDF
│
├── lib/
│   ├── data/
│   │   ├── resume-loader.ts          # Core: merge base + overrides, truncate
│   │   ├── resume/                   # base.json + india/uae/germany/uk/eu.json
│   │   └── portfolio/projects.json   # Portfolio content
│   ├── utils/
│   │   ├── deep-merge.ts             # Recursive object merge (arrays replaced)
│   │   └── parse-interview-questions.ts  # Markdown → structured categories
│   └── config/                       # ⚠ Reference-only — see §9
│       ├── country-compliance.ts     # Per-country resume rules (not wired in)
│       └── design-tokens.ts          # Per-country style tokens (not wired in)
│
├── types/                            # TypeScript contracts
│   ├── resume.ts                     # BaseResumeData, CountryOverrides, Country
│   ├── ats-resume.ts                 # Compliance/design-token types
│   └── portfolio.ts                  # Portfolio shapes
│
├── data/                             # Raw author content
│   ├── interview-questions.md        # Source for interview subsystem
│   ├── PROFESSIONAL_SUMMARY.md
│   └── photo.jpg
│
├── public/                           # Static assets (served as-is)
├── Dockerfile                        # Multi-stage production image
├── docker-compose.yml                # Single-service deployment + healthcheck
└── next.config.ts                    # standalone output, security headers, images
```

---

## 4. Core Subsystem: Resume Data & Country Customization

This is the heart of the application. See [resume-loader.ts](lib/data/resume-loader.ts).

### 4.1 The base + override model

- [base.json](lib/data/resume/base.json) is the **single source of truth** — the full, canonical resume (personal info, experience, skills, education, certifications, languages).
- Each country file ([india.json](lib/data/resume/india.json), [uae.json](lib/data/resume/uae.json), [germany.json](lib/data/resume/germany.json), [uk.json](lib/data/resume/uk.json), [eu.json](lib/data/resume/eu.json)) is a **sparse delta** — it contains only the fields that differ for that market (e.g. a market-specific `summary`, `title`, `phone`, `location`, `workAuthorization`).

### 4.2 The merge pipeline

```
getResumeData(country)
   │
   ├─ base = base.json
   ├─ overrides = countryOverrides[country]
   │
   ├─ extract truncateExperience    ← control field, removed before merge
   │
   ├─ deepMerge(base, overrides)    ← objects merged recursively;
   │                                   arrays & scalars REPLACED wholesale
   │
   └─ if truncateCount:  merged.experience = experience.slice(0, N)
                                            ← condenses to 2-page formats
```

[deep-merge.ts](lib/utils/deep-merge.ts) implements the rule precisely: nested **objects** recurse and merge; **arrays and primitives are replaced**, never concatenated. This means an override either leaves an array untouched (omit it) or supplies the complete replacement.

`truncateExperience` is a **control field, not resume content**. It is read off the override and deleted before merging, then applied afterward to cap the number of experience entries — this is how GDPR/concise markets (UK, Germany, EU) compress to 2 pages while detailed markets (India, UAE) keep the full history.

### 4.3 Supported countries

`Country = 'india' | 'uae' | 'germany' | 'uk' | 'eu'` is defined once in [resume.ts](types/resume.ts) and threaded through the loader, the dynamic route's `generateStaticParams`, and the PDF route. Adding a market = adding the enum member, the JSON file, and a label in `COUNTRIES`.

### 4.4 Per-country rendering branches

Beyond data merging, the page and PDF templates contain a few **hard-coded country conditionals**:

- Certifications section is hidden for `uk`.
- An "Availability & Engagement Model" section renders only for `uae`.
- Work authorization renders only when present in the merged data.

---

## 5. Core Subsystem: PDF Generation

Two route handlers ([resume-pdf/route.ts](app/api/resume-pdf/route.ts) and [interview-pdf/route.ts](app/api/interview-pdf/route.ts)) produce PDFs. Both follow the same pattern and are marked `export const dynamic = 'force-dynamic'` (never cached/prerendered).

```
GET /api/resume-pdf?country=uae
   │
   ├─ getResumeData(country)              ← same loader as the web page
   ├─ generateResumeHTML(data, country)   ← inline HTML+CSS string template
   ├─ puppeteer.launch({ headless, --no-sandbox, ... })
   ├─ page.setContent(html, waitUntil: 'networkidle0')
   ├─ page.pdf({ format: 'A4', printBackground, 15mm margins })
   ├─ browser.close()
   └─ NextResponse(Buffer.from(pdf), Content-Type: application/pdf,
                                     Content-Disposition: attachment)
```

Key design points:

- **The PDF HTML is generated, not reused from React.** Each route embeds a complete print-tuned stylesheet (point-based sizing, `page-break-*` rules, navy/black palette). This keeps PDFs ATS-friendly and independent of the screen layout.
- **Markdown bolding** (`**text**`) is supported in both web (`parseMarkdownBold` → JSX `<strong>`) and PDF (`parseMarkdownBold` → `<strong>` HTML).
- **Chromium is launched per request** with hardened flags (`--no-sandbox`, `--disable-dev-shm-usage`, `--disable-gpu`) so it runs inside the locked-down container. In production, Puppeteer uses the **system Chromium** installed in the image rather than downloading its own (see §8).
- Defaults: `resume-pdf` falls back to `uae` when no `country` query param is supplied.

---

## 6. Core Subsystem: Interview Questions

A self-contained reference feature with its own parser. Source content is authored as freeform Markdown in [data/interview-questions.md](data/interview-questions.md).

```
data/interview-questions.md
   │
   ▼
parse-interview-questions.ts        ← line-by-line regex state machine
   │   recognizes section headers ("React Question for Interview",
   │   "Advanced JavaScript", "Coding Challenge"), question numbers,
   │   and field labels (You ask / Follow-ups / Strong answer /
   │   Weak answer / Red flag / Answer / Follow-up)
   ▼
InterviewCategory[]  { title, type: 'interview'|'coding', questions[] }
   │
   ├──────────────────────────────┬───────────────────────────────┐
   ▼                              ▼                               ▼
/react-interview-questions    InterviewClientPage          /api/interview-pdf
(server page)                 (client interactivity)       (Puppeteer → PDF)
```

[parse-interview-questions.ts](lib/utils/parse-interview-questions.ts) is a **bespoke line-by-line state machine** — it tracks the current category, question, and field as it scans, branching on interview-style Q&A vs. coding challenges. It runs at the server boundary: the page parses on the server and hands a typed `InterviewCategory[]` to the client component for interactive rendering; the PDF route parses independently and renders to print HTML.

---

## 7. Routing & Rendering Strategy

| Route                          | Type          | Rendering                              |
| ------------------------------ | ------------- | -------------------------------------- |
| `/`                            | Page          | Static                                 |
| `/resume`                      | Page          | Static (country selector)              |
| `/resume/[country]`            | Dynamic page  | **SSG** via `generateStaticParams` (5 pages pre-rendered) |
| `/react-interview-questions`   | Page          | Server-parsed, client-interactive      |
| `/portfolio`, `/education`, `/contact` | Page  | Static                                 |
| `/api/resume-pdf`              | Route handler | **Dynamic** (`force-dynamic`)          |
| `/api/interview-pdf`           | Route handler | **Dynamic** (`force-dynamic`)          |

- `app/resume/[country]/page.tsx` calls `generateStaticParams()` → `['india','uae','germany','uk','eu']`, so all five resume pages are baked at build time. Unknown countries hit `notFound()`.
- Per-page SEO is set via `generateMetadata`, inheriting the root template (`%s | Subhash Mahimaluri`) from [layout.tsx](app/layout.tsx), which also configures OpenGraph, Twitter cards, robots, and `metadataBase`.

---

## 8. Build & Deployment

### 8.1 Next.js output

[next.config.ts](next.config.ts) sets `output: 'standalone'`, producing a self-contained `.next/standalone` bundle with a minimal `server.js` and only the dependencies it traces. It also enables compression, strips the `X-Powered-By` header, configures AVIF/WebP image formats, and adds baseline security headers (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, DNS prefetch control) to all routes.

### 8.2 Docker (multi-stage)

[Dockerfile](Dockerfile) uses three stages:

```
deps     (node:20-alpine)  → npm ci --only=production
builder  (node:20-alpine)  → npm ci + npm run build  → .next/standalone
runner   (node:20-alpine)  → install system Chromium + fonts,
                             copy standalone output, run as non-root `nextjs`
```

The runner stage is the architecturally significant one: it installs **system Chromium** and font packages, then sets `PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true` and `PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser`. This is what lets the PDF subsystem (§5) work inside a slim Alpine image without bundling Puppeteer's own ~170 MB Chromium download. The app runs as an unprivileged user and exposes port `3005`.

[docker-compose.yml](docker-compose.yml) wires a single `resume-app` service with `restart: unless-stopped` and an HTTP healthcheck against `localhost:3005`.

### 8.3 Configuration / environment

Public config (site URL/name, contact details, Calendly) is supplied via `NEXT_PUBLIC_*` env vars; see [.env.local.example](.env.local.example). There are no secrets — all data is public by design.

---

## 9. Notable Architecture Observations

These are intentional notes for future maintainers, reflecting the code as it actually stands today:

1. **`lib/config/` is reference-only / aspirational.** [country-compliance.ts](lib/config/country-compliance.ts) (per-country ATS rules, section ordering, photo/DOB policy) and [design-tokens.ts](lib/config/design-tokens.ts) (per-country fonts, spacing, colors) are richly modeled but **not imported by any page, route, or loader**. The *actual* country behavior is driven by the JSON deep-merge in [resume-loader.ts](lib/data/resume-loader.ts) plus a handful of inline conditionals in the templates. These modules document the *intended* compliance model and are a natural extension point — wiring them into the renderers would let layout/section-order/personal-data rules be data-driven rather than hard-coded.

2. **Web and PDF templates are duplicated by design.** The resume exists as React JSX (screen) *and* as a separate inline HTML string (print). They share data via the loader but not markup. Changes to resume layout must be made in both places.

3. **No tests, no client data fetching, no runtime mutations.** The app is effectively a deterministic function of its content files. This keeps the runtime trivial but means content edits require a rebuild for the SSG pages (PDFs reflect changes immediately since they're dynamic).

4. **The interview parser is tightly coupled to the Markdown format.** [parse-interview-questions.ts](lib/utils/parse-interview-questions.ts) relies on exact header strings and field labels in [interview-questions.md](data/interview-questions.md). Editing that file requires preserving its conventions (`You ask:`, `Strong answer:`, `Red flag:`, `⸻` separators, `Coding Challenge`).

---

## 10. Request-to-Render Summary

**Static page (build time):**
```
build → generateStaticParams → getResumeData(country) → deepMerge + truncate
      → React Server Component → HTML pre-rendered to disk
```

**PDF (request time):**
```
GET /api/resume-pdf?country=X → getResumeData(X) → generateResumeHTML
      → Puppeteer.setContent → page.pdf → PDF stream to browser
```

Both branches converge on the **same `getResumeData` loader**, which is the one piece of logic guaranteeing the web page and the downloadable PDF always describe the same underlying resume.
