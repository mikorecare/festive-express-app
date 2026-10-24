import { colors } from "@/constants/theme";
import { useAuth } from "@/providers/AuthProvider";
import { Ionicons } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";
import { useColorScheme } from "nativewind";

export default function TabsLayout() {
  const { session } = useAuth();
  const { colorScheme } = useColorScheme();
  const c = colors[colorScheme === "dark" ? "dark" : "light"];

  if (!session) return <Redirect href="/login" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: `${c.brand}`,
        tabBarInactiveTintColor: `${c.muted}`,
        tabBarStyle: {
          backgroundColor: `${c.surface}`,
          borderTopColor: `${c.border}`,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="home"
              color={color ? String(color) : undefined}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="packages"
        options={{
          title: "Packages",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="gift"
              color={color ? String(color) : undefined}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="faqs"
        options={{
          title: "FAQs",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="help-circle"
              color={color ? String(color) : undefined}
              size={size}
            />
          ),
        }}
      />
    </Tabs>
  );
}
