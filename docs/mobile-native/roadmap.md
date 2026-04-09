# Roadmap

> Phase 0 ~ 6 단계별 실행 계획. 1인 엔지니어 기준 추정.
> 작성일: 2026-04-09

## 전체 요약

| Phase | 이름 | 주요 산출물 | 기간 |
|---|---|---|---|
| 0 | 안정화 | 의존성 정합성, 빌드 통과 | 1–1.5주 |
| 1 | 모노레포 전환 | apps/* + packages/* 구조 | 2–3주 |
| 2 | 백엔드 연결 | tRPC client, mock 제거, CORS | 1.5–2주 |
| 3 | 인증 브릿지 | JWT + refresh + expo-secure-store | 1.5주 |
| 4 | Customer UX 동등화 | brand/search/account/checkout (P0+P1) | 3–4.5주 |
| 5 | 네이티브 폴리시 | 푸시, 딥링크, OTA | 1–2주 |
| 6 | 배포 | EAS Build (pnpm monorepo), 스토어 제출 | 1.5–2주 |
| | **합계** | | **11.5–16.5주** |

> **타임라인 수정**: 초안의 "8–12주"는 Phase 4 P0만 기준이었으나, P1 (주소록, 리뷰, 설정 등)이 사실상 필수임이 QA 검토에서 확인되어 상향. 또한 Metro/pnpm/Prisma/Auth 선결 작업이 Phase 1에 추가되어 1–1.5주 증가.

---

## Phase 0 — 안정화 (1–1.5주, **부분 진행 중**)

### 목적
현재 `mobile/` 폴더가 최소한 빌드·실행되는 상태를 보장. 이후 단계의 기반.

### 진행 상황 (2026-04-09)

#### ✅ 완료
- [x] `cd mobile && npm install` — 660개 패키지 설치
- [x] `./node_modules/.bin/expo install --fix` — 12 + 7개 모듈 SDK 55 호환 정렬
  - expo ~55.0.12, expo-haptics/image/linking/router/splash-screen/status-bar 정렬
  - TypeScript ~5.9.2
  - **react-native@^0.83.4는 그대로 (SDK 55 공식 호환 확인)**
- [x] `mobile/app.json`에서 `newArchEnabled: true` 제거 (SDK 55 deprecated)
- [x] **`expo-doctor` 17/17 ✅ 통과**
- [x] **`tsc --noEmit` 타입 체크 ✅ 통과**
- [x] `babel-plugin-module-resolver` 사용 검증 — 14곳에서 `@/` alias 사용 중, **유지** 결정 (Phase 1에서 재검토)
- [x] `mobile/temp-app/` 삭제 (Expo SDK 54 보일러플레이트, untracked)
- [x] **New Architecture 호환성 매트릭스 작성** → [new-arch-compatibility.md](./new-arch-compatibility.md)

#### ⏳ 남은 작업 (사용자 디바이스 필요)
- [ ] iOS 시뮬레이터 cold start (`npx expo start --ios`)
- [ ] Android 에뮬레이터 cold start (`npx expo start --android`)
- [ ] **물리 디바이스** cold start (Metro LAN 연결 검증)
- [ ] Reanimated 4 + New Arch 런타임 검증 (실제 화면 진입 + worklet 동작)

### 확정된 결정 (Phase 0 진입 조건)
- ✅ Reanimated **v4 + New Arch** 채택 확정 (3.x 다운그레이드 옵션 폐기)
- ✅ Admin은 모바일 **비대상** 확정
- ✅ 스타일링: **StyleSheet 전용**, NativeWind 미채택 확정

### 완료 기준
- 두 플랫폼에서 앱 cold start 성공
- 홈 탭 진입 가능
- `expo doctor` 통과

### 리스크
- Reanimated 4가 기대대로 동작 안 할 가능성 → 3.x로 다운그레이드 고려
- RN 버전 강제 조정 시 다른 패키지와 충돌

---

## Phase 1 — 모노레포 전환 (2–3주, **대부분 완료** 2026-04-09)

### 목적
웹과 모바일이 타입·스키마·백엔드 로직을 공유할 수 있는 구조 확보.

### 작업

#### 1.1 도구 설치 및 설정 ✅
- [x] pnpm workspace 활성화 (`pnpm-workspace.yaml`)
- [x] `.npmrc`에 `node-linker=hoisted`, `public-hoist-pattern[]=*`, `shamefully-hoist=true`
- [x] Turborepo 설치 및 `turbo.json` 작성
- [x] 루트 `package.json`에 workspace 스크립트
- [x] `apps/mobile/metro.config.js` 작성 (watchFolders + nodeModulesPaths + disableHierarchicalLookup)

#### 1.2 디렉터리 이전 ✅
- [x] `git mv src apps/web/src` (히스토리 보존)
- [x] `apps/web/` 루트에 `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `playwright.config.ts`, `postcss.config.mjs`, `vitest.config.ts` 이전
- [x] `git mv mobile apps/mobile`
- [x] `packages/api/` 신설 → `src/server/*` 이전
- [x] `packages/db/` 신설 → `prisma/*` 이전
- [x] **Prisma generator**: 기본 출력 경로 유지 (pnpm hoisted로 정상 작동)
- [x] `pnpm --filter @repo/db db:generate` 성공
- [x] `packages/shared/` 신설 (placeholder)
- [x] `packages/design-tokens/` 신설 (brand/web/mobile subpath 구조)
- [x] `packages/api/package.json`에 `./types` subpath exports 맵 작성

#### 1.3 Auth 서비스 추출 (NextAuth beta 선결) ⏭️ 스킵
- [ ] ~~`packages/api/src/services/auth.ts`에 `verifyCredentials()` 순수 함수 추출~~
  - **현재 상태**: 기존 NextAuth v5 설정은 웹에서 정상 동작 중. Phase 3(모바일 인증 브릿지)에서 함께 진행이 효율적이라 판단.
- [ ] Phase 3에서 수행 예정

#### 1.4 Import 경로 갱신 ✅
- [x] `packages/api`의 `@/lib/db/client` → `@repo/db`
- [x] `apps/web/src/lib/db/client.ts`는 `@repo/db` re-export로 하위 호환 유지
- [x] 기존 `@/*` alias는 apps/web 내에서 유지 (각 app tsconfig에 독립 정의)

#### 1.5 Design token 이전 + 웹 통합 ✅
- [x] 현재 `globals.css`의 브랜드 컬러를 `packages/design-tokens/src/brand/colors.ts`로 복사 (값 일치)
- [x] `packages/design-tokens/src/{web,mobile}/` 플랫폼별 Tier 2 토큰 작성
- [x] `globals.css`에 "단일 소스 = packages/design-tokens/brand" 주석 추가 (Tailwind 4 CSS-in-CSS)
- [x] `apps/mobile/lib/theme.ts`가 `@repo/design-tokens/brand` + `/mobile`에서 import
- [x] 웹 빌드 리그레션 없이 29페이지 전체 생성 성공
- [x] ESLint `no-restricted-imports`로 cross-tier import 차단 (apps/web, apps/mobile 각각)

#### 1.6 빌드 검증 ✅
- [x] `pnpm --filter @repo/api type-check` ✅
- [x] `pnpm --filter @repo/db type-check` ✅
- [x] `pnpm --filter @repo/web type-check` ✅
- [x] `pnpm --filter @repo/web build` ✅ (29 pages 생성)
- [x] `pnpm --filter @repo/web test` ✅ (Vitest 84/84)
- [x] `pnpm --filter @repo/web test:e2e` ✅ (Playwright 18/18)
- [x] `pnpm --filter @repo/mobile type-check` ✅
- [x] **Turborepo `pnpm type-check`** ✅ (6/6 통과, 캐시 적중)
- [ ] 물리 디바이스 dev build 성공 (Metro workspace 해결) — **사용자 디바이스 필요**

#### 1.7 CI 갱신 ✅
- [x] `.github/workflows/ci.yml` 작성 (pnpm + turbo + postgres + playwright)
- [ ] Turborepo 원격 캐시 설정 (Vercel Remote Cache 또는 self-hosted) — Phase 2+에서 필요 시

### 🔄 Phase 1에서 발견된 기술 부채 (Phase 2 이전에 처리 권장)
- pre-existing ESLint 에러 8건 (react-hooks/set-state-in-effect 등) — Phase 1 변경과 무관
- Reanimated 4.3.0 ↔ worklets 0.7.4 peer dep 경고 — 런타임 영향 없지만 추적 필요
- `apps/web/src/lib/db/client.ts` compat 레이어 — 향후 @repo/db 직접 import로 단계적 제거

### 완료 기준
- 기존 웹 기능 전체가 리그레션 없이 동작
- 모바일 기본 빌드 유지
- CI 녹색

### 리스크
- Expo + pnpm hoisting 이슈 → `.npmrc`에 `node-linker=hoisted` 필요할 수 있음
- Prisma client 생성 위치 변경에 따른 타입 에러 속출
- 테스트가 경로 alias에 의존하는 경우 다수 실패

---

## Phase 2 — 백엔드 연결 (1.5–2주, **스캐폴딩 완료** 2026-04-09)

### 목적
모바일이 **실제 데이터**로 동작. Mock 데이터 완전 제거.

### 진행 상황

#### ✅ 완료
- [x] `apps/web/src/app/api/trpc/[trpc]/route.ts` 신규 작성
  - `fetchRequestHandler` 기반 tRPC HTTP 엔드포인트
  - CORS 미들웨어 (dev: `*`, prod: `maison://` scheme + 도메인 화이트리스트)
  - OPTIONS preflight 처리
  - createContext 뼈대 (Phase 3에서 JWT 미들웨어 확장)
- [x] `apps/mobile/package.json`에 tRPC client 의존성 추가
  - @trpc/client, @trpc/react-query, @trpc/server, @tanstack/react-query, @repo/api
- [x] `apps/mobile/lib/trpc.ts` 생성
  - `createTRPCReact<AppRouter>()` with httpBatchLink
  - **`import type { AppRouter } from "@repo/api/types"`** (type-only)
  - 플랫폼별 API URL 해석 (Android 에뮬레이터 10.0.2.2 자동 치환)
  - `createTrpcClient()` 팩토리 패턴 (Provider에서 안정적 ref)
- [x] `apps/mobile/app/_layout.tsx`에 `QueryClientProvider`, `trpc.Provider` 추가
  - QueryClient 기본 staleTime 1분, retry 1
- [x] `apps/mobile/app.json`에 `extra.apiBaseUrl` 설정
- [x] **`apps/mobile/app/product/[slug].tsx`** — 5개 mock PRODUCTS 완전 제거, `trpc.product.getBySlug.useQuery`로 교체
  - 로딩(ActivityIndicator)/에러/빈 상태 처리
  - TS2589 deep instantiation 회피용 얕은 로컬 타입 단절
- [x] 전체 검증: turbo type-check 6/6, lint 0/0, vitest 84/84, build 29p, E2E 18/18

#### ⏳ 남은 작업
- [ ] `(tabs)/shop.tsx` — 상품 목록을 `trpc.product.list` tRPC 호출로 교체
- [ ] `(tabs)/index.tsx` (home) — 피처드 상품 tRPC 연동
- [ ] `(tabs)/wishlist.tsx` — 현재 로컬 store만 사용, Phase 3 인증 후 서버 동기화 예정
- [ ] Brand 화면 (아직 모바일에 없음) — 신규 화면 생성 시 `trpc.brand.*` 사용
- [ ] 에러 바운더리 추가 (루트 _layout)
- [ ] 로딩 스켈레톤 UI 추가 (원형 스피너 금지 — mobile-design-system §6.3)
- [ ] 실기기/시뮬레이터에서 tRPC 호출 end-to-end 검증 (사용자 환경)

### 완료 기준
- [ ] `grep -r "PRODUCTS =" apps/mobile/app` 결과 없음
- [ ] 서버 DB 변경이 모바일에 즉시 반영됨
- [ ] 네트워크 오프라인 시 graceful 에러

### 리스크
- CORS — Next.js API가 기본적으로 모바일 요청 허용하는지 확인 필요
- 이미지 URL 처리 — Unsplash 직링크는 CDN 없이 로드 느림

---

## Phase 3 — 인증 브릿지 (1.5주)

### 목적
모바일에서 로그인 → 보호된 tRPC 호출 성공.

### 작업

#### 3.1 백엔드
- [ ] `packages/db/prisma/schema.prisma`에 `RefreshToken` 모델 추가 (architecture.md §2.4.2)
- [ ] `prisma migrate dev` — 마이그레이션 생성
- [ ] `apps/web/app/api/auth/mobile/login/route.ts` 신설
  - `@repo/api/services/auth`의 `verifyCredentials()` 호출
  - JWT 발급 (access 15분, refresh 7일) + `RefreshToken` DB 저장
- [ ] `apps/web/app/api/auth/mobile/refresh/route.ts` 신설
  - Refresh rotation: 이전 토큰 revoke + 신규 발행
  - Concurrent race 방지 (unique constraint)
- [ ] `apps/web/app/api/auth/mobile/logout/route.ts` 신설 (단일/전체 디바이스)
- [ ] Rate limit 미들웨어 (upstash rate limit) on login/refresh
- [ ] `packages/api/src/trpc.ts`에 JWT 검증 미들웨어 추가

#### 3.2 모바일
- [ ] `apps/mobile/lib/auth.ts` 신설
  - `expo-secure-store`로 access + refresh 토큰 저장/조회
  - `expo-device`로 `deviceId`, `deviceName` 수집
  - Zustand store로 auth state 관리
- [ ] `apps/mobile/app/(tabs)/account.tsx` — 로그인 UI
- [ ] tRPC client의 `headers()`에 자동 Access Token 주입
- [ ] 401 응답 인터셉터 → refresh 재시도 로직 (race 방지)
- [ ] 로그아웃 플로우 (현재 기기 / 전체 기기)

#### 3.3 OAuth (P1, 선택)
- [ ] `expo-auth-session`으로 Google / Apple 로그인
- [ ] Provider별 토큰 검증 엔드포인트

### 완료 기준
- [ ] 로그인 → 앱 재시작 후에도 로그인 유지
- [ ] 액세스 토큰 만료 시 자동 refresh 성공
- [ ] 동시 2개 탭에서 refresh 호출해도 race 없음
- [ ] 로그아웃 → 서버 측 토큰 revoke 확인

### 완료 기준
- [ ] 로그인 → 토큰 저장 → 앱 재시작 후에도 로그인 유지
- [ ] 보호된 tRPC procedure 호출 성공
- [ ] 토큰 만료 시 자동 refresh

### 리스크
- NextAuth v5 beta는 세션 관리 방식이 v4와 다름 → provider 재사용 패턴 검증 필요
- OAuth(Google, Apple) 추가 시 `expo-auth-session` 설정 복잡

---

## Phase 4 — Customer UX 동등화 (3–4.5주)

### 목적
웹 customer 페이지의 핵심 기능을 모바일에서도 사용 가능하게.

### 우선순위별 작업

#### P0 (필수)
- [ ] Brand 목록 + 상세
- [ ] Collection 목록 + 상세
- [ ] 검색 + 필터 (카테고리, 브랜드, 가격대) — 필터는 **바텀시트**로
- [ ] Cart 서버 동기화 (로그인 후)
- [ ] Wishlist 서버 동기화
- [ ] 실제 결제 연동 (Stripe or Toss Payments) — RN SDK 호환 사전 검증
- [ ] 주문 내역
- [ ] 주문 상세
- [ ] Safe area 대응 전 화면 (mobile-design-system §1.1)
- [ ] Haptics 일관성 적용 (mobile-design-system §2.3)
- [ ] `expo-font`로 Playfair Display + Inter 번들링 (현재 Georgia/System 폴백)

#### P1 (중요 — 본 Phase에 포함)
- [ ] 주소록
- [ ] 환경 설정 (언어, 통화, 알림)
- [ ] 사이즈 프로파일
- [ ] 리뷰 조회
- [ ] 리뷰 작성
- [ ] 접근성 검증 (VoiceOver, TalkBack) — mobile-design-system §9
- [ ] 모바일 E2E 테스트 (Maestro) — 로그인/검색/상세/장바구니/주문 5 플로우

#### P2 (나중에)
- [ ] 저널 (에디토리얼)
- [ ] 공유 기능 (native share sheet)
- [ ] 추천 시스템 UI

### 완료 기준
- 웹에서 할 수 있는 customer 플로우의 90%가 모바일에서 동작
- 최소 3명의 테스터가 end-to-end 구매 플로우 성공

### 리스크
- 결제 연동이 가장 큰 변수 — SDK별 RN 지원 상이
- 검색 UX가 웹과 다르게 설계되어야 함 (스크롤·필터 시트)

---

## Phase 5 — 네이티브 폴리시 (1–2주)

### 작업
- [ ] Expo Notifications 설정
  - APNs 인증서 (iOS)
  - FCM 프로젝트 (Android)
  - 백엔드 push service (expo-server-sdk)
- [ ] 딥링크
  - `app.json` scheme
  - Universal Links (iOS) — `apple-app-site-association` 호스팅
  - App Links (Android) — `assetlinks.json` 호스팅
- [ ] 앱 아이콘 (1024x1024 마스터 + 모든 해상도)
- [ ] 스플래시 스크린
- [ ] Haptics (이미 일부 사용 중)
- [ ] Share sheet
- [ ] EAS Update (OTA) 설정

### 완료 기준
- 웹에서 상품 링크 공유 → 모바일 앱에서 해당 상품 열기
- 푸시 알림 수신 → 앱 내 해당 화면 이동
- 첫 인상 (splash → home) 매끄러움

---

## Phase 6 — 배포 (1.5–2주)

### 작업
- [ ] Apple Developer 계정 ($99/년)
- [ ] Google Play Console ($25 일회성)
- [ ] EAS Build 설정 (`eas.json`)
  - **pnpm monorepo 지원**: `build.*.env.PNPM_VERSION`, `pre-install` 훅에서 `pnpm install --frozen-lockfile`
  - `cache.paths`에 `packages/*/dist` 포함
- [ ] iOS 빌드 → TestFlight 업로드
- [ ] Android 빌드 → Internal Testing 업로드
- [ ] 내부 테스터 피드백 수집
- [ ] 스토어 페이지 준비
  - 스크린샷 (각 디바이스 사이즈)
  - 앱 설명, 키워드
  - 프라이버시 정책 URL
  - 연령 등급
- [ ] 프로덕션 제출
- [ ] 심사 대응 (거절 시 수정·재제출)

### 완료 기준
- TestFlight에서 외부 테스터 10명 이상 플로우 테스트 완료
- App Store / Play Store 공개

### 리스크
- 심사 거절 사유 1순위: 결제 정책 (IAP 강제 vs 외부 결제)
- 프라이버시 정책 요구사항 (iOS 14+의 App Tracking Transparency)
- 첫 제출은 평균 2–3회 리젝트 경험 예상

---

## 의사결정 체크포인트

각 Phase 시작 전에 반드시 확인:

### Phase 0 시작 전
- [ ] RN 진행 최종 확정 vs PWA 회귀
- [ ] 예산 (엔지니어 공수, 스토어 등록비, 인증서 비용)

### Phase 1 시작 전
- [ ] 모노레포 패턴 확정 (pnpm + turbo)
- [ ] 웹 prod 장애 리스크 완화책 (feature flag, 롤백 계획)

### Phase 3 시작 전
- [ ] OAuth 프로바이더 목록 확정
- [ ] 토큰 정책 (TTL, refresh 전략)

### Phase 4 시작 전
- [ ] 결제 게이트웨이 확정
- [ ] 스코프 컷오프 (P0 필수만 / P1까지)

### Phase 6 시작 전
- [ ] 스토어 정책 검토 (특히 결제)
- [ ] 마케팅·PR 준비

---

## KPI

- **기술**: 모바일 앱 crash-free rate > 99.5%
- **성능**: 콜드 스타트 < 3초, 주요 플로우 TTI < 1초
- **품질**: 테스트 커버리지 > 70%
- **사용자**: TestFlight 테스터 NPS > 40
