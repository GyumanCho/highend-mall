# Maison Mobile — React Native (Expo)

Highend fashion mall native mobile app.

## Quick Start

```bash
cd mobile
npm install
npx expo start
```

Scan the QR code with Expo Go (iOS/Android) or press:
- `i` for iOS Simulator
- `a` for Android Emulator

## Prerequisites

- Node.js 22+
- Expo Go app on your phone (for physical device testing)
- iOS Simulator (Xcode) or Android Emulator (Android Studio)
- Web API server running at `http://localhost:3000` (for API calls)

## Structure

```
mobile/
├── app/
│   ├── _layout.tsx              # Root layout (Stack)
│   └── (tabs)/
│       ├── _layout.tsx          # Tab navigator (5 tabs)
│       ├── index.tsx            # Home (hero + curated + private sale)
│       ├── shop.tsx             # Shop (product grid + brand filter)
│       ├── wishlist.tsx         # Wishlist (saved items grid)
│       ├── bag.tsx              # Bag (cart items + checkout CTA)
│       └── account.tsx          # Account (VIP status + menu)
├── lib/
│   ├── api.ts                   # API client (connects to Next.js backend)
│   ├── stores.ts                # Zustand stores (cart, wishlist)
│   └── theme.ts                 # Colors, fonts, spacing
├── assets/                      # App icons, splash
├── app.json                     # Expo config
└── package.json
```

## API Connection

The app connects to the existing Next.js API at `http://localhost:3000`.
Edit `lib/api.ts` to change the base URL for different environments:

```typescript
// iOS Simulator
const API_BASE = "http://localhost:3000";

// Android Emulator
const API_BASE = "http://10.0.2.2:3000";

// Physical device (replace with your IP)
const API_BASE = "http://192.168.1.100:3000";
```

## Screens

| Tab | Screen | Features |
|-----|--------|----------|
| Home | Hero + Curated Edit + Private Sale | VIP banner, horizontal product scroll |
| Shop | Product Grid | 2-column FlatList, brand filter pills |
| Wishlist | Saved Items | Heart badge, remove overlay |
| Bag | Cart + Checkout | Quantity controls, shipping calculation |
| Account | VIP Profile | Tier progress, benefits, menu navigation |
