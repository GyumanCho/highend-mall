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
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { useWishlistStore } from "@/lib/stores";
import { useAuthStore } from "@/lib/auth";
import { trpc } from "@/lib/trpc";
import { colors, fonts, spacing } from "@/lib/theme";
import { ProductCardSkeleton } from "@/components/skeleton";
import { ErrorState } from "@/components/error-state";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - spacing.md * 3) / 2;

interface WishlistViewItem {
  readonly id: string;
  readonly productId: string;
  readonly productSlug: string;
  readonly name: string;
  readonly brand: string;
  readonly price: number;
  readonly imageUrl: string | null;
}

export default function WishlistScreen() {
  const customer = useAuthStore((s) => s.customer);
  const localItems = useWishlistStore((s) => s.items);
  const localToggle = useWishlistStore((s) => s.toggleItem);

  // 로그인 시: 서버 wishlist 사용
  const serverQuery = trpc.wishlist.list.useQuery(undefined, {
    enabled: !!customer,
  });
  const utils = trpc.useUtils();
  const toggleMutation = trpc.wishlist.toggle.useMutation({
    onSuccess: () => utils.wishlist.list.invalidate(),
  });

  // 비로그인: 로컬 store, 로그인: 서버 데이터
  let items: WishlistViewItem[] = [];

  if (customer) {
    if (serverQuery.isLoading) {
      return (
        <View style={styles.grid}>
          <View style={styles.row}>
            <ProductCardSkeleton width={CARD_WIDTH} />
            <ProductCardSkeleton width={CARD_WIDTH} />
          </View>
        </View>
      );
    }
    if (serverQuery.isError) {
      return (
        <ErrorState
          title="Couldn't load wishlist"
          message={serverQuery.error?.message ?? "Please try again."}
          onRetry={() => void serverQuery.refetch()}
        />
      );
    }
    const raw = (serverQuery.data?.data ?? []) as unknown as ReadonlyArray<{
      id: string;
      productId: string;
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
        productSlug: it.product.slug,
        name: it.product.name,
        brand: it.product.brand.name,
        price: price ? Number(price.amount) : 0,
        imageUrl: it.product.images[0]?.url ?? null,
      };
    });
  } else {
    items = localItems.map((it) => ({
      id: it.productId,
      productId: it.productId,
      productSlug: it.slug,
      name: it.name,
      brand: it.brand,
      price: it.price,
      imageUrl: it.imageUrl,
    }));
  }

  function handleRemove(item: WishlistViewItem) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (customer) {
      toggleMutation.mutate({ productId: item.productId });
    } else {
      localToggle({
        productId: item.productId,
        name: item.name,
        brand: item.brand,
        price: item.price,
        slug: item.productSlug,
        imageUrl: item.imageUrl,
      });
    }
  }

  if (items.length === 0) {
    return (
      <View style={styles.empty}>
        <Ionicons name="heart-outline" size={48} color={colors.lightGray} />
        <Text style={styles.emptyTitle}>No saved pieces</Text>
        <Text style={styles.emptyText}>
          Tap the heart icon on any product to save it here.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={items}
      numColumns={2}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.grid}
      showsVerticalScrollIndicator={false}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Pressable
          style={styles.card}
          onPress={() => router.push(`/product/${item.productSlug}`)}
        >
          <View>
            <Image
              source={{ uri: item.imageUrl ?? undefined }}
              style={styles.cardImage}
              contentFit="cover"
              transition={300}
            />
            <Pressable
              onPress={(e) => {
                e.stopPropagation();
                handleRemove(item);
              }}
              style={styles.removeButton}
              hitSlop={8}
            >
              <Ionicons name="close" size={14} color={colors.charcoal} />
            </Pressable>
          </View>
          <Text style={styles.cardBrand}>{item.brand}</Text>
          <Text style={styles.cardName} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={styles.cardPrice}>${item.price.toLocaleString()}</Text>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.ivory,
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
  grid: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
  },
  row: { gap: spacing.md, marginBottom: spacing.lg },
  card: { width: CARD_WIDTH },
  cardImage: {
    width: "100%",
    aspectRatio: 3 / 4,
    borderRadius: 2,
    backgroundColor: colors.lightGray,
  },
  removeButton: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.9)",
    justifyContent: "center",
    alignItems: "center",
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
});
