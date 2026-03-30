import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useCartStore } from "@/lib/stores";
import { colors, fonts, spacing } from "@/lib/theme";

export default function BagScreen() {
  const { items, removeItem, updateQuantity, subtotal } = useCartStore();
  const total = subtotal();
  const shippingNote = total >= 500 ? "Complimentary shipping" : `$${500 - total} away from free shipping`;

  if (items.length === 0) {
    return (
      <View style={styles.empty}>
        <Ionicons name="bag-outline" size={48} color={colors.lightGray} />
        <Text style={styles.emptyTitle}>Your bag is empty</Text>
        <Text style={styles.emptyText}>Add pieces from the shop to get started.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.productId}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Image source={{ uri: item.imageUrl ?? undefined }} style={styles.itemImage} contentFit="cover" />
            <View style={styles.itemInfo}>
              <Text style={styles.itemBrand}>{item.brand}</Text>
              <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
              <Text style={styles.itemPrice}>${item.price.toLocaleString()}</Text>
              <View style={styles.quantityRow}>
                <Pressable onPress={() => updateQuantity(item.productId, item.quantity - 1)} style={styles.qtyBtn}>
                  <Text style={styles.qtyBtnText}>-</Text>
                </Pressable>
                <Text style={styles.qtyText}>{item.quantity}</Text>
                <Pressable onPress={() => updateQuantity(item.productId, item.quantity + 1)} style={styles.qtyBtn}>
                  <Text style={styles.qtyBtnText}>+</Text>
                </Pressable>
                <Pressable onPress={() => removeItem(item.productId)}>
                  <Text style={styles.removeText}>Remove</Text>
                </Pressable>
              </View>
            </View>
          </View>
        )}
      />

      {/* Checkout footer */}
      <View style={styles.footer}>
        <Text style={styles.shippingNote}>{shippingNote}</Text>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Subtotal</Text>
          <Text style={styles.totalAmount}>${total.toLocaleString()}</Text>
        </View>
        <Pressable style={styles.checkoutBtn} onPress={() => router.push("/checkout")}>
          <Text style={styles.checkoutText}>CHECKOUT</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.ivory },
  empty: { flex: 1, justifyContent: "center", alignItems: "center", padding: spacing.lg },
  emptyTitle: { fontFamily: fonts.serif, fontSize: 20, color: colors.charcoal, marginTop: spacing.md },
  emptyText: { fontSize: 13, color: colors.warmGray, textAlign: "center", marginTop: spacing.xs },
  list: { padding: spacing.md },
  item: { flexDirection: "row", gap: spacing.md, paddingVertical: spacing.md, borderBottomWidth: 0.5, borderBottomColor: colors.lightGray },
  itemImage: { width: 80, height: 100, borderRadius: 2, backgroundColor: colors.lightGray },
  itemInfo: { flex: 1 },
  itemBrand: { fontSize: 10, letterSpacing: 1.5, color: colors.warmGray, textTransform: "uppercase" },
  itemName: { fontSize: 13, color: colors.charcoal, marginTop: 2 },
  itemPrice: { fontSize: 13, color: colors.charcoal, marginTop: 4 },
  quantityRow: { flexDirection: "row", alignItems: "center", gap: 12, marginTop: 8 },
  qtyBtn: { width: 28, height: 28, borderRadius: 14, borderWidth: 0.5, borderColor: colors.lightGray, justifyContent: "center", alignItems: "center" },
  qtyBtnText: { fontSize: 14, color: colors.charcoal },
  qtyText: { fontSize: 13, color: colors.charcoal, minWidth: 20, textAlign: "center" },
  removeText: { fontSize: 11, color: colors.warmGray, textDecorationLine: "underline" },
  footer: { padding: spacing.md, borderTopWidth: 0.5, borderTopColor: colors.lightGray, backgroundColor: colors.white },
  shippingNote: { fontSize: 11, color: colors.gold, textAlign: "center", marginBottom: spacing.sm },
  totalRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: spacing.md },
  totalLabel: { fontSize: 14, color: colors.warmGray },
  totalAmount: { fontSize: 14, fontWeight: "600", color: colors.charcoal },
  checkoutBtn: { backgroundColor: colors.charcoal, paddingVertical: 16, borderRadius: 12, alignItems: "center" },
  checkoutText: { color: colors.white, fontSize: 12, letterSpacing: 2 },
});
