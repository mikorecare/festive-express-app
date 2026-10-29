import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, useState } from "react";
import { Animated, Easing, View } from "react-native";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function CountdownGlass({ children, className = "" }: Props) {
  const progress = useRef(new Animated.Value(0)).current;
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(progress, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [progress]);

  const SHEEN_WIDTH = 160;
  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-SHEEN_WIDTH, width + SHEEN_WIDTH],
  });

  return (
    <View
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      className={`w-full overflow-hidden ${className}`}
      style={{
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.18)",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 25,
        elevation: 1,
        backgroundColor: "transparent",
      }}
    >
      <BlurView
        tint="dark"
        intensity={40}
        style={{ position: "absolute", inset: 0 } as any}
      />
      <View
        pointerEvents="none"
        style={
          {
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(12, 35, 64, 0.65)",
          } as any
        }
      />

      <View style={{ paddingHorizontal: 24, paddingVertical: 20 }}>
        {children}
      </View>

      {width > 0 && (
        <Animated.View
          pointerEvents="none"
          style={{
            position: "absolute",
            top: -40,
            left: 0,
            width: SHEEN_WIDTH,
            height: "200%",
            transform: [{ translateX }, { rotate: "25deg" }],
            opacity: 0.9,
          }}
        >
          <LinearGradient
            colors={[
              "rgba(255,255,255,0)",
              "rgba(255,255,255,0.08)",
              "rgba(255,255,255,0.35)",
              "rgba(255,255,255,0.08)",
              "rgba(255,255,255,0)",
            ]}
            locations={[0, 0.4, 0.5, 0.6, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ flex: 1 }}
          />
        </Animated.View>
      )}
    </View>
  );
}
