# trip-canvas

`trip-canvas` is a web-first travel planning product for Korean users preparing independent trips to Japan.

The product direction is intentionally defined before code:

- save places first
- group saved places into trips
- organize a light day-by-day itinerary
- share the full trip with a read-only link

## Current Stage

This repository is in the `product-definition` stage.

The current source of truth is the document set under `docs/`:

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
- Core value: place-saving first, itinerary second

## Next Step

The next recommended step is to use the superpowers `writing-plans` workflow and turn the current docs into a detailed implementation plan under `docs/superpowers/plans/`.
