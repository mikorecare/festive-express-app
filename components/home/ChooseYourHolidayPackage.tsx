import {
    usePackages,
    type Package,
    type PackageInclusion,
} from "@/hooks/packages/usePackages";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useRef, useState } from "react";
import {
    FlatList,
    Pressable,
    Text,
    useWindowDimensions,
    View,
} from "react-native";

const ORANGE = "#F49321";
const NAVY = "#1C2D5B";

function firstParagraph(text?: string | null): string {
  if (!text) return "";
  const parts = text
    .split(/\n\s*\n|\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  return parts[0] || "";
}

function getPackageButtonPrefix(pkg: { name: string }): string {
  const name = pkg.name.toLowerCase();
  if (name.includes("joy")) return "Choose ";
  if (name.includes("jolly")) return "Get ";
  if (name.includes("merry")) return "Make It ";
  return "Choose ";
}

function getPackageButtonName(pkg: { name: string }): string {
  const name = pkg.name.toLowerCase();
  if (name.includes("joy")) return " Joy";
  if (name.includes("jolly")) return " Jolly";
  if (name.includes("merry")) return " Merry";
  return pkg.name.toUpperCase();
}

function includedRows(pkg: Package) {
  const rows: PackageInclusion[] = pkg.package_inclusions || [];
  const mapped = rows
    .map((row) => {
      const item = Array.isArray(row.inclusion_items)
        ? row.inclusion_items[0]
        : row.inclusion_items;
      if (!item?.name) return null;
      return {
        name: item.name,
        image_url: item.image_url ?? null,
        is_included: row.is_included === true,
      };
    })
    .filter(Boolean) as {
    name: string;
    image_url: string | null;
    is_included: boolean;
  }[];
  return mapped.filter((r) => r.is_included);
}

const H_PADDING = 16;
const GAP = 12;
const PEEK = 40;

const HERO_H = 200; // hero image
const HERO_PADDING_TOP = 12; // hero wrapper top padding
const NAVY_H = 72; // navy header (52 icon + 10*2 padding)
const BODY_TOP = 18; // white body padding top
const DESC_H = 40; // ~3 lines of description @ 12/18 + marginBottom
const BODY_BOTTOM = 50; // white body padding bottom
const FOOTER_H = 16; // footer bottom padding

// per inclusion row
const ROW_H = 42; // icon circle height
const ROW_GAP = 5;
const ROWS_PER_COL = 2; // 2-column grid
const sectionBg = require("@/assets/images/choose-your-holiday-package/bg.webp");

export function ChooseYourPackage() {
  const router = useRouter();
  const { data, pending, error } = usePackages();
  const { width: SCREEN_W } = useWindowDimensions();

  const packages = data?.packages ?? [];

  const CARD_W = SCREEN_W - H_PADDING * 2 - PEEK;

  // --- compute the tallest card height once so all cards match ---
  const CARD_H = useMemo(() => {
    const maxRows = packages.reduce(
      (max, p) => Math.max(max, includedRows(p).length),
      0,
    );
    // how many *visual rows* the 2-column grid needs
    const visualRows = Math.max(1, Math.ceil(maxRows / ROWS_PER_COL));
    const inclusionsBlockH =
      visualRows * ROW_H + Math.max(0, visualRows - 1) * ROW_GAP;

    return (
      HERO_PADDING_TOP +
      HERO_H +
      NAVY_H +
      BODY_TOP +
      DESC_H +
      inclusionsBlockH +
      BODY_BOTTOM +
      FOOTER_H
    );
  }, [packages]);

  const [activeIndex, setActiveIndex] = useState(0);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: Array<{ index?: number }> }) => {
      const first = viewableItems[0];
      if (first?.index != null) setActiveIndex(first.index);
    },
  ).current;

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 60 }).current;

  const listRef = useRef<FlatList<Package>>(null);

  const scrollToIndex = useCallback((i: number) => {
    listRef.current?.scrollToIndex({ index: i, animated: true });
  }, []);

  function selectPackage(pkg: Package) {
    router.push({ pathname: "/packages", params: { package: pkg.slug } });
  }

  return (
    <View style={{ marginTop: 32, paddingVertical: 32 }}>
      <Image
        source={sectionBg}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
        contentFit="cover"
        transition={200}
      />
      <View
        style={{
          alignItems: "center",
          marginBottom: 24,
          paddingHorizontal: H_PADDING,
        }}
      >
        <Text
          style={{
            fontSize: 28,
            fontWeight: "800",
            textTransform: "uppercase",
            letterSpacing: 1,
            color: "#fff",
            textAlign: "center",
            textShadowColor: "rgba(0,0,0,0.45)",
            textShadowOffset: { width: 0, height: 2 },
            textShadowRadius: 8,
          }}
        >
          Choose Your
        </Text>
        <Text
          style={{
            fontSize: 28,
            fontWeight: "800",
            textTransform: "uppercase",
            letterSpacing: 1,
            color: ORANGE,
            textAlign: "center",
            textShadowColor: "rgba(28,45,91,0.45)",
            textShadowOffset: { width: 0, height: 4 },
            textShadowRadius: 10,
            marginTop: 4,
          }}
        >
          Holiday Package
        </Text>
      </View>

      <Text
        style={{
          color: "#fff",
          fontWeight: "700",
          fontSize: 12,
          textAlign: "center",
          letterSpacing: 0.4,
          marginBottom: 20,
          paddingHorizontal: H_PADDING,
          textShadowColor: "rgba(0,0,0,0.5)",
          textShadowOffset: { width: 0, height: 1 },
          textShadowRadius: 4,
        }}
      >
        COMPARE WHAT&apos;S INCLUDED IN EACH PLAN
        {"\n"}
        <Text
          style={{
            fontSize: 10,
            fontWeight: "600",
            color: "rgba(255,255,255,0.9)",
          }}
        >
          (Each package is a rental for one season)
        </Text>
      </Text>

      {pending && (
        <Text
          style={{
            color: "#fff",
            fontWeight: "600",
            textAlign: "center",
            paddingVertical: 40,
          }}
        >
          Loading holiday packages...
        </Text>
      )}

      {!pending && error && (
        <Text
          style={{
            color: "#f87171",
            fontWeight: "600",
            textAlign: "center",
            paddingVertical: 40,
          }}
        >
          {error}
        </Text>
      )}

      {!pending && !error && (
        <>
          <FlatList
            ref={listRef}
            data={packages}
            keyExtractor={(pkg) => String(pkg.id)}
            horizontal
            showsHorizontalScrollIndicator={false}
            decelerationRate="fast"
            snapToInterval={CARD_W + GAP}
            snapToAlignment="start"
            disableIntervalMomentum
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
            contentContainerStyle={{
              paddingHorizontal: H_PADDING,
              gap: GAP,
            }}
            renderItem={({ item }) => (
              <View style={{ width: CARD_W, height: CARD_H }}>
                <PackageCard
                  pkg={item}
                  cardWidth={CARD_W}
                  onSelect={() => selectPackage(item)}
                />
              </View>
            )}
            getItemLayout={(_, index) => ({
              length: CARD_W + GAP,
              offset: (CARD_W + GAP) * index,
              index,
            })}
          />

          {/* Pagination dots */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              gap: 8,
              marginTop: 20,
            }}
          >
            {packages.map((_, i) => (
              <Pressable
                key={i}
                onPress={() => scrollToIndex(i)}
                accessibilityRole="button"
                accessibilityLabel={`Go to package ${i + 1}`}
                hitSlop={8}
                style={{
                  width: i === activeIndex ? 24 : 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor:
                    i === activeIndex ? ORANGE : "rgba(255,255,255,0.4)",
                }}
              />
            ))}
          </View>
        </>
      )}
    </View>
  );
}

function PackageCard({
  pkg,
  cardWidth,
  onSelect,
}: {
  pkg: Package;
  cardWidth: number;
  onSelect: () => void;
}) {
  const rows = includedRows(pkg);
  const firstPara = firstParagraph(pkg.description);
  const onSale =
    pkg.sale_price != null &&
    pkg.sale_price !== 0 &&
    Number(pkg.sale_price) > 0;

  const contentWidth = cardWidth - 28;

  return (
    <View
      style={{
        flex: 1, // fill the fixed-height parent
        borderRadius: 28,
        backgroundColor: ORANGE,
        overflow: "hidden",
      }}
    >
      {/* Hero image */}
      <View style={{ padding: 12, paddingBottom: 0 }}>
        <View
          style={{
            borderTopLeftRadius: 22,
            borderTopRightRadius: 22,
            overflow: "hidden",
            width: "100%",
            height: HERO_H,
          }}
        >
          <Image
            source={pkg.image_url ? { uri: pkg.image_url } : undefined}
            style={{ width: "100%", height: HERO_H }}
            contentFit="cover"
          />
        </View>
      </View>

      {/* Navy header */}
      <View
        style={{
          backgroundColor: NAVY,
          paddingHorizontal: 16,
          paddingVertical: 10,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            flex: 1,
          }}
        >
          {pkg.icon_url ? (
            <View
              style={{
                width: 52,
                height: 52,
                borderRadius: 26,
                backgroundColor: ORANGE,
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              <Image
                source={{ uri: pkg.icon_url }}
                style={{ width: 52, height: 52 }}
                contentFit="contain"
              />
            </View>
          ) : null}

          {pkg.title_image_url ? (
            <Image
              source={{ uri: pkg.title_image_url }}
              style={{ width: 60, height: 50 }}
              contentFit="contain"
            />
          ) : null}
        </View>

        <View style={{ alignItems: "flex-end" }}>
          {onSale ? (
            <>
              <Text style={{ color: "#fff", fontSize: 14, fontWeight: "700" }}>
                was{" "}
                <Text style={{ textDecorationLine: "line-through" }}>
                  ${Math.round(Number(pkg.price) || 0)}
                </Text>
              </Text>
              <Text style={{ color: "#fff", fontSize: 11, fontWeight: "700" }}>
                now
              </Text>
              <Text
                style={{
                  color: ORANGE,
                  fontSize: 24,
                  fontWeight: "900",
                  lineHeight: 26,
                }}
              >
                ${Math.round(Number(pkg.sale_price) || 0)}
              </Text>
              <Text style={{ color: "rgba(255,255,255,0.9)", fontSize: 11 }}>
                / Season
              </Text>
            </>
          ) : (
            <>
              <Text
                style={{
                  color: ORANGE,
                  fontSize: 24,
                  fontWeight: "900",
                  lineHeight: 26,
                }}
              >
                ${Math.round(Number(pkg.price) || 0)}
              </Text>
              <Text style={{ color: "rgba(255,255,255,0.9)", fontSize: 11 }}>
                / Season
              </Text>
            </>
          )}
        </View>
      </View>

      {/* White body — fills remaining space */}

      <View
        style={{
          flex: 1,
          backgroundColor: "#fff",
          borderBottomLeftRadius: 70,
          borderBottomRightRadius: 70,
          paddingTop: BODY_TOP,
          paddingHorizontal: 14,
          paddingBottom: BODY_BOTTOM,
        }}
      >
        {/* {firstPara ? (
          <View style={{ marginBottom: 12 }}>
            <RenderHtml
              contentWidth={contentWidth}
              source={{ html: firstPara }}
              baseStyle={{
                color: NAVY,
                fontSize: 12,
                fontWeight: "500",
                lineHeight: 18,
              }}
              tagsStyles={{
                p: { margin: 0, marginBottom: 0 },
                strong: { fontWeight: "800" },
                b: { fontWeight: "800" },
                em: { fontStyle: "italic" },
                a: { color: ORANGE, textDecorationLine: "underline" },
              }}
              defaultTextProps={{ numberOfLines: 2 }}
              enableExperimentalMarginCollapsing
              ignoredDomTags={["script", "style", "iframe"]}
            />
          </View>
        ) : null} */}

        {rows.length > 0 ? (
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              columnGap: 12,
              rowGap: ROW_GAP,
            }}
          >
            {rows.map((row, i) => (
              <View
                key={i}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 5,
                  width: "47%",
                }}
              >
                <View
                  style={{
                    width: ROW_H,
                    height: ROW_H,
                    borderRadius: ROW_H / 2,
                    borderWidth: 2,
                    borderColor: ORANGE,
                    overflow: "hidden",
                    backgroundColor: "#fff",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {row.image_url ? (
                    <Image
                      source={{ uri: row.image_url }}
                      style={{ width: "100%", height: "100%" }}
                      contentFit="cover"
                    />
                  ) : null}
                </View>
                <Text
                  style={{
                    flex: 1,
                    color: NAVY,
                    fontSize: 11,
                    fontWeight: "800",
                    lineHeight: 14,
                  }}
                  numberOfLines={2}
                >
                  {row.name}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <Text
            style={{
              textAlign: "center",
              color: "#6b7280",
              paddingVertical: 16,
            }}
          >
            No inclusions listed.
          </Text>
        )}
      </View>

      {/* Footer button — overlaps white body bottom */}
      <View
        style={{
          paddingHorizontal: 16,
          paddingBottom: FOOTER_H,
          marginTop: -30,
          alignItems: "center",
        }}
      >
        <Pressable
          onPress={onSelect}
          style={{
            width: "85%",
            backgroundColor: ORANGE,
            borderWidth: 2,
            borderColor: "#fff",
            borderRadius: 50,
            paddingVertical: 12,
            paddingHorizontal: 16,
            alignItems: "center",
            justifyContent: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 10,
            elevation: 4,
          }}
          accessibilityRole="button"
          accessibilityLabel={`Select ${pkg.name}`}
        >
          <Text
            style={{
              color: "#fff",
              fontSize: 15,
              fontWeight: "700",
              letterSpacing: 0.5,
              textAlign: "center",
            }}
          >
            {getPackageButtonPrefix(pkg)}
            {getPackageButtonName(pkg)}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
