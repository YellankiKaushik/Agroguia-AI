# AGROGUIA.AI

**AI Infrastructure for Intelligent Agriculture**

AGROGUIA.AI is an AI-powered agricultural intelligence platform that helps farmers make operational, financial, and risk-aware decisions through a structured advisory dashboard.

It converts farmer context into actionable intelligence across crop care, weather risk, pest management, finance, government schemes, insurance, loans, market timing, fraud awareness, waste value, and voice-first advisory.

> One-line pitch: AGROGUIA.AI turns a farmer profile into a structured AI farm intelligence dashboard.

---

## Why It Matters

Small and mid-sized farmers make high-cost decisions every week under uncertainty:

- When should I spray?
- Should I irrigate before rainfall?
- Is this pest risk urgent?
- Which mandi should I sell in?
- Am I missing a government scheme?
- Is my insurance claim worth filing?
- Is this loan safe or predatory?

Most existing tools are fragmented. Weather apps, market lists, subsidy portals, pest guides, and loan information do not work together.

AGROGUIA.AI addresses that gap by acting as a unified agricultural intelligence layer: profile in, structured advisory dashboard out.

---

## Product Overview

The current application flow is:

```text
Landing Page
-> Authentication
-> Onboarding / Farmer Profile Wizard
-> AI Dashboard
-> Advisory Generation
-> Advisory History
```

Core product surfaces:

| Surface | Purpose |
| --- | --- |
| Premium landing page | Public startup-style entry point and product narrative |
| Standalone auth | Register, login, logout, and session verification |
| Profile wizard | Captures farmer, farm, crop, finance, and language context |
| AI dashboard | Displays actions, alerts, financials, schemes, loans, insurance, voice, and detailed advisory tabs |
| Advisory engine | Uses OpenRouter to generate structured multi-module farm intelligence |
| History | Persists generated advisories for repeat usage and review |
| Voice | Supports text-to-speech summaries and live advisor voice interaction surface |

---

## What Makes It Different

AGROGUIA.AI is not a generic agriculture chatbot.

```text
Generic AI chatbot:
Question -> Text answer -> User interprets manually

AGROGUIA.AI:
Farmer profile -> Structured AI advisory -> Dashboard modules -> Persistence -> Repeatable decision cycle
```

The system is designed around:

- **Structured AI outputs** instead of free-form text.
- **Dashboard-safe rendering** with fallback defaults.
- **User-scoped persistence** through MongoDB Atlas.
- **Operational modules** for weather, pest, crop, market, schemes, insurance, loans, fraud, and waste value.
- **Voice accessibility** for rural and field-use conditions.
- **Startup-grade positioning** as AI infrastructure for intelligent agriculture.

---

## System Architecture

AGROGUIA.AI is a full-stack monolithic Next.js application with server-side AI and database integration.

```text
[Landing Page]
    |
    v
[Auth Layer]
    |
    v
[Profile Wizard]
    |
    v
[Dashboard State Manager]
    |
    v
[AI Advisory Engine]
    |
    v
[OpenRouter Model Layer]
    |
    v
[Response Normalization]
    |
    v
[MongoDB Atlas Persistence]
    |
    v
[Dashboard Rendering]
```

### Key Layers

| Layer | Files / Modules | Responsibility |
| --- | --- | --- |
| Experience layer | `app/page.tsx`, `app/sections/*` | Landing, auth flow, onboarding, dashboard, voice, history |
| API layer | `app/api/*` | Auth, AI generation, profile CRUD, history, RAG, scheduler, upload |
| AI layer | `lib/openrouterAdvisory.ts`, `lib/advisoryDefaults.ts` | Prompting, OpenRouter call, JSON parsing, default merging |
| Data layer | `lib/db.ts`, `models/*` | MongoDB Atlas connection and Mongoose schemas |
| Security layer | `lib/auth.ts`, `app/api/auth/*` | JWT signing, session validation, protected data access |

---

## AI Advisory Engine

The advisory engine is built around a deterministic shell over an LLM reasoning core.

```text
Farmer context
-> Prompt construction
-> OpenRouter chat completion
-> JSON extraction
-> Default merge
-> Normalized response
-> Dashboard tabs
-> Advisory history
```

The required advisory contract includes:

- `farmer_summary`
- `weather_advisory`
- `pest_advisory`
- `protection_plan`
- `market_intelligence`
- `government_schemes`
- `insurance_status`
- `loan_advisory`
- `waste_value`
- `total_income_projection`
- `voice_summaries`

This structure allows the UI to render AI output as clear modules rather than a long text response.

---

## Core Features

| Feature | Description |
| --- | --- |
| AI Advisory Engine | Generates structured farm decision packets using OpenRouter |
| Pest Intelligence | Identifies threats, risk levels, symptoms, and action windows |
| Weather Advisory | Converts weather-like conditions into operational actions |
| Protection Plan | Recommends spray, fertilizer, timing, and cost guidance |
| Market Intelligence | Compares mandi options and sell-or-wait decisions |
| Scheme Discovery | Surfaces eligible schemes, documents, deadlines, and benefits |
| Insurance Guidance | Explains claim readiness, documents, and payout context |
| Loan Advisory | Compares safer credit options and predatory loan risks |
| Fraud Awareness | Provides digital safety guidance and scam simulation |
| Waste Value | Estimates crop residue value and composting opportunities |
| Voice Summaries | Lets users listen to advisory summaries in supported languages |
| Advisory History | Stores advisory outputs for longitudinal farm decision tracking |

---

## Tech Stack

| Technology | Role |
| --- | --- |
| Next.js 14 | Full-stack app, App Router UI, API route handlers |
| React 18 | Component-driven frontend |
| TypeScript | Type-safe application development |
| Tailwind CSS | Responsive UI styling |
| shadcn/ui + Radix | Reusable UI primitives |
| OpenRouter | LLM model access for advisory generation |
| MongoDB Atlas | Persistent database |
| Mongoose | MongoDB schema/model layer |
| JWT + bcrypt | Standalone authentication and password security |
| lucide-react / react-icons | Interface iconography |

---

## Repository Structure

```text
app/
  api/
    agent/                OpenRouter advisory endpoint
    auth/                 Register, login, logout, session check
    farmer-profiles/      Farmer profile CRUD
    advisory-history/     Advisory history persistence
    fertilizer-tracker/   Fertilizer tracking persistence
    scheme-enrollments/   Scheme enrollment persistence
    rag/                  RAG knowledge base proxy
    scheduler/            Scheduler proxy
    upload/               Asset upload proxy
  sections/
    LandingPage.tsx       Public startup landing page
    ProfileWizard.tsx     Farmer onboarding wizard
    DashboardTabs.tsx     Detailed advisory module renderer
    VoiceUpdate.tsx       TTS and live voice advisor surface
  page.tsx                Main auth, onboarding, and dashboard orchestrator

lib/
  openrouterAdvisory.ts   OpenRouter prompt and generation logic
  advisoryDefaults.ts     Canonical advisory shape and fallback defaults
  aiAgent.ts              Client utility for AI agent calls
  auth.ts                 JWT helpers
  db.ts                   MongoDB Atlas connection
  scheduler.ts            Scheduler client utility
  ragKnowledgeBase.ts     RAG client utility

models/
  User.ts
  FarmerProfile.ts
  AdvisoryHistory.ts
  FertilizerTracker.ts
  SchemeEnrollment.ts

PROJECT_EXPLANATION_V2.md  Founder-grade master system documentation
AGROGUIA_AI_RUNBOOK.md     Local setup and operations runbook
DATABASE_MIGRATION_REPORT.md
```

---

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy the example environment file:

```bash
cp .env.example .env.local
```

Fill in:

```env
OPENROUTER_API_KEY=your-openrouter-api-key
OPENROUTER_MODEL=qwen/qwen-2.5-72b-instruct
DATABASE_URL=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority
JWT_SECRET=your-random-jwt-secret
APP_JWT_SECRET=your-random-jwt-secret
```

Do not commit `.env` or `.env.local`.

### 3. Start Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3333
```

You can also run:

```powershell
.\START.ps1
```

The startup script checks Node.js, validates key environment values, clears port `3333`, and starts the app.

---

## Validation Flow

Use this flow to verify the full system:

1. Open `http://localhost:3333`.
2. View the landing page.
3. Click `Generate AI Farm Dashboard`.
4. Register a new account.
5. Complete the farmer profile wizard.
6. Open the dashboard.
7. Click `Generate Advisory`.
8. Review detailed advisory tabs.
9. Use a voice summary.
10. Open advisory history.
11. Refresh and confirm profile/history persistence.

---

## Environment Variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `OPENROUTER_API_KEY` | Yes | Server-side OpenRouter advisory generation |
| `OPENROUTER_MODEL` | Optional | Model override, defaults to `qwen/qwen-2.5-72b-instruct` |
| `DATABASE_URL` | Yes | MongoDB Atlas connection string |
| `JWT_SECRET` | Yes | JWT signing secret |
| `APP_JWT_SECRET` | Optional | Fallback JWT signing secret |
| `LYZR_API_KEY` | Optional | RAG, scheduler, upload, and legacy extension surfaces |
| `LYZR_RAG_BASE_URL` | Optional | RAG API base URL override |
| `LYZR_SCHEDULER_BASE_URL` | Optional | Scheduler API base URL override |
| `LYZR_AGENT_BASE_URL` | Optional | Upload API base URL override |

---

## Database Models

| Model | Purpose |
| --- | --- |
| `User` | Standalone auth accounts with hashed passwords |
| `FarmerProfile` | Farmer, farm, crop, finance, and language context |
| `AdvisoryHistory` | Saved AI advisory packets scoped by user |
| `FertilizerTracker` | Fertilizer application records |
| `SchemeEnrollment` | Scheme enrollment status and benefits |

All protected records are scoped by authenticated `user_id`.

---

## Documentation

For deep architecture, product strategy, AI workflow, roadmap, visual generation context, and demo guidance, read:

- [`PROJECT_EXPLANATION_V2.md`](./PROJECT_EXPLANATION_V2.md)
- [`AGROGUIA_AI_RUNBOOK.md`](./AGROGUIA_AI_RUNBOOK.md)
- [`DATABASE_MIGRATION_REPORT.md`](./DATABASE_MIGRATION_REPORT.md)

`PROJECT_EXPLANATION_V2.md` is the master system document and should be treated as the primary source for hackathon submission, pitch deck content, product storytelling, and future technical planning.

---

## Current Engineering Notes

- The core product runs as a standalone Next.js + MongoDB Atlas + OpenRouter system.
- Build configuration currently skips type-checking and linting during `next build` for faster iteration.
- Standalone TypeScript validation may report existing issues in optional/legacy surfaces such as voice streaming utilities, resizable UI imports, RAG, scheduler, and fetch wrapper typing.
- Production hardening should enable secure cookies, add auth rate limiting, strengthen schema validation, and ground advisories with live weather, mandi, pest, and scheme data.

---

## Roadmap

Planned evolution areas:

- Live weather and market data grounding.
- Satellite/NDVI crop stress signals.
- District-level pest outbreak alerts.
- WhatsApp, IVR, and offline-first mobile access.
- Multi-farm and multi-plot intelligence.
- Proactive daily/weekly advisory scheduling.
- Scheme application workflows.
- Insurance claim readiness automation.
- Village-level agricultural intelligence dashboards.

---

## Positioning Statement

AGROGUIA.AI is a step toward a future where farmers operate with the same decision support systems that high-performing industries already use: planning, risk management, financial intelligence, operational dashboards, and AI-powered guidance that compounds across seasons.

It is not just AI for answers.

It is AI for farm decision confidence.
