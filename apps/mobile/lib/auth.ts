// Mobile auth state — secure-store + Zustand.
// docs/mobile-native/architecture.md §2.4
import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import * as Application from "expo-application";
import { Platform } from "react-native";

const ACCESS_TOKEN_KEY = "maison.auth.accessToken";
const REFRESH_TOKEN_KEY = "maison.auth.refreshToken";
const CUSTOMER_KEY = "maison.auth.customer";

export interface AuthCustomer {
  readonly id: string;
  readonly email: string;
  readonly name: string | null;
  readonly tier: string;
}

interface AuthState {
  readonly customer: AuthCustomer | null;
  readonly accessToken: string | null;
  readonly isHydrated: boolean;
  readonly setSession: (input: {
    customer: AuthCustomer;
    accessToken: string;
    refreshToken: string;
  }) => Promise<void>;
  readonly setAccessToken: (token: string) => Promise<void>;
  readonly clearSession: () => Promise<void>;
  readonly hydrate: () => Promise<void>;
  readonly getRefreshToken: () => Promise<string | null>;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  customer: null,
  accessToken: null,
  isHydrated: false,

  hydrate: async () => {
    if (get().isHydrated) return;
    try {
      const [accessToken, customerJson] = await Promise.all([
        SecureStore.getItemAsync(ACCESS_TOKEN_KEY),
        SecureStore.getItemAsync(CUSTOMER_KEY),
      ]);
      const customer = customerJson ? (JSON.parse(customerJson) as AuthCustomer) : null;
      set({ accessToken, customer, isHydrated: true });
    } catch {
      set({ isHydrated: true });
    }
  },

  setSession: async ({ customer, accessToken, refreshToken }) => {
    await Promise.all([
      SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken),
      SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken),
      SecureStore.setItemAsync(CUSTOMER_KEY, JSON.stringify(customer)),
    ]);
    set({ customer, accessToken });
  },

  setAccessToken: async (token) => {
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
    set({ accessToken: token });
  },

  clearSession: async () => {
    await Promise.all([
      SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
      SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
      SecureStore.deleteItemAsync(CUSTOMER_KEY),
    ]);
    set({ customer: null, accessToken: null });
  },

  getRefreshToken: async () => {
    return SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  },
}));

/**
 * 디바이스 식별자 (인증 시 함께 전송).
 * iOS: identifierForVendor, Android: ANDROID_ID
 */
export async function getDeviceInfo(): Promise<{
  deviceId: string;
  deviceName: string;
}> {
  let deviceId: string | null = null;
  if (Platform.OS === "ios") {
    deviceId = await Application.getIosIdForVendorAsync();
  } else {
    deviceId = Application.getAndroidId() ?? null;
  }
  return {
    deviceId: deviceId ?? `unknown-${Platform.OS}`,
    deviceName: Platform.OS === "ios" ? "iOS Device" : "Android Device",
  };
}
