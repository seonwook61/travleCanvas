# prod overlay

이 overlay는 `trip-canvas-prod` 네임스페이스용 초안입니다.

## staging과의 차이

- replica 기본값은 `2`
- 이미지 태그는 `release-placeholder`
- host는 `trip-canvas.example.com`
- 자동 sync보다 `수동 승인 후 sync`를 권장

## 실제 적용 전 교체해야 하는 값

### ConfigMap

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
- `NEXT_PUBLIC_SITE_URL`

### Secret

- `SUPABASE_SERVICE_ROLE_KEY`
- `GOOGLE_MAPS_SERVER_API_KEY`

`trip-canvas-secrets`는 Git에 커밋된 manifest로 관리하지 않습니다.
production secret은 cluster 또는 외부 secret manager에서 생성합니다.

## GHCR image pull secret

이 overlay도 `ghcr-credentials`를 기대합니다.

## 적용 권장 순서

1. production image tag 확정
2. production env / secret 값 확정
3. ingress host / TLS 정책 확정
4. `kubectl kustomize deploy/overlays/prod`
5. Argo CD에서 수동 sync

## 권장 사항

- production에는 staging 키를 절대 사용하지 않습니다.
- `release-placeholder`는 실제 릴리스 태그로 교체한 뒤에만 적용합니다.
- prod 최초 배포 전에는 Argo CD auto-sync를 켜지 않는 편이 더 안전합니다.
- Argo CD가 실제 secret을 덮어쓰지 않도록 `kustomization.yaml`에는 secret resource를 포함하지 않습니다.
