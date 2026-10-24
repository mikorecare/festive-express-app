import { ThemeToggle } from "@/components/ThemeToggle";
import { Body, Button, Card, H1, Screen } from "@/components/ui";
import { useAuth } from "@/providers/AuthProvider";
import { Text, View } from "react-native";

export default function Home() {
  const { session, signOut } = useAuth();

  return (
    <Screen>
      <View className="gap-1">
        <Body>Welcome,</Body>
        <H1>{session?.user.email ?? "Guest"}</H1>
      </View>

      <View className="mt-6 rounded-3xl bg-brand p-6 dark:bg-brand-dark">
        <Text className="text-2xl font-extrabold text-white">
          Celebrate, delivered.
        </Text>
        <Text className="mt-2 text-base text-white/90">
          Browse our packages and let Festive Express handle the rest.
        </Text>
      </View>

      <Text className="mb-2 mt-8 text-lg font-bold text-ink dark:text-ink-dark">
        Appearance
      </Text>
      <ThemeToggle />

      <Card className="mt-8">
        <Text className="text-base font-semibold text-ink dark:text-ink-dark">
          Account
        </Text>
        <Body className="mb-4">Signed in with Supabase.</Body>
        <Button variant="outline" title="Sign out" onPress={signOut} />
      </Card>
    </Screen>
  );
}
