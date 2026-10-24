import { Pressable, Text, View } from "react-native";
import {
    ThemePreference,
    useThemePreference,
} from "../providers/ThemeProvider";

const options: { value: ThemePreference; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
];

export function ThemeToggle() {
  const { preference, setPreference } = useThemePreference();
  return (
    <View className="flex-row rounded-xl bg-line p-1 dark:bg-line-dark">
      {options.map((o) => {
        const active = preference === o.value;
        return (
          <Pressable
            key={o.value}
            onPress={() => setPreference(o.value)}
            className={`flex-1 items-center rounded-lg py-2 ${active ? "bg-surface dark:bg-surface-dark" : ""}`}
          >
            <Text
              className={`text-sm font-semibold ${active ? "text-brand dark:text-brand-dark" : "text-muted dark:text-muted-dark"}`}
            >
              {o.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
