import { useAuth } from "@/providers/AuthProvider";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

export function UserMenu() {
  const { session, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  if (!session) return null;

  const email = session.user.email ?? "";

  async function handleSignOut() {
    setOpen(false);
    await signOut();
  }

  return (
    <View className="relative z-50">
      {/* Trigger */}
      <Pressable
        onPress={() => setOpen((v) => !v)}
        accessibilityRole="button"
        accessibilityLabel="Account menu"
        className="h-10 w-10 items-center justify-center rounded-full bg-surface dark:bg-surface-dark"
      >
        <Ionicons name="person" size={20} color="#F49321" />
      </Pressable>

      {/* Dropdown */}
      {open && (
        <View
          className="absolute right-0 top-12 z-50 w-56 overflow-hidden rounded-xl border border-line bg-surface dark:border-line-dark dark:bg-surface-dark"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.15,
            shadowRadius: 16,
            elevation: 8,
          }}
        >
          {/* Email header */}
          <View className="border-b border-line px-3 py-3 dark:border-line-dark">
            <Text
              className="text-xs text-muted dark:text-muted-dark"
              numberOfLines={1}
            >
              Signed in as
            </Text>
            <Text
              className="mt-1 text-sm font-semibold text-ink dark:text-ink-dark"
              numberOfLines={1}
            >
              {email}
            </Text>
          </View>

          {/* Sign out */}
          <Pressable
            onPress={handleSignOut}
            className="flex-row items-center gap-3 px-3 py-3"
          >
            <Ionicons name="log-out-outline" size={18} color="#F49321" />
            <Text className="flex-1 text-sm font-semibold text-ink dark:text-ink-dark">
              Sign out
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
