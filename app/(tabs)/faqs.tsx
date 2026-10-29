import { Body, H1, Screen } from "@/components/ui";
import { colors } from "@/constants/theme";
import { useFaqs } from "@/hooks/faqs/useFaqs";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

const ORANGE = "#F49321";
const NAVY = "#1C2D5B";

export default function Faqs() {
  const { data, pending, error } = useFaqs();
  const { colorScheme } = useColorScheme();
  const c = colors[colorScheme === "dark" ? "dark" : "light"];

  const categories = data?.categories ?? [];

  const [openId, setOpenId] = useState<number | null>(null);

  const toggle = (id: number) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  if (pending) {
    return (
      <Screen>
        <H1>FAQs</H1>
        <View style={{ paddingVertical: 40, alignItems: "center" }}>
          <ActivityIndicator />
          <Text style={{ color: c.muted, marginTop: 8, fontSize: 13 }}>
            Loading FAQs…
          </Text>
        </View>
      </Screen>
    );
  }

  if (error) {
    return (
      <Screen>
        <H1>FAQs</H1>
        <Text
          style={{
            color: "#ef4444",
            textAlign: "center",
            paddingVertical: 40,
            fontSize: 13,
          }}
        >
          Failed to load FAQs
        </Text>
      </Screen>
    );
  }

  return (
    <Screen>
      <H1>FAQs</H1>
      <Body className="mb-4">Quick answers to common questions.</Body>

      <View style={{ gap: 20 }}>
        {categories.map((cat) => (
          <View key={cat.id}>
            {/* Category header */}
            <Text
              style={{
                color: NAVY,
                fontSize: 15,
                fontWeight: "800",
                lineHeight: 19,
                paddingBottom: 6,
                marginBottom: 8,
                borderBottomWidth: 2,
                borderBottomColor: ORANGE,
              }}
            >
              Holiday Lighting Questions
            </Text>

            {/* FAQ items */}
            <View style={{ gap: 6 }}>
              {cat.faqs.map((faq) => {
                const isOpen = openId === faq.id;
                return (
                  <View
                    key={faq.id}
                    style={{
                      backgroundColor: "#fff",
                      borderRadius: 10,
                      borderLeftWidth: 6,
                      borderLeftColor: isOpen ? ORANGE : NAVY,
                      overflow: "hidden",
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.06,
                      shadowRadius: 4,
                      elevation: 1,
                    }}
                  >
                    <Pressable
                      onPress={() => toggle(faq.id)}
                      accessibilityRole="button"
                      accessibilityState={{ expanded: isOpen }}
                      accessibilityLabel={faq.question}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 10,
                        paddingHorizontal: 12,
                        paddingVertical: 11,
                        minHeight: 46,
                      }}
                    >
                      <Text
                        style={{
                          flex: 1,
                          color: NAVY,
                          fontSize: 13,
                          fontWeight: "600",
                          lineHeight: 18,
                        }}
                      >
                        {faq.question}
                      </Text>
                      <Ionicons
                        name={isOpen ? "chevron-up" : "chevron-down"}
                        size={14}
                        color={ORANGE}
                      />
                    </Pressable>

                    {isOpen && (
                      <View
                        style={{
                          paddingHorizontal: 12,
                          paddingTop: 9,
                          paddingBottom: 11,
                          borderTopWidth: 1,
                          borderTopColor: "#f3f4f6",
                        }}
                      >
                        <Text
                          style={{
                            color: NAVY,
                            fontSize: 12,
                            lineHeight: 18,
                          }}
                        >
                          {faq.answer}
                        </Text>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          </View>
        ))}
      </View>
    </Screen>
  );
}
