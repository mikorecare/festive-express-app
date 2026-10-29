import { PackageCard } from "@/components/packages/PackageCard";
import { PackageHero } from "@/components/packages/PackageHero";
import { ProductSpecs } from "@/components/packages/ProductSpecs";
import { useEarlyBirdSpecial } from "@/hooks/early-bird/useEarlyBirdSpecial";
import { useInclusionItems } from "@/hooks/inclusion-items/useInclusionItems";
import { usePackageSkus } from "@/hooks/packages/usePackageSkus";
import { usePackagesMainList } from "@/hooks/packages/usePackagesMainList";
import { useProductColors } from "@/hooks/product-colors/useProductColors";
import { useHeroSubtitle } from "@/hooks/settings/useHeroSubtitle";
import { useCart } from "@/providers/CartProvider";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useRef } from "react";
import {
  ActivityIndicator,
  Animated,
  Easing,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

const ORANGE = "#F49321";

export default function PackagesScreen() {
  const { package: scrollToSlug } = useLocalSearchParams<{
    package?: string;
  }>();

  const { count, open } = useCart();

  const { data: pkgsData, pending: pkgsPending } = usePackagesMainList();
  const { data: skusData, pending: skusPending } = usePackageSkus();
  const { data: heroData } = useHeroSubtitle();
  const { data: specsData, pending: specsPending } = useInclusionItems();
  const { colors } = useProductColors();
  const { isEarlyBirdLive, effectivePrice } = useEarlyBirdSpecial();

  const shine = useRef(new Animated.Value(0)).current;

  const runShine = () => {
    shine.setValue(0);
    Animated.timing(shine, {
      toValue: 1,
      duration: 600,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  };

  const translateX = shine.interpolate({
    inputRange: [0, 1],
    outputRange: [-60, 60],
  });
  const shineOpacity = shine.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [0, 0.9, 0],
  });

  const packages = pkgsData?.success ? pkgsData.data : [];
  const skus = skusData?.success ? skusData.data : [];
  const specs = specsData?.data ?? [];
  const heroSubtitle =
    heroData?.data?.hero_subtitle ?? "Choose the perfect package|for your home";
  const subtitleParts = heroSubtitle
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean);

  const pending = pkgsPending || skusPending;

  if (pending) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
        <Text style={{ marginTop: 12, color: "#64748b" }}>
          Loading packages...
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <PackageHero subtitleParts={subtitleParts} />

        {packages.map((pkg) => {
          const pkgSkus = skus.filter(
            (s) => String(s.package_id) === String(pkg.id),
          );
          return (
            <PackageCard
              key={pkg.id}
              pkg={pkg}
              skus={pkgSkus}
              colors={colors}
              isEarlyBirdLive={isEarlyBirdLive}
              effectivePrice={effectivePrice}
            />
          );
        })}

        <ProductSpecs items={specs} pending={specsPending} />
      </ScrollView>

      {/* Floating cart button — wrapper handles position, Pressable handles circle */}
      <View
        style={{ position: "absolute", right: 16, bottom: 16 }}
        pointerEvents="box-none"
      >
        <Pressable
          onPress={() => {
            runShine();
            open();
          }}
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: ORANGE,
            alignItems: "center",
            justifyContent: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.25,
            shadowRadius: 8,
            elevation: 8,
          }}
          accessibilityRole="button"
          accessibilityLabel={`Open cart, ${count} items`}
        >
          <Ionicons name="cart" size={26} color="#fff" />
        </Pressable>

        {count > 0 ? (
          <View
            pointerEvents="none"
            style={{
              position: "absolute",
              top: -2,
              right: -2,
              minWidth: 20,
              height: 20,
              borderRadius: 10,
              backgroundColor: "#fff",
              borderWidth: 2,
              borderColor: ORANGE,
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 4,
              elevation: 9,
              zIndex: 10,
            }}
          >
            <Text style={{ fontSize: 10, fontWeight: "800", color: ORANGE }}>
              {count > 99 ? "99+" : count}
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}
