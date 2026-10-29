import { useAuth } from "@/providers/AuthProvider";
import { useState } from "react";
import { Alert } from "react-native";

export default function useLoginForm(onSuccess: () => void) {
    const { signIn } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [busy, setBusy] = useState(false);

    async function submit() {
        if (!email.trim() || !password) {
            return Alert.alert("Missing info", "Enter your email and password.");
        }
        setBusy(true);
        const error = await signIn(email.trim(), password);
        if (error) Alert.alert("Login failed", error);
        else onSuccess();
        setBusy(false);
    }

    function reset() {
        setEmail("");
        setPassword("");
        setShowPassword(false);
    }

    return {
        email,
        setEmail,
        password,
        setPassword,
        showPassword,
        setShowPassword,
        busy,
        submit,
        reset,
    };
}