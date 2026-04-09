import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams, router } from "expo-router";
import { useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useCartStore, useWishlistStore } from "@/lib/stores";
import { colors, fonts, spacing } from "@/lib/theme";
import { trpc } from "@/lib/trpc";

const { width } = Dimensions.get("window");

export default function ProductDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const scrollRef = useRef<ScrollView>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [addedToBag, setAddedToBag] = useState(false);

  const addToCart = useCartStore((s) => s.addItem);
  const { isInWishlist, toggleItem } = useWishlistStore();

  const { data, isLoading, isError, error } = trpc.product.getBySlug.useQuery(
    { slug: slug ?? "" },
    { enabled: !!slug }
  );

  if (isLoading) {
    return (
      <View style={styles.empty}>
        <ActivityIndicator color={colors.charcoal} />
      </View>
    );
  }

  if (isError || !data?.data) {
    return (
      <View style={styles.empty}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.charcoal} />
        </Pressable>
        <Text style={styles.emptyText}>
          {isError ? (error?.message ?? "Product not found") : "Product not found"}
        </Text>
      </View>
    );
  }

  // tRPC v11 + Prisma include의 깊은 타입 추론(TS2589) 회피를 위해
  // 구조만 가진 얕은 로컬 타입으로 단절.
  interface ProductPrice {
    readonly amount: string | number;
    readonly isDefault: boolean;
  }
  interface ProductImage {
    readonly id?: string;
    readonly url: string;
  }
  interface ProductView {
    readonly id: string;
    readonly name: string;
    readonly slug: string;
    readonly titleDisplay: string | null;
    readonly descriptionHero: string | null;
    readonly descriptionFull: string | null;
    readonly collection: string | null;
    readonly categoryPath: string | null;
    readonly materials: Record<string, string> | null;
    readonly brand: { readonly id: string; readonly name: string };
    readonly prices: readonly ProductPrice[];
    readonly images: readonly ProductImage[];
  }

  const product = data.data as unknown as ProductView;
  const defaultPrice =
    product.prices.find((p) => p.isDefault) ?? product.prices[0];
  const priceAmount = defaultPrice ? Number(defaultPrice.amount) : 0;
  const materials = (product.materials ?? {}) as Record<string, string>;
  const firstImage = product.images[0]?.url ?? null;
  const inWishlist = isInWishlist(product.id);

  function handleAddToBag() {
    addToCart({
      productId: product.id,
      name: product.name,
      brand: product.brand.name,
      price: priceAmount,
      size: "One Size",
      slug: slug ?? "",
      imageUrl: firstImage,
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setAddedToBag(true);
    setTimeout(() => setAddedToBag(false), 2000);
  }

  function handleToggleWishlist() {
    toggleItem({
      productId: product.id,
      name: product.name,
      brand: product.brand.name,
      price: priceAmount,
      slug: slug ?? "",
      imageUrl: firstImage,
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }

  function handleImageScroll(event: {
    nativeEvent: { contentOffset: { x: number } };
  }) {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveImage(index);
  }

  return (
    <View style={styles.container}>
      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="chevron-back" size={24} color={colors.charcoal} />
      </Pressable>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Image gallery */}
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleImageScroll}
        >
          {product.images.map((img, i) => (
            <Image
              key={img.id ?? i}
              source={{ uri: img.url }}
              style={styles.galleryImage}
              contentFit="cover"
              transition={200}
            />
          ))}
        </ScrollView>

        {/* Dots */}
        <View style={styles.dots}>
          {product.images.map((img, i) => (
            <View
              key={img.id ?? i}
              style={[styles.dot, i === activeImage && styles.dotActive]}
            />
          ))}
        </View>

        {/* Product info */}
        <View style={styles.info}>
          <Text style={styles.brand}>{product.brand.name}</Text>
          <Text style={styles.title}>{product.titleDisplay ?? product.name}</Text>
          <Text style={styles.price}>${priceAmount.toLocaleString()}</Text>
          {product.descriptionHero ? (
            <Text style={styles.hero}>{product.descriptionHero}</Text>
          ) : null}

          {/* Size */}
          <Text style={styles.sectionLabel}>SIZE</Text>
          <View style={styles.sizeRow}>
            <Pressable style={styles.sizeChip}>
              <Text style={styles.sizeText}>One Size</Text>
            </Pressable>
          </View>

          {/* Materials */}
          {Object.keys(materials).length > 0 ? (
            <>
              <Text style={styles.sectionLabel}>MATERIALS</Text>
              {Object.entries(materials).map(([key, value]) => (
                <Text key={key} style={styles.materialText}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}: {value}
                </Text>
              ))}
            </>
          ) : null}

          {/* The Story */}
          {product.descriptionFull ? (
            <>
              <Text style={styles.storyTitle}>The Story</Text>
              {product.descriptionFull.split("\n\n").map((p, i) => (
                <Text key={i} style={styles.storyText}>
                  {p}
                </Text>
              ))}
            </>
          ) : null}

          {/* Details */}
          {product.collection ? (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Collection</Text>
              <Text style={styles.detailValue}>{product.collection}</Text>
            </View>
          ) : null}
          {product.categoryPath ? (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Category</Text>
              <Text style={styles.detailValue}>{product.categoryPath}</Text>
            </View>
          ) : null}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Sticky CTA */}
      <View style={styles.cta}>
        <Pressable onPress={handleToggleWishlist} style={styles.heartBtn}>
          <Ionicons
            name={inWishlist ? "heart" : "heart-outline"}
            size={22}
            color={inWishlist ? colors.red : colors.warmGray}
          />
        </Pressable>
        <Pressable
          onPress={handleAddToBag}
          style={[styles.bagBtn, addedToBag && styles.bagBtnAdded]}
        >
          <Text style={styles.bagBtnText}>
            {addedToBag
              ? "ADDED TO BAG"
              : `ADD TO BAG · $${priceAmount.toLocaleString()}`}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.ivory },
  empty: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { color: colors.warmGray, marginTop: 12 },
  backButton: {
    position: "absolute",
    top: 56,
    left: 16,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: { paddingBottom: 0 },
  galleryImage: {
    width,
    aspectRatio: 1,
    backgroundColor: colors.lightGray,
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
  },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.lightGray },
  dotActive: { backgroundColor: colors.charcoal, width: 18 },
  info: { paddingHorizontal: spacing.md, paddingTop: spacing.md },
  brand: {
    fontSize: 10,
    letterSpacing: 3,
    color: colors.warmGray,
    textTransform: "uppercase",
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: 24,
    color: colors.charcoal,
    marginTop: 4,
    lineHeight: 32,
  },
  price: { fontSize: 18, color: colors.charcoal, marginTop: spacing.sm },
  hero: {
    fontSize: 14,
    color: colors.warmGray,
    lineHeight: 22,
    marginTop: spacing.md,
  },
  sectionLabel: {
    fontSize: 10,
    letterSpacing: 2,
    color: colors.warmGray,
    marginTop: spacing.xl,
  },
  sizeRow: { flexDirection: "row", gap: 8, marginTop: spacing.sm },
  sizeChip: {
    borderWidth: 1,
    borderColor: colors.charcoal,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
  },
  sizeText: { fontSize: 12, color: colors.charcoal },
  materialText: { fontSize: 13, color: colors.warmGray, marginTop: 4 },
  storyTitle: {
    fontFamily: fonts.serif,
    fontSize: 22,
    color: colors.charcoal,
    marginTop: spacing.xxl,
    textAlign: "center",
  },
  storyText: {
    fontSize: 14,
    color: colors.warmGray,
    lineHeight: 22,
    marginTop: spacing.md,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderTopWidth: 0.5,
    borderTopColor: colors.lightGray,
    marginTop: spacing.sm,
  },
  detailLabel: { fontSize: 12, color: colors.warmGray },
  detailValue: { fontSize: 12, color: colors.charcoal },
  cta: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: spacing.md,
    paddingTop: 12,
    paddingBottom: 34,
    backgroundColor: "rgba(255,255,255,0.97)",
    borderTopWidth: 0.5,
    borderTopColor: colors.lightGray,
  },
  heartBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.lightGray,
    justifyContent: "center",
    alignItems: "center",
  },
  bagBtn: {
    flex: 1,
    backgroundColor: colors.charcoal,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    height: 48,
  },
  bagBtnAdded: { backgroundColor: colors.green },
  bagBtnText: { color: colors.white, fontSize: 12, letterSpacing: 2 },
});
