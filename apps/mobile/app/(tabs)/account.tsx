import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts, spacing } from "@/lib/theme";

const CUSTOMER = {
  name: "Soyeon Kim",
  email: "soyeon@example.com",
  tier: "GOLD",
  annualSpend: 28000,
  nextTier: "PLATINUM",
  nextThreshold: 50000,
} as const;

const MENU_ITEMS = [
  { icon: "receipt-outline" as const, label: "Order History", badge: "2" },
  { icon: "location-outline" as const, label: "Addresses", badge: null },
  { icon: "body-outline" as const, label: "Size Profile", badge: null },
  { icon: "settings-outline" as const, label: "Preferences", badge: null },
  { icon: "notifications-outline" as const, label: "Notifications", badge: "3" },
] as const;

export default function AccountScreen() {
  const progress = Math.min((CUSTOMER.annualSpend / CUSTOMER.nextThreshold) * 100, 100);
  const remaining = CUSTOMER.nextThreshold - CUSTOMER.annualSpend;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile */}
      <View style={styles.profile}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{CUSTOMER.name.charAt(0)}</Text>
        </View>
        <Text style={styles.name}>{CUSTOMER.name}</Text>
        <Text style={styles.email}>{CUSTOMER.email}</Text>
      </View>

      {/* VIP Status */}
      <View style={styles.vipCard}>
        <View style={styles.vipHeader}>
          <Text style={styles.vipLabel}>VIP STATUS</Text>
          <Text style={styles.vipTier}>{CUSTOMER.tier}</Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>${remaining.toLocaleString()} to {CUSTOMER.nextTier}</Text>

        <View style={styles.benefits}>
          {["Early access (24h)", "Dedicated VIP service", "Birthday gift", "Free shipping"].map((b) => (
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
          <Pressable key={item.label} style={styles.menuItem}>
            <Ionicons name={item.icon} size={20} color={colors.charcoal} />
            <Text style={styles.menuLabel}>{item.label}</Text>
            <View style={styles.menuRight}>
              {item.badge && (
                <View style={styles.menuBadge}>
                  <Text style={styles.menuBadgeText}>{item.badge}</Text>
                </View>
              )}
              <Ionicons name="chevron-forward" size={16} color={colors.lightGray} />
            </View>
          </Pressable>
        ))}
      </View>

      {/* Sign out */}
      <Pressable style={styles.signOut}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </Pressable>

      <View style={{ height: spacing.xxl }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.ivory },
  profile: { alignItems: "center", paddingVertical: spacing.xl },
  avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.charcoal, justifyContent: "center", alignItems: "center" },
  avatarText: { color: colors.white, fontFamily: fonts.serif, fontSize: 24 },
  name: { fontFamily: fonts.serif, fontSize: 20, color: colors.charcoal, marginTop: spacing.sm },
  email: { fontSize: 13, color: colors.warmGray, marginTop: 2 },
  vipCard: { marginHorizontal: spacing.md, padding: spacing.lg, backgroundColor: colors.white, borderRadius: 12 },
  vipHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.md },
  vipLabel: { fontSize: 10, letterSpacing: 2, color: colors.warmGray },
  vipTier: { fontFamily: fonts.serif, fontSize: 18, color: colors.gold },
  progressBar: { height: 4, backgroundColor: colors.lightGray, borderRadius: 2, overflow: "hidden" },
  progressFill: { height: "100%", backgroundColor: colors.gold, borderRadius: 2 },
  progressText: { fontSize: 11, color: colors.warmGray, marginTop: spacing.xs },
  benefits: { marginTop: spacing.md, gap: 6 },
  benefitRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  benefitText: { fontSize: 12, color: colors.warmGray },
  menu: { marginTop: spacing.lg, marginHorizontal: spacing.md, backgroundColor: colors.white, borderRadius: 12, overflow: "hidden" },
  menuItem: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 16, paddingHorizontal: spacing.md, borderBottomWidth: 0.5, borderBottomColor: colors.lightGray },
  menuLabel: { flex: 1, fontSize: 14, color: colors.charcoal },
  menuRight: { flexDirection: "row", alignItems: "center", gap: 8 },
  menuBadge: { backgroundColor: colors.gold, borderRadius: 10, minWidth: 20, height: 20, justifyContent: "center", alignItems: "center", paddingHorizontal: 6 },
  menuBadgeText: { fontSize: 10, color: colors.white, fontWeight: "600" },
  signOut: { marginTop: spacing.lg, marginHorizontal: spacing.md, paddingVertical: 14, alignItems: "center" },
  signOutText: { fontSize: 13, color: colors.warmGray, textDecorationLine: "underline" },
});
