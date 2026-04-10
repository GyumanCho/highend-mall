// Mobile tRPC client — type-only import from @repo/api/types.
// docs/mobile-native/architecture.md §2.3
import {
  createTRPCReact,
  httpBatchLink,
  TRPCClientError,
} from "@trpc/react-query";
import type { AppRouter } from "@repo/api/types";
import Constants from "expo-constants";
import { Platform } from "react-native";
import { useAuthStore } from "./auth";

export const trpc = createTRPCReact<AppRouter>();

function resolveApiBaseUrl(): string {
  const fromConfig = (Constants.expoConfig?.extra as { apiBaseUrl?: string })
    ?.apiBaseUrl;

  if (!fromConfig) {
    throw new Error(
      "API_BASE_URL이 설정되지 않았습니다. app.json의 extra.apiBaseUrl을 확인하세요."
    );
  }

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
        headers: () => {
          const token = useAuthStore.getState().accessToken;
          return {
            "x-trpc-source": "mobile",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          };
        },
      }),
    ],
  });
}

export function isUnauthorizedError(error: unknown): boolean {
  return (
    error instanceof TRPCClientError &&
    error.data?.code === "UNAUTHORIZED"
  );
}
