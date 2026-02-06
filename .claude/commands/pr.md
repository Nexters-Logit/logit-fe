현재 브랜치의 작업 내용을 분석하고, PR 템플릿에 맞춰 마크다운 파일을 생성해주세요.

## 실행 순서

1. `git branch --show-current`로 현재 브랜치 확인
2. `git log dev..HEAD --oneline`으로 dev 브랜치 이후 커밋 목록 확인
3. `git diff dev...HEAD`로 전체 변경 내용 확인
4. `.github/pull_request_template.md` 읽기
5. 변경 내용을 분석하여 PR 제목과 본문 작성
6. 마크다운 파일로 출력

## PR 제목 규칙

- 형식: `Feat(작업 범위): {title}` (PR 템플릿 주석 참고)
- type은 상황에 맞게 변경 (Feat, Fix, Refactor, Chore 등)
- 한글로 작성

## 마크다운 파일 작성 규칙

- **파일 이름이 PR 제목이 된다** — 예: `Feat(ui): 토스트 UI 도입.md`
- 파일 경로: 프로젝트 루트에 생성
- 본문은 `.github/pull_request_template.md`의 구조를 따르되 주석은 제거
- 각 섹션을 실제 작업 내용으로 채워 넣기
- Tasks 섹션은 커밋 단위 또는 주요 변경사항 단위로 체크리스트 작성
- Screenshot 섹션은 비워두되 제거하지 않기

## 중요

- 파일 작성 전 PR 제목과 본문 내용을 사용자에게 보여주고 **반드시 확인을 받은 후** 파일 생성
- 커밋 히스토리와 diff를 꼼꼼히 분석하여 누락 없이 작성
- close 이슈 번호는 비워두기 (사용자가 직접 입력)
