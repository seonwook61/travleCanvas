# staging overlay

이 overlay는 `trip-canvas-staging` 네임스페이스에 배포되는 초안입니다.

## 포함된 리소스

- `namespace.yaml`
- `configmap.yaml`
- `secret.yaml`
- `ingress.yaml`
- base `Deployment` / `Service`

## 실제 적용 전 교체해야 하는 값

### ConfigMap

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
- `NEXT_PUBLIC_SITE_URL`

### Secret

- `SUPABASE_SERVICE_ROLE_KEY`
- `GOOGLE_MAPS_SERVER_API_KEY`

## GHCR image pull secret

이 overlay는 `Deployment.spec.template.spec.imagePullSecrets`에 `ghcr-credentials`를 기대합니다.

예시:

```powershell
kubectl create secret docker-registry ghcr-credentials `
  --namespace trip-canvas-staging `
  --docker-server=ghcr.io `
  --docker-username=<github-username> `
  --docker-password=<github-pat-with-packages-read>
```

## App secret 주입 예시

```powershell
kubectl create secret generic trip-canvas-secrets `
  --namespace trip-canvas-staging `
  --from-literal=SUPABASE_SERVICE_ROLE_KEY=<staging-supabase-service-role-key> `
  --from-literal=GOOGLE_MAPS_SERVER_API_KEY=<staging-google-maps-server-key> `
  --dry-run=client -o yaml | kubectl apply -f -
```

## 권장 사항

- production 키를 staging에 넣지 않습니다.
- 실제 host가 정해지기 전에는 `NEXT_PUBLIC_SITE_URL`과 ingress host를 같이 수정합니다.
- `configmap.local.yaml`, `secret.local.yaml`는 로컬 테스트용으로만 두고 Git에는 올리지 않습니다.
