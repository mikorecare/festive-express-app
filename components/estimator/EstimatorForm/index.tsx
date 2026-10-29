import { useEstimator } from "@/providers/EstimatorProvider";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState, type ComponentRef } from "react";
import {
  Keyboard,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { AddressInput } from "./AddressInput";
import { ColorModal } from "./ColorModal";
import { ContactFields } from "./ContactFields";
import { PackageColorPicker } from "./PackageColorPicker";
import { PackageModal } from "./PackageModal";
import { SubmitButtons } from "./SubmitButtons";

export function EstimatorForm() {
  const {
    address,
    setAddress,
    name,
    setName,
    email,
    setEmail,
    phone,
    setPhone,
    selectedScheme,
    setSelectedScheme,
    selectedPackage,
    setSelectedPackage,
    packageOptions,
    loadingPackages,
    colorOptions,
    selectedPackageData,
    suggestions,
    suggestionsOpen,
    setSuggestionsOpen,
    debouncedSearch,
    selectAddress,
    errors,
    error,
    isLoading,
    submitRender,
  } = useEstimator();

  const [showPackageModal, setShowPackageModal] = useState(false);
  const [showColorModal, setShowColorModal] = useState(false);

  const scrollRef = useRef<ComponentRef<typeof ScrollView>>(null);
  const addressY = useRef(0);
  const [kbHeight, setKbHeight] = useState(0);

  useEffect(() => {
    const showEvt =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvt =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const show = Keyboard.addListener(showEvt, (e) =>
      setKbHeight(e.endCoordinates.height),
    );
    const hide = Keyboard.addListener(hideEvt, () => setKbHeight(0));

    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  useEffect(() => {
    if (suggestionsOpen && suggestions.length > 0) {
      scrollRef.current?.scrollTo({
        y: Math.max(addressY.current - 8, 0),
        animated: true,
      });
    }
  }, [suggestionsOpen, suggestions.length, kbHeight]);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 110 + kbHeight }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          accessible={false}
          style={{ flexGrow: 1, padding: 14, gap: 12 }}
          onPress={() => {
            setSuggestionsOpen(false);
            Keyboard.dismiss();
          }}
        >
          <View onLayout={(e) => (addressY.current = e.nativeEvent.layout.y)}>
            <AddressInput
              address={address}
              setAddress={setAddress}
              suggestions={suggestions}
              suggestionsOpen={suggestionsOpen}
              setSuggestionsOpen={setSuggestionsOpen}
              debouncedSearch={debouncedSearch}
              selectAddress={selectAddress}
              error={errors.address}
            />
          </View>

          <PackageColorPicker
            selectedPackageData={selectedPackageData}
            selectedColorScheme={selectedScheme}
            colorOptions={colorOptions}
            onOpenPackage={() => setShowPackageModal(true)}
            onOpenColor={() => setShowColorModal(true)}
          />

          <ContactFields
            name={name}
            setName={setName}
            email={email}
            setEmail={setEmail}
            phone={phone}
            setPhone={setPhone}
            errors={errors}
          />

          {error ? (
            <View
              style={{
                backgroundColor: "#fef2f2",
                borderWidth: 1,
                borderColor: "#fecaca",
                borderRadius: 10,
                padding: 10,
              }}
            >
              <Text style={{ color: "#b91c1c", fontSize: 12 }}>
                <Ionicons name="alert-circle" size={12} /> {error}
              </Text>
            </View>
          ) : null}

          <SubmitButtons
            isLoading={isLoading}
            onLightUp={() => submitRender(false)}
            onPreviewOnly={() => submitRender(true)}
          />

          <Text style={{ fontSize: 10, color: "#9ca3af", textAlign: "center" }}>
            <Ionicons name="shield-checkmark" size={10} /> We only use your info
            to send your preview.
          </Text>
        </Pressable>
      </ScrollView>

      <PackageModal
        visible={showPackageModal}
        onClose={() => setShowPackageModal(false)}
        loading={loadingPackages}
        options={packageOptions}
        selectedId={selectedPackage}
        onSelect={(id) => {
          setSelectedPackage(id);
          setShowPackageModal(false);
        }}
      />

      <ColorModal
        visible={showColorModal}
        onClose={() => setShowColorModal(false)}
        options={colorOptions}
        selectedScheme={selectedScheme}
        onSelect={(scheme) => {
          setSelectedScheme(scheme);
          setShowColorModal(false);
        }}
      />
    </View>
  );
}
