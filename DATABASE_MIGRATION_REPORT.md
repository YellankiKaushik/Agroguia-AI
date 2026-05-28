# AGROGUIA.AI Database Ownership Migration Report

## A. Objective

Finalize database ownership by moving AGROGUIA.AI onto a user-owned MongoDB Atlas connection through `DATABASE_URL`, while preserving the existing Mongoose models, auth flow, CRUD APIs, advisory history persistence, and frontend behavior.

## B. Previous DB Flow

`lib/db.ts` read `DATABASE_URL`, opened a Mongoose connection, and cached the connection/promise on `globalThis` for stable reuse in local Next.js development. Each model factory awaited `connectDB()` before returning the existing Mongoose model.

## C. Previous Assumptions

The active DB code still contained legacy cloud behavior: it stripped a Linux-only `tlsCAFile` query parameter and enabled invalid TLS certificates for local use. That matched an old DocumentDB-style connection, not a clean MongoDB Atlas setup.

## D. Files Modified

- `lib/db.ts`
- `models/User.ts`
- `models/FarmerProfile.ts`
- `models/AdvisoryHistory.ts`
- `models/FertilizerTracker.ts`
- `models/SchemeEnrollment.ts`
- `app/api/auth/*` were audited and left behaviorally intact
- `app/api/farmer-profiles/route.ts`
- `app/api/advisory-history/route.ts`
- `app/api/fertilizer-tracker/route.ts`
- `app/api/scheme-enrollments/route.ts`
- `.env.example`
- `README.md`
- `AGROGUIA_AI_RUNBOOK.md`
- `START.ps1`
- `app/api/rag/route.ts` and `app/api/upload/route.ts` received syntax-only cleanup for malformed legacy identifiers so TypeScript can parse them

## E. Atlas Integration Changes

`lib/db.ts` now validates that `DATABASE_URL` is a MongoDB URI, connects directly with Mongoose, keeps the existing global connection cache, checks `readyState` before reuse, and clears a failed connection promise so later requests can retry.

## F. Env Vars

Required active variables are now documented as:

- `DATABASE_URL`
- `JWT_SECRET`
- `APP_JWT_SECRET`
- `OPENROUTER_API_KEY`
- `OPENROUTER_MODEL`

The expected Atlas format is:

```env
DATABASE_URL=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority
```

## G. Cleanup Performed

Removed the runtime `tlsCAFile` stripping and `tlsAllowInvalidCertificates` workaround from `lib/db.ts`. Removed stale `DATABASE_PROVIDER` and `DATABASE_NAME` from `.env.example` because the app consumes `DATABASE_URL`.

## H. Compatibility Preserved

Schemas were not redesigned. Models still compile through the same factory functions. Frontend fetch paths are unchanged. Auth still uses JWT cookies and bcrypt. Advisory generation still uses OpenRouter.

## I. Auth Persistence

Auth persistence remains backed by the existing `User` model. Register, login, and session lookup continue to use the same database collection and JWT cookie behavior.

## J. CRUD Persistence

Farmer profiles, scheme enrollments, and fertilizer tracking now store and read records through the existing `user_id` field, matching the schemas and preserving authenticated user ownership.

## K. Advisory History Persistence

Advisory history now saves with authenticated `user_id`, matching the existing required schema field. Reads are scoped to the authenticated user and sorted newest first.

## L. Remaining Warnings

The current `.env.local` was checked without printing secrets. It has `DATABASE_URL`, but it is not Atlas-shaped and still contains `tlsCAFile`. Replace it manually with your MongoDB Atlas connection string before live validation.

TypeScript still reports unrelated existing errors in `VoiceUpdate`, `components/ui/resizable.tsx`, `lib/fetchWrapper.ts`, `lib/ragKnowledgeBase.ts`, and `lib/scheduler.ts`. Lint still reports existing `react-icons/fi` rule violations. The database migration changes no longer contribute model typing errors.

## M. Atlas Ownership Status

The codebase is ready to run on your MongoDB Atlas cluster through `DATABASE_URL`. AGROGUIA.AI will be fully running on your own Atlas infrastructure after `.env.local` is updated with your Atlas connection string and the app is restarted.
