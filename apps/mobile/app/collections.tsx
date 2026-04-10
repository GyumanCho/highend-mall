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
import { colors, fonts, spacing } from "@/lib/theme";
import { trpc } from "@/lib/trpc";
import { Skeleton } from "@/components/skeleton";
import { ErrorState } from "@/components/error-state";

const { width } = Dimensions.get("window");

interface CollectionItem {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  readonly season: string;
  readonly year: number;
  readonly narrative: string | null;
  readonly heroImageUrl: string | null;
  readonly brand: {
    readonly id: string;
    readonly name: string;
    readonly slug: string;
  };
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

export default function CollectionsScreen() {
  const {
    data: response,
    isLoading,
    isError,
    error,
    refetch,
  } = trpc.collection.list.useQuery({});

  const collections = (response?.data ?? []) as unknown as ReadonlyArray<CollectionItem>;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="arrow-back" size={22} color={colors.charcoal} />
        </Pressable>
        <Text style={styles.headerTitle}>COLLECTIONS</Text>
        <View style={{ width: 22 }} />
      </View>

      {isError ? (
        <ErrorState
          title="Couldn't load collections"
          message={error?.message ?? "Please try again."}
          onRetry={() => void refetch()}
        />
      ) : isLoading ? (
        <View style={styles.skeletonList}>
          {[1, 2, 3].map((i) => (
            <View key={i} style={styles.skeletonCard}>
              <Skeleton width="100%" height={200} borderRadius={4} />
              <Skeleton width={120} height={10} style={{ marginTop: 12 }} />
              <Skeleton width="80%" height={18} style={{ marginTop: 6 }} />
            </View>
          ))}
        </View>
      ) : (
        <FlatList
          data={collections}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable
              style={styles.card}
              onPress={() => router.push(`/collection/${item.slug}` as never)}
            >
              {item.heroImageUrl ? (
                <Image
                  source={{ uri: item.heroImageUrl }}
                  style={styles.heroImage}
                  contentFit="cover"
                  transition={400}
                />
              ) : (
                <View style={[styles.heroImage, styles.heroPlaceholder]}>
                  <Ionicons name="diamond-outline" size={32} color={colors.warmGray} />
                </View>
              )}
              <View style={styles.cardContent}>
                <Text style={styles.brandName}>{item.brand.name}</Text>
                <Text style={styles.collectionName}>{item.name}</Text>
                <Text style={styles.seasonText}>
                  {seasonLabel(item.season)} {item.year}
                </Text>
                {item.narrative && (
                  <Text style={styles.narrative} numberOfLines={2}>
                    {item.narrative}
                  </Text>
                )}
              </View>
            </Pressable>
          )}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyText}>No collections available</Text>
            </View>
          }
        />
      )}
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
  list: { paddingHorizontal: spacing.md, paddingVertical: spacing.md, gap: spacing.lg },
  skeletonList: { paddingHorizontal: spacing.md, paddingTop: spacing.md, gap: spacing.lg },
  skeletonCard: { marginBottom: spacing.md },
  card: {
    backgroundColor: colors.white,
    borderRadius: 8,
    overflow: "hidden",
  },
  heroImage: {
    width: "100%",
    height: 200,
  },
  heroPlaceholder: {
    backgroundColor: colors.lightGray,
    justifyContent: "center",
    alignItems: "center",
  },
  cardContent: {
    padding: spacing.md,
  },
  brandName: {
    fontSize: 10,
    letterSpacing: 2,
    color: colors.warmGray,
    textTransform: "uppercase",
  },
  collectionName: {
    fontFamily: fonts.serif,
    fontSize: 18,
    color: colors.charcoal,
    marginTop: 4,
  },
  seasonText: {
    fontSize: 12,
    color: colors.warmGray,
    marginTop: 2,
  },
  narrative: {
    fontSize: 13,
    color: colors.warmGray,
    lineHeight: 20,
    marginTop: spacing.sm,
  },
  emptyWrap: { paddingVertical: spacing.xxl, alignItems: "center" },
  emptyText: { color: colors.warmGray, fontSize: 13 },
});
