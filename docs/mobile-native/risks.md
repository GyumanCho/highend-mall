# Risks & Mitigations

> RN 마이그레이션에서 확인된 리스크와 완화책.
> 작성일: 2026-04-09

## 리스크 매트릭스

| # | 리스크 | 심각도 | 발생 가능성 | Phase |
|---|---|---|---|---|
| R1 | NextAuth v5(beta) → RN 직접 지원 없음 | **HIGH** | 확정 | Phase 3 |
| R2 | Admin 스코프 폭주 | **HIGH** | 중 | Phase 0 (결정) |
| R3 | 결제 게이트웨이 + 앱스토어 정책 | **HIGH** | 중 | Phase 4, 6 |
| R4 | Reanimated 4 + New Arch 라이브러리 호환 | MEDIUM | 중 | Phase 0 |
| ~~R5~~ | ~~RN 0.83 ↔ Expo SDK 55 버전 불일치~~ | ✅ 해소 (오판) | — | Phase 0 완료 |
| R6 | Expo + pnpm monorepo hoisting 이슈 | MEDIUM | 중 | Phase 1 |
| R7 | Tailwind → StyleSheet 재작성 비용 (NativeWind 미채택) | MEDIUM | 확정 | Phase 4 |
| R8 | Prisma client 생성 위치 이전 시 타입 에러 | MEDIUM | 중 | Phase 1 |
| R9 | EAS Build 시간·비용 (무료 플랜 제약) | LOW | 중 | Phase 6 |
| R10 | 첫 스토어 심사 거절 | MEDIUM | 중 | Phase 6 |
| R11 | Unsplash 이미지 CDN 없이 프로덕션 사용 | LOW | 확정 | Phase 2 |
| R12 | 오프라인 지원 미구현 | LOW | 확정 | 전체 |
| R13 | 모바일 전용 테스트 부재 | MEDIUM | 확정 | Phase 4 |
| R14 | 타입 drift (단기 타협안 선택 시) | HIGH | 선택 사항 | Phase 1 |
| R15 | Cross-tier 토큰 경계 위반 (ESLint 미설정) | MEDIUM | 확정 | Phase 1 |
| R16 | Metro + pnpm workspace 해결 실패 | **HIGH** | 확정 | Phase 1 |
| R17 | `@repo/api` 런타임 코드 Metro 번들 오염 | **HIGH** | 중 | Phase 1 |
| R18 | NextAuth `authorize()` 직접 호출 (beta breakage) | MEDIUM | 중 | Phase 3 |
| R19 | 리프레시 토큰 race / 보안 모델 미상세 | **HIGH** | 중 | Phase 3 |
| R20 | 웹 Tailwind config ↔ 신규 brand 토큰 연결 누락 (Phase 1 회귀) | **HIGH** | 확정 | Phase 1 |
| R21 | Prisma generator output path 미이전 (Phase 1 빌드 실패) | **HIGH** | 확정 | Phase 1 |
| R22 | Next.js API CORS 미설정 (Phase 2 실기 차단) | MEDIUM | 확정 | Phase 2 |
| R23 | EAS Build + pnpm monorepo 설정 누락 | MEDIUM | 중 | Phase 6 |

---

## 상세

### R1 — NextAuth v5(beta) → RN 지원 없음 🔥

**문제**: NextAuth 5는 Next.js App Router + Server Components를 전제로 설계. RN 클라이언트가 사용할 공식 방법 없음.

**완화책**:
- 커스텀 JWT 엔드포인트 (`/api/auth/mobile/login`) 신설
- `jose` 라이브러리로 토큰 발급·검증
- `expo-secure-store`로 토큰 보관
- OAuth는 `expo-auth-session`으로 각 provider 직접 처리

**대안**: Clerk, Auth0 같은 서드파티 → NextAuth 포기, 비용 발생.

**결정 필요**: NextAuth 계속 쓸지 vs 서드파티 전환 (Phase 3 시작 전).

---

### R2 — Admin 스코프 폭주 🔥

**문제**: 모바일에 admin까지 넣으려 하면 작업량 2배, UX 혼재, 앱스토어 심사 거절 위험.

**완화책**:
- **Phase 0에서 확정적으로 "admin 제외" 결정**
- Admin은 웹 유지 (태블릿도 웹 브라우저로 사용)
- 필요 시 모바일에서 웹뷰로 admin 열기 (별도 dev-only 메뉴)

---

### R3 — 결제 + 앱스토어 정책 🔥

**문제**:
- Apple: 디지털 상품은 IAP 강제 (30% 수수료). 실물 상품은 외부 결제 허용.
- 검수 기준 애매: "서비스 vs 상품" 경계
- 한국 Toss, NHN KCP 등 국내 PG는 RN SDK 지원 상황 상이

**완화책**:
- 판매 대상이 **실물 럭셔리 패션 상품**으로 확정 → IAP 불필요
- Apple 가이드라인 3.1 (In-App Purchase) 사전 정독
- PG사 RN SDK 사전 검증 (Phase 4 시작 전)
- 백업: 웹뷰로 결제 페이지 열기

---

### R4 — Reanimated 4 + New Arch

**문제**: Reanimated 4는 New Architecture 전용. 일부 네이티브 모듈이 New Arch 미지원.

**완화책**:
- Phase 0에서 Reanimated 4 사용 의도 확인
- 필요 시 Reanimated 3.x로 다운그레이드 (New Arch 선택)
- 사용할 모든 라이브러리의 New Arch 호환성 사전 확인 표 작성

**체크할 라이브러리**:
- `react-native-gesture-handler` ≥ 2.22 (OK)
- `react-native-screens` ≥ 4.0 (OK)
- `@react-native-async-storage/async-storage` (호환 확인 필요)
- 결제 SDK (PG별 상이)

---

### ~~R5~~ — RN 0.83 ↔ Expo SDK 55 버전 불일치 (오판, 해소됨) ✅

**상태**: 2026-04-09 Phase 0에서 검증 결과 **오판으로 확인**.

`react-native@^0.83.4`는 Expo SDK 55의 **공식 호환 버전**. `expo install --fix` 실행 시 react-native는 변경되지 않았고, expo-doctor 17/17 통과. 초안의 "RN 0.81.x 지원 추정"은 잘못된 가정이었음.

**남은 부수 효과**: `app.json`의 `newArchEnabled: true`가 SDK 55에서 deprecated 필드로 검증 실패. 제거 후 통과.

---

### R6 — Expo + pnpm monorepo hoisting

**문제**: Expo는 `node_modules`가 플랫한 구조를 기대. pnpm은 기본적으로 non-hoisted. Metro bundler가 의존성 못 찾는 이슈 빈발.

**완화책**:
- `apps/mobile/.npmrc`에 `node-linker=hoisted`
- `metro.config.js`에 workspace 루트 추적 설정
- Expo 공식 pnpm monorepo 가이드 (node_modules/next/dist/docs 대신 Expo docs) 참조

**대안**: yarn workspaces 사용 — Expo 공식 지원 더 강력.

---

### R7 — Tailwind → StyleSheet 재작성 비용

**문제**: 웹의 Tailwind 기반 UI는 전량 재작성. 85개 파일 중 customer 쪽 ~40개.

**검토 후 폐기된 대안**: ~~NativeWind v4 도입~~ → **미채택**.
- 웹 디자인 이식 자체가 안티패턴 (architecture.md §2.7, mobile-design-system.md §11)
- 클래스명 공유는 "같아 보이지만 다른 의도"를 숨겨 디자인 품질 훼손

**완화책**:
- **페이지 단위 점진적 재작성** — 빅뱅 금지, Phase 4에서 우선순위대로
- 모바일 전용 컴포넌트 라이브러리 구축 (공유 X)
- 디자인 토큰은 2-layer: Tier 1(brand) 공유, Tier 2(platform) 완전 분리
- mobile-design-system.md의 원칙을 **재작성의 입력**으로 사용 (웹을 참고하지 않음)

---

### R8 — Prisma client 위치 이전

**문제**: `packages/db/`로 Prisma 이전 시 `@prisma/client` 생성 경로 변경. 기존 import 경로 전부 수정 필요.

**완화책**:
- codemod로 일괄 변환
- `packages/db/src/index.ts`에서 `PrismaClient` 재export
- Generator output을 `packages/db/generated/`로 명시

---

### R9 — EAS Build 시간·비용

**문제**: 무료 플랜은 월 30빌드, 큐 대기 시간 김. 유료는 월 $19~.

**완화책**:
- 초기엔 무료로 버티기
- 배포 근접 시 유료 전환 (월 $19)
- 로컬 빌드 대안 (`eas build --local`) — Xcode 설정 필요

---

### R10 — 첫 스토어 심사 거절

**문제**: 첫 제출은 평균 2–3회 거절.

**예상 거절 사유**:
- 프라이버시 정책 누락·불충분
- IAP 미사용 (디지털 상품 의심)
- 크래시 재현
- 메타데이터 (스크린샷 누락, 부적절한 키워드)
- ATT (App Tracking Transparency) prompt 누락

**완화책**:
- 제출 전 체크리스트 작성
- 내부 테스트 10명 이상 통과 후 제출
- 심사 팀과의 메시지는 24시간 내 응답

---

### R11 — Unsplash 이미지 CDN 없음

**문제**: 현재 Unsplash 직링크는 dev용. 프로덕션에서 속도·비용·저작권 이슈.

**완화책**:
- 자체 CDN (Cloudflare Images, Imgix, S3+CloudFront) 전환
- expo-image의 캐시 설정 최적화

---

### R12 — 오프라인 지원 미구현

**문제**: 네트워크 끊기면 앱 사용 불가.

**완화책** (P2, 필수 아님):
- React Query의 `networkMode: "offlineFirst"` + persist
- 상품 상세 캐싱

---

### R13 — 모바일 테스트 부재

**문제**: 단위 테스트는 `packages/api`에서 커버 가능. UI/E2E는 별도 필요.

**완화책**:
- Maestro (YAML 기반, 설정 단순) 또는 Detox (더 강력, 설정 복잡)
- 핵심 플로우 5개만 E2E 작성 (로그인, 검색, 상세, 장바구니, 주문)
- Phase 4 후반부에 도입

---

### R14 — 타입 drift (단기 타협안 선택 시)

**문제**: 모노레포 전환을 미루고 타입 수동 복제하면 웹·모바일 타입 drift 발생.

**완화책**:
- **Phase 1을 미루지 않기**
- 피치 못할 경우 OpenAPI spec or Protobuf로 타입 공유 (tRPC 포기 대가)

---

### R15 — Cross-Tier 토큰 경계 위반

**문제**: 2-layer 토큰 구조는 의도적 분리. 위험은 **"수동 복제"가 아니라**:
- `apps/mobile`에서 실수로 `@repo/design-tokens/web`을 import
- `apps/web`에서 `@repo/design-tokens/mobile`을 import
- Tier 1 brand 토큰이 drift (웹/모바일에서 다르게 정의됨)

**완화책**:
- ESLint `no-restricted-imports` 규칙으로 cross-tier import 차단 (architecture.md §2.3.2)
- `packages/design-tokens`는 `exports` 맵에서 `./brand`, `./web`, `./mobile` subpath 명시
- `dependency-cruiser` 또는 `eslint-plugin-boundaries`로 모노레포 경계 강제
- Tier 1 변경은 PR에 양 플랫폼 스크린샷 첨부 의무화

---

### R16 — Metro + pnpm workspace 해결 실패 🔥

**문제**: Expo + pnpm monorepo 실패 1순위. Metro가 workspace 패키지를 못 찾거나 symlink를 못 따라감.

**완화책**: architecture.md §2.1의 `metro.config.js` 템플릿 필수 적용:
- `watchFolders`: monorepo 루트 추가
- `nodeModulesPaths`: projectRoot + workspaceRoot 양쪽
- `disableHierarchicalLookup: true`
- `.npmrc`에 `node-linker=hoisted`, `shamefully-hoist=true`

**검증**: Phase 1 완료 기준에 "physical device에서 dev build 성공" 포함.

---

### R17 — `@repo/api` 런타임 코드 Metro 번들 오염 🔥

**문제**: 모바일이 `@repo/api`를 무심코 value import하면 Metro가 Prisma, bcrypt, Node builtins까지 끌고 와 번들 실패.

**완화책**:
- `packages/api/package.json`에 `./types` subpath 별도 export (architecture.md §2.3.1)
- 모바일 측은 `import type { AppRouter } from "@repo/api/types"`만 허용
- ESLint `no-restricted-imports`로 `@repo/api` value import 금지 (architecture.md §2.3.2)

---

### R18 — NextAuth `authorize()` 직접 호출 위험

**문제**: NextAuth v5 beta의 provider 내부 `authorize()`는 public API가 아님. beta 릴리스 간 signature 변경 가능.

**완화책**: `packages/api/src/services/auth.ts`에 `verifyCredentials()` 순수 함수로 추출 (architecture.md §2.4.1). NextAuth와 모바일 JWT 엔드포인트가 이 서비스를 공유.

---

### R19 — 리프레시 토큰 보안 모델 🔥

**문제**: 저장 위치·race·device binding·rate limit 미정의 시 Phase 3에서 보안 취약점 양산.

**완화책**: architecture.md §2.4.2의 `RefreshToken` Prisma 모델 + rotation 규칙 준수.
- 매 refresh 시 이전 토큰 revoke + 신규 발행
- `tokenHash` unique constraint로 concurrent race 차단
- `/api/auth/mobile/login`은 IP + email 기준 rate limit (upstash)
- Logout-all-devices 지원

---

### R20 — 웹 Tailwind config 이전 누락 🔥

**문제**: Phase 1에서 brand 토큰을 `packages/design-tokens/brand`로 옮기기만 하고 `apps/web/tailwind.config.ts`를 갱신하지 않으면 웹 스타일링 전면 깨짐.

**완화책**: roadmap.md Phase 1.6 (신설) — 토큰 이전 + Tailwind config 갱신 + 웹 스모크 테스트를 **하나의 태스크 묶음**으로 처리.

---

### R21 — Prisma generator output 미이전 🔥

**문제**: `prisma/` → `packages/db/prisma/` 이동 시 `schema.prisma`의 `generator client { output = "..." }`도 함께 갱신해야 `@prisma/client` import가 작동.

**완화책**: roadmap.md Phase 1.2에 명시적 태스크로 추가. 순서: (a) 스키마 이동, (b) generator output 경로 수정, (c) `prisma generate`, (d) import 경로 codemod, (e) 빌드 검증.

---

### R22 — Next.js API CORS 미설정

**문제**: Next.js App Router API route는 기본적으로 CORS 헤더를 보내지 않음. 물리 디바이스에서 모바일 개발 시 CORS 에러로 차단.

**완화책**:
- `apps/web/app/api/trpc/[trpc]/route.ts`에 CORS 헤더 미들웨어 추가
- 허용 오리진: dev는 `*`, prod는 deep link 스킴 + 내부 도메인
- Phase 2 태스크에 포함

---

### R23 — EAS Build + pnpm monorepo

**문제**: EAS Build 기본 이미지는 pnpm monorepo 미지원. workspace 해결 실패.

**완화책**:
- `eas.json`에 `build.*.cache.paths`, `build.*.env.EAS_NO_VCS` 등 설정
- `pre-install` 훅에서 `pnpm install --frozen-lockfile`
- Phase 6 태스크에 명시

---

## 리스크 모니터링

각 Phase 완료 시 다음 질문에 답하고 문서 갱신:

1. 이 Phase에서 새로 발견된 리스크는?
2. 완화책이 예상대로 동작했는가?
3. 다음 Phase의 리스크 우선순위가 바뀌었는가?

## 전면 중단(Abort) 기준

다음 상황 중 하나 발생 시 진행 재검토:
- Phase 0~2에서 기술적 차단이 2주 이상 해소 안 됨
- Apple 또는 Google 심사가 3회 이상 거절되고 대응 불가
- 결제 컴플라이언스 경로가 막힘
- 비즈니스 전제 변경 (모바일 필요성 재평가)
