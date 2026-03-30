import { View, Text, ScrollView, TextInput, Pressable, StyleSheet } from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useCartStore } from "@/lib/stores";
import { colors, fonts, spacing } from "@/lib/theme";

type Step = "shipping" | "payment" | "confirmation";

const PAYMENT_METHODS = [
  { id: "card", label: "Credit Card", icon: "card-outline" as const },
  { id: "kakao", label: "Kakao Pay", icon: "logo-octocat" as const },
  { id: "apple", label: "Apple Pay", icon: "logo-apple" as const },
] as const;

export default function CheckoutScreen() {
  const { items, subtotal, clearCart } = useCartStore();
  const [step, setStep] = useState<Step>("shipping");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [orderNumber, setOrderNumber] = useState("");

  const total = subtotal();
  const shipping = total >= 500 ? 0 : 25;

  function handlePlaceOrder() {
    const num = `MSN-${Date.now().toString(36).toUpperCase()}`;
    setOrderNumber(num);
    clearCart();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setStep("confirmation");
  }

  if (step === "confirmation") {
    return (
      <View style={styles.confirmation}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="close" size={24} color={colors.charcoal} />
        </Pressable>
        <View style={styles.checkCircle}>
          <Ionicons name="checkmark" size={32} color={colors.green} />
        </View>
        <Text style={styles.thankYou}>Thank You</Text>
        <Text style={styles.orderNum}>Order {orderNumber}</Text>
        <Text style={styles.confirmText}>
          A confirmation email has been sent. Our team will prepare your items with the utmost care.
        </Text>
        <Pressable onPress={() => router.replace("/(tabs)")} style={styles.continueCta}>
          <Text style={styles.continueText}>CONTINUE SHOPPING</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => step === "shipping" ? router.back() : setStep("shipping")} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.charcoal} />
        </Pressable>
        <Text style={styles.headerTitle}>
          {step === "shipping" ? "SHIPPING" : "PAYMENT"}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Steps */}
      <View style={styles.steps}>
        <View style={[styles.stepDot, styles.stepDotActive]} />
        <View style={[styles.stepLine, step === "payment" && styles.stepLineActive]} />
        <View style={[styles.stepDot, step === "payment" && styles.stepDotActive]} />
      </View>

      <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
        {step === "shipping" && (
          <View style={styles.section}>
            <View style={styles.row}>
              <View style={styles.halfField}>
                <Text style={styles.label}>FIRST NAME</Text>
                <TextInput style={styles.input} placeholder="Soyeon" placeholderTextColor={colors.lightGray} />
              </View>
              <View style={styles.halfField}>
                <Text style={styles.label}>LAST NAME</Text>
                <TextInput style={styles.input} placeholder="Kim" placeholderTextColor={colors.lightGray} />
              </View>
            </View>
            <Text style={styles.label}>ADDRESS</Text>
            <TextInput style={styles.input} placeholder="123 Gangnam-daero" placeholderTextColor={colors.lightGray} />
            <View style={styles.row}>
              <View style={styles.halfField}>
                <Text style={styles.label}>CITY</Text>
                <TextInput style={styles.input} placeholder="Seoul" placeholderTextColor={colors.lightGray} />
              </View>
              <View style={styles.halfField}>
                <Text style={styles.label}>POSTAL CODE</Text>
                <TextInput style={styles.input} placeholder="06241" placeholderTextColor={colors.lightGray} keyboardType="number-pad" />
              </View>
            </View>
            <Text style={styles.label}>PHONE</Text>
            <TextInput style={styles.input} placeholder="010-1234-5678" placeholderTextColor={colors.lightGray} keyboardType="phone-pad" />
          </View>
        )}

        {step === "payment" && (
          <View style={styles.section}>
            {PAYMENT_METHODS.map((method) => (
              <Pressable
                key={method.id}
                onPress={() => setPaymentMethod(method.id)}
                style={[styles.paymentOption, paymentMethod === method.id && styles.paymentOptionActive]}
              >
                <Ionicons name={method.icon} size={20} color={paymentMethod === method.id ? colors.charcoal : colors.warmGray} />
                <Text style={[styles.paymentLabel, paymentMethod === method.id && styles.paymentLabelActive]}>
                  {method.label}
                </Text>
                {paymentMethod === method.id && (
                  <Ionicons name="checkmark-circle" size={20} color={colors.charcoal} style={{ marginLeft: "auto" }} />
                )}
              </Pressable>
            ))}

            {/* Order summary */}
            <View style={styles.summary}>
              {items.map((item) => (
                <View key={item.productId} style={styles.summaryItem}>
                  <Text style={styles.summaryName} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.summaryPrice}>${(item.price * item.quantity).toLocaleString()}</Text>
                </View>
              ))}
              <View style={styles.divider} />
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Shipping</Text>
                <Text style={styles.summaryValue}>{shipping === 0 ? "Complimentary" : `$${shipping}`}</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>${(total + shipping).toLocaleString()}</Text>
              </View>
            </View>
          </View>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* CTA */}
      <View style={styles.ctaBar}>
        <Pressable
          onPress={() => step === "shipping" ? setStep("payment") : handlePlaceOrder()}
          style={styles.ctaBtn}
        >
          <Text style={styles.ctaBtnText}>
            {step === "shipping" ? "CONTINUE TO PAYMENT" : `PLACE ORDER · $${(total + shipping).toLocaleString()}`}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.ivory },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingTop: 56, paddingHorizontal: spacing.md, paddingBottom: spacing.sm },
  backBtn: { width: 40, height: 40, justifyContent: "center", alignItems: "center" },
  headerTitle: { fontSize: 12, letterSpacing: 2, color: colors.charcoal },
  steps: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 0, paddingVertical: spacing.sm },
  stepDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.lightGray },
  stepDotActive: { backgroundColor: colors.charcoal },
  stepLine: { width: 60, height: 1, backgroundColor: colors.lightGray },
  stepLineActive: { backgroundColor: colors.charcoal },
  form: { flex: 1, paddingHorizontal: spacing.md },
  section: { paddingTop: spacing.md },
  row: { flexDirection: "row", gap: 12 },
  halfField: { flex: 1 },
  label: { fontSize: 10, letterSpacing: 2, color: colors.warmGray, marginTop: spacing.md, marginBottom: spacing.xs },
  input: { borderWidth: 1, borderColor: colors.lightGray, borderRadius: 8, paddingHorizontal: 14, paddingVertical: 14, fontSize: 14, color: colors.charcoal, backgroundColor: colors.white },
  paymentOption: { flexDirection: "row", alignItems: "center", gap: 12, padding: 16, borderWidth: 1, borderColor: colors.lightGray, borderRadius: 12, marginTop: spacing.sm },
  paymentOptionActive: { borderColor: colors.charcoal, backgroundColor: colors.white },
  paymentLabel: { fontSize: 14, color: colors.warmGray },
  paymentLabelActive: { color: colors.charcoal, fontWeight: "500" },
  summary: { marginTop: spacing.xl, backgroundColor: colors.cream, borderRadius: 12, padding: spacing.md },
  summaryItem: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6 },
  summaryName: { fontSize: 13, color: colors.charcoal, flex: 1, marginRight: 12 },
  summaryPrice: { fontSize: 13, color: colors.charcoal },
  summaryLabel: { fontSize: 13, color: colors.warmGray },
  summaryValue: { fontSize: 13, color: colors.warmGray },
  divider: { height: 0.5, backgroundColor: colors.lightGray, marginVertical: spacing.sm },
  totalLabel: { fontSize: 14, fontWeight: "600", color: colors.charcoal },
  totalValue: { fontSize: 14, fontWeight: "600", color: colors.charcoal },
  ctaBar: { position: "absolute", bottom: 0, left: 0, right: 0, padding: spacing.md, paddingBottom: 34, backgroundColor: "rgba(255,255,255,0.97)", borderTopWidth: 0.5, borderTopColor: colors.lightGray },
  ctaBtn: { backgroundColor: colors.charcoal, borderRadius: 12, paddingVertical: 16, alignItems: "center" },
  ctaBtnText: { color: colors.white, fontSize: 12, letterSpacing: 2 },
  confirmation: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.ivory, padding: spacing.lg },
  checkCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: "#F0FFF4", justifyContent: "center", alignItems: "center", marginBottom: spacing.md },
  thankYou: { fontFamily: fonts.serif, fontSize: 32, color: colors.charcoal },
  orderNum: { fontSize: 13, color: colors.warmGray, marginTop: spacing.xs },
  confirmText: { fontSize: 14, color: colors.warmGray, textAlign: "center", lineHeight: 22, marginTop: spacing.md, maxWidth: 280 },
  continueCta: { marginTop: spacing.xl, borderWidth: 1, borderColor: colors.charcoal, paddingVertical: 14, paddingHorizontal: 32, borderRadius: 8 },
  continueText: { fontSize: 11, letterSpacing: 2, color: colors.charcoal },
});
