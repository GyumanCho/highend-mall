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

interface SizeCategory {
  readonly key: string;
  readonly label: string;
  readonly icon: keyof typeof Ionicons.glyphMap;
  readonly options: readonly string[];
}

const SIZE_CATEGORIES: readonly SizeCategory[] = [
  {
    key: "clothing",
    label: "Clothing",
    icon: "shirt-outline",
    options: ["XXS", "XS", "S", "M", "L", "XL", "XXL"],
  },
  {
    key: "pants",
    label: "Pants",
    icon: "body-outline",
    options: ["24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "36"],
  },
  {
    key: "shoes",
    label: "Shoes",
    icon: "footsteps-outline",
    options: ["35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45"],
  },
  {
    key: "accessories",
    label: "Accessories",
    icon: "watch-outline",
    options: ["XS", "S", "M", "L", "XL"],
  },
  {
    key: "ring",
    label: "Ring",
    icon: "ellipse-outline",
    options: ["5", "6", "7", "8", "9", "10", "11", "12", "13"],
  },
] as const;

export default function SizeProfileScreen() {
  const [sizes, setSizes] = useState<Record<string, string>>({});
  const [hasChanges, setHasChanges] = useState(false);

  const utils = trpc.useUtils();
  const {
    data: response,
    isLoading,
    isError,
    error,
    refetch,
  } = trpc.profile.getSizeProfile.useQuery();

  const updateMutation = trpc.profile.updateSizeProfile.useMutation({
    onSuccess: () => {
      void utils.profile.getSizeProfile.invalidate();
      setHasChanges(false);
      Alert.alert("Saved", "Your size profile has been updated.");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    },
  });

  useEffect(() => {
    if (response?.data) {
      setSizes(response.data as Record<string, string>);
    }
  }, [response?.data]);

  function selectSize(category: string, size: string) {
    setSizes((prev) => {
      const updated = { ...prev };
      if (updated[category] === size) {
        delete updated[category];
      } else {
        updated[category] = size;
      }
      return updated;
    });
    setHasChanges(true);
    Haptics.selectionAsync();
  }

  function handleSave() {
    updateMutation.mutate(sizes);
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="arrow-back" size={22} color={colors.charcoal} />
        </Pressable>
        <Text style={styles.headerTitle}>SIZE PROFILE</Text>
        <View style={{ width: 22 }} />
      </View>

      {isError ? (
        <ErrorState
          title="Couldn't load size profile"
          message={error?.message ?? "Please try again."}
          onRetry={() => void refetch()}
        />
      ) : isLoading ? (
        <View style={styles.skeletonWrap}>
          {[1, 2, 3].map((i) => (
            <View key={i} style={{ marginBottom: spacing.lg }}>
              <Skeleton width={100} height={14} />
              <View style={styles.optionRow}>
                {[1, 2, 3, 4, 5].map((j) => (
                  <Skeleton key={j} width={48} height={40} borderRadius={8} />
                ))}
              </View>
            </View>
          ))}
        </View>
      ) : (
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentInner}
        >
          <Text style={styles.intro}>
            Save your preferred sizes for a personalized shopping experience.
          </Text>

          {SIZE_CATEGORIES.map((cat) => (
            <View key={cat.key} style={styles.categorySection}>
              <View style={styles.categoryHeader}>
                <Ionicons name={cat.icon} size={18} color={colors.charcoal} />
                <Text style={styles.categoryLabel}>{cat.label}</Text>
                {sizes[cat.key] && (
                  <View style={styles.selectedBadge}>
                    <Text style={styles.selectedBadgeText}>{sizes[cat.key]}</Text>
                  </View>
                )}
              </View>
              <View style={styles.optionRow}>
                {cat.options.map((size) => {
                  const isSelected = sizes[cat.key] === size;
                  return (
                    <Pressable
                      key={size}
                      style={[styles.optionChip, isSelected && styles.optionChipActive]}
                      onPress={() => selectSize(cat.key, size)}
                      accessibilityLabel={`${cat.label} size ${size}`}
                      accessibilityRole="button"
                      accessibilityState={{ selected: isSelected }}
                    >
                      <Text
                        style={[styles.optionText, isSelected && styles.optionTextActive]}
                      >
                        {size}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          ))}

          {hasChanges && (
            <Pressable
              style={styles.saveBtn}
              onPress={handleSave}
              disabled={updateMutation.isPending}
            >
              <Text style={styles.saveBtnText}>
                {updateMutation.isPending ? "SAVING..." : "SAVE SIZES"}
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
  intro: {
    fontSize: 14,
    color: colors.warmGray,
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  categorySection: {
    marginBottom: spacing.xl,
  },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: spacing.sm,
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.charcoal,
    flex: 1,
  },
  selectedBadge: {
    backgroundColor: colors.gold,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 4,
  },
  selectedBadgeText: {
    fontSize: 11,
    color: colors.white,
    fontWeight: "600",
  },
  optionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  optionChip: {
    minWidth: 48,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.lightGray,
    backgroundColor: colors.white,
  },
  optionChipActive: {
    backgroundColor: colors.charcoal,
    borderColor: colors.charcoal,
  },
  optionText: { fontSize: 13, color: colors.warmGray },
  optionTextActive: { color: colors.white },
  saveBtn: {
    marginTop: spacing.lg,
    backgroundColor: colors.charcoal,
    paddingVertical: 16,
    alignItems: "center",
  },
  saveBtnText: { color: colors.white, fontSize: 12, letterSpacing: 2 },
});
