import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState, useEffect } from "react";
import * as Haptics from "expo-haptics";
import { colors, fonts, spacing } from "@/lib/theme";
import { trpc } from "@/lib/trpc";
import { Skeleton } from "@/components/skeleton";
import { ErrorState } from "@/components/error-state";

const LANGUAGES = [
  { code: "ko", label: "한국어" },
  { code: "en", label: "English" },
  { code: "ja", label: "日本語" },
  { code: "zh", label: "中文" },
] as const;

const CURRENCIES = [
  { code: "KRW", symbol: "₩", label: "Korean Won" },
  { code: "USD", symbol: "$", label: "US Dollar" },
  { code: "EUR", symbol: "€", label: "Euro" },
  { code: "JPY", symbol: "¥", label: "Japanese Yen" },
] as const;

export default function PreferencesScreen() {
  const [language, setLanguage] = useState("ko");
  const [currency, setCurrency] = useState("KRW");
  const [hasChanges, setHasChanges] = useState(false);

  const utils = trpc.useUtils();
  const {
    data: response,
    isLoading,
    isError,
    error,
    refetch,
  } = trpc.profile.getPreferences.useQuery();

  const updateMutation = trpc.profile.updatePreferences.useMutation({
    onSuccess: () => {
      void utils.profile.getPreferences.invalidate();
      setHasChanges(false);
      Alert.alert("Saved", "Your preferences have been updated.");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    },
  });

  useEffect(() => {
    if (response?.data) {
      setLanguage(response.data.language);
    }
  }, [response?.data]);

  function handleSave() {
    updateMutation.mutate({ language });
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="arrow-back" size={22} color={colors.charcoal} />
        </Pressable>
        <Text style={styles.headerTitle}>PREFERENCES</Text>
        <View style={{ width: 22 }} />
      </View>

      {isError ? (
        <ErrorState
          title="Couldn't load preferences"
          message={error?.message ?? "Please try again."}
          onRetry={() => void refetch()}
        />
      ) : isLoading ? (
        <View style={styles.skeletonWrap}>
          <Skeleton width={80} height={12} />
          <Skeleton width="100%" height={50} style={{ marginTop: 8 }} />
          <Skeleton width={80} height={12} style={{ marginTop: 24 }} />
          <Skeleton width="100%" height={50} style={{ marginTop: 8 }} />
        </View>
      ) : (
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentInner}
        >
          {/* Language */}
          <Text style={styles.sectionLabel}>LANGUAGE</Text>
          <View style={styles.optionGroup}>
            {LANGUAGES.map((lang) => {
              const isSelected = language === lang.code;
              return (
                <Pressable
                  key={lang.code}
                  style={[styles.optionItem, isSelected && styles.optionItemActive]}
                  onPress={() => {
                    setLanguage(lang.code);
                    setHasChanges(true);
                    Haptics.selectionAsync();
                  }}
                  accessibilityLabel={`Language: ${lang.label}`}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: isSelected }}
                >
                  <Text style={[styles.optionLabel, isSelected && styles.optionLabelActive]}>
                    {lang.label}
                  </Text>
                  {isSelected && (
                    <Ionicons name="checkmark" size={18} color={colors.charcoal} />
                  )}
                </Pressable>
              );
            })}
          </View>

          {/* Currency */}
          <Text style={styles.sectionLabel}>CURRENCY</Text>
          <View style={styles.optionGroup}>
            {CURRENCIES.map((cur) => {
              const isSelected = currency === cur.code;
              return (
                <Pressable
                  key={cur.code}
                  style={[styles.optionItem, isSelected && styles.optionItemActive]}
                  onPress={() => {
                    setCurrency(cur.code);
                    setHasChanges(true);
                    Haptics.selectionAsync();
                  }}
                  accessibilityLabel={`Currency: ${cur.label}`}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: isSelected }}
                >
                  <View style={styles.currencyInfo}>
                    <Text style={styles.currencySymbol}>{cur.symbol}</Text>
                    <Text style={[styles.optionLabel, isSelected && styles.optionLabelActive]}>
                      {cur.label}
                    </Text>
                  </View>
                  {isSelected && (
                    <Ionicons name="checkmark" size={18} color={colors.charcoal} />
                  )}
                </Pressable>
              );
            })}
          </View>

          {/* Notifications placeholder */}
          <Text style={styles.sectionLabel}>NOTIFICATIONS</Text>
          <View style={styles.optionGroup}>
            <View style={styles.optionItem}>
              <Text style={styles.optionLabel}>Push Notifications</Text>
              <Text style={styles.comingSoon}>Coming Soon</Text>
            </View>
            <View style={styles.optionItem}>
              <Text style={styles.optionLabel}>Email Updates</Text>
              <Text style={styles.comingSoon}>Coming Soon</Text>
            </View>
          </View>

          {hasChanges && (
            <Pressable
              style={styles.saveBtn}
              onPress={handleSave}
              disabled={updateMutation.isPending}
            >
              <Text style={styles.saveBtnText}>
                {updateMutation.isPending ? "SAVING..." : "SAVE PREFERENCES"}
              </Text>
            </Pressable>
          )}

          <View style={{ height: spacing.xxl }} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.ivory },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingTop: 56,
    paddingBottom: spacing.sm,
    backgroundColor: colors.white,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.lightGray,
  },
  headerTitle: {
    fontFamily: fonts.serif,
    fontSize: 16,
    letterSpacing: 3,
    color: colors.charcoal,
  },
  content: { flex: 1 },
  contentInner: { padding: spacing.md },
  skeletonWrap: { padding: spacing.md },
  sectionLabel: {
    fontSize: 10,
    letterSpacing: 2,
    color: colors.warmGray,
    marginTop: spacing.lg,
    marginBottom: spacing.xs,
  },
  optionGroup: {
    backgroundColor: colors.white,
    borderRadius: 12,
    overflow: "hidden",
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.lightGray,
  },
  optionItemActive: {
    backgroundColor: "rgba(0,0,0,0.02)",
  },
  optionLabel: { fontSize: 14, color: colors.charcoal },
  optionLabelActive: { fontWeight: "600" },
  currencyInfo: { flexDirection: "row", alignItems: "center", gap: 10 },
  currencySymbol: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.warmGray,
    width: 20,
    textAlign: "center",
  },
  comingSoon: {
    fontSize: 11,
    color: colors.warmGray,
    fontStyle: "italic",
  },
  saveBtn: {
    marginTop: spacing.xl,
    backgroundColor: colors.charcoal,
    paddingVertical: 16,
    alignItems: "center",
  },
  saveBtnText: { color: colors.white, fontSize: 12, letterSpacing: 2 },
});
