# Reuse Strategy

> 웹 코드에서 무엇을 재사용하고, 무엇을 재작성하고, 무엇을 버릴지 결정.
> 작성일: 2026-04-09

## 1. 재사용 매트릭스

| 영역 | 경로 | 재사용률 | 이전 전략 |
|---|---|---|---|
| Prisma 스키마 | `prisma/` | 100% | `packages/db/`로 이동, 그대로 사용 |
| 시드 데이터 | `prisma/seed.ts` | 100% | 그대로 |
| tRPC 초기화 | `src/server/trpc.ts` | 100% | `packages/api/src/trpc.ts` |
| tRPC routers | `src/server/routers/*` | 100% | `packages/api/src/routers/*` |
| 서버 services | `src/server/services/*` | 95% | Node/DB 의존만 정리 후 그대로 |
| 백그라운드 jobs | `src/server/jobs/*` | 100% | 웹 전용 — mobile에는 노출 안 함 |
| Zod 스키마 | 곳곳에 산재 | 90% | `packages/shared/src/schemas/`로 통합 |
| 공용 타입 | `src/types/` | 100% | `packages/shared/src/types/` |
| 디자인 토큰 Tier 1 (brand color/font) | `src/app/globals.css` + Tailwind config | 100% 공유 | `packages/design-tokens/brand/`로 통합 |
| 디자인 토큰 Tier 2 (spacing/typography scale) | 동상 | **0% 공유** | `packages/design-tokens/{web,mobile}/`로 **분리** |
| **시각 디자인·레이아웃·인터랙션** | 전체 | **0%** | 모바일 전용 재설계 ([mobile-design-system.md](./mobile-design-system.md)) |
| 포맷팅/유틸 | `src/lib/*` | 80% | DOM 의존만 분리, `packages/shared/src/utils/` |
| **Tailwind 클래스** | `className="..."` | **0%** | NativeWind 없으면 전량 재작성 |
| **React 컴포넌트 (웹)** | `src/components/*` | **5%** | HTML 태그·DOM API 때문에 거의 재작성 |
| Next.js API routes | `src/app/api/*` | 100% (서버로) | `apps/web/app/api/*` — 모바일도 이걸 호출 |
| **Framer Motion 애니메이션** | 곳곳 | **0%** | Reanimated 3/4로 재작성 |
| **next/link, next/image, next/navigation** | 곳곳 | **0%** | expo-router, expo-image로 치환 |
| Admin 전체 | `src/app/(admin)/*` | N/A | 모바일 비대상, 웹 유지 |
| Customer 페이지 레이아웃 | `src/app/(customer)/*` | 10% | 구조 참고, 코드 재작성 |
| 테스트 (Vitest 단위) | `tests/unit/*` | 일부 | 비즈니스 로직 테스트는 `packages/api`로 이동 |
| E2E (Playwright) | `tests/e2e/*` | 0% (모바일 용) | 모바일은 Detox/Maestro 별도 |

## 2. 재사용 가능 영역 상세

### 2.1 Backend 전체 (100% 재사용)

**그대로 이전 가능**:
```
src/server/trpc.ts          → packages/api/src/trpc.ts
src/server/routers/brand.ts → packages/api/src/routers/brand.ts
src/server/routers/product.ts → packages/api/src/routers/product.ts
src/server/routers/_app.ts  → packages/api/src/routers/_app.ts
src/server/services/*       → packages/api/src/services/*
src/server/jobs/*           → packages/api/src/jobs/*
prisma/                     → packages/db/prisma/
```

**이전 후**:
- `apps/web/app/api/trpc/[trpc]/route.ts`는 `@repo/api`에서 router를 import
- `apps/mobile/lib/trpc.ts`는 `@repo/api`에서 `AppRouter` **타입만** import

### 2.2 Zod 스키마 (90% 재사용)

현재 Zod 스키마가 router 파일 내 인라인으로 흩어져 있을 가능성 높음. 정리 방식:

```typescript
// packages/shared/src/schemas/product.ts
import { z } from "zod";

export const productCreateSchema = z.object({
  name: z.string().min(1),
  slug: z.string(),
  priceTier: z.enum(["entry", "mid", "top"]),
  // ...
});

export type ProductCreateInput = z.infer<typeof productCreateSchema>;
```

그러면 웹 폼·API·모바일 폼에서 동일 스키마를 import해서 validation 일관성 확보.

### 2.3 디자인 토큰 (2-Layer)

**Tier 1 (Brand, 100% 공유)**: 컬러, 폰트 패밀리, 브랜드 보이스 — 플랫폼 불변.
**Tier 2 (Platform, 0% 공유)**: 스페이싱, 타이포 스케일, 터치 타겟, 레이아웃 — **웹/모바일 완전 분리**.

구조·예시는 [architecture.md § 2.8](./architecture.md#28-디자인-토큰--2-layer-구조) 참조.

**금지 사항**:
- ❌ 웹의 Tailwind spacing을 모바일에 그대로 쓰기
- ❌ 웹 폰트 사이즈(56px h1)를 모바일에서 재사용
- ❌ NativeWind로 웹 클래스명 이식
- ❌ "공통 디자인 시스템"이라는 명목의 컴포넌트 라이브러리

## 3. 재작성 불가피 영역

### 3.1 UI 컴포넌트 (5% 재사용)

**이유**: 웹 컴포넌트는 DOM 태그(`<div>`, `<img>`, `<a>`)와 Tailwind 클래스 기반. RN은 `<View>`, `<Image>`, `<Pressable>` + `StyleSheet`.

**전략**:
1. 웹 컴포넌트의 **구조와 로직**을 참고 (props, 이벤트 핸들러)
2. JSX만 RN 용으로 재작성
3. 공통 프리미티브는 별도 패키지로 빼지 않음 (추상화 비용 > 이득)

**예외** — 순수 로직 컴포넌트는 재사용 가능:
- 가격 포매터, 날짜 포매터 → `packages/shared/src/utils/`
- Zustand store 구조 → 거의 그대로 (`create` API 동일)

### 3.2 애니메이션 (0% 재사용)

Framer Motion은 웹 전용. RN에서는:
- 간단한 transition: `Animated` (내장)
- 복잡한 제스처·worklet: `react-native-reanimated` 4 + `react-native-gesture-handler`

### 3.3 Next.js API

```
next/link       → expo-router <Link>
next/image      → expo-image <Image>
next/navigation → expo-router useRouter, usePathname
next/font       → expo-font
next/headers    → (서버 전용, mobile 없음)
```

## 3.4 디자인 재사용 = 0% (원칙)

웹 디자인을 모바일로 그대로 가져오면 반드시 망가집니다. 이유:

1. **인터랙션 모델 상이** — hover/cursor/right-click 없음, 터치 전용
2. **화면 밀도** — 웹 1920px vs 모바일 390px. 같은 레이아웃 = 어색
3. **내비게이션 패턴** — 상단 nav → 하단 탭, 사이드바 → 바텀시트
4. **타이포 스케일** — 웹 서체가 모바일 좁은 폭에서 2줄로 부서짐
5. **제스처·햅틱** — 모바일 고유 UX (웹에 없음)
6. **Safe area, 키보드, 다크모드** — 모바일 시스템 UI 대응

**원칙**: "같은 뼈대, 다른 피부"
- **뼈대(공유)**: 데이터, 비즈니스 로직, 브랜드 컬러·폰트 패밀리·보이스
- **피부(분리)**: 레이아웃, 타이포 스케일, 스페이싱, 제스처, 애니메이션, 네비게이션

모바일 전용 디자인 원칙·패턴·제약은 [mobile-design-system.md](./mobile-design-system.md) 참조.

## 4. Admin 영역 — 모바일 제외 확정

**근거**:
1. UX 혼재: shopper와 operator는 완전히 다른 페르소나
2. 앱스토어 심사: 내부 도구는 리뷰 거절 사유
3. 복잡도: 테이블, 차트, 대량 편집 → 모바일 UX와 상극
4. 비용: 재작성에 웹 코드베이스의 ~50% 분량

**결정**: 모바일 앱은 **customer-facing만**. Admin은 웹 브라우저 접근 유지.

## 5. 이전 체크리스트 (Phase 1에서 실행)

### 5.1 구조 이전
- [ ] `pnpm-workspace.yaml` 작성
- [ ] `turbo.json` 작성
- [ ] `git mv src apps/web/src` (히스토리 보존)
- [ ] `git mv mobile apps/mobile`
- [ ] `git mv prisma packages/db/prisma`
- [ ] `packages/api/` 신설, `src/server/*` 이전
- [ ] `packages/shared/` 신설, types/schemas 이전
- [ ] `packages/design-tokens/` 신설

### 5.2 Import 경로 갱신
- [ ] `apps/web`의 `@/server/*` → `@repo/api`
- [ ] `apps/web`의 `@/types/*` → `@repo/shared`
- [ ] `apps/web`의 `@/lib/prisma` → `@repo/db`
- [ ] codemod 스크립트 작성 (ts-morph 추천)

### 5.3 빌드 검증
- [ ] `pnpm --filter web build` 성공
- [ ] `pnpm --filter web test` 성공
- [ ] `pnpm --filter web test:e2e` 성공
- [ ] `pnpm --filter mobile start` 성공 (Metro 기동)
- [ ] iOS 시뮬레이터에서 모바일 앱 런타임 동작

### 5.4 개발 경험
- [ ] ESLint, Prettier, tsconfig 공통화 (`tooling/`)
- [ ] VSCode `settings.json`의 import 경로 hint 갱신
- [ ] README에 pnpm 명령어 가이드

## 6. 단기 타협안

모노레포 전환이 부담스러우면 **임시 방편**:
1. `mobile/lib/api.ts`에 tRPC client 수동 설정
2. 타입은 `mobile/types/api.d.ts`에 수동 선언 (drift 감수)
3. 단, 이후 모노레포 전환 시 위 파일 폐기

→ **권장하지 않음**. 부채가 누적되면 전환 비용이 2배로 증가.
