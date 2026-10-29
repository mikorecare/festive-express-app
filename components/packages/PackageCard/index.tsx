import { useCartMutations } from "@/hooks/cart/useCartMutation";
import type { SkuRow } from "@/hooks/packages/usePackageSkus";
import type { PackageRow } from "@/hooks/packages/usePackagesMainList";
import type { ProductColor } from "@/hooks/product-colors/useProductColors";
import { useCart } from "@/providers/CartProvider";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import RenderHtml from "react-native-render-html";
import { ColorSwatches } from "../ColorSwatches";
import { InclusionList } from "../InclusionList";
import { PackageLightbox } from "../PackageLightBox";

const ORANGE = "#F49321";
const NAVY = "#1C2D5B";

type Hotspot = {
  key: string;
  top: string;
  left: string;
  label: string;
  thumb?: string;
};

const HOTSPOT_LAYOUT: Record<
  string,
  { top: string; left: string; match?: string }[]
> = {
  joy: [{ top: "38%", left: "72%", match: "c9" }],
  jolly: [
    { top: "38%", left: "72%", match: "c9" },
    { top: "38%", left: "53%", match: "wreath" },
    { top: "34%", left: "55%", match: "bow" },
    { top: "75%", left: "47%", match: "ground" },
  ],
  merry: [
    { top: "38%", left: "72%", match: "c9" },
    { top: "38%", left: "53%", match: "wreath" },
    { top: "34%", left: "55%", match: "bow" },
    { top: "75%", left: "47%", match: "ground" },
    { top: "62%", left: "78%", match: "minis" },
    { top: "68%", left: "62%", match: "bursts" },
  ],
};

function getHotspotsFor(pkg: PackageRow): Hotspot[] {
  const layout = HOTSPOT_LAYOUT[pkg.slug] ?? HOTSPOT_LAYOUT.joy ?? [];
  const included = (pkg.package_inclusions ?? [])
    .filter((r: any) => r.is_included)
    .sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

  return layout.map((pos, i) => {
    const row =
      included.find((r: any) =>
        (r.inclusion_items?.slug || r.inclusion_items?.name || "")
          .toLowerCase()
          .includes((pos.match || "").toLowerCase()),
      ) || included[i];

    return {
      key: String(row?.inclusion_items?.id ?? i),
      top: pos.top,
      left: pos.left,
      label: row?.label_override || row?.inclusion_items?.name || "Feature",
      thumb: row?.inclusion_items?.image_url ?? undefined,
    };
  });
}

export function PackageCard({
  pkg,
  skus,
  colors,
  isEarlyBirdLive,
  effectivePrice,
  onAddedToCart,
}: {
  pkg: PackageRow;
  skus: SkuRow[];
  colors: ProductColor[];
  isEarlyBirdLive: boolean;
  effectivePrice: (
    price: number | string | null | undefined,
    salePrice: number | string | null | undefined,
  ) => number;
  onAddedToCart?: () => void;
}) {
  const { width: SCREEN_W } = useWindowDimensions();

  const [selectedSkuId, setSelectedSkuId] = useState<string | number | null>(
    null,
  );
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const { ensure, refresh } = useCart();
  const { addItem } = useCartMutations();
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (selectedSkuId == null && skus.length > 0) {
      setSelectedSkuId(skus[0].id);
    }
  }, [skus, selectedSkuId]);

  const selectedSku =
    skus.find((s) => String(s.id) === String(selectedSkuId)) ?? skus[0];

  const onSale =
    selectedSku?.sale_price != null &&
    Number(selectedSku.sale_price) > 0 &&
    isEarlyBirdLive;

  const displayPrice = selectedSku
    ? effectivePrice(
        selectedSku.price,
        isEarlyBirdLive ? selectedSku.sale_price : null,
      )
    : 0;

  const mainImage = selectedSku?.image_url ?? pkg.title_image_url ?? null;

  const inclusions = (pkg.package_inclusions ?? [])
    .filter((r: any) => r.is_included)
    .sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

  const hotspots = getHotspotsFor(pkg);

  const handleAdd = async () => {
    if (!selectedSku || adding) return;
    setAdding(true);
    try {
      const cartId = await ensure();
      if (!cartId) return;
      const res = await addItem(
        cartId,
        String(selectedSku.id),
        Number(displayPrice),
        1,
      );
      if (res.success) {
        await refresh();
        onAddedToCart?.();
      }
    } finally {
      setAdding(false);
    }
  };

  return (
    <View style={{ marginBottom: 24, paddingHorizontal: 14 }}>
      {/* Header: title image + price */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottomWidth: 1,
          borderBottomColor: "#e2e8f0",
          paddingBottom: 8,
          marginBottom: 10,
          marginTop: 12,
          gap: 8,
        }}
      >
        {pkg.title_image_url || pkg.icon_url ? (
          <Image
            source={{ uri: pkg.title_image_url ?? pkg.icon_url ?? "" }}
            style={{ height: 40, width: 110 }}
            contentFit="contain"
          />
        ) : (
          <Text
            style={{
              flex: 1,
              fontSize: 18,
              fontWeight: "800",
              color: NAVY,
            }}
            numberOfLines={1}
          >
            {pkg.name}
          </Text>
        )}

        <View style={{ alignItems: "flex-end" }}>
          {onSale ? (
            <>
              <Text style={{ fontSize: 11, color: NAVY, fontWeight: "700" }}>
                was{" "}
                <Text style={{ textDecorationLine: "line-through" }}>
                  ${Math.round(Number(selectedSku?.price) || 0)}
                </Text>
              </Text>
              <Text style={{ fontSize: 11, color: NAVY, fontWeight: "700" }}>
                now{" "}
                <Text
                  style={{
                    fontSize: 17,
                    color: ORANGE,
                    fontWeight: "900",
                  }}
                >
                  ${Math.round(Number(displayPrice) || 0)}
                </Text>
              </Text>
              <Text style={{ fontSize: 10, color: "#64748b" }}>/ Season</Text>
            </>
          ) : (
            <View
              style={{ flexDirection: "row", alignItems: "baseline", gap: 3 }}
            >
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: "900",
                  color: ORANGE,
                }}
              >
                ${Math.round(Number(displayPrice) || 0)}
              </Text>
              <Text style={{ fontSize: 10, color: "#64748b" }}>/ season</Text>
            </View>
          )}
        </View>
      </View>

      {/* Main image */}
      <Pressable onPress={() => setLightboxOpen(true)}>
        <View
          style={{
            borderWidth: 3,
            borderColor: ORANGE,
            borderRadius: 12,
            overflow: "hidden",
            width: "100%",
            aspectRatio: 16 / 10,
          }}
        >
          <Image
            source={mainImage ? { uri: mainImage } : undefined}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
          />
        </View>
      </Pressable>

      {skus.length > 0 ? (
        <ColorSwatches
          skus={skus}
          colors={colors}
          selectedSkuId={selectedSkuId}
          onSelect={setSelectedSkuId}
        />
      ) : null}

      {/* Description */}
      {pkg.description ? (
        <View style={{ marginTop: 10 }}>
          <RenderHtml
            contentWidth={SCREEN_W - 28}
            source={{ html: pkg.description }}
            baseStyle={{ color: NAVY, fontSize: 13, lineHeight: 19 }}
            tagsStyles={{
              p: { marginTop: 0, marginBottom: 4 },
              strong: { fontWeight: "800" },
            }}
          />
        </View>
      ) : null}

      <InclusionList inclusions={inclusions} />

      {/* Add to cart */}
      <Pressable
        onPress={handleAdd}
        disabled={!selectedSku || adding}
        style={{
          marginTop: 12,
          backgroundColor: adding ? "#94a3b8" : ORANGE,
          paddingVertical: 13,
          borderRadius: 10,
          alignItems: "center",
        }}
        accessibilityRole="button"
        accessibilityLabel={`Add ${pkg.name} to cart`}
      >
        {adding ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text
            style={{
              fontSize: 14,
              fontWeight: "800",
              color: "#fff",
            }}
          >
            Add {pkg.name.toUpperCase()} to Cart
          </Text>
        )}
      </Pressable>

      <PackageLightbox
        visible={lightboxOpen}
        image={mainImage}
        hotspots={hotspots}
        onClose={() => setLightboxOpen(false)}
      />
    </View>
  );
}
