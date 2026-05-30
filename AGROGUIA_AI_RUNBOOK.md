# AGROGUIA.AI Runbook

This app is a standalone farm advisory platform using Next.js, standalone JWT auth, OpenRouter advisory generation, and MongoDB Atlas through Mongoose.

## One-Time Setup

1. Install Node.js LTS from https://nodejs.org.
2. Install dependencies:

```bash
npm install
```

3. Create `.env.local` from the template:

```bash
cp .env.example .env.local
```

4. Add your real environment values:

```env
OPENROUTER_API_KEY=your-real-openrouter-key
OPENROUTER_MODEL=qwen/qwen-2.5-72b-instruct
DATABASE_URL=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority
JWT_SECRET=your-random-32-byte-secret
APP_JWT_SECRET=your-random-32-byte-secret
```

Use your MongoDB Atlas connection string for `DATABASE_URL`. Include the database name in the path, for example `/agroguia`. Do not add DocumentDB-only TLS parameters such as `tlsCAFile`.

## Start The App

```bash
npm run dev
```

Open http://localhost:3333.

You can also run `START.ps1` from PowerShell. It checks for Node.js, warns about missing OpenRouter or MongoDB Atlas env values, clears port `3333`, and starts the dev server.

## Persistence Map

- Auth users: `models/User.ts`, used by `/api/auth/register`, `/api/auth/login`, and `/api/auth/me`
- Farmer profiles: `models/FarmerProfile.ts`, used by `/api/farmer-profiles`
- Advisory history: `models/AdvisoryHistory.ts`, used by `/api/advisory-history`
- Fertilizer tracking: `models/FertilizerTracker.ts`, used by `/api/fertilizer-tracker`
- Scheme enrollments: `models/SchemeEnrollment.ts`, used by `/api/scheme-enrollments`

All database access goes through `lib/db.ts`, which reads `DATABASE_URL`, validates that it is a MongoDB connection string, and reuses a cached Mongoose connection during local Next.js development.

## Validation Checklist

1. Register a new account.
2. Log out and log back in.
3. Save a farmer profile.
4. Refresh and confirm the profile still loads.
5. Generate an advisory with OpenRouter configured.
6. Refresh and confirm advisory history still loads.
7. Create scheme/fertilizer records through the UI or API routes and confirm they persist.

## Common Issues

| Symptom | Likely Cause | Fix |
| --- | --- | --- |
| Register/login fails | `DATABASE_URL` missing, invalid, or Atlas network access blocked | Add the Atlas URL, allow your IP in Atlas Network Access, then restart the dev server |
| Advisory generation fails | `OPENROUTER_API_KEY` missing or invalid | Add a valid key from https://openrouter.ai/keys |
| Session fails after restart | `JWT_SECRET` changed | Keep a stable random `JWT_SECRET` in `.env.local` |
| MongoDB TLS/cert error | Legacy DocumentDB TLS parameters are still in the URL | Use the clean Atlas `mongodb+srv://...` URL without `tlsCAFile` |
| Port already in use (`EADDRINUSE`) | A previous dev server instance is still running in the background | Run `netstat -ano \| findstr :3333` to find the PID, then `taskkill /F /PID <PID>` to kill it. |
| Git push rejected (`fetch first`) | Remote GitHub repository contains changes you don't have locally | Run `git pull --rebase origin main` and then run your push command again. |

## Git & Version Control Workflow

Use these commands to push your modified code/files to GitHub:

### Standard Push Flow
1. Check what files you have modified:
   ```bash
   git status
   ```
2. Stage the modified files (use `.` for all files, or specify individual file paths):
   ```bash
   git add .
   ```
3. Commit your staged changes with a descriptive message:
   ```bash
   git commit -m "Your commit message here"
   ```
4. Push your commits to GitHub:
   ```bash
   git push origin main
   ```

### Handling Push Rejections (Out of Sync)
If you get a rejection warning when pushing, it means someone else pushed changes, or you modified files directly on GitHub. Resolve it by running:
```bash
git pull --rebase origin main
git push origin main
```

## Ownership Status

AGROGUIA.AI is configured to use your own MongoDB Atlas cluster through `DATABASE_URL`. No schema redesign is required for the Atlas migration; the existing Mongoose models and API routes are preserved.
