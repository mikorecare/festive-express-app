import { formatMoney, useEstimator } from "@/hooks/estimator/useEstimator";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

const ORANGE = "#F49321";
const NAVY = "#1C2D5B";

export function EstimatorResult() {
  const {
    result,
    isPreview,
    showOffer,
    booking,
    resultNote,
    bookConsultation,
    reset,
    selectedPackageData,
    calculatedOverageFt,
    calculatedOveragePrice,
    totalEstimate,
    isWithinPackage,
    getTotalFeet,
    PACKAGE_TOTAL_FT,
    OVERAGE_RATE,
  } = useEstimator();

  const [booked, setBooked] = useState(false);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (!booked) return;
    const interval = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(interval);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [booked]);

  if (!result) return null;

  async function handleBook() {
    await bookConsultation();
    if (resultNote.includes("received your design")) {
      setBooked(true);
    }
  }

  const totalFeet = result.stats ? Math.round(getTotalFeet(result.stats)) : 0;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#f8fafc" }}
      contentContainerStyle={{ padding: 14, gap: 12 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Disclaimer */}
      <Text style={{ fontSize: 11, color: "#4b5563", lineHeight: 15 }}>
        <Ionicons name="information-circle" size={11} /> This is a
        computer-generated preview at how your home could glow with our
        Christmas lights. It's meant to give you a good sense of the overall
        effect, not a perfect, pixel-for-pixel match.
      </Text>

      {/* Success state */}
      {booked ? (
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 12,
            padding: 18,
            alignItems: "center",
            gap: 8,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 10,
            elevation: 2,
            borderWidth: 1,
            borderColor: "rgba(16,185,129,0.2)",
          }}
        >
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: "#d1fae5",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="checkmark" size={24} color="#059669" />
          </View>
          <Text style={{ fontSize: 18, fontWeight: "800", color: "#065f46" }}>
            You're all set!
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: "#4b5563",
              textAlign: "center",
              lineHeight: 17,
            }}
          >
            We've sent your preview to your inbox. We'll get back to you in a{" "}
            <Text style={{ fontWeight: "800", color: ORANGE }}>
              Festive Express
            </Text>
          </Text>
          <Text style={{ fontSize: 11, color: "#6b7280" }}>
            Redirecting to your package in{" "}
            <Text style={{ fontWeight: "800", color: "#065f46" }}>
              {countdown}
            </Text>
          </Text>
        </View>
      ) : (
        <>
          {/* Image */}
          {result.imageUrl ? (
            <View
              style={{
                borderRadius: 10,
                borderWidth: 3,
                borderColor: ORANGE,
                overflow: "hidden",
                aspectRatio: 1 / 1,
              }}
            >
              <Image
                source={{ uri: result.imageUrl }}
                style={{ width: "100%", height: "100%" }}
                contentFit="cover"
              />
            </View>
          ) : null}

          {/* Stats cards */}
          <View style={{ gap: 6 }}>
            <StatCard
              label="Estimated footage"
              value={`${totalFeet || "—"} ft`}
            />
            <StatCard
              label="Package Price"
              value={
                selectedPackageData
                  ? `$${selectedPackageData.price.toLocaleString()}`
                  : "—"
              }
              valueColor={ORANGE}
            />
            {calculatedOverageFt > 0 ? (
              <StatCard
                label="Extra footage"
                value={`+${Math.round(calculatedOverageFt)} ft`}
                valueColor="#ea580c"
              />
            ) : null}
            {calculatedOveragePrice ? (
              <StatCard
                label="Extra to add"
                value={formatMoney(calculatedOveragePrice)}
                valueColor="#ea580c"
              />
            ) : null}
            {totalEstimate !== null ? (
              <StatCard
                label="Total estimate"
                value={formatMoney(totalEstimate)}
                valueColor={NAVY}
              />
            ) : null}
          </View>

          {/* Overage or covered message */}
          {showOffer ? (
            <View
              style={{
                backgroundColor: "#fef3c7",
                borderWidth: 1,
                borderColor: "#fcd34d",
                borderRadius: 10,
                padding: 10,
                gap: 4,
              }}
            >
              <Text
                style={{ fontSize: 12, fontWeight: "700", color: "#92400e" }}
              >
                Your home needs a bit more than {PACKAGE_TOTAL_FT} ft
              </Text>
              <Text style={{ fontSize: 11, color: "#78350f", lineHeight: 15 }}>
                The {selectedPackageData?.name ?? "selected"} package covers up
                to {PACKAGE_TOTAL_FT} ft. Add {Math.round(calculatedOverageFt)}{" "}
                extra ft at ${OVERAGE_RATE}/ft ={" "}
                {formatMoney(calculatedOveragePrice ?? 0)}.
              </Text>
            </View>
          ) : isWithinPackage && result.stats ? (
            <View
              style={{
                backgroundColor: "#d1fae5",
                borderWidth: 1,
                borderColor: "#a7f3d0",
                borderRadius: 10,
                padding: 10,
                gap: 4,
              }}
            >
              <Text
                style={{ fontSize: 12, fontWeight: "700", color: "#065f46" }}
              >
                ✓ Your home is covered by the package
              </Text>
              <Text style={{ fontSize: 11, color: "#047857", lineHeight: 15 }}>
                Your home needs {totalFeet} ft total, which is within the{" "}
                {PACKAGE_TOTAL_FT} ft package limit.
              </Text>
            </View>
          ) : null}

          {/* Actions */}
          {!isPreview ? (
            <View style={{ gap: 6 }}>
              <Pressable
                onPress={handleBook}
                disabled={booking}
                style={{
                  backgroundColor: booking ? "#fdba74" : ORANGE,
                  paddingVertical: 12,
                  borderRadius: 10,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ color: "#fff", fontSize: 13, fontWeight: "700" }}
                >
                  {booking ? "Sending..." : "Order your early bird package →"}
                </Text>
              </Pressable>
              <Pressable
                onPress={reset}
                disabled={booking}
                style={{
                  borderWidth: 1,
                  borderColor: "#d1d5db",
                  paddingVertical: 10,
                  borderRadius: 10,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ color: "#374151", fontSize: 12, fontWeight: "600" }}
                >
                  ← Try another look
                </Text>
              </Pressable>
            </View>
          ) : (
            <Pressable
              onPress={reset}
              style={{
                borderWidth: 1,
                borderColor: "#d1d5db",
                paddingVertical: 10,
                borderRadius: 10,
                alignItems: "center",
              }}
            >
              <Text
                style={{ color: "#374151", fontSize: 12, fontWeight: "600" }}
              >
                ← Try another look
              </Text>
            </Pressable>
          )}

          <Text style={{ fontSize: 10, color: "#9ca3af", textAlign: "center" }}>
            Estimate for {result.address || "your home"}.
          </Text>
        </>
      )}
    </ScrollView>
  );
}

function StatCard({
  label,
  value,
  valueColor,
}: {
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <View
      style={{
        backgroundColor: "#f9fafb",
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 8,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 11, color: "#6b7280" }}>{label}</Text>
      <Text
        style={{ fontSize: 15, fontWeight: "800", color: valueColor ?? NAVY }}
      >
        {value}
      </Text>
    </View>
  );
}
