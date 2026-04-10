import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { colors } from "@/lib/theme";
import { trpc, createTrpcClient } from "@/lib/trpc";
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
