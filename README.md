<div align="center">

# apply

**Paste a job posting. Get a tailored resume, cover letter, and a shortlist of people worth reaching out to.**

A personal job-application agent built on Claude, wrapped in a minimal, deliberately-animated interface.

<br />

![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?style=flat-square&logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Claude](https://img.shields.io/badge/Claude-Sonnet_4.5-D97757?style=flat-square)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?style=flat-square&logo=vercel&logoColor=white)

<br />

[Why this exists](#why-this-exists) · [How it works](#how-it-works) · [Quickstart](#quickstart) · [Deploy](#deploy) · [Architecture](#architecture)

</div>

---

## Why this exists

Applying to jobs well is mechanical but tedious: read the posting, honestly assess fit, tailor the resume without lying, write a cover letter that doesn't sound like a cover letter, figure out who to reach out to, log it all somewhere. This tool runs that pipeline end-to-end in ~45 seconds, with you staying in the loop at every step.

It's not a "let the AI apply for you" toy. Every stage is reviewable, editable, and grounded in a hardcoded persona — the model can't invent experience it doesn't have.

## How it works

```
URL → Scrape → Fit Check → Tailor → Networking → Log
```

1. **Scrape** — Jina Reader (primary, free) pulls the job posting as clean markdown. Firecrawl is the fallback for sites Jina can't reach.
2. **Fit Check** — Claude extracts role details and scores you against the must-haves. Returns strengths, gaps, and hard blockers separately.
3. **Tailor** — Claude rewrites your summary, skills, four experience sections, projects, cover letter hook, and full cover letter — grounded strictly in the persona. Also projects what your fit score *would* be with these edits applied.
4. **Networking** — Claude proposes 3–5 archetypes of people worth reaching out to at this company, with deep-linked LinkedIn search URLs, a warm-but-short draft message, and the likely email pattern.
5. **Log** — POSTs the whole thing to a Google Apps Script webhook, which appends a row to your tracking sheet.

The flow is strictly stepped — you read the fit, decide whether to continue, review the resume, advance to networking, review that, and only then log. Back and Continue at every step. Results are cached, so Back is instant.

## Screenshots

> _Screenshots go here once deployed. The app is five views:_
> _1. **Link** — centered input, large "apply" wordmark with blur-in entrance._
> _2. **Captured** — what the scraper pulled, with source indicator._
> _3. **Fit** — animated score ring (0 → actual score count-up), verdict chip, side-by-side "Why it fits" vs "Gaps", hard-blocker warnings._
> _4. **Resume** — baseline → projected score with animated dual-fill bar, all resume sections as copyable blocks, full cover letter._
> _5. **Network** — 3–5 targets with LinkedIn deep-links, copyable draft message, email pattern guess._

## Quickstart

```bash
git clone https://github.com/<you>/apply.git
cd apply
npm install
cp .env.example .env.local        # fill in the keys
npm run dev                       # http://localhost:5173
```

`npm run dev` is all you need — Vite serves the frontend, and a built-in middleware adapts the `api/*.ts` serverless handlers so everything runs in one process. No `vercel dev` required for local development.

## Environment variables

Create `.env.local` from `.env.example` and fill in:

| Variable | Required | What it's for |
|---|---|---|
| `ANTHROPIC_API_KEY` | **Yes** | Claude calls for fit check, tailoring, networking. Get one at [console.anthropic.com](https://console.anthropic.com/). |
| `FIRECRAWL_API_KEY` | No | Fallback scraper when Jina can't reach a posting (e.g. some LinkedIn / workday pages). Get one at [firecrawl.dev](https://firecrawl.dev/). |
| `VITE_SHEETS_WEBHOOK_URL` | Yes (for logging) | Google Apps Script web-app URL. Setup below. |
| `ANTHROPIC_MODEL` | No | Override the Claude model. Defaults to `claude-sonnet-4-5`. |
| `JINA_API_KEY` | No | Raises Jina's free tier rate limits. Not required for personal use. |

## Google Sheets webhook

The Log step POSTs to a Google Apps Script endpoint that writes a row to your personal tracking sheet.

1. Create a new Google Sheet.
2. **Extensions → Apps Script**, paste:

   ```js
   function doPost(e) {
     var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Applications')
       || SpreadsheetApp.getActiveSpreadsheet().insertSheet('Applications');
     if (sheet.getLastRow() === 0) {
       sheet.appendRow([
         'Timestamp', 'Company', 'Role', 'Location', 'URL',
         'Fit Score', 'Verdict', 'Cover Letter', 'Networking Target', 'Status'
       ]);
     }
     var d = JSON.parse(e.postData.contents);
     sheet.appendRow([
       new Date(), d.company, d.role, d.location, d.url,
       d.fit_score, d.verdict, d.cover_letter_full,
       (d.targets || [])[0] ? d.targets[0].persona : '', 'Drafted'
     ]);
     return ContentService
       .createTextOutput(JSON.stringify({ ok: true }))
       .setMimeType(ContentService.MimeType.JSON);
   }
   ```

3. **Deploy → New deployment → Web app → Execute as: Me → Who has access: Anyone**.
4. Copy the `/exec` URL, paste it into `VITE_SHEETS_WEBHOOK_URL`.

## Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone)

1. Push this repo to your GitHub.
2. Import it at [vercel.com/new](https://vercel.com/new).
3. Add the environment variables above.
4. Deploy.

The `api/*.ts` files become Vercel serverless functions automatically. The frontend is a static build — nothing special needed.

## Architecture

```
┌─────────────────────┐       ┌──────────────────────────────┐
│   React (Vite)      │       │  Vercel Serverless Functions │
│   /src              │       │  /api                        │
│                     │       │                              │
│   useApplyFlow ─────┼──────▶│  /scrape  ───▶  Jina / Firecrawl
│   (stage machine)   │       │  /fit-check ──▶  Claude      │
│   zustand store     │       │  /tailor   ───▶  Claude      │
│                     │       │  /networking ─▶  Claude      │
│                     │       │  /save-to-sheet ─▶ Sheets webhook
└─────────────────────┘       └──────────────────────────────┘
```

**Key files**
- `src/lib/useApplyFlow.ts` — the state machine that drives the pipeline
- `src/lib/store.ts` — zustand store holding `stage` + all cached results
- `api/_lib/persona.ts` — the hardcoded candidate persona injected into every Claude call (kept inside `api/` so Vercel bundles it with the serverless functions)
- `api/_lib/prompts.ts` — the three Claude system prompts (fit, tailor, networking)
- `api/_lib/claude.ts` — shared Anthropic client + robust JSON extraction
- `api/_lib/scrapers.ts` — Jina-first with Firecrawl fallback
- `vite.config.ts` — the dev-only middleware that runs serverless handlers locally

**Tech**
- React 19 + Vite 8 + TypeScript (strict)
- Tailwind CSS with a deliberately-restrained palette (ink greys + a single papaya accent)
- Framer Motion for count-ups, staggered reveals, and page transitions
- Zustand for state; Sonner for toasts; Lucide for icons
- Anthropic SDK on the server

## Customizing the persona

This is a personal tool. The candidate persona is hardcoded in [`api/_lib/persona.ts`](api/_lib/persona.ts) — name, contact, education, skills, experience bullets, projects, research, differentiators. Every Claude prompt serializes this object and stamps it into the system message. To make this yours, replace the persona object and the prompts automatically pick it up.

Claude is instructed **never to invent experience** — only to reweight, rephrase, and reorder what's in the persona. Metrics and outcomes that aren't in the persona won't show up in the tailored resume.

## Design notes

The interface is intentionally quiet. Motion is used to communicate state, not decorate:
- A bright shimmer sweep across the active step segment signals "something is working."
- Three pulsing dots + a cycling status message during each loading stage make the thinking visible.
- The **baseline → projected** score bar on the resume page shows the lift explicitly, so you never mistake the tailored score for your current fit.
- Every view is a full page — no mega-stacks that disrupt the read.
- Back and Continue at every step. Nothing is one-way.

## License

Personal project. No license granted for commercial reuse of the persona. The code structure is free to learn from.

---

<div align="center">
Built by Harsh Gupta · <a href="https://linkedin.com/in/harshguptaworks">LinkedIn</a> · <a href="https://github.com/TabsOverSpaces4">GitHub</a>
</div>
