import { Text, TextInput, View } from "react-native";

const NAVY = "#1C2D5B";

const INPUT_STYLE = {
  height: 42,
  borderRadius: 10,
  borderWidth: 1.5,
  borderColor: "#9ca3af",
  backgroundColor: "#f8f9fa",
  paddingHorizontal: 12,
  fontSize: 14,
  color: NAVY,
} as const;

const LABEL_STYLE = {
  fontSize: 13,
  fontWeight: "600" as const,
  color: NAVY,
  marginBottom: 4,
};

export function ContactFields({
  name,
  setName,
  email,
  setEmail,
  phone,
  setPhone,
  errors,
}: {
  name: string;
  setName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  errors: { name?: string; email?: string; address?: string };
}) {
  return (
    <>
      <View style={{ flexDirection: "row", gap: 8 }}>
        <View style={{ flex: 1 }}>
          <Text style={LABEL_STYLE}>Your name *</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            style={[
              INPUT_STYLE,
              errors.name ? { borderColor: "#ef4444" } : undefined,
            ]}
            autoComplete="name"
          />
          {errors.name ? (
            <Text style={{ fontSize: 11, color: "#ef4444", marginTop: 3 }}>
              {errors.name}
            </Text>
          ) : null}
        </View>
        <View style={{ flex: 1 }}>
          <Text style={LABEL_STYLE}>Email *</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            style={[
              INPUT_STYLE,
              errors.email ? { borderColor: "#ef4444" } : undefined,
            ]}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
          {errors.email ? (
            <Text style={{ fontSize: 11, color: "#ef4444", marginTop: 3 }}>
              {errors.email}
            </Text>
          ) : null}
        </View>
      </View>

      <View>
        <Text style={LABEL_STYLE}>
          Mobile{" "}
          <Text style={{ fontSize: 11, fontWeight: "400", color: "#9ca3af" }}>
            (optional)
          </Text>
        </Text>
        <TextInput
          value={phone}
          onChangeText={setPhone}
          style={INPUT_STYLE}
          keyboardType="phone-pad"
          autoComplete="tel"
        />
      </View>
    </>
  );
}
