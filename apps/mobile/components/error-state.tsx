// 친절한 에러 표시. mobile-design-system §6.5 — 빨강 아이콘 금지, 재시도 제공.
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts, spacing } from "@/lib/theme";

interface ErrorStateProps {
  readonly title?: string;
  readonly message?: string;
  readonly onRetry?: () => void;
}

export function ErrorState({
  title = "Something went wrong",
  message = "We couldn't load this content. Please try again.",
  onRetry,
}: ErrorStateProps) {
  return (
    <View style={styles.container}>
      <Ionicons
        name="cloud-offline-outline"
        size={48}
        color={colors.warmGray}
        style={styles.icon}
      />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry ? (
        <Pressable onPress={onRetry} style={styles.retryBtn}>
          <Text style={styles.retryText}>TRY AGAIN</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
  },
  icon: {
    marginBottom: spacing.md,
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: 18,
    color: colors.charcoal,
    marginBottom: spacing.xs,
    textAlign: "center",
  },
  message: {
    fontSize: 13,
    color: colors.warmGray,
    textAlign: "center",
    lineHeight: 20,
    maxWidth: 280,
  },
  retryBtn: {
    marginTop: spacing.lg,
    borderWidth: 1,
    borderColor: colors.charcoal,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  retryText: {
    fontSize: 11,
    letterSpacing: 2,
    color: colors.charcoal,
  },
});
