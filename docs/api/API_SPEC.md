# trip-canvas API Spec Draft

## 원칙

- 현재 단계의 API는 `문서 초안`이며 실제 구현 계획에서 세부 인증, validation, 에러 모델을 구체화한다.
- 모든 write API는 인증이 필요하다.
- 모든 trip 공유 조회 API는 읽기 전용이다.

## 1. 장소 검색

### GET `/api/places/search`

목적:
- 일본 장소 검색 결과를 반환한다.

Query:
- `q`: search text
- `city`: optional city hint
- `region`: optional region hint

Response:
- `places[]`
  - `externalPlaceId`
  - `name`
  - `address`
  - `lat`
  - `lng`
  - `cityName`
  - `regionName`

## 2. 장소 저장

### POST `/api/saved-places`

목적:
- 검색 결과 또는 외부 장소 정보를 계정 라이브러리에 저장한다.

Auth:
- required

Request:
- `externalPlaceId`
- `sourceProvider`
- `placeName`
- `address`
- `lat`
- `lng`
- `status`
- `note?`

Response:
- `savedPlace`

### GET `/api/saved-places`

목적:
- 사용자 저장 장소 목록을 상태별로 조회한다.

Auth:
- required

Query:
- `status?`

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
- `savedPlaceIds[]`

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
- `itineraryItems[]`

## 4. itinerary 배치

### POST `/api/trips/:tripId/itinerary-items`

목적:
- saved place를 특정 trip day에 배치한다.

Auth:
- required

Request:
- `tripDayId`
- `savedPlaceId`
- `sortOrder`
- `note?`

### PATCH `/api/itinerary-items/:itemId`

목적:
- 순서 또는 note를 수정한다.

Auth:
- required

Request:
- `sortOrder?`
- `note?`

## 5. 공유 링크

### POST `/api/trips/:tripId/share-links`

목적:
- 읽기 전용 trip 공유 링크를 생성한다.

Auth:
- required

Response:
- `shareLink`
  - `token`
  - `url`
  - `permission`

### GET `/api/shared/trips/:token`

목적:
- 읽기 전용 공유 페이지용 trip 상세를 반환한다.

Auth:
- not required

Response:
- `trip`
- `tripDays[]`
- `itineraryItems[]`
- `savedPlacesSummary[]`

