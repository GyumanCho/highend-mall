@AGENTS.md

# Highend Fashion Mall (Maison)

럭셔리 패션 이커머스 플랫폼. 웹(Next.js) + 모바일(Expo/React Native) + 공유 API 레이어로 구성된 Turborepo 모노레포.

---

## 프로젝트 개요

- **앱 이름**: Maison (`maison.co.kr`)
- **목적**: 하이엔드 패션 브랜드 큐레이션 및 VIP 고객 대상 이커머스
- **주요 도메인**: 브랜드(Brand), 상품(Product), 컬렉션(Collection), 주문(Order), 리뷰(Review), VIP 고객 관리, AI 에이전트 파이프라인

---

## 기술 스택

| 영역 | 기술 |
|------|------|
| **모노레포** | Turborepo + pnpm 9.15 |
| **웹** | Next.js 16.2, React 19, Tailwind CSS 4, Framer Motion |
| **모바일** | Expo 55 (SDK 55), React Native, expo-router |
| **API** | tRPC v11 (server + client) |
| **DB** | PostgreSQL 16 + Prisma 6 |
| **인증** | NextAuth 5 (beta.30) + JWT (jose) |
| **상태관리** | Zustand 5 (웹), TanStack React Query 5 |
| **캐시** | Redis 7 |
| **테스트** | Vitest (단위), Playwright (E2E) |
| **언어** | TypeScript 5.9 |
| **런타임** | Node.js >= 20 |

---

## 워크스페이스 구조

```
highend-fashion-mall/
├── apps/
│   ├── web/          # @repo/web — Next.js 16 웹 프론트엔드
│   └── mobile/       # @repo/mobile — Expo 55 모바일 앱
├── packages/
│   ├── api/          # @repo/api — tRPC 라우터 (서버 로직)
│   ├── db/           # @repo/db — Prisma 스키마 + 클라이언트
│   ├── shared/       # @repo/shared — 공유 유틸리티, Zod 스키마
│   └── design-tokens/ # @repo/design-tokens — 브랜드/웹/모바일 디자인 토큰
└── docs/             # PRD, 아키텍처, 태스크 목록 등
```

---

## 주요 명령어

```bash
# 개발 서버
pnpm dev              # 전체 dev (turbo)
pnpm web:dev          # 웹만 실행
pnpm mobile:start     # 모바일 Expo 실행

# 빌드 / 검증
pnpm build            # 전체 빌드
pnpm lint             # 전체 린트
pnpm test             # 전체 테스트 (vitest)
pnpm test:e2e         # E2E 테스트 (playwright)

# 데이터베이스
pnpm db:generate      # Prisma 클라이언트 생성
pnpm db:migrate       # 마이그레이션 실행
pnpm db:seed          # 시드 데이터 삽입
pnpm db:studio        # Prisma Studio 실행

# 타입 체크
pnpm -r type-check    # 전체 워크스페이스 타입 체크
```

---

## 로컬 개발 환경

### 인프라 (Docker Compose)

```bash
docker compose up -d   # PostgreSQL 16 + Redis 7 실행
```

- PostgreSQL: `localhost:5432` (DB: `highend_fashion_mall`, user/pw: `postgres`)
- Redis: `localhost:6379`

### 환경변수

`.env.example` 참조. 필수 변수:
- `DATABASE_URL` — PostgreSQL 연결 문자열
- `NEXTAUTH_SECRET` — 인증 시크릿
- `NEXTAUTH_URL` — 웹 앱 URL (기본 `http://localhost:3000`)
- `REDIS_URL` — Redis 연결 문자열

---

## 아키텍처 핵심 사항

### tRPC 라우터 (packages/api)

`appRouter`에 등록된 라우터:
`product`, `brand`, `auth`, `wishlist`, `cart`, `order`, `collection`, `address`, `review`, `profile`

### Prisma 스키마 (packages/db)

주요 모델: `Brand`, `Product`, `ProductVariant`, `Collection`, `Customer`, `Order`, `Review`, `WishlistItem`, `CartItem`, `Address`, `Recommendation`, `Campaign`

- 브랜드 티어: `HERITAGE | MODERN | CONTEMPORARY | STREETLUXURY`
- VIP 티어: `PLATINUM | GOLD | SILVER | STANDARD`
- 상품 카테고리: `BAGS | RTW | SHOES | ACCESSORIES | JEWELRY | BEAUTY`
- 통화: `KRW | USD | EUR | JPY`

### 웹 앱 라우트 그룹 (apps/web)

- `(customer)/` — 고객 대면 페이지 (홈, 상품, 브랜드, 컬렉션, 장바구니, 위시리스트, 결제, 계정)
- `(admin)/dashboard/` — 관리자 대시보드 (상품, 주문, 리뷰, 고객, 캠페인, 이탈 분석, 설정)
- `api/agents/` — AI 에이전트 엔드포인트 (상품 리스팅, 리뷰 응답, 추천, 디스패치)
- `api/trpc/` — tRPC HTTP 핸들러
- `api/auth/` — NextAuth 핸들러

### 모바일 앱 (apps/mobile)

- Expo Router 기반 파일 시스템 라우팅
- 딥링크 스키마: `maison://`
- 번들 ID: `com.maison.app`
- JWT refresh token rotation 방식 인증 (서버 사이드 `RefreshToken` 모델)

---

## 코딩 컨벤션

- **Next.js 16 주의**: 학습 데이터와 다를 수 있음. 코드 작성 전 `node_modules/next/dist/docs/` 가이드를 반드시 참조
- **불변성 우선**: 객체 직접 변경 금지, 스프레드 연산자로 새 객체 생성
- **Zod 스키마**: 외부 입력 검증에 Zod 사용, 타입은 스키마에서 추론
- **`any` 금지**: `unknown` + 타입 가드 사용
- **함수 50줄 이내**, **파일 800줄 이내**
- **환경변수에 시크릿**: 코드에 API 키/토큰 직접 포함 금지
