import { View, Text, ScrollView, Pressable, StyleSheet, Dimensions } from "react-native";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { colors, fonts, spacing } from "@/lib/theme";

const { width } = Dimensions.get("window");

const CURATED_ITEMS = [
  { id: "p1", name: "GG Marmont Shoulder Bag", brand: "Gucci", price: "$2,350", slug: "gucci-gg-marmont-small-shoulder-bag", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&q=80" },
  { id: "p2", name: "Cassette Bag in Intreccio", brand: "Bottega Veneta", price: "$3,200", slug: "bottega-veneta-cassette-bag-intreccio", image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&q=80" },
  { id: "p3", name: "Triomphe Shoulder Bag", brand: "Celine", price: "$4,150", slug: "celine-triomphe-shoulder-bag-shiny-calfskin", image: "https://images.unsplash.com/photo-1614179689702-355944cd0918?w=400&q=80" },
  { id: "p4", name: "Margaux 15 Bag", brand: "The Row", price: "$5,490", slug: "the-row-margaux-15-smooth-calfskin", image: "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=400&q=80" },
] as const;

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* VIP Banner */}
      <View style={styles.vipBanner}>
        <Text style={styles.vipText}>Early Access: FW26 preview begins in 2 days</Text>
      </View>

      {/* Hero */}
      <View style={styles.hero}>
        <Text style={styles.heroSeason}>FALL/WINTER 2026</Text>
        <Text style={styles.heroTitle}>The Art of{"\n"}Quiet Luxury</Text>
        <Text style={styles.heroSubtitle}>
          Discover the defining pieces of the season, curated from the world's most prestigious houses.
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
          The season's defining pieces, selected for your style
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
          {CURATED_ITEMS.map((item) => (
            <View key={item.id} style={styles.productCard}>
              <Image source={{ uri: item.image }} style={styles.productImage} contentFit="cover" transition={300} />
              <Text style={styles.productBrand}>{item.brand}</Text>
              <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
              <Text style={styles.productPrice}>{item.price}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Private Sale */}
      <View style={styles.privateSale}>
        <Text style={styles.privateSaleLabel}>EXCLUSIVE ACCESS</Text>
        <Text style={styles.privateSaleTitle}>Autumn Atelier</Text>
        <Text style={styles.privateSaleText}>
          As a Gold member, you have early access to our private preview — 24 hours before general release.
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
  vipBanner: { backgroundColor: "#FFFBEB", paddingVertical: spacing.sm, paddingHorizontal: spacing.md, alignItems: "center" },
  vipText: { fontSize: 12, color: "#92400E", letterSpacing: 0.3 },
  hero: { alignItems: "center", paddingVertical: spacing.xxl * 1.5, paddingHorizontal: spacing.lg, backgroundColor: colors.cream },
  heroSeason: { fontSize: 10, letterSpacing: 3, color: colors.warmGray, marginBottom: spacing.md },
  heroTitle: { fontFamily: fonts.serif, fontSize: 42, textAlign: "center", color: colors.charcoal, lineHeight: 50 },
  heroSubtitle: { fontSize: 15, color: colors.warmGray, textAlign: "center", marginTop: spacing.md, lineHeight: 22, maxWidth: 300 },
  heroCta: { marginTop: spacing.lg, borderWidth: 1, borderColor: colors.charcoal, paddingVertical: 14, paddingHorizontal: 32 },
  heroCtaText: { fontSize: 11, letterSpacing: 2, color: colors.charcoal },
  section: { paddingTop: spacing.xxl, paddingBottom: spacing.lg },
  sectionTitle: { fontFamily: fonts.serif, fontSize: 28, textAlign: "center", color: colors.charcoal },
  sectionSubtitle: { fontSize: 13, color: colors.warmGray, textAlign: "center", marginTop: spacing.xs },
  horizontalList: { paddingHorizontal: spacing.md, paddingTop: spacing.lg, gap: 14 },
  productCard: { width: width * 0.42 },
  productImage: { width: "100%", aspectRatio: 3 / 4, borderRadius: 2, backgroundColor: colors.lightGray },
  productBrand: { fontSize: 10, letterSpacing: 1.5, color: colors.warmGray, marginTop: spacing.sm, textTransform: "uppercase" },
  productName: { fontSize: 13, color: colors.charcoal, marginTop: 2 },
  productPrice: { fontSize: 13, color: colors.warmGray, marginTop: 2 },
  privateSale: { backgroundColor: colors.charcoal, paddingVertical: spacing.xxl * 1.2, paddingHorizontal: spacing.lg, alignItems: "center", marginTop: spacing.xxl },
  privateSaleLabel: { fontSize: 10, letterSpacing: 3, color: "rgba(255,255,255,0.5)" },
  privateSaleTitle: { fontFamily: fonts.serif, fontSize: 36, color: colors.white, marginTop: spacing.sm },
  privateSaleText: { fontSize: 14, color: "rgba(255,255,255,0.7)", textAlign: "center", marginTop: spacing.md, lineHeight: 20, maxWidth: 300 },
  privateSaleCta: { marginTop: spacing.lg, borderWidth: 1, borderColor: colors.white, paddingVertical: 14, paddingHorizontal: 32 },
  privateSaleCtaText: { fontSize: 11, letterSpacing: 2, color: colors.white },
});
