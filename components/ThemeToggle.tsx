import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import {
  ThemePreference,
  useThemePreference,
} from "../providers/ThemeProvider";

const options: { value: ThemePreference; label: string; icon: string }[] = [
  { value: "light", label: "Light", icon: "sunny-outline" },
  { value: "dark", label: "Dark", icon: "moon-outline" },
  { value: "system", label: "System", icon: "phone-portrait-outline" },
];

export function ThemeToggle() {
  const { preference, setPreference } = useThemePreference();
  const [open, setOpen] = useState(false);

  const current = options.find((o) => o.value === preference) ?? options[2];

  function choose(value: ThemePreference) {
    setPreference(value);
    setOpen(false);
  }

  return (
    <View className="relative z-50">
      {/* Trigger button */}
      <Pressable
        onPress={() => setOpen((v) => !v)}
        accessibilityRole="button"
        accessibilityLabel={`Theme: ${current.label}`}
        className="flex-row items-center gap-2 self-start rounded-xl bg-surface px-3 py-2 dark:bg-surface-dark"
      >
        <Ionicons name={current.icon as any} size={18} color="#F49321" />
        <Ionicons
          name={open ? "chevron-up" : "chevron-down"}
          size={16}
          color="#94A3B8"
        />
      </Pressable>

      {/* Dropdown */}
      {open && (
        <View
          className="absolute right-0 top-12 z-50 w-44 overflow-hidden rounded-xl border border-line bg-surface dark:border-line-dark dark:bg-surface-dark"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.15,
            shadowRadius: 16,
            elevation: 8,
          }}
        >
          {options.map((o, i) => {
            const active = preference === o.value;
            return (
              <Pressable
                key={o.value}
                onPress={() => choose(o.value)}
                className={`flex-row items-center gap-3 px-3 py-3 ${
                  i < options.length - 1
                    ? "border-b border-line dark:border-line-dark"
                    : ""
                } ${active ? "bg-brand/10 dark:bg-brand-dark/10" : ""}`}
              >
                <Ionicons
                  name={o.icon as any}
                  size={18}
                  color={active ? "#F49321" : "#94A3B8"}
                />
                <Text
                  className={`flex-1 text-sm font-semibold ${
                    active
                      ? "text-brand dark:text-brand-dark"
                      : "text-ink dark:text-ink-dark"
                  }`}
                >
                  {o.label}
                </Text>
                {active && (
                  <Ionicons name="checkmark" size={16} color="#F49321" />
                )}
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}
