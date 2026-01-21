현재 staged된 변경사항을 확인하고 커밋을 생성해주세요.

## 규칙

1. **Conventional Commits 형식**을 따르되, 메시지는 **한글**로 작성
2. 형식: `<type>(<scope>): <description>`
   - type: feat, fix, docs, style, refactor, test, chore 등
   - scope: 선택사항, 변경 범위를 나타냄
   - description: 변경 내용을 간결하게 한글로 설명

3. **예시**:
   - `feat(login): 로그인 기능 추가`
   - `fix(api): 사용자 조회 에러 수정`
   - `refactor(utils): 날짜 포맷 함수 리팩토링`
   - `chore: 불필요한 의존성 제거`

4. **body**: 변경사항이 복잡하거나 추가 설명이 필요한 경우에만 작성

5. **Co-Authored-By 절대 추가하지 말 것**

## 실행 순서

1. `git status`로 현재 상태 확인
2. `git diff --cached`로 staged 변경사항 확인 (staged가 없으면 `git diff`로 unstaged 확인)
3. 변경 내용 분석
4. **변경사항이 많거나 서로 다른 기능/목적의 변경이 섞여 있다면, 논리적 단위로 나눠서 여러 커밋으로 분리**
5. 커밋 메시지와 계획을 사용자에게 보여주고 **반드시 확인을 받은 후** 커밋 실행

## 중요

- **커밋 실행 전 반드시 사용자에게 확인 요청할 것**
- 여러 커밋으로 나눌 경우, 각 커밋의 내용과 순서를 미리 설명
- 사용자가 승인한 후에만 커밋 진행
