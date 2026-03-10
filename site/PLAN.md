# PLAN — BILAAA-11

## Issue
- Identifier: BILAAA-11
- Title: Auth, onboarding, and account setup
- Scope source: Paperclip issue description and follow-up clarification comments on 2026-03-10

## Objective
Deliver a production-credible auth and onboarding foundation for BillyBee's MVP, with implementation-ready detail and explicit decision points so follow-up issues can execute without ambiguity.

## Current Baseline
- Framework: Next.js 15.2, React 19, TypeScript.
- App shape: only marketing landing page (`src/app/page.tsx`), no authenticated app area.
- Data/backend: no database client, no auth provider, no server APIs, no test harness.
- Deployment: static-export oriented site pipeline; authenticated product area will require server runtime strategy confirmation.

## Recommended Technical Direction (MVP)
1. Authentication provider: Clerk (managed auth, email+password + magic link optional, hosted UI with custom routes).
2. Database: Postgres + Prisma ORM.
3. Session trust boundary: provider-issued session token validated server-side, map to internal `users` record by provider subject id.
4. Multitenancy model: single-account ownership now, account membership table designed for future multi-user support.
5. Protected app surface: new `/app/*` route group, gated by middleware + server checks.

## Package/Tooling Decisions
1. Auth
- Primary recommendation: `@clerk/nextjs` (fastest path, stable Next.js App Router support).
- Alternative if self-host preference: `next-auth` (Auth.js) + custom credentials/OAuth provider setup.

2. Data layer
- Primary recommendation: `prisma` + `@prisma/client`.
- Use `zod` for request payload validation in route handlers/server actions.

3. Testing
- Unit/integration: `vitest`, `@testing-library/react`, `@testing-library/jest-dom`.
- E2E/smoke: `playwright`.

## Detailed Implementation Plan
### Phase 0: Project and runtime preparation
1. Confirm runtime target for authenticated routes (Vercel/serverful deployment vs GitHub Pages static-only).
2. Introduce environment contract:
- `CLERK_SECRET_KEY`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `DATABASE_URL`
- `APP_URL` (canonical app URL for redirects/email links)
3. Add `.env.example` with non-secret placeholders and README section for local setup.
4. Add initial quality scripts:
- `test` (vitest)
- `test:e2e` (playwright)

Exit criteria:
- App starts with env validation guard and no secret hardcoding.

### Phase 1: Auth and session foundation (maps to BILAAA-12)
1. Install and wire Clerk provider in app layout.
2. Add auth routes:
- `/sign-in`
- `/sign-up`
- `/sign-out` (trigger + redirect)
3. Add middleware protection:
- Public routes: `/`, `/sign-in`, `/sign-up`, `/api/health`
- Protected routes: `/app/:path*`, `/api/app/:path*`
4. Add server-side session helper:
- `getCurrentSession()` returns normalized `{ externalUserId, email, name }`
- Throws/returns null for unauthenticated state
5. Add first protected shell route `/app`.

Exit criteria:
- Anonymous user attempting `/app` gets redirected to sign-in.
- Authenticated user can access `/app`.

### Phase 2: Account domain and bootstrap (maps to BILAAA-13)
1. Introduce Prisma schema (initial):
- `User` (id, externalAuthId, email, displayName, createdAt, updatedAt)
- `Account` (id, name, billingEmail, timezone, reminderDefaultsJson, onboardingCompletedAt)
- `AccountMember` (id, accountId, userId, role=`owner|member`, createdAt)
- `AuditEvent` (id, accountId, actorUserId, eventType, payloadJson, createdAt)
2. On first successful auth, run bootstrap transaction:
- Upsert `User` by `externalAuthId`
- Create `Account` and owner `AccountMember` if user has no membership
3. Build `/app/onboarding` multi-step flow:
- Step 1: business profile (`name`, `billingEmail`, `timezone`)
- Step 2: follow-up defaults (`reminder cadence`, `sender signature`, `payment terms`)
- Step 3: confirmation
4. Gate product routes until onboarding completion:
- If authenticated and `onboardingCompletedAt IS NULL`, redirect `/app/*` to `/app/onboarding` except onboarding routes.
5. Persist completion and emit `AuditEvent` records.

Exit criteria:
- New user is auto-provisioned with owner account.
- User cannot enter `/app` dashboard until onboarding is complete.

### Phase 3: Account-scoped app boundaries (maps to BILAAA-14)
1. Create account context resolver:
- Resolve active account for current user (owner/member membership check).
2. Add route handler scaffolds under `/api/app/*`:
- `/api/app/account`
- `/api/app/contacts`
- `/api/app/invoices`
- `/api/app/follow-up-rules`
3. Enforce authz in every handler:
- Unauthenticated => 401
- Authenticated without membership => 403
- Account-scoped access only => tenant isolation
4. Add optimistic structure for future role-based permissions (`owner` now, extend later).

Exit criteria:
- No account-scoped API responds without both auth and account membership.

### Phase 4: Reliability and verification (maps to BILAAA-14)
1. Integration tests:
- Middleware redirect behavior (public vs protected)
- Onboarding gate redirect logic
- Bootstrap idempotency on repeated sign-ins
2. E2E smoke tests:
- Sign-up -> first login -> onboarding completion -> `/app` access
- Returning user -> direct `/app` access
3. Operational docs:
- Auth provider setup steps
- DB migration workflow
- Local seed/reset workflow

Exit criteria:
- CI passes lint + tests, and MVP critical flow is reproducibly verifiable.

## Route and File Blueprint (planned)
1. App routes
- `src/app/(marketing)/page.tsx`
- `src/app/(auth)/sign-in/[[...sign-in]]/page.tsx`
- `src/app/(auth)/sign-up/[[...sign-up]]/page.tsx`
- `src/app/(product)/app/page.tsx`
- `src/app/(product)/app/onboarding/page.tsx`

2. Server/util modules
- `src/lib/auth/session.ts`
- `src/lib/account/context.ts`
- `src/lib/db/prisma.ts`
- `src/lib/validation/onboarding.ts`

3. API routes
- `src/app/api/app/account/route.ts`
- `src/app/api/app/contacts/route.ts`
- `src/app/api/app/invoices/route.ts`
- `src/app/api/app/follow-up-rules/route.ts`

4. Infrastructure
- `prisma/schema.prisma`
- `.env.example`
- `playwright.config.ts`
- `vitest.config.ts`

## Acceptance Criteria by Follow-up Issue
1. BILAAA-15
- Runtime strategy and environment contract finalized for authenticated routes.
- `.env.example` and baseline test tooling scripts are added and documented.

2. BILAAA-16
- Auth flow implemented with protected route enforcement and working session helper.

3. BILAAA-17
- First-login bootstrap creates account + owner membership.
- Onboarding flow persists settings and gates app access.

4. BILAAA-18
- Account-scoped authz middleware/helpers in place across app API boundaries.

5. BILAAA-19
- Test coverage for auth/onboarding critical path and related operational docs.

## Risks and Mitigations
1. Static deployment mismatch
- Risk: current site setup targets static export incompatible with auth/server APIs.
- Mitigation: split marketing static vs app server deployment or migrate site deploy target before Phase 1.

2. Vendor lock-in from managed auth
- Risk: migration overhead later.
- Mitigation: isolate provider-specific code behind `src/lib/auth/*` abstraction.

3. Future team model changes
- Risk: rework if multi-user collaboration needed soon.
- Mitigation: include `AccountMember` now even if only `owner` role used initially.

## Clarification Questions (Needed Before Build Starts)
1. Deployment and runtime
- Should authenticated app routes move to a serverful platform now (recommended), or keep only planning while marketing remains static on GitHub Pages?

2. Auth product choice
- Do you want Clerk (recommended speed/reliability) or Auth.js/NextAuth (more control, more setup)?

3. Sign-in methods for MVP
- Email/password only, or include magic link and/or Google OAuth from day one?

4. Data stack
- Is Postgres + Prisma acceptable for MVP, or do you want another datastore/ORM?

5. Onboarding data fields
- Are these MVP-required: business name, billing email, timezone, reminder defaults, payment terms?
- Any mandatory compliance/legal fields needed at onboarding?

6. Account model
- Is single owner per account enough for MVP, with multi-user invited members deferred?

7. Outbound sending identity
- During onboarding, should we collect sender name/signature only, or also SMTP/provider credentials now?

8. Environments
- Which environments must be fully supported immediately: local + production only, or include preview/staging parity?

## Deliverables for This Issue
- Expanded planning document in repo (`PLAN.md`).
- Synchronized `<plan/>` update in Paperclip issue `BILAAA-11`.
- Follow-up phase issues created and aligned to each implementation phase (`BILAAA-15` through `BILAAA-19`).

## Progress Updates
- 2026-03-10: Created initial plan in `PLAN.md`.
- 2026-03-10: Synced initial `<plan/>` block to `BILAAA-11` and created follow-up issues `BILAAA-12`, `BILAAA-13`, and `BILAAA-14`.
- 2026-03-10: Expanded `PLAN.md` to implementation-level detail and added explicit clarification questions per stakeholder request.
- 2026-03-10: Created phase-by-phase follow-up issues `BILAAA-15` to `BILAAA-19` to match each implementation part requested in issue comments.
- 2026-03-10: Started `BILAAA-15`; checked out issue and implemented runtime-target gating in `next.config.ts` for `static-marketing` vs `server-authenticated`.
- 2026-03-10: Added Phase 0 environment contract artifacts in `.env.example` and `src/lib/env.ts`, with startup validation wired in `src/app/layout.tsx`.
- 2026-03-10: Added baseline testing scaffolding for `BILAAA-15` via `vitest.config.ts`, `playwright.config.ts`, `src/app/page.test.tsx`, and `package.json` test scripts/dependencies.
- 2026-03-10: Documented runtime strategy, environment setup, and Phase 0 acceptance checks in `README.md`.
