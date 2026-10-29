import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";
import { useColorScheme } from "nativewind";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { colors } from "../constants/theme";
import "../global.css";
import { AuthProvider, useAuth } from "../providers/AuthProvider";
import { ThemeProvider } from "../providers/ThemeProvider";

SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { session, loading } = useAuth();
  const { colorScheme } = useColorScheme();
  const c = colors[colorScheme === "dark" ? "dark" : "light"];

  useEffect(() => {
    if (!loading) SplashScreen.hideAsync();
  }, [loading]);

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(c.surface);
  }, [c.surface]);

  if (loading) return null;

  return (
    <>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: c.background },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(auth)" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    // Poppins
    "Poppins-Regular": require("@/assets/fonts/Poppins/Poppins-Regular.ttf"),
    "Poppins-Bold": require("@/assets/fonts/Poppins/Poppins-Bold.ttf"),
    "Poppins-Black": require("@/assets/fonts/Poppins/Poppins-Black.ttf"),

    // Raleway
    "Raleway-Regular": require("@/assets/fonts/Raleway/Raleway-Regular.ttf"),
    "Raleway-Bold": require("@/assets/fonts/Raleway/Raleway-Bold.ttf"),
    "Raleway-Black": require("@/assets/fonts/Raleway/Raleway-Black.ttf"),

    // Roboto
    "Roboto-Regular": require("@/assets/fonts/Roboto/Roboto-Regular.ttf"),
    "Roboto-Bold": require("@/assets/fonts/Roboto/Roboto-Bold.ttf"),
    "Roboto-Black": require("@/assets/fonts/Roboto/Roboto-Black.ttf"),

    // Custom / emphasis
    "Trelasty Betanny": require("@/assets/fonts/Trelasty Bettany.ttf"),
    "Greattong Brush": require("@/assets/fonts/GreattongBrush.ttf"),
    "Acier Bat": require("@/assets/fonts/Acier BAT Text Solid.ttf"),
  });

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <AuthProvider>
          <KeyboardProvider>
            <RootNavigator />
          </KeyboardProvider>
        </AuthProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
