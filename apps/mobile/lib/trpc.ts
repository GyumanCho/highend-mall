// Mobile tRPC client — type-only import from @repo/api/types.
// 런타임 코드는 번들에 포함되지 않음 (Metro가 타입 import를 따라가지 않음).
// docs/mobile-native/architecture.md §2.3 참조.

import { createTRPCReact, httpBatchLink } from "@trpc/react-query";
import type { AppRouter } from "@repo/api/types";
import Constants from "expo-constants";
import { Platform } from "react-native";

export const trpc = createTRPCReact<AppRouter>();

/**
 * 환경별 API base URL 결정.
 * - iOS 시뮬레이터: localhost가 호스트를 가리킴 → app.json extra.apiBaseUrl 그대로
 * - Android 에뮬레이터: 10.0.2.2가 호스트 → localhost 치환
 * - 물리 디바이스: LAN IP 필요 (app.json extra.apiBaseUrl에 수동 설정)
 */
function resolveApiBaseUrl(): string {
  const fromConfig = (Constants.expoConfig?.extra as { apiBaseUrl?: string })
    ?.apiBaseUrl;

  if (!fromConfig) {
    throw new Error(
      "API_BASE_URL이 설정되지 않았습니다. app.json의 extra.apiBaseUrl을 확인하세요."
    );
  }

  // Android 에뮬레이터에서 localhost → 10.0.2.2 자동 치환
  if (Platform.OS === "android" && fromConfig.includes("localhost")) {
    return fromConfig.replace("localhost", "10.0.2.2");
  }

  return fromConfig;
}

export function createTrpcClient() {
  return trpc.createClient({
    links: [
      httpBatchLink({
        url: `${resolveApiBaseUrl()}/api/trpc`,
        headers: () => ({
          "x-trpc-source": "mobile",
          // Phase 3: Authorization: `Bearer ${getAccessToken()}`
        }),
      }),
    ],
  });
}
