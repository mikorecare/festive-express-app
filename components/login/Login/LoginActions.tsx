import { Button } from "@/components/ui";
import { colors } from "@/constants/theme";
import { FontAwesome5 } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { Alert, Pressable, Text, View } from "react-native";

type Props = {
  onLoginPress: () => void;
};

export default function LoginActions({ onLoginPress }: Props) {
  const { colorScheme } = useColorScheme();
  const c = colors[colorScheme === "dark" ? "dark" : "light"];

  function loginWithGoogle() {
    Alert.alert("Coming soon", "Google login is not configured yet.");
  }
  function loginWithApple() {
    Alert.alert("Coming soon", "Apple login is not configured yet.");
  }

  return (
    <View className="gap-4">
      <Button title="Log in" onPress={onLoginPress} />

      <View className="flex-row items-center">
        <View className="flex-1 h-px bg-line dark:bg-line-dark" />
        <Text className="mx-3 text-xs uppercase text-white dark:text-muted-dark">
          or continue with
        </Text>
        <View className="flex-1 h-px bg-line dark:bg-line-dark" />
      </View>

      <View className="flex-row items-center justify-center gap-4">
        <Pressable
          onPress={loginWithGoogle}
          accessibilityRole="button"
          accessibilityLabel="Continue with Google"
          hitSlop={10}
          className="h-14 w-14 items-center justify-center rounded-full border border-line bg-surface dark:border-line-dark dark:bg-surface-dark"
        >
          <FontAwesome5 name="google" size={24} color={c.brand} />
        </Pressable>

        <Pressable
          onPress={loginWithApple}
          accessibilityRole="button"
          accessibilityLabel="Continue with Apple"
          hitSlop={10}
          className="h-14 w-14 items-center justify-center rounded-full border border-line bg-surface dark:border-line-dark dark:bg-surface-dark"
        >
          <FontAwesome5 name="apple" size={24} color={c.brand} />
        </Pressable>
      </View>
    </View>
  );
}
