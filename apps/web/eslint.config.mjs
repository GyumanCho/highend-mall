import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    // Monorepo cross-tier boundary: 웹은 mobile 전용 토큰을 import 금지.
    // docs/mobile-native/architecture.md §2.3.2
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@repo/design-tokens/mobile",
              message:
                "웹에서 mobile 전용 토큰 사용 금지. '@repo/design-tokens/brand' 또는 '@repo/design-tokens/web'을 사용하세요.",
            },
          ],
        },
      ],
    },
  },
]);

export default eslintConfig;
