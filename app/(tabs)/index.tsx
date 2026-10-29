import { CartButton } from "@/components/cart/CartButton";
import {
  ChooseYourPackage,
  HowItWorks,
  Reviews,
  VideoTestimonials,
} from "@/components/home";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import { Body, H1, Screen } from "@/components/ui";
import { UserMenu } from "@/components/UserMenu";
import { useCart } from "@/providers/CartProvider";
import { Text, View } from "react-native";

export default function Home() {
  const { count, open } = useCart();

  return (
    <View style={{ flex: 1 }}>
      <Screen>
        <View className="flex-row items-start justify-between">
          <View className="flex-1 gap-1 pr-3">
            <Body>Welcome,</Body>
            <H1>Mahiwagang Sahod</H1>
          </View>

          <View className="flex-row items-center gap-2">
            <CartButton count={count} onPress={open} />
            <UserMenu />
          </View>
        </View>

        <View className="mt-2 rounded-md bg-brand p-6 dark:bg-brand-dark">
          <Text className="text-2xl font-extrabold text-white">
            Holiday Decorating rentals, right from your device.
          </Text>
          <Text className="mt-3 text-base font-semibold text-white/90">
            Giftwrapped in One Simple Package.
          </Text>
          <Text className="mt-1 text-sm text-white/75">
            No ladders. No tangled cords. No storage. No stress.
          </Text>
        </View>

        <HowItWorks />
        <ChooseYourPackage />
        <Reviews />
        <VideoTestimonials />
        <WhyChooseUs />
      </Screen>
    </View>
  );
}
