import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { colors, fonts, spacing } from "@/lib/theme";
import { trpc } from "@/lib/trpc";
import { Skeleton, ProductCardSkeleton } from "@/components/skeleton";
import { ErrorState } from "@/components/error-state";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - spacing.md * 3) / 2;

interface CollectionProduct {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  readonly prices: readonly { readonly amount: string | number; readonly isDefault: boolean }[];
  readonly images: readonly { readonly url: string }[];
}

function seasonLabel(season: string): string {
  const map: Record<string, string> = {
    SS: "Spring/Summer",
    PF: "Pre-Fall",
    FW: "Fall/Winter",
    RS: "Resort",
    CR: "Cruise",
    HT: "Haute Couture",
  };
  return map[season] ?? season;
}

function formatPrice(prices: CollectionProduct["prices"]): string {
  const def = prices.find((p) => p.isDefault) ?? prices[0];
  if (!def) return "";
  return `$${Number(def.amount).toLocaleString()}`;
}

export default function CollectionDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();

  const {
    data: response,
    isLoading,
    isError,
    error,
    refetch,
  } = trpc.collection.getBySlug.useQuery(
    { slug: slug ?? "" },
    { enabled: !!slug }
  );

  const collection = response?.data as
    | (Record<string, unknown> & {
        name: string;
        season: string;
        year: number;
        narrative: string | null;
        heroImageUrl: string | null;
        brand: { name: string; slug: string };
        products: ReadonlyArray<CollectionProduct>;
      })
    | undefined;

  if (isError) {
    return (
      <View style={styles.container}>
        <Header />
        <ErrorState
          title="Couldn't load collection"
          message={error?.message ?? "Please try again."}
          onRetry={() => void refetch()}
        />
      </View>
    );
  }

  if (isLoading || !collection) {
    return (
      <View style={styles.container}>
        <Header />
        <Skeleton width="100%" height={260} />
        <View style={{ padding: spacing.md }}>
          <Skeleton width={100} height={10} />
          <Skeleton width="70%" height={24} style={{ marginTop: 8 }} />
          <Skeleton width="100%" height={60} style={{ marginTop: 12 }} />
        </View>
      </View>
    );
  }

  const products = (collection.products ?? []) as unknown as ReadonlyArray<CollectionProduct>;

  return (
    <View style={styles.container}>
      <Header />
      <FlatList
        data={products}
        numColumns={2}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View>
            {/* Hero */}
            {collection.heroImageUrl ? (
              <Image
                source={{ uri: collection.heroImageUrl }}
                style={styles.hero}
                contentFit="cover"
                transition={400}
              />
            ) : (
              <View style={[styles.hero, styles.heroPlaceholder]}>
                <Ionicons name="diamond-outline" size={48} color={colors.warmGray} />
              </View>
            )}

            {/* Info */}
            <View style={styles.info}>
              <Text style={styles.brandName}>{collection.brand.name}</Text>
              <Text style={styles.title}>{collection.name}</Text>
              <Text style={styles.season}>
                {seasonLabel(collection.season)} {collection.year}
              </Text>
              {collection.narrative && (
                <Text style={styles.narrative}>{collection.narrative}</Text>
              )}
            </View>

            <Text style={styles.sectionTitle}>
              {products.length} {products.length === 1 ? "Piece" : "Pieces"}
            </Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const img = item.images[0]?.url;
          return (
            <Pressable
              style={styles.card}
              onPress={() => router.push(`/product/${item.slug}`)}
            >
              {img ? (
                <Image
                  source={{ uri: img }}
                  style={styles.cardImage}
                  contentFit="cover"
                  transition={300}
                />
              ) : (
                <View style={styles.cardImage} />
              )}
              <Text style={styles.cardName} numberOfLines={2}>{item.name}</Text>
              <Text style={styles.cardPrice}>{formatPrice(item.prices)}</Text>
            </Pressable>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyText}>No pieces in this collection yet</Text>
          </View>
        }
      />
    </View>
  );
}

function Header() {
  return (
    <View style={styles.header}>
      <Pressable onPress={() => router.back()} hitSlop={12}>
        <Ionicons name="arrow-back" size={22} color={colors.charcoal} />
      </Pressable>
      <Text style={styles.headerTitle}>COLLECTION</Text>
      <View style={{ width: 22 }} />
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
  hero: { width: "100%", height: 260 },
  heroPlaceholder: {
    backgroundColor: colors.lightGray,
    justifyContent: "center",
    alignItems: "center",
  },
  info: { padding: spacing.md },
  brandName: {
    fontSize: 10,
    letterSpacing: 2,
    color: colors.warmGray,
    textTransform: "uppercase",
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: 24,
    color: colors.charcoal,
    marginTop: 4,
  },
  season: { fontSize: 13, color: colors.warmGray, marginTop: 2 },
  narrative: {
    fontSize: 14,
    color: colors.warmGray,
    lineHeight: 22,
    marginTop: spacing.md,
  },
  sectionTitle: {
    fontSize: 12,
    letterSpacing: 1,
    color: colors.warmGray,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    textTransform: "uppercase",
  },
  listContent: { paddingBottom: spacing.xxl },
  row: { paddingHorizontal: spacing.md, gap: spacing.md, marginBottom: spacing.lg },
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
