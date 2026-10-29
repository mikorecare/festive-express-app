import { CartOverlay } from "@/components/cart/CartOverlay";
import { colors } from "@/constants/theme";
import { useAuth } from "@/providers/AuthProvider";
import { CartProvider } from "@/providers/CartProvider";
import { Ionicons } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";
import { useColorScheme } from "nativewind";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabsLayout() {
  const { session } = useAuth();
  const { colorScheme } = useColorScheme();
  const c = colors[colorScheme === "dark" ? "dark" : "light"];
  const insets = useSafeAreaInsets();
  const bottomInset = Math.min(insets.bottom, 24);

  if (!session) return <Redirect href="/login" />;

  return (
    <CartProvider>
      <View style={{ flex: 1 }}>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: c.brand,
            tabBarInactiveTintColor: c.muted,
            tabBarStyle: {
              backgroundColor: c.surface,
              borderTopColor: c.border,
              height: 56 + bottomInset,
              paddingBottom: bottomInset,
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
            name="estimator"
            options={{
              title: "Home Preview",
              tabBarIcon: ({ color, size }) => (
                <Ionicons
                  name="calculator"
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

        {/* Rendered once, above every tab — any screen can open it via useCart().open() */}
        <CartOverlay />
      </View>
    </CartProvider>
  );
}
