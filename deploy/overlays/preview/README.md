# Preview overlay

This overlay is used by the Argo CD pull-request `ApplicationSet`.

## Behavior

- Preview apps share the `trip-canvas-preview` namespace.
- Each PR gets a resource name suffix: `-pr-<number>`.
- Shared cluster secrets stay fixed:
  - `ghcr-credentials`
  - `trip-canvas-secrets`

## Access

Use `kubectl port-forward` for local verification:

```powershell
kubectl port-forward svc/trip-canvas-pr-123 -n trip-canvas-preview 3000:80
```
