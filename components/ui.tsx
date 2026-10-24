import type { ReactNode } from "react";
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export function Screen({
  children,
  scroll = true,
  className = "",
}: {
  children: ReactNode;
  scroll?: boolean;
  className?: string;
}) {
  return (
    <SafeAreaView
      edges={["top"]}
      className="flex-1 bg-canvas dark:bg-canvas-dark"
    >
      {scroll ? (
        <ScrollView
          contentContainerClassName={`px-5 pt-4 pb-10 ${className}`}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View className={`flex-1 px-5 pt-4 ${className}`}>{children}</View>
      )}
    </SafeAreaView>
  );
}

export const H1 = ({ children }: { children: ReactNode }) => (
  <Text className="text-3xl font-extrabold text-ink dark:text-ink-dark">
    {children}
  </Text>
);

export const Body = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => (
  <Text
    className={`text-base leading-6 text-muted dark:text-muted-dark ${className}`}
  >
    {children}
  </Text>
);

export const Card = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => (
  <View
    className={`rounded-2xl border border-line bg-surface p-4 dark:border-line-dark dark:bg-surface-dark ${className}`}
  >
    {children}
  </View>
);

export function Button({
  title,
  onPress,
  loading,
  variant = "primary",
}: {
  title: string;
  onPress: () => void;
  loading?: boolean;
  variant?: "primary" | "outline";
}) {
  const primary = variant === "primary";
  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      className={`h-12 items-center justify-center rounded-xl active:opacity-80 ${
        primary
          ? "bg-brand dark:bg-brand-dark"
          : "border border-line dark:border-line-dark"
      }`}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text
          className={`text-base font-semibold ${primary ? "text-white" : "text-ink dark:text-ink-dark"}`}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
}
