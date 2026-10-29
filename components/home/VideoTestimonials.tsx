import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useState } from "react";
import {
  Modal,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

const ORANGE = "#F49321";
const NAVY = "#1C2D5B";

type Video = {
  name: string;
  role?: string;
  thumbnail: any;
  embedUrl: string;
};

const VIDEOS: Video[] = [
  {
    name: "Brad Gucciardo",
    role: "Bradenton, FL",
    thumbnail: require("@/assets/images/video-testimonials/brand-thumbnail.webp"),
    embedUrl:
      "https://motion-media-llc.aryeo.com/videos/3d6302ac-635a-4e84-aa60-483f5fc4a8af",
  },
  {
    name: "Liz Hazeltine",
    role: "Sarasota, FL",
    thumbnail: require("@/assets/images/video-testimonials/liz-thumbnail.webp"),
    embedUrl:
      "https://motion-media-llc.aryeo.com/videos/cd6ca120-6018-46b8-a80c-b94c4b41b1ff",
  },
  {
    name: "Tim and Jonnie Dwyer",
    role: "Lakewood Ranch, FL",
    thumbnail: require("@/assets/images/video-testimonials/tim-thumbnail.webp"),
    embedUrl:
      "https://motion-media-llc.aryeo.com/videos/12e4f5c1-434d-4fcc-934a-603377c6bca9",
  },
  {
    name: "The Lasotas",
    role: "Bradenton, FL",
    thumbnail: require("@/assets/images/video-testimonials/lasotas-thumbnail.webp"),
    embedUrl:
      "https://motion-media-llc.aryeo.com/videos/baaf6341-ad2e-402d-9840-3fdc564368b6",
  },
  {
    name: "Neil and Lambi Newsham",
    role: "Bradenton, FL",
    thumbnail: require("@/assets/images/video-testimonials/newsham-thumbnail.webp"),
    embedUrl:
      "https://motion-media-llc.aryeo.com/videos/23ded663-b133-492c-954f-3e6cf0236308",
  },
  {
    name: "The Johansen Family",
    role: "Lakewood Ranch, FL",
    thumbnail: require("@/assets/images/video-testimonials/johansen-thumbnail.webp"),
    embedUrl:
      "https://motion-media-llc.aryeo.com/videos/0190d40e-ba8c-732f-81c8-c9b87dd393e1",
  },
  {
    name: "The Volonino Family",
    role: "Bradenton, FL",
    thumbnail: require("@/assets/images/video-testimonials/volonino-thumbnail.webp"),
    embedUrl:
      "https://motion-media-llc.aryeo.com/videos/019149a7-c015-7036-ba78-9c2087814cb8",
  },
];

const GAP = 8;
const H_PADDING = 14;

export function VideoTestimonials() {
  const { width: SCREEN_W } = useWindowDimensions();
  const CARD_W = (SCREEN_W - H_PADDING * 2 - GAP) / 2;
  const CARD_H = CARD_W * 1.6;

  const [active, setActive] = useState<Video | null>(null);

  return (
    <View className="mt-5 w-full">
      {/* Heading */}
      <View style={{ paddingHorizontal: H_PADDING }}>
        <Text
          style={{
            fontSize: 19,
            fontWeight: "800",
            lineHeight: 23,
            color: NAVY,
          }}
        >
          Video testimonials
        </Text>
        <Text
          style={{
            fontSize: 19,
            fontWeight: "800",
            lineHeight: 23,
            color: ORANGE,
          }}
        >
          Hear it from our neighbors
        </Text>
        <Text
          style={{
            marginTop: 5,
            fontSize: 12,
            fontWeight: "500",
            color: "#000",
            lineHeight: 17,
          }}
        >
          Real homeowners on renting the magic and enjoying the season from the
          couch.
        </Text>
      </View>

      {/* 2-column grid */}
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-between",
          rowGap: GAP,
          paddingTop: 10,
          paddingBottom: 14,
        }}
      >
        {VIDEOS.map((video) => (
          <ReelCard
            key={video.name}
            video={video}
            onPress={() => setActive(video)}
          />
        ))}
      </View>

      {/* Modal player */}
      <Modal
        visible={!!active}
        transparent
        animationType="fade"
        onRequestClose={() => setActive(null)}
        statusBarTranslucent
      >
        <View style={{ flex: 1, backgroundColor: "#000" }}>
          <SafeAreaView style={{ flex: 1 }}>
            {active && (
              <>
                <WebView
                  source={{ uri: active.embedUrl }}
                  style={{ flex: 1, backgroundColor: "#000" }}
                  allowsFullscreenVideo
                  allowsInlineMediaPlayback
                  mediaPlaybackRequiresUserAction={false}
                  javaScriptEnabled
                  domStorageEnabled
                />

                {/* Name overlay */}
                <View
                  pointerEvents="none"
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: 10,
                    paddingHorizontal: 14,
                    paddingTop: 10,
                    paddingBottom: 28,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: "700",
                      textTransform: "uppercase",
                      letterSpacing: 0.4,
                      color: "#fff",
                    }}
                  >
                    {active.name}
                  </Text>
                  {active.role ? (
                    <Text
                      style={{
                        marginTop: 1,
                        fontSize: 11,
                        color: "rgba(255,255,255,0.8)",
                      }}
                    >
                      {active.role}
                    </Text>
                  ) : null}
                </View>

                {/* Close button */}
                <Pressable
                  onPress={() => setActive(null)}
                  hitSlop={12}
                  style={{
                    position: "absolute",
                    right: 12,
                    top: 12,
                    zIndex: 20,
                    height: 38,
                    width: 38,
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 19,
                    backgroundColor: "rgba(255,255,255,0.05)",
                  }}
                  accessibilityRole="button"
                  accessibilityLabel="Close video"
                >
                  <Ionicons name="close" size={22} color="#fff" />
                </Pressable>
              </>
            )}
          </SafeAreaView>
        </View>
      </Modal>
    </View>
  );
}

function ReelCard({ video, onPress }: { video: Video; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 12,
        width: "48%",
        aspectRatio: 1 / 1.6,
      }}
      accessibilityRole="button"
      accessibilityLabel={`Play testimonial from ${video.name}`}
    >
      <Image
        source={video.thumbnail}
        style={{ width: "100%", height: "100%" }}
        contentFit="cover"
      />

      {/* Dark overlay */}
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(28,45,91,0.32)",
        }}
      />

      {/* Play button center */}
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            height: 44,
            width: 44,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 22,
            backgroundColor: "transparent",
            borderWidth: 2,
            borderColor: "white",
          }}
        >
          <Ionicons
            name="play"
            size={18}
            color={ORANGE}
            style={{ marginLeft: 2 }}
          />
        </View>
      </View>

      {/* Name at bottom */}
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          paddingHorizontal: 10,
          paddingVertical: 8,
          backgroundColor: "rgba(28,45,91,0.7)",
        }}
      >
        <Text
          style={{
            fontSize: 11,
            fontWeight: "700",
            textTransform: "uppercase",
            letterSpacing: 0.4,
            color: "#fff",
          }}
          numberOfLines={1}
        >
          {video.name}
        </Text>
        {video.role ? (
          <Text
            style={{
              marginTop: 1,
              fontSize: 9,
              color: "rgba(255,255,255,0.8)",
            }}
            numberOfLines={1}
          >
            {video.role}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}
