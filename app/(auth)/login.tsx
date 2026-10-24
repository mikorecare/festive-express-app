import { Body, Button } from "@/components/ui";
import { colors } from "@/constants/theme";
import { useAuth } from "@/providers/AuthProvider";
import { useColorScheme } from "nativewind";
import { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Login() {
  const { signIn, signUp } = useAuth();
  const { colorScheme } = useColorScheme();
  const c = colors[colorScheme === "dark" ? "dark" : "light"];

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const inputClass =
    "h-12 rounded-xl border border-line bg-surface px-4 text-base text-ink dark:border-line-dark dark:bg-surface-dark dark:text-ink-dark";

  async function submit() {
    if (!email.trim() || !password)
      return Alert.alert("Missing info", "Enter your email and password.");
    setBusy(true);
    if (mode === "login") {
      const error = await signIn(email.trim(), password);
      if (error) Alert.alert("Login failed", error);
    } else {
      const { error, needsConfirmation } = await signUp(email.trim(), password);
      if (error) Alert.alert("Sign up failed", error);
      else if (needsConfirmation)
        Alert.alert("Check your email", "Confirm your address, then log in.");
    }
    setBusy(false);
  }

  return (
    <SafeAreaView className="flex-1 bg-canvas dark:bg-canvas-dark">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerClassName="flex-grow justify-center px-6 py-10"
          keyboardShouldPersistTaps="handled"
        >
          <View className="mb-10 items-center">
            <Text className="text-4xl font-extrabold text-brand dark:text-brand-dark">
              Festive Express
            </Text>
            <Body className="mt-2 text-center">
              {mode === "login"
                ? "Welcome back. Log in to keep celebrating."
                : "Create your account to get started."}
            </Body>
          </View>

          <View className="gap-3">
            <TextInput
              className={inputClass}
              placeholder="Email"
              placeholderTextColor={c.muted}
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              className={inputClass}
              placeholder="Password"
              placeholderTextColor={c.muted}
              secureTextEntry
              autoCapitalize="none"
              value={password}
              onChangeText={setPassword}
            />
            <Button
              title={mode === "login" ? "Log in" : "Sign up"}
              onPress={submit}
              loading={busy}
            />
            <Button
              variant="outline"
              title={
                mode === "login"
                  ? "Create an account"
                  : "I already have an account"
              }
              onPress={() => setMode(mode === "login" ? "signup" : "login")}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
