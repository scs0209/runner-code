# 커밋 (스테이징 분석 · 메시지 작성 · 확인 후 커밋)

스테이징(`git add`)된 변경**만** 대상으로 한다.

## 금지

- 사용자가 **명시적으로 승인하기 전** `git commit`, `git push` 실행 금지
- `git config` 변경 금지
- 스테이징되지 않은 파일을 임의로 `git add` 금지 (사용자가 add 하라고 한 경우만)

## 1. 스테이징 확인

다음을 실행한다:

```bash
git status -sb
git diff --cached --stat
git diff --cached
```

- 스테이징이 비어 있으면 **중단**하고, 어떤 파일을 `git add` 할지 안내만 한다.

## 2. 커밋 메시지 작성

`.cursor/rules/commit-messages.mdc` 규칙을 **반드시** 따른다.

- 형식: `<type>(<scope>): <한국어 제목>` (제목 50자 이내 권장, 마침표 없음, 명령형)
- `type` / `scope`: 영문 소문자
- 본문: 변경 이유·영향 (선택, bullet 가능)
- FSD/디렉터리 이동만 있으면 `chore` 또는 `refactor` + 레이어 scope
- 모호한 제목(`update`, `fix bug`) 금지

scope 추론 예:

| 경로 | scope |
|------|--------|
| `packages/cli/` | `cli` |
| `biome.json`, `.vscode/`, 루트 설정 | `shared` |
| `.cursor/rules/` | `shared` 또는 생략 |
| 문서만 | `docs` 또는 생략 |

## 3. 사용자에게 확인 요청

아래를 **한국어로** 정리해 보여주고, **승인을 기다린다** (이 턴에서 커밋하지 않음).

1. **제안 커밋 메시지** (제목 + 본문 전체, 복사 가능하게 코드 블록)
2. **이번 커밋에 포함되는 파일** (`git diff --cached --name-only` 목록)
3. **스테이징되지 않은 관련 변경**이 있으면 참고용으로만 표시

다음처럼 묻는다:

> 위 메시지로 커밋할까요? 수정이 필요하면 알려주세요. (`커밋해` / `확인` / `ok` / `진행` 등으로 승인)

## 4. 승인 후 커밋

사용자가 **명시적으로 승인**한 경우에만:

```bash
git commit -m "$(cat <<'EOF'
<승인된 메시지 제목>

<승인된 본문이 있으면 여기>
EOF
)"
git status -sb
```

- 메시지 수정 요청 시 3단계부터 다시
- `git push`는 사용자가 push 해달라고 할 때만
