# Demo Setup: Highend Fashion Mall

로컬 시연 환경을 구성하는 가이드.

---

## 사전 요구사항

| 도구 | 버전 | 확인 명령어 |
|------|------|-----------|
| Node.js | 22+ | `node --version` |
| pnpm | 9+ | `pnpm --version` |
| Docker Desktop | 최신 | `docker --version` |
| Git | 최신 | `git --version` |

> pnpm이 없으면: `corepack enable pnpm`

---

## 1. 빠른 시작 (5분)

```bash
# 1) 저장소 클론 & 의존성 설치
git clone <repo-url> highend-fashion-mall
cd highend-fashion-mall
pnpm install

# 2) Docker로 DB + Redis 실행
docker compose up -d

# 3) DB 마이그레이션 + 시드 데이터 투입
pnpm db:generate
pnpm db:migrate
npx tsx prisma/seed.ts

# 4) 개발 서버 실행
pnpm dev
```

브라우저에서 http://localhost:3000 접속.

---

## 2. 시연 시드 데이터 내용

`npx tsx prisma/seed.ts` 실행 시 아래 데이터가 투입됩니다:

### 브랜드 (5개)

| Brand | Tier | Story |
|-------|------|-------|
| Gucci | Heritage | 1921 피렌체 설립, GG 모노그램, 이탈리안 크래프트 |
| Bottega Veneta | Modern | 1966 비첸차, 인트레치오 위브, 스텔스 럭셔리 |
| Celine | Modern | 1945 파리, 트리옹프 클라스프, 미니멀리즘 |
| The Row | Modern | 2006 뉴욕, 마고 백, 콰이어트 럭셔리 |
| Jacquemus | Contemporary | 2009 프로방스, 르 시키토, 조이풀 디자인 |

### 상품 (5개)

| Product | Brand | Price | Tier |
|---------|-------|-------|------|
| GG Marmont Small Shoulder Bag | Gucci | $2,350 | Core |
| Cassette Bag in Intreccio Leather | Bottega Veneta | $3,200 | Core |
| Triomphe Shoulder Bag in Shiny Calfskin | Celine | $4,150 | Core |
| Margaux 15 Bag in Smooth Calfskin | The Row | $5,490 | Ultra |
| Le Chiquito Long in Smooth Leather | Jacquemus | $495 | Accessible |

### 고객 (5명)

| Name | Email | Tier | Annual Spend | 용도 |
|------|-------|------|-------------|------|
| Soyeon Kim | soyeon@example.com | Gold | $28,000 | 고객 시연 |
| Minjae Lee | minjae@example.com | Platinum | $68,000 | VIP 시연 |
| Jiwon Park | jiwon@example.com | Silver | $8,500 | 일반 시연 |
| Hyunwoo Choi | hyunwoo@example.com | Gold | $32,000 | 이탈 위험 시연 |
| Admin | admin@maison.com | Standard | $0 | 관리자 |

### 주문 (4건)

| Order | Customer | Status | Total |
|-------|----------|--------|-------|
| MSN-20260315-A1B2 | Soyeon | DELIVERED | $2,350 |
| MSN-20260320-C3D4 | Minjae | DELIVERED | $8,690 |
| MSN-20260327-E5F6 | Soyeon | PROCESSING | $3,200 |
| MSN-20260328-G7H8 | Jiwon | PAID | $4,150 |

### 리뷰 (4건)

| Customer | Product | Rating | Status | AI 응답 |
|----------|---------|--------|--------|---------|
| Soyeon | GG Marmont | 4 | APPROVED | 게시됨 (배송 불만 대응) |
| Minjae | Cassette Bag | 5 | APPROVED | 게시됨 (크래프트 칭찬) |
| Jiwon | Triomphe Bag | 5 | PENDING | 미분석 |
| Hyunwoo | Margaux 15 | 5 | AI_ANALYZED | 초안 생성됨, 승인 대기 |

### 캠페인 (3건)

| Campaign | Type | Status |
|----------|------|--------|
| Autumn Atelier: Private Preview | Private Sale | ACTIVE |
| FW26 Collection Launch | Collection Launch | SCHEDULED |
| Holiday Gift Guide | Brand Partnership | DRAFT |

### 컬렉션 (3개)

| Collection | Season | 상품 수 |
|------------|--------|---------|
| Fall/Winter 2026 | FW26 | 전체 |
| FW26 Private Preview | FW26 | VIP 전용 |
| The Icons Edit | FW26 | 아이콘 상품 |

---

## 3. 시연 로그인 계정

로그인 페이지 (http://localhost:3000/login) 에서 Demo Accounts 원클릭 로그인:

| 계정 | 이메일 | 역할 | 시연 포인트 |
|------|--------|------|------------|
| **Soyeon Kim** | soyeon@example.com | Gold 고객 | 개인화 추천, 장바구니, 체크아웃, 주문 내역 |
| **Minjae Lee** | minjae@example.com | Platinum 고객 | VIP 배너, Private Sale, 얼리 액세스 |
| **Admin** | admin@maison.com | 관리자 | Admin 대시보드 전체 |

---

## 4. 시연 시나리오

### 시나리오 A: 고객 쇼핑 플로우 (5분)

```
1. / (홈)
   → VIP 배너 확인 (Gold: "Early Access")
   → "Curated for You" AI 추천 섹션 확인
   → Private Sale 다크 섹션 확인

2. /products
   → 카테고리 필터 (Bags)
   → 브랜드 필터 (Bottega Veneta)

3. /products/gucci-gg-marmont-small-shoulder-bag
   → 에디토리얼 상품 설명 확인
   → 소재 아코디언 열기
   → "The Story" 스크롤
   → Client Reviews (AI 응답 포함)
   → "You May Also Like" 추천

4. "Add to Bag" 클릭
   → Header "Bag (1)" 카운트 확인

5. /cart
   → 수량 변경, 무료 배송 안내

6. /checkout
   → 배송 정보 입력
   → 결제 수단 선택 (4종)
   → Place Order → Thank You 확인

7. /account/orders
   → 방금 주문 확인
```

### 시나리오 B: 브랜드 경험 (3분)

```
1. /brands
   → Tier별 그룹 (Heritage, Modern, Contemporary)

2. /brands/bottega-veneta
   → AI 생성 브랜드 스토리
   → 마일스톤 타임라인
   → Brand Values 태그
   → 상품 그리드

3. /journal
   → 매거진형 스토리 목록

4. /collections/fw26
   → FW26 에디토리얼 내러티브
   → "The Edit" 상품 그리드
```

### 시나리오 C: Admin 운영 (5분)

```
1. /dashboard
   → 통계 카드 (Products, Orders, Pending Reviews)
   → AI Pipeline Queue 현황

2. /dashboard/products
   → 상품 테이블 (QA 스코어 컬럼)
   → "+ New Product (AI Pipeline)" 클릭
   → 브랜드/이름/가격 입력 → "Generate with AI"
   → 진행 바 (curator → creator → qa-guardian)
   → 결과 JSON 미리보기 → "Approve & Publish"

3. /dashboard/reviews
   → 필터 (Pending / AI Analyzed / Approved)
   → AI 감성 분석 (mixed 0.45, 테마 태그)
   → AI 응답 초안 미리보기
   → "Approve Response" / "Trigger AI Analysis"

4. /dashboard/churn
   → Critical Risk (Eunji Hwang, Platinum)
   → At-Risk Revenue 합계
   → 리스크 팩터 가중치 + 증거
   → "Generate Retention Campaign (AI)"

5. /dashboard/settings
   → VIP 등급 기준 금액
   → AI 에이전트 모델 선택
   → 브랜드 캐노니컬 이름 관리
```

### 시나리오 D: 검색 + 위시리스트 (2분)

```
1. Header 검색 아이콘 클릭
   → "gucci" 입력 → 브랜드 + 상품 결과
   → "calfskin" 입력 → 소재 기반 검색

2. 상품 상세 → "Add to Wishlist"
   → /account → Wishlist 섹션 확인

3. Header 알림 벨
   → 미읽음 알림 (이탈 위험, 리뷰 대기)
   → "Mark all read"
```

---

## 5. 유용한 명령어

```bash
# DB 관리
pnpm db:studio            # Prisma Studio (브라우저 DB 뷰어)
pnpm db:migrate           # 마이그레이션 실행
npx tsx prisma/seed.ts    # 시드 데이터 재투입 (기존 데이터 초기화)

# 테스트
pnpm test:e2e             # Playwright E2E 테스트 (18개)

# 빌드
pnpm build                # Production 빌드
pnpm start                # Production 서버

# Docker
docker compose up -d      # DB + Redis 시작
docker compose down       # 중지
docker compose down -v    # 중지 + 볼륨 삭제 (데이터 초기화)

# DB 직접 접속
docker exec -it maison-db psql -U postgres -d highend_fashion_mall
docker exec -it maison-redis redis-cli
```

---

## 6. 트러블슈팅

### Docker Desktop이 실행되지 않음
```bash
open -a Docker        # macOS에서 Docker Desktop 실행
# 상태바에 Docker 아이콘이 뜰 때까지 대기 (약 30초)
```

### DB 연결 오류
```bash
# .env 확인
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/highend_fashion_mall?schema=public"

# 컨테이너 상태 확인
docker ps

# DB가 준비되지 않았으면 재시작
docker compose restart db
sleep 3
pnpm db:migrate
```

### 시드 데이터 초기화 재투입
```bash
npx tsx prisma/seed.ts    # 기존 데이터 삭제 후 재투입
```

### Hydration 에러 (콘솔)
장바구니/위시리스트에 데이터가 있는 상태에서 새 탭으로 열면 일시적으로 보일 수 있음.
기능에 영향 없으며, 페이지 로드 후 자동 해소됨.

### 포트 충돌
```bash
# 3000 포트 사용 중이면
lsof -i :3000 | grep LISTEN
kill -9 <PID>

# 5432 포트 (PostgreSQL) 사용 중이면
docker compose down
docker compose up -d
```
