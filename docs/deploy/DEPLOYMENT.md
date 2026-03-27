# trip-canvas Deployment Draft

## 목표

- PR에서는 `lint`, `vitest`, `playwright`, `build`를 자동 검증한다.
- `main` 머지 시 Docker 이미지를 `GHCR`에 푸시한다.
- Argo CD는 `deploy/overlays/staging`를 감시해 staging 환경을 자동 동기화한다.

## 현재 산출물

- `Dockerfile`
- `.github/workflows/ci.yml`
- `deploy/base`
- `deploy/overlays/staging`
- `deploy/overlays/prod`
- `argocd/trip-canvas-staging.yaml`
- `argocd/trip-canvas-prod.yaml`

## 아직 사람이 채워야 하는 값

- `deploy/overlays/staging/configmap.yaml`
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
  - `NEXT_PUBLIC_SITE_URL`
- `deploy/overlays/staging/secret.yaml`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `GOOGLE_MAPS_SERVER_API_KEY`

## 운영 전 체크리스트

- GitHub 기본 브랜치를 `main`으로 변경
- GHCR 패키지 권한 확인
- staging cluster에 `argocd` namespace와 repo credential 연결
- ingress class / hostname 정책 확인
- staging용 Supabase / Google Maps 키 분리
- `ghcr-credentials` imagePullSecret 생성
- `trip-canvas-secrets`의 실제 staging 값 주입

## 운영 참고 문서

- `docs/deploy/STAGING_ENV_WIRING.md`
- `docs/deploy/ENV_SOURCE_GUIDE.md`
