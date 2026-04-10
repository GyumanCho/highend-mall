import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";

// 앱 포그라운드에서 알림 표시 설정
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * 푸시 알림 토큰을 등록하고 반환.
 * 실제 디바이스에서만 동작 (시뮬레이터/에뮬레이터는 null 반환).
 */
export async function registerForPushNotifications(): Promise<string | null> {
  if (!Device.isDevice) {
    return null;
  }

  // 권한 확인
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    return null;
  }

  // Android 알림 채널 설정
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "Default",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#C9A96E",
    });

    await Notifications.setNotificationChannelAsync("orders", {
      name: "Order Updates",
      importance: Notifications.AndroidImportance.HIGH,
      description: "Updates about your orders",
    });

    await Notifications.setNotificationChannelAsync("promotions", {
      name: "Promotions",
      importance: Notifications.AndroidImportance.DEFAULT,
      description: "Sales and exclusive offers",
    });
  }

  // Expo push token 획득
  const projectId = Constants.expoConfig?.extra?.eas?.projectId;
  const tokenResponse = await Notifications.getExpoPushTokenAsync({
    projectId,
  });

  return tokenResponse.data;
}

/**
 * 알림 탭 시 딥링크 URL 추출.
 * 서버에서 data.url 필드로 이동할 경로를 전달하는 규칙.
 */
export function getNotificationDeepLink(
  notification: Notifications.Notification
): string | null {
  const data = notification.request.content.data;
  if (data && typeof data === "object" && "url" in data) {
    return data.url as string;
  }
  return null;
}
