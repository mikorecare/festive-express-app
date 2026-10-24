import { Body, Card, H1, Screen } from "@/components/ui";
import { colors } from "@/constants/theme";
import { faqs } from "@/data/content";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

export default function Faqs() {
  const [open, setOpen] = useState<number | null>(0);
  const { colorScheme } = useColorScheme();
  const c = colors[colorScheme === "dark" ? "dark" : "light"];

  return (
    <Screen>
      <H1>FAQs</H1>
      <Body className="mb-4">Quick answers to common questions.</Body>
      <View className="gap-3">
        {faqs.map((f, i) => {
          const isOpen = open === i;
          return (
            <Pressable key={f.q} onPress={() => setOpen(isOpen ? null : i)}>
              <Card>
                <View className="flex-row items-center justify-between gap-3">
                  <Text className="flex-1 text-base font-semibold text-ink dark:text-ink-dark">
                    {f.q}
                  </Text>
                  <Ionicons
                    name={isOpen ? "chevron-up" : "chevron-down"}
                    size={20}
                    color={c.muted}
                  />
                </View>
                {isOpen && <Body className="mt-2">{f.a}</Body>}
              </Card>
            </Pressable>
          );
        })}
      </View>
    </Screen>
  );
}
