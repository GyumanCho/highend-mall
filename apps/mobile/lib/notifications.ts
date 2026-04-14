import { Platform } from "react-native";
import * as Device from "expo-device";
import Constants from "expo-constants";

/**
 * 푸시 알림 토큰을 등록하고 반환.
 * Expo Go에서는 push notifications 미지원 (SDK 53+) — 안전하게 스킵.
 * 실제 디바이스 + development build에서만 동작.
 */
export async function registerForPushNotifications(): Promise<string | null> {
  if (!Device.isDevice) return null;

  const projectId = Constants.expoConfig?.extra?.eas?.projectId;
  if (!projectId) return null;

  try {
    const Notifications = await import("expo-notifications");

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") return null;

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

    const tokenResponse = await Notifications.getExpoPushTokenAsync({ projectId });
    return tokenResponse.data;
  } catch {
    // Expo Go에서 expo-notifications import 자체가 실패할 수 있음
    return null;
  }
}
