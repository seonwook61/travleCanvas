# Prod-local smoke overlay

This overlay is a safe local rehearsal of the production topology.

## Purpose

- Validate the production-shaped namespace, replica count, service, ingress, and image pull path
- Avoid using real production secrets or domains
- Reuse staging public values and staging cluster secrets for a local-only smoke test

## Differences from real prod

- Namespace: `trip-canvas-prod-local`
- Public config reuses staging values
- Image tag defaults to `main`
- Secrets are copied from `trip-canvas-staging`

## Access

Use port-forward or local ingress resolution after deploy:

```powershell
kubectl port-forward svc/trip-canvas -n trip-canvas-prod-local 3200:80
```
