# Spec: project-setup-component-architecture

## 목적

`packages/cli` 기반 TUI 앱에서 입력창 중심 UX를 만들기 위한 초기 컴포넌트 아키텍처를 정의한다.

- `InputBar`를 메인 진입점에 연결
- slash command 메뉴(`CommandMenu`) 구조 도입
- 입력/명령 선택 상태를 훅으로 분리해 확장 가능한 기반 마련

## 범위

이 스펙은 **UI/상호작용 골격 구축**을 다룬다.

- 포함: 레이아웃, 명령 메뉴 목록/필터/선택 이동, 키 바인딩, 상태 훅 분리
- 제외: 실제 라우팅 구현, 외부 API 호출, 인증/결제/세션 실제 기능

## 현재 구현 상태

### 완료

- `Header`, `StatusBar`, `InputBar` 컴포넌트 구조 정리
- `consts` 모듈 분리
  - `border.ts`
  - `key-bindings.ts`
  - `index.ts`(barrel export)
- command-menu 모듈 구성
  - `commands.ts`: 명령 목록
  - `types.ts`: `Command`, `CommandContext`
  - `filter-commands.ts`: query 기반 prefix 필터
  - `index.tsx`: 목록 렌더/선택 하이라이트/마우스 실행
  - `use-command-menu.ts`: 메뉴 상태, 선택 이동, 스크롤 동기화
- `packages/cli/src/index.tsx`에서 `InputBar` 연동

### 진행 중/임시 처리

- `CommandContext.navigate`는 타입만 존재하고, `InputBar`에서 현재 no-op으로 전달
- `commands.ts`의 다수 명령은 action이 stub 상태

## 아키텍처 결정

### 1) 입력/명령 상태 분리

`InputBar`가 모든 상태를 직접 들지 않고 `useCommandMenu`로 분리한다.

- 이유: 입력 로직과 메뉴 탐색 로직 결합도 감소
- 효과: 향후 테스트/확장(단축키, 페이지네이션, 다중 메뉴) 용이

### 2) 명령 데이터와 UI 분리

- `commands.ts`는 데이터/행동 정의
- `CommandMenu`는 렌더링
- `useCommandMenu`는 상호작용 상태 관리

명령 정의 변경이 UI 구조 변경으로 번지지 않게 한다.

### 3) 상수 모듈화

키 바인딩/테두리 문자 등 재사용 가능한 UI 상수를 `consts`로 분리한다.

## 입력/명령 처리 흐름

1. 사용자가 `textarea` 입력
2. `InputBar`의 `onContentChange`가 `useCommandMenu.handleContentChange` 호출
3. 입력이 `/`로 시작하고 공백 전이면 메뉴 오픈 + query 계산
4. `CommandMenu`가 `query`로 필터된 명령 목록 표시
5. 화살표 키(`useKeyboard`)로 `selectedIndex` 이동, 필요 시 scrollbox 자동 스크롤
6. Enter 제출 시
   - 메뉴 열림: 선택 명령 resolve 후 action 실행(또는 value 삽입)
   - 메뉴 닫힘: 일반 `onSubmit` 흐름 실행

## Merge Criteria (Must)

- [x] `InputBar`에서 일반 입력 제출과 slash command 제출이 분기 동작한다.
- [x] slash command 목록이 query prefix 기준으로 필터링된다.
- [x] 화살표 키 이동 시 선택 항목이 항상 viewport 내에서 보인다.
- [x] command-menu 관련 상태 로직이 `useCommandMenu`로 분리되어 있다.
- [x] `consts` 모듈에서 키 바인딩/테두리 상수를 재사용한다.

## Follow-up Backlog (After Merge)

후속 작업은 스펙 문서에 누적하지 않고 `backlog/index.md`에서 관리한다.

## Known Limitations at Merge

- 현재 `navigate` no-op 때문에 `/new` 같은 명령이 기대 동작을 하지 않을 수 있다.
- command action이 비동기/부수효과를 갖기 시작하면 에러 처리/상태 관리가 추가로 필요하다.
- `InputBar`가 비대해질 가능성이 있어, 제출/명령 실행 로직 추가 분리 후보를 계속 모니터링한다.

## 커밋 맵(요약)

- command-menu 타입/기본 명령 추가
- command-menu UI + 필터 추가
- consts 모듈 분리
- `InputBar` 컴포넌트 추가 및 메인 연동
- `useCommandMenu` 훅 분리 및 상호작용 연결

---

기능 동작이 변경되면 본 스펙도 함께 업데이트한다.
