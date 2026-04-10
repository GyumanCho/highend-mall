import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
} from "react-native";
import { Image } from "expo-image";
import { router, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { trpc } from "@/lib/trpc";
import { useAuthStore } from "@/lib/auth";
import { colors, fonts, spacing } from "@/lib/theme";
import { ErrorState } from "@/components/error-state";
import { Skeleton } from "@/components/skeleton";

interface OrderView {
  readonly id: string;
  readonly orderNumber: string;
  readonly status: string;
  readonly total: string | number;
  readonly createdAt: string;
  readonly items: ReadonlyArray<{
    readonly id: string;
    readonly quantity: number;
    readonly unitPrice: string | number;
    readonly product: {
      readonly id: string;
      readonly name: string;
      readonly brand: { readonly name: string };
      readonly images: ReadonlyArray<{ readonly url: string }>;
    };
  }>;
}

function statusLabel(status: string): { label: string; color: string } {
  switch (status) {
    case "PENDING":
      return { label: "Awaiting Payment", color: colors.warmGray };
    case "PAID":
      return { label: "Paid", color: colors.charcoal };
    case "PROCESSING":
      return { label: "Processing", color: colors.charcoal };
    case "SHIPPED":
      return { label: "Shipped", color: colors.gold };
    case "DELIVERED":
      return { label: "Delivered", color: colors.green };
    case "CANCELLED":
      return { label: "Cancelled", color: colors.warmGray };
    default:
      return { label: status, color: colors.warmGray };
  }
}

export default function OrdersScreen() {
  const customer = useAuthStore((s) => s.customer);
  const { data, isLoading, isError, error, refetch } =
    trpc.order.list.useQuery(undefined, { enabled: !!customer });

  if (!customer) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Stack.Screen options={{ title: "Orders", headerShown: true }} />
        <Ionicons name="lock-closed-outline" size={48} color={colors.warmGray} />
        <Text style={styles.signedOutTitle}>Sign in required</Text>
        <Pressable
          style={styles.signInBtn}
          onPress={() => router.push("/login")}
        >
          <Text style={styles.signInBtnText}>SIGN IN</Text>
        </Pressable>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: "Orders", headerShown: true }} />
        <View style={{ padding: spacing.md, gap: spacing.md }}>
          <Skeleton height={120} borderRadius={12} />
          <Skeleton height={120} borderRadius={12} />
          <Skeleton height={120} borderRadius={12} />
        </View>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: "Orders", headerShown: true }} />
        <ErrorState
          title="Couldn't load orders"
          message={error?.message ?? "Please try again."}
          onRetry={() => void refetch()}
        />
      </View>
    );
  }

  const orders = (data?.data ?? []) as unknown as ReadonlyArray<OrderView>;

  if (orders.length === 0) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Stack.Screen options={{ title: "Orders", headerShown: true }} />
        <Ionicons name="receipt-outline" size={48} color={colors.lightGray} />
        <Text style={styles.signedOutTitle}>No orders yet</Text>
        <Text style={styles.emptyText}>
          Your order history will appear here.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Orders", headerShown: true }} />
      <ScrollView contentContainerStyle={{ padding: spacing.md, gap: spacing.md }}>
        {orders.map((order) => {
          const status = statusLabel(order.status);
          const total = Number(order.total);
          const dateLabel = new Date(order.createdAt).toLocaleDateString();
          const firstImage = order.items[0]?.product.images[0]?.url;
          return (
            <View key={order.id} style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <Text style={styles.orderNumber}>{order.orderNumber}</Text>
                <Text style={[styles.orderStatus, { color: status.color }]}>
                  {status.label}
                </Text>
              </View>
              <Text style={styles.orderDate}>{dateLabel}</Text>

              <View style={styles.orderBody}>
                {firstImage ? (
                  <Image
                    source={{ uri: firstImage }}
                    style={styles.thumb}
                    contentFit="cover"
                  />
                ) : (
                  <View style={styles.thumb} />
                )}
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemBrand}>
                    {order.items[0]?.product.brand.name ?? ""}
                  </Text>
                  <Text style={styles.itemName} numberOfLines={2}>
                    {order.items[0]?.product.name ?? ""}
                  </Text>
                  {order.items.length > 1 ? (
                    <Text style={styles.moreItems}>
                      + {order.items.length - 1} more
                    </Text>
                  ) : null}
                </View>
              </View>

              <View style={styles.orderFooter}>
                <Text style={styles.totalLabel}>TOTAL</Text>
                <Text style={styles.totalAmount}>${total.toLocaleString()}</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
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
    fontSize: 22,
    color: colors.charcoal,
    marginTop: spacing.md,
  },
  emptyText: {
    fontSize: 13,
    color: colors.warmGray,
    textAlign: "center",
    marginTop: spacing.xs,
  },
  signInBtn: {
    marginTop: spacing.lg,
    backgroundColor: colors.charcoal,
    paddingHorizontal: 48,
    paddingVertical: 14,
  },
  signInBtnText: { color: colors.white, fontSize: 12, letterSpacing: 2 },
  orderCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.md,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderNumber: {
    fontSize: 11,
    letterSpacing: 1,
    color: colors.charcoal,
    fontFamily: "JetBrains Mono",
  },
  orderStatus: { fontSize: 11, letterSpacing: 1, fontWeight: "500" },
  orderDate: {
    fontSize: 11,
    color: colors.warmGray,
    marginTop: spacing.xs,
  },
  orderBody: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.md,
    alignItems: "center",
  },
  thumb: {
    width: 60,
    height: 80,
    borderRadius: 4,
    backgroundColor: colors.lightGray,
  },
  itemBrand: {
    fontSize: 10,
    letterSpacing: 1.5,
    color: colors.warmGray,
    textTransform: "uppercase",
  },
  itemName: {
    fontSize: 13,
    color: colors.charcoal,
    marginTop: 2,
  },
  moreItems: {
    fontSize: 11,
    color: colors.warmGray,
    marginTop: 4,
  },
  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 0.5,
    borderTopColor: colors.lightGray,
  },
  totalLabel: { fontSize: 10, letterSpacing: 2, color: colors.warmGray },
  totalAmount: { fontSize: 16, color: colors.charcoal },
});
