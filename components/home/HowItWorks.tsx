import { Image } from "expo-image";
import { Pressable, Text, View } from "react-native";

const ORANGE = "#F49321";
const NAVY = "#1C2D5B";

type Step = {
  number: string;
  title: string;
  description: string;
  image: any;
};

const STEPS: Step[] = [
  {
    number: "1",
    title: "Rent",
    description:
      "Pick a package, pay a small rental fee and book online in minutes. Every package is a one-season rental — nothing to buy, nothing to store.",
    image: require("@/assets/images/how-it-works/rent.webp"),
  },
  {
    number: "2",
    title: "Relax",
    description:
      "Choose your install and take-down dates. Trained technicians handle the ladders, the cords and the roofline while you stay on the couch.",
    image: require("@/assets/images/how-it-works/relax.webp"),
  },
  {
    number: "3",
    title: "Celebrate",
    description:
      "Enjoy the magic of the season. We maintain your display through the holidays and take it all down when you're ready.",
    image: require("@/assets/images/how-it-works/celebrate.webp"),
  },
];

export function HowItWorks() {
  return (
    <View className="relative w-full overflow-hidden rounded-2xl bg-white">
      <View className="relative z-10 px-3 pb-4 pt-4">
        {/* Eyebrow */}
        <Text
          className="mb-0.5 text-sm font-extrabold tracking-wide uppercase"
          style={{ color: ORANGE }}
        >
          How it works
        </Text>

        {/* Headline */}
        <Text
          className="mb-1.5 text-xl font-extrabold leading-tight"
          style={{ color: NAVY }}
        >
          Professional holiday lighting, made simple.
        </Text>

        {/* Subhead */}
        <Text className="mb-3 text-xs leading-relaxed text-slate-600">
          Choose one of three fixed rental packages. Pay online. Pick your
          install and take-down dates. We handle the rest.
        </Text>

        {/* Cards */}
        <View className="gap-3">
          {STEPS.map((step) => (
            <StepCard key={step.number} step={step} />
          ))}
        </View>
      </View>
    </View>
  );
}

function StepCard({ step }: { step: Step }) {
  return (
    <Pressable
      className="relative rounded-xl border border-slate-200 bg-white"
      style={{
        shadowColor: NAVY,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 2,
        marginBottom: 2,
      }}
    >
      {/* Image wrapper */}
      <View className="relative w-full overflow-hidden rounded-t-xl">
        <Image
          source={step.image}
          style={{ width: "100%", aspectRatio: 16 / 9 }}
          contentFit="cover"
        />
        <View
          pointerEvents="none"
          className="absolute inset-0"
          style={{ backgroundColor: "rgba(28,45,91,0.12)" }}
        />
      </View>

      {/* Body */}
      <View className="px-3 pb-3 pt-2.5">
        {/* Title row with number badge inline */}
        <View className="mb-1 flex-row items-center gap-1.5">
          <View
            className="h-6 w-6 items-center justify-center rounded-full"
            style={{
              backgroundColor: ORANGE,
              borderWidth: 1.5,
              borderColor: "#fff",
            }}
          >
            <Text className="text-xs font-black" style={{ color: NAVY }}>
              {step.number}
            </Text>
          </View>
          <Text
            className="text-sm font-extrabold uppercase tracking-wide"
            style={{ color: ORANGE }}
          >
            {step.title}
          </Text>
        </View>

        <Text className="text-xs leading-snug" style={{ color: NAVY }}>
          {step.description}
        </Text>
      </View>

      {/* Bottom accent bars */}
      <View
        className="absolute bottom-0 left-0 right-0 h-1 rounded-b-xl"
        style={{ backgroundColor: NAVY }}
      />
      <View
        className="absolute bottom-1 left-0 right-0 h-0.5"
        style={{ backgroundColor: ORANGE }}
      />
    </Pressable>
  );
}
