import { Image } from "expo-image";
import { Text, View } from "react-native";

const NAVY = "#1C2D5B";

export function InclusionList({ inclusions }: { inclusions: any[] }) {
  if (!inclusions.length) return null;

  return (
    <View style={{ marginTop: 12 }}>
      <Text
        style={{
          fontSize: 13,
          fontWeight: "800",
          color: NAVY,
          marginBottom: 8,
        }}
      >
        Package Inclusions:
      </Text>

      <View style={{ gap: 6 }}>
        {inclusions.map((row, i) => (
          <View
            key={i}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              paddingVertical: 6,
              paddingHorizontal: 8,
              borderWidth: 1,
              borderColor: "#e2e8f0",
              borderRadius: 8,
              backgroundColor: "#fff",
            }}
          >
            {row.inclusion_items?.image_url ? (
              <Image
                source={{ uri: row.inclusion_items.image_url }}
                style={{ width: 24, height: 24 }}
                contentFit="contain"
              />
            ) : (
              <Text style={{ color: "#10b981", fontWeight: "800" }}>✔</Text>
            )}
            <Text
              style={{
                flex: 1,
                fontSize: 12,
                fontWeight: "600",
                color: NAVY,
                lineHeight: 16,
              }}
            >
              {row.label_override ?? row.inclusion_items?.name}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
