# Maison — Highend Fashion Mall

럭셔리 패션 이커머스 플랫폼. **웹(Next.js 16)** + **모바일(Expo 55 / React Native)** + **공유 tRPC API** 레이어로 구성된 Turborepo 모노레포.

- 앱 이름: **Maison** (`maison.co.kr`)
- 도메인: 브랜드 큐레이션, VIP 고객 운영, 상품/주문/리뷰, AI 에이전트 파이프라인

> ℹ️ **이 프로젝트는 [biz-harness](https://github.com/GyumanCho/biz-harness) Claude Code 플러그인으로 생성된 결과물입니다.**
> biz-harness가 비즈니스 유스케이스(럭셔리 패션 이커머스)를 분석하여 도메인 모델, tRPC 라우터, 웹/모바일 화면, AI 에이전트 파이프라인을 단계적으로 구성했습니다.
> 동일한 방식의 새 프로젝트를 만들고 싶다면 `claude plugin install biz-harness@biz-harness` 후 `/biz-harness` 스킬을 실행하세요.

---

## 목차

- [빠른 시작](#빠른-시작)
- [기술 스택](#기술-스택)
- [워크스페이스 구조](#워크스페이스-구조)
- [환경 변수](#환경-변수)
- [개발 워크플로우](#개발-워크플로우)
- [데이터베이스](#데이터베이스)
- [배포 가이드](#배포-가이드)
  - [웹(Next.js) 배포](#웹nextjs-배포)
  - [모바일(Expo/EAS) 배포](#모바일expoeas-배포)
- [트러블슈팅](#트러블슈팅)

---

## 빠른 시작

```bash
# 1. 저장소 클론
git clone git@github.com:GyumanCho/highend-mall.git
cd highend-mall

# 2. 의존성 설치 (Node 20+, pnpm 9.15+)
pnpm install

# 3. 인프라 (PostgreSQL 16 + Redis 7)
docker compose up -d

# 4. 환경 변수 설정
cp .env.example .env
# .env 파일을 열어 DATABASE_URL, NEXTAUTH_SECRET 등 채우기

# 5. DB 초기화
pnpm db:generate
pnpm db:migrate
pnpm db:seed

# 6. 개발 서버
pnpm dev              # 전체 (web + mobile + api)
pnpm web:dev          # 웹만 → http://localhost:3000
pnpm mobile:start     # Expo Dev Client (QR로 실기기 연결)
```

---

## 기술 스택

| 영역 | 기술 |
|---|---|
| 모노레포 | Turborepo + pnpm 9.15 |
| 웹 | Next.js 16.2, React 19, Tailwind CSS 4, Framer Motion |
| 모바일 | Expo SDK 55, React Native 0.83, expo-router |
| API | tRPC v11 |
| DB | PostgreSQL 16 + Prisma 6 |
| 인증 | NextAuth 5 (web) / JWT + refresh rotation (mobile) |
| 상태 | Zustand 5, TanStack Query 5 |
| 캐시 | Redis 7 |
| 테스트 | Vitest (단위), Playwright (E2E) |
| 언어/런타임 | TypeScript 5.9, Node.js ≥ 20 |

---

## 워크스페이스 구조

```
highend-fashion-mall/
├── apps/
│   ├── web/          # @repo/web — Next.js 16 웹 프론트
│   └── mobile/       # @repo/mobile — Expo 55 모바일 앱
├── packages/
│   ├── api/          # @repo/api — tRPC 라우터 (서버 로직)
│   ├── db/           # @repo/db — Prisma 스키마 + 클라이언트
│   ├── shared/       # @repo/shared — 공유 유틸리티, Zod 스키마
│   └── design-tokens/# @repo/design-tokens — 브랜드/웹/모바일 토큰
└── docs/             # PRD, ARCHITECTURE, DEPLOYMENT 등
```

### tRPC 라우터 (`packages/api`)

`appRouter`에 등록된 라우터:
`product`, `brand`, `auth`, `wishlist`, `cart`, `order`, `collection`, `address`, `review`, `profile`

### Prisma 주요 모델 (`packages/db`)

`Brand`, `Product`, `ProductVariant`, `Collection`, `Customer`, `Order`, `Review`, `WishlistItem`, `CartItem`, `Address`, `Recommendation`, `Campaign`

- **브랜드 티어**: `HERITAGE | MODERN | CONTEMPORARY | STREETLUXURY`
- **VIP 티어**: `PLATINUM | GOLD | SILVER | STANDARD`
- **상품 카테고리**: `BAGS | RTW | SHOES | ACCESSORIES | JEWELRY | BEAUTY`
- **통화**: `KRW | USD | EUR | JPY`

---

## 환경 변수

루트 `.env.example` 참조. 필수:

| 변수 | 설명 | 예시 |
|---|---|---|
| `DATABASE_URL` | PostgreSQL 연결 문자열 | `postgresql://postgres:postgres@localhost:5432/highend_fashion_mall` |
| `REDIS_URL` | Redis 연결 문자열 | `redis://localhost:6379` |
| `NEXTAUTH_SECRET` | NextAuth 세션 서명 키 | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | 웹 앱 URL | `http://localhost:3000` |
| `JWT_ACCESS_SECRET` | 모바일 액세스 토큰 시크릿 | (랜덤 문자열) |
| `JWT_REFRESH_SECRET` | 모바일 리프레시 토큰 시크릿 | (랜덤 문자열) |

> **시크릿 관리**: 코드/저장소에 직접 포함 금지. 운영은 환경변수 또는 Vercel/EAS Secret으로만 주입.

---

## 개발 워크플로우

### 명령어 요약

```bash
# 개발
pnpm dev              # 전체 dev (turbo)
pnpm web:dev          # 웹만
pnpm mobile:start     # Expo

# 검증
pnpm build            # 전체 빌드
pnpm lint             # 린트
pnpm test             # 단위 테스트 (vitest)
pnpm test:e2e         # E2E (playwright)
pnpm -r type-check    # 전체 타입 체크

# DB
pnpm db:generate      # Prisma 클라이언트 생성
pnpm db:migrate       # 마이그레이션 실행
pnpm db:seed          # 시드 데이터
pnpm db:studio        # Prisma Studio
```

### 코딩 컨벤션

- **Next.js 16 주의**: 학습 데이터와 다를 수 있음. 작성 전 `node_modules/next/dist/docs/`의 가이드 확인
- 객체 직접 변경 금지 → 스프레드 연산자로 새 객체 생성 (불변성)
- 외부 입력은 **Zod 스키마**로 검증, 타입은 스키마에서 추론
- `any` 금지 → `unknown` + 타입 가드
- 함수 50줄 이내, 파일 800줄 이내
- 시크릿은 환경변수로만

---

## 데이터베이스

### 로컬 인프라 (Docker Compose)

```bash
docker compose up -d   # PostgreSQL 16 + Redis 7
docker compose down    # 정지
docker compose down -v # 볼륨까지 삭제 (데이터 초기화)
```

기본값: PostgreSQL `localhost:5432` (DB `highend_fashion_mall`, user/pw `postgres`), Redis `localhost:6379`.

### 마이그레이션 흐름

```bash
# 스키마 수정 후
pnpm --filter @repo/db prisma migrate dev --name <이름>

# 운영 배포
pnpm --filter @repo/db prisma migrate deploy
```

---

## 배포 가이드

상세 절차는 [`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md) 참조.

### 웹(Next.js) 배포

권장: **Vercel** (Next.js 16 ISR/RSC 최적). 대안: Docker 컨테이너 → Cloud Run / Fly.io / 자체 K8s.

#### Vercel 빠른 가이드

1. Vercel 프로젝트 생성 → GitHub 저장소 연결
2. **Root Directory**: `apps/web`
3. **Build Command**: `cd ../.. && pnpm build --filter=@repo/web`
4. **Install Command**: `cd ../.. && pnpm install --frozen-lockfile`
5. **Output Directory**: `apps/web/.next`
6. 환경변수 등록: `DATABASE_URL`, `REDIS_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `JWT_*`
7. Production 브랜치: `main` → push 시 자동 배포

> Prisma 사용 시 빌드 단계에서 `prisma generate`가 호출돼야 함. `apps/web/package.json`의 빌드 스크립트가 `pnpm db:generate`를 prebuild로 호출하는지 확인.

### 모바일(Expo/EAS) 배포

EAS Build + Submit으로 iOS/Android 동시 운영. 빌드 프로필은 `apps/mobile/eas.json`에 정의:

| 프로필 | 용도 | 배포 채널 |
|---|---|---|
| `development` | Dev Client (시뮬레이터/실기기 디버그) | — |
| `preview` | 내부 QA (TestFlight/Internal Track) | `preview` |
| `production` | 스토어 출시 | `production` |

#### 사전 준비 (1회)

```bash
# EAS CLI 설치
npm i -g eas-cli
eas login

# 프로젝트 연결
cd apps/mobile
eas init                       # expo.extra.eas.projectId 생성
eas build:configure            # 자격증명(키스토어 등) 자동 구성
```

연결 후 `app.json`의 `expo.extra.eas.projectId`와 `expo.updates.url`을 채워 넣고 커밋.

#### 빌드 & 제출

```bash
cd apps/mobile

# 개발 빌드 (시뮬레이터)
eas build --profile development --platform ios

# 내부 QA 빌드
eas build --profile preview --platform all

# 운영 빌드
eas build --profile production --platform all

# 스토어 제출
eas submit --profile production --platform ios
eas submit --profile production --platform android
```

#### OTA 업데이트 (JS-only 변경)

네이티브 코드 변경이 없으면 EAS Update로 즉시 배포 가능:

```bash
eas update --branch production --message "버그 수정"
```

> `expo-updates`가 활성화되고 `runtimeVersion: { policy: "appVersion" }`이 설정되어 있어야 함. 네이티브 의존성 변경 시에는 반드시 새 빌드 후 스토어 재제출.

---

## 트러블슈팅

| 증상 | 해결 |
|---|---|
| `Prisma Client did not initialize` | `pnpm db:generate` 실행 |
| Vercel 빌드에서 `Cannot find module @repo/*` | Root/Install/Build Command가 모노레포 루트에서 실행되는지 확인 |
| Expo Metro에서 `@repo/*` 미해석 | `metro.config.js`의 `watchFolders` / `nodeModulesPaths`에 워크스페이스 루트 포함 확인 |
| iOS Push 토큰 미수신 | `eas credentials`로 APNs 키 등록, `app.json`의 `ios.bundleIdentifier`와 일치하는지 확인 |
| Android 빌드 실패 (Hermes) | `npx expo install --check`로 SDK 정합성 점검 |

---

## 참고 문서

- [`docs/PRD.md`](./docs/PRD.md) — 제품 요구사항
- [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) — 아키텍처
- [`docs/TECH_SPEC.md`](./docs/TECH_SPEC.md) — 기술 스펙
- [`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md) — 배포 상세
- [`CLAUDE.md`](./CLAUDE.md) — Claude Code 작업 가이드
