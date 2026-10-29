import type { SkuRow } from "@/hooks/packages/usePackageSkus";
import type { ProductColor } from "@/hooks/product-colors/useProductColors";
import { Pressable, ScrollView, Text, View } from "react-native";
import Svg, {
  Circle,
  Defs,
  G,
  LinearGradient,
  Path,
  Pattern,
  Rect,
  Stop,
} from "react-native-svg";

const ORANGE = "#F49321";
const NAVY = "#1C2D5B";
const SIZE = 26;

/* ... all your Swatch components stay exactly the same ... */

function SolidSwatch({ hex, border }: { hex: string; border: string }) {
  return (
    <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
      <Circle
        cx={SIZE / 2}
        cy={SIZE / 2}
        r={SIZE / 2 - 1}
        fill={hex}
        stroke={border}
        strokeWidth={1.5}
      />
    </Svg>
  );
}

function ChampagneSwatch() {
  return (
    <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
      <Defs>
        <LinearGradient id="champ" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor="#e8d5a3" />
          <Stop offset="0.5" stopColor="#e8d5a3" />
          <Stop offset="0.5" stopColor="#f8fafc" />
          <Stop offset="1" stopColor="#f8fafc" />
        </LinearGradient>
      </Defs>
      <Circle
        cx={SIZE / 2}
        cy={SIZE / 2}
        r={SIZE / 2 - 1}
        fill="url(#champ)"
        stroke="#cbd5e1"
        strokeWidth={1.5}
      />
    </Svg>
  );
}

function CandyCaneSwatch() {
  const stripeSize = 5;
  return (
    <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
      <Defs>
        <Pattern
          id="candy"
          width={stripeSize * 2}
          height={stripeSize * 2}
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <Rect width={stripeSize} height={stripeSize * 2} fill="#fff" />
          <Rect
            x={stripeSize}
            width={stripeSize}
            height={stripeSize * 2}
            fill="#e11d48"
          />
        </Pattern>
      </Defs>
      <Circle
        cx={SIZE / 2}
        cy={SIZE / 2}
        r={SIZE / 2 - 1}
        fill="url(#candy)"
        stroke="#cbd5e1"
        strokeWidth={1.5}
      />
    </Svg>
  );
}

function MulticolorSwatch() {
  const cx = SIZE / 2;
  const cy = SIZE / 2;
  const r = SIZE / 2 - 1;
  const sliceColors = ["#ef4444", "#eab308", "#22c55e", "#3b82f6", "#a855f7"];
  const sliceAngle = 360 / sliceColors.length;

  const polar = (angleDeg: number, radius: number) => {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
  };

  const slices = sliceColors.map((color, i) => {
    const startAngle = i * sliceAngle;
    const endAngle = (i + 1) * sliceAngle;
    const start = polar(startAngle, r);
    const end = polar(endAngle, r);
    const largeArc = sliceAngle > 180 ? 1 : 0;
    const path = `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y} Z`;
    return { color, path };
  });

  return (
    <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
      <G>
        {slices.map((s, i) => (
          <Path key={i} d={s.path} fill={s.color} />
        ))}
      </G>
      <Circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="#cbd5e1"
        strokeWidth={1.5}
      />
    </Svg>
  );
}

function SwatchCircle({ color }: { color?: ProductColor }) {
  if (!color) {
    return <SolidSwatch hex="#e2e8f0" border="#cbd5e1" />;
  }

  const key = color.color_key?.toLowerCase() ?? "";

  if (key === "champagne") return <ChampagneSwatch />;
  if (key === "candy_cane") return <CandyCaneSwatch />;
  if (key === "multicolor") return <MulticolorSwatch />;

  return <SolidSwatch hex={color.hex || "#e2e8f0"} border="#cbd5e1" />;
}

/* ────────────────────────────────────────────────────────── */

export function ColorSwatches({
  skus,
  colors,
  selectedSkuId,
  onSelect,
}: {
  skus: SkuRow[];
  colors: ProductColor[];
  selectedSkuId: string | number | null;
  onSelect: (id: string | number) => void;
}) {
  const sorted = [...skus].sort((a, b) => {
    const i = colors.findIndex((c) => c.color_key === a.color_key);
    const j = colors.findIndex((c) => c.color_key === b.color_key);
    return (i === -1 ? 999 : i) - (j === -1 ? 999 : j);
  });

  const colorOf = (key?: string | null) =>
    colors.find((c) => c.color_key === key);

  return (
    <View
      style={{
        marginTop: 10,
        paddingTop: 10,
        paddingBottom: 10,
        borderTopWidth: 1,
        borderTopColor: "#e2e8f0",
      }}
    >
      <Text
        style={{
          fontSize: 12,
          fontWeight: "800",
          color: NAVY,
          textAlign: "center",
          marginBottom: 8,
        }}
      >
        Select C-9 Light Color
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          gap: 1,
          paddingHorizontal: 2,
        }}
      >
        {sorted.map((sku) => {
          const active = String(selectedSkuId) === String(sku.id);
          const color = colorOf(sku.color_key);
          const label = sku.color_label ?? color?.color_label ?? sku.color_key;
          return (
            <Pressable
              key={sku.id}
              onPress={() => onSelect(sku.id)}
              accessibilityRole="radio"
              accessibilityState={{ checked: active }}
              accessibilityLabel={`${label} color option`}
              style={{
                alignItems: "center",
                gap: 4,
                paddingVertical: 5,
                paddingHorizontal: 5,
                borderRadius: 10,
                borderWidth: 1.5,
                borderColor: active ? ORANGE : "transparent",
                backgroundColor: active ? "#fff7ed" : "#f8fafc",
              }}
            >
              <SwatchCircle color={color} />
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: "600",
                  color: NAVY,
                }}
                numberOfLines={1}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
