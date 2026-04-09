# Mobile Design System

> highend-fashion-mall 모바일 앱 디자인 원칙·패턴·규칙.
> **"웹 디자인을 그대로 가져오지 않는다"**는 원칙의 구체화.
> 작성일: 2026-04-09

## 0. 철학

### "같은 뼈대, 다른 피부"

| 공유 (Tier 1 Brand) | 분리 (Tier 2 Platform) |
|---|---|
| 브랜드 컬러 팔레트 | 레이아웃, 스페이싱 |
| 폰트 패밀리 (Playfair Display, Inter) | 타이포 스케일 |
| 로고 | 내비게이션 패턴 |
| 브랜드 보이스 | 제스처, 애니메이션 |
| 카피라이팅 톤 | 컴포넌트 구현 |

### "Stealth Luxury on Mobile"

이 브랜드의 핵심 미학은 **조용한 럭셔리 (stealth luxury)**입니다. 모바일에서 이를 표현하는 방식:

- **여백이 브랜드** — 빽빽함은 고급스러움의 반대. 가용 면적의 30% 이상을 여백으로
- **사진이 주인공** — 제품 이미지는 풀블리드, 텍스트는 최소한
- **정적 > 화려** — 과한 애니메이션 금지, 절제된 모션
- **세리프 타이포** — 헤드라인만 선별적으로 (서체 크기는 모바일에 맞게 축소)
- **톤다운된 색상** — 대비보다 조화

---

## 1. 레이아웃 원칙

### 1.1 그리드 & 여백

```
┌────────────────────────┐  ← Safe area top (status bar)
│    [16]                │
│  ┌──────────────────┐  │
│  │                  │  │  ← Content (16pt side margin)
│  │                  │  │
│  │                  │  │
│  └──────────────────┘  │
│    [16]                │
│  ┌──────────────────┐  │
│  │                  │  │  ← Section gap 24~40pt
│  │                  │  │
│  └──────────────────┘  │
│                        │
└────────────────────────┘  ← Safe area bottom (home indicator / tab bar)
```

- **Side margin**: 16pt 기본. 대형 이미지는 0pt (edge-to-edge)
- **Element gap**: 8, 12, 16, 24, 32, 40, 56 (토큰화)
- **Section gap**: 40pt 이상 — 여백이 브랜드
- **Edge-to-edge imagery**: 상품 이미지, 히어로 배너는 화면 폭 전체

### 1.2 컨테이너 정책

| 유형 | 규칙 |
|---|---|
| Page | Safe area 적용 (`SafeAreaView`), padding top 0 (상단 스크롤) |
| Section | 상하 40~56pt 간격 |
| Card | 8pt radius, border 0.5pt `rgba(0,0,0,0.08)`, shadow 최소 |
| List item | Height 44pt 이상 (터치 타겟) |

### 1.3 1컬럼 우선

모바일은 기본 **1컬럼**. 예외:
- 상품 그리드: 2컬럼 (세로 긴 이미지)
- 브랜드 로고 그리드: 3컬럼
- **절대 3컬럼 이상 금지** — 터치 타겟·가독성 훼손

---

## 2. 터치 타겟 & 제스처

### 2.1 터치 타겟 최소 크기

**44 × 44 pt** (iOS HIG, Material Design 권장).
작은 아이콘(20pt)이라도 hit area는 44pt 보장:

```typescript
<Pressable
  hitSlop={12}
  style={{ width: 20, height: 20 }}
>
  <Icon />
</Pressable>
```

### 2.2 제스처 카탈로그

| 제스처 | 용도 | 피드백 |
|---|---|---|
| Tap | 기본 선택/진입 | `Haptics.selection` |
| Long press | 컨텍스트 메뉴, 저장 | `Haptics.impact.medium` |
| Swipe left (list item) | 삭제, 숨김 | `Haptics.impact.light` |
| Swipe right | 위시리스트 추가 | `Haptics.notification.success` |
| Pull to refresh | 리스트 새로고침 | `Haptics.impact.light` |
| Pinch to zoom | 상품 이미지 확대 | 없음 |
| Swipe back (edge) | 뒤로가기 (iOS 기본) | 시스템 |
| Double tap | 상품 이미지 좋아요 | `Haptics.impact.medium` |

### 2.3 햅틱 정책

| 상황 | 햅틱 |
|---|---|
| 탭 (일반) | 없음 |
| 탭 (주요 CTA: Add to Bag) | `notification.success` |
| 위시리스트 토글 | `impact.light` |
| 주문 완료 | `notification.success` |
| 에러 | `notification.error` |
| 스위치/선택 변경 | `selection` |

**금지**: 무분별한 햅틱 남발 → 럭셔리 톤과 상반.

---

## 3. 타이포그래피

### 3.1 스케일 (모바일 전용, **제안 — 미구현**)

> **현재 상태**: `mobile/lib/theme.ts`에는 타이포 스케일 객체가 존재하지 않음. 아래 값은 Phase 4 도입 제안.

| 역할 | 크기 | Line Height | 폰트 | 사용처 |
|---|---|---|---|---|
| Display | 32 | 40 | Serif | 랜딩 히어로 |
| H1 | 28 | 36 | Serif | 페이지 타이틀 |
| H2 | 22 | 30 | Serif | 섹션 헤드 |
| H3 | 18 | 26 | Serif | 카드 헤드 |
| Subtitle | 15 | 22 | Sans 500 | 보조 타이틀 |
| Body | 15 | 22 | Sans 400 | 본문 |
| Caption | 13 | 18 | Sans 400 | 메타 정보 |
| Label | 11 | 14 | Sans 500 | 버튼, 태그 |
| Eyebrow | 10 | 14 | Sans 500 (tracking 2) | 카테고리 레이블 (uppercase) |

**웹 스케일과 다름을 주의**:
- 웹 h1 = 56pt → 모바일 h1 = 28pt
- 웹 body = 16pt → 모바일 body = 15pt
- 웹 display는 모바일에 존재하지 않음

### 3.2 서체 사용 원칙

**현재 모바일** (`mobile/lib/theme.ts`): `serif: "Georgia"`, `sans: "System"` — 시스템 폴백.
**제안 Phase 4**: 웹과 동일 브랜드 계열로 정렬.

| 역할 | 웹 (현재) | 모바일 (현재) | 모바일 (Phase 4 제안) |
|---|---|---|---|
| Serif | Playfair Display | Georgia | Playfair Display (`expo-font`로 번들) |
| Sans | Inter | System | Inter (`expo-font`로 번들) |

**사용 원칙**:
- **Serif**: 헤드라인, 브랜드 모먼트만. 본문엔 금지
- **Sans**: 본문, UI, 숫자, 버튼 전부
- **Tracking**: Serif는 기본 0, Sans UI 레이블만 0.5~2 (uppercase)

### 3.3 행수 제한

| 요소 | 최대 행수 |
|---|---|
| 상품 이름 (카드) | 2 |
| 상품 이름 (상세) | 3 |
| 설명 요약 | 3 |
| 배너 헤드라인 | 2 |

`numberOfLines` + `ellipsizeMode="tail"` 필수.

---

## 4. 컬러

### 4.1 역할별 사용 (Tier 1에서 파생 — 실제 코드 기반)

| 역할 | 값 | 용도 |
|---|---|---|
| `surface` | ivory `#faf8f5` | 기본 배경 |
| `surfaceAlt` | cream `#f5f0eb` | 카드·모달 배경 |
| `primary` | charcoal `#1a1a1a` | **주 CTA**, 본문 헤드 |
| `textHigh` | charcoal `#1a1a1a` | 본문, 헤드 |
| `textMid` | warmGray `#6b6560` | 보조 텍스트 |
| `textLow` | lightGray `#e8e4df` | 비활성, 캡션 |
| `accent` | gold `#b8977e` | **브랜드 모먼트 강조만** (eyebrow, price badge, 에디토리얼 선) |
| `accentSoft` | goldLight `#d4c4b0` | 호버/프레스 대체 상태 |
| `divider` | `rgba(0,0,0,0.08)` | 경계선 |
| `overlay` | `rgba(0,0,0,0.4)` | 모달 뒷배경 |

### 4.1.1 ⚠️ CTA 컬러 규칙 (Luxury Convention)

- **주 CTA (Add to Bag, Checkout, Sign In)**: 반드시 **charcoal `#1a1a1a`** 배경 + white 텍스트
- **Gold는 CTA에 사용 금지** — 할인/세일 신호로 오독될 위험
- **Gold 허용 용도**: eyebrow 레이블, 가격 강조선, 에디토리얼 디바이더, 브랜드 모먼트 아이콘

**근거**: Bottega Veneta, Loro Piana, SSENSE 등 stealth luxury 앱은 전부 dark neutral CTA 사용. Gold CTA는 middle-market 패션(특히 할인 광고)에서 지배적 → 브랜드 포지션 훼손.

**현재 코드 준수 확인**: `mobile/app/product/[slug].tsx:258`의 `bagBtn`은 이미 `backgroundColor: colors.charcoal` → 올바름.

### 4.2 금지 사항

- ❌ 원색 사용 (빨강·파랑·초록 순색)
- ❌ 그라디언트 남발 (단, 이미지 위 오버레이는 허용)
- ❌ 과한 대비 (black on white는 charcoal on ivory로 완화)

### 4.3 다크모드

- **Phase 4 이후** 지원 고려
- 별도 Tier 2 mobile 토큰 추가 (`darkTheme.ts`)
- 시스템 설정 따름 (`useColorScheme`)

---

## 5. 내비게이션 패턴

### 5.1 구조

```
Root (Stack)
├── (tabs) — Bottom Tab Bar
│   ├── Home
│   ├── Shop
│   ├── Wishlist
│   ├── Bag
│   └── Account
├── product/[slug]         ← Stack push
├── brand/[slug]           ← Stack push
├── checkout               ← Stack push
├── modal/size-guide       ← presentation: "modal"
└── sheet/filter           ← bottom sheet
```

### 5.2 규칙

- **하단 탭**: 5개 고정 (늘리지 않음)
- **상단 헤더**: 페이지 타이틀 + 뒤로가기. 로고·검색은 Home 탭 상단에만
- **뒤로가기**: iOS 좌측 스와이프 + 헤더 chevron 버튼 동시 제공
- **모달**: 전체 화면 아닌 **바텀시트** 선호 (필터, 사이즈 선택, 공유 등)
- **딥링크**: 모든 상품·브랜드·컬렉션은 딥링크 가능

### 5.3 바텀시트 정책

- **Snap points**: `25%`, `50%`, `90%`
- **핸들**: 상단 중앙 36×4 rounded bar
- **배경**: 뒤 페이지 어둡게 (`rgba(0,0,0,0.4)`)
- **스와이프 다운으로 닫기** 기본
- **사용 사례**: 필터, 사이즈 선택, 공유, 삭제 확인

---

## 6. 컴포넌트 패턴

### 6.1 Product Card

```
┌─────────────────────────┐
│                         │
│                         │
│       [IMAGE]           │  ← aspect ratio 4:5
│                         │
│                         │
├─────────────────────────┤
│ GUCCI                   │  ← eyebrow 10pt tracking
│ GG Marmont Small...     │  ← h3 18pt serif (2줄)
│ $2,350                  │  ← body 15pt sans
└─────────────────────────┘
```

- 카드 간격: 12pt (2컬럼 그리드)
- 탭 → 상세 진입
- 우상단 heart 아이콘 (wishlist toggle)
- No border, no shadow (이미지 자체가 카드)

### 6.2 Add to Bag CTA (고정)

```
┌────────────────────────────┐
│  ScrollView content...     │
│  ...                       │
├────────────────────────────┤
│  ♡  [ADD TO BAG · $2,350]  │  ← 48pt height, sticky bottom
└────────────────────────────┘
```

- `position: absolute, bottom: 0`
- 스크롤과 무관하게 항상 노출
- Safe area bottom 고려 (iPhone notch)

### 6.3 Loading 상태

- **스켈레톤 UI** 사용 (원형 스피너 금지)
- 이미지는 shimmer 효과
- 300ms 이내 로드면 스켈레톤 안 띄움 (blink 방지)

### 6.4 Empty 상태

- 아이콘 (outline, 48pt) + 제목 + 1줄 설명 + optional CTA
- 톤: "조용하게" (과장된 일러스트 금지)
- **아이콘 스펙**: 1~1.5pt stroke, fill 없음, 단색 (`textMid` 또는 `textLow`), 2-tone/멀티컬러 금지
- 추천 세트: `@expo/vector-icons`의 Ionicons `*-outline` 계열 (현재 `mobile/app/(tabs)/_layout.tsx`에서 사용 중) 또는 Feather

### 6.5 Error 상태

- Red 아이콘 금지 (`textLow` + 아이콘만)
- 재시도 버튼 제공
- 기술적 에러 메시지 숨김, 친절한 카피로

---

## 7. 모션 & 애니메이션

### 7.1 원칙

- **절제** — "덜 움직일수록 럭셔리"
- **기본 easing**: `ease-out` (200~300ms)
- **남발 금지**: 화면 전환, CTA 피드백, 로드 완료 3종만

### 7.2 허용되는 애니메이션

| 상황 | 애니메이션 |
|---|---|
| 화면 전환 (push) | iOS/Android 시스템 기본 |
| 바텀시트 등장 | Spring (dampening 20) |
| 이미지 로드 완료 | Fade in 200ms |
| CTA 탭 피드백 | Scale 0.97 → 1 (Reanimated) |
| 위시리스트 토글 | Heart scale + haptic |
| Pull to refresh | 시스템 기본 |

### 7.3 금지 사항

- ❌ 페이드인 빅모션 (웹의 Framer Motion 이식)
- ❌ Parallax 남용
- ❌ 무의미한 회전·튐
- ❌ 랜딩 로딩 화면의 커스텀 인트로 (스플래시로 족함)

---

## 8. 이미지 & 제품 사진 아트 디렉션

### 8.0 아트 디렉션 원칙 (브랜드 가드)

- **두 가지 허용 스타일만**:
  1. **Clean product-on-white**: 단색 배경 (화이트 or ivory), 드롭섀도 0 또는 최소, 제품 중심
  2. **Editorial environmental**: 자연광, 톤다운된 환경, 인물 포함 가능 (모델 얼굴은 절반 프레임 이상)
- **금지 사항**:
  - ❌ 가격 텍스트 burn-in
  - ❌ "NEW", "SALE", "LIMITED" 배지 합성
  - ❌ 로고 워터마크
  - ❌ 과도한 필터/색보정 (HDR 남발, 원색 부스트)
  - ❌ 생활 잡동사니 (cluttered flat lay)
  - ❌ 스톡 사진 직접 사용 (브랜드 톤 불일치)
- **비율 일관성**: 전 카탈로그 4:5 세로 (모바일 뷰 최적), 히어로는 3:4

### 8.1 사이즈 정책

| 용도 | 해상도 | 비율 |
|---|---|---|
| Thumbnail (list) | 400×500 | 4:5 |
| Card | 800×1000 | 4:5 |
| Detail | 1200×1500 | 4:5 |
| Hero / banner | 1200×1600 | 3:4 |
| Zoom | 2000×2500 | 4:5 |

### 8.2 expo-image 사용 규칙

```typescript
<Image
  source={{ uri }}
  style={styles.productImage}
  contentFit="cover"
  transition={200}
  cachePolicy="memory-disk"
  placeholder={blurhash}
/>
```

- `transition={200}` 필수 (로드 완료 페이드인)
- `placeholder` 블러해시 사용 (Phase 4)
- `recyclingKey`로 FlatList 최적화

---

## 9. 접근성

- **최소 폰트 크기**: 11pt
- **Dynamic Type**: 시스템 폰트 스케일 반영
- **VoiceOver / TalkBack**: 모든 Pressable에 `accessibilityLabel`
- **컬러 대비**: WCAG AA 이상 (본문 4.5:1)
- **터치 타겟**: 44pt 이상 준수

---

## 10. 품질 체크리스트

### 화면 완성 시 확인
- [ ] Safe area 대응 (top, bottom)
- [ ] 키보드 올라올 때 레이아웃 깨짐 없음 (`KeyboardAvoidingView`)
- [ ] 스크롤 가능 영역 경계 명확
- [ ] 모든 터치 타겟 44pt 이상
- [ ] 로딩 / 빈 상태 / 에러 상태 3종 모두 구현
- [ ] 이미지 placeholder 설정
- [ ] `numberOfLines` 설정 (긴 텍스트 잘림 방지)
- [ ] iOS + Android 양쪽에서 시각적 일관성
- [ ] 다크모드 (Phase 4 이후)
- [ ] 햅틱 피드백 일관성
- [ ] 애니메이션 과하지 않음

### 브랜드 검증
- [ ] 여백이 충분한가
- [ ] Serif/Sans 사용이 규칙대로인가
- [ ] 톤다운된 컬러인가 (원색 남용 없음)
- [ ] "조용한 럭셔리" 느낌이 살아있는가
- [ ] 사진이 주인공인가, 텍스트가 주인공인가
- [ ] 웹 디자인을 의식 없이 이식한 부분은 없는가

---

## 11. 안티패턴 (절대 금지)

- ❌ 웹 Tailwind 클래스명을 NativeWind로 이식
- ❌ 웹 레이아웃(3컬럼, 사이드바) 모바일 복제
- ❌ Hover 상태로만 접근 가능한 기능
- ❌ 44pt 미만 터치 타겟
- ❌ 웹 타이포 크기(h1 56pt) 모바일 그대로 사용
- ❌ 애니메이션 과시용 사용
- ❌ 무분별한 원색 사용 (빨강 배지 남발 등)
- ❌ "웹과 똑같아 보이게 만들자"는 요구 수용

---

## 12. 참고 벤치마크

내부 참고 대상 (분석만, 복제 금지):

| 앱 | 참고 범위 | 참고 금지 |
|---|---|---|
| **Net-a-Porter** | 에디토리얼 레이아웃, 타이포 리듬, 상품 카드 여백 | — |
| **MR PORTER** | 남성 럭셔리 톤, 카테고리 IA | — |
| **SSENSE** | 미니멀 카탈로그, 하단 탭 패턴, dark CTA | — |
| **MATCHES** | 에디토리얼 전개, 브랜드 스토리 섹션 | — |
| **Bottega Veneta** | 제품 사진 프레이밍, 침묵형 내비게이션 | — |
| ~~Farfetch~~ | 마켓플레이스 내비게이션 구조만 (제한적) | 할인/urgency 마케팅, 세일 배지, 프로모션 오버레이 (2023 파산 전 브랜드 톤 훼손 사례) |

**공통 참고 포인트**: 여백, 사진 중심, 절제된 타이포, 하단 탭 + 풀블리드 이미지, dark neutral CTA.

**반면교사**:
- Farfetch 후기 앱 — 할인 urgency, "LIMITED TIME", 빨강 배지
- Fast fashion 앱 전반 — 3컬럼 빡빡한 그리드, 다색 배지, 과한 애니메이션

---

## 변경 이력

- 2026-04-09: 초안 작성 (RN 마이그레이션 결정 직후, 웹 디자인 이식 금지 방침 확정)
