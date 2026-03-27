# Staging Environment Wiring

## 목적

`trip-canvas` staging 배포에 필요한 환경 변수, Kubernetes secret, GHCR image pull, Argo CD 연결 지점을 명확히 고정한다.

## 1. GitHub

- 저장소 기본 브랜치를 `main`으로 변경
- GHCR 패키지가 cluster에서 pull 가능해야 함
- Argo CD가 private repo를 읽는다면 repo credential 필요

## 2. Kubernetes namespace

- namespace: `trip-canvas-staging`
- overlay path: `deploy/overlays/staging`
- image pull secret: `ghcr-credentials`
- app secret: `trip-canvas-secrets`

## 3. Public env mapping

ConfigMap `trip-canvas-env`

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
- `NEXT_PUBLIC_SITE_URL`

## 4. Server secret mapping

Secret `trip-canvas-secrets`

- `SUPABASE_SERVICE_ROLE_KEY`
- `GOOGLE_MAPS_SERVER_API_KEY`

## 5. Argo CD

적용 대상 manifest:

- `argocd/trip-canvas-staging.yaml`

Argo가 기대하는 것:

- repo URL 접근 가능
- `main` 브랜치 읽기 가능
- cluster 안의 `argocd` namespace 존재
- `trip-canvas-staging` namespace 생성 가능

## 6. 적용 순서

1. staging public env 값 확정
2. staging secret 값 확정
3. `ghcr-credentials` 생성
4. `trip-canvas-secrets` 적용
5. ingress host 확정
6. Argo CD application 생성 / sync
