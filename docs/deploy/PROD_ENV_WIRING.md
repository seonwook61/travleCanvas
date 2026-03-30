# Production env wiring

`prod` uses a separate namespace and separate secrets even though the secret object name stays `trip-canvas-secrets`.

## Public values

Update these files before first prod apply:

- `deploy/overlays/prod/configmap.yaml`
- `deploy/overlays/prod/ingress.yaml`
- `deploy/overlays/prod/kustomization.yaml`

Required values:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
- `NEXT_PUBLIC_SITE_URL`
- `release-placeholder` image tag -> real release tag

## Secrets

Create production secrets separately from staging:

```powershell
$env:GHCR_USERNAME='seonwook61'
$env:GHCR_TOKEN='<ghcr-read-token>'
$env:SUPABASE_SERVICE_ROLE_KEY='<prod-supabase-secret>'
$env:GOOGLE_MAPS_SERVER_API_KEY='<prod-google-server-key>'

powershell -ExecutionPolicy Bypass -File .\scripts\deploy\Apply-ProdSecrets.ps1
```

## Argo CD app

After overlay placeholders are replaced:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\deploy\Apply-ProdArgoApp.ps1
```

## Separation rules

- Never reuse staging Supabase keys in prod.
- Never reuse staging Google Maps browser/server keys in prod.
- Keep `trip-canvas-staging` and `trip-canvas-prod` namespaces fully separate.
