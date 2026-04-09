# Mobile Native Migration — Research & Plan

> Next.js 기반 highend-fashion-mall을 React Native (Expo) 앱으로 확장하기 위한 사전 조사·설계 문서.

## 문서 구성

| # | 파일 | 내용 |
|---|---|---|
| 1 | [research.md](./research.md) | 현재 코드베이스 분석, 재사용 가능성, 핵심 발견 |
| 2 | [architecture.md](./architecture.md) | 모노레포 + tRPC + Expo 아키텍처 설계, 디자인 토큰 2-layer |
| 3 | [reuse-strategy.md](./reuse-strategy.md) | 웹 코드 재사용 매트릭스 및 전략 (**디자인 재사용 = 0%**) |
| 4 | [mobile-design-system.md](./mobile-design-system.md) | 모바일 전용 디자인 원칙·패턴·규칙 |
| 5 | [new-arch-compatibility.md](./new-arch-compatibility.md) | New Architecture 라이브러리 호환성 매트릭스 |
| 6 | [roadmap.md](./roadmap.md) | Phase 0~6 실행 로드맵 |
| 7 | [risks.md](./risks.md) | 리스크 매트릭스 및 완화책 |

## 한 줄 결론

> **현재 `mobile/` 폴더는 5% 완성도의 UI 프로토타입이며, 진지한 RN 앱으로 가려면 모노레포 전환 + tRPC 연결 + 인증 브릿지 순서로 11.5~16.5주가 필요하다. 목표가 "스토어 입점"이 아니라면 PWA가 훨씬 합리적이다.**

## 핵심 원칙

> **"같은 뼈대, 다른 피부"** — 백엔드·데이터·브랜드 DNA는 공유하되, **시각 디자인·레이아웃·인터랙션은 모바일 전용으로 재설계**. 웹 디자인을 RN에 이식하는 행위 자체를 안티패턴으로 간주한다.

## 핵심 결정 3가지 (사용자 확인 필요)

1. **분배 모델**: 앱스토어 입점이 필수인가? (Yes → RN, No → PWA)
2. **모노레포 전환 시점**: 지금 전환할 것인가, 나중에 할 것인가? (지금 권장)
3. **Admin 범위**: 모바일에서 admin은 제외 확정해도 되는가? (제외 권장)

## 작성일

- 초안: 2026-04-09
- 기반: 이전 세션 ultrathink 분석 + 로컬 코드베이스 직접 검증

## 진행 상황

| Phase | 상태 | 완료일 |
|---|---|---|
| Phase 0 — 안정화 | 🟢 자동화 부분 완료 (디바이스 검증 대기) | 2026-04-09 |
| Phase 1 — 모노레포 전환 | 🟢 대부분 완료 (Auth 추출만 Phase 3로 이월) | 2026-04-09 |
| Phase 2 — 백엔드 연결 | ⚪ 미시작 | — |
| Phase 3 — 인증 브릿지 | ⚪ 미시작 | — |
| Phase 4 — Customer UX | ⚪ 미시작 | — |
| Phase 5 — 네이티브 폴리시 | ⚪ 미시작 | — |
| Phase 6 — 배포 | ⚪ 미시작 | — |
