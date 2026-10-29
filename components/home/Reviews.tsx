import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ORANGE = "#F49321";
const NAVY = "#1C2D5B";

const sectionBg = require("@/assets/images/reviews/reviews-bg.webp");

type Review = {
  name: string;
  location: string;
  text: string;
  image?: any;
};

const REVIEWS: Review[] = [
  {
    name: "Tom Leonard",
    location: "St. Armand Circle, Long Boat Key, FL",
    text: "We gave Festive Lighting Pros a unique challenge when we started this and we had over 100 trees in a park to light plus we wanted to create a ceiling over the park. They came up with an ingenious idea to stream cables across the bar and hung over one hundred spheres from these cables. It turned out magical. Everybody loves it. And it's been a pleasure to work with someone that can actually think outside the box.",
    image: require("@/assets/images/reviews/Tom-Leonard.R9aNuc-q.webp"),
  },
  {
    name: "Austin York",
    location: "Sun Outdoors, Sarasota, FL",
    text: "Hi my name is Austin from Sun Outdoors Sarasota and we use Festive Lighting Pros for our holiday lighting needs. From the very beginning, Matt and his team are professional, timely, and courteous.",
    image: require("@/assets/images/reviews/Austin-York.paittgJr.webp"),
  },
  {
    name: "Mitch Good",
    location: "El Melvin Cocina Mexicana, Downtown Sarasota, FL",
    text: "I just want to give a quick shout out to Festive Lighting Pros. They've been with us for about a year now. They take care of all your maintenance. Our customers love it. We love it.",
    image: require("@/assets/images/reviews/Mitch-Good.CUnh5dH7.webp"),
  },
  {
    name: "Kelly Johnson",
    location: "Kia of Port Charlotte",
    text: "They (Festive Lighting Pros) were professional. They were quick, they installed everything with safety in mind, and you can see how beautiful the results are.",
    image: require("@/assets/images/reviews/Kelly-Johnson.D7E2qk98.webp"),
  },
  {
    name: "Jonnie and Tim Dwyer",
    location: "Lakewood Ranch, FL",
    text: "Festive Lighting Pros took away such tremendous stress by making our home look so beautiful for our grandchildren. The enchantment that they experienced was worth every penny. It gave us more time and more opportunities to enjoy the holidays rather than making it all work and Matt's installers, they were so professional.",
    image: require("@/assets/images/reviews/Dwyers.Fhz14vyW.webp"),
  },
  {
    name: "Brad Gucciardo",
    location: "Bella Sole, Bradenton, FL",
    text: "They did an amazing job decorating my home to say that Festive Lighting Pros changed my entire attitude about Christmas specially this year is an understatement. This is incredible to come home to this every day is amazing. You will have a smile on your face, every morning every night when you come home.",
    image: require("@/assets/images/reviews/Brad-Gucciardo.UcbiY9kA.webp"),
  },
  {
    name: "Dennis and Kathy Lasota",
    location: "Lakewood National Golf Course, Bradenton, FL",
    text: "This is our first year having our home completely decorated and had Festival Lighting Pros take care of it for us. We were very pleased with the end results and it saved my back and perhaps a spill on the ladder. And we are excited to show off our house.",
    image: require("@/assets/images/reviews/Lasotas.D48-FVY2.webp"),
  },
  {
    name: "Neil Newsham",
    location: "Bradenton, FL",
    text: "I couldn't be more happy with the services provided by Festive Lighting Pros. They were very, very efficient, very, very professional, easy to deal with. We really liked the way our house turned out.",
    image: require("@/assets/images/reviews/Niel-Newshams.D9nvFpN1.webp"),
  },
  {
    name: "Liz Hazeltine",
    location: "Sarasota, FL",
    text: "Hi, my name is Liz and we live in Sarasota. This was a new house and our first Christmas in it and we wanted it to look spectacular. So we hired Festive Lighting Pros and we got beyond our wildest dreams. They were easy to work with. And the house looks great and you can see for yourself.",
    image: require("@/assets/images/reviews/Liz-Hazeltine.x-axJl76.webp"),
  },
  {
    name: "Darren and Amanda Arrington",
    location: "Miromar Lakes, Ft. Myers, FL",
    text: "We've been working with Festival Lighting Pros the last two years to come put up lights at our house. They suggest new things that we can add every year. We're a little bit biased, but we think we've got the best house in the neighborhood with lights and all the neighbors come by.",
    image: require("@/assets/images/reviews/Arringtons.FrDOaoRb.webp"),
  },
];

const H_PADDING = 14;
const GAP = 12;
const AUTO_SCROLL_MS = 4000;

export function Reviews() {
  const { width: SCREEN_W } = useWindowDimensions();
  const CARD_W = SCREEN_W * 0.85;

  const listRef = useRef<FlatList<Review>>(null);
  const currentIndex = useRef(0);
  const paused = useRef(false);
  const autoScrollTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [activeReview, setActiveReview] = useState<Review | null>(null);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: Array<{ index?: number }> }) => {
      const first = viewableItems[0];
      if (first?.index != null) {
        setActiveIndex(first.index);
        currentIndex.current = first.index;
      }
    },
  ).current;

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 60 }).current;

  const startAutoScroll = () => {
    stopAutoScroll();
    autoScrollTimer.current = setInterval(() => {
      if (paused.current) return;
      if (!listRef.current) return;

      const next = currentIndex.current + 1;
      if (next >= REVIEWS.length) {
        listRef.current.scrollToIndex({ index: 0, animated: true });
      } else {
        listRef.current.scrollToIndex({ index: next, animated: true });
      }
    }, AUTO_SCROLL_MS);
  };

  const stopAutoScroll = () => {
    if (autoScrollTimer.current) {
      clearInterval(autoScrollTimer.current);
      autoScrollTimer.current = null;
    }
  };

  useEffect(() => {
    startAutoScroll();
    return stopAutoScroll;
  }, []);

  const scrollByCard = (direction: 1 | -1) => {
    const next = currentIndex.current + direction;
    if (next < 0 || next >= REVIEWS.length) return;
    listRef.current?.scrollToIndex({ index: next, animated: true });
  };

  return (
    <View
      style={{ position: "relative", paddingVertical: 24, overflow: "hidden" }}
    >
      <Image
        source={sectionBg}
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
        contentFit="cover"
      />

      <View style={{ position: "relative" }}>
        {/* Header */}
        <View style={{ paddingHorizontal: H_PADDING, marginBottom: 14 }}>
          <Text
            style={{
              color: ORANGE,
              fontSize: 14,
              fontWeight: "800",
              letterSpacing: 0.6,
              marginBottom: 4,
              textShadowColor: "rgba(28,45,91,0.45)",
              textShadowOffset: { width: 0, height: 3 },
              textShadowRadius: 8,
            }}
          >
            What Customers Say
          </Text>
          <Text
            style={{
              fontSize: 19,
              fontWeight: "800",
              color: NAVY,
              lineHeight: 23,
              marginBottom: 6,
              textShadowColor: "rgba(28,45,91,0.45)",
              textShadowOffset: { width: 0, height: 3 },
              textShadowRadius: 8,
            }}
          >
            Five-Star Service Across Every Lighting Project
          </Text>
          <Text
            style={{
              color: NAVY,
              fontSize: 12,
              fontWeight: "600",
              lineHeight: 17,
            }}
          >
            See why homeowners and businesses trust{" "}
            <Text style={{ fontWeight: "800" }}>Festive Express</Text> for
            professional holiday lighting services.
          </Text>
        </View>

        {/* Carousel */}
        <FlatList
          ref={listRef}
          data={REVIEWS}
          keyExtractor={(r) => r.name}
          horizontal
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          snapToInterval={CARD_W + GAP}
          snapToAlignment="start"
          disableIntervalMomentum
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          onScrollBeginDrag={() => {
            paused.current = true;
          }}
          onScrollEndDrag={() => {
            paused.current = false;
          }}
          contentContainerStyle={{ paddingHorizontal: H_PADDING, gap: GAP }}
          getItemLayout={(_, index) => ({
            length: CARD_W + GAP,
            offset: (CARD_W + GAP) * index,
            index,
          })}
          renderItem={({ item }) => (
            <View style={{ width: CARD_W }}>
              <ReviewCard
                review={item}
                onReadMore={() => setActiveReview(item)}
              />
            </View>
          )}
        />

        {/* Dots */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            gap: 5,
            marginTop: 10,
          }}
        >
          {REVIEWS.map((_, i) => (
            <Pressable
              key={i}
              hitSlop={6}
              onPress={() => {
                listRef.current?.scrollToIndex({ index: i, animated: true });
              }}
              style={{
                width: i === activeIndex ? 16 : 5,
                height: 5,
                borderRadius: 2.5,
                backgroundColor:
                  i === activeIndex ? ORANGE : "rgba(28,45,91,0.3)",
              }}
            />
          ))}
        </View>

        {/* Arrows — tablet+ only */}
        {SCREEN_W >= 768 ? (
          <>
            <Pressable
              onPress={() => scrollByCard(-1)}
              style={{
                position: "absolute",
                left: 4,
                top: "50%",
                marginTop: -18,
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: "#fff",
                alignItems: "center",
                justifyContent: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.15,
                shadowRadius: 6,
                elevation: 4,
              }}
              accessibilityLabel="Previous reviews"
            >
              <Ionicons name="chevron-back" size={18} color={NAVY} />
            </Pressable>
            <Pressable
              onPress={() => scrollByCard(1)}
              style={{
                position: "absolute",
                right: 4,
                top: "50%",
                marginTop: -18,
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: "#fff",
                alignItems: "center",
                justifyContent: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.15,
                shadowRadius: 6,
                elevation: 4,
              }}
              accessibilityLabel="Next reviews"
            >
              <Ionicons name="chevron-forward" size={18} color={NAVY} />
            </Pressable>
          </>
        ) : null}
      </View>

      {/* Modal */}
      <Modal
        visible={!!activeReview}
        transparent
        animationType="slide"
        onRequestClose={() => setActiveReview(null)}
        statusBarTranslucent
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.6)",
            justifyContent: "flex-end",
          }}
        >
          <SafeAreaView
            style={{
              backgroundColor: "#fff",
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              maxHeight: "90%",
            }}
          >
            {/* Header */}
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
              <View>
                <Text
                  style={{
                    color: ORANGE,
                    fontSize: 11,
                    fontWeight: "800",
                    letterSpacing: 0.5,
                    marginBottom: 1,
                  }}
                >
                  What Customers Say
                </Text>
                <Text style={{ fontSize: 16, fontWeight: "700", color: NAVY }}>
                  Customer Reviews
                </Text>
              </View>
              <Pressable
                onPress={() => setActiveReview(null)}
                hitSlop={12}
                accessibilityLabel="Close reviews"
                style={{
                  padding: 6,
                  marginRight: -6,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="close" size={22} color="#9ca3af" />
              </Pressable>
            </View>

            {/* Review list */}
            <ScrollView
              contentContainerStyle={{ padding: 12, gap: 8 }}
              showsVerticalScrollIndicator={false}
            >
              {REVIEWS.map((review, i) => (
                <View
                  key={i}
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: "#f3f4f6",
                    padding: 12,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: 6,
                      marginBottom: 8,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 8,
                        flex: 1,
                      }}
                    >
                      <View
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: 17,
                          backgroundColor: "#f3f4f6",
                          overflow: "hidden",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {review.image ? (
                          <Image
                            source={review.image}
                            style={{ width: "100%", height: "100%" }}
                            contentFit="cover"
                          />
                        ) : (
                          <Text
                            style={{
                              fontSize: 15,
                              fontWeight: "700",
                              color: NAVY,
                            }}
                          >
                            {review.name.charAt(0)}
                          </Text>
                        )}
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text
                          style={{
                            fontSize: 13,
                            fontWeight: "700",
                            color: NAVY,
                          }}
                          numberOfLines={1}
                        >
                          {review.name}
                        </Text>
                        <Text
                          style={{ fontSize: 11, color: "#6b7280" }}
                          numberOfLines={1}
                        >
                          {review.location}
                        </Text>
                      </View>
                    </View>
                    <GoogleIcon size={18} />
                  </View>

                  <Stars compact />

                  <Text
                    style={{
                      fontSize: 12,
                      color: "#374151",
                      lineHeight: 18,
                      marginTop: 6,
                    }}
                  >
                    {review.text}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </SafeAreaView>
        </View>
      </Modal>
    </View>
  );
}

function ReviewCard({
  review,
  onReadMore,
}: {
  review: Review;
  onReadMore: () => void;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: NAVY,
        borderRadius: 12,
        overflow: "hidden",
        height: 220,
      }}
    >
      {/* LEFT — 42% */}
      <View style={{ width: "42%", backgroundColor: "#fff" }}>
        <View style={{ width: "100%", aspectRatio: 1, overflow: "hidden" }}>
          {review.image ? (
            <Image
              source={review.image}
              style={{ width: "100%", height: "100%" }}
              contentFit="cover"
            />
          ) : (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#f3f4f6",
              }}
            >
              <Text style={{ fontSize: 28, fontWeight: "700", color: NAVY }}>
                {review.name.charAt(0)}
              </Text>
            </View>
          )}
        </View>

        <View style={{ paddingHorizontal: 8, paddingTop: 6 }}>
          <Text
            style={{ fontSize: 12, fontWeight: "700", color: NAVY }}
            numberOfLines={1}
          >
            {review.name}
          </Text>
          <Text
            style={{
              fontSize: 9,
              fontWeight: "600",
              color: "#000",
              opacity: 0.8,
              marginTop: 1,
            }}
            numberOfLines={2}
          >
            {review.location}
          </Text>
        </View>

        <View
          style={{
            marginTop: "auto",
            paddingHorizontal: 8,
            paddingTop: 4,
            paddingBottom: 8,
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
            flexWrap: "wrap",
          }}
        >
          <Stars compact />
          <GoogleIcon size={14} />
        </View>
      </View>

      {/* Separator */}
      <View style={{ flexDirection: "row" }}>
        <View style={{ width: 3, backgroundColor: "#fff" }} />
        <View style={{ width: 3, backgroundColor: ORANGE }} />
      </View>

      {/* RIGHT */}
      <View
        style={{
          flex: 1,
          padding: 10,
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{
            fontSize: 12,
            color: "rgba(255,255,255,0.9)",
            lineHeight: 17,
          }}
          numberOfLines={8}
        >
          {review.text}
        </Text>

        <Pressable
          onPress={onReadMore}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 3,
            paddingTop: 8,
          }}
          accessibilityLabel={`Read full review for ${review.name}`}
        >
          <Text
            style={{
              color: ORANGE,
              fontWeight: "700",
              fontSize: 11,
              letterSpacing: 0.4,
            }}
          >
            Read more
          </Text>
          <Ionicons name="chevron-forward" size={11} color={ORANGE} />
        </Pressable>
      </View>
    </View>
  );
}

function Stars({ compact }: { compact?: boolean }) {
  const size = compact ? 10 : 12;
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 1,
        paddingHorizontal: compact ? 5 : 7,
        paddingVertical: compact ? 2 : 3,
        borderRadius: 40,
        backgroundColor: "#f8f2e7",
        alignSelf: "flex-start",
      }}
    >
      {[1, 2, 3, 4, 5].map((s) => (
        <Ionicons key={s} name="star" size={size} color={ORANGE} />
      ))}
    </View>
  );
}

function GoogleIcon({ size }: { size: number }) {
  return (
    <View style={{ width: size, height: size }}>
      <Text
        style={{
          fontSize: size,
          fontWeight: "900",
          color: "#4285F4",
          lineHeight: size,
        }}
      >
        G
      </Text>
    </View>
  );
}
