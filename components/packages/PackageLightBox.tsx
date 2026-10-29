import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const IMAGE_ASPECT = 800 / 420;

const HOTSPOT_COLORS = [
  "#F49321",
  "#3B82F6",
  "#10B981",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
  "#F59E0B",
  "#06B6D4",
];

type Hotspot = {
  key: string;
  top: string;
  left: string;
  label: string;
  thumb?: string;
};

export function PackageLightbox({
  visible,
  image,
  hotspots,
  onClose,
}: {
  visible: boolean;
  image: string | null;
  hotspots: Hotspot[];
  onClose: () => void;
}) {
  const { width: SCREEN_W, height: SCREEN_H } = useWindowDimensions();

  const maxImgW = SCREEN_W - 24;
  const maxImgH = SCREEN_H * 0.45;
  const imgW = Math.min(maxImgW, maxImgH * IMAGE_ASPECT);
  const imgH = imgW / IMAGE_ASPECT;

  const colorFor = (index: number) =>
    HOTSPOT_COLORS[index % HOTSPOT_COLORS.length];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={{ flex: 1, backgroundColor: "#000" }}>
        <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
          {/* Close button */}
          <Pressable
            onPress={onClose}
            hitSlop={12}
            accessibilityLabel="Close image"
            style={{
              position: "absolute",
              top: 8,
              right: 12,
              width: 38,
              height: 38,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 19,
              backgroundColor: "rgba(255,255,255,0.15)",
              zIndex: 40,
            }}
          >
            <Ionicons name="close" size={22} color="#fff" />
          </Pressable>

          <View style={{ flex: 1, paddingTop: 48 }}>
            {/* Image with hotspots */}
            <View style={{ alignItems: "center" }}>
              <View
                style={{
                  width: imgW,
                  height: imgH,
                  position: "relative",
                  borderRadius: 10,
                  overflow: "hidden",
                }}
              >
                {image ? (
                  <Image
                    source={{ uri: image }}
                    style={{ width: "100%", height: "100%" }}
                    contentFit="contain"
                  />
                ) : null}

                {hotspots.map((spot, i) => {
                  const color = colorFor(i);
                  return (
                    <View
                      key={spot.key}
                      pointerEvents="none"
                      style={{
                        position: "absolute",
                        top: spot.top,
                        left: spot.left,
                        width: 16,
                        height: 16,
                        marginLeft: -8,
                        marginTop: -8,
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 10,
                      }}
                    >
                      <View
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: 4,
                          borderWidth: 1.5,
                          borderColor: "#fff",
                          backgroundColor: color,
                          shadowColor: "#000",
                          shadowOffset: { width: 0, height: 1 },
                          shadowOpacity: 0.4,
                          shadowRadius: 2,
                          elevation: 3,
                        }}
                      />
                    </View>
                  );
                })}
              </View>
            </View>

            {/* Legend list below image */}
            <ScrollView
              style={{ flex: 1, marginTop: 12 }}
              contentContainerStyle={{
                paddingHorizontal: 16,
                paddingBottom: 20,
              }}
              showsVerticalScrollIndicator={false}
            >
              {hotspots.map((spot, i) => {
                const color = colorFor(i);
                return (
                  <View
                    key={spot.key}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 10,
                      paddingVertical: 7,
                      borderBottomWidth: 1,
                      borderBottomColor: "rgba(255,255,255,0.1)",
                    }}
                  >
                    {/* Color dot */}
                    <View
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        borderWidth: 1.5,
                        borderColor: "#fff",
                        backgroundColor: color,
                      }}
                    />

                    {/* Thumbnail */}
                    {spot.thumb ? (
                      <Image
                        source={{ uri: spot.thumb }}
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 6,
                          backgroundColor: "rgba(255,255,255,0.1)",
                        }}
                        contentFit="contain"
                      />
                    ) : (
                      <View
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 6,
                          backgroundColor: "rgba(255,255,255,0.1)",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Ionicons
                          name="sparkles"
                          size={14}
                          color="rgba(255,255,255,0.5)"
                        />
                      </View>
                    )}

                    {/* Label */}
                    <Text
                      style={{
                        flex: 1,
                        fontSize: 12,
                        fontWeight: "700",
                        color: "#fff",
                        lineHeight: 16,
                      }}
                      numberOfLines={2}
                    >
                      {spot.label}
                    </Text>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}
