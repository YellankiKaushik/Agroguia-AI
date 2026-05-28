# AGROGUIA.AI

AI-powered farm advisory platform for Indian farmers.

AGROGUIA.AI delivers personalized farm intelligence for weather alerts, pest risk, protection planning, market guidance, government schemes, insurance, loans, and advisory history. The app runs as a standalone Next.js + MongoDB stack, uses standalone JWT auth, and generates advisories through OpenRouter open-source models.

## Tech Stack

- Frontend: Next.js 14 App Router, React 18, Tailwind CSS, shadcn/ui
- Backend: Next.js API routes
- AI engine: OpenRouter via direct API calls
- Database: MongoDB Atlas through Mongoose
- Auth: JWT cookies + bcrypt
- Language: TypeScript

## Quick Start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3333`.

## Environment Variables

Fill these values in `.env.local`. Do not commit `.env` or `.env.local`.

- `OPENROUTER_API_KEY`: OpenRouter key from https://openrouter.ai/keys
- `OPENROUTER_MODEL`: optional model override, default `qwen/qwen-2.5-72b-instruct`
- `DATABASE_URL`: your MongoDB Atlas connection string
- `JWT_SECRET`: random secret used to sign login sessions
- `APP_JWT_SECRET`: optional fallback JWT secret; keep it equal to `JWT_SECRET` if used

MongoDB Atlas format:

```env
DATABASE_URL=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority
```

Include the database name in the URL, for example `/agroguia`. Do not include old DocumentDB-only options such as `tlsCAFile`.

## Database Ownership

All app persistence goes through `DATABASE_URL` in [lib/db.ts](</c:/Users/YellankiKaushik/Desktop/Projects/OpenAI x Outskill Hackathon/extractted files/lib/db.ts>). The current Mongoose models are preserved:

- `User`: standalone auth accounts
- `FarmerProfile`: farmer profile and crop context
- `AdvisoryHistory`: saved generated advisories
- `FertilizerTracker`: fertilizer application records
- `SchemeEnrollment`: scheme enrollment records

The API routes reuse one cached Mongoose connection in local Next.js dev mode and store records with the authenticated user's existing `user_id` field.

## Project Structure

```text
app/
  api/
    agent/              OpenRouter advisory endpoint
    auth/               Register, login, logout, session check
    farmer-profiles/    Farmer profile CRUD
    advisory-history/   Advisory history persistence
    fertilizer-tracker/ Fertilizer tracking persistence
    scheme-enrollments/ Scheme enrollment persistence
  page.tsx              Main dashboard
lib/
  auth.ts               JWT helpers
  db.ts                 MongoDB Atlas/Mongoose connection
  openrouterAdvisory.ts OpenRouter integration
models/                 Mongoose schemas
```

## Validation Flow

1. Register an account.
2. Log in with the same account.
3. Save a farmer profile.
4. Generate an advisory.
5. Refresh the page and confirm profile and advisory history still load.
