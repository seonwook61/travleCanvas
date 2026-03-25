# trip-canvas Decision Log

## 2026-03-25

### Locked product decisions

- Product axis: place-saving first
- Platform: web first
- Main app layout: map main + left saved panel
- Mobile future layout: full-width map + bottom sheet
- Planning depth: light day-by-day itinerary
- Login timing: browsing without login, login required on save
- Share model: full trip detail, read-only
- Place source: external place search API
- Geography: Japan-wide search with major cities prioritized in UX
- Map provider: Google Maps + Places
- Save states: `wishlist | visited | favorite`
- Design tone: airy minimal for app, pinboard + route board with postcard motifs for shared page
- Saved place scope: account-wide library reusable across trips
- Itinerary basis: real calendar date + Day label
- Language/market: Korean users, Korean UI
- Privacy default: private by default, explicit share-link creation
- Notes scope: short text only

### Follow-up decisions deferred to implementation planning

- exact auth providers
- share link expiry / rotation policy
- cache strategy for search and trip pages
- analytics event catalog

