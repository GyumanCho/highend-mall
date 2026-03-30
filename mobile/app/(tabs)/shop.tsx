import { View, Text, FlatList, Pressable, ScrollView, StyleSheet, Dimensions } from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useState } from "react";
import { colors, fonts, spacing } from "@/lib/theme";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - spacing.md * 3) / 2;

const PRODUCTS = [
  { id: "p1", slug: "gucci-gg-marmont-small-shoulder-bag", name: "GG Marmont Shoulder Bag", brand: "Gucci", price: "$2,350", tier: "CORE", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&q=80" },
  { id: "p2", slug: "bottega-veneta-cassette-bag-intreccio", name: "Cassette Bag in Intreccio", brand: "Bottega Veneta", price: "$3,200", tier: "CORE", image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&q=80" },
  { id: "p3", slug: "celine-triomphe-shoulder-bag-shiny-calfskin", name: "Triomphe Shoulder Bag", brand: "Celine", price: "$4,150", tier: "CORE", image: "https://images.unsplash.com/photo-1614179689702-355944cd0918?w=400&q=80" },
  { id: "p4", slug: "the-row-margaux-15-smooth-calfskin", name: "Margaux 15 Bag", brand: "The Row", price: "$5,490", tier: "ULTRA", image: "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=400&q=80" },
  { id: "p5", slug: "jacquemus-le-chiquito-long-smooth-leather", name: "Le Chiquito Long", brand: "Jacquemus", price: "$495", tier: "ACCESSIBLE", image: "https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?w=400&q=80" },
];

const BRANDS = ["All", "Gucci", "Bottega Veneta", "Celine", "The Row", "Jacquemus"];

export default function ShopScreen() {
  const [activeBrand, setActiveBrand] = useState("All");

  const filtered = activeBrand === "All" ? PRODUCTS : PRODUCTS.filter((p) => p.brand === activeBrand);

  return (
    <View style={styles.container}>
      {/* Brand filter — ScrollView (not FlatList) to avoid nesting issues */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {BRANDS.map((brand) => (
          <Pressable
            key={brand}
            onPress={() => setActiveBrand(brand)}
            style={[styles.filterChip, activeBrand === brand && styles.filterChipActive]}
          >
            <Text style={[styles.filterText, activeBrand === brand && styles.filterTextActive]}>
              {brand}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <Text style={styles.count}>{filtered.length} pieces</Text>

      {/* Product grid */}
      <FlatList
        data={filtered}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable style={styles.card} onPress={() => router.push(`/product/${item.slug}`)}>
            <Image source={{ uri: item.image }} style={styles.cardImage} contentFit="cover" transition={300} />
            <Text style={styles.cardBrand}>{item.brand}</Text>
            <Text style={styles.cardName} numberOfLines={2}>{item.name}</Text>
            <Text style={styles.cardPrice}>{item.price}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.ivory },
  filterRow: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, gap: 8 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: colors.lightGray },
  filterChipActive: { backgroundColor: colors.charcoal, borderColor: colors.charcoal },
  filterText: { fontSize: 12, color: colors.warmGray },
  filterTextActive: { color: colors.white },
  count: { fontSize: 12, color: colors.warmGray, textAlign: "center", paddingVertical: spacing.xs },
  grid: { paddingHorizontal: spacing.md, paddingBottom: spacing.xxl },
  row: { gap: spacing.md, marginBottom: spacing.lg },
  card: { width: CARD_WIDTH },
  cardImage: { width: "100%", aspectRatio: 3 / 4, borderRadius: 2, backgroundColor: colors.lightGray },
  cardBrand: { fontSize: 10, letterSpacing: 1.5, color: colors.warmGray, marginTop: spacing.sm, textTransform: "uppercase" },
  cardName: { fontSize: 13, color: colors.charcoal, marginTop: 2 },
  cardPrice: { fontSize: 13, color: colors.warmGray, marginTop: 2 },
});
