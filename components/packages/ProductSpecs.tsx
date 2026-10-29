import { ActivityIndicator, Text, View } from "react-native";

const NAVY = "#1C2D5B";
const ORANGE = "#F49321";

function asArray(val: unknown): string[] {
  if (Array.isArray(val)) return val.map(String);
  if (typeof val === "string") {
    try {
      const p = JSON.parse(val);
      return Array.isArray(p) ? p.map(String) : [];
    } catch {
      return [];
    }
  }
  return [];
}

function asObject(val: unknown): Record<string, string> {
  if (val && typeof val === "object" && !Array.isArray(val)) {
    const out: Record<string, string> = {};
    for (const [k, v] of Object.entries(val as Record<string, unknown>)) {
      out[k] = String(v ?? "");
    }
    return out;
  }
  if (typeof val === "string") {
    try {
      return asObject(JSON.parse(val));
    } catch {
      return {};
    }
  }
  return {};
}

export function ProductSpecs({
  items,
  pending,
}: {
  items: any[];
  pending?: boolean;
}) {
  if (pending) {
    return (
      <View style={{ paddingVertical: 24, alignItems: "center" }}>
        <ActivityIndicator />
        <Text style={{ marginTop: 6, color: NAVY, fontSize: 13 }}>
          Loading specifications...
        </Text>
      </View>
    );
  }

  if (!items.length) {
    return (
      <View style={{ paddingVertical: 24, alignItems: "center" }}>
        <Text style={{ color: NAVY, fontSize: 13 }}>
          No specifications available.
        </Text>
      </View>
    );
  }

  return (
    <View
      style={{
        backgroundColor: "#f8fafc",
        paddingVertical: 20,
        paddingHorizontal: 14,
      }}
    >
      <View style={{ alignItems: "center", marginBottom: 14 }}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "800",
            color: NAVY,
            textAlign: "center",
          }}
        >
          Product Specifications
        </Text>
        <Text
          style={{
            marginTop: 4,
            color: NAVY,
            fontSize: 12,
            textAlign: "center",
            lineHeight: 17,
            maxWidth: 300,
          }}
        >
          Discover the professional-grade materials and engineering behind every
          installation.
        </Text>
      </View>

      <View style={{ gap: 10 }}>
        {items.map((item) => {
          const colors = asArray(item.color_options);
          const features = asArray(item.features);
          const specs = asObject(item.specifications);
          return (
            <View
              key={item.id}
              style={{
                backgroundColor: "#fff",
                borderRadius: 10,
                borderWidth: 1,
                borderColor: "#e2e8f0",
                overflow: "hidden",
              }}
            >
              <View
                style={{
                  backgroundColor: NAVY,
                  paddingHorizontal: 12,
                  paddingVertical: 9,
                }}
              >
                <Text
                  style={{ color: "#fff", fontSize: 14, fontWeight: "800" }}
                >
                  {item.name}
                </Text>
              </View>

              <View style={{ padding: 12, gap: 9 }}>
                {item.description ? (
                  <Text style={{ color: NAVY, fontSize: 12, lineHeight: 17 }}>
                    {item.description}
                  </Text>
                ) : null}

                {colors.length > 0 ? (
                  <View
                    style={{
                      backgroundColor: "#f1f5f9",
                      padding: 8,
                      borderRadius: 6,
                    }}
                  >
                    <Text style={{ fontSize: 11, color: NAVY }}>
                      <Text style={{ fontWeight: "800" }}>Color Options: </Text>
                      {colors.join(", ")}
                    </Text>
                  </View>
                ) : null}

                {features.length > 0 ? (
                  <View>
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: "800",
                        color: NAVY,
                        marginBottom: 5,
                        borderBottomWidth: 2,
                        borderBottomColor: ORANGE,
                        paddingBottom: 3,
                        alignSelf: "flex-start",
                      }}
                    >
                      Features
                    </Text>
                    {features.map((f, i) => (
                      <Text
                        key={i}
                        style={{
                          fontSize: 12,
                          color: NAVY,
                          lineHeight: 17,
                          marginBottom: 2,
                        }}
                      >
                        • {f}
                      </Text>
                    ))}
                  </View>
                ) : null}

                {Object.keys(specs).length > 0 ? (
                  <View>
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: "800",
                        color: NAVY,
                        marginBottom: 5,
                        borderBottomWidth: 2,
                        borderBottomColor: ORANGE,
                        paddingBottom: 3,
                        alignSelf: "flex-start",
                      }}
                    >
                      Specifications
                    </Text>
                    <View
                      style={{
                        backgroundColor: "#f8fafc",
                        padding: 8,
                        borderRadius: 6,
                        gap: 4,
                      }}
                    >
                      {Object.entries(specs).map(([key, val]) => (
                        <Text
                          key={key}
                          style={{ fontSize: 11, color: "#475569" }}
                        >
                          <Text style={{ fontWeight: "800", color: NAVY }}>
                            {key}:{" "}
                          </Text>
                          {val}
                        </Text>
                      ))}
                    </View>
                  </View>
                ) : null}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}
