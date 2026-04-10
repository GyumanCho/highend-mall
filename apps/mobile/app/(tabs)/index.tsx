import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { colors, fonts, spacing } from "@/lib/theme";
import { trpc } from "@/lib/trpc";
import { ProductCardSkeleton } from "@/components/skeleton";
import { ErrorState } from "@/components/error-state";

const { width } = Dimensions.get("window");
const CURATED_CARD_WIDTH = width * 0.42;

interface CuratedProduct {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  readonly brand: { readonly id: string; readonly name: string };
  readonly prices: readonly { readonly amount: string | number; readonly isDefault: boolean }[];
  readonly images: readonly { readonly id?: string; readonly url: string }[];
}

function formatPriceLabel(prices: CuratedProduct["prices"]): string {
  const def = prices.find((p) => p.isDefault) ?? prices[0];
  if (!def) return "";
  return `$${Number(def.amount).toLocaleString()}`;
}

export default function HomeScreen() {
  const {
    data: response,
    isLoading,
    isError,
    error,
    refetch,
  } = trpc.product.list.useQuery({ page: 1, limit: 6 });

  const products = (response?.data ?? []) as unknown as ReadonlyArray<CuratedProduct>;

  const brandsResponse = trpc.brand.list.useQuery({});
  const brands = (brandsResponse.data?.data ?? []) as unknown as ReadonlyArray<{
    id: string;
    name: string;
    slug: string;
  }>;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Search Bar */}
      <Pressable style={styles.searchBar} onPress={() => router.push("/search" as never)} accessibilityRole="search" accessibilityLabel="Search products and brands">
        <Ionicons name="search" size={16} color={colors.warmGray} />
        <Text style={styles.searchPlaceholder}>Search products, brands...</Text>
      </Pressable>

      {/* VIP Banner */}
      <View style={styles.vipBanner}>
        <Text style={styles.vipText}>
          Early Access: FW26 preview begins in 2 days
        </Text>
      </View>

      {/* Hero */}
      <View style={styles.hero}>
        <Text style={styles.heroSeason}>FALL/WINTER 2026</Text>
        <Text style={styles.heroTitle}>The Art of{"\n"}Quiet Luxury</Text>
        <Text style={styles.heroSubtitle}>
          Discover the defining pieces of the season, curated from the world&apos;s
          most prestigious houses.
        </Text>
        <Link href="/(tabs)/shop" asChild>
          <Pressable style={styles.heroCta}>
            <Text style={styles.heroCtaText}>EXPLORE THE COLLECTION</Text>
          </Pressable>
        </Link>
      </View>

      {/* Curated For You */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Curated for You</Text>
        <Text style={styles.sectionSubtitle}>
          The season&apos;s defining pieces, selected for your style
        </Text>

        {isError ? (
          <View style={{ paddingVertical: spacing.xl, minHeight: 240 }}>
            <ErrorState
              title="Couldn't load curation"
              message={error?.message ?? "Please try again."}
              onRetry={() => void refetch()}
            />
          </View>
        ) : isLoading ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          >
            <ProductCardSkeleton width={CURATED_CARD_WIDTH} />
            <ProductCardSkeleton width={CURATED_CARD_WIDTH} />
            <ProductCardSkeleton width={CURATED_CARD_WIDTH} />
          </ScrollView>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          >
            {products.map((item) => {
              const firstImage = item.images[0]?.url;
              return (
                <Pressable
                  key={item.id}
                  style={styles.productCard}
                  onPress={() => router.push(`/product/${item.slug}`)}
                >
                  {firstImage ? (
                    <Image
                      source={{ uri: firstImage }}
                      style={styles.productImage}
                      contentFit="cover"
                      transition={300}
                    />
                  ) : (
                    <View style={styles.productImage} />
                  )}
                  <Text style={styles.productBrand}>{item.brand.name}</Text>
                  <Text style={styles.productName} numberOfLines={2}>
                    {item.name}
                  </Text>
                  <Text style={styles.productPrice}>{formatPriceLabel(item.prices)}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
        )}
      </View>

      {/* Featured Houses */}
      {brands.length > 0 ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Houses</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.brandRow}
          >
            {brands.slice(0, 8).map((b) => (
              <Pressable
                key={b.id}
                style={styles.brandChip}
                onPress={() => router.push(`/brand/${b.slug}`)}
              >
                <Text style={styles.brandChipText}>{b.name}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      ) : null}

      {/* Collections */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Collections</Text>
        <Text style={styles.sectionSubtitle}>
          Explore the latest seasonal collections
        </Text>
        <Pressable
          style={styles.collectionsBtn}
          onPress={() => router.push("/collections" as never)}
        >
          <Text style={styles.collectionsBtnText}>VIEW ALL COLLECTIONS</Text>
          <Ionicons name="arrow-forward" size={16} color={colors.charcoal} />
        </Pressable>
      </View>

      {/* Private Sale */}
      <View style={styles.privateSale}>
        <Text style={styles.privateSaleLabel}>EXCLUSIVE ACCESS</Text>
        <Text style={styles.privateSaleTitle}>Autumn Atelier</Text>
        <Text style={styles.privateSaleText}>
          As a Gold member, you have early access to our private preview — 24
          hours before general release.
        </Text>
        <Pressable style={styles.privateSaleCta}>
          <Text style={styles.privateSaleCtaText}>PREVIEW THE COLLECTION</Text>
        </Pressable>
      </View>

      <View style={{ height: spacing.xxl }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.ivory },
  vipBanner: {
    backgroundColor: "#FFFBEB",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: "center",
  },
  vipText: { fontSize: 12, color: "#92400E", letterSpacing: 0.3 },
  hero: {
    alignItems: "center",
    paddingVertical: spacing.xxl * 1.5,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.cream,
  },
  heroSeason: {
    fontSize: 10,
    letterSpacing: 3,
    color: colors.warmGray,
    marginBottom: spacing.md,
  },
  heroTitle: {
    fontFamily: fonts.serif,
    fontSize: 42,
    textAlign: "center",
    color: colors.charcoal,
    lineHeight: 50,
  },
  heroSubtitle: {
    fontSize: 15,
    color: colors.warmGray,
    textAlign: "center",
    marginTop: spacing.md,
    lineHeight: 22,
    maxWidth: 300,
  },
  heroCta: {
    marginTop: spacing.lg,
    borderWidth: 1,
    borderColor: colors.charcoal,
    paddingVertical: 14,
    paddingHorizontal: 32,
  },
  heroCtaText: { fontSize: 11, letterSpacing: 2, color: colors.charcoal },
  section: { paddingTop: spacing.xxl, paddingBottom: spacing.lg },
  sectionTitle: {
    fontFamily: fonts.serif,
    fontSize: 28,
    textAlign: "center",
    color: colors.charcoal,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: colors.warmGray,
    textAlign: "center",
    marginTop: spacing.xs,
  },
  horizontalList: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    gap: 14,
  },
  productCard: { width: CURATED_CARD_WIDTH },
  productImage: {
    width: "100%",
    aspectRatio: 3 / 4,
    borderRadius: 2,
    backgroundColor: colors.lightGray,
  },
  productBrand: {
    fontSize: 10,
    letterSpacing: 1.5,
    color: colors.warmGray,
    marginTop: spacing.sm,
    textTransform: "uppercase",
  },
  productName: { fontSize: 13, color: colors.charcoal, marginTop: 2 },
  productPrice: { fontSize: 13, color: colors.warmGray, marginTop: 2 },
  brandRow: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    gap: 10,
  },
  brandChip: {
    borderWidth: 0.5,
    borderColor: colors.charcoal,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 24,
  },
  brandChipText: {
    fontSize: 11,
    letterSpacing: 1.5,
    color: colors.charcoal,
    textTransform: "uppercase",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  searchPlaceholder: { fontSize: 14, color: colors.warmGray },
  collectionsBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: spacing.lg,
    marginHorizontal: spacing.xl,
    borderWidth: 1,
    borderColor: colors.charcoal,
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  collectionsBtnText: { fontSize: 11, letterSpacing: 2, color: colors.charcoal },
  privateSale: {
    backgroundColor: colors.charcoal,
    paddingVertical: spacing.xxl * 1.2,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
    marginTop: spacing.xxl,
  },
  privateSaleLabel: {
    fontSize: 10,
    letterSpacing: 3,
    color: "rgba(255,255,255,0.5)",
  },
  privateSaleTitle: {
    fontFamily: fonts.serif,
    fontSize: 36,
    color: colors.white,
    marginTop: spacing.sm,
  },
  privateSaleText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
    textAlign: "center",
    marginTop: spacing.md,
    lineHeight: 20,
    maxWidth: 300,
  },
  privateSaleCta: {
    marginTop: spacing.lg,
    borderWidth: 1,
    borderColor: colors.white,
    paddingVertical: 14,
    paddingHorizontal: 32,
  },
  privateSaleCtaText: { fontSize: 11, letterSpacing: 2, color: colors.white },
});
