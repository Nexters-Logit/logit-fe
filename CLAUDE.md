# Logit Frontend Project

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS v4
- React Query (서버 상태)
- Zustand (UI 상태)
- AI SDK + AI Elements (채팅 UI)
- shadcn/ui (기본 UI 컴포넌트)

## Local Development

- 패키지 매니저: Bun
- 개발 서버: `bun run dev`
- 프론트엔드: `http://localhost:3000`
- 로컬 API: `http://localhost:8000`

## Code Principles

### 하나의 파일에 하나의 컴포넌트

- 각 `.tsx` 파일에는 **하나의 React 컴포넌트**만 export
- 서브 컴포넌트는 별도 파일로 분리
- **예외**: `components/ui/` (shadcn/ui), `components/ai-elements/` (라이브러리 패턴)

```tsx
// Bad - 한 파일에 여러 컴포넌트
// ProjectList.tsx
function ProjectRow() { ... }
export function ProjectList() { ... }
export function ProjectListSkeleton() { ... }

// Good - 파일당 하나의 컴포넌트
// ProjectRow.tsx
export function ProjectRow() { ... }

// ProjectList.tsx
export function ProjectList() { ... }

// ProjectListSkeleton.tsx
export function ProjectListSkeleton() { ... }
```

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

### className 작성 규칙

- 정적 Tailwind 클래스는 `className=""` 안에 하나의 문자열로 작성
- `cn()`은 조건부 클래스나 외부 `className`을 병합할 때만 사용
- `cn("flex", "items-center", "gap-2")`처럼 정적 클래스를 인자별로 나누지 않음

```tsx
// Bad
<div className={cn("flex", "items-center", "gap-2")} />

// Good
<div className="flex items-center gap-2" />

// Good - 조건부 클래스가 필요한 경우
<div className={cn("flex items-center gap-2", isActive && "bg-primary-50")} />
```

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

#### Border Radius 규칙

Tailwind v4 내장 값 또는 `@theme`에 정의된 커스텀 변수 사용:

| Pixel Value | Tailwind Class | 비고 |
|-------------|----------------|------|
| 8px | `rounded-lg` | 내장 |
| 12px | `rounded-xl` | 내장 |
| 14px | `rounded-3.5` | 커스텀 (`--radius-3.5`) |
| 16px | `rounded-2xl` | 내장 |
| 20px | `rounded-5` | 커스텀 (`--radius-5`) |
| 24px | `rounded-3xl` | 내장 |
| 30px | `rounded-7.5` | 커스텀 (`--radius-7.5`) |
| 32px | `rounded-4xl` | 내장 |

```tsx
// Bad
<div className="rounded-[14px]">

// Good
<div className="rounded-3.5">
```

#### Box Shadow 규칙

`@theme`에 정의된 커스텀 shadow 변수 사용:

| Shadow | Tailwind Class |
|--------|----------------|
| `0 4px 20px rgba(0,0,0,0.05)` | `shadow-chat` |

```tsx
// Bad
<div className="shadow-[0px_4px_20px_0px_rgba(0,0,0,0.05)]">

// Good
<div className="shadow-chat">
```

#### Arbitrary Values 금지

- `rounded-[Xpx]` 금지 → 내장 클래스 또는 `@theme` 변수 사용
- `shadow-[...]` 금지 → `@theme` 변수 정의 후 사용
- `text-[Xpx]` 금지 → 디자인 토큰 사용 (예: `text-body-6-1`)
- `bg-[#...]` 금지 → 디자인 토큰 사용 (예: `bg-primary-100`)

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
