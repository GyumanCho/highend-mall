// 절제된 shimmer 스켈레톤. mobile-design-system §6.3 — 원형 스피너 금지.
// RN 내장 Animated API 사용 (Reanimated 의존 X — 단순한 opacity 펄스만 필요).
import { View, StyleSheet, Animated, type ViewStyle } from "react-native";
import { useEffect, useRef } from "react";
import { colors } from "@/lib/theme";

interface SkeletonProps {
  readonly width?: number | "100%" | `${number}%`;
  readonly height: number;
  readonly borderRadius?: number;
  readonly style?: ViewStyle;
}

export function Skeleton({
  width = "100%",
  height,
  borderRadius = 4,
  style,
}: SkeletonProps) {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.85,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.skeleton,
        { width, height, borderRadius, opacity },
        style,
      ]}
    />
  );
}

interface ProductCardSkeletonProps {
  readonly width: number;
}

export function ProductCardSkeleton({ width }: ProductCardSkeletonProps) {
  return (
    <View style={{ width }}>
      <Skeleton width="100%" height={width * 1.33} borderRadius={2} />
      <View style={styles.cardMeta}>
        <Skeleton width={60} height={10} />
        <Skeleton width="80%" height={13} style={{ marginTop: 4 }} />
        <Skeleton width={50} height={13} style={{ marginTop: 4 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: colors.lightGray,
  },
  cardMeta: {
    marginTop: 8,
  },
});
