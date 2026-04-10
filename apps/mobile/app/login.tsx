import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { router, Stack } from "expo-router";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { trpc } from "@/lib/trpc";
import { useAuthStore, getDeviceInfo } from "@/lib/auth";
import { colors, fonts, spacing } from "@/lib/theme";

type Mode = "login" | "register";

export default function LoginScreen() {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("demo@maison.com");
  const [password, setPassword] = useState("maison2026");
  const [name, setName] = useState("");

  const setSession = useAuthStore((s) => s.setSession);

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: async (data) => {
      await setSession({
        customer: data.customer,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.back();
    },
    onError: () => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    },
  });

  const registerMutation = trpc.auth.register.useMutation({
    onSuccess: async (data) => {
      await setSession({
        customer: data.customer,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.back();
    },
    onError: () => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    },
  });

  const submitting = loginMutation.isPending || registerMutation.isPending;
  const error =
    loginMutation.error?.message ?? registerMutation.error?.message ?? null;

  async function handleSubmit() {
    const device = await getDeviceInfo();
    if (mode === "login") {
      loginMutation.mutate({ email, password, ...device });
    } else {
      if (!name.trim()) return;
      registerMutation.mutate({ email, password, name, ...device });
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="close" size={24} color={colors.charcoal} />
        </Pressable>

        <View style={styles.brand}>
          <Text style={styles.brandText}>MAISON</Text>
        </View>

        <Text style={styles.title}>
          {mode === "login" ? "Welcome back" : "Create your account"}
        </Text>
        <Text style={styles.subtitle}>
          {mode === "login"
            ? "Sign in to continue your curated experience."
            : "Join us to access curated luxury and exclusive previews."}
        </Text>

        {mode === "register" ? (
          <View style={styles.field}>
            <Text style={styles.label}>NAME</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              style={styles.input}
              placeholder="Your name"
              placeholderTextColor={colors.warmGray}
              autoCapitalize="words"
              autoComplete="name"
            />
          </View>
        ) : null}

        <View style={styles.field}>
          <Text style={styles.label}>EMAIL</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            placeholder="you@example.com"
            placeholderTextColor={colors.warmGray}
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>PASSWORD</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor={colors.warmGray}
            secureTextEntry
            autoComplete={mode === "login" ? "current-password" : "new-password"}
          />
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <Pressable
          onPress={handleSubmit}
          disabled={submitting}
          style={[styles.cta, submitting && styles.ctaDisabled]}
        >
          <Text style={styles.ctaText}>
            {submitting
              ? "PLEASE WAIT…"
              : mode === "login"
                ? "SIGN IN"
                : "CREATE ACCOUNT"}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setMode(mode === "login" ? "register" : "login")}
          style={styles.toggleBtn}
        >
          <Text style={styles.toggleText}>
            {mode === "login"
              ? "Don't have an account? Create one"
              : "Already have an account? Sign in"}
          </Text>
        </Pressable>

        {mode === "login" ? (
          <View style={styles.demoHint}>
            <Text style={styles.demoLabel}>DEMO ACCOUNT</Text>
            <Text style={styles.demoText}>demo@maison.com / maison2026</Text>
          </View>
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.ivory },
  scroll: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl * 2,
    paddingBottom: spacing.xxl,
  },
  backBtn: {
    position: "absolute",
    top: 56,
    right: spacing.md,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  brand: { alignItems: "center", marginBottom: spacing.xl },
  brandText: {
    fontSize: 14,
    letterSpacing: 4,
    color: colors.charcoal,
    fontWeight: "300",
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: 28,
    color: colors.charcoal,
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 14,
    color: colors.warmGray,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: spacing.xxl,
  },
  field: { marginBottom: spacing.lg },
  label: {
    fontSize: 10,
    letterSpacing: 2,
    color: colors.warmGray,
    marginBottom: spacing.xs,
  },
  input: {
    borderBottomWidth: 0.5,
    borderBottomColor: colors.charcoal,
    paddingVertical: spacing.sm,
    fontSize: 15,
    color: colors.charcoal,
  },
  errorText: {
    color: colors.red,
    fontSize: 12,
    marginTop: spacing.sm,
    textAlign: "center",
  },
  cta: {
    marginTop: spacing.xl,
    backgroundColor: colors.charcoal,
    paddingVertical: 16,
    alignItems: "center",
    borderRadius: 4,
  },
  ctaDisabled: { opacity: 0.5 },
  ctaText: {
    color: colors.white,
    fontSize: 12,
    letterSpacing: 2,
  },
  toggleBtn: { marginTop: spacing.lg, alignItems: "center" },
  toggleText: { fontSize: 12, color: colors.warmGray },
  demoHint: {
    marginTop: spacing.xxl,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderWidth: 0.5,
    borderColor: colors.lightGray,
    alignItems: "center",
  },
  demoLabel: {
    fontSize: 9,
    letterSpacing: 2,
    color: colors.warmGray,
    marginBottom: 4,
  },
  demoText: { fontSize: 12, color: colors.charcoal },
});
