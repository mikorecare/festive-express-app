import type { Suggestion } from "@/hooks/estimator/useEstimator";
import { Keyboard, Pressable, Text, TextInput, View } from "react-native";

const NAVY = "#1C2D5B";

export function AddressInput({
  address,
  setAddress,
  suggestions,
  suggestionsOpen,
  setSuggestionsOpen,
  debouncedSearch,
  selectAddress,
  error,
}: {
  address: string;
  setAddress: (v: string) => void;
  suggestions: Suggestion[];
  suggestionsOpen: boolean;
  setSuggestionsOpen: (v: boolean) => void;
  debouncedSearch: (q: string) => void;
  selectAddress: (s: Suggestion) => void;
  error?: string;
}) {
  const visible = suggestionsOpen && suggestions.length > 0;
  const items = suggestions.slice(0, 4);

  return (
    <View>
      <Text
        style={{
          fontSize: 13,
          fontWeight: "600",
          color: "#374151",
          marginBottom: 4,
        }}
      >
        Property address *
      </Text>

      <TextInput
        value={address}
        onChangeText={(v) => {
          setAddress(v);
          setSuggestionsOpen(true);
          debouncedSearch(v);
        }}
        onFocus={() => setSuggestionsOpen(true)}
        onBlur={() => setSuggestionsOpen(false)}
        placeholder="Start typing your street address"
        placeholderTextColor="#9ca3af"
        style={[
          {
            height: 42,
            borderRadius: 10,
            borderWidth: 1.5,
            borderColor: "#9ca3af",
            backgroundColor: "#f8f9fa",
            paddingHorizontal: 12,
            fontSize: 14,
            color: NAVY,
          },
          error ? { borderColor: "#ef4444" } : undefined,
        ]}
        autoCorrect={false}
        autoCapitalize="words"
      />

      {error ? (
        <Text style={{ fontSize: 11, color: "#ef4444", marginTop: 3 }}>
          {error}
        </Text>
      ) : null}

      {visible ? (
        <View
          style={{
            marginTop: 4,
            backgroundColor: "#fff",
            borderRadius: 10,
            borderWidth: 1,
            borderColor: "#e5e7eb",
            overflow: "hidden",
          }}
        >
          {items.map((s, i) => (
            <Pressable
              key={s.placeId}
              onPress={() => {
                Keyboard.dismiss();
                setSuggestionsOpen(false);
                selectAddress(s);
              }}
              style={({ pressed }) => ({
                paddingHorizontal: 12,
                paddingVertical: 8,
                backgroundColor: pressed ? "#f3f4f6" : "#fff",
                borderBottomWidth: i < items.length - 1 ? 1 : 0,
                borderBottomColor: "#f3f4f6",
              })}
            >
              <Text
                style={{ fontSize: 13, fontWeight: "500", color: "#1f2937" }}
                numberOfLines={1}
              >
                {s.main || s.full}
              </Text>
              {s.secondary ? (
                <Text
                  style={{ fontSize: 11, color: "#6b7280" }}
                  numberOfLines={1}
                >
                  {s.secondary}
                </Text>
              ) : null}
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}
