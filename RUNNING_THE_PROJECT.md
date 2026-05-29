# RUNNING THE PROJECT

This file is the single source of truth for running, developing, building, debugging, deploying, and maintaining **AGROGUIA.AI**.

It is written for a new developer who needs to become productive quickly, understand the project structure, avoid common setup mistakes, and confidently validate the application before pushing changes.

---

## 1. Project Overview

### What AGROGUIA.AI Is

**AGROGUIA.AI** is an AI-powered agricultural intelligence platform designed to help farmers make better operational, financial, and crop-management decisions.

The platform combines:

- Farmer onboarding and profile collection
- AI-generated agricultural advisory
- Weather, pest, crop, finance, scheme, insurance, and risk intelligence
- Dashboard-based decision support
- Advisory history persistence
- Management views for knowledge base and scheduler integrations
- Voice-oriented advisory experiences

The product positioning is:

> AI Infrastructure for Intelligent Agriculture.

### Problem It Solves

Farmers often make decisions under uncertainty:

- Weather changes quickly.
- Pest and disease windows are hard to predict.
- Financial planning is disconnected from crop planning.
- Government schemes and insurance processes are difficult to track.
- Advisory systems are fragmented across apps, portals, and informal sources.

AGROGUIA.AI turns farmer context into structured, dashboard-ready intelligence so a farmer can understand what to do, when to do it, and why it matters.

### Main Technologies Used

#### Frontend

- **Next.js**: App Router framework for the full-stack application.
- **React**: Component-based UI layer.
- **TypeScript**: Type safety across frontend, API routes, and utilities.
- **Tailwind CSS**: Styling system for the landing page, auth, onboarding, and dashboard.
- **Radix UI**: Accessible low-level UI primitives.
- **Lucide React**: Icon system.

#### Backend

- **Next.js API Routes**: Server-side route handlers under `app/api/`.
- These routes handle authentication, profiles, advisory history, AI advisory generation, uploads, RAG proxying, scheduler proxying, and CRUD operations.

#### Database

- **MongoDB Atlas**
- **Mongoose**
- Used for:
  - Users
  - Farmer profiles
  - Advisory history
  - Fertilizer tracking
  - Scheme enrollments

#### AI Layer

- **OpenRouter**
- Used by the advisory engine to generate structured farming intelligence from farmer profile context.

#### Authentication

- **JWT**
- **HTTP-only cookies**
- Registration and login create a signed JWT and store it in an auth cookie.

### Architecture Overview

High-level flow:

```text
Landing Page
  ↓
Authentication
  ↓
Onboarding / Profile Wizard
  ↓
Farmer Profile Persistence
  ↓
AI Advisory Request
  ↓
OpenRouter Advisory Engine
  ↓
Structured Advisory Response
  ↓
Dashboard Rendering
  ↓
Advisory History Persistence
  ↓
Management / Scheduler / Knowledge Base Views
```

Main architecture layers:

```text
app/page.tsx
  ├─ Landing experience
  ├─ Auth screen
  ├─ Dashboard shell
  └─ View orchestration

app/sections/
  ├─ LandingPage.tsx
  ├─ ProfileWizard.tsx
  ├─ DashboardHero.tsx
  ├─ DashboardTabs.tsx
  ├─ FinancialDashboard.tsx
  ├─ SchemesLoansInsurance.tsx
  ├─ ManagementViews.tsx
  └─ VoiceUpdate.tsx

app/api/
  ├─ auth/
  ├─ agent/
  ├─ farmer-profiles/
  ├─ advisory-history/
  ├─ fertilizer-tracker/
  ├─ scheme-enrollments/
  ├─ rag/
  ├─ scheduler/
  └─ upload/

lib/
  ├─ auth.ts
  ├─ db.ts
  ├─ openrouterAdvisory.ts
  ├─ aiAgent.ts
  ├─ advisoryDefaults.ts
  ├─ jsonParser.ts
  ├─ ragKnowledgeBase.ts
  └─ scheduler.ts

models/
  ├─ User.ts
  ├─ FarmerProfile.ts
  ├─ AdvisoryHistory.ts
  ├─ FertilizerTracker.ts
  └─ SchemeEnrollment.ts
```

---

## 2. Prerequisites

Install these before working on the project.

### Required Software

#### Node.js

Recommended:

- Node.js 18+
- Node.js 20+ is preferred for modern Next.js development.

Verify:

```bash
node -v
```

Expected example:

```text
v20.x.x
```

#### npm

npm comes with Node.js.

Verify:

```bash
npm -v
```

Expected example:

```text
10.x.x
```

#### Git

Required for cloning, pulling, committing, and pushing changes.

Verify:

```bash
git --version
```

Expected example:

```text
git version 2.x.x
```

#### VS Code

Recommended editor:

- VS Code
- Extensions:
  - ESLint
  - Tailwind CSS IntelliSense
  - Prettier
  - TypeScript and JavaScript Language Features

---

## 3. Project Installation

### Clone the Repository

Use:

```bash
git clone <repo>
```

Example:

```bash
git clone https://github.com/YellankiKaushik/Agroguia-AI.git
```

What this does:

- Downloads the repository from GitHub.
- Creates a local copy on your machine.

### Move Into the Project Folder

```bash
cd Agroguia-AI
```

What this does:

- Moves your terminal into the project directory.
- All project commands must be run from this folder.

### Install Dependencies

```bash
npm install
```

What this does:

- Reads `package.json`.
- Installs all dependencies into `node_modules/`.
- Updates or verifies `package-lock.json`.

Important:

- Do not run `npm audit fix --force` casually.
- Forced audit fixes can install incompatible major versions and break the project.

---

## 4. Environment Variables

Environment variables are required for database access, authentication, and AI advisory generation.

### Where to Put Environment Variables

Create a file named:

```text
.env.local
```

Place it in the project root:

```text
AGROGUIA-AI/
  .env.local
  package.json
  app/
  lib/
  models/
```

You can copy the template:

```bash
cp .env.example .env.local
```

Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

Then edit `.env.local` and replace placeholder values with real credentials.

### Required Variables

#### OpenRouter

```env
OPENROUTER_API_KEY=your-openrouter-api-key-here
OPENROUTER_MODEL=qwen/qwen-2.5-72b-instruct
```

Used by:

- `lib/openrouterAdvisory.ts`
- `app/api/agent/route.ts`

Purpose:

- Sends farmer context to OpenRouter.
- Receives structured AI advisory output.

#### MongoDB Atlas

The application currently expects:

```env
DATABASE_URL=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority
```

Some projects call this `MONGODB_URI`, but this codebase uses `DATABASE_URL`.

Used by:

- `lib/db.ts`
- All Mongoose models under `models/`

Purpose:

- Connects to MongoDB Atlas.
- Stores users, profiles, advisory history, schemes, and fertilizer records.

#### JWT Secret

```env
JWT_SECRET=your-random-jwt-secret-here
APP_JWT_SECRET=your-random-jwt-secret-here
```

Used by:

- `lib/auth.ts`

Purpose:

- Signs and verifies authentication tokens.
- Keeps user sessions secure.

Generate a strong secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```



Used by:

- `app/api/rag/route.ts`
- `app/api/scheduler/route.ts`
- `app/api/upload/route.ts`

Purpose:

- Knowledge base document operations
- Scheduler operations
- Upload proxy operations

If these are missing:

- Core landing/auth/onboarding/dashboard can still run.
- RAG, scheduler, or upload management features may return configuration errors.

### Security Notes

Never commit:

```text
.env
.env.local
.env.*.local
```

These files may contain real secrets.

The `.gitignore` already excludes environment files.

Safe to commit:

```text
.env.example
```

Only placeholders should be stored in `.env.example`.

---

## 5. Running the Application

### Development Command

```bash
npm run dev
```

Actual script:

```json
"dev": "next dev --turbo -p 3333"
```

This means the app runs on:

```text
http://localhost:3333
```

### Important Port Note

Most Next.js projects use:

```text
http://localhost:3000
```

This project uses:

```text
http://localhost:3333
```

because the `dev` script explicitly sets:

```bash
-p 3333
```

### Successful Startup Output

You should see something like:

```text
▲ Next.js 14.2.23 (turbo)
- Local: http://localhost:3333
✓ Starting...
✓ Ready in 990ms
```

When you open the app, you should see:

- Landing page
- AGROGUIA.AI branding
- Get Started / authentication entry

### Stop the Server

Press:

```text
Ctrl + C
```

---

## 6. Common Development Workflow

A normal development cycle looks like this:

### 1. Pull Latest Changes

```bash
git pull
```

Purpose:

- Downloads latest code from GitHub.

### 2. Install Dependencies If Needed

```bash
npm install
```

Run this after:

- Pulling changes
- Switching branches
- Seeing package changes
- Deleting `node_modules/`

### 3. Start Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3333
```

### 4. Make Code Changes

Common folders:

- `app/sections/` for major UI sections
- `app/api/` for backend route handlers
- `lib/` for utilities and integrations
- `models/` for MongoDB models
- `components/` for reusable UI components

### 5. Run Validation

Run:

```bash
npm run lint
```

```bash
npx tsc --noEmit
```

```bash
npm run build
```

### 6. Commit Changes

```bash
git status
git add .
git commit -m "Describe your change"
```

### 7. Push Changes

```bash
git push origin main
```

Or push your feature branch:

```bash
git push origin <branch-name>
```

---

## 7. Validation Commands

Run these before pushing or deploying.

### TypeScript Check

```bash
npx tsc --noEmit
```

Windows direct command:

```powershell
.\node_modules\.bin\tsc.cmd --noEmit
```

What it does:

- Checks TypeScript types.
- Does not generate output files.

Success looks like:

```text
No output
```

Failure looks like:

```text
error TSxxxx: ...
```

### Lint Check

```bash
npm run lint
```

What it does:

- Runs Next.js ESLint checks.
- Finds code quality and React/Next issues.

Success looks like:

```text
✔ No ESLint warnings or errors
```

### Production Build

```bash
npm run build
```

What it does:

- Compiles the app for production.
- Verifies Next.js can build all routes.
- Generates route size information.

Success looks like:

```text
✓ Compiled successfully
✓ Collecting page data
✓ Generating static pages
✓ Finalizing page optimization
```

### Development Server

```bash
npm run dev
```

What it does:

- Starts the app in development mode.
- Enables fast refresh and local testing.

Success looks like:

```text
✓ Ready
```

### Full Local Validation Order

Recommended order:

```bash
npm install
npm run lint
npx tsc --noEmit
npm run build
npm run dev
```

Windows:

```powershell
npm install
npm run lint
.\node_modules\.bin\tsc.cmd --noEmit
npm run build
npm run dev
```

---

## 8. Troubleshooting Guide

### Problem: `npm install` Fails

Possible causes:

- Node version mismatch
- Corrupted `node_modules`
- Corrupted lockfile state
- Network issue

Try:

```bash
npm install
```

If still broken:

macOS/Linux:

```bash
rm -rf node_modules
rm package-lock.json
npm install
```

Windows PowerShell:

```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
npm install
```

Only delete `package-lock.json` if the lockfile is clearly corrupted or the team agrees.

### Problem: Port Already in Use

Error example:

```text
EADDRINUSE: address already in use :::3333
```

This means another process is already using port `3333`.

Option 1: Stop the existing server.

Press:

```text
Ctrl + C
```

Option 2: Find and kill the process.

Windows:

```powershell
netstat -ano | findstr :3333
```

Then kill the PID:

```powershell
taskkill /PID <PID> /F
```

Option 3: Run on another port:

```powershell
.\node_modules\.bin\next.cmd dev --turbo -p 3340
```

Then open:

```text
http://localhost:3340
```

### Problem: MongoDB Connection Fails

Common symptoms:

- Login/register fails.
- Profile save fails.
- API returns database connection error.

Check:

```env
DATABASE_URL=mongodb+srv://...
```

Make sure:

- The variable is in `.env.local`.
- The username and password are correct.
- The database name exists or can be created.
- Your IP address is allowed in MongoDB Atlas Network Access.
- The connection string starts with `mongodb://` or `mongodb+srv://`.

Relevant file:

```text
lib/db.ts
```

### Problem: OpenRouter Not Working

Common symptoms:

- Advisory generation fails.
- Dashboard uses fallback/default advisory.
- `/api/agent` returns an AI-related error.

Check:

```env
OPENROUTER_API_KEY=your-real-key
OPENROUTER_MODEL=qwen/qwen-2.5-72b-instruct
```

Make sure:

- The key is valid.
- The key has available credits/quota.
- Your model name is supported by OpenRouter.
- The development server was restarted after editing `.env.local`.

Relevant files:

```text
lib/openrouterAdvisory.ts
app/api/agent/route.ts
```

### Problem: Build Fails

Run:

```bash
npm run build
```

Then inspect the first real error.

Common causes:

- Missing dependency
- TypeScript issue
- Stale `.next` cache
- Wrong Next.js version

Clean `.next`:

```powershell
Remove-Item -Recurse -Force .next
```

macOS/Linux:

```bash
rm -rf .next
```

Then:

```bash
npm install
npm run build
```

### Problem: Authentication Not Working

Symptoms:

- Register fails.
- Login fails.
- User is logged out immediately.
- `/api/auth/me` returns `401`.

Check:

```env
JWT_SECRET=...
DATABASE_URL=...
```

Important:

- `GET /api/auth/me 401` is normal before login.
- It means no valid session cookie exists yet.

Relevant files:

```text
app/api/auth/register/route.ts
app/api/auth/login/route.ts
app/api/auth/me/route.ts
app/api/auth/logout/route.ts
lib/auth.ts
models/User.ts
```

### Problem: Cookies Not Being Set

Check:

- You are using the correct local URL.
- You are not blocking cookies in the browser.
- You are using `http://localhost:3333` in development.
- You restarted the dev server after environment changes.

Development cookies use:

```text
secure: false
```

Production cookies use:

```text
secure: true
```

This is controlled by:

```text
process.env.NODE_ENV === "production"
```

### Problem: Node Modules Are Corrupted

Symptoms:

- Missing package errors
- Module not found errors
- Strange build errors after package changes

Example:

```text
Module not found: Can't resolve 'mongoose'
```

Fix:

```bash
npm install
```

If still broken:

Windows PowerShell:

```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item -Recurse -Force .next
npm install
```

macOS/Linux:

```bash
rm -rf node_modules .next
npm install
```

Then validate:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

### Problem: Accidentally Ran `npm audit fix --force`

Do not panic.

This command can install incompatible major versions.

For this project, restore the known working versions:

```powershell
npm install next@14.2.23 eslint-config-next@14.2.23 mongoose@9.6.3 --save-exact
Remove-Item -Recurse -Force .next
npm install
npm run lint
.\node_modules\.bin\tsc.cmd --noEmit
npm run build
```

Do not repeatedly run:

```bash
npm audit fix --force
```

Security upgrades should be done in a separate planned upgrade phase.

---

## 9. Project Structure

### `app/`

Main Next.js App Router directory.

Contains:

- Application entry
- Page rendering
- API routes
- Product sections

Important files:

```text
app/page.tsx
app/layout.tsx
app/error.tsx
```

### `app/api/`

Backend route handlers.

Important routes:

```text
app/api/auth/register/route.ts
app/api/auth/login/route.ts
app/api/auth/me/route.ts
app/api/auth/logout/route.ts
app/api/agent/route.ts
app/api/farmer-profiles/route.ts
app/api/advisory-history/route.ts
app/api/fertilizer-tracker/route.ts
app/api/scheme-enrollments/route.ts
app/api/rag/route.ts
app/api/scheduler/route.ts
app/api/upload/route.ts
```

### `app/sections/`

Major product UI sections.

Important files:

```text
LandingPage.tsx
ProfileWizard.tsx
DashboardHero.tsx
DashboardTabs.tsx
FinancialDashboard.tsx
SchemesLoansInsurance.tsx
ManagementViews.tsx
VoiceUpdate.tsx
LanguageContext.tsx
LanguageSelector.tsx
translations.ts
```

### `components/`

Reusable UI components.

Includes:

- Shared UI primitives
- Error boundary
- Component utilities

Important folder:

```text
components/ui/
```

### `lib/`

Shared logic, integrations, and helpers.

Important files:

```text
auth.ts
db.ts
openrouterAdvisory.ts
aiAgent.ts
advisoryDefaults.ts
jsonParser.ts
fetchWrapper.ts
ragKnowledgeBase.ts
scheduler.ts
```

### `models/`

Mongoose models for MongoDB collections.

Important files:

```text
User.ts
FarmerProfile.ts
AdvisoryHistory.ts
FertilizerTracker.ts
SchemeEnrollment.ts
```

### `public/`

Static assets.

Use this folder for:

- Public images
- Static files
- Icons

### `hooks/`

Custom React hooks if needed.

### `response_schemas/`

Schema-related assets or response templates.

---

## 10. Database Guide

### How MongoDB Is Connected

MongoDB connection logic lives in:

```text
lib/db.ts
```

The project uses:

```ts
mongoose.connect(DATABASE_URL)
```

The connection is cached globally to avoid creating a new connection on every request during development.

### Environment Variable

```env
DATABASE_URL=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority
```

### Models

MongoDB models live in:

```text
models/
```

Collections:

- `User`
- `FarmerProfile`
- `AdvisoryHistory`
- `FertilizerTracker`
- `SchemeEnrollment`

### How to Verify DB Works

1. Start the app:

```bash
npm run dev
```

2. Open:

```text
http://localhost:3333
```

3. Create an account.

4. Complete onboarding.

5. If profile save succeeds, MongoDB is working.

You can also watch terminal logs for:

```text
POST /api/auth/register 200
POST /api/farmer-profiles 200
GET /api/farmer-profiles 200
```

---

## 11. OpenRouter Guide

### How OpenRouter Is Connected

OpenRouter integration lives in:

```text
lib/openrouterAdvisory.ts
```

The API route that uses it:

```text
app/api/agent/route.ts
```

### Required Variables

```env
OPENROUTER_API_KEY=your-openrouter-api-key
OPENROUTER_MODEL=qwen/qwen-2.5-72b-instruct
```

### How Advisory Generation Works

1. User completes farmer profile.
2. Dashboard sends farmer context to `/api/agent`.
3. `/api/agent` calls `generateAdvisoryFromOpenRouter`.
4. OpenRouter returns model output.
5. The app parses/normalizes the response.
6. Dashboard renders structured advisory cards.
7. Advisory can be saved to history.

### How to Test OpenRouter

Manual browser flow:

1. Start app:

```bash
npm run dev
```

2. Open:

```text
http://localhost:3333
```

3. Sign up or log in.
4. Complete profile wizard.
5. Click advisory generation action.
6. Confirm dashboard modules populate.

Successful terminal output should include:

```text
POST /api/agent 200
```

If OpenRouter fails, the dashboard may show fallback/default advisory content.

---

## 12. Authentication Guide

### Registration Flow

Route:

```text
app/api/auth/register/route.ts
```

Flow:

1. User enters name, email, username, and password.
2. Password is hashed with `bcryptjs`.
3. User is stored in MongoDB.
4. JWT is signed.
5. JWT is stored in an HTTP-only cookie.
6. Frontend moves into onboarding/dashboard flow.

### Login Flow

Route:

```text
app/api/auth/login/route.ts
```

Flow:

1. User enters email/username and password.
2. Server finds user in MongoDB.
3. Password is verified with `bcryptjs`.
4. JWT is signed.
5. Cookie is set.
6. User enters the app.

### JWT Flow

JWT helpers live in:

```text
lib/auth.ts
```

Main functions:

- `signAuthToken`
- `verifyAuthToken`
- `getTokenFromRequest`
- `getCurrentUserIdFromRequest`

### Cookie Flow

Cookie name:

```text
auth_token
```

Cookie properties:

- HTTP-only
- SameSite lax
- Secure in production
- Path `/`

### Logout Flow

Route:

```text
app/api/auth/logout/route.ts
```

Flow:

1. User clicks logout.
2. Server clears `auth_token`.
3. Frontend returns to public/auth state.

### Normal Unauthorized Response

Before login, this is normal:

```text
GET /api/auth/me 401
```

It means:

- No session exists yet.
- The app is correctly treating the user as unauthenticated.

---

## 13. Deployment Guide

### Recommended Platform

Use **Vercel** for easiest Next.js deployment.

### Deploy to Vercel

1. Push code to GitHub.
2. Go to Vercel.
3. Create a new project.
4. Import the GitHub repository.
5. Configure environment variables.
6. Deploy.

### Required Vercel Environment Variables

Add these in Vercel Project Settings:

```env
DATABASE_URL=
JWT_SECRET=
APP_JWT_SECRET=
OPENROUTER_API_KEY=
OPENROUTER_MODEL=
```


```

### Build Command

Vercel should use:

```bash
npm run build
```

### Install Command

```bash
npm install
```

### Output

No custom output directory is required for a normal Next.js Vercel deployment.

### Validate Deployment

After deploy:

1. Open deployed URL.
2. Confirm landing page loads.
3. Register a new account.
4. Complete onboarding.
5. Generate advisory.
6. Confirm dashboard renders.
7. Logout.
8. Login again.
9. Confirm profile/history reload.

### Deployment Troubleshooting

If deployment fails:

- Check build logs.
- Check environment variables.
- Confirm `DATABASE_URL` is valid.
- Confirm `OPENROUTER_API_KEY` is valid.
- Confirm MongoDB Atlas allows Vercel network access.

For MongoDB Atlas, a common quick fix is allowing:

```text
0.0.0.0/0
```

Use this only if acceptable for your project security posture.

---

## 14. 5-Minute Startup Guide

Use this if you just want to run the project from scratch.

```bash
git clone https://github.com/YellankiKaushik/Agroguia-AI.git
cd Agroguia-AI
npm install
cp .env.example .env.local
npm run dev
```

Windows PowerShell:

```powershell
git clone https://github.com/YellankiKaushik/Agroguia-AI.git
cd Agroguia-AI
npm install
Copy-Item .env.example .env.local
npm run dev
```

Then edit:

```text
.env.local
```

Add real values for:

```env
DATABASE_URL=
JWT_SECRET=
APP_JWT_SECRET=
OPENROUTER_API_KEY=
OPENROUTER_MODEL=
```

Open:

```text
http://localhost:3333
```

Before submitting or pushing:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

Windows:

```powershell
npm run lint
.\node_modules\.bin\tsc.cmd --noEmit
npm run build
```

---

## 15. Project Health Status

Current known status:

- TypeScript passes.
- Lint passes.
- Production build passes.
- Development server starts successfully.
- End-to-end validation passed for:
  - Landing page
  - Signup
  - JWT session
  - Profile creation
  - Profile loading
  - AI advisory generation
  - Advisory history persistence
  - Fertilizer tracker persistence
  - Scheme management with valid status values
  - RAG proxy response
  - Scheduler proxy response
  - Logout
- Security audit completed.
- Performance audit completed.
- Accessibility audit completed.

### Known Future Improvements

These are not required for local development, but they are good future engineering tasks:

- Carefully upgrade Next.js and related dependencies in a planned security upgrade phase.
- Add automated end-to-end browser tests with Playwright.
- Add formal accessibility testing with axe or Lighthouse.
- Add rate limiting/auth hardening for external proxy routes.
- Add local font strategy to avoid network dependency during production build.
- Split large app flows into route-level pages for deeper code splitting.
- Add structured API validation for all write routes.
- Improve production observability and error monitoring.

### Important Warning About Audit Fixes

Do not run:

```bash
npm audit fix --force
```

unless you are intentionally performing a planned dependency upgrade.

Why:

- It can install incompatible major versions.
- It can break Next.js.
- It can remove required packages.

If this happens, restore the known working versions:

```powershell
npm install next@14.2.23 eslint-config-next@14.2.23 mongoose@9.6.3 --save-exact
Remove-Item -Recurse -Force .next
npm install
npm run lint
.\node_modules\.bin\tsc.cmd --noEmit
npm run build
```

---

## Final Manual Test Checklist

After setup, use this quick manual flow:

1. Open `http://localhost:3333`.
2. Confirm landing page loads.
3. Click **Get Started**.
4. Register a new account.
5. Complete onboarding/profile wizard.
6. Confirm dashboard opens.
7. Generate AI advisory.
8. Confirm dashboard cards render.
9. Open history/management views.
10. Logout.
11. Login again.
12. Confirm profile/history are still available.

If all steps work, the project is ready for local development and demo usage.
