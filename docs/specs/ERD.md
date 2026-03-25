# trip-canvas ERD Draft

## 엔티티 목록

### users

- id
- email
- created_at

### profiles

- user_id
- display_name
- locale
- created_at

`users 1:1 profiles`

### saved_places

- id
- user_id
- external_place_id
- source_provider
- place_name
- country_code
- region_name
- city_name
- address
- lat
- lng
- status (`wishlist | visited | favorite`)
- note
- created_at
- updated_at

`users 1:N saved_places`

### trips

- id
- user_id
- title
- start_date
- end_date
- visibility (`private`)
- created_at
- updated_at

`users 1:N trips`

### trip_days

- id
- trip_id
- day_index
- calendar_date
- note

`trips 1:N trip_days`

### itinerary_items

- id
- trip_day_id
- saved_place_id
- sort_order
- note
- created_at

`trip_days 1:N itinerary_items`
`saved_places 1:N itinerary_items`

### share_links

- id
- trip_id
- token
- permission (`read_only`)
- is_active
- created_at

`trips 1:N share_links`

## 관계 요약

- 한 사용자는 여러 장소를 저장할 수 있다.
- 한 사용자는 여러 trip을 만들 수 있다.
- 한 trip은 여러 day를 가진다.
- 한 day는 여러 itinerary item을 가진다.
- 한 saved place는 여러 trip itinerary에서 재사용될 수 있다.

## 소유권 / 라이프사이클

- `saved_places`는 계정 전체 라이브러리다.
- `trips`는 여행 단위 컨테이너다.
- `itinerary_items`는 saved place를 trip 맥락으로 재배치한 객체다.
- `share_links`는 trip 공유를 위한 읽기 전용 링크다.

## 개인정보 메모

- 위치 데이터와 여행 날짜는 민감 정보가 될 수 있으므로 기본 visibility는 private로 유지한다.
- 공유 링크는 사용자의 명시적 액션으로만 생성된다.

