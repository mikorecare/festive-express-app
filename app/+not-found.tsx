import { useAuth } from "@/providers/AuthProvider";
import { Redirect } from "expo-router";

export default function NotFound() {
  const { session } = useAuth();
  return <Redirect href={session ? "/" : "/login"} />;
}
