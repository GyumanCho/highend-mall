# New Architecture 호환성 매트릭스

> Expo SDK 55 (New Architecture 기본 활성화) 환경에서 사용 중/예정 라이브러리의 호환성.
> 검증일: 2026-04-09

## 현재 설치된 라이브러리

| 패키지 | 설치 버전 | New Arch | 비고 |
|---|---|---|---|
| `react-native-reanimated` | 4.2.1 | ✅ Required | v4는 New Arch 전용 |
| `react-native-worklets` | 0.7.2 | ✅ Required | Reanimated 4의 worklet 런타임 |
| `react-native-gesture-handler` | 2.30.1 | ✅ Supported | v2.16+ New Arch 지원 |
| `react-native-screens` | 4.23.0 | ✅ Supported | v4는 Fabric 네이티브 |
| `react-native-safe-area-context` | 5.6.2 | ✅ Supported | v4.10+ New Arch 지원 |
| `expo-router` | 55.0.11 | ✅ Native | Expo SDK 55 정렬 |
| `expo-image` | 55.0.8 | ✅ Native | Expo SDK 55 정렬 |
| `expo-haptics` | 55.0.13 | ✅ Native | Expo SDK 55 정렬 |
| `expo-font` | 55.x | ✅ Native | |
| `expo-linking` | 55.0.11 | ✅ Native | |
| `expo-splash-screen` | 55.0.16 | ✅ Native | |
| `expo-status-bar` | 55.0.5 | ✅ Native | |
| `@expo/vector-icons` | 15.1.1 | ✅ Native | |
| `zustand` | 5.0.x | ✅ N/A | 순수 JS, 아키텍처 무관 |

**결과**: 현재 설치된 모든 네이티브 모듈이 New Architecture 호환. 차단 요소 없음.

## Phase 2~6에서 추가 도입 예정 — 호환성 사전 검증 필요

| 패키지 | 용도 | New Arch | 도입 Phase | 검증 상태 |
|---|---|---|---|---|
| `@trpc/react-query` + `@trpc/client` | 백엔드 호출 | ✅ N/A (순수 JS) | Phase 2 | OK |
| `@tanstack/react-query` | 서버 상태 | ✅ N/A | Phase 2 | OK |
| `expo-secure-store` | 토큰 저장 | ✅ Native | Phase 3 | 도입 시 검증 |
| `expo-device` | 디바이스 ID | ✅ Native | Phase 3 | 도입 시 검증 |
| `expo-auth-session` | OAuth | ✅ Native | Phase 3 (P1) | 도입 시 검증 |
| `expo-notifications` | 푸시 | ✅ Native | Phase 5 | 도입 시 검증 |
| `expo-updates` | EAS Update | ✅ Native | Phase 5 | 도입 시 검증 |
| `react-native-bottom-sheet` (`@gorhom/bottom-sheet`) | 바텀시트 | ✅ v5+ | Phase 4 | v5 (Reanimated 4 호환) 사용 |
| `@react-native-async-storage/async-storage` | 캐시 (Cart 게스트) | ✅ v2+ | Phase 4 | v2.x 권장 |
| `react-native-mmkv` (대안) | 빠른 저장소 | ⚠️ v3+ | Phase 4 | v3은 New Arch 전용, v2는 미지원 |
| **결제 SDK** (Stripe) | 결제 | ✅ `@stripe/stripe-react-native` v0.40+ | Phase 4 | v0.40 이상 확인 |
| **결제 SDK** (Toss) | 결제 | ⚠️ 검증 필요 | Phase 4 | KR PG 호환성 미확인 |
| **결제 SDK** (PortOne / IamPort) | 결제 | ⚠️ WebView 폴백 가능 | Phase 4 | RN SDK 상태 확인 필요 |
| `react-native-svg` (필요 시) | SVG 렌더 | ✅ v15+ | Phase 4 | |
| `lottie-react-native` (필요 시) | Lottie | ✅ v7+ | Phase 5 | |

## 알려진 비호환 / 위험 라이브러리 (사용 금지)

| 패키지 | 사유 |
|---|---|
| `react-native-reanimated@2.x/3.x` | New Arch 미지원 (이미 v4 채택) |
| `@react-native-async-storage/async-storage@1.x` | 구버전, v2 사용 |
| `react-native-mmkv@1.x/2.x` | New Arch 미지원, 사용하려면 v3+ |
| 일부 구버전 PG SDK | 비공식 fork 의존성 다수 |

## 검증 프로세스 (Phase 0 추가 작업)

각 신규 라이브러리 추가 시:

1. `npm view <pkg> peerDependencies` — RN 0.83+ 호환 확인
2. README/CHANGELOG에서 "Fabric" 또는 "New Architecture" 검색
3. GitHub Issues에서 `new architecture` 검색하여 미해결 차단 이슈 확인
4. 가능하면 Snack(`snack.expo.dev`)에서 SDK 55 + New Arch로 1차 테스트
5. 빌드 성공 + 런타임 진입 성공 확인 후 PR 머지

## 결론

**현재 mobile/는 New Architecture 환경에서 빌드/런타임 차단 요소 없음**. Phase 2 이후 추가될 라이브러리는 위 표 기준으로 사전 검증.
