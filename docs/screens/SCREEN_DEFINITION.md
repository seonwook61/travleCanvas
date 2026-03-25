# trip-canvas Screen Definition

## 1. Map Home

### 목적

일본 장소 탐색과 저장 진입의 메인 화면.

### 진입

- 첫 방문
- 상단 내비게이션 홈

### 레이아웃

- 상단: 검색 입력, 주요 도시 힌트, 내 여행 진입
- 좌측: 저장 목록 요약, 상태 필터, 최근 저장
- 우측: 메인 지도

### 주요 액션

- 장소 검색
- 지도에서 장소 확인
- 장소 저장
- 상태 필터 변경

### 상태

- loading
- empty search
- result available
- save requires login
- error

## 2. Saved Places Library

### 목적

계정 전체 장소 라이브러리를 상태별로 관리한다.

### 진입

- 홈의 저장 목록 진입
- 내 장소 메뉴

### 주요 액션

- 상태 필터
- 장소 메모 확인
- trip에 담기

### 상태

- empty library
- filtered result
- no match

## 3. Trip Create / Organize

### 목적

저장한 장소를 선택하고 trip 제목/날짜를 설정해 itinerary의 기반을 만든다.

### 진입

- 저장 라이브러리에서 선택 후 trip 생성

### 주요 액션

- trip title 입력
- 시작일 / 종료일 입력
- 장소 선택
- Day별 배치 시작

### 상태

- no saved places
- date invalid
- draft ready

## 4. Trip Detail

### 목적

날짜 기반 itinerary를 확인하고 순서와 메모를 정리한다.

### 진입

- trip 목록
- trip 생성 직후

### 레이아웃

- 상단: trip 제목, 기간, 공유 버튼
- 본문: 날짜별 섹션
- 보조 영역: 저장 라이브러리에서 추가할 장소

### 주요 액션

- Day별 보기
- 순서 조정
- 짧은 메모 작성
- 공유 링크 생성

### 상태

- empty itinerary
- partially filled
- share link created

## 5. Shared Trip View

### 목적

여행 상세 전체를 읽기 전용으로 공유한다.

### 구조

- 핀보드 컬렉션 + 루트 보드 혼합
- 여행 제목 / 기간
- 저장 장소 하이라이트
- 날짜별 itinerary
- 짧은 메모

### 시각 톤

- 메인 앱보다 감성적인 톤
- 포스트카드 / 스탬프 모티프 일부 사용

### 상태

- valid share
- invalid token
- inactive link

## 6. Auth Entry

### 목적

저장, trip 생성, 공유 링크 생성 직전에 로그인 진입을 처리한다.

### 진입

- save action
- trip creation action
- share link generation action

### 상태

- login required
- login success
- login failed

