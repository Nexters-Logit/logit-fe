# Logit Frontend Project

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS v4
- React Query (서버 상태)
- Zustand (UI 상태)
- AI SDK + AI Elements (채팅 UI)
- shadcn/ui (기본 UI 컴포넌트)

## Code Principles

### 사용하지 않는 코드 제거

- 계획이 변경되어 더 이상 필요 없는 코드/파일은 즉시 삭제
- 주석 처리된 코드, `// TODO: remove` 같은 잔재 금지
- 미사용 import, 변수, 함수는 남기지 않음
- backwards-compatibility를 위한 re-export나 `_unused` 변수 금지

### 폴더 구조 규칙

```
app/
├── (main)/
│   └── [feature]/
│       └── [dynamic]/
│           ├── page.tsx
│           ├── loading.tsx
│           ├── _components/    # 페이지 전용 (라우팅 제외)
│           ├── _hooks/         # 페이지 전용 훅
│           ├── _apis/          # 페이지 전용 API
│           └── _store/         # 페이지 전용 상태
├── api/                        # API Routes
└── layout.tsx

components/
├── ui/              # shadcn/ui 컴포넌트
├── ai-elements/     # AI Elements 컴포넌트
└── common/          # 2곳 이상에서 사용하는 공통 컴포넌트

libs/                # 유틸리티, API 클라이언트
types/               # 공통 타입 정의
```

| 규칙 | 설명 |
|------|------|
| `_` prefix | Next.js 라우팅에서 제외 |
| 처음엔 페이지 내부에 | 해당 페이지에서만 쓰면 거기에 둠 |
| 2곳 이상 사용 시 추출 | `components/common/`으로 이동 |

### 타입 컨벤션

```typescript
// 탭/상태 상수는 대문자
type PanelTab = 'EXPERIENCES' | 'DRAFT';
type MessageRole = 'USER' | 'ASSISTANT';
```

## Backend API

- **Base URL**: `https://api-dev.logit.ai.kr`
- **인증**: Bearer JWT (`Authorization: Bearer <token>`)

### 주요 도메인

| 도메인         | 설명                                           |
| -------------- | ---------------------------------------------- |
| Authentication | Google OAuth 로그인/로그아웃, 토큰 갱신        |
| Users          | 사용자 정보 조회/수정/삭제                     |
| Projects       | 자소서 프로젝트 (회사, 직무, 채용공고)         |
| Questions      | 자소서 문항 (글자수 제한, 답변)                |
| Experiences    | STAR 형식 경험 관리 (AI 태그/임베딩 자동 생성) |
| Chats          | AI 자소서 작성 (SSE 스트리밍)                  |

### 주요 엔드포인트

```
# Auth
GET  /api/v1/auth/google          # Google OAuth 로그인
POST /api/v1/auth/refresh         # 토큰 갱신
POST /api/v1/auth/logout          # 로그아웃

# Users
GET/PATCH/DELETE /api/v1/users/me # 현재 사용자

# Projects & Questions
GET/POST   /api/v1/projects/
GET/PATCH/DELETE /api/v1/projects/{project_id}
GET/POST   /api/v1/projects/{project_id}/questions/
GET/PATCH/DELETE /api/v1/projects/{project_id}/questions/{question_id}

# Experiences (STAR 형식)
GET/POST   /api/v1/experiences
GET        /api/v1/experiences/search?q=검색어
GET/PATCH/DELETE /api/v1/experiences/{experience_id}

# Chats (AI 자소서 작성)
POST /api/v1/projects/chats              # 메시지 전송 (SSE 스트리밍)
GET  /api/v1/projects/chats/{question_id} # 채팅 히스토리
PATCH /api/v1/projects/chats/{chat_id}/answer # 답변 업데이트
```

## Tailwind CSS v4 Convention

### Canonical Classes 사용 (Arbitrary Values 대신)

Tailwind CSS v4에서는 arbitrary values `[값]` 대신 canonical classes를 권장합니다.
v4에서는 spacing scale이 더 유연해져서 소수점 값도 지원합니다.

#### Spacing 변환 규칙

Tailwind의 spacing 단위는 `4px`를 기준으로 합니다. 예: `1 = 4px`, `4 = 16px`

| Arbitrary Value | Canonical Class | 계산           |
| --------------- | --------------- | -------------- |
| `px-[30px]`     | `px-7.5`        | 30 ÷ 4 = 7.5   |
| `py-[15px]`     | `py-3.75`       | 15 ÷ 4 = 3.75  |
| `pt-[40px]`     | `pt-10`         | 40 ÷ 4 = 10    |
| `pb-[100px]`    | `pb-25`         | 100 ÷ 4 = 25   |
| `p-[26px]`      | `p-6.5`         | 26 ÷ 4 = 6.5   |
| `gap-[30px]`    | `gap-7.5`       | 30 ÷ 4 = 7.5   |
| `mb-[85px]`     | `mb-21.25`      | 85 ÷ 4 = 21.25 |

#### Width/Height 변환 규칙

| Arbitrary Value  | Canonical Class | 계산            |
| ---------------- | --------------- | --------------- |
| `w-[5px]`        | `w-1.25`        | 5 ÷ 4 = 1.25    |
| `w-[130px]`      | `w-32.5`        | 130 ÷ 4 = 32.5  |
| `w-[261px]`      | `w-65.25`       | 261 ÷ 4 = 65.25 |
| `h-[120px]`      | `h-30`          | 120 ÷ 4 = 30    |
| `h-[190px]`      | `h-47.5`        | 190 ÷ 4 = 47.5  |
| `max-w-[1104px]` | `max-w-276`     | 1104 ÷ 4 = 276  |
| `max-w-[1440px]` | `max-w-360`     | 1440 ÷ 4 = 360  |

#### 예외 사항

- `rounded-[20px]`과 같은 border-radius는 semantic token이 없는 경우 arbitrary value 사용 가능
- 커스텀 색상 `bg-[#316ff6]`은 디자인 토큰에 정의되지 않은 경우 사용 가능
- 디자인 토큰에 정의된 typography가 있다면 `text-[24px]` 대신 `text-title-2` 같은 토큰 사용

### Best Practices

1. **Spacing**: 가능하면 arbitrary values 대신 canonical classes 사용

   ```tsx
   // Bad
   <div className="px-[30px] py-[15px]">

   // Good
   <div className="px-7.5 py-3.75">
   ```

2. **Typography**: 디자인 토큰이 있다면 활용

   ```tsx
   // Bad
   <p className="text-[24px]">

   // Good
   <p className="text-title-2">
   ```

3. **Colors**: 프로젝트의 디자인 토큰 우선 사용

   ```tsx
   // Bad (프로젝트에 디자인 토큰이 있는 경우)
   <div className="bg-[#F5FAFF]">

   // Good
   <div className="bg-primary-20">
   ```
