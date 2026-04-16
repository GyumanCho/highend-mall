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

## 모바일 개발 (Android 에뮬레이터)

### 환경 설정

- **Android SDK 경로**: `~/Library/Android/sdk` (`ANDROID_HOME` 환경변수 미설정 상태 — 명령 실행 시 직접 export 필요)
- **에뮬레이터**: `Galaxy_S26`, `Pixel_Fold_API_35`
- **adb 경로**: `$ANDROID_HOME/platform-tools/adb`

### Expo dev server 실행 (필수 절차)

**Expo는 인터랙티브 TTY가 필수**. `nohup`, `&`, `script`, `expect` 등 백그라운드 실행은 모두 실패한다. 반드시 `tmux`를 사용할 것.

```bash
# 1. 인프라 시작
docker compose up -d                    # PostgreSQL + Redis
pnpm web:dev > /tmp/maison-web.log 2>&1 &  # 웹/API (백그라운드 가능)

# 2. 에뮬레이터 부팅
export ANDROID_HOME=~/Library/Android/sdk
$ANDROID_HOME/emulator/emulator -avd Galaxy_S26 &

# 3. 부팅 완료 대기
until $ANDROID_HOME/platform-tools/adb shell getprop sys.boot_completed 2>/dev/null | grep -q "1"; do sleep 2; done

# 4. ADB 포트 포워딩 (필수! 에뮬레이터→호스트 통신)
$ANDROID_HOME/platform-tools/adb reverse tcp:8081 tcp:8081
$ANDROID_HOME/platform-tools/adb reverse tcp:3000 tcp:3000

# 5. Metro를 tmux 세션에서 시작
tmux new-session -d -s expo -c apps/mobile \
  "export ANDROID_HOME=~/Library/Android/sdk && export PATH=\$ANDROID_HOME/platform-tools:\$PATH && pnpm exec expo start --android --port 8081"

# 6. Expo Go 로그인 프롬프트 처리 (초기 1회)
# tmux에서 "Log in / Proceed anonymously" 프롬프트가 뜨면:
tmux send-keys -t expo Down Enter
```

### 주의사항 (시행착오 정리)

| 문제 | 원인 | 해결 |
|------|------|------|
| Metro가 즉시 종료 | `nohup`, `script`, `expect` 등은 Expo의 TTY 감지를 속이지 못함 | **tmux** 세션 사용 |
| 앱 로딩 스피너 무한 | 에뮬레이터가 호스트 Metro에 연결 못 함 | `adb reverse tcp:8081 tcp:8081` 포트 포워딩 |
| Expo Go "Something went wrong" | Metro가 죽은 후 앱이 재연결 실패 | Metro 재시작 후 `adb shell am start -a android.intent.action.VIEW -d "exp://localhost:8081" host.exp.exponent` |
| 이전 코드가 캐시로 남음 | Metro 캐시에 이전 번들 잔존 | `--clear` 플래그 + `adb shell pm clear host.exp.exponent` |
| "Input is required" 에러 | 비인터랙티브 모드에서 포트 충돌 등 프롬프트 발생 | 기존 Metro 프로세스 kill 후 재시작: `kill $(lsof -t -i:8081)` |
| Expo Go 로그인 프롬프트 | 초기 실행 시 로그인 요구 | tmux에서 `Down Enter` 키 전송으로 "Proceed anonymously" 선택 |
| Worktree에서 web 500 에러 | `.env` 파일과 `node_modules` 심링크가 worktree에 없음 | Worktree에서 웹 서버 실행 시 `pnpm install` + `.env` 복사 필요 |
| `prisma migrate dev` 실패 (exit 130) | 인터랙티브 프롬프트가 필요한 명령 | `pnpm exec prisma migrate deploy` 사용 (비인터랙티브) |
| `node` / `npx` 명령 무한 루프 | nvm lazy loading과 충돌 | `pnpm exec` 로 실행하거나 `lsof`, `find` 등 시스템 명령 활용 |

### tmux 세션 관리

```bash
tmux attach -t expo     # Metro 로그 확인
# Ctrl+B D              # detach (Metro는 계속 실행)
tmux kill-session -t expo  # 세션 종료
```

---

## 코딩 컨벤션

- **Next.js 16 주의**: 학습 데이터와 다를 수 있음. 코드 작성 전 `node_modules/next/dist/docs/` 가이드를 반드시 참조
- **불변성 우선**: 객체 직접 변경 금지, 스프레드 연산자로 새 객체 생성
- **Zod 스키마**: 외부 입력 검증에 Zod 사용, 타입은 스키마에서 추론
- **`any` 금지**: `unknown` + 타입 가드 사용
- **함수 50줄 이내**, **파일 800줄 이내**
- **환경변수에 시크릿**: 코드에 API 키/토큰 직접 포함 금지
