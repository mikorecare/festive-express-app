import { useEstimator } from "@/hooks/estimator/useEstimator";
import { ActivityIndicator, Modal, Text, View } from "react-native";

const ORANGE = "#F49321";
const NAVY = "#1C2D5B";

export function EstimatorLoading() {
  const { rendering, isPreview, currentFact, progressText } = useEstimator();

  return (
    <Modal visible={rendering} transparent animationType="fade">
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.35)",
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
        }}
      >
        <View
          style={{
            width: "100%",
            maxWidth: 420,
            backgroundColor: "#fff",
            borderRadius: 20,
            overflow: "hidden",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 12 },
            shadowOpacity: 0.25,
            shadowRadius: 24,
            elevation: 12,
          }}
        >
          {/* Top color bar */}
          <View style={{ height: 6, flexDirection: "row" }}>
            <View style={{ flex: 1, backgroundColor: ORANGE }} />
            <View style={{ flex: 1, backgroundColor: NAVY }} />
          </View>

          <View style={{ padding: 24, alignItems: "center", gap: 12 }}>
            <ActivityIndicator size="large" color={ORANGE} />

            {isPreview ? (
              <>
                <Text
                  style={{
                    fontSize: 14,
                    color: "#4b5563",
                    textAlign: "center",
                  }}
                >
                  Loading the house photo — no lighting yet.
                </Text>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "800",
                    color: NAVY,
                    textAlign: "center",
                  }}
                >
                  Checking address…
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    color: "#6b7280",
                    textAlign: "center",
                  }}
                >
                  Looking up address…
                </Text>
              </>
            ) : (
              <>
                <Text
                  style={{
                    fontSize: 14,
                    color: "#4b5563",
                    textAlign: "center",
                  }}
                >
                  {currentFact}
                </Text>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "800",
                    color: NAVY,
                    textAlign: "center",
                  }}
                >
                  Lighting up your home…
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    color: "#6b7280",
                    textAlign: "center",
                  }}
                >
                  {progressText}
                </Text>
              </>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}
