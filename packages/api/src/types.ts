// Type-only entry point for mobile / client consumers.
// Metro와 같은 번들러가 런타임 코드 그래프를 따라가지 않도록 분리.
// 주의: 런타임 import 금지. `import type` 전용.
export type { AppRouter } from "./server/routers/_app";
