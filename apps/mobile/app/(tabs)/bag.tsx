import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
} from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useCartStore } from "@/lib/stores";
import { useAuthStore } from "@/lib/auth";
import { trpc } from "@/lib/trpc";
import { colors, fonts, spacing } from "@/lib/theme";
import { ProductCardSkeleton } from "@/components/skeleton";
import { ErrorState } from "@/components/error-state";

interface BagViewItem {
  readonly id: string; // cartItemId(서버) 또는 productId(로컬)
  readonly productId: string;
  readonly name: string;
  readonly brand: string;
  readonly price: number;
  readonly quantity: number;
  readonly imageUrl: string | null;
  readonly slug: string;
}

export default function BagScreen() {
  const customer = useAuthStore((s) => s.customer);
  const localCart = useCartStore();
  const utils = trpc.useUtils();

  const serverQuery = trpc.cart.list.useQuery(undefined, {
    enabled: !!customer,
  });
  const updateMutation = trpc.cart.updateQuantity.useMutation({
    onSuccess: () => utils.cart.list.invalidate(),
  });
  const removeMutation = trpc.cart.removeItem.useMutation({
    onSuccess: () => utils.cart.list.invalidate(),
  });

  let items: BagViewItem[] = [];

  if (customer) {
    if (serverQuery.isLoading) {
      return (
        <View style={styles.container}>
          <View style={{ padding: spacing.md, gap: spacing.md }}>
            <ProductCardSkeleton width={100} />
          </View>
        </View>
      );
    }
    if (serverQuery.isError) {
      return (
        <ErrorState
          title="Couldn't load bag"
          message={serverQuery.error?.message ?? "Please try again."}
          onRetry={() => void serverQuery.refetch()}
        />
      );
    }
    const raw = (serverQuery.data?.data ?? []) as unknown as ReadonlyArray<{
      id: string;
      productId: string;
      quantity: number;
      product: {
        id: string;
        name: string;
        slug: string;
        brand: { name: string };
        prices: { amount: string | number; isDefault: boolean }[];
        images: { url: string }[];
      };
    }>;
    items = raw.map((it) => {
      const price = it.product.prices.find((p) => p.isDefault) ?? it.product.prices[0];
      return {
        id: it.id,
        productId: it.productId,
        name: it.product.name,
        brand: it.product.brand.name,
        price: price ? Number(price.amount) : 0,
        quantity: it.quantity,
        imageUrl: it.product.images[0]?.url ?? null,
        slug: it.product.slug,
      };
    });
  } else {
    items = localCart.items.map((it) => ({
      id: it.productId,
      productId: it.productId,
      name: it.name,
      brand: it.brand,
      price: it.price,
      quantity: it.quantity,
      imageUrl: it.imageUrl,
      slug: it.slug,
    }));
  }

  const total = items.reduce((sum, it) => sum + it.price * it.quantity, 0);
  const shippingNote =
    total >= 500
      ? "Complimentary shipping"
      : `$${500 - total} away from free shipping`;

  function handleUpdateQty(item: BagViewItem, delta: number) {
    Haptics.selectionAsync();
    const newQty = item.quantity + delta;
    if (customer) {
      updateMutation.mutate({ cartItemId: item.id, quantity: Math.max(0, newQty) });
    } else {
      localCart.updateQuantity(item.productId, newQty);
    }
  }

  function handleRemove(item: BagViewItem) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (customer) {
      removeMutation.mutate({ cartItemId: item.id });
    } else {
      localCart.removeItem(item.productId);
    }
  }

  if (items.length === 0) {
    return (
      <View style={styles.empty}>
        <Ionicons name="bag-outline" size={48} color={colors.lightGray} />
        <Text style={styles.emptyTitle}>Your bag is empty</Text>
        <Text style={styles.emptyText}>
          Add pieces from the shop to get started.
        </Text>
        {!customer ? (
          <Pressable onPress={() => router.push("/login")} style={styles.signInHint}>
            <Text style={styles.signInHintText}>SIGN IN TO SYNC YOUR BAG</Text>
          </Pressable>
        ) : null}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Image
              source={{ uri: item.imageUrl ?? undefined }}
              style={styles.itemImage}
              contentFit="cover"
            />
            <View style={styles.itemInfo}>
              <Text style={styles.itemBrand}>{item.brand}</Text>
              <Text style={styles.itemName} numberOfLines={2}>
                {item.name}
              </Text>
              <Text style={styles.itemPrice}>
                ${item.price.toLocaleString()}
              </Text>
              <View style={styles.quantityRow}>
                <Pressable
                  onPress={() => handleUpdateQty(item, -1)}
                  style={styles.qtyBtn}
                  hitSlop={6}
                >
                  <Text style={styles.qtyBtnText}>−</Text>
                </Pressable>
                <Text style={styles.qtyText}>{item.quantity}</Text>
                <Pressable
                  onPress={() => handleUpdateQty(item, 1)}
                  style={styles.qtyBtn}
                  hitSlop={6}
                >
                  <Text style={styles.qtyBtnText}>+</Text>
                </Pressable>
                <Pressable onPress={() => handleRemove(item)} hitSlop={6}>
                  <Text style={styles.removeText}>Remove</Text>
                </Pressable>
              </View>
            </View>
          </View>
        )}
      />

      <View style={styles.footer}>
        <Text style={styles.shippingNote}>{shippingNote}</Text>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Subtotal</Text>
          <Text style={styles.totalAmount}>${total.toLocaleString()}</Text>
        </View>
        <Pressable
          style={styles.checkoutBtn}
          onPress={() => router.push("/checkout")}
        >
          <Text style={styles.checkoutText}>CHECKOUT</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.ivory },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg,
  },
  emptyTitle: {
    fontFamily: fonts.serif,
    fontSize: 20,
    color: colors.charcoal,
    marginTop: spacing.md,
  },
  emptyText: {
    fontSize: 13,
    color: colors.warmGray,
    textAlign: "center",
    marginTop: spacing.xs,
  },
  signInHint: {
    marginTop: spacing.xl,
    borderWidth: 1,
    borderColor: colors.charcoal,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  signInHintText: { fontSize: 11, letterSpacing: 2, color: colors.charcoal },
  list: { padding: spacing.md },
  item: {
    flexDirection: "row",
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.lightGray,
  },
  itemImage: {
    width: 80,
    height: 100,
    borderRadius: 2,
    backgroundColor: colors.lightGray,
  },
  itemInfo: { flex: 1 },
  itemBrand: {
    fontSize: 10,
    letterSpacing: 1.5,
    color: colors.warmGray,
    textTransform: "uppercase",
  },
  itemName: { fontSize: 13, color: colors.charcoal, marginTop: 2 },
  itemPrice: { fontSize: 13, color: colors.charcoal, marginTop: 4 },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 8,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: colors.lightGray,
    justifyContent: "center",
    alignItems: "center",
  },
  qtyBtnText: { fontSize: 14, color: colors.charcoal },
  qtyText: {
    fontSize: 13,
    color: colors.charcoal,
    minWidth: 20,
    textAlign: "center",
  },
  removeText: {
    fontSize: 11,
    color: colors.warmGray,
    textDecorationLine: "underline",
  },
  footer: {
    padding: spacing.md,
    borderTopWidth: 0.5,
    borderTopColor: colors.lightGray,
    backgroundColor: colors.white,
  },
  shippingNote: {
    fontSize: 11,
    color: colors.gold,
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  totalLabel: { fontSize: 14, color: colors.warmGray },
  totalAmount: { fontSize: 14, fontWeight: "600", color: colors.charcoal },
  checkoutBtn: {
    backgroundColor: colors.charcoal,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  checkoutText: { color: colors.white, fontSize: 12, letterSpacing: 2 },
});
