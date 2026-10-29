import { Button } from "@/components/ui";
import { colors } from "@/constants/theme";
import BottomSheet, {
    BottomSheetBackdrop,
    BottomSheetScrollView,
    BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import { useColorScheme } from "nativewind";
import { forwardRef, useCallback, useEffect, useRef } from "react";
import { Keyboard, Platform, Pressable, Text, View } from "react-native";
import useLoginForm from "../hooks/useLoginForm";

const LoginSheet = forwardRef<BottomSheet>((_, ref) => {
  const { colorScheme } = useColorScheme();
  const c = colors[colorScheme === "dark" ? "dark" : "light"];
  const indexRef = useRef(-1);

  const {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    busy,
    submit,
    reset,
  } = useLoginForm(() => {
    (ref as any)?.current?.close?.();
  });

  useEffect(() => {
    const event =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";
    const sub = Keyboard.addListener(event, () => {
      if (indexRef.current > 0) {
        (ref as any)?.current?.snapToIndex(0);
      }
    });
    return () => sub.remove();
  }, [ref]);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior="close"
      />
    ),
    [],
  );

  return (
    <BottomSheet
      ref={ref}
      index={-1}
      snapPoints={["55%", "90%"]}
      enablePanDownToClose
      keyboardBehavior="extend"
      keyboardBlurBehavior="none"
      android_keyboardInputMode="adjustResize"
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: c.surface }}
      handleIndicatorStyle={{ backgroundColor: c.muted }}
      onAnimate={(_from, to) => {
        indexRef.current = to;
      }}
      onClose={reset}
    >
      <BottomSheetScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 32 }}
      >
        <View className="mb-6 items-center">
          <Text className="text-lg font-semibold text-ink dark:text-ink-dark">
            Welcome back
          </Text>
          <Text className="mt-1 text-center text-sm text-muted dark:text-muted-dark">
            Log in to keep celebrating.
          </Text>
        </View>

        <View className="gap-3">
          <BottomSheetTextInput
            style={{
              height: 48,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: c.border,
              backgroundColor: c.surface,
              paddingHorizontal: 16,
              fontSize: 16,
              color: c.text,
            }}
            placeholder="Email"
            placeholderTextColor={c.muted}
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          <View className="relative">
            <BottomSheetTextInput
              style={{
                height: 48,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: c.border,
                backgroundColor: c.surface,
                paddingHorizontal: 16,
                paddingRight: 64,
                fontSize: 16,
                color: c.text,
              }}
              placeholder="Password"
              placeholderTextColor={c.muted}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              value={password}
              onChangeText={setPassword}
            />
            <Pressable
              onPress={() => setShowPassword((v) => !v)}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel={
                showPassword ? "Hide password" : "Show password"
              }
              className="absolute right-3 top-0 h-12 justify-center"
            >
              <Text className="text-sm font-semibold text-brand dark:text-brand-dark">
                {showPassword ? "Hide" : "Show"}
              </Text>
            </Pressable>
          </View>

          <Button title="Log in" onPress={submit} loading={busy} />
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
});

export default LoginSheet;
