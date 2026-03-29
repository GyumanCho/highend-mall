# Task List Phase 2: Highend Fashion Mall

> Phase 1 (Sprint 0-6) 완료. Phase 2는 Sprint 7-12.

## Sprint Overview

| Sprint | Focus | Duration | Key Deliverables |
|--------|-------|----------|-----------------|
| **Sprint 7** | DB + Auth 연동 | 2 weeks | PostgreSQL, Prisma 마이그레이션, NextAuth, Mock→DB 전환 |
| **Sprint 8** | 결제 + 주문 | 2 weeks | Toss/Stripe 연동, 주문 관리, 배송 추적 |
| **Sprint 9** | AI 실제 디스패치 | 2 weeks | BullMQ, Claude API 연동, Admin AI 워크플로우 |
| **Sprint 10** | 이탈 감지 + 리텐션 | 1 week | 이탈 스코어링, 자동 리텐션 캠페인, 알림 |
| **Sprint 11** | 검색 + 계정 심화 | 2 weeks | Algolia, 자동 태깅, 주문내역/주소/프로필 페이지 |
| **Sprint 12** | 통합 테스트 + 런칭 | 1 week | E2E 확장, 성능, 보안 최종 감사 |

Total: **~10 weeks**

---

## Sprint 7: DB + Auth (P0)

### S7-1: Docker Compose + PostgreSQL
- [ ] `docker-compose.yml` (PostgreSQL 16 + Redis 7)
- [ ] Prisma 마이그레이션 실행 (`prisma migrate dev`)
- [ ] 시드 데이터 투입 (`prisma/seed.ts`)
- [ ] `prisma studio` 동작 확인

### S7-2: Mock → Prisma 전환
- [ ] `src/lib/mock-data.ts` → Prisma 쿼리 서비스로 교체
- [ ] 상품 목록/상세 페이지 Prisma 연결
- [ ] 브랜드 목록/상세 페이지 Prisma 연결
- [ ] 컬렉션 페이지 Prisma 연결
- [ ] tRPC 라우터 실제 DB 쿼리 연결

### S7-3: NextAuth 인증
- [ ] Google OAuth 설정 + 콜백
- [ ] Kakao OAuth 설정 + 콜백
- [ ] 로그인/로그아웃 UI
- [ ] 세션 기반 VIP 등급 로드 (하드코딩 제거)
- [ ] Admin 역할 미들웨어 (`/dashboard` 접근 제어)
- [ ] Prisma Adapter 연결 (세션 DB 저장)

### S7-4: 계정 서브페이지
- [ ] `/account/orders` — 주문 내역 (DB 쿼리)
- [ ] `/account/addresses` — 주소록 CRUD
- [ ] `/account/preferences` — 알림/언어 설정
- [ ] `/account/size-profile` — 사이즈 프로필 관리

---

## Sprint 8: 결제 + 주문 (P0)

### S8-1: 결제 연동
- [ ] Toss Payments SDK 연동 (카드, 간편결제)
- [ ] Stripe 연동 (해외 결제)
- [ ] 결제 위젯 체크아웃 페이지 통합
- [ ] 결제 성공/실패 콜백 처리
- [ ] Webhook 수신 (`/api/webhooks/toss`, `/api/webhooks/stripe`)

### S8-2: 주문 파이프라인
- [ ] 장바구니 → 주문 생성 (DB 저장)
- [ ] 재고 확인 + 차감 로직
- [ ] 주문 확인 이메일 (Resend)
- [ ] 주문 번호 생성 규칙 (`MSN-YYYYMMDD-XXXX`)

### S8-3: 주문 관리 + 배송
- [ ] Admin 주문 목록/상세 페이지
- [ ] 주문 상태 변경 워크플로우 (PENDING → PAID → PROCESSING → SHIPPED → DELIVERED)
- [ ] 배송 추적 번호 입력 + 고객 알림
- [ ] 반품/교환 요청 접수 + 처리

### S8-4: 주문 이상 감지 (UC-P2-02)
- [ ] 배송 지연 자동 감지 (SLA 기준 초과)
- [ ] 결제 실패 알림 파이프라인
- [ ] customer-sentinel 에이전트 트리거 연동
- [ ] Admin에 이상 알림 대시보드 위젯

---

## Sprint 9: AI 실제 디스패치 (P0)

### S9-1: 큐 인프라
- [ ] BullMQ 설정 (Redis-backed)
- [ ] 큐 5개 생성 (product-listing, review-response, recommendation, campaign, search-optimization)
- [ ] Worker 프로세스 설정
- [ ] 재시도 정책 (3회, exponential backoff)

### S9-2: Claude Agent SDK 연동
- [ ] Anthropic API 클라이언트 설정
- [ ] 에이전트 디스패치 함수 (agent definition → API 호출)
- [ ] 파이프라인 오케스트레이션 (순차 실행, 결과 전달)
- [ ] AgentJob DB 상태 관리 (QUEUED → PROCESSING → COMPLETED/FAILED)

### S9-3: Admin AI 워크플로우 (UC-P2-01)
- [ ] "New Product (AI Pipeline)" 버튼 → 입력 폼 → API 호출 → 진행 상태
- [ ] "Trigger AI Analysis" 리뷰 버튼 → customer-sentinel 디스패치
- [ ] "Generate with AI" 캠페인 버튼 → campaign-manager 디스패치
- [ ] AI 결과 미리보기 + 승인/수정/거절 워크플로우
- [ ] 실시간 진행 상태 (SSE or polling)

### S9-4: Admin 필터 + 인터랙션
- [ ] 리뷰 필터 동작 (상태별, 감성별, 등급별)
- [ ] 고객 필터 동작 (등급별, 이탈 위험별)
- [ ] 리뷰 인라인 수정 에디터
- [ ] 캠페인 수정/일정 변경

---

## Sprint 10: 이탈 감지 + 리텐션 (P1)

### S10-1: 이탈 스코어링 (UC-P2-03)
- [ ] Nightly cron job: 전체 고객 이탈 스코어 계산
- [ ] vip-profile-analyzer `churn_risk` 모드 연동
- [ ] 위험 고객 대시보드 위젯 (Admin)
- [ ] 이탈 위험 알림 (이메일 → 담당자)

### S10-2: 자동 리텐션 캠페인 (UC-P2-03)
- [ ] 이탈 위험 → 자동 리텐션 캠페인 생성 파이프라인
- [ ] campaign-manager `retention` 모드 연동
- [ ] 리텐션 캠페인 승인 큐 (Admin)
- [ ] 이메일 실제 발송 (Resend)
- [ ] 리텐션 성과 추적 (재방문/재구매 within 14d)

### S10-3: 알림 시스템
- [ ] 이메일 템플릿 (주문 확인, 배송 알림, 리뷰 응답, 캠페인)
- [ ] 앱 내 알림 센터 (Header 벨 아이콘)
- [ ] 알림 읽음/안읽음 상태
- [ ] 고객 채널 선호도 반영

---

## Sprint 11: 검색 + 계정 심화 (P2)

### S11-1: Algolia 검색 (UC-P2-04)
- [ ] Algolia 인덱스 설정
- [ ] 상품 데이터 동기화 (Prisma → Algolia)
- [ ] 검색 UI (자동완성, 인스턴트 결과, 패싯 필터)
- [ ] 한국어/영어 검색 지원

### S11-2: 자동 태깅 (UC-P2-04)
- [ ] 기존 상품 일괄 태깅 (product-curator `search_optimization` 모드)
- [ ] 신규 상품 등록 시 자동 태깅 파이프라인
- [ ] 태그 품질 모니터링

### S11-3: 이미지 시스템
- [ ] S3 + CloudFront 설정
- [ ] 이미지 업로드 API
- [ ] Next/Image 최적화 (AVIF/WebP)
- [ ] 상품 이미지 갤러리 (줌, 스와이프)
- [ ] Placeholder shimmer 로딩

### S11-4: Admin 설정
- [ ] 브랜드 캐노니컬 이름 관리
- [ ] VIP 등급 기준 금액 설정
- [ ] AI 에이전트 설정 (모델/파라미터)
- [ ] 이메일 템플릿 관리

---

## Sprint 12: 통합 + 런칭 (Final)

### S12-1: E2E 테스트 확장
- [ ] 인증 플로우 테스트
- [ ] 결제 플로우 테스트 (테스트 모드)
- [ ] AI 파이프라인 E2E (상품 등록 → AI → 승인 → 퍼블리시)
- [ ] 이탈 감지 → 리텐션 E2E
- [ ] 커버리지 80%+ 달성

### S12-2: 성능 + 보안
- [ ] Lighthouse 90+ (모든 고객 페이지)
- [ ] OWASP Top 10 점검
- [ ] API rate limiting 검증
- [ ] PII 암호화 검증
- [ ] Dependency audit

### S12-3: 배포
- [ ] Production 환경 구성 (DB, Redis, Algolia, S3)
- [ ] Vercel 배포 + 도메인 설정
- [ ] Sentry 에러 모니터링
- [ ] 소프트 런칭 (VIP 초대)

---

## Agent Team Summary (Phase 2 Final)

| # | Agent | Phase 1 역할 | Phase 2 추가 역할 |
|---|-------|-------------|-----------------|
| 1 | fashion-mall-orchestrator | 5 워크플로우 | +5 워크플로우 (총 10) |
| 2 | luxury-product-curator | 상품 검증/정규화 | +검색 태그 자동 생성 |
| 3 | luxury-content-creator | 프리미엄 콘텐츠 | +SEO 키워드 확장 |
| 4 | vip-profile-analyzer | 고객 프로필 분석 | +이탈 스코어링 |
| 5 | style-recommender | 개인화 추천 | +리텐션 추천 |
| 6 | luxury-campaign-manager | VIP 캠페인 | +자동 리텐션 캠페인 |
| 7 | **customer-sentinel** (NEW) | — | 리뷰+주문+행동 통합 감시 |
| 8 | luxury-qa-guardian | 품질 게이트 | +주문 이상 검증 |
