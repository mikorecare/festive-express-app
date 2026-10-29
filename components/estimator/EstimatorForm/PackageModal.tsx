import type { IPackageOption } from "@/hooks/estimator/useEstimator";
import { Ionicons } from "@expo/vector-icons";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";

const ORANGE = "#F49321";
const NAVY = "#1C2D5B";

export function PackageModal({
  visible,
  onClose,
  loading,
  options,
  selectedId,
  onSelect,
}: {
  visible: boolean;
  onClose: () => void;
  loading: boolean;
  options: IPackageOption[];
  selectedId: string;
  onSelect: (id: any) => void;
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
              Select your package
            </Text>
            <Pressable onPress={onClose} hitSlop={12}>
              <Ionicons name="close" size={20} color="#9ca3af" />
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={{ padding: 12 }}>
            {loading ? (
              <Text
                style={{
                  textAlign: "center",
                  color: "#6b7280",
                  paddingVertical: 20,
                  fontSize: 13,
                }}
              >
                Loading packages...
              </Text>
            ) : options.length === 0 ? (
              <Text
                style={{
                  textAlign: "center",
                  color: "#6b7280",
                  paddingVertical: 20,
                  fontSize: 13,
                }}
              >
                No packages available.
              </Text>
            ) : (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                {options.map((pkg) => {
                  const active = selectedId === pkg.id;
                  return (
                    <Pressable
                      key={pkg.id}
                      onPress={() => onSelect(pkg.id)}
                      style={{
                        flex: 1,
                        maxWidth: 100,
                        backgroundColor: NAVY,
                        borderRadius: 12,
                        borderWidth: active ? 3 : 2,
                        borderColor: active ? ORANGE : "#4b5563",
                        paddingVertical: 8,
                        paddingHorizontal: 5,
                        alignItems: "center",
                        gap: 3,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: "800",
                          color: "#fff",
                        }}
                        numberOfLines={1}
                      >
                        {pkg.name}
                      </Text>
                      <Text
                        style={{
                          fontSize: 13,
                          fontWeight: "700",
                          color: ORANGE,
                        }}
                      >
                        ${pkg.price.toLocaleString()}
                      </Text>
                      <Text
                        style={{ fontSize: 8, color: "rgba(255,255,255,0.8)" }}
                      >
                        /season
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            )}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
