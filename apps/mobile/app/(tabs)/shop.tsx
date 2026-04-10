import {
  View,
  Text,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useState } from "react";
import { colors, fonts, spacing } from "@/lib/theme";
import { trpc } from "@/lib/trpc";
import { ProductCardSkeleton } from "@/components/skeleton";
import { ErrorState } from "@/components/error-state";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - spacing.md * 3) / 2;

// 카드 표시용 얕은 타입 — tRPC v11 + Prisma 깊은 타입(TS2589) 회피.
interface ShopProduct {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  readonly brand: { readonly id: string; readonly name: string };
  readonly prices: readonly { readonly amount: string | number; readonly isDefault: boolean }[];
  readonly images: readonly { readonly id?: string; readonly url: string }[];
}

function formatPriceLabel(prices: ShopProduct["prices"]): string {
  const def = prices.find((p) => p.isDefault) ?? prices[0];
  if (!def) return "";
  const amount = Number(def.amount);
  return `$${amount.toLocaleString()}`;
}

export default function ShopScreen() {
  const [activeBrand, setActiveBrand] = useState<string>("All");

  const { data: brandsResponse } = trpc.brand.list.useQuery({});
  const brandList = (brandsResponse?.data ?? []) as ReadonlyArray<{
    id: string;
    name: string;
    slug: string;
  }>;
  const brandFilter: readonly string[] = ["All", ...brandList.map((b) => b.name)];

  const selectedBrandId =
    activeBrand === "All"
      ? undefined
      : brandList.find((b) => b.name === activeBrand)?.id;

  const {
    data: productsResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = trpc.product.list.useQuery({
    page: 1,
    limit: 50,
    ...(selectedBrandId ? { brandId: selectedBrandId } : {}),
  });

  const products = (productsResponse?.data ?? []) as unknown as ReadonlyArray<ShopProduct>;

  return (
    <View style={styles.container}>
      {/* Brand filter */}
      <View style={styles.filterWrap}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {brandFilter.map((brand) => (
            <Pressable
              key={brand}
              onPress={() => setActiveBrand(brand)}
              style={[
                styles.filterChip,
                activeBrand === brand && styles.filterChipActive,
              ]}
              accessibilityRole="button"
              accessibilityLabel={`Filter by ${brand}`}
              accessibilityState={{ selected: activeBrand === brand }}
            >
              <Text
                style={[
                  styles.filterText,
                  activeBrand === brand && styles.filterTextActive,
                ]}
              >
                {brand}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {isError ? (
        <ErrorState
          title="Couldn't load products"
          message={error?.message ?? "Please try again."}
          onRetry={() => void refetch()}
        />
      ) : isLoading ? (
        <View style={styles.grid}>
          <View style={styles.row}>
            <ProductCardSkeleton width={CARD_WIDTH} />
            <ProductCardSkeleton width={CARD_WIDTH} />
          </View>
          <View style={styles.row}>
            <ProductCardSkeleton width={CARD_WIDTH} />
            <ProductCardSkeleton width={CARD_WIDTH} />
          </View>
        </View>
      ) : (
        <>
          <Text style={styles.count}>{products.length} pieces</Text>
          <FlatList
            data={products}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.grid}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              const firstImage = item.images[0]?.url;
              return (
                <Pressable
                  style={styles.card}
                  onPress={() => router.push(`/product/${item.slug}`)}
                  accessibilityRole="button"
                  accessibilityLabel={`${item.brand.name} ${item.name}, ${formatPriceLabel(item.prices)}`}
                >
                  {firstImage ? (
                    <Image
                      source={{ uri: firstImage }}
                      style={styles.cardImage}
                      contentFit="cover"
                      transition={300}
                    />
                  ) : (
                    <View style={styles.cardImage} />
                  )}
                  <Text style={styles.cardBrand}>{item.brand.name}</Text>
                  <Text style={styles.cardName} numberOfLines={2}>
                    {item.name}
                  </Text>
                  <Text style={styles.cardPrice}>{formatPriceLabel(item.prices)}</Text>
                </Pressable>
              );
            }}
            ListEmptyComponent={
              <View style={styles.emptyWrap}>
                <Text style={styles.emptyText}>No pieces found</Text>
              </View>
            }
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.ivory },
  filterWrap: {
    height: 52,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.lightGray,
  },
  filterRow: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: 8,
    alignItems: "center" as const,
  },
  filterChip: {
    height: 36,
    justifyContent: "center" as const,
    paddingHorizontal: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  filterChipActive: {
    backgroundColor: colors.charcoal,
    borderColor: colors.charcoal,
  },
  filterText: { fontSize: 12, color: colors.warmGray },
  filterTextActive: { color: colors.white },
  count: {
    fontSize: 12,
    color: colors.warmGray,
    textAlign: "center",
    paddingVertical: spacing.xs,
  },
  grid: { paddingHorizontal: spacing.md, paddingBottom: spacing.xxl },
  row: { gap: spacing.md, marginBottom: spacing.lg },
  card: { width: CARD_WIDTH },
  cardImage: {
    width: "100%",
    aspectRatio: 3 / 4,
    borderRadius: 2,
    backgroundColor: colors.lightGray,
  },
  cardBrand: {
    fontSize: 10,
    letterSpacing: 1.5,
    color: colors.warmGray,
    marginTop: spacing.sm,
    textTransform: "uppercase",
  },
  cardName: { fontSize: 13, color: colors.charcoal, marginTop: 2 },
  cardPrice: { fontSize: 13, color: colors.warmGray, marginTop: 2 },
  emptyWrap: { paddingVertical: spacing.xxl, alignItems: "center" },
  emptyText: { color: colors.warmGray, fontSize: 13 },
  fontFallback: { fontFamily: fonts.serif },
});
