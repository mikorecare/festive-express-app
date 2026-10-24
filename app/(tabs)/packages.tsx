import { Body, Card, H1, Screen } from "@/components/ui";
import { packages } from "@/data/content";
import { Text, View } from "react-native";

export default function Packages() {
  return (
    <Screen>
      <H1>Packages</H1>
      <Body className="mb-4">Pick the celebration that fits.</Body>
      <View className="gap-4">
        {packages.map((p) => (
          <Card key={p.id}>
            <View className="flex-row items-center justify-between">
              <Text className="text-xl font-bold text-ink dark:text-ink-dark">
                {p.name}
              </Text>
              <Text className="font-bold text-brand dark:text-brand-dark">
                {p.price}
              </Text>
            </View>
            <Body className="mt-1">{p.blurb}</Body>
            <View className="mt-3 gap-1">
              {p.perks.map((perk) => (
                <Text
                  key={perk}
                  className="text-sm text-ink dark:text-ink-dark"
                >
                  • {perk}
                </Text>
              ))}
            </View>
          </Card>
        ))}
      </View>
    </Screen>
  );
}
