import { Image } from "expo-image";
import { Text, View } from "react-native";

const ORANGE = "#F49321";

const heroBg = require("@/assets/images/banner/hero-new.webp");

export function PackageHero({ subtitleParts }: { subtitleParts: string[] }) {
  const subtitle =
    subtitleParts.length > 1
      ? `${subtitleParts[0]}\n${subtitleParts[1]}`
      : (subtitleParts[0] ?? "");

  return (
    <View style={{ position: "relative", overflow: "hidden" }}>
      <Image
        source={heroBg}
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
        contentFit="cover"
      />

      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 16,
          paddingVertical: 22,
        }}
      >
        <Text
          style={{
            fontSize: 24,
            fontWeight: "800",
            textAlign: "center",
            color: ORANGE,
            textShadowColor: "rgba(0,0,0,0.6)",
            textShadowOffset: { width: 0, height: 3 },
            textShadowRadius: 8,
          }}
        >
          Holiday Lighting
        </Text>
        <Text
          style={{
            fontSize: 24,
            fontWeight: "800",
            textAlign: "center",
            color: "#fff",
            textShadowColor: "rgba(0,0,0,0.6)",
            textShadowOffset: { width: 0, height: 3 },
            textShadowRadius: 8,
          }}
        >
          Packages
        </Text>

        {subtitle ? (
          <Text
            style={{
              marginTop: 10,
              fontSize: 13,
              color: "#e2e8f0",
              textAlign: "center",
              lineHeight: 18,
            }}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
