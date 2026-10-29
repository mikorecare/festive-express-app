import { ActivityIndicator, Pressable, Text, View } from "react-native";

const ORANGE = "#F49321";

export function SubmitButtons({
  isLoading,
  onLightUp,
  onPreviewOnly,
}: {
  isLoading: boolean;
  onLightUp: () => void;
  onPreviewOnly: () => void;
}) {
  return (
    <View style={{ gap: 6 }}>
      <Pressable
        onPress={onLightUp}
        disabled={isLoading}
        style={{
          backgroundColor: isLoading ? "#fdba74" : ORANGE,
          height: 42,
          borderRadius: 10,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: "#fff", fontSize: 13, fontWeight: "700" }}>
            Light up my home →
          </Text>
        )}
      </Pressable>

      <Pressable
        onPress={onPreviewOnly}
        disabled={isLoading}
        style={{
          borderWidth: 1,
          borderColor: "#d1d5db",
          height: 38,
          borderRadius: 10,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ color: "#374151", fontSize: 12, fontWeight: "600" }}>
          Check address only (no lights)
        </Text>
      </Pressable>
    </View>
  );
}
