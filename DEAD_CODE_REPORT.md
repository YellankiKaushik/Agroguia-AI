# AGROGUIA.AI Dead Code Audit Report

## Objective

This report documents the A2 dead-code cleanup pass for AGROGUIA.AI.

The cleanup scope was intentionally narrow:

- Identify unused code.
- Remove only code confirmed unused.
- Preserve all routes, runtime integrations, backend behavior, MongoDB behavior, OpenRouter behavior, authentication, onboarding, dashboard, advisory generation, and extension surfaces.

No dependency cleanup, TypeScript repair, build repair, API redesign, or architecture rewrite was performed.

---

## Files And Areas Audited

The audit covered:

- `app/`
- `app/api/`
- `app/sections/`
- `components/`
- `components/ui/`
- `hooks/`
- `lib/`
- `models/`
- `public/`
- root documentation files

The scan checked:

- Import references.
- Route files.
- Dynamic import references.
- Direct symbol references.
- Asset references.
- UI component usage.
- Hook usage.
- Utility usage.

---

## Confirmed Dead Code Removed

| File | Classification | Evidence | Action |
|---|---|---|---|
| `components/KnowledgeBaseUpload.tsx` | Unused component / legacy artifact | No import, no route usage, no dynamic import, no runtime reference. Current knowledge-base management uses `app/sections/ManagementViews.tsx` directly. | Removed |
| `lib/clipboard.ts` | Unused utility / unused hook | No import or symbol reference for `copyToClipboard` or `useCopyToClipboard`. | Removed |

---

## Classification Results

### 1. Unused Components

Removed:

- `components/KnowledgeBaseUpload.tsx`

Retained:

- `components/AgentInterceptorProvider.tsx`
- `components/ClientProviders.tsx`
- `components/HydrationGuard.tsx`
- `components/IframeLoggerInit.tsx`
- `components/ErrorBoundary.tsx`

Reason retained:

- These are wired through `app/layout.tsx` or dynamically referenced by the global error-handling path.

### 2. Unused Hooks

No custom hook was removed.

Retained:

- `hooks/useAgent.ts`
- `hooks/use-mobile.tsx`

Reason retained:

- `hooks/useAgent.ts` is dynamically imported by `components/ErrorBoundary.tsx`.
- `hooks/use-mobile.tsx` is imported by `components/ui/sidebar.tsx`.

### 3. Unused Utilities

Removed:

- `lib/clipboard.ts`

Retained:

- `lib/advisoryDefaults.ts`
- `lib/aiAgent.ts`
- `lib/auth.ts`
- `lib/db.ts`
- `lib/fetchWrapper.ts`
- `lib/jsonParser.ts`
- `lib/openrouterAdvisory.ts`
- `lib/ragKnowledgeBase.ts`
- `lib/scheduler.ts`
- `lib/utils.ts`

Reason retained:

- These are imported by API routes, dashboard sections, model generation flow, or UI wrappers.

### 4. Unused Pages / Routes

No route files were removed.

Reason retained:

- Next.js route files are runtime entry points even when not imported directly.
- API routes such as `app/api/fertilizer-tracker/route.ts` and `app/api/scheme-enrollments/route.ts` may be called externally or future-facing and were not safe to delete.

### 5. Unused Imports

No unused imports were removed manually.

Reason:

- `next lint` currently reports no unused-import warnings/errors.

### 6. Unused Constants

No constants were removed.

Reason:

- No constant was confirmed unused without entering TypeScript repair/refactor territory.

### 7. Unused Assets

No public assets were removed.

Reason:

- No obvious unused asset inventory was present in `public/` during this pass.

### 8. Legacy Artifacts

Removed:

- The standalone `KnowledgeBaseUpload` component was retained from an earlier knowledge-base upload flow but replaced by the current AGROGUIA management view implementation.
- The clipboard helper was an iframe-era utility with no active references.

Retained:

- General `components/ui/*` primitives.

Reason retained:

- Many shadcn/ui primitives are not directly imported by current screens, but removing UI primitives aggressively can break future composition or internal primitive dependencies. A2 prioritizes safety over aggressive deletion.

---

## Retained Suspected Dead Code

The following areas may be candidates for a later, stricter cleanup phase, but were not removed in A2:

| Area | Reason Not Removed |
|---|---|
| Some unused `components/ui/*` primitives | Shadcn component libraries are often intentionally retained as a design-system toolkit. Removing them would be dependency/design-system cleanup, not safe A2 dead-code cleanup. |
| `app/api/fertilizer-tracker/route.ts` | API route can be called directly even if not linked in current UI. |
| `app/api/scheme-enrollments/route.ts` | API route can be called directly even if not linked in current UI. |
| Extension-service routes | Runtime surfaces for RAG, scheduler, upload, and voice workflows. |
| `lyzr-architect` package | Dependency cleanup explicitly out of scope for A2. |

---

## Validation Summary

Validation performed after removal:

- Import/reference scan for removed files and symbols.
- Route inventory scan.
- `git diff --check`.
- `next lint`.
- Local Next.js dev server startup check.

Known unrelated validation issue:

- `tsc --noEmit` still reports pre-existing TypeScript issues in `components/ui/resizable.tsx`, `lib/fetchWrapper.ts`, `lib/ragKnowledgeBase.ts`, and `lib/scheduler.ts`.
- These were not fixed because A2 explicitly excludes TypeScript repair.

---

## Final Assessment

A2 removed only confirmed unused code and preserved runtime safety.

The codebase is now slightly cleaner without touching active product architecture, APIs, database behavior, AI advisory generation, authentication, onboarding, dashboard, or extension-service integrations.
