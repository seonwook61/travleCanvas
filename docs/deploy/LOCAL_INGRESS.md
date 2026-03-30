# Local ingress for Docker Desktop Kubernetes

`trip-canvas` local staging uses `ingress-nginx` so Argo CD can evaluate the `Ingress` as healthy instead of leaving the app in `Progressing`.

## Install

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\deploy\Install-LocalIngressNginx.ps1
```

## Verify

```powershell
kubectl get svc -n ingress-nginx
kubectl get ingress -n trip-canvas-staging -o wide
kubectl get application trip-canvas-staging -n argocd -o jsonpath="{.status.sync.status} {.status.health.status}"
```

Expected result:
- `ingress-nginx-controller` is `LoadBalancer`
- `trip-canvas` ingress has an `ADDRESS`
- Argo CD app becomes `Synced Healthy`

## Notes

- For local Docker Desktop Kubernetes, this is usually enough so a custom Argo ingress health override is not needed.
- If the hostname is not directly routable from Windows, keep using `port-forward` for browser verification and treat ingress as a cluster-level health signal.
