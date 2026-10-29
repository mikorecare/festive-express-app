// app/(tabs)/estimator.tsx
import { EstimatorForm } from "@/components/estimator/EstimatorForm";
import { EstimatorLoading } from "@/components/estimator/EstimatorLoading";
import { EstimatorResult } from "@/components/estimator/EstimatorResult";
import { EstimatorProvider, useEstimator } from "@/providers/EstimatorProvider";
import { ScrollView, Text, View } from "react-native";

const ORANGE = "#F49321";
const NAVY = "#1C2D5B";

const STEPS = [
  "Enter your address",
  "Select the package",
  "Pick your Color",
  "View your home",
];

export default function EstimatorScreen() {
  return (
    <EstimatorProvider>
      <EstimatorInner />
    </EstimatorProvider>
  );
}

function EstimatorInner() {
  const { result } = useEstimator();

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Copy block */}
        <View
          style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 14 }}
        >
          <Text
            style={{
              fontSize: 19,
              fontWeight: "800",
              color: NAVY,
              textTransform: "uppercase",
              letterSpacing: 0.6,
              lineHeight: 23,
              marginBottom: 2,
            }}
          >
            See your home
          </Text>
          <Text
            style={{
              fontSize: 19,
              fontWeight: "800",
              color: ORANGE,
              textTransform: "uppercase",
              letterSpacing: 0.6,
              lineHeight: 23,
              marginBottom: 8,
              textShadowColor: "rgba(28,45,91,0.35)",
              textShadowOffset: { width: 0, height: 2 },
              textShadowRadius: 5,
            }}
          >
            Gift-wrapped in lights.
          </Text>

          <Text
            style={{
              fontSize: 12,
              color: "#3b4a6b",
              fontWeight: "500",
              lineHeight: 17,
              marginBottom: 12,
            }}
          >
            Enter your address, pick a package and a color, click on "Light Up
            My Home."
          </Text>

          {/* Steps */}
          <View style={{ gap: 8 }}>
            {STEPS.map((step, i) => (
              <View
                key={i}
                style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
              >
                <View
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 13,
                    backgroundColor: ORANGE,
                    alignItems: "center",
                    justifyContent: "center",
                    shadowColor: ORANGE,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.3,
                    shadowRadius: 5,
                    elevation: 3,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "900",
                      color: NAVY,
                    }}
                  >
                    {i + 1}
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: "600",
                    color: "#000",
                    flex: 1,
                  }}
                >
                  {step}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Estimator or Result */}
        <View style={{ paddingHorizontal: 14 }}>
          {result ? <EstimatorResult /> : <EstimatorForm />}
        </View>
      </ScrollView>

      <EstimatorLoading />
    </View>
  );
}
