# Deployment Guide — HireHub Onboarding Portal

## Overview

This project is a static single-page application (SPA) built with **Vite + React 18**. It is designed to be deployed on **Vercel** as a static site with no server-side runtime required.

---

## Build Configuration

### Build Command

```bash
npm run build
```

This runs `vite build`, which produces an optimized production bundle.

### Output Directory

```
dist
```

Vite outputs all compiled assets (HTML, JS, CSS, images) into the `dist` folder at the project root.

---

## Vercel Deployment

### Option 1: Automatic Git Integration (Recommended)

1. Push your repository to **GitHub**, **GitLab**, or **Bitbucket**.
2. Log in to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your repository.
4. Vercel auto-detects Vite projects. Confirm the following settings:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
5. Click **Deploy**.

Every subsequent push to the default branch triggers an automatic production deployment. Pull requests generate unique preview deployments.

### Option 2: Vercel CLI

```bash
# Install the Vercel CLI globally
npm install -g vercel

# Deploy from the project root
vercel

# Deploy directly to production
vercel --prod
```

---

## SPA Rewrites Configuration

Since this is a single-page application using client-side routing, all routes must resolve to `index.html`. Create a `vercel.json` file in the project root:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This ensures that navigating directly to any route (e.g., `/dashboard`, `/onboarding/step-2`) serves the SPA entry point instead of returning a 404.

---

## Environment Variables

**No environment variables are required** for the current deployment.

If environment variables are added in the future, follow these conventions:

- All client-side variables **must** be prefixed with `VITE_` (e.g., `VITE_API_URL`).
- Access them in code via `import.meta.env.VITE_API_URL`.
- **Never** use `process.env` — Vite does not support it in client code.
- Add variables in the Vercel dashboard under **Project Settings → Environment Variables**.
- Variables can be scoped to **Production**, **Preview**, or **Development** environments.

---

## CI/CD Notes

### Automatic Deployments

When connected via Git integration, Vercel handles CI/CD automatically:

| Trigger                        | Environment | URL                              |
| ------------------------------ | ----------- | -------------------------------- |
| Push to default branch (`main`) | Production  | `your-project.vercel.app`       |
| Push to any other branch       | Preview     | `your-project-<hash>.vercel.app` |
| Pull request opened/updated    | Preview     | Unique URL posted as PR comment  |

### Build Caching

Vercel caches `node_modules` between builds. If you encounter stale dependency issues, trigger a redeployment with the cache cleared:

```bash
vercel --force
```

Or in the Vercel dashboard: **Deployments → ⋮ → Redeploy → toggle "Clear Build Cache"**.

### Branch Protection

For production stability, consider:

- Requiring PR reviews before merging to `main`.
- Running `npm run lint` and `npm test` in a GitHub Actions workflow before Vercel builds.

Example GitHub Actions pre-check (`.github/workflows/ci.yml`):

```yaml
name: CI
on:
  pull_request:
    branches: [main]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm test -- --run
```

---

## Troubleshooting

| Issue                              | Solution                                                                                         |
| ---------------------------------- | ------------------------------------------------------------------------------------------------ |
| 404 on direct route access         | Ensure `vercel.json` contains the SPA rewrite rule shown above.                                  |
| Blank page after deploy            | Check the browser console for errors. Verify `base` in `vite.config.js` is `'/'` (the default). |
| Environment variable is `undefined`| Confirm the variable name starts with `VITE_` and was added in Vercel project settings.          |
| Stale assets after deploy          | Hard-refresh the browser (`Ctrl+Shift+R`) — Vite uses content-hashed filenames for cache busting.|