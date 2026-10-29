import type { ColorOption } from "@/hooks/estimator/useEstimator";
import { Ionicons } from "@expo/vector-icons";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import { ColorDot } from "./ColorDot";

const ORANGE = "#F49321";
const NAVY = "#1C2D5B";

export function ColorModal({
  visible,
  onClose,
  options,
  selectedScheme,
  onSelect,
}: {
  visible: boolean;
  onClose: () => void;
  options: ColorOption[];
  selectedScheme: string;
  onSelect: (scheme: string) => void;
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "center",
          padding: 14,
        }}
        onPress={onClose}
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={{
            backgroundColor: "#fff",
            borderRadius: 14,
            maxHeight: "85%",
            overflow: "hidden",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: 14,
              paddingVertical: 10,
              borderBottomWidth: 1,
              borderBottomColor: "#e5e7eb",
            }}
          >
            <Text style={{ fontSize: 15, fontWeight: "700", color: NAVY }}>
              Select C-9 Light Color
            </Text>
            <Pressable onPress={onClose} hitSlop={12}>
              <Ionicons name="close" size={20} color="#9ca3af" />
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={{ padding: 12 }}>
            {/* Row 1 — 3 items */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                gap: 8,
              }}
            >
              {options.slice(0, 3).map((color) => (
                <ColorCard
                  key={color.scheme}
                  color={color}
                  active={selectedScheme === color.scheme}
                  onPress={() => onSelect(color.scheme)}
                />
              ))}
            </View>

            {/* Row 2 — remaining, centered */}
            {options.length > 3 ? (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: 8,
                  marginTop: 8,
                }}
              >
                {options.slice(3).map((color) => (
                  <ColorCard
                    key={color.scheme}
                    color={color}
                    active={selectedScheme === color.scheme}
                    onPress={() => onSelect(color.scheme)}
                  />
                ))}
              </View>
            ) : null}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function ColorCard({
  color,
  active,
  onPress,
}: {
  color: ColorOption;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        width: 76,
        borderRadius: 10,
        borderWidth: active ? 3 : 1,
        borderColor: active ? ORANGE : "#d1d5db",
        backgroundColor: active ? "#fff7ed" : "#fff",
        paddingVertical: 8,
        alignItems: "center",
        gap: 4,
      }}
    >
      <ColorDot scheme={color.scheme} sw={color.sw} size={30} />
      <Text
        style={{
          fontSize: 10,
          color: NAVY,
          textAlign: "center",
          fontWeight: active ? "700" : "500",
        }}
        numberOfLines={1}
      >
        {color.label}
      </Text>
    </Pressable>
  );
}
