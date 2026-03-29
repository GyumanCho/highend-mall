# Production 배포 TODO

> 현재 상태: 32 routes, 8 AI agents, 18 E2E tests passing
> 예상 소요: 4주 (Phase A-D)

---

## Phase A: 인프라 + DB (Week 1)

### A-1: 데이터베이스 설정
- [ ] Managed PostgreSQL 선택 및 생성 (Supabase / Neon / AWS RDS)
- [ ] `DATABASE_URL` 환경변수 설정
- [ ] `pnpm db:migrate` — Prisma 스키마 16개 모델 생성
- [ ] `pnpm db:seed` — 시드 데이터 투입 (5 브랜드, 5 상품)
- [ ] Prisma Studio 동작 확인 (`pnpm db:studio`)

### A-2: Redis 설정
- [ ] Managed Redis 선택 및 생성 (Upstash / AWS ElastiCache)
- [ ] `REDIS_URL` 환경변수 설정
- [ ] 연결 테스트

### A-3: Mock → Prisma 전환
- [ ] `src/lib/mock-data.ts` → Prisma 쿼리 서비스로 교체
- [ ] 상품 목록 페이지 (`/products`) Prisma 연결
- [ ] 상품 상세 페이지 (`/products/:slug`) Prisma 연결
- [ ] 브랜드 목록/상세 페이지 Prisma 연결
- [ ] 컬렉션 페이지 Prisma 연결
- [ ] 리뷰 데이터 Prisma 연결
- [ ] tRPC 라우터 실제 DB 쿼리 연결
- [ ] Mock 파일 deprecated 표시 또는 제거

### A-4: Vercel 초기 배포
- [ ] Vercel 프로젝트 생성 + GitHub 연결
- [ ] 환경변수 설정 (DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL)
- [ ] `NEXTAUTH_SECRET` 생성 (`openssl rand -base64 32`)
- [ ] 첫 배포 확인 (`vercel deploy`)
- [ ] 커스텀 도메인 연결 + SSL 확인

### A-5: CI/CD
- [ ] GitHub Actions 워크플로우 생성 (lint → test → build)
- [ ] PR 머지 시 자동 배포 설정
- [ ] E2E 테스트 CI 실행 설정

---

## Phase B: 인증 + 결제 (Week 2)

### B-1: OAuth 소셜 로그인
- [ ] Google Cloud Console에서 OAuth 클라이언트 생성
- [ ] `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` 설정
- [ ] Kakao Developers에서 앱 생성
- [ ] `KAKAO_CLIENT_ID`, `KAKAO_CLIENT_SECRET` 설정
- [ ] NextAuth `config.ts`에 Google + Kakao provider 추가
- [ ] 로그인 페이지 소셜 버튼 활성화 (disabled 제거)
- [ ] Prisma Adapter 연결 (세션 DB 저장)
- [ ] 로그인 → 세션 → VIP 등급 로드 검증

### B-2: Admin 접근 제어
- [ ] 미들웨어 auth 검증 활성화 (production 모드)
- [ ] admin/super_admin 역할 DB 관리
- [ ] `/dashboard` 접근 시 role 체크 구현
- [ ] 비인가 접근 시 리다이렉트 확인

### B-3: Toss Payments 연동
- [ ] Toss Payments 가맹점 등록
- [ ] `TOSS_PAYMENTS_SECRET_KEY`, `TOSS_PAYMENTS_CLIENT_KEY` 설정
- [ ] Toss Payments SDK 설치 및 결제 위젯 삽입
- [ ] 체크아웃 페이지 카드 입력 → Toss 위젯으로 교체
- [ ] 결제 성공 콜백 처리 (주문 상태 → PAID)
- [ ] 결제 실패 처리 (에러 표시, 재시도)
- [ ] Webhook 엔드포인트 (`/api/webhooks/toss`) 구현
- [ ] 환불 API 연동

### B-4: Stripe 연동
- [ ] Stripe 계정 생성 + API 키 발급
- [ ] `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY` 설정
- [ ] Stripe Elements 결제 위젯 삽입
- [ ] 해외 결제 (USD, EUR) 처리
- [ ] Webhook 엔드포인트 (`/api/webhooks/stripe`) 구현

### B-5: 주문 파이프라인 실제 연결
- [ ] 장바구니 → 주문 생성 (DB 저장, Zustand → Prisma)
- [ ] 재고 확인 + 차감 로직 구현
- [ ] 주문 번호 생성 규칙 (`MSN-YYYYMMDD-XXXX`)
- [ ] 주문 상태 변경 트리거 (Admin → PROCESSING → SHIPPED)
- [ ] 배송 추적 번호 연동

### B-6: 이메일 기본 연동
- [ ] Resend 계정 생성 + API 키 발급
- [ ] `RESEND_API_KEY` 설정
- [ ] 이메일 발송 서비스 (`src/lib/email/`) 생성
- [ ] 주문 확인 이메일 템플릿
- [ ] 배송 상태 변경 이메일 템플릿
- [ ] 테스트 발송 확인

---

## Phase C: AI + 검색 (Week 3)

### C-1: Anthropic API 연동
- [ ] Anthropic API 키 발급
- [ ] `ANTHROPIC_API_KEY` 설정
- [ ] `src/lib/agents/dispatcher.ts` mock → 실제 API 호출로 교체
- [ ] 에이전트 프롬프트 전달 로직 (agent .md → system prompt)
- [ ] 에이전트 결과 파싱 (YAML output → structured data)
- [ ] AgentJob DB 상태 관리 연결

### C-2: BullMQ 큐 설정
- [ ] BullMQ 설치 (`pnpm add bullmq`)
- [ ] 큐 5개 생성 (product-listing, review-response, recommendation, campaign, search-optimization)
- [ ] Worker 프로세스 설정
- [ ] 재시도 정책 (3회, exponential backoff)
- [ ] 큐 모니터링 대시보드 (Bull Board 또는 Admin 위젯)

### C-3: AI 파이프라인 실제 검증
- [ ] 상품 리스팅 파이프라인 E2E (실제 Claude 호출)
- [ ] 리뷰 분석 파이프라인 E2E
- [ ] 캠페인 생성 파이프라인 E2E
- [ ] 이탈 감지 파이프라인 E2E
- [ ] QA Guardian 검증 실동작 확인
- [ ] 실패 시 재시도 + Admin 알림 확인

### C-4: Algolia 검색 연동
- [ ] Algolia 계정 생성 + 인덱스 생성
- [ ] `ALGOLIA_APP_ID`, `ALGOLIA_API_KEY` 설정
- [ ] 상품 데이터 → Algolia 인덱스 동기화 파이프라인
- [ ] 검색 모달 → Algolia InstantSearch 컴포넌트로 교체
- [ ] 패싯 필터 (브랜드, 카테고리, 가격대, 소재) 설정
- [ ] 한국어 형태소 분석 설정 (nori)
- [ ] 자동완성 설정
- [ ] 상품 변경 시 인덱스 자동 동기화

### C-5: S3 이미지 시스템
- [ ] AWS S3 버킷 생성
- [ ] CloudFront 배포 설정
- [ ] `AWS_S3_BUCKET`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_CLOUDFRONT_DOMAIN` 설정
- [ ] 이미지 업로드 API (`/api/upload`) 구현
- [ ] Admin 상품 등록 시 이미지 업로드 UI
- [ ] Next/Image src → CloudFront URL 연결
- [ ] ImagePlaceholder → 실제 이미지 로딩으로 전환
- [ ] 실제 상품 이미지 업로드 (브랜드별)

### C-6: 이메일 확장
- [ ] 리뷰 응답 이메일 템플릿
- [ ] 캠페인 이메일 템플릿 (등급별 차별화)
- [ ] 리텐션 캠페인 이메일 발송
- [ ] 이탈 위험 알림 이메일 (내부 담당자)
- [ ] 알림 채널 선호도 반영 (이메일/SMS 분기)

---

## Phase D: 보안 + 런칭 (Week 4)

### D-1: 보안 감사
- [ ] OWASP Top 10 전체 점검
- [ ] XSS 방지 확인 (사용자 입력 sanitize)
- [ ] SQL 인젝션 방지 확인 (Prisma 파라미터 바인딩)
- [ ] CSRF 보호 확인 (NextAuth 내장)
- [ ] CSP (Content-Security-Policy) 헤더 추가
- [ ] CORS 허용 오리진 제한
- [ ] API Rate Limiting 실제 구현 (Redis counter)
- [ ] PII 암호화 (고객 이름, 이메일, 전화번호, 주소)
- [ ] 환경변수 노출 점검 (클라이언트 번들에 서버 키 없는지)
- [ ] Dependency 보안 스캔 (`pnpm audit`)

### D-2: VIP 등급 자동화
- [ ] Nightly cron job → 전체 고객 연간 소비 기준 등급 재계산
- [ ] 등급 변경 시 알림 (승급: 축하 이메일, 강등: 조용히)
- [ ] Account 페이지 세션 기반 등급 표시 (하드코딩 제거)
- [ ] 홈페이지 VIP 배너 세션 기반 등급 연동

### D-3: 성능 최적화
- [ ] Lighthouse 90+ (모든 고객 페이지)
- [ ] Core Web Vitals (LCP < 2.5s, FID < 100ms, CLS < 0.1)
- [ ] 이미지 최적화 (AVIF/WebP, lazy loading, responsive)
- [ ] API 응답 시간 < 200ms (P95)
- [ ] 추천 캐시 프리워밍 (로그인 시 비동기 생성)
- [ ] 정적 페이지 ISR 설정 (브랜드, 컬렉션)

### D-4: 모니터링
- [ ] Sentry 설치 + `SENTRY_DSN` 설정
- [ ] 에러 알림 (Slack/Email)
- [ ] PostHog 설치 + `POSTHOG_KEY` 설정
- [ ] 핵심 이벤트 추적 (상품 조회, 장바구니 추가, 결제, 리뷰 작성)
- [ ] AI 파이프라인 성공/실패율 모니터링
- [ ] Uptime 모니터링 설정

### D-5: 실데이터 투입
- [ ] 실제 럭셔리 브랜드 파트너 계약 확인
- [ ] 브랜드별 상품 데이터 정리 (CSV/JSON)
- [ ] AI 리스팅 파이프라인으로 일괄 등록
- [ ] 상품 이미지 S3 업로드
- [ ] 검색 인덱스 동기화 확인
- [ ] 브랜드 스토리 AI 생성 + 검수

### D-6: 소프트 런칭
- [ ] 내부 팀 테스트 (전체 구매 플로우)
- [ ] VIP 초대 (Platinum 10명 → Gold 50명)
- [ ] 피드백 수집 + 긴급 수정
- [ ] 전체 오픈

---

## Phase E: Post-Launch (이후)

### 기능 고도화
- [ ] 모바일 네이티브 앱 (React Native)
- [ ] AR 가상 피팅 (Apple ARKit / 8th Wall)
- [ ] 라이브 스트리밍 쇼핑
- [ ] 인증 리셀 통합 (The RealReal 모델)
- [ ] 지속가능성 공급망 투명성
- [ ] 다국어 (일본어, 중국어)
- [ ] SMS 알림 (Twilio)
- [ ] 앱 내 채팅 (AI + 상담원 전환)

### 데이터 고도화
- [ ] A/B 테스트 프레임워크
- [ ] 추천 엔진 고도화 (협업 필터링 + 지식 그래프)
- [ ] LTV 예측 모델
- [ ] 캠페인 ROI 자동 분석
- [ ] 브랜드별 사이즈 변환 매트릭스 정교화

---

## 환경변수 체크리스트

```bash
# ═══ 필수 (Phase A) ═══
DATABASE_URL=              # Managed PostgreSQL URL
NEXTAUTH_SECRET=           # openssl rand -base64 32
NEXTAUTH_URL=              # https://your-domain.com

# ═══ 인증 (Phase B) ═══
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
KAKAO_CLIENT_ID=
KAKAO_CLIENT_SECRET=

# ═══ 결제 (Phase B) ═══
TOSS_PAYMENTS_SECRET_KEY=
TOSS_PAYMENTS_CLIENT_KEY=
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=

# ═══ AI (Phase C) ═══
ANTHROPIC_API_KEY=

# ═══ 검색 (Phase C) ═══
ALGOLIA_APP_ID=
ALGOLIA_API_KEY=
ALGOLIA_SEARCH_KEY=

# ═══ 스토리지 (Phase C) ═══
AWS_S3_BUCKET=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_CLOUDFRONT_DOMAIN=

# ═══ 이메일 (Phase B-C) ═══
RESEND_API_KEY=

# ═══ 캐시 (Phase A) ═══
REDIS_URL=

# ═══ 모니터링 (Phase D) ═══
SENTRY_DSN=
POSTHOG_KEY=
```
