import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState, useCallback } from "react";
import { View, ActivityIndicator } from "react-native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import {
  PlayfairDisplay_400Regular,
  PlayfairDisplay_700Bold,
} from "@expo-google-fonts/playfair-display";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from "@expo-google-fonts/inter";
import * as Notifications from "expo-notifications";
import { colors } from "@/lib/theme";
import { trpc, createTrpcClient } from "@/lib/trpc";
import { useAuthStore } from "@/lib/auth";
import { registerForPushNotifications, getNotificationDeepLink } from "@/lib/notifications";
import { ErrorBoundary } from "@/components/error-boundary";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_700Bold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

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

  // 푸시 알림 토큰 등록 + 알림 탭 핸들러
  useEffect(() => {
    void registerForPushNotifications();

    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const url = getNotificationDeepLink(response.notification);
        if (url) {
          // expo-router가 앱 내 경로를 처리
          void import("expo-router").then(({ router: nav }) => {
            nav.push(url as never);
          });
        }
      }
    );

    return () => subscription.remove();
  }, []);

  const onLayoutReady = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ErrorBoundary>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <View style={{ flex: 1 }} onLayout={onLayoutReady}>
            <StatusBar style="dark" />
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: colors.ivory },
              }}
            />
          </View>
        </QueryClientProvider>
      </trpc.Provider>
    </ErrorBoundary>
  );
}
