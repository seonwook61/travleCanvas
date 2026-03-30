# Google OAuth Setup

## 목적

`trip-canvas` MVP의 `Google OAuth only` 로그인 흐름을 로컬 / staging / production에서 같은 기준으로 운영하기 위한 설정 가이드다.

이 문서는 다음 두 시스템을 함께 맞춘다.

- `Google Cloud Console`
- `Supabase Authentication > Sign In / Providers > Google`

## 가장 먼저 기억할 것

- `Google Maps API key (AIza...)`는 여기에 넣지 않는다.
- Supabase Google provider에는 `OAuth Client ID`와 `OAuth Client Secret`만 넣는다.
- `Client IDs` 칸은 `*.apps.googleusercontent.com` 형태만 허용한다.

예시:

```text
123456789012-abcdefg123456.apps.googleusercontent.com
```

## 권장 설정값

### Supabase Google Provider

경로:

`Authentication -> Sign In / Providers -> Google`

권장값:

- `Enable Sign in with Google`: `ON`
- `Client IDs`: Google Cloud에서 만든 `OAuth Client ID`
- `Client Secret (for OAuth)`: Google Cloud에서 만든 `OAuth Client Secret`
- `Skip nonce checks`: `OFF`
- `Allow users without an email`: `OFF`

설명:

- `Skip nonce checks`는 특별한 모바일 / One Tap 예외가 없으면 끄는 쪽이 안전하다.
- `Allow users without an email`은 현재 제품 정책상 꺼두는 게 맞다. `trip-canvas`는 계정 식별과 저장 라이브러리 연결이 핵심이라 이메일이 없는 계정은 허용하지 않는다.

### Callback URL

Supabase 프로젝트 기준 callback URL:

```text
https://aptgfypfpngbohaykpcs.supabase.co/auth/v1/callback
```

이 URL은 Google Cloud의 `Authorized redirect URIs`에 반드시 등록해야 한다.

## Google Cloud Console 설정

경로:

`APIs & Services -> OAuth consent screen`

최소 권장값:

- App name: `trip-canvas`
- User support email: 본인 이메일
- Audience: 테스트 단계면 `External`
- Test users: 본인 Google 계정 추가

그다음:

`APIs & Services -> Credentials -> Create Credentials -> OAuth client ID`

권장값:

- Application type: `Web application`
- Name: `trip-canvas-local-web`

### Authorized JavaScript origins

로컬 개발 기준:

```text
http://localhost:3000
```

추가로 staging을 같은 클라이언트로 확인할 거면:

```text
http://127.0.0.1:3100
https://trip-canvas-staging.example.com
```

### Authorized redirect URIs

필수:

```text
https://aptgfypfpngbohaykpcs.supabase.co/auth/v1/callback
```

## 현재 프로젝트 기준 추천값

### Supabase Google Provider

- `Enable Sign in with Google`: `ON`
- `Client IDs`: 생성한 Web OAuth Client ID 1개
- `Client Secret (for OAuth)`: 생성한 Client Secret
- `Skip nonce checks`: `OFF`
- `Allow users without an email`: `OFF`

### Google Cloud OAuth Client

- Application type: `Web application`
- Authorized JavaScript origins:
  - `http://localhost:3000`
- Authorized redirect URIs:
  - `https://aptgfypfpngbohaykpcs.supabase.co/auth/v1/callback`

## 헷갈리기 쉬운 값 구분

### 여기에 넣는 값

- `OAuth Client ID`
- `OAuth Client Secret`

### 여기에 넣으면 안 되는 값

- `Google Maps browser key`
- `Google Maps server key`
- `Supabase publishable key`
- `Supabase secret key`
- `Project URL`

## 문제 해결

### Unsupported provider: provider is not enabled

원인:

- Supabase에서 Google provider가 꺼져 있음
- 또는 `Client ID / Client Secret` 저장이 안 됨

해결:

- Supabase Google provider를 `ON`
- OAuth Client ID / Secret 입력 후 저장

### Invalid characters. Google Client IDs should be...

원인:

- `Client IDs` 칸에 API key나 secret을 넣었음

해결:

- `*.apps.googleusercontent.com` 형태의 OAuth Client ID만 입력

### Google 로그인 버튼을 눌렀는데 콜백에서 실패

확인할 것:

- Google Cloud `Authorized redirect URIs`에 아래 값이 정확히 있는지

```text
https://aptgfypfpngbohaykpcs.supabase.co/auth/v1/callback
```

## 운영 메모

- production 도메인을 열면 production용 OAuth client를 별도로 운영하는 것이 가장 깔끔하다.
- 최소한 production에서는 `Authorized JavaScript origins`와 `Authorized redirect URIs`를 운영 도메인 기준으로 다시 점검한다.
