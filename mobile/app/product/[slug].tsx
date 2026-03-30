import { View, Text, ScrollView, Pressable, StyleSheet, Dimensions } from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams, router } from "expo-router";
import { useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useCartStore, useWishlistStore } from "@/lib/stores";
import { colors, fonts, spacing } from "@/lib/theme";

const { width } = Dimensions.get("window");

// Mock product data — in production, fetch from API by slug
const PRODUCTS: Record<string, {
  id: string; name: string; brand: string; price: number; titleDisplay: string;
  descriptionHero: string; descriptionFull: string; materials: Record<string, string>;
  collection: string; categoryPath: string;
  images: { url: string; label: string }[];
}> = {
  "gucci-gg-marmont-small-shoulder-bag": {
    id: "p1", name: "GG Marmont Small Shoulder Bag", brand: "Gucci", price: 2350,
    titleDisplay: "GG Marmont Small Shoulder Bag in Matelasse Chevron Calfskin",
    descriptionHero: "A defining expression of Gucci's contemporary elegance, uniting the House's storied heritage with modern Italian craftsmanship.",
    descriptionFull: "Since Alessandro Michele reimagined the double G monogram for a new generation, the Marmont line has stood as a bridge between Gucci's Florentine roots and its ever-evolving creative vision.\n\nCrafted from matelasse chevron calfskin, the bag reveals its quality through texture and weight. The chevron quilting is achieved through a meticulous process that requires the leather to be softened, layered, and stitched with precision that only seasoned Gucci artisans possess.\n\nThe antique gold-toned brass hardware carries the interlocking GG emblem, a motif drawn from the House's archival codes dating to the 1970s.",
    materials: { primary: "Matelasse chevron calfskin", secondary: "Antique gold-toned brass hardware", lining: "Microfiber" },
    collection: "FW26", categoryPath: "Bags > Shoulder Bags",
    images: [
      { url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80", label: "Front" },
      { url: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&q=80", label: "Detail" },
      { url: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80", label: "Lifestyle" },
    ],
  },
  "bottega-veneta-cassette-bag-intreccio": {
    id: "p2", name: "Cassette Bag in Intreccio Leather", brand: "Bottega Veneta", price: 3200,
    titleDisplay: "Cassette Bag in Intreccio Nappa Leather",
    descriptionHero: "The Cassette reimagines Bottega Veneta's signature intreccio weave in a bold, contemporary silhouette.",
    descriptionFull: "The Cassette bag speaks to Bottega Veneta's mastery of leather craft. The oversized intreccio weave transforms supple nappa leather into a tactile, sculptural form.\n\nEach strip of leather is cut, softened, and hand-woven by artisans in Vicenza. The result is a bag that feels as considered to the touch as it appears to the eye.\n\nIn keeping with Bottega Veneta's philosophy of stealth luxury, there is no visible logo. The weave itself is the signature.",
    materials: { primary: "Intreccio nappa leather", secondary: "Gold-finished hardware", lining: "Suede" },
    collection: "FW26", categoryPath: "Bags > Crossbody Bags",
    images: [
      { url: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80", label: "Front" },
      { url: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=800&q=80", label: "Detail" },
      { url: "https://images.unsplash.com/photo-1612902456551-404b5b2e20be?w=800&q=80", label: "Model" },
    ],
  },
  "celine-triomphe-shoulder-bag-shiny-calfskin": {
    id: "p3", name: "Triomphe Shoulder Bag in Shiny Calfskin", brand: "Celine", price: 4150,
    titleDisplay: "Triomphe Shoulder Bag in Shiny Calfskin",
    descriptionHero: "The Triomphe clasp — drawn from the chains along the Arc de Triomphe — anchors Celine's vision of Parisian refinement.",
    descriptionFull: "The Triomphe bag is a study in restraint and precision. Its namesake clasp, inspired by the interlocking chains that adorn the Arc de Triomphe in Paris, is both a functional closure and a quiet declaration of heritage.\n\nCrafted from shiny calfskin, the leather develops a distinctive patina with wear — growing more personal over time.\n\nCeline's approach to luxury is one of reduction: every element earns its place.",
    materials: { primary: "Shiny calfskin", secondary: "Gold-finished brass hardware", lining: "Lambskin" },
    collection: "FW26", categoryPath: "Bags > Shoulder Bags",
    images: [
      { url: "https://images.unsplash.com/photo-1614179689702-355944cd0918?w=800&q=80", label: "Front" },
      { url: "https://images.unsplash.com/photo-1575032617751-6ddec2089882?w=800&q=80", label: "Clasp" },
      { url: "https://images.unsplash.com/photo-1606522754091-a05c6b5f21e3?w=800&q=80", label: "Styled" },
    ],
  },
  "the-row-margaux-15-smooth-calfskin": {
    id: "p4", name: "Margaux 15 Bag in Smooth Calfskin", brand: "The Row", price: 5490,
    titleDisplay: "Margaux 15 Bag in Smooth Calfskin",
    descriptionHero: "The Margaux is The Row's definitive statement on understated luxury — a bag that needs no introduction.",
    descriptionFull: "The Margaux 15 is the ultimate expression of The Row's design philosophy: that true luxury lies in what you don't see.\n\nThe smooth calfskin — sourced from a single Italian tannery — is cut and assembled by hand.\n\nThe Margaux doesn't announce itself. It rewards those who look closely.",
    materials: { primary: "Smooth calfskin", lining: "Suede" },
    collection: "FW26", categoryPath: "Bags > Top Handle Bags",
    images: [
      { url: "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=800&q=80", label: "Front" },
      { url: "https://images.unsplash.com/photo-1600857062241-98e5dba7f214?w=800&q=80", label: "Interior" },
      { url: "https://images.unsplash.com/photo-1559563458-527698bf5295?w=800&q=80", label: "Lifestyle" },
    ],
  },
  "jacquemus-le-chiquito-long-smooth-leather": {
    id: "p5", name: "Le Chiquito Long in Smooth Leather", brand: "Jacquemus", price: 495,
    titleDisplay: "Le Chiquito Long in Smooth Leather",
    descriptionHero: "Le Chiquito Long captures Jacquemus's gift for turning playful proportion into an enduring icon.",
    descriptionFull: "Simon Porte Jacquemus has an instinct for scale. The Le Chiquito has grown into a family of bags that balance wit with wearability.\n\nCrafted from smooth leather in a palette inspired by the south of France.\n\nThis is contemporary luxury at its most direct: a bag that makes you smile without asking permission.",
    materials: { primary: "Smooth leather", secondary: "Gold-toned metal hardware" },
    collection: "FW26", categoryPath: "Bags > Mini Bags",
    images: [
      { url: "https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?w=800&q=80", label: "Front" },
      { url: "https://images.unsplash.com/photo-1604177091072-fa7fbc09e281?w=800&q=80", label: "Buckle" },
      { url: "https://images.unsplash.com/photo-1581404917879-53e19259fdda?w=800&q=80", label: "Model" },
    ],
  },
};

export default function ProductDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const product = PRODUCTS[slug ?? ""];
  const scrollRef = useRef<ScrollView>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [addedToBag, setAddedToBag] = useState(false);

  const addToCart = useCartStore((s) => s.addItem);
  const { isInWishlist, toggleItem } = useWishlistStore();

  if (!product) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>Product not found</Text>
      </View>
    );
  }

  const inWishlist = isInWishlist(product.id);

  function handleAddToBag() {
    addToCart({
      productId: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      size: "One Size",
      slug: slug ?? "",
      imageUrl: product.images[0]?.url ?? null,
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setAddedToBag(true);
    setTimeout(() => setAddedToBag(false), 2000);
  }

  function handleToggleWishlist() {
    toggleItem({
      productId: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      slug: slug ?? "",
      imageUrl: product.images[0]?.url ?? null,
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }

  function handleImageScroll(event: { nativeEvent: { contentOffset: { x: number } } }) {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveImage(index);
  }

  return (
    <View style={styles.container}>
      {/* Back button */}
      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="chevron-back" size={24} color={colors.charcoal} />
      </Pressable>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Image gallery */}
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleImageScroll}
        >
          {product.images.map((img, i) => (
            <Image key={i} source={{ uri: img.url }} style={styles.galleryImage} contentFit="cover" transition={200} />
          ))}
        </ScrollView>

        {/* Dots */}
        <View style={styles.dots}>
          {product.images.map((_, i) => (
            <View key={i} style={[styles.dot, i === activeImage && styles.dotActive]} />
          ))}
        </View>

        {/* Product info */}
        <View style={styles.info}>
          <Text style={styles.brand}>{product.brand}</Text>
          <Text style={styles.title}>{product.titleDisplay}</Text>
          <Text style={styles.price}>${product.price.toLocaleString()}</Text>
          <Text style={styles.hero}>{product.descriptionHero}</Text>

          {/* Size */}
          <Text style={styles.sectionLabel}>SIZE</Text>
          <View style={styles.sizeRow}>
            <Pressable style={styles.sizeChip}>
              <Text style={styles.sizeText}>One Size</Text>
            </Pressable>
          </View>

          {/* Materials */}
          <Text style={styles.sectionLabel}>MATERIALS</Text>
          {Object.entries(product.materials).map(([key, value]) => (
            <Text key={key} style={styles.materialText}>
              {key.charAt(0).toUpperCase() + key.slice(1)}: {value}
            </Text>
          ))}

          {/* The Story */}
          <Text style={styles.storyTitle}>The Story</Text>
          {product.descriptionFull.split("\n\n").map((p, i) => (
            <Text key={i} style={styles.storyText}>{p}</Text>
          ))}

          {/* Details */}
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Collection</Text>
            <Text style={styles.detailValue}>{product.collection}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Category</Text>
            <Text style={styles.detailValue}>{product.categoryPath}</Text>
          </View>
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
            {addedToBag ? "ADDED TO BAG" : `ADD TO BAG · $${product.price.toLocaleString()}`}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.ivory },
  empty: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { color: colors.warmGray },
  backButton: { position: "absolute", top: 56, left: 16, zIndex: 10, width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(255,255,255,0.9)", justifyContent: "center", alignItems: "center" },
  scrollContent: { paddingBottom: 0 },
  galleryImage: { width, aspectRatio: 1, backgroundColor: colors.lightGray },
  dots: { flexDirection: "row", justifyContent: "center", gap: 6, paddingVertical: 12 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.lightGray },
  dotActive: { backgroundColor: colors.charcoal, width: 18 },
  info: { paddingHorizontal: spacing.md, paddingTop: spacing.md },
  brand: { fontSize: 10, letterSpacing: 3, color: colors.warmGray, textTransform: "uppercase" },
  title: { fontFamily: fonts.serif, fontSize: 24, color: colors.charcoal, marginTop: 4, lineHeight: 32 },
  price: { fontSize: 18, color: colors.charcoal, marginTop: spacing.sm },
  hero: { fontSize: 14, color: colors.warmGray, lineHeight: 22, marginTop: spacing.md },
  sectionLabel: { fontSize: 10, letterSpacing: 2, color: colors.warmGray, marginTop: spacing.xl },
  sizeRow: { flexDirection: "row", gap: 8, marginTop: spacing.sm },
  sizeChip: { borderWidth: 1, borderColor: colors.charcoal, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 4 },
  sizeText: { fontSize: 12, color: colors.charcoal },
  materialText: { fontSize: 13, color: colors.warmGray, marginTop: 4 },
  storyTitle: { fontFamily: fonts.serif, fontSize: 22, color: colors.charcoal, marginTop: spacing.xxl, textAlign: "center" },
  storyText: { fontSize: 14, color: colors.warmGray, lineHeight: 22, marginTop: spacing.md },
  detailRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 14, borderTopWidth: 0.5, borderTopColor: colors.lightGray, marginTop: spacing.sm },
  detailLabel: { fontSize: 12, color: colors.warmGray },
  detailValue: { fontSize: 12, color: colors.charcoal },
  cta: { position: "absolute", bottom: 0, left: 0, right: 0, flexDirection: "row", gap: 12, paddingHorizontal: spacing.md, paddingTop: 12, paddingBottom: 34, backgroundColor: "rgba(255,255,255,0.97)", borderTopWidth: 0.5, borderTopColor: colors.lightGray },
  heartBtn: { width: 48, height: 48, borderRadius: 12, borderWidth: 1, borderColor: colors.lightGray, justifyContent: "center", alignItems: "center" },
  bagBtn: { flex: 1, backgroundColor: colors.charcoal, borderRadius: 12, justifyContent: "center", alignItems: "center", height: 48 },
  bagBtnAdded: { backgroundColor: colors.green },
  bagBtnText: { color: colors.white, fontSize: 12, letterSpacing: 2 },
});
