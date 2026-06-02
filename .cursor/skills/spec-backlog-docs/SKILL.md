---
name: spec-backlog-docs
description: Create and maintain feature spec and backlog documents for this repository. Use when the user asks for spec creation, backlog setup, merge criteria updates, follow-up task migration, or context-loss prevention documentation.
---

# Spec Backlog Docs

## 목적

이 스킬은 feature 스펙 문서와 backlog 문서를 분리 운영하도록 문서를 생성/정리한다.

- 스펙: 이번 feature의 범위/머지 기준
- 백로그: 지속 관리 항목의 단일 소스

## 트리거

다음 요청에서 사용한다.

- "스펙 문서 만들어줘", "백로그 분리해줘", "머지 기준 정리해줘"
- "docs 말고 spec으로", "컨텍스트 손실 방지 문서"
- feature 후속 TODO를 backlog로 이동하는 요청

## 기본 규칙

1. `specs/<feature>.md`는 현재 feature 계약서로 유지한다.
2. 후속 작업은 `backlog/index.md`로 이동한다.
3. 스펙에는 다음 섹션을 유지한다.
   - 목적
   - 범위
   - 현재 구현 상태
   - Merge Criteria (Must)
   - Follow-up Backlog (After Merge) (백로그 링크만)
   - Known Limitations at Merge
4. 백로그는 `Now / Next / Later`와 ID(`B-001`)를 사용한다.
5. 새 문서를 만들 때 템플릿 파일을 우선 사용한다.

## 생성 절차

1. feature명을 확인한다.
2. `specs/_template-feature-spec.md`를 복사해 `specs/<feature>.md` 생성한다.
3. `backlog/index.md`가 없으면 `backlog/_template-index.md`로 생성한다.
4. 스펙의 후속 항목을 backlog로 이동하고, 스펙에는 링크만 남긴다.
5. 문서 내 경로를 백틱으로 감싼다.

## 출력 형식

- 변경 요약은 짧게:
  - 생성/수정 파일 목록
  - 이동된 항목 수
  - 다음 액션(예: 커밋 여부)

