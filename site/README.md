# BillyBee Site

Next.js app for the BillyBee marketing site.

## Runtime strategy

BillyBee now supports two runtime targets controlled by `BILLYBEE_RUNTIME_TARGET`:

- `static-marketing` (default): static-export marketing site, compatible with GitHub Pages.
- `server-authenticated`: server runtime for authenticated app routes (`/app/*`, `/api/app/*`), auth/session checks, and database-backed APIs.

This keeps today's marketing deployment stable while making the authenticated app rollout explicit.

When `BILLYBEE_RUNTIME_TARGET=server-authenticated`, startup enforces required environment variables:

- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `DATABASE_URL`
- `APP_URL`

## Local development

1. Install Node.js 22+.
2. Install dependencies:

```sh
npm install
```

3. Start dev server:

```sh
npm run dev
```

## Environment setup

1. Copy `.env.example` to `.env.local`.
2. Keep `BILLYBEE_RUNTIME_TARGET=static-marketing` for marketing-only development.
3. Switch to `BILLYBEE_RUNTIME_TARGET=server-authenticated` once auth + backend work starts, then set required keys.

## Testing baseline

Unit/integration baseline:

```sh
npm test
```

E2E baseline scaffold:

```sh
npm run test:e2e
```

## Deployment

GitHub Actions workflow is configured in `../.github/workflows/deploy-site.yml` (repo root).

- On push to `main`, it builds a static export (`next build` with `output: "export"`).
- The generated `out/` directory is deployed to GitHub Pages.
- For authenticated app rollout, deploy with `BILLYBEE_RUNTIME_TARGET=server-authenticated` on a server-capable platform.

Repository settings required:

1. In GitHub, open `Settings -> Pages`.
2. Set source to `GitHub Actions`.

## Phase 0 acceptance checks

Run these commands for baseline verification:

```sh
npm run lint
npm test
npm run build
```

For static marketing compatibility:

```sh
BILLYBEE_RUNTIME_TARGET=static-marketing npm run build
```

For authenticated runtime env guard validation:

```sh
BILLYBEE_RUNTIME_TARGET=server-authenticated npm run build
```
