# Research Notes: Luxury E-Commerce Best Practices

리서치 에이전트가 Net-a-Porter, Farfetch, Mytheresa, SSENSE 사례를 분석한 결과 요약.

## Key Findings Applied to Our Architecture

### 1. Tech Stack Confirmations
- **Next.js App Router** 선택 확정 — SSENSE, Mytheresa와 동일 계열
- **Sanity CMS** 추가 — 에디토리얼 콘텐츠, 예약 퍼블리싱, Portable Text
- **Algolia** 검색 — Farfetch/SSENSE 사용, 비주얼 머천다이징 랭킹 지원
- **Adyen** 결제 추가 — LVMH/Kering 그룹 사용, APAC 간편결제 (Alipay/WeChat)

### 2. UX Patterns (디자인 시스템 반영 필요)
- 넉넉한 여백 (2-3 컬럼 그리드), 미니멀 텍스트 오버레이
- 세리프 헤딩 (Canela/Noe Display) + 산세리프 본문 (Neue Haas Grotesk)
- 호버 시 두 번째 이미지 전환 (상품 → 모델 착용)
- 별점 표시 없음, 긴급 카운터 없음 — 상품이 스스로 말하게
- 페이지 전환 크로스페이드 300-400ms, 스켈레톤 로딩

### 3. Data Model Refinements
- **사이즈 시스템**: 브랜드별 변환 매트릭스 필요 (Gucci IT 40 ≠ Prada IT 40)
- **가격**: FX 변환이 아닌 마켓별 고정 가격 (관세/VAT/포지셔닝 반영)
- **브랜드 관계**: 서브 브랜드 (Miu Miu ⊂ Prada Group), 독점 계약 윈도우

### 4. Personalization Insights
- **Style DNA 3 소스**: 명시적(퀴즈) + 행동(브라우징) + 구매(가중치 최대)
- **지식 그래프**: 브랜드 패밀리 (Celine → The Row → Lemaire: 같은 미학 계열)
- **빈도 제한**: 주 2-3회 이하 (럭셔리는 과잉 소통이 브랜드 훼손)
- **BNPL**: Klarna/Affirm — 럭셔리에서도 점점 표준화 (Mytheresa, Net-a-Porter)

### 5. Phase 4 Roadmap Items (Post-MVP)
- AR 가상 피팅 (8th Wall / Apple ARKit)
- 인증 리셀 통합 (The RealReal 모델)
- 지속가능성 투명성 (공급망 추적)
- LTV 예측 고급 분석
