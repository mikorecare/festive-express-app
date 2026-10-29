import BottomSheet from "@gorhom/bottom-sheet";
import { useRef } from "react";
import { Image, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LoginActions from "./LoginActions";
import LoginHeader from "./LoginHeader";
import LoginSheet from "./LoginSheet";

const festiveBanner = require("@/assets/images/festive-express-2.webp");

export default function Login() {
  const sheetRef = useRef<BottomSheet>(null);

  const openSheet = () => sheetRef.current?.snapToIndex(0);

  return (
    <SafeAreaView className="flex-1">
      <Image
        source={festiveBanner}
        className="absolute inset-0 h-full w-full"
        resizeMode="cover"
      />

      <View className="flex-1 justify-between px-6 pb-10">
        <LoginHeader />
        <LoginActions onLoginPress={openSheet} />
      </View>

      <LoginSheet ref={sheetRef} />
    </SafeAreaView>
  );
}
