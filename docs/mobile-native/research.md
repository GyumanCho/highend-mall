# Research: RN 마이그레이션 가능성 재조사

> 작성일: 2026-04-09
> 방법: 로컬 코드베이스 직접 검증 + 의존성·구조 분석 (샌드박스 미사용)

## 1. 코드베이스 스냅샷

### 1.1 웹 (Next.js) — 85개 TS/TSX 파일

**프레임워크 스택**
```
Next.js           16.2.1
React             19.2.4
React Compiler    1.0.0
Tailwind CSS      4
Framer Motion     12.38
```

**데이터 레이어**
```
@trpc/server,client,next,react-query  11.x
@tanstack/react-query                 5.95
Prisma                                6
next-auth                             5.0.0-beta.30
Zod                                   4
Zustand                               5
```

**라우트 구조**
```
src/app/
├── (customer)/
│   ├── products/[slug]
│   ├── brands/[slug]
│   ├── collections/[slug]
│   ├── cart, checkout, wishlist, login, journal
│   └── account/{orders,addresses,preferences,size-profile}
├── (admin)/
│   └── dashboard/{products,orders,reviews,customers,campaigns,churn,settings}
└── api/
    ├── auth/[...nextauth]
    ├── trpc/[trpc]
    ├── agents/{recommendation,product-listing,dispatch,review-response,jobs}
    └── webhooks/
```

**서버 로직** (`src/server/`)
- `routers/` — tRPC routers (brand, product, _app)
- `services/` — 비즈니스 로직
- `jobs/` — 백그라운드 작업
- `trpc.ts` — tRPC 초기화

### 1.2 모바일 (`mobile/`) — Expo SDK 55, 13개 파일

**프레임워크 스택**
```
Expo                         ~55.0.12  ✅ SDK 55 정렬됨 (Phase 0 작업 후)
Expo Router                  ~55.0.11
react-native                 ^0.83.4   ✅ SDK 55 공식 호환 버전
react                        ^19.2.0
react-native-reanimated      ^4.2.1    ✅ New Architecture (SDK 55 기본)
react-native-worklets        ^0.7.2
react-native-gesture-handler ^2.30.1
react-native-safe-area-context ~5.6.2
react-native-screens         ~4.23.0
expo-haptics ~55.0.13, expo-image ~55.0.8, expo-linking ~55.0.11
expo-splash-screen ~55.0.16, expo-status-bar ~55.0.5, expo-font, expo-asset, expo-constants, expo-file-system
@expo/vector-icons           ^15.1.1
zustand                      ^5.0.12
babel-plugin-module-resolver
```

> **Phase 0 결과**: `npx expo install --fix` 실행 → 12 + 7개 모듈 SDK 55 호환 버전으로 정렬. `expo-doctor` 17/17 통과.

**구현된 화면 (10개 파일)**
```
mobile/app/
├── _layout.tsx              # Stack root
├── index.tsx                # 루트 redirect (신규)
├── (tabs)/
│   ├── _layout.tsx          # 5 탭 (home/shop/wishlist/bag/account)
│   ├── index.tsx            # home
│   ├── shop.tsx
│   ├── wishlist.tsx
│   ├── bag.tsx
│   └── account.tsx
├── product/[slug].tsx       # ⚠️ Mock 데이터 5개 하드코딩
└── checkout.tsx
```

**로컬 유틸 (3개 파일)**
```
mobile/lib/
├── api.ts      # fetch 래퍼 (실제 사용 안 됨)
├── stores.ts   # Zustand (cart, wishlist) — 로컬 only
└── theme.ts    # colors, fonts, spacing 수동 복제
```

**중복 존재**
- `mobile/temp-app/` — 별도 `App.tsx`, `package.json` 포함. 용도 불명, 정리 필요.

## 2. 핵심 발견 (Critical Findings)

### Finding #1 — 현재 mobile/은 "마이그레이션"이 아니라 "UI 셸"

| 구성 요소 | 진행률 |
|---|---|
| UI 컴포넌트 / 화면 레이아웃 | ~30% |
| 데이터 연결 (tRPC client, API) | 0% |
| 인증 (NextAuth 브릿지) | 0% |
| 백엔드 상태 동기화 (cart, wishlist DB sync) | 0% |
| 에러 처리 / 로딩 UX | 0% |
| 테스트 | 0% |
| 빌드 / 배포 파이프라인 | 0% |
| **종합 (데이터 레이어 기준)** | **~5%** |

**증거**: `mobile/app/product/[slug].tsx` L13-84에 5개 상품이 TypeScript `Record`로 하드코딩. `mobile/lib/api.ts`의 `apiFetch`는 선언되어 있지만 **어디서도 import되지 않음**.

### Finding #2 — 의존성 정합성 (Phase 0에서 해결됨) ✅

**이전 가정 정정**: 초안에서 `react-native: ^0.83.4`가 Expo SDK 55와 불일치한다고 추정했으나, **이는 오판이었음**. RN 0.83.x는 SDK 55의 공식 호환 버전.

**Phase 0 작업 (2026-04-09 실행)**:
```bash
cd mobile && npm install
./node_modules/.bin/expo install --fix
```

**결과**:
- `react-native@^0.83.4` — 변경 없음 (이미 호환)
- `expo` ^55.0.9 → ~55.0.12
- 12개 expo-* 모듈 정렬 (haptics, image, linking, router, splash-screen, status-bar 등)
- TypeScript 5.8.3 → 5.9.2
- `app.json`에서 `newArchEnabled: true` 제거 (SDK 55에서 deprecated, New Arch 기본 활성화)

**검증**: `expo-doctor` 17/17 ✅ 통과.

### Finding #3 — Reanimated 4 + New Architecture **확정 채택**

`react-native-reanimated@4.2.1`은 New Architecture (Fabric + TurboModules) 전용 릴리스입니다.

**결정**: 이미 설치되어 있으므로 **v4 + New Arch 유지**. 3.x 다운그레이드 대안은 폐기.

**함의**:
- 사용할 모든 라이브러리의 New Arch 호환성을 Phase 0에서 사전 검증
- `mobile/app.json`의 `newArchEnabled: true` 명시적 설정
- New Arch 미지원 라이브러리는 대안 탐색 또는 포팅

### Finding #4 — NextAuth v5(beta) → RN 지원 없음

NextAuth 5는 React Server Components와 Next.js App Router 전제로 설계됨. RN에서 직접 사용 불가.

**필요한 브릿지 설계**:
1. Next.js 서버에 `/api/auth/mobile/login` 엔드포인트 신설 (JWT 발급)
2. Mobile 측 `expo-secure-store`로 토큰 보관
3. OAuth 프로바이더는 `expo-auth-session`으로 처리
4. tRPC client에 Authorization 헤더 자동 주입

### Finding #5 — Admin 영역은 모바일에 가져가면 안 됨

웹 admin 라우트: `products/orders/reviews/customers/campaigns/churn/settings` + 대시보드 = 약 10개+ 페이지.
웹 코드 기준 대략 **50%**를 차지.

모바일 앱에 admin을 넣으면:
- 사용자 페르소나 혼재 (shopper vs operator)
- 앱스토어 리뷰 기준상 내부 도구 접근 경로로 심사 거절 위험
- UI 복잡도 2배
- 유지보수 2배

**결정 권장**: 모바일은 **customer only**. Admin은 웹 유지.

## 3. 생각해보지 않은 숨은 비용

- **푸시 알림**: Expo Notifications 설정, APNs/FCM 인증서, Firebase 프로젝트, 백엔드 push service
- **딥링크**: Universal Links (iOS) / App Links (Android) — 도메인 소유 증명 파일 호스팅
- **앱 아이콘/스플래시**: 각 해상도별 에셋
- **스토어 등록**: Apple Developer($99/년), Google Play($25 일회성), 심사, 스크린샷, 정책 문서, 연령 등급
- **결제 컴플라이언스**: 실물 상품은 일반 결제 가능, 디지털 상품은 IAP 강제
- **EAS Build / Submit**: Expo의 클라우드 빌드 구독 (무료 플랜 있음, 속도 제약)
- **OTA 업데이트**: EAS Update 설정

## 4. 검증 가능한 지표

RN 앱이 "실제로 쓸만해졌는지" 확인할 측정 기준:

- [ ] `mobile/app/product/[slug].tsx`에서 하드코딩 PRODUCTS 제거
- [ ] `apiFetch` 또는 tRPC client가 실제로 import되어 사용됨
- [ ] 로그인 → 토큰 저장 → authenticated tRPC 호출 end-to-end 동작
- [ ] Cart/Wishlist가 로그아웃 후에도 서버에 유지됨
- [ ] iOS + Android 모두에서 EAS Build 성공
- [ ] 최소 1개 사용자 플로우 (product 검색 → 상세 → 장바구니 → 체크아웃)가 모바일에서 완주 가능

## 5. 참고 자료 (로컬 확인 결과)

- `node_modules/next/dist/docs/` — AGENTS.md 지시에 따라 Next 16.2.1 변경사항 확인 필수
- Expo SDK 55 공식 RN 버전: 코드베이스에서 `expo install --fix` 실행 시 출력 확인
- `create-t3-turbo` — Next + Expo + tRPC 모노레포의 레퍼런스 구조 (외부 참고)
