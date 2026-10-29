import type {
  ColorOption,
  IPackageOption,
} from "@/hooks/estimator/useEstimator";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { ColorDot } from "./ColorDot";

const ORANGE = "#F49321";
const NAVY = "#1C2D5B";

const LABEL_STYLE = {
  fontSize: 13,
  fontWeight: "600" as const,
  color: "#374151",
  marginBottom: 4,
};

const TRIGGER_STYLE = {
  height: 42,
  borderRadius: 10,
  borderWidth: 1.5,
  borderColor: "#d1d5db",
  backgroundColor: "#f8f9fa",
  flexDirection: "row" as const,
  alignItems: "center" as const,
  justifyContent: "space-between" as const,
  paddingHorizontal: 10,
};

export function PackageColorPicker({
  selectedPackageData,
  selectedColorScheme,
  colorOptions,
  onOpenPackage,
  onOpenColor,
}: {
  selectedPackageData?: IPackageOption;
  selectedColorScheme: string;
  colorOptions: ColorOption[];
  onOpenPackage: () => void;
  onOpenColor: () => void;
}) {
  const selectedColor = colorOptions.find(
    (c) => c.scheme === selectedColorScheme,
  );

  return (
    <View style={{ flexDirection: "row", gap: 8 }}>
      {/* Package trigger */}
      <View style={{ flex: 1 }}>
        <Text style={LABEL_STYLE}>Your package</Text>
        <Pressable onPress={onOpenPackage} style={TRIGGER_STYLE}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "baseline",
              gap: 4,
              flex: 1,
            }}
          >
            <Text
              style={{ fontSize: 13, fontWeight: "800", color: ORANGE }}
              numberOfLines={1}
            >
              {selectedPackageData?.name ?? "Select"}
            </Text>
            {selectedPackageData ? (
              <Text
                style={{ fontSize: 11, color: "#6b7280" }}
                numberOfLines={1}
              >
                ${selectedPackageData.price.toLocaleString()}
              </Text>
            ) : null}
          </View>
          <Ionicons name="chevron-down" size={12} color="#9ca3af" />
        </Pressable>
      </View>

      {/* Color trigger */}
      <View style={{ flex: 1 }}>
        <Text style={LABEL_STYLE}>Light color</Text>
        <Pressable onPress={onOpenColor} style={TRIGGER_STYLE}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              flex: 1,
            }}
          >
            <ColorDot
              scheme={selectedColor?.scheme}
              sw={selectedColor?.sw}
              size={16}
            />
            <Text
              style={{ fontSize: 13, fontWeight: "700", color: NAVY }}
              numberOfLines={1}
            >
              {selectedColor?.label ?? "Select"}
            </Text>
          </View>
          <Ionicons name="chevron-down" size={12} color="#9ca3af" />
        </Pressable>
      </View>
    </View>
  );
}
