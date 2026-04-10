import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { colors } from "@/lib/theme";
import { trpc, createTrpcClient } from "@/lib/trpc";
import { useAuthStore } from "@/lib/auth";
import { ErrorBoundary } from "@/components/error-boundary";

export default function RootLayout() {
  // QueryClient와 tRPC client는 앱 생명주기 동안 1회 생성 (ref 안정성).
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60, // 1분
            retry: 1,
          },
        },
      })
  );
  const [trpcClient] = useState(() => createTrpcClient());
  const hydrate = useAuthStore((s) => s.hydrate);

  // 앱 부팅 시 secure-store에서 토큰 + customer 복원.
  // 모든 탭이 customer 상태를 즉시 반영할 수 있도록 root에서 1회 실행.
  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  return (
    <ErrorBoundary>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <StatusBar style="dark" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.ivory },
            }}
          />
        </QueryClientProvider>
      </trpc.Provider>
    </ErrorBoundary>
  );
}
