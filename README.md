# trip-canvas

`trip-canvas` is a web-first travel planning product for Korean users preparing independent trips to Japan.

The product direction is intentionally defined before code:

- save places first
- group saved places into trips
- organize a light day-by-day itinerary
- share the full trip with a read-only link

## Current Stage

This repository now contains the first working MVP foundation:

- Japan place discovery with `Google Maps + Places`
- account-wide saved places library
- dated trip creation and light itinerary board
- explicit read-only trip sharing
- Docker / CI / Argo CD draft assets for staging delivery

The current source of truth is the document set under `docs/` plus the implemented Next.js app:

- [PRD](docs/prd/PRD.md)
- [Requirements Spec](docs/specs/product-spec.md)
- [ERD](docs/specs/ERD.md)
- [API Spec](docs/api/API_SPEC.md)
- [Screen Definition](docs/screens/SCREEN_DEFINITION.md)
- [Decision Log](docs/reports/DECISION_LOG.md)

## Product Snapshot

- Product name: `trip-canvas`
- Target market: Korean users planning free independent travel in Japan
- Platform: web first
- Tech defaults: `Next.js + Supabase + Google Maps/Places`
- Auth in MVP: `Google OAuth only`
- Core value: place-saving first, itinerary second

## Local Run

```bash
pnpm install
pnpm dev
```

Useful verification commands:

```bash
pnpm lint
pnpm exec vitest run
pnpm exec playwright test
pnpm build
```

## Deployment Drafts

The repository now includes the first deployment automation assets:

- `Dockerfile`
- `.github/workflows/ci.yml`
- `deploy/base`
- `deploy/overlays/staging`
- `argocd/trip-canvas-staging.yaml`

These are intentionally draft-level foundations for:

- GitHub Actions CI on pull requests
- GHCR image publishing on `main`
- Kustomize-based staging manifests
- Argo CD auto-sync for the staging overlay

## Next Step

The next recommended step is environment and cluster wiring:

- set the GitHub repository default branch to `main`
- add GitHub Actions secrets and environment protections
- replace staging placeholder values in `deploy/overlays/staging`
- connect the Argo CD application to the target cluster
