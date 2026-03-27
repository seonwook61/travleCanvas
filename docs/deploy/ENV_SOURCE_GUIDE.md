# Environment Value Source Guide

이 문서는 `trip-canvas`의 staging / production 배포에 필요한 값들을 어디서 가져오는지 정리합니다.

## Supabase

### `NEXT_PUBLIC_SUPABASE_URL`

- 출처: Supabase 프로젝트 대시보드
- 위치: `Project Connect dialog` 또는 `Settings > API Keys`
- 예시 형식: `https://<project-ref>.supabase.co`

### `NEXT_PUBLIC_SUPABASE_ANON_KEY`

- 출처: Supabase 프로젝트 대시보드
- 위치: `Settings > API Keys`
- 권장: 현재 앱 구조에서는 `publishable key` 또는 호환되는 public key를 사용
- 주의: 브라우저에 노출되는 공개 키이므로 staging/prod를 분리

### `SUPABASE_SERVICE_ROLE_KEY`

- 출처: Supabase 프로젝트 대시보드
- 위치: `Settings > API Keys`
- 주의: 서버 전용 고권한 키. Kubernetes Secret으로만 주입
- 절대 ConfigMap이나 client bundle에 넣지 않음

## Google Maps Platform

### `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`

- 출처: Google Cloud Console
- 위치: `APIs & Services > Credentials > API keys`
- 용도: 브라우저 지도/Places 호출
- 권장 제한:
  - Application restriction: `HTTP referrers`
  - API restriction: `Maps JavaScript API`, `Places API`

### `GOOGLE_MAPS_SERVER_API_KEY`

- 출처: Google Cloud Console
- 위치: `APIs & Services > Credentials > API keys`
- 용도: 서버 측 Maps/Places/Geocoding 호출
- 권장 제한:
  - Application restriction: 서버 환경에 맞는 `IP addresses` 또는 제한 없음 + API restriction
  - API restriction: 서버에서 실제로 사용할 Maps Web Service API만 허용

## Site URL

### `NEXT_PUBLIC_SITE_URL`

- 출처: 실제 배포 도메인
- staging 예시: `https://trip-canvas-staging.example.com`
- production 예시: `https://trip-canvas.example.com`
- 주의: Ingress host 값과 반드시 일치시킴

## GHCR Image Pull

### `ghcr-credentials`

- 출처: GitHub personal access token (classic) 또는 패키지 pull 가능한 자격증명
- 권장 권한: `read:packages`
- 용도: Kubernetes가 `ghcr.io/seonwook61/travlecanvas` 이미지를 pull할 수 있게 함

## 환경 분리 원칙

- staging과 production은 Supabase 프로젝트를 분리
- staging과 production은 Google Maps API key를 분리
- production domain / secret / package credential을 staging과 공유하지 않음
