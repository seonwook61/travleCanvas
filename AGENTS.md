# trip-canvas Agent Guide

## Working Mode

- Keep product documents under `docs/` as the source of truth.
- Do not start app scaffolding until the current PRD, spec, ERD, API, and screen definition stay aligned.
- Prefer small branches with the `codex/` prefix when working from Codex.

## Documentation Layout

- `docs/prd/PRD.md`
- `docs/specs/product-spec.md`
- `docs/specs/ERD.md`
- `docs/api/API_SPEC.md`
- `docs/screens/SCREEN_DEFINITION.md`
- `docs/reports/DECISION_LOG.md`
- `docs/superpowers/plans/`

## Product Defaults

- Product axis: place-saving first
- Geography: Japan-wide search with Tokyo / Osaka / Kyoto prioritized in UX
- Place source: Google Maps + Places
- Privacy: trips are private by default, share links are explicit and read-only
- Login policy: browsing without login, login required on save
- MVP itinerary depth: light day-by-day planning with real dates plus Day labels

## Writing Rules

- Write product docs in Korean.
- Keep code, type, and API field names in English.
- Call out open questions explicitly instead of silently deciding.

