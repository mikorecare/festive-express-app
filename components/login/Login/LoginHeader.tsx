import { Image, Text, View } from "react-native";
import CountdownGlass from "./CountDownGlass";

const feLogo = require("@/assets/images/fe-logo.png");

export default function LoginHeader() {
  return (
    <View className="mt-6 items-center">
      <CountdownGlass>
        <View className="items-center">
          <Image
            source={feLogo}
            style={{ width: 160, height: 40 }}
            resizeMode="contain"
          />

          <View className="mt-1 flex-row items-center gap-1.5">
            <Text className="text-sm tracking-wide font-semibold text-brand-orange dark:text-brand-dark">
              Rent
            </Text>
            <Text className="text-sm tracking-wide text-brand-orange dark:text-muted-dark">
              •
            </Text>
            <Text className="text-sm tracking-wide font-semibold text-brand-orange dark:text-brand-dark">
              Relax
            </Text>
            <Text className="text-sm text-brand-orange dark:text-muted-dark">
              •
            </Text>
            <Text className="text-sm font-semibold text-brand-orange dark:text-brand-dark">
              Celebrate
            </Text>
          </View>
        </View>
      </CountdownGlass>
    </View>
  );
}
