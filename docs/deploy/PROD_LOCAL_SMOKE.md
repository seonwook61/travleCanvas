# Prod-local smoke deploy

This flow validates the production-shaped deployment without using real production secrets.

## What it uses

- Namespace: `trip-canvas-prod-local`
- Overlay: `deploy/overlays/prod-local`
- Argo app: `argocd/trip-canvas-prod-local.yaml`
- Secrets copied from `trip-canvas-staging`
- Public values copied from staging config

## What it proves

- Production-like namespace wiring works
- Two-replica deployment rolls out
- GHCR image pull succeeds
- Local ingress / service path works

## What it does not prove

- Real production Supabase connectivity
- Real production Google Maps keys
- Real production hostname / TLS

## Apply

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\deploy\Apply-ProdLocalSmoke.ps1
```

## Verify

```powershell
kubectl get application trip-canvas-prod-local -n argocd
kubectl get pods -n trip-canvas-prod-local
kubectl port-forward svc/trip-canvas -n trip-canvas-prod-local 3200:80
```
