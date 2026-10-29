import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { Animated, Pressable, Text, View } from "react-native";

const ORANGE = "#F49321";
const NAVY = "#1C2D5B";

export function CartButton({
  count,
  onPress,
}: {
  count: number;
  onPress: () => void;
}) {
  const shake = useRef(new Animated.Value(0)).current;
  const prevCount = useRef(count);

  useEffect(() => {
    if (count > prevCount.current) {
      Animated.sequence([
        Animated.timing(shake, {
          toValue: 1,
          duration: 80,
          useNativeDriver: true,
        }),
        Animated.timing(shake, {
          toValue: -1,
          duration: 80,
          useNativeDriver: true,
        }),
        Animated.timing(shake, {
          toValue: 1,
          duration: 80,
          useNativeDriver: true,
        }),
        Animated.timing(shake, {
          toValue: -0.6,
          duration: 80,
          useNativeDriver: true,
        }),
        Animated.timing(shake, {
          toValue: 0,
          duration: 80,
          useNativeDriver: true,
        }),
      ]).start();
    }
    prevCount.current = count;
  }, [count, shake]);

  const rotate = shake.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ["-15deg", "0deg", "15deg"],
  });

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Open cart, ${count} items`}
      hitSlop={8}
      style={{
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Animated.View style={{ transform: [{ rotate }] }}>
        <Ionicons name="cart" size={22} color={ORANGE} />

        {count > 0 ? (
          <View
            style={{
              position: "absolute",
              top: -6,
              right: -6,
              minWidth: 16,
              height: 16,
              paddingHorizontal: 4,
              borderRadius: 8,
              backgroundColor: ORANGE,
              borderWidth: 1.5,
              borderColor: "#fff",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: 9,
                fontWeight: "800",
                color: "#fff",
              }}
            >
              {count > 99 ? "99+" : count}
            </Text>
          </View>
        ) : null}
      </Animated.View>
    </Pressable>
  );
}
