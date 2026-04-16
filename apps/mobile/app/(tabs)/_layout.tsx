import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts } from "@/lib/theme";
import { useCartStore, useWishlistStore } from "@/lib/stores";
import { useAuthStore } from "@/lib/auth";
import { trpc } from "@/lib/trpc";

export default function TabLayout() {
  const customer = useAuthStore((s) => s.customer);

  // 로컬 스토어 (비로그인)
  const localCartCount = useCartStore((s) => s.itemCount());
  const localWishlistCount = useWishlistStore((s) => s.items.length);

  // 서버 데이터 (로그인)
  const serverCart = trpc.cart.list.useQuery(undefined, { enabled: !!customer });
  const serverWishlist = trpc.wishlist.list.useQuery(undefined, { enabled: !!customer });

  const serverCartItems = (serverCart.data?.data ?? []) as ReadonlyArray<{ quantity: number }>;
  const serverCartCount = serverCartItems.reduce((sum, item) => sum + item.quantity, 0);
  const serverWishlistCount = ((serverWishlist.data?.data ?? []) as ReadonlyArray<unknown>).length;

  const cartCount = customer ? serverCartCount : localCartCount;
  const wishlistCount = customer ? serverWishlistCount : localWishlistCount;

  return (
    <Tabs
      screenOptions={{
        headerTitleStyle: { fontFamily: fonts.serif, fontSize: 18, letterSpacing: 2 },
        headerTintColor: colors.charcoal,
        headerStyle: { backgroundColor: colors.white },
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.lightGray,
          borderTopWidth: 0.5,
          paddingBottom: 4,
          height: 85,
        },
        tabBarActiveTintColor: colors.charcoal,
        tabBarInactiveTintColor: colors.warmGray,
        tabBarLabelStyle: { fontSize: 10, letterSpacing: 0.5 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerTitle: "MAISON",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="shop"
        options={{
          title: "Shop",
          headerTitle: "SHOP",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="wishlist"
        options={{
          title: "Wishlist",
          headerTitle: "WISHLIST",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart-outline" size={size} color={color} />
          ),
          tabBarBadge: wishlistCount > 0 ? wishlistCount : undefined,
          tabBarBadgeStyle: { backgroundColor: colors.red, fontSize: 10 },
        }}
      />
      <Tabs.Screen
        name="bag"
        options={{
          title: "Bag",
          headerTitle: "YOUR BAG",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bag-outline" size={size} color={color} />
          ),
          tabBarBadge: cartCount > 0 ? cartCount : undefined,
          tabBarBadgeStyle: { backgroundColor: colors.gold, fontSize: 10 },
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: "Account",
          headerTitle: "MY ACCOUNT",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
