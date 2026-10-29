import { Image, Text, View } from "react-native";

const icons = {
  trained: require("@/assets/images/icons/trained.png"),
  secured: require("@/assets/images/icons/secured.png"),
  service: require("@/assets/images/icons/service.png"),
  location: require("@/assets/images/icons/location.png"),
};

type Benefit = {
  icon: any;
  title: string;
  subtitle: string;
};

const benefits: Benefit[] = [
  {
    icon: icons.trained,
    title: "Full-Service\nInstallation",
    subtitle: "Installed Safely by\nTrained Technicians",
  },
  {
    icon: icons.secured,
    title: "Licensed &\nInsured",
    subtitle: "Your Home Is\nFully Protected",
  },
  {
    icon: icons.service,
    title: "Professional\nGrade Lighting",
    subtitle: "Built to Last Year\nAfter Year",
  },
  {
    icon: icons.location,
    title: "Ongoing Local\nSupport",
    subtitle: "We're Here\nLong After Install",
  },
];

export default function WhyChooseUs() {
  return (
    <View className="w-full bg-[#0d2247] border-b-4 border-brand-orange">
      <View className="w-full px-6 py-8">
        {/* Section header */}
        <View>
          <Text className="text-brand-orange font-extrabold tracking-[0.8px] uppercase text-base mb-1">
            WHY CHOOSE US?
          </Text>
          <Text className="font-extrabold text-white text-2xl leading-[1.15] mb-6">
            Festive Express{" "}
            <Text className="text-brand-orange">Difference</Text>
          </Text>
        </View>

        {/* Benefits — single horizontal row */}
        <View className="flex-row justify-between items-start gap-2">
          {benefits.map((item, i) => (
            <View key={i} className="flex-1 items-center">
              <View className="w-12 h-12 rounded-full items-center justify-center mb-2 overflow-hidden">
                <Image
                  source={item.icon}
                  className="w-full h-full"
                  resizeMode="contain"
                />
              </View>

              <Text className="text-white text-[0.65rem] font-bold leading-[1.2] text-center mb-0.5">
                {item.title}
              </Text>
              <Text className="text-[#F49321] text-[0.6rem] font-semibold leading-[1.25] text-center">
                {item.subtitle}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
