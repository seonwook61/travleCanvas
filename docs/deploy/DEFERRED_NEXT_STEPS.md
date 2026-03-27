# Deferred Next Steps

이 문서는 지금 바로 진행하지 않고, `배포/운영 작업이 거의 마무리될 때` 다시 꺼내볼 항목을 적어둔 메모입니다.

## Deferred by choice

다음 단계는 지금 보류하고, 이후 배포 작업이 끝나가는 시점에 다시 진행합니다.

### 1. staging actual env wiring

- `deploy/overlays/staging/configmap.yaml` 실제 값 입력
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
  - `NEXT_PUBLIC_SITE_URL`
- `deploy/overlays/staging/secret.yaml` 실제 값 입력
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `GOOGLE_MAPS_SERVER_API_KEY`

### 2. cluster wiring

- Kubernetes current context 연결
- `trip-canvas-staging` namespace 확인
- `ghcr-credentials` 생성
- `trip-canvas-secrets` 생성

### 3. Argo CD apply

- `argocd/trip-canvas-staging.yaml` 적용
- Argo repo credential 확인
- sync / health 확인

### 4. staging live verification

- ingress host 접속 확인
- `/api/health` 응답 확인
- 앱 홈 화면이 실제로 뜨는지 확인

## Reminder rule

이 프로젝트에서 배포 자동화 작업이 거의 끝나갈 때, 아래 질문을 다시 사용자에게 먼저 꺼냅니다.

> 보류해둔 `staging actual env wiring / cluster wiring / Argo 적용` 단계로 넘어갈까요?

## Related docs

- `docs/deploy/DEPLOYMENT.md`
- `docs/deploy/STAGING_ENV_WIRING.md`
- `docs/deploy/ENV_SOURCE_GUIDE.md`
