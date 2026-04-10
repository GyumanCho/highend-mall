import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Dimensions,
  FlatList,
} from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams, router, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { trpc } from "@/lib/trpc";
import { colors, fonts, spacing } from "@/lib/theme";
import { ProductCardSkeleton } from "@/components/skeleton";
import { ErrorState } from "@/components/error-state";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - spacing.md * 3) / 2;

interface BrandProduct {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
  readonly prices: ReadonlyArray<{ amount: string | number; isDefault: boolean }>;
  readonly images: ReadonlyArray<{ url: string }>;
}

interface BrandDetail {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
  readonly tier: string;
  readonly description: string | null;
  readonly products: ReadonlyArray<BrandProduct>;
}

export default function BrandDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { data, isLoading, isError, error, refetch } =
    trpc.brand.getBySlug.useQuery({ slug: slug ?? "" }, { enabled: !!slug });

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={{ paddingTop: 100, paddingHorizontal: spacing.md }}>
          <View style={styles.row}>
            <ProductCardSkeleton width={CARD_WIDTH} />
            <ProductCardSkeleton width={CARD_WIDTH} />
          </View>
        </View>
      </View>
    );
  }

  if (isError || !data?.data) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.charcoal} />
        </Pressable>
        <ErrorState
          title="Brand not found"
          message={error?.message ?? "Please try again."}
          onRetry={() => void refetch()}
        />
      </View>
    );
  }

  const brand = data.data as unknown as BrandDetail;

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <FlatList
        data={brand.products}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} style={styles.backBtn}>
              <Ionicons name="chevron-back" size={24} color={colors.charcoal} />
            </Pressable>
            <Text style={styles.tier}>{brand.tier}</Text>
            <Text style={styles.brandName}>{brand.name}</Text>
            {brand.description ? (
              <Text style={styles.description}>{brand.description}</Text>
            ) : null}
            <Text style={styles.count}>
              {brand.products.length} pieces
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const price =
            item.prices.find((p) => p.isDefault) ?? item.prices[0];
          const amount = price ? Number(price.amount) : 0;
          const firstImage = item.images[0]?.url;
          return (
            <Pressable
              style={styles.card}
              onPress={() => router.push(`/product/${item.slug}`)}
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
              <Text style={styles.cardName} numberOfLines={2}>
                {item.name}
              </Text>
              <Text style={styles.cardPrice}>${amount.toLocaleString()}</Text>
            </Pressable>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyText}>No products available</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.ivory },
  backBtn: {
    position: "absolute",
    top: 56,
    left: spacing.md,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.9)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  header: {
    paddingTop: 110,
    paddingBottom: spacing.xl,
    alignItems: "center",
    paddingHorizontal: spacing.lg,
  },
  tier: {
    fontSize: 10,
    letterSpacing: 3,
    color: colors.gold,
    textTransform: "uppercase",
  },
  brandName: {
    fontFamily: fonts.serif,
    fontSize: 36,
    color: colors.charcoal,
    marginTop: spacing.sm,
    textAlign: "center",
  },
  description: {
    fontSize: 13,
    color: colors.warmGray,
    textAlign: "center",
    lineHeight: 20,
    marginTop: spacing.md,
    maxWidth: 320,
  },
  count: {
    fontSize: 11,
    letterSpacing: 1,
    color: colors.warmGray,
    marginTop: spacing.lg,
  },
  list: { paddingHorizontal: spacing.md, paddingBottom: spacing.xxl },
  row: { gap: spacing.md, marginBottom: spacing.lg },
  card: { width: CARD_WIDTH },
  cardImage: {
    width: "100%",
    aspectRatio: 3 / 4,
    borderRadius: 2,
    backgroundColor: colors.lightGray,
  },
  cardName: { fontSize: 13, color: colors.charcoal, marginTop: spacing.sm },
  cardPrice: { fontSize: 13, color: colors.warmGray, marginTop: 2 },
  emptyWrap: { paddingVertical: spacing.xxl, alignItems: "center" },
  emptyText: { color: colors.warmGray, fontSize: 13 },
});
