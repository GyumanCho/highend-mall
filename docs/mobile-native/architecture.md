# Architecture: 모노레포 + tRPC + Expo

> 작성일: 2026-04-09

## 1. 목표 아키텍처 (Option A — 권장)

```
highend-fashion-mall/
├── apps/
│   ├── web/                  # 기존 src/ 이전 (Next.js 16)
│   │   ├── app/
│   │   ├── components/
│   │   └── ...
│   └── mobile/               # 기존 mobile/ 이전 (Expo SDK 55)
│       ├── app/
│       ├── components/
│       └── ...
├── packages/
│   ├── api/                  # tRPC routers + Prisma client
│   │   ├── src/
│   │   │   ├── routers/      # 기존 src/server/routers/
│   │   │   ├── services/     # 기존 src/server/services/
│   │   │   ├── jobs/         # 기존 src/server/jobs/
│   │   │   └── trpc.ts
│   │   └── package.json
│   ├── db/                   # Prisma schema + client
│   │   ├── prisma/
│   │   └── package.json
│   ├── shared/               # 타입, Zod 스키마, 상수
│   │   ├── src/
│   │   │   ├── schemas/      # Zod
│   │   │   ├── types/
│   │   │   └── constants/
│   │   └── package.json
│   └── design-tokens/        # 2-layer 토큰 (brand 공유 / platform 분리)
│       └── src/
│           ├── brand/        # Tier 1: colors, font families, brand voice
│           ├── web/          # Tier 2 (web): spacing, typography scale
│           └── mobile/       # Tier 2 (mobile): spacing, typography scale, touch targets
├── tooling/                  # eslint, tsconfig, prettier 공통
│   ├── eslint/
│   ├── typescript/
│   └── prettier/
├── package.json              # 루트 (pnpm + turbo)
├── pnpm-workspace.yaml
└── turbo.json
```

## 2. 핵심 설계 결정

### 2.1 패키지 매니저: pnpm + Metro workspace 설정

**이유**: Expo 공식 모노레포 가이드가 pnpm과 yarn workspaces 양쪽 지원.

**필수 설정 1 — `.npmrc` (pnpm 전용)**:
```ini
# pnpm root .npmrc
node-linker=hoisted
public-hoist-pattern[]=*
shamefully-hoist=true
```

> `node-linker=hoisted`는 pnpm ≥ 7에서 지원. yarn의 동일 옵션과 이름이 같지만 별개 설정.

**필수 설정 2 — `apps/mobile/metro.config.js` (workspace 해결)**:
```javascript
const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

// 1. Metro가 monorepo 루트까지 watch
config.watchFolders = [workspaceRoot];

// 2. packages/* 의 node_modules도 해결 가능하게
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];

// 3. pnpm symlink 지원 (중요)
config.resolver.disableHierarchicalLookup = true;

module.exports = config;
```

**실패 1순위**: 이 두 설정 중 하나라도 빠지면 Expo + pnpm monorepo는 "module not found" 에러로 시작조차 안 함.

### 2.2 빌드 오케스트레이션: Turborepo
- 병렬 빌드/테스트, 변경 감지 기반 증분 실행
- `turbo.json`에 web, mobile, api 각각 파이프라인 정의

### 2.3 tRPC 연결 전략

**웹 (현재와 동일)**:
```typescript
// apps/web/app/api/trpc/[trpc]/route.ts
import { appRouter } from "@repo/api";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
```

**모바일 (신규)**:
```typescript
// apps/mobile/lib/trpc.ts
import { createTRPCReact, httpBatchLink } from "@trpc/react-query";
import type { AppRouter } from "@repo/api";  // ← 타입만 import

export const trpc = createTRPCReact<AppRouter>();

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: `${API_BASE}/api/trpc`,
      headers: () => ({ Authorization: `Bearer ${getToken()}` }),
    }),
  ],
});
```

**중요**: 모바일은 `@repo/api`에서 **타입만** import (런타임 코드 불필요). `AppRouter` 타입이 엔드포인트 시그니처를 전달하므로 타입 안전성 보장.

#### 2.3.1 `packages/api/package.json` exports 맵 (필수)

```json
{
  "name": "@repo/api",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "default": "./dist/index.js"
    },
    "./types": {
      "types": "./dist/types.d.ts"
    }
  }
}
```

**핵심**: 모바일 쪽에서는 `./types` subpath만 import:
```typescript
// apps/mobile/lib/trpc.ts
import type { AppRouter } from "@repo/api/types";  // ← 타입만
```

이렇게 하면 Metro가 `@repo/api`의 런타임 코드 그래프(Prisma, bcrypt 등 Node 의존)를 아예 따라가지 않음.

#### 2.3.2 ESLint 경계 규칙 (강제)

`apps/mobile/.eslintrc`에 추가:
```javascript
{
  "rules": {
    "no-restricted-imports": ["error", {
      "paths": [{
        "name": "@repo/api",
        "message": "모바일에서는 '@repo/api/types'만 import (type-only). 런타임 코드는 HTTP로 호출하세요."
      }, {
        "name": "@repo/db",
        "message": "모바일에서 Prisma 직접 접근 금지."
      }, {
        "name": "@repo/design-tokens/web",
        "message": "모바일에서 web 토큰 사용 금지. '@repo/design-tokens/brand' 또는 '@repo/design-tokens/mobile'를 사용하세요."
      }]
    }]
  }
}
```

대칭적으로 `apps/web/.eslintrc`에서 `@repo/design-tokens/mobile` 금지.

### 2.4 인증 브릿지

```
┌──────────┐     1. login (email/pw or OAuth)    ┌──────────────┐
│  Mobile  │───────────────────────────────────> │ Next.js API  │
│          │                                       │              │
│          │     2. JWT (access + refresh)         │ /api/auth/   │
│          │<───────────────────────────────────── │  mobile/     │
│          │                                       │   login      │
│          │     3. tRPC call + Bearer token       │              │
│          │───────────────────────────────────> │ /api/trpc    │
│          │                                       │              │
│          │     4. Response                       │              │
│          │<───────────────────────────────────── │              │
└──────────┘                                       └──────────────┘
    │
    │  token 저장: expo-secure-store
    │  OAuth flow: expo-auth-session (Google, Apple 등)
```

**구현 포인트**:
- tRPC context에서 JWT 검증 미들웨어 추가 (기존 NextAuth 세션과 병행)
- Refresh token rotation
- Logout 시 서버 측 토큰 블랙리스트 or 짧은 TTL

#### 2.4.1 Auth 검증 로직 공유 (Phase 1 선결)

**문제**: NextAuth v5 beta의 Credentials provider 내부 `authorize()`는 public API가 아니라 직접 호출 시 beta 릴리스 간 breaking change 위험.

**해결**: 순수 서비스 함수로 추출.

```typescript
// packages/api/src/services/auth.ts
import { z } from "zod";
import { db } from "@repo/db";
import { verifyPassword } from "./password";

export const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function verifyCredentials(
  input: z.infer<typeof credentialsSchema>
): Promise<{ id: string; email: string; name: string | null } | null> {
  const user = await db.user.findUnique({ where: { email: input.email } });
  if (!user?.passwordHash) return null;

  const ok = await verifyPassword(input.password, user.passwordHash);
  if (!ok) return null;

  return { id: user.id, email: user.email, name: user.name };
}
```

**양쪽에서 소비**:
- `apps/web/lib/auth.ts` NextAuth Credentials provider의 `authorize()` → `verifyCredentials()` 호출
- `apps/web/app/api/auth/mobile/login/route.ts` → `verifyCredentials()` 호출 후 JWT 발급

#### 2.4.2 Refresh Token 저장 & 보안 모델

```prisma
// packages/db/prisma/schema.prisma 에 추가
model RefreshToken {
  id          String   @id @default(cuid())
  userId      String
  tokenHash   String   @unique    // bcrypt hash of the refresh token
  deviceId    String                // 클라이언트 고유 식별자 (expo-device)
  deviceName  String?               // e.g., "Jude's iPhone"
  createdAt   DateTime @default(now())
  expiresAt   DateTime              // 7일
  revokedAt   DateTime?             // 로그아웃 시

  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([deviceId])
}
```

**규칙**:
- Refresh token rotation: 매 refresh 호출 시 이전 토큰 revoke + 신규 발행
- Concurrent refresh race: DB unique constraint + 낙관적 락으로 방지
- Logout-all-devices: `revokedAt` 일괄 업데이트
- Rate limit: `/api/auth/mobile/login`은 IP + email 기준 5req/min (upstash rate limit)

### 2.5 상태 관리 전략

| 데이터 유형 | 저장소 | 동기화 |
|---|---|---|
| 서버 상태 (products, orders) | React Query (tRPC) | 자동 |
| 인증 상태 | expo-secure-store + Zustand | 앱 재시작 시 복원 |
| UI 상태 (modal, toast) | React local state | 없음 |
| Cart (로그인 전) | Zustand + AsyncStorage | 로그인 시 서버 병합 |
| Cart (로그인 후) | tRPC (서버 마스터) | React Query |
| Wishlist | 동일 (로그인 전 로컬, 후 서버) | 동일 |

### 2.6 네비게이션

- **Expo Router** (file-based, 현재 설정 유지)
- Stack: 최상위
- Tabs: `(tabs)` 그룹
- Modal: `presentation: "modal"` 옵션
- Deep linking: `expo-linking` + `app.json` scheme 설정

### 2.7 스타일링 결정 — **StyleSheet 전용, NativeWind 도입 안 함**

> ⚠️ **이전 초안 수정**: NativeWind 도입을 권장했으나, 디자인 재설계 방침 결정 후 **StyleSheet 전용**으로 전환.

**결정 이유**: 웹과 모바일의 디자인 시스템은 **독립적**으로 운영됩니다. 같은 Tailwind 클래스명을 공유하려는 시도 자체가 안티패턴입니다:

1. **터치 vs 마우스** — 웹의 `hover:bg-ivory-100`는 모바일에 의미가 없음
2. **레이아웃 스케일 차이** — 웹 `p-16`과 모바일 `p-16`은 디자인 의도가 전혀 다름
3. **반응형 유틸** — `md:`, `lg:` 브레이크포인트는 모바일에서 무의미
4. **성능** — NativeWind는 런타임 비용 존재, StyleSheet는 네이티브 최적
5. **디자인 일관성 환상** — 클래스명 공유는 "같아 보이지만 다른 의도"를 숨김

| 옵션 | 채택? | 사유 |
|---|---|---|
| ❌ NativeWind v4 | 미채택 | 웹 디자인을 모바일로 끌고 오는 경로. 플랫폼 재설계 원칙 위반 |
| ✅ **StyleSheet + 디자인 토큰** | **채택** | RN 네이티브, 성능 최적, 플랫폼별 디자인 독립성 보장 |
| ❌ Tamagui | 미채택 | 학습 곡선 + 크로스플랫폼 강제화 (분리 원칙과 충돌) |

자세한 모바일 디자인 원칙은 [mobile-design-system.md](./mobile-design-system.md) 참조.

### 2.8 디자인 토큰 — 2-Layer 구조

웹·모바일의 디자인 독립성을 유지하면서 **브랜드 DNA만 공유**하기 위한 2단계 토큰 구조:

#### Tier 1 — Brand Tokens (공유)
브랜드 정체성. 플랫폼이 바뀌어도 변하지 않는 것들.

```typescript
// packages/design-tokens/src/brand/colors.ts
// 실제 값은 현재 mobile/lib/theme.ts 및 src/app/globals.css와 일치시킴
export const brandColors = {
  // Core palette
  ivory: "#faf8f5",
  charcoal: "#1a1a1a",
  warmGray: "#6b6560",
  lightGray: "#e8e4df",
  gold: "#b8977e",
  goldLight: "#d4c4b0",
  cream: "#f5f0eb",
  white: "#ffffff",

  // Semantic roles
  primary: "#1a1a1a",       // charcoal — 주 CTA, 본문
  accent: "#b8977e",        // gold — 브랜드 모먼트 강조 한정
  surface: "#faf8f5",       // ivory — 기본 배경
  surfaceAlt: "#f5f0eb",    // cream — 카드/모달 배경
  textHigh: "#1a1a1a",
  textMuted: "#6b6560",
} as const;

// packages/design-tokens/src/brand/typography.ts
// 웹 현재: next/font/google Playfair_Display + Inter
// 모바일 현재: Georgia + System (Phase 4에서 Inter 도입 검토)
export const brandFonts = {
  serif: "Playfair Display", // editorial headlines (web), Georgia fallback on mobile
  sans: "Inter",              // body, UI
  mono: "JetBrains Mono",    // numbers, metadata
} as const;

// packages/design-tokens/src/brand/voice.ts
export const brandVoice = {
  tone: "understated, confident, quietly luxurious",
  tagline: "Quiet luxury, deliberate craftsmanship",
  // ...
} as const;
```

> **참고**: 모바일 현재 `fonts.serif = "Georgia"` (시스템 폴백). Playfair Display 적용은 `expo-font`로 Google Fonts 에셋을 번들링해야 하며 Phase 4의 태스크로 정의됨. Inter 역시 동일.

#### Tier 2 — Platform Tokens (분리)
스페이싱, 타이포 스케일, 레이아웃, 터치 타겟. **플랫폼별로 완전히 다름**.

```typescript
// packages/design-tokens/src/web/spacing.ts
export const webSpacing = {
  page: 64,          // 데스크톱: 넉넉한 여백
  section: 128,
  gutter: 24,
  // ...
} as const;

// packages/design-tokens/src/mobile/spacing.ts
export const mobileSpacing = {
  page: 16,          // 모바일: 좁은 폭
  section: 40,
  gutter: 12,
  touchTargetMin: 44, // iOS HIG, Material Design
  // ...
} as const;
```

```typescript
// packages/design-tokens/src/web/typography.ts
export const webTypography = {
  h1: { fontSize: 56, lineHeight: 64, fontFamily: brandFonts.serif },
  h2: { fontSize: 40, lineHeight: 48 },
  body: { fontSize: 16, lineHeight: 26 },
};

// packages/design-tokens/src/mobile/typography.ts
export const mobileTypography = {
  h1: { fontSize: 28, lineHeight: 36, fontFamily: brandFonts.serif },
  h2: { fontSize: 22, lineHeight: 30 },
  body: { fontSize: 15, lineHeight: 22 },
};
```

#### 사용 예

**웹 (Tailwind config)**:
```typescript
// apps/web/tailwind.config.ts
import { brandColors, brandFonts } from "@repo/design-tokens/brand";
import { webSpacing, webTypography } from "@repo/design-tokens/web";

export default {
  theme: {
    extend: {
      colors: brandColors,
      fontFamily: brandFonts,
      spacing: webSpacing,
      // ...
    },
  },
};
```

**모바일 (StyleSheet)**:
```typescript
// apps/mobile/lib/theme.ts
import { brandColors } from "@repo/design-tokens/brand";
import { mobileSpacing, mobileTypography } from "@repo/design-tokens/mobile";

export const theme = {
  colors: brandColors,
  spacing: mobileSpacing,
  typography: mobileTypography,
};
```

#### 핵심 원칙

| 질문 | 답 |
|---|---|
| 브랜드 컬러가 바뀌면? | Tier 1 수정 → 웹·모바일 자동 반영 |
| 모바일 본문 크기를 키우려면? | Tier 2 (mobile)만 수정 → 웹 무영향 |
| 웹 레이아웃 리디자인? | Tier 2 (web)만 수정 → 모바일 무영향 |
| 새 모바일 전용 토큰 (예: `bottomSheetHandle`) | Tier 2 (mobile)에만 추가 |

**이 구조가 깨지면** → 웹 변경이 모바일 디자인을 망치거나 그 반대. 엄격히 지킬 것.

## 3. 데이터 플로우 예시

### 제품 상세 조회

```
┌─────────────────────────────────────────────────────────┐
│ apps/mobile/app/product/[slug].tsx                      │
│                                                          │
│   const { data } = trpc.product.bySlug.useQuery({ slug });│
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ packages/api/src/routers/product.ts                      │
│                                                          │
│   export const productRouter = router({                  │
│     bySlug: publicProcedure                               │
│       .input(z.object({ slug: z.string() }))              │
│       .query(({ input }) => db.product.findUnique(...))   │
│   });                                                    │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ packages/db (Prisma) → PostgreSQL                        │
└─────────────────────────────────────────────────────────┘
```

같은 router가 웹(`apps/web`)에서도 그대로 호출됨 → 백엔드 단일 소스 달성.

## 4. 대안 아키텍처 (Option B — 최소 변경)

현재 구조 유지, `mobile/`만 독립 Expo 프로젝트로 운영:
```
highend-fashion-mall/   # Next.js 그대로
└── mobile/             # 독립 Expo (타입 수동 복제)
```

- tRPC 타입 공유 불가 → `@trpc/client` + runtime 스키마로 대체
- 웹 API의 Zod 스키마를 `.d.ts`로 export해 mobile 수동 동기화
- **단점 누적**: 타입 drift, 스키마 중복, 리팩토링 시 양쪽 수정

**언제 선택**: 모바일이 실험적/단기 PoC일 때만.

## 5. 폐기된 대안

### Option C — RN 포기, PWA 강화
- 이미 `feature/mobile-app-pwa` 브랜치 존재
- **장점**: 단일 코드베이스, 즉시 배포
- **단점**: 앱스토어 입점 불가, iOS 푸시 제약, 일부 네이티브 API 제약
- **판단**: 목표가 "스토어 입점"이면 부적합. 아니라면 RN보다 훨씬 경제적.

### Tauri / Capacitor
- WebView 기반 래퍼
- RN 대비 네이티브 성능 열위, 일부 에코시스템 미성숙
- 이 프로젝트 수준에서 RN 대신 선택할 이점 부족

## 6. 마이그레이션 전략 (구조 이전)

현재 → 모노레포 이전은 1회성 대규모 리팩토링. 자세한 단계는 [roadmap.md](./roadmap.md) Phase 1 참조.

핵심 원칙:
1. **웹은 계속 돌아가야 함** — 이전 중 prod 장애 금지
2. **커밋 단위로 검증** — 각 이전 단계 후 `pnpm build && pnpm test` 통과
3. **Import 경로는 codemod로** — 수동 수정 지양
4. **`.git`은 보존** — `git mv`로 히스토리 유지
