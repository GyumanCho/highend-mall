# 배포 가이드 (Web / Mobile)

Maison 플랫폼의 웹(Next.js)과 모바일(Expo/EAS) 배포 절차를 정리한 문서.

> ℹ️ Maison 코드베이스는 [biz-harness](https://github.com/GyumanCho/biz-harness) Claude Code 플러그인으로 생성된 결과물입니다. 본 가이드는 그 산출물을 운영 환경에 배포하는 절차입니다.

---

## 목차

1. [공통 사전 준비](#공통-사전-준비)
2. [웹(Next.js) 배포](#웹nextjs-배포)
   - [Vercel 배포 (권장)](#vercel-배포-권장)
   - [Docker 셀프호스팅](#docker-셀프호스팅)
3. [모바일(Expo/EAS) 배포](#모바일expoeas-배포)
   - [최초 설정](#최초-설정)
   - [빌드 프로필](#빌드-프로필)
   - [스토어 제출](#스토어-제출)
   - [OTA 업데이트](#ota-업데이트)
4. [환경별 시크릿 관리](#환경별-시크릿-관리)
5. [릴리스 체크리스트](#릴리스-체크리스트)
6. [롤백 전략](#롤백-전략)

---

## 공통 사전 준비

| 항목 | 값/명령 |
|---|---|
| Node.js | `>= 20` |
| 패키지 매니저 | `pnpm@9.15.0` |
| Git 원격 | `git@github.com:GyumanCho/highend-mall.git` |
| 운영 DB | PostgreSQL 16 (관리형 권장: Supabase / Neon / RDS) |
| 캐시 | Redis 7 (Upstash / ElastiCache) |
| 모니터링 | Sentry, Vercel Analytics, EAS Insights |

운영 환경 이전에 반드시:
```bash
pnpm install --frozen-lockfile
pnpm -r type-check
pnpm lint
pnpm test
pnpm test:e2e   # 운영 머지 전 1회 이상
```

---

## 웹(Next.js) 배포

### Vercel 배포 (권장)

Next.js 16의 RSC/PPR/ISR을 즉시 활용 가능.

#### 1. 프로젝트 생성

1. https://vercel.com → **Add New Project**
2. GitHub 저장소 `GyumanCho/highend-mall` 선택
3. **Import** → Configure Project

#### 2. 프로젝트 설정

| 필드 | 값 |
|---|---|
| Framework Preset | `Next.js` |
| Root Directory | `apps/web` |
| Build Command | `cd ../.. && pnpm build --filter=@repo/web` |
| Install Command | `cd ../.. && pnpm install --frozen-lockfile` |
| Output Directory | `.next` (기본값 유지) |
| Node.js Version | `20.x` |

> **모노레포 팁**: Vercel은 `apps/web` 안에서 명령을 실행하므로 `cd ../..`로 루트 이동 후 pnpm 명령을 실행해야 워크스페이스 패키지가 해석됨.

#### 3. 환경 변수 등록

Vercel Dashboard → Settings → Environment Variables. 환경별로 분리:

| 변수 | Production | Preview | Development |
|---|---|---|---|
| `DATABASE_URL` | 운영 DB | 스테이징 DB | 로컬 DB |
| `REDIS_URL` | Upstash 운영 | Upstash 프리뷰 | `redis://localhost:6379` |
| `NEXTAUTH_SECRET` | (32+ bytes 랜덤) | (별도) | (별도) |
| `NEXTAUTH_URL` | `https://maison.co.kr` | `https://*.vercel.app` | `http://localhost:3000` |
| `JWT_ACCESS_SECRET` | (별도) | (별도) | (별도) |
| `JWT_REFRESH_SECRET` | (별도) | (별도) | (별도) |

#### 4. Prisma 빌드 단계

`apps/web/package.json`의 `build` 스크립트가 Prisma Client 생성을 보장해야 함:

```json
{
  "scripts": {
    "build": "pnpm --filter @repo/db db:generate && next build"
  }
}
```

또는 루트 turbo 파이프라인이 `@repo/db#db:generate`를 `@repo/web#build`의 의존성으로 등록.

#### 5. 도메인 연결

1. Vercel → Settings → Domains → `maison.co.kr` 추가
2. DNS 레코드(A `76.76.21.21` 또는 CNAME) 등록
3. SSL 자동 발급 확인

#### 6. 배포 트리거

- `main` 브랜치 푸시 → **Production** 배포
- 그 외 브랜치 → **Preview** 배포 (PR마다 고유 URL)

---

### Docker 셀프호스팅

Vercel 외 환경(Cloud Run, Fly.io, K8s)에서 운영할 때.

#### Dockerfile 예시 (`apps/web/Dockerfile`)

```dockerfile
# syntax=docker/dockerfile:1.7
FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate
WORKDIR /repo

FROM base AS deps
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json turbo.json ./
COPY apps/web/package.json apps/web/
COPY packages/api/package.json packages/api/
COPY packages/db/package.json packages/db/
COPY packages/shared/package.json packages/shared/
COPY packages/design-tokens/package.json packages/design-tokens/
RUN pnpm install --frozen-lockfile

FROM deps AS build
COPY . .
RUN pnpm --filter @repo/db db:generate \
 && pnpm build --filter=@repo/web

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /repo/apps/web/.next/standalone ./
COPY --from=build /repo/apps/web/.next/static ./apps/web/.next/static
COPY --from=build /repo/apps/web/public ./apps/web/public
EXPOSE 3000
CMD ["node", "apps/web/server.js"]
```

> `next.config.ts`에 `output: "standalone"` 설정 필요.

#### 빌드 & 실행

```bash
docker build -f apps/web/Dockerfile -t maison-web:$(git rev-parse --short HEAD) .
docker run -p 3000:3000 --env-file .env.production maison-web:<tag>
```

---

## 모바일(Expo/EAS) 배포

iOS/Android는 **EAS Build**로 빌드, **EAS Submit**으로 스토어 업로드, **EAS Update**로 OTA.

### 최초 설정

```bash
# 1. EAS CLI 설치
npm i -g eas-cli

# 2. Expo 계정 로그인
eas login

# 3. 프로젝트 연결 (apps/mobile에서 실행)
cd apps/mobile
eas init                    # app.json의 expo.extra.eas.projectId 채워짐
eas build:configure         # iOS/Android 자격증명 자동 구성
```

연결 후 `app.json` 보강:

```json
{
  "expo": {
    "ios": { "bundleIdentifier": "com.maison.app" },
    "android": { "package": "com.maison.app" },
    "updates": {
      "url": "https://u.expo.dev/<your-project-id>",
      "enabled": true,
      "fallbackToCacheTimeout": 3000
    },
    "runtimeVersion": { "policy": "appVersion" },
    "extra": {
      "apiBaseUrl": "https://maison.co.kr",
      "eas": { "projectId": "<your-project-id>" }
    },
    "plugins": [
      "expo-router",
      "expo-secure-store",
      "expo-asset",
      "expo-font",
      "expo-image",
      ["expo-notifications", { "icon": "./assets/icon.png", "color": "#2d2926" }],
      "expo-updates"
    ]
  }
}
```

### 빌드 프로필

`apps/mobile/eas.json`에 이미 정의된 프로필:

| 프로필 | 용도 | distribution | 채널 |
|---|---|---|---|
| `development` | Dev Client (디버그 빌드, 시뮬레이터 포함) | internal | — |
| `preview` | 내부 QA (TestFlight / Play Internal) | internal | `preview` |
| `production` | 스토어 출시 (autoIncrement build no.) | store | `production` |

#### 빌드 명령

```bash
cd apps/mobile

# 개발용 (시뮬레이터에서 디버그)
eas build --profile development --platform ios
eas build --profile development --platform android

# 내부 QA (TestFlight / Play Internal Track)
eas build --profile preview --platform all

# 운영 빌드
eas build --profile production --platform all
```

빌드 진행 상황은 https://expo.dev/accounts/<org>/projects/<project>/builds 에서 확인.

### 스토어 제출

`apps/mobile/eas.json`의 `submit.production` 섹션을 채워야 함:

```json
{
  "submit": {
    "production": {
      "ios": {
        "appleId": "owner@maison.co.kr",
        "ascAppId": "1234567890",
        "appleTeamId": "ABCDE12345"
      },
      "android": {
        "serviceAccountKeyPath": "./google-play-service-account.json",
        "track": "internal"
      }
    }
  }
}
```

> **주의**: `serviceAccountKeyPath`는 절대 커밋 금지. `.gitignore`에 추가하고 CI에서는 EAS Secret으로 주입.

#### 제출 명령

```bash
eas submit --profile production --platform ios
eas submit --profile production --platform android
```

iOS 첫 제출은 App Store Connect에서 메타데이터(스크린샷, 설명, 등급) 등록 필요.

### OTA 업데이트

JS/asset만 변경된 경우 스토어 재심사 없이 즉시 배포:

```bash
# 운영 채널로 푸시
eas update --branch production --message "버그 수정: 결제 화면 토스트"

# 프리뷰 채널
eas update --branch preview --message "신규 컬렉션 페이지 검증"
```

**OTA 가능 조건**:
- `expo-updates` 활성화
- `runtimeVersion` 정책이 빌드와 동일 (`appVersion` 권장)
- 네이티브 의존성/권한/플러그인 변경 없음

> 네이티브 변경 시에는 반드시 `eas build` 후 스토어 재제출.

---

## 환경별 시크릿 관리

| 위치 | 도구 | 비고 |
|---|---|---|
| 로컬 | `.env` | 절대 커밋 금지 (`.gitignore`) |
| Vercel | Dashboard → Environment Variables | Production / Preview / Development 분리 |
| EAS Build | `eas secret:create` | 빌드 환경에서 `process.env.*`로 접근 |
| GitHub Actions | Repository Secrets | CI에서 사용 |

EAS Secret 예시:

```bash
eas secret:create --scope project --name SENTRY_AUTH_TOKEN --value sntrys_xxx
eas secret:list
```

---

## 릴리스 체크리스트

### 웹

- [ ] `pnpm test` / `pnpm test:e2e` 통과
- [ ] `pnpm -r type-check` 0 에러
- [ ] Prisma migration 운영 DB 적용 (`prisma migrate deploy`)
- [ ] 환경변수 갱신 확인 (Vercel Production)
- [ ] Sentry 릴리스 태깅
- [ ] 배포 후 홈/상품 상세/장바구니/결제 스모크 테스트

### 모바일

- [ ] `app.json`의 `expo.version` / `ios.buildNumber` / `android.versionCode` 점검
- [ ] 네이티브 변경 여부 확인 → 빌드 vs OTA 결정
- [ ] `eas build --profile production --platform all` 성공
- [ ] TestFlight / Play Internal에서 회귀 테스트
- [ ] 스토어 메타데이터(스크린샷, 변경사항) 업데이트
- [ ] `eas submit` 후 심사 통과 → 단계적 출시(phased release)

---

## 롤백 전략

### 웹

- **Vercel**: Deployments → 이전 성공 빌드 → **Promote to Production** (즉시 롤백, 수초)
- **DB 마이그레이션**: 다운 마이그레이션 스크립트 또는 백업 복원. 파괴적 마이그레이션은 deploy 전 백업 필수.

### 모바일

- **OTA**: `eas update --branch production --republish --group <previous-group-id>`로 이전 업데이트 재게시
- **네이티브 빌드**: 스토어 단계적 출시 비율을 0%로 낮추고 이전 버전 유지. 신규 빌드 긴급 hotfix 배포는 24~48h 소요 가능 → OTA 가능 형태로 핫픽스 설계 권장.

---

## 참고

- Next.js 배포: https://nextjs.org/docs/app/building-your-application/deploying
- Vercel 모노레포: https://vercel.com/docs/monorepos
- EAS Build: https://docs.expo.dev/build/introduction/
- EAS Submit: https://docs.expo.dev/submit/introduction/
- EAS Update: https://docs.expo.dev/eas-update/introduction/
