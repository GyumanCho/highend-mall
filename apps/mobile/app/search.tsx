import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  ScrollView,
  Modal,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState, useCallback } from "react";
import * as Haptics from "expo-haptics";
import { colors, fonts, spacing } from "@/lib/theme";
import { trpc } from "@/lib/trpc";
import { ProductCardSkeleton } from "@/components/skeleton";
import { ErrorState } from "@/components/error-state";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - spacing.md * 3) / 2;

const CATEGORIES = [
  { value: "", label: "All" },
  { value: "BAGS", label: "Bags" },
  { value: "RTW", label: "Ready-to-Wear" },
  { value: "SHOES", label: "Shoes" },
  { value: "ACCESSORIES", label: "Accessories" },
  { value: "JEWELRY", label: "Jewelry" },
  { value: "BEAUTY", label: "Beauty" },
] as const;

const PRICE_TIERS = [
  { value: "", label: "All Prices" },
  { value: "ACCESSIBLE", label: "Accessible" },
  { value: "CORE", label: "Core" },
  { value: "ULTRA", label: "Ultra" },
] as const;

interface SearchProduct {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  readonly brand: { readonly id: string; readonly name: string };
  readonly prices: readonly { readonly amount: string | number; readonly isDefault: boolean }[];
  readonly images: readonly { readonly url: string }[];
}

function formatPrice(prices: SearchProduct["prices"]): string {
  const def = prices.find((p) => p.isDefault) ?? prices[0];
  if (!def) return "";
  return `$${Number(def.amount).toLocaleString()}`;
}

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [category, setCategory] = useState("");
  const [priceTier, setPriceTier] = useState("");
  const [brandId, setBrandId] = useState("");
  const [filterVisible, setFilterVisible] = useState(false);

  // 디바운스 검색
  const [debounceTimer, setDebounceTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  const handleSearch = useCallback(
    (text: string) => {
      setQuery(text);
      if (debounceTimer) clearTimeout(debounceTimer);
      const timer = setTimeout(() => setDebouncedQuery(text), 400);
      setDebounceTimer(timer);
    },
    [debounceTimer]
  );

  const hasFilters = debouncedQuery.length >= 2 || category || priceTier || brandId;

  const {
    data: productsResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = trpc.product.list.useQuery(
    {
      page: 1,
      limit: 50,
      ...(debouncedQuery.length >= 2 ? { search: debouncedQuery } : {}),
      ...(category ? { category } : {}),
      ...(priceTier ? { priceTier } : {}),
      ...(brandId ? { brandId } : {}),
    },
    { enabled: hasFilters as boolean }
  );

  const { data: brandsResponse } = trpc.brand.list.useQuery({});
  const brandList = (brandsResponse?.data ?? []) as ReadonlyArray<{
    id: string;
    name: string;
  }>;

  const products = (productsResponse?.data ?? []) as unknown as ReadonlyArray<SearchProduct>;
  const activeFilterCount = [category, priceTier, brandId].filter(Boolean).length;

  function clearFilters() {
    setCategory("");
    setPriceTier("");
    setBrandId("");
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="arrow-back" size={22} color={colors.charcoal} />
        </Pressable>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={16} color={colors.warmGray} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products, brands..."
            placeholderTextColor={colors.warmGray}
            value={query}
            onChangeText={handleSearch}
            autoFocus
            returnKeyType="search"
          />
          {query.length > 0 && (
            <Pressable onPress={() => { setQuery(""); setDebouncedQuery(""); }}>
              <Ionicons name="close-circle" size={18} color={colors.warmGray} />
            </Pressable>
          )}
        </View>
        <Pressable
          onPress={() => {
            setFilterVisible(true);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
          hitSlop={12}
        >
          <View>
            <Ionicons name="options-outline" size={22} color={colors.charcoal} />
            {activeFilterCount > 0 && (
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
              </View>
            )}
          </View>
        </Pressable>
      </View>

      {/* Results */}
      {!hasFilters ? (
        <View style={styles.emptyWrap}>
          <Ionicons name="search-outline" size={48} color={colors.lightGray} />
          <Text style={styles.emptyTitle}>Discover</Text>
          <Text style={styles.emptySubtitle}>
            Search by name, brand, or use filters to browse
          </Text>
        </View>
      ) : isError ? (
        <ErrorState
          title="Search failed"
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
          <Text style={styles.resultCount}>
            {products.length} {products.length === 1 ? "result" : "results"}
          </Text>
          <FlatList
            data={products}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.grid}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            keyboardDismissMode="on-drag"
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
                  <Text style={styles.cardBrand}>{item.brand.name}</Text>
                  <Text style={styles.cardName} numberOfLines={2}>{item.name}</Text>
                  <Text style={styles.cardPrice}>{formatPrice(item.prices)}</Text>
                </Pressable>
              );
            }}
            ListEmptyComponent={
              <View style={styles.emptyWrap}>
                <Text style={styles.emptyTitle}>No results</Text>
                <Text style={styles.emptySubtitle}>Try different keywords or filters</Text>
              </View>
            }
          />
        </>
      )}

      {/* Filter Bottom Sheet */}
      <Modal
        visible={filterVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setFilterVisible(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setFilterVisible(false)} />
        <View style={styles.sheet}>
          <View style={styles.sheetHandle} />
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Filters</Text>
            {activeFilterCount > 0 && (
              <Pressable onPress={clearFilters}>
                <Text style={styles.clearBtn}>Clear All</Text>
              </Pressable>
            )}
          </View>

          {/* Category */}
          <Text style={styles.filterLabel}>CATEGORY</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipRow}
          >
            {CATEGORIES.map((c) => (
              <Pressable
                key={c.value}
                style={[styles.chip, category === c.value && styles.chipActive]}
                onPress={() => {
                  setCategory(c.value);
                  Haptics.selectionAsync();
                }}
              >
                <Text style={[styles.chipText, category === c.value && styles.chipTextActive]}>
                  {c.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          {/* Price Tier */}
          <Text style={styles.filterLabel}>PRICE RANGE</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipRow}
          >
            {PRICE_TIERS.map((p) => (
              <Pressable
                key={p.value}
                style={[styles.chip, priceTier === p.value && styles.chipActive]}
                onPress={() => {
                  setPriceTier(p.value);
                  Haptics.selectionAsync();
                }}
              >
                <Text style={[styles.chipText, priceTier === p.value && styles.chipTextActive]}>
                  {p.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          {/* Brand */}
          <Text style={styles.filterLabel}>BRAND</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipRow}
          >
            <Pressable
              style={[styles.chip, brandId === "" && styles.chipActive]}
              onPress={() => {
                setBrandId("");
                Haptics.selectionAsync();
              }}
            >
              <Text style={[styles.chipText, brandId === "" && styles.chipTextActive]}>All</Text>
            </Pressable>
            {brandList.map((b) => (
              <Pressable
                key={b.id}
                style={[styles.chip, brandId === b.id && styles.chipActive]}
                onPress={() => {
                  setBrandId(b.id);
                  Haptics.selectionAsync();
                }}
              >
                <Text style={[styles.chipText, brandId === b.id && styles.chipTextActive]}>
                  {b.name}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          <Pressable
            style={styles.applyBtn}
            onPress={() => {
              setFilterVisible(false);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }}
          >
            <Text style={styles.applyBtnText}>APPLY FILTERS</Text>
          </Pressable>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.ivory },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: spacing.md,
    paddingTop: 56,
    paddingBottom: spacing.sm,
    backgroundColor: colors.white,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.lightGray,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.ivory,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.charcoal,
  },
  filterBadge: {
    position: "absolute",
    top: -4,
    right: -6,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.gold,
    justifyContent: "center",
    alignItems: "center",
  },
  filterBadgeText: { fontSize: 9, color: colors.white, fontWeight: "600" },
  resultCount: {
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
  emptyWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: spacing.xxl * 2,
  },
  emptyTitle: {
    fontFamily: fonts.serif,
    fontSize: 20,
    color: colors.charcoal,
    marginTop: spacing.md,
  },
  emptySubtitle: {
    fontSize: 13,
    color: colors.warmGray,
    textAlign: "center",
    marginTop: spacing.xs,
    maxWidth: 240,
  },
  // Bottom sheet
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: spacing.md,
    paddingBottom: 40,
    maxHeight: "70%",
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.lightGray,
    alignSelf: "center",
    marginTop: 10,
  },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.md,
  },
  sheetTitle: { fontFamily: fonts.serif, fontSize: 20, color: colors.charcoal },
  clearBtn: { fontSize: 13, color: colors.warmGray, textDecorationLine: "underline" },
  filterLabel: {
    fontSize: 10,
    letterSpacing: 2,
    color: colors.warmGray,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  chipRow: { gap: 8, paddingVertical: 4 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  chipActive: {
    backgroundColor: colors.charcoal,
    borderColor: colors.charcoal,
  },
  chipText: { fontSize: 12, color: colors.warmGray },
  chipTextActive: { color: colors.white },
  applyBtn: {
    marginTop: spacing.xl,
    backgroundColor: colors.charcoal,
    paddingVertical: 16,
    alignItems: "center",
  },
  applyBtnText: { color: colors.white, fontSize: 12, letterSpacing: 2 },
});
