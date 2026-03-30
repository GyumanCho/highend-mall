import { View, Text, FlatList, Pressable, StyleSheet, Dimensions } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useWishlistStore } from "@/lib/stores";
import { colors, fonts, spacing } from "@/lib/theme";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - spacing.md * 3) / 2;

export default function WishlistScreen() {
  const { items, toggleItem } = useWishlistStore();

  if (items.length === 0) {
    return (
      <View style={styles.empty}>
        <Ionicons name="heart-outline" size={48} color={colors.lightGray} />
        <Text style={styles.emptyTitle}>No saved pieces</Text>
        <Text style={styles.emptyText}>Tap the heart icon on any product to save it here.</Text>
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
      keyExtractor={(item) => item.productId}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <View>
            <Image source={{ uri: item.imageUrl ?? undefined }} style={styles.cardImage} contentFit="cover" transition={300} />
            <Pressable
              onPress={() => toggleItem(item)}
              style={styles.removeButton}
            >
              <Ionicons name="close" size={14} color={colors.charcoal} />
            </Pressable>
          </View>
          <Text style={styles.cardBrand}>{item.brand}</Text>
          <Text style={styles.cardName} numberOfLines={2}>{item.name}</Text>
          <Text style={styles.cardPrice}>${item.price.toLocaleString()}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  empty: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.ivory, padding: spacing.lg },
  emptyTitle: { fontFamily: fonts.serif, fontSize: 20, color: colors.charcoal, marginTop: spacing.md },
  emptyText: { fontSize: 13, color: colors.warmGray, textAlign: "center", marginTop: spacing.xs },
  grid: { paddingHorizontal: spacing.md, paddingTop: spacing.md, paddingBottom: spacing.xxl },
  row: { gap: spacing.md, marginBottom: spacing.lg },
  card: { width: CARD_WIDTH },
  cardImage: { width: "100%", aspectRatio: 3 / 4, borderRadius: 2, backgroundColor: colors.lightGray },
  removeButton: { position: "absolute", top: 8, right: 8, width: 28, height: 28, borderRadius: 14, backgroundColor: "rgba(255,255,255,0.9)", justifyContent: "center", alignItems: "center" },
  cardBrand: { fontSize: 10, letterSpacing: 1.5, color: colors.warmGray, marginTop: spacing.sm, textTransform: "uppercase" },
  cardName: { fontSize: 13, color: colors.charcoal, marginTop: 2 },
  cardPrice: { fontSize: 13, color: colors.warmGray, marginTop: 2 },
});
