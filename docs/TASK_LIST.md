# Task List: Highend Fashion Mall

## Sprint Overview

| Sprint | Focus | Duration | Key Deliverables |
|--------|-------|----------|-----------------|
| **Sprint 0** | Foundation | 1 week | 프로젝트 초기화, DB, Auth |
| **Sprint 1** | 상품 카탈로그 | 2 weeks | 상품 CRUD, 검색, AI 리스팅 파이프라인 |
| **Sprint 2** | 고객 & 주문 | 2 weeks | 고객 프로필, 장바구니, 결제 |
| **Sprint 3** | 개인화 & 추천 | 2 weeks | VIP 프로필 분석, 추천 엔진 |
| **Sprint 4** | 캠페인 & 리뷰 | 2 weeks | 캠페인 관리, 리뷰 시스템 |
| **Sprint 5** | 관리자 & 통합 | 2 weeks | Admin 대시보드, E2E 테스트 |
| **Sprint 6** | 런칭 준비 | 1 week | 성능 최적화, 보안 감사, 배포 |

Total: **~12 weeks (3 months)**

---

## Sprint 0: Foundation (Week 1)

### S0-1: 프로젝트 초기화
- [ ] Next.js 15 프로젝트 생성 (App Router, TypeScript)
- [ ] Tailwind CSS + shadcn/ui 설정
- [ ] ESLint + Prettier 설정
- [ ] Git 브랜치 전략 수립 (main → develop → feature)

### S0-2: 데이터베이스 설정
- [ ] PostgreSQL 로컬 + 클라우드 환경 설정
- [ ] Prisma 초기화 및 스키마 작성 (TECH_SPEC 기반)
- [ ] 초기 마이그레이션 실행
- [ ] 시드 데이터 작성 (브랜드 5개, 상품 20개, 테스트 고객)

### S0-3: 인프라 기초
- [ ] Redis 설정 (로컬 + 클라우드)
- [ ] tRPC 라우터 기본 구조 생성
- [ ] NextAuth 설정 (Google + Kakao)
- [ ] 환경변수 구조 (.env.local, .env.production)
- [ ] CI/CD 파이프라인 (GitHub Actions: lint, test, build)

### S0-4: 디자인 시스템 기초
- [ ] 럭셔리 테마 정의 (컬러 팔레트, 타이포그래피, 간격)
- [ ] 기본 레이아웃 컴포넌트 (Header, Footer, Navigation)
- [ ] shadcn/ui 커스터마이징 (럭셔리 톤)

---

## Sprint 1: 상품 카탈로그 (Weeks 2-3)

### S1-1: 상품 데이터 모델
- [ ] Product, Brand, Collection, ProductVariant CRUD 서비스
- [ ] tRPC product router 구현
- [ ] 상품 이미지 업로드 (S3 + 리사이징)
- [ ] 브랜드 관리 API

### S1-2: 상품 검색
- [ ] Elasticsearch 인덱스 설정 (nori 한국어 분석기)
- [ ] 상품 인덱싱 파이프라인 (Prisma → ES 동기화)
- [ ] 패싯 검색 API (브랜드, 카테고리, 가격대, 소재)
- [ ] 자동완성 검색

### S1-3: 상품 UI
- [ ] 상품 목록 페이지 (그리드 + 필터)
- [ ] 상품 상세 페이지 (이미지 갤러리, 에디토리얼 설명, 스펙)
- [ ] 브랜드 페이지 (브랜드 스토리 + 상품 목록)
- [ ] 컬렉션 페이지

### S1-4: AI 상품 리스팅 파이프라인
- [ ] BullMQ 큐 설정 (agent:product-listing)
- [ ] Agent integration layer 구현 (Claude API 호출)
- [ ] 리스팅 파이프라인 연동: curator → creator → QA
- [ ] Admin: 상품 업로드 → AI 처리 → 승인 워크플로우
- [ ] AI 출력 미리보기 & 수정 기능

---

## Sprint 2: 고객 & 주문 (Weeks 4-5)

### S2-1: 고객 프로필
- [ ] 회원가입 / 로그인 플로우 (소셜 + 이메일)
- [ ] 프로필 관리 (사이즈, 선호 브랜드, 언어)
- [ ] VIP 등급 자동 산정 로직 (연간 소비 기준)
- [ ] 위시리스트 기능

### S2-2: 장바구니
- [ ] 장바구니 관리 (Redis-backed, 비회원 지원)
- [ ] 사이즈/컬러 선택
- [ ] 재고 확인 실시간 연동
- [ ] 장바구니 UI 컴포넌트

### S2-3: 결제
- [ ] Toss Payments 연동 (카드, 계좌이체, 간편결제)
- [ ] Stripe 연동 (해외 결제)
- [ ] 다중 통화 처리 (KRW, USD, EUR)
- [ ] 주문 생성 및 결제 확인 플로우
- [ ] 주문 확인 이메일 (Resend)

### S2-4: 주문 관리
- [ ] 주문 상태 추적 UI (고객용)
- [ ] 주문 관리 UI (관리자용)
- [ ] 배송 추적 연동 (택배사 API)
- [ ] 반품/교환 요청 플로우

---

## Sprint 3: 개인화 & 추천 (Weeks 6-7)

### S3-1: VIP 프로필 분석
- [ ] 고객 구매 히스토리 분석 서비스
- [ ] 스타일 DNA 추출 로직 (구매 70% + 브라우징 30%)
- [ ] 브랜드 친밀도 계산
- [ ] VIP 프로필 캐시 (Redis, TTL 6h)
- [ ] Agent 연동: vip-profile-analyzer 트리거

### S3-2: 개인화 추천
- [ ] 추천 생성 파이프라인 (profile-analyzer → style-recommender → QA)
- [ ] 추천 캐싱 전략 (Redis, customer + context 키)
- [ ] 추천 결과 저장 (Recommendation + RecommendationItem)
- [ ] Agent 연동: style-recommender 트리거

### S3-3: 추천 UI
- [ ] 홈페이지 "Curated for You" 섹션
- [ ] 상품 상세 "You May Also Like" 섹션
- [ ] 구매 후 "Complete Your Look" 추천
- [ ] 추천 클릭/전환 추적 (analytics)

### S3-4: 브랜드 경험 큐레이션
- [ ] 브랜드 스토리 AI 생성 파이프라인
- [ ] 컬렉션 내러티브 생성
- [ ] 에디토리얼 콘텐츠 CMS 연동
- [ ] 브랜드 페이지 비주얼 머천다이징

---

## Sprint 4: 캠페인 & 리뷰 (Weeks 8-9)

### S4-1: 캠페인 시스템
- [ ] 캠페인 CRUD (Admin)
- [ ] 캠페인 브리프 입력 폼
- [ ] AI 캠페인 설계 파이프라인 (analyzer → campaign-manager → QA)
- [ ] 캠페인 승인 워크플로우
- [ ] 이메일 발송 연동 (Resend + 스케줄링)
- [ ] 등급별 발송 타이밍 로직 (Platinum → Gold → Silver)

### S4-2: 캠페인 성과
- [ ] 발송/오픈/클릭/전환 추적
- [ ] 캠페인 대시보드 (KPI 차트)
- [ ] A/B 테스트 지원 (제목, 콘텐츠 변형)

### S4-3: 리뷰 시스템
- [ ] 리뷰 작성 UI (별점 + 텍스트)
- [ ] AI 리뷰 분석 파이프라인 (review-concierge → QA)
- [ ] 응답 승인 워크플로우 (Admin)
- [ ] 에스컬레이션 알림 (법적 위협, 인증 이슈)
- [ ] 리뷰 인사이트 주간 리포트

### S4-4: 알림 시스템
- [ ] 이메일 알림 (주문 상태, 리뷰 응답, 캠페인)
- [ ] 앱 내 알림 센터
- [ ] 알림 설정 (고객별 채널 선호도)

---

## Sprint 5: 관리자 & 통합 (Weeks 10-11)

### S5-1: Admin 대시보드
- [ ] 대시보드 홈 (매출, 주문, 고객 현황)
- [ ] 상품 관리 (AI 리스팅 큐, 승인/수정)
- [ ] 고객 관리 (VIP 목록, 프로필 조회)
- [ ] 주문 관리 (상태 변경, 검색)
- [ ] 리뷰 관리 (AI 응답 승인 큐)
- [ ] 캠페인 관리

### S5-2: 분석 & 리포팅
- [ ] PostHog 연동 (이벤트 추적)
- [ ] 매출 리포트 (일/주/월)
- [ ] 고객 분석 (등급 분포, 이탈 위험)
- [ ] 추천 성과 (클릭률, 전환율)
- [ ] AI 에이전트 성과 (처리 시간, QA 스코어)

### S5-3: 테스트
- [ ] Unit 테스트 (서비스 레이어, 유틸리티)
- [ ] Integration 테스트 (API 엔드포인트, DB 연동)
- [ ] E2E 테스트 (Playwright: 상품 탐색 → 구매 플로우)
- [ ] AI 파이프라인 테스트 (agent output 검증)
- [ ] 커버리지 80%+ 달성

---

## Sprint 6: 런칭 준비 (Week 12)

### S6-1: 성능 최적화
- [ ] Lighthouse 점수 90+ (모든 고객 페이지)
- [ ] 이미지 최적화 (AVIF/WebP, lazy loading)
- [ ] API 응답 시간 < 200ms (P95)
- [ ] 추천 캐시 프리워밍

### S6-2: 보안 감사
- [ ] OWASP Top 10 점검
- [ ] 인증/인가 테스트
- [ ] API Rate limiting 검증
- [ ] PII 암호화 검증
- [ ] 환경변수 노출 점검
- [ ] Dependency 보안 스캔 (npm audit)

### S6-3: 배포
- [ ] Vercel production 배포 설정
- [ ] PostgreSQL production 마이그레이션
- [ ] Redis production 설정
- [ ] Elasticsearch production 클러스터
- [ ] CDN (CloudFront) 설정
- [ ] 도메인 + SSL 설정
- [ ] Sentry 에러 모니터링

### S6-4: 런칭
- [ ] 시드 데이터 투입 (실제 브랜드/상품)
- [ ] AI 에이전트 전체 파이프라인 검증
- [ ] Smoke 테스트 (주요 플로우)
- [ ] 소프트 런칭 (VIP 초대)
- [ ] 모니터링 대시보드 확인

---

## Team Allocation (10명)

| Role | Count | Sprint Focus |
|------|-------|-------------|
| **Tech Lead / Fullstack** | 1 | 아키텍처, AI 통합, 코드 리뷰 |
| **Frontend Senior** | 2 | 고객 UI, Admin UI, 디자인 시스템 |
| **Backend Senior** | 2 | API, DB, 결제, 검색, 큐 |
| **Backend Junior** | 1 | CRUD, 테스트, 문서화 |
| **AI/ML Engineer** | 1 | 에이전트 통합, 추천 파이프라인 |
| **UI/UX Designer** | 1 | 럭셔리 디자인 시스템, 와이어프레임 |
| **PM** | 1 | 스프린트 관리, 브랜드 파트너 조율 |
| **QA Engineer** | 1 | 테스트 전략, E2E, 보안 감사 |

---

## Dependencies & Risks

### External Dependencies
| Dependency | Sprint | Risk | Mitigation |
|-----------|--------|------|------------|
| 브랜드 파트너 계약 | S1 | 상품 데이터 미확보 | 샘플 데이터로 개발, 병렬 영업 |
| Toss Payments 심사 | S2 | 결제 연동 지연 | 조기 신청, Stripe 우선 연동 |
| Anthropic API 할당량 | S1 | AI 파이프라인 병목 | 캐싱, 배치 처리, 할당량 사전 확보 |
| 도메인/SSL | S6 | 런칭 지연 | Sprint 0에서 사전 등록 |

### Technical Risks
| Risk | Impact | Sprint | Mitigation |
|------|--------|--------|------------|
| AI 콘텐츠 품질 편차 | 높음 | S1 | QA Guardian + human approval |
| 검색 성능 | 중간 | S1 | ES 인덱스 최적화, 캐싱 |
| 결제 장애 | 높음 | S2 | 다중 PG, 장애 전환 로직 |
| 추천 cold start | 중간 | S3 | 인기 상품 기본 추천 폴백 |
