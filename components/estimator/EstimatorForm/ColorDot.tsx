import { View } from "react-native";

export function ColorDot({
  scheme,
  sw,
  size = 18,
}: {
  scheme?: string;
  sw?: string;
  size?: number;
}) {
  const border = 2;
  const inner = size - border * 2;

  if (scheme === "candy-cane") {
    // Diagonal red/white stripes clipped to the circle.
    const stripeW = Math.max(2, inner / 4);
    const stripeCount = 5;
    return (
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          overflow: "hidden",
          borderWidth: border,
          borderColor: "#d1d5db",
          backgroundColor: "#fff",
        }}
      >
        <View
          style={{
            width: "100%",
            height: "100%",
            transform: [{ rotate: "45deg" }],
          }}
        >
          {Array.from({ length: stripeCount }).map((_, i) => (
            <View
              key={i}
              style={{
                position: "absolute",
                top: -size,
                bottom: -size,
                left: i * stripeW * 2,
                width: stripeW,
                backgroundColor: "#e11d48",
              }}
            />
          ))}
        </View>
      </View>
    );
  }

  if (scheme === "multicolor") {
    // True pie: 5 wedges drawn as rotated triangle-ish halves.
    const colors = ["#ef4444", "#eab308", "#22c55e", "#3b82f6", "#a855f7"];
    const slice = 360 / colors.length;
    return (
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          overflow: "hidden",
          borderWidth: border,
          borderColor: "#d1d5db",
          backgroundColor: "#fff",
        }}
      >
        {colors.map((c, i) => (
          <View
            key={c}
            style={{
              position: "absolute",
              width: size,
              height: size,
              alignItems: "center",
              transform: [{ rotate: `${i * slice}deg` }],
            }}
          >
            <View
              style={{
                width: 0,
                height: 0,
                borderLeftWidth: size / 2,
                borderRightWidth: size / 2,
                borderBottomWidth: size,
                borderLeftColor: "transparent",
                borderRightColor: "transparent",
                borderBottomColor: c,
              }}
            />
          </View>
        ))}
      </View>
    );
  }

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: sw ?? "#e2e8f0",
        borderWidth: border,
        borderColor: "#d1d5db",
      }}
    />
  );
}
