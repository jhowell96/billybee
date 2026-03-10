# BillyBee Site

Next.js app for the BillyBee marketing site.

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

## Deployment

GitHub Actions workflow is configured in `../.github/workflows/deploy-site.yml` (repo root).

- On push to `main`, it builds a static export (`next build` with `output: "export"`).
- The generated `out/` directory is deployed to GitHub Pages.

Repository settings required:

1. In GitHub, open `Settings -> Pages`.
2. Set source to `GitHub Actions`.
