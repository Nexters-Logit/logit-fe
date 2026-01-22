# Logit

<p align="center">
  <img src="public/logos/logo_splash.png" alt="Logit" width="220" />
</p>

경험을 기록하고, 자기소개서를 쉽게 작성하세요.

## Tech Stack

- Next.js 15
- TypeScript
- Tailwind CSS v4

## Getting Started

```bash
pnpm install
pnpm dev
```

http://localhost:3000 에서 확인할 수 있습니다.

## Folder Architecture

Feature-based (Colocation) 패턴을 사용합니다.

```
app/
├── (auth)/
│   └── login/
│       ├── page.tsx
│       ├── _components/
│       ├── _hooks/
│       └── _apis/
│
├── (main)/
│   ├── home/
│   │   ├── page.tsx
│   │   ├── _components/
│   │   ├── _hooks/
│   │   └── _apis/
│   │
│   ├── statistics/
│   │   ├── page.tsx
│   │   └── _components/
│   │
│   └── chat/
│       └── [chat_id]/
│           ├── page.tsx
│           └── _components/
│
├── layout.tsx
├── page.tsx
└── globals.css

# 공통 (2곳 이상에서 사용 시 추출)
components/
├── ui/            # Button, Input, Card 등
└── common/        # StatusEmpty 등

hooks/             # 공통 훅
libs/              # 유틸, API 클라이언트
types/             # 공유 타입

public/
├── fonts/
├── icons/
├── illustrations/
└── logos/
```

### 원칙

| 규칙                  | 설명                             |
| --------------------- | -------------------------------- |
| `_` prefix            | Next.js 라우팅에서 제외          |
| 처음엔 페이지 내부에  | 해당 페이지에서만 쓰면 거기에 둠 |
| 2곳 이상 사용 시 추출 | 공통 폴더로 이동                 |
