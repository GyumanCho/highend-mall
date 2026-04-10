import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect } from "react";
import * as Haptics from "expo-haptics";
import { colors, fonts, spacing } from "@/lib/theme";
import { useAuthStore, getDeviceInfo } from "@/lib/auth";
import { trpc } from "@/lib/trpc";

const MENU_ITEMS = [
  { icon: "receipt-outline" as const, label: "Order History", route: "/orders" },
  { icon: "heart-outline" as const, label: "Wishlist", route: "/(tabs)/wishlist" },
  { icon: "location-outline" as const, label: "Addresses", route: "/addresses" },
  { icon: "body-outline" as const, label: "Size Profile", route: "/size-profile" },
  { icon: "settings-outline" as const, label: "Preferences", route: "/preferences" },
] as const;

export default function AccountScreen() {
  const { customer, hydrate, clearSession, isHydrated } = useAuthStore();
  const utils = trpc.useUtils();
  const logoutMutation = trpc.auth.logout.useMutation();

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  if (!isHydrated) {
    return <View style={styles.container} />;
  }

  // 비로그인 상태
  if (!customer) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Ionicons name="person-circle-outline" size={64} color={colors.warmGray} />
        <Text style={styles.signedOutTitle}>Welcome to Maison</Text>
        <Text style={styles.signedOutSubtitle}>
          Sign in to access your wishlist, orders, and personalized recommendations.
        </Text>
        <Pressable
          style={styles.signInBtn}
          onPress={() => router.push("/login")}
        >
          <Text style={styles.signInBtnText}>SIGN IN</Text>
        </Pressable>
      </View>
    );
  }

  async function handleSignOut() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      const refreshToken = await useAuthStore.getState().getRefreshToken();
      if (refreshToken) {
        logoutMutation.mutate({ refreshToken });
      }
    } catch {
      // 무시하고 로컬 정리 진행
    }
    await clearSession();
    void utils.invalidate();
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile */}
      <View style={styles.profile}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {(customer.name ?? customer.email).charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.name}>{customer.name ?? "Member"}</Text>
        <Text style={styles.email}>{customer.email}</Text>
      </View>

      {/* VIP Status */}
      <View style={styles.vipCard}>
        <View style={styles.vipHeader}>
          <Text style={styles.vipLabel}>MEMBERSHIP</Text>
          <Text style={styles.vipTier}>{customer.tier}</Text>
        </View>
        <View style={styles.benefits}>
          {[
            "Early access to collections",
            "Curated recommendations",
            "Complimentary shipping",
          ].map((b) => (
            <View key={b} style={styles.benefitRow}>
              <Ionicons name="checkmark" size={14} color={colors.gold} />
              <Text style={styles.benefitText}>{b}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Menu */}
      <View style={styles.menu}>
        {MENU_ITEMS.map((item) => (
          <Pressable
            key={item.label}
            style={styles.menuItem}
            onPress={() => {
              if (item.route) router.push(item.route as never);
            }}
            accessibilityRole="button"
            accessibilityLabel={item.label}
          >
            <Ionicons name={item.icon} size={20} color={colors.charcoal} />
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.lightGray} />
          </Pressable>
        ))}
      </View>

      {/* Sign out */}
      <Pressable style={styles.signOut} onPress={handleSignOut}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </Pressable>

      <View style={{ height: spacing.xxl }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.ivory },
  centered: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
  },
  signedOutTitle: {
    fontFamily: fonts.serif,
    fontSize: 24,
    color: colors.charcoal,
    marginTop: spacing.md,
  },
  signedOutSubtitle: {
    fontSize: 14,
    color: colors.warmGray,
    textAlign: "center",
    marginTop: spacing.sm,
    lineHeight: 22,
    maxWidth: 280,
  },
  signInBtn: {
    marginTop: spacing.xl,
    backgroundColor: colors.charcoal,
    paddingHorizontal: 48,
    paddingVertical: 14,
  },
  signInBtnText: { color: colors.white, fontSize: 12, letterSpacing: 2 },
  profile: { alignItems: "center", paddingVertical: spacing.xl },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.charcoal,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { color: colors.white, fontFamily: fonts.serif, fontSize: 24 },
  name: {
    fontFamily: fonts.serif,
    fontSize: 20,
    color: colors.charcoal,
    marginTop: spacing.sm,
  },
  email: { fontSize: 13, color: colors.warmGray, marginTop: 2 },
  vipCard: {
    marginHorizontal: spacing.md,
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderRadius: 12,
  },
  vipHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  vipLabel: { fontSize: 10, letterSpacing: 2, color: colors.warmGray },
  vipTier: { fontFamily: fonts.serif, fontSize: 18, color: colors.gold },
  benefits: { marginTop: spacing.md, gap: 6 },
  benefitRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  benefitText: { fontSize: 12, color: colors.warmGray },
  menu: {
    marginTop: spacing.lg,
    marginHorizontal: spacing.md,
    backgroundColor: colors.white,
    borderRadius: 12,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 16,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.lightGray,
  },
  menuLabel: { flex: 1, fontSize: 14, color: colors.charcoal },
  signOut: {
    marginTop: spacing.lg,
    marginHorizontal: spacing.md,
    paddingVertical: 14,
    alignItems: "center",
  },
  signOutText: {
    fontSize: 13,
    color: colors.warmGray,
    textDecorationLine: "underline",
  },
});
