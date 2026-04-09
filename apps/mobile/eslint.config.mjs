// Monorepo cross-tier boundary + Metro safety.
// docs/mobile-native/architecture.md §2.3.2
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{ts,tsx}"],
    ignores: ["node_modules/**", ".expo/**", "dist/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@repo/api",
              message:
                "모바일에서는 '@repo/api/types'만 import (type-only). 런타임 코드는 HTTP로 호출하세요.",
            },
            {
              name: "@repo/db",
              message:
                "모바일에서 Prisma 직접 접근 금지. tRPC를 통해 데이터 액세스하세요.",
            },
            {
              name: "@repo/design-tokens/web",
              message:
                "모바일에서 web 전용 토큰 사용 금지. '@repo/design-tokens/brand' 또는 '@repo/design-tokens/mobile'를 사용하세요.",
            },
          ],
        },
      ],
    },
  },
]);
