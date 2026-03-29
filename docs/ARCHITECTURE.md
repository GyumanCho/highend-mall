# System Architecture: Highend Fashion Mall

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client Layer                             │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐    │
│  │  Customer Web │  │  Admin Panel │  │  Mobile (Phase 2)  │    │
│  │  (Next.js)   │  │  (Next.js)   │  │                    │    │
│  └──────┬───────┘  └──────┬───────┘  └────────────────────┘    │
└─────────┼─────────────────┼─────────────────────────────────────┘
          │                 │
┌─────────┼─────────────────┼─────────────────────────────────────┐
│         ▼     API Gateway (Next.js API Routes)                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  /api/products  /api/customers  /api/orders  /api/admin  │   │
│  │  /api/reviews   /api/campaigns  /api/recommendations     │   │
│  └──────────────────────────┬───────────────────────────────┘   │
│                             │                                    │
│  ┌──────────────────────────┼───────────────────────────────┐   │
│  │              Application Layer                            │   │
│  │  ┌────────────┐ ┌────────────┐ ┌──────────────────┐     │   │
│  │  │  Product    │ │  Customer  │ │  Order            │     │   │
│  │  │  Service    │ │  Service   │ │  Service          │     │   │
│  │  └────────────┘ └────────────┘ └──────────────────┘     │   │
│  │  ┌────────────┐ ┌────────────┐ ┌──────────────────┐     │   │
│  │  │  Campaign   │ │  Review    │ │  Recommendation   │     │   │
│  │  │  Service    │ │  Service   │ │  Service          │     │   │
│  │  └────────────┘ └────────────┘ └──────────────────┘     │   │
│  └──────────────────────────┬───────────────────────────────┘   │
│                             │                                    │
│  ┌──────────────────────────┼───────────────────────────────┐   │
│  │              AI Agent Layer                                │   │
│  │  ┌─────────────────────────────────────────────────────┐ │   │
│  │  │          fashion-mall-orchestrator                   │ │   │
│  │  │  ┌───────────┐ ┌───────────┐ ┌──────────────────┐  │ │   │
│  │  │  │ product-  │ │ content-  │ │ profile-         │  │ │   │
│  │  │  │ curator   │ │ creator   │ │ analyzer         │  │ │   │
│  │  │  └───────────┘ └───────────┘ └──────────────────┘  │ │   │
│  │  │  ┌───────────┐ ┌───────────┐ ┌──────────────────┐  │ │   │
│  │  │  │ style-    │ │ campaign- │ │ review-          │  │ │   │
│  │  │  │ recomm.   │ │ manager   │ │ concierge        │  │ │   │
│  │  │  └───────────┘ └───────────┘ └──────────────────┘  │ │   │
│  │  │  ┌──────────────────────────────────────────────┐   │ │   │
│  │  │  │            luxury-qa-guardian                 │   │ │   │
│  │  │  └──────────────────────────────────────────────┘   │ │   │
│  │  └─────────────────────────────────────────────────────┘ │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
└──────────────────────────┬───────────────────────────────────────┘
                           │
┌──────────────────────────┼───────────────────────────────────────┐
│                    Data Layer                                     │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────────────┐     │
│  │  PostgreSQL   │ │  Redis       │ │  S3/CloudFront       │     │
│  │  (Primary DB) │ │  (Cache/     │ │  (Images/Assets)     │     │
│  │              │ │   Session)   │ │                      │     │
│  └──────────────┘ └──────────────┘ └──────────────────────┘     │
│  ┌──────────────┐ ┌──────────────┐                               │
│  │ Elasticsearch │ │  Event Store │                               │
│  │ (Search)      │ │  (Analytics) │                               │
│  └──────────────┘ └──────────────┘                               │
└──────────────────────────────────────────────────────────────────┘
```

## 2. Tech Stack

### 2.1 Frontend

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Framework** | Next.js 15 (App Router) | SSR/SSG for SEO, RSC for performance, Vercel 배포 용이 |
| **Styling** | Tailwind CSS + shadcn/ui | 럭셔리 커스텀 디자인 시스템 구축에 유연 |
| **State** | Zustand | 가볍고 직관적, 이커머스 클라이언트 상태에 적합 |
| **Forms** | React Hook Form + Zod | 관리자 패널 폼 검증 |
| **Image** | Next/Image + CDN | 럭셔리 이미지 최적화 (AVIF/WebP, 반응형) |
| **Animation** | Framer Motion | 럭셔리 UX의 미세한 인터랙션 |

### 2.2 Backend

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **API** | Next.js API Routes + tRPC | 타입 안전, 풀스택 TypeScript |
| **ORM** | Prisma | PostgreSQL과의 타입 안전 DB 접근 |
| **Auth** | NextAuth.js (Auth.js) | 소셜 로그인, VIP 등급별 접근 제어 |
| **Queue** | BullMQ (Redis-backed) | AI 에이전트 비동기 작업 처리 |
| **Email** | Resend | 캠페인/알림 메일 발송 |
| **Payment** | Toss Payments + Stripe + Adyen | 국내 PG + 해외 결제 + APAC (Alipay/WeChat) |

### 2.3 Data

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Primary DB** | PostgreSQL 16 | 관계형 데이터, JSONB로 유연한 속성 |
| **Cache** | Redis 7 | 세션, 추천 캐시, 장바구니, 실시간 데이터 |
| **Search** | Algolia | 패싯 검색, 자동완성, 비주얼 머천다이징 랭킹 (SSENSE/Farfetch 사례) |
| **CMS** | Sanity | 에디토리얼 콘텐츠, 예약 퍼블리싱, 다국어 (Portable Text) |
| **File Storage** | AWS S3 + CloudFront | 상품 이미지 CDN 배포 |
| **Analytics** | PostHog | 사용자 행동 추적, A/B 테스트 |

### 2.4 AI Agent Integration

| Component | Approach | Rationale |
|-----------|----------|-----------|
| **Agent Runtime** | Claude Code Agent SDK | 8개 에이전트 오케스트레이션 |
| **Trigger** | BullMQ Job → Agent dispatch | 비동기 처리 (상품 등록, 리뷰 응답 등) |
| **Output Storage** | PostgreSQL JSONB | 에이전트 출력 이력 저장 |
| **Human-in-the-loop** | Admin Panel approval queue | AI 출력 승인/수정/거절 워크플로우 |

### 2.5 Infrastructure

| Component | Technology |
|-----------|-----------|
| **Hosting** | Vercel (Frontend) + AWS (Backend services) |
| **CI/CD** | GitHub Actions |
| **Monitoring** | Sentry (errors) + PostHog (analytics) |
| **Logging** | Pino + CloudWatch |

---

## 3. Data Flow Diagrams

### 3.1 상품 등록 데이터 흐름

```
Admin Panel                Backend                  AI Agents              DB
    │                        │                        │                    │
    │── Upload Product ──→   │                        │                    │
    │                        │── Enqueue Job ───→     │                    │
    │                        │                 luxury-product-curator      │
    │                        │                        │── Validate ──→     │
    │                        │                 luxury-content-creator      │
    │                        │                        │── Generate ──→     │
    │                        │                 luxury-qa-guardian          │
    │                        │                        │── QA Check ──→    │
    │                        │←── Result ────────────│                    │
    │                        │── Save Draft ─────────────────────────→    │
    │←── Approval Request ──│                        │                    │
    │── Approve/Edit ──→    │                        │                    │
    │                        │── Publish ─────────────────────────────→   │
```

### 3.2 개인화 추천 데이터 흐름

```
Customer App               Backend                  AI Agents              Cache
    │                        │                        │                      │
    │── Page Load ──→        │                        │                      │
    │                        │── Check Cache ────────────────────────────→   │
    │                        │                        │              [miss]  │
    │                        │── Fetch Profile ──→   │                      │
    │                        │── Dispatch Agent ──→  │                      │
    │                        │              vip-profile-analyzer             │
    │                        │              style-recommender               │
    │                        │              luxury-qa-guardian              │
    │                        │←── Recommendations ──│                      │
    │                        │── Cache Result ──────────────────────────→   │
    │←── Render Edit ────── │                        │                      │
```

---

## 4. Security Architecture

### 4.1 Authentication & Authorization

```
┌─────────────────────────────────────────────┐
│              Auth Layers                     │
│                                             │
│  Layer 1: NextAuth Session (JWT/DB)         │
│  Layer 2: Role-Based Access Control         │
│    - customer: Browse, Purchase, Review     │
│    - vip: + Personalized, Early Access      │
│    - admin: + Product/Campaign/Review Mgmt  │
│    - super_admin: + System Configuration    │
│  Layer 3: VIP Tier Middleware               │
│    - Platinum/Gold/Silver content gating    │
│                                             │
└─────────────────────────────────────────────┘
```

### 4.2 Data Protection

| Category | Measure |
|----------|---------|
| **전송** | TLS 1.3, HSTS |
| **저장** | AES-256 (PII), bcrypt (passwords) |
| **API** | Rate limiting (100 req/min customer, 1000 req/min admin) |
| **PII** | GDPR/개인정보보호법 준수, 데이터 최소 수집 |
| **결제** | PCI DSS Level 1 (PG사 위임) |
| **로그** | PII 마스킹, 90일 보존 |

---

## 5. Scalability Considerations

### 5.1 Performance Targets

| Metric | Target |
|--------|--------|
| 페이지 로드 (TTFB) | < 200ms |
| 상품 검색 응답 | < 100ms |
| 추천 생성 (캐시 miss) | < 5s |
| 추천 로드 (캐시 hit) | < 50ms |
| AI 상품 리스팅 생성 | < 2min |
| 동시 접속자 | 1,000+ |

### 5.2 Caching Strategy

| Data | Cache | TTL | Invalidation |
|------|-------|-----|-------------|
| 상품 카탈로그 | Redis + CDN | 1h | 상품 수정 시 |
| 개인화 추천 | Redis | 6h | 구매/브라우징 이벤트 |
| 브랜드 스토리 | CDN | 24h | 콘텐츠 수정 시 |
| 검색 인덱스 | Elasticsearch | Real-time | 상품 변경 시 자동 동기화 |
| 세션 | Redis | 7d | 로그아웃 시 |

---

## 6. Directory Structure

```
highend-fashion-mall/
├── .claude/
│   ├── agents/                    # AI Agent definitions (8 agents)
│   └── skills/                    # Domain knowledge
├── docs/
│   ├── PRD.md
│   ├── ARCHITECTURE.md
│   ├── TECH_SPEC.md
│   └── TASK_LIST.md
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── (customer)/            # Customer-facing routes
│   │   │   ├── page.tsx           # Homepage (curated edit)
│   │   │   ├── brands/
│   │   │   ├── products/
│   │   │   ├── collections/
│   │   │   ├── cart/
│   │   │   └── account/
│   │   ├── (admin)/               # Admin panel routes
│   │   │   ├── dashboard/
│   │   │   ├── products/
│   │   │   ├── customers/
│   │   │   ├── campaigns/
│   │   │   ├── reviews/
│   │   │   └── settings/
│   │   ├── api/                   # API routes
│   │   │   ├── trpc/
│   │   │   ├── webhooks/
│   │   │   └── agents/            # AI agent trigger endpoints
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ui/                    # Base UI (shadcn)
│   │   ├── customer/              # Customer-facing components
│   │   ├── admin/                 # Admin components
│   │   └── shared/                # Shared components
│   ├── lib/
│   │   ├── db/                    # Prisma client & queries
│   │   ├── auth/                  # Auth configuration
│   │   ├── agents/                # Agent integration layer
│   │   ├── payment/               # Payment integration
│   │   ├── email/                 # Email service
│   │   ├── search/                # Elasticsearch client
│   │   ├── cache/                 # Redis cache layer
│   │   └── utils/                 # Shared utilities
│   ├── server/
│   │   ├── routers/               # tRPC routers
│   │   ├── services/              # Business logic
│   │   └── jobs/                  # Background job handlers
│   └── types/                     # Shared TypeScript types
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── public/
│   └── assets/
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── _workspace/                    # AI agent working directory
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.ts
```
