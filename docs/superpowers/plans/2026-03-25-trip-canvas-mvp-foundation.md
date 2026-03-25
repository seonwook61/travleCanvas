# trip-canvas MVP Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first working web-first `trip-canvas` MVP foundation: Japan place discovery, account-wide saved places, trip creation, light day-by-day itinerary, and read-only trip sharing.

**Architecture:** Use a single Next.js App Router application in this repository. Google Maps JavaScript API + Places powers map rendering and place discovery, while Supabase provides Google OAuth, Postgres, and RLS-protected persistence. The core domain stays place-library-first: users save places into an account-wide library, then build trips by reusing those saved places through dated itinerary items.

**Tech Stack:** pnpm, Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui, Supabase Auth/Postgres, Google Maps JavaScript API + Places, Zod, React Hook Form, Vitest, Playwright

---

## File Structure Map

### App and Configuration

- Create: `package.json`
- Create: `pnpm-workspace.yaml`
- Create: `next.config.ts`
- Create: `tsconfig.json`
- Create: `eslint.config.mjs`
- Create: `postcss.config.mjs`
- Create: `tailwind.config.ts`
- Create: `components.json`
- Create: `.env.example`

### Application Shell

- Create: `app/layout.tsx`
- Create: `app/page.tsx`
- Create: `app/auth/sign-in/page.tsx`
- Create: `app/auth/callback/route.ts`
- Create: `app/saved/page.tsx`
- Create: `app/trips/new/page.tsx`
- Create: `app/trips/[tripId]/page.tsx`
- Create: `app/share/[token]/page.tsx`
- Create: `app/api/places/search/route.ts`
- Create: `app/api/saved-places/route.ts`
- Create: `app/api/trips/route.ts`
- Create: `app/api/trips/[tripId]/route.ts`
- Create: `app/api/trips/[tripId]/itinerary-items/route.ts`
- Create: `app/api/trips/[tripId]/share-links/route.ts`
- Create: `app/api/shared/trips/[token]/route.ts`

### Shared Domain and Infra

- Create: `src/lib/env.ts`
- Create: `src/lib/supabase/browser.ts`
- Create: `src/lib/supabase/server.ts`
- Create: `src/lib/auth/require-user.ts`
- Create: `src/lib/google-maps/load-script.ts`
- Create: `src/lib/google-maps/normalize-place.ts`
- Create: `src/lib/types/domain.ts`
- Create: `src/lib/validation/saved-place.ts`
- Create: `src/lib/validation/trip.ts`
- Create: `src/lib/validation/share-link.ts`

### UI Features

- Create: `src/features/map-home/`
- Create: `src/features/saved-places/`
- Create: `src/features/trips/`
- Create: `src/features/share/`
- Create: `src/components/ui/`

### Database

- Create: `supabase/migrations/20260325_000001_initial_schema.sql`
- Create: `supabase/migrations/20260325_000002_rls_policies.sql`
- Create: `supabase/seed.sql`

### Tests

- Create: `tests/unit/normalize-place.test.ts`
- Create: `tests/unit/saved-place-schema.test.ts`
- Create: `tests/unit/trip-schema.test.ts`
- Create: `tests/integration/api.saved-places.test.ts`
- Create: `tests/integration/api.trips.test.ts`
- Create: `tests/e2e/map-home.spec.ts`
- Create: `tests/e2e/trip-flow.spec.ts`
- Create: `playwright.config.ts`
- Create: `vitest.config.ts`

## Locked Decisions For Implementation

- Package manager: `pnpm`
- Runtime model: single app repo, no monorepo
- Auth provider for MVP: `Google OAuth only`
- Saved place statuses: `wishlist | visited | favorite`
- Trip visibility default: `private`
- Share links: explicit creation, `read_only`, one token per create action
- Home layout: desktop `map main + left panel`
- Shared page layout: `pinboard collection + route board hybrid`
- Notes: short text only, no images
- Geography: search entire Japan, home UI prioritizes Tokyo / Osaka / Kyoto

## Public Interfaces

### Domain Types

```ts
export type SavedPlaceStatus = "wishlist" | "visited" | "favorite";
export type TripVisibility = "private";
export type ShareLinkPermission = "read_only";
```

### Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
GOOGLE_MAPS_SERVER_API_KEY=
```

### API Endpoints

- `GET /api/places/search`
- `GET /api/saved-places`
- `POST /api/saved-places`
- `POST /api/trips`
- `GET /api/trips/:tripId`
- `POST /api/trips/:tripId/itinerary-items`
- `POST /api/trips/:tripId/share-links`
- `GET /api/shared/trips/:token`

## Task 1: Bootstrap the runtime app from the docs baseline

**Files:**
- Create: `package.json`
- Create: `next.config.ts`
- Create: `tsconfig.json`
- Create: `eslint.config.mjs`
- Create: `postcss.config.mjs`
- Create: `tailwind.config.ts`
- Create: `app/layout.tsx`
- Create: `app/page.tsx`
- Test: `tests/e2e/map-home.spec.ts`

- [ ] **Step 1: Create the pnpm + Next.js baseline files**

Use `Next.js App Router + TypeScript + Tailwind CSS` as the only app foundation. Do not add mobile, PWA, or workspace packages in this phase.

- [ ] **Step 2: Write a failing smoke test for the home route**

Create a Playwright test that expects the home page to render:
- app title `trip-canvas`
- search input
- left panel placeholder
- map placeholder

- [ ] **Step 3: Run the e2e smoke test to confirm failure**

Run:

```bash
pnpm exec playwright test tests/e2e/map-home.spec.ts
```

Expected:
- FAIL because the app shell and route do not exist yet

- [ ] **Step 4: Implement the app shell and home page**

The first pass only needs:
- app frame
- Korean UI copy
- top search region
- left saved panel placeholder
- map region placeholder

- [ ] **Step 5: Add base styling and component primitives**

Use Tailwind and shadcn/ui primitives for buttons, inputs, cards, tabs, and sheet/dialog patterns.

- [ ] **Step 6: Run the smoke test again**

Run:

```bash
pnpm exec playwright test tests/e2e/map-home.spec.ts
```

Expected:
- PASS

- [ ] **Step 7: Commit**

```bash
git add package.json pnpm-lock.yaml next.config.ts tsconfig.json eslint.config.mjs postcss.config.mjs tailwind.config.ts app src tests playwright.config.ts
git commit -m "chore(app): scaffold next.js web foundation"
```

## Task 2: Add environment handling, auth, and Supabase schema

**Files:**
- Create: `.env.example`
- Create: `src/lib/env.ts`
- Create: `src/lib/supabase/browser.ts`
- Create: `src/lib/supabase/server.ts`
- Create: `src/lib/auth/require-user.ts`
- Create: `supabase/migrations/20260325_000001_initial_schema.sql`
- Create: `supabase/migrations/20260325_000002_rls_policies.sql`
- Test: `tests/unit/saved-place-schema.test.ts`
- Test: `tests/unit/trip-schema.test.ts`

- [ ] **Step 1: Write failing schema tests for the core domain**

Cover:
- `SavedPlaceStatus`
- trip create payload
- share link payload shape

- [ ] **Step 2: Run the unit tests to verify failure**

Run:

```bash
pnpm exec vitest run tests/unit/saved-place-schema.test.ts tests/unit/trip-schema.test.ts
```

Expected:
- FAIL because schema modules do not exist yet

- [ ] **Step 3: Implement env parsing and Supabase client helpers**

Lock the required env names and export typed helpers for browser and server usage.

- [ ] **Step 4: Create the initial database schema**

Add SQL for:
- `profiles`
- `saved_places`
- `trips`
- `trip_days`
- `itinerary_items`
- `share_links`

Include key constraints:
- `saved_places.status` enum-compatible check
- `trips.visibility = private`
- `share_links.permission = read_only`

- [ ] **Step 5: Add RLS policies**

Requirements:
- authenticated users only access their own `saved_places` and `trips`
- shared trip query path reads through server-side token lookup, not direct public table reads

- [ ] **Step 6: Add Google OAuth-only auth wiring**

Create:
- sign-in page
- callback route
- auth helper for protected write routes

- [ ] **Step 7: Run unit tests**

Run:

```bash
pnpm exec vitest run tests/unit/saved-place-schema.test.ts tests/unit/trip-schema.test.ts
```

Expected:
- PASS

- [ ] **Step 8: Commit**

```bash
git add .env.example src/lib supabase tests
git commit -m "feat(auth): add supabase auth and core schema"
```

## Task 3: Build map-first discovery and place normalization

**Files:**
- Create: `src/lib/google-maps/load-script.ts`
- Create: `src/lib/google-maps/normalize-place.ts`
- Create: `app/api/places/search/route.ts`
- Create: `src/features/map-home/MapHomePage.tsx`
- Create: `src/features/map-home/PlaceSearchBox.tsx`
- Create: `src/features/map-home/MapCanvas.tsx`
- Test: `tests/unit/normalize-place.test.ts`
- Test: `tests/e2e/map-home.spec.ts`

- [ ] **Step 1: Write a failing normalization test**

Cover:
- provider payload -> app domain result
- required output fields
- Japan region/city metadata preservation

- [ ] **Step 2: Run the normalization test**

Run:

```bash
pnpm exec vitest run tests/unit/normalize-place.test.ts
```

Expected:
- FAIL because normalization helper is missing

- [ ] **Step 3: Implement Google Maps loader and normalization helper**

The app should standardize all external place results into one domain shape before save.

- [ ] **Step 4: Implement the place search route**

The route should:
- receive `q`, `city`, `region`
- query Google Places
- return normalized results

- [ ] **Step 5: Replace map placeholders with the real discovery shell**

Home page must now render:
- search box
- major city quick-entry buttons
- live map canvas
- place result preview with save CTA

- [ ] **Step 6: Re-run unit and e2e tests**

Run:

```bash
pnpm exec vitest run tests/unit/normalize-place.test.ts
pnpm exec playwright test tests/e2e/map-home.spec.ts
```

Expected:
- PASS

- [ ] **Step 7: Commit**

```bash
git add app/api/places src/lib/google-maps src/features/map-home tests
git commit -m "feat(map-view): add google places discovery shell"
```

## Task 4: Implement the account-wide saved places library

**Files:**
- Create: `app/saved/page.tsx`
- Create: `app/api/saved-places/route.ts`
- Create: `src/features/saved-places/SavedPlacesPage.tsx`
- Create: `src/features/saved-places/SavedPlaceCard.tsx`
- Create: `src/features/saved-places/SavedPlaceFilters.tsx`
- Create: `src/lib/validation/saved-place.ts`
- Test: `tests/integration/api.saved-places.test.ts`

- [ ] **Step 1: Write a failing integration test for saving a place**

Cover:
- auth required on save
- valid place payload accepted
- invalid status rejected

- [ ] **Step 2: Run the integration test to confirm failure**

Run:

```bash
pnpm exec vitest run tests/integration/api.saved-places.test.ts
```

Expected:
- FAIL because the route and validation do not exist yet

- [ ] **Step 3: Implement saved-place validation**

Lock:
- `wishlist | visited | favorite`
- note as short text
- required normalized location fields

- [ ] **Step 4: Implement the saved-place API**

Requirements:
- GET returns only the signed-in user's library
- POST requires auth and inserts one saved place

- [ ] **Step 5: Implement the library page**

Requirements:
- grouped/filterable list
- status filters
- action to start trip creation from selected items

- [ ] **Step 6: Re-run the saved-place integration test**

Run:

```bash
pnpm exec vitest run tests/integration/api.saved-places.test.ts
```

Expected:
- PASS

- [ ] **Step 7: Commit**

```bash
git add app/saved app/api/saved-places src/features/saved-places src/lib/validation tests
git commit -m "feat(saved-places): add account-wide saved place library"
```

## Task 5: Implement trip creation and dated itinerary management

**Files:**
- Create: `app/trips/new/page.tsx`
- Create: `app/trips/[tripId]/page.tsx`
- Create: `app/api/trips/route.ts`
- Create: `app/api/trips/[tripId]/route.ts`
- Create: `app/api/trips/[tripId]/itinerary-items/route.ts`
- Create: `src/features/trips/TripCreatePage.tsx`
- Create: `src/features/trips/TripDetailPage.tsx`
- Create: `src/features/trips/TripDayColumn.tsx`
- Create: `src/lib/validation/trip.ts`
- Test: `tests/integration/api.trips.test.ts`
- Test: `tests/e2e/trip-flow.spec.ts`

- [ ] **Step 1: Write failing tests for trip creation and itinerary placement**

Cover:
- trip create payload with title and dates
- trip day generation
- saved place placement into a trip day
- protected route behavior

- [ ] **Step 2: Run the failing tests**

Run:

```bash
pnpm exec vitest run tests/integration/api.trips.test.ts
pnpm exec playwright test tests/e2e/trip-flow.spec.ts
```

Expected:
- FAIL because routes and screens do not exist yet

- [ ] **Step 3: Implement trip validation and trip creation API**

Rules:
- `startDate <= endDate`
- create `trip_days` from the date range
- trip default visibility is `private`

- [ ] **Step 4: Implement trip creation page**

The page should let users:
- choose saved places
- set title
- set start/end dates
- submit trip creation

- [ ] **Step 5: Implement trip detail page**

Requirements:
- show `2026-04-17 (Day 1)` style labels
- render day columns or sections
- support reusing saved places into itinerary slots
- support short note editing

- [ ] **Step 6: Re-run integration and e2e trip tests**

Run:

```bash
pnpm exec vitest run tests/integration/api.trips.test.ts
pnpm exec playwright test tests/e2e/trip-flow.spec.ts
```

Expected:
- PASS

- [ ] **Step 7: Commit**

```bash
git add app/trips app/api/trips src/features/trips src/lib/validation tests
git commit -m "feat(itinerary-board): add trip creation and day-based itinerary"
```

## Task 6: Implement explicit read-only trip sharing

**Files:**
- Create: `app/share/[token]/page.tsx`
- Create: `app/api/trips/[tripId]/share-links/route.ts`
- Create: `app/api/shared/trips/[token]/route.ts`
- Create: `src/features/share/SharedTripPage.tsx`
- Create: `src/features/share/PinboardSection.tsx`
- Create: `src/features/share/RouteBoardSection.tsx`
- Create: `src/lib/validation/share-link.ts`
- Test: `tests/integration/api.share-links.test.ts`
- Test: `tests/e2e/shared-trip.spec.ts`

- [ ] **Step 1: Write failing tests for share link creation and public read**

Cover:
- auth required to create link
- shared endpoint returns only public read model
- inactive/invalid token handling

- [ ] **Step 2: Run the failing share tests**

Run:

```bash
pnpm exec vitest run tests/integration/api.share-links.test.ts
pnpm exec playwright test tests/e2e/shared-trip.spec.ts
```

Expected:
- FAIL because share-link routes and page do not exist yet

- [ ] **Step 3: Implement share-link token generation**

Rules:
- create token only on explicit user action
- store `read_only` permission
- do not expose edit operations on the public route

- [ ] **Step 4: Implement the shared trip page**

Requirements:
- read-only page
- title and travel dates
- saved place highlights
- date-based route board sections
- postcard / stamp motif as decoration only

- [ ] **Step 5: Re-run share tests**

Run:

```bash
pnpm exec vitest run tests/integration/api.share-links.test.ts
pnpm exec playwright test tests/e2e/shared-trip.spec.ts
```

Expected:
- PASS

- [ ] **Step 6: Commit**

```bash
git add app/share app/api/trips src/features/share src/lib/validation tests
git commit -m "feat(share-links): add read-only trip sharing"
```

## Task 7: Final QA, docs sync, and branch completion

**Files:**
- Modify: `README.md`
- Modify: `docs/prd/PRD.md`
- Modify: `docs/specs/product-spec.md`
- Modify: `docs/api/API_SPEC.md`
- Modify: `docs/screens/SCREEN_DEFINITION.md`
- Test: all existing tests

- [ ] **Step 1: Sync implementation deltas back into docs**

Only update docs where implementation required clarifying a previously open point:
- auth provider
- route naming
- share-link behavior

- [ ] **Step 2: Run the full quality suite**

Run:

```bash
pnpm lint
pnpm exec vitest run
pnpm exec playwright test
pnpm build
```

Expected:
- all commands pass with exit code 0

- [ ] **Step 3: Review the branch against the original product decisions**

Check:
- place-saving first remains true
- browsing without login still works
- sharing is still explicit and read-only
- itinerary is still light, not time-slot based

- [ ] **Step 4: Commit docs and final cleanup**

```bash
git add README.md docs
git commit -m "docs(product): sync MVP implementation details"
```

- [ ] **Step 5: Prepare branch completion**

Use the superpowers `finishing-a-development-branch` workflow after all checks are green.

## Acceptance Scenarios

- Anonymous user can search Japan places and explore the map.
- Anonymous user is prompted to sign in when trying to save a place.
- Authenticated user can save a place as `wishlist`, `visited`, or `favorite`.
- Authenticated user can view their account-wide place library and reuse items across trips.
- Authenticated user can create a trip with real dates and Day labels.
- Authenticated user can place saved locations into specific trip days.
- Authenticated user can generate a read-only share link.
- A public visitor can open the share link and see the full trip detail in read-only mode.

## Notes For The Implementer

- Do not add collaboration, booking, or route optimization in this plan.
- Do not collapse `saved_places` into trip-local data; reuse remains a hard requirement.
- Keep the first pass web-only. Mobile-specific layout work is follow-up work, not part of this plan.
- If Google Places billing or quota becomes a blocker, pause and surface it before introducing fallback providers.
