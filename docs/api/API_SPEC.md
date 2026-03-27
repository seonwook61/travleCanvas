# trip-canvas API Spec

## 원칙

- 현재 문서는 구현된 MVP foundation 기준이다.
- 모든 write API는 인증이 필요하다.
- 모든 trip 공유 조회 API는 읽기 전용이다.
- 인증 제공자는 `Google OAuth only`다.

## 1. 장소 검색

### GET `/api/places/search`

목적:
- 일본 장소 검색 결과를 반환한다.

Query:
- `q`: search text
- `city`: optional city hint
- `region`: optional region hint

Response:
- `items[]`
  - `providerPlaceId`
  - `name`
  - `formattedAddress`
  - `latitude`
  - `longitude`
  - `city`
  - `region`
  - `countryCode`
  - `primaryCategory?`
  - `googleMapsUri?`
  - `photoUrl?`
- `meta`
  - `source`: `google | fallback`
  - `query`
  - `city?`
  - `region?`

## 2. 장소 저장

### POST `/api/saved-places`

목적:
- 검색 결과 또는 외부 장소 정보를 계정 라이브러리에 저장한다.

Auth:
- required

Request:
- `providerPlaceId`
- `name`
- `formattedAddress`
- `latitude`
- `longitude`
- `city`
- `region`
- `countryCode`
- `googleMapsUri?`
- `photoUrl?`
- `primaryCategory?`
- `status`
- `note?`

Response:
- `item`

### GET `/api/saved-places`

목적:
- 사용자 저장 장소 목록을 상태별로 조회한다.

Auth:
- required

Query:
- `status?`

Response:
- `items[]`

## 3. Trip 생성

### POST `/api/trips`

목적:
- 저장한 장소를 기반으로 새 trip을 만든다.

Auth:
- required

Request:
- `title`
- `startDate`
- `endDate`
- `selectedPlaceIds[]`

Response:
- `trip`
- `tripDays[]`

### GET `/api/trips/:tripId`

목적:
- trip detail과 날짜별 itinerary를 조회한다.

Auth:
- required

Response:
- `trip`
- `tripDays[]`
- `savedPlaces[]`

## 4. itinerary 배치

### POST `/api/trips/:tripId/itinerary-items`

목적:
- saved place를 특정 trip day에 배치한다.

Auth:
- required

Request:
- `tripDayId`
- `savedPlaceId`
- `note?`

Response:
- `item`

## 5. 공유 링크

### POST `/api/trips/:tripId/share-links`

목적:
- 읽기 전용 trip 공유 링크를 생성한다.

Auth:
- required

Request:
- `tripId`
- `permission`: `read_only`

Response:
- `shareLink`
  - `token`
  - `tripId`
  - `permission`
  - `createdBy`
  - `createdAt`
  - `expiresAt`

### GET `/api/shared/trips/:token`

목적:
- 읽기 전용 공유 페이지용 trip 상세를 반환한다.

Auth:
- not required

Response:
- `shareLink`
- `trip`
- `tripDays[]`
- `savedPlaceHighlights[]`

Invalid token:
- `404 Not Found`

## 6. Health check

### GET `/api/health`

목적:
- 컨테이너와 ingress의 readiness / liveness probe 진입점으로 사용한다.

Auth:
- not required

Response:
- `status`: `ok`
- `service`: `trip-canvas`
- `timestamp`
