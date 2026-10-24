import AsyncStorage from "@react-native-async-storage/async-storage";
import { colorScheme } from "nativewind";
import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";

export type ThemePreference = "light" | "dark" | "system";
const KEY = "festive-express:theme";

type Ctx = {
  preference: ThemePreference;
  setPreference: (p: ThemePreference) => void;
};
const ThemeContext = createContext<Ctx>({
  preference: "system",
  setPreference: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>("system");

  useEffect(() => {
    AsyncStorage.getItem(KEY).then((saved) => {
      if (saved === "light" || saved === "dark" || saved === "system")
        setPreferenceState(saved);
    });
  }, []);

  useEffect(() => {
    colorScheme.set(preference);
  }, [preference]);

  const setPreference = (p: ThemePreference) => {
    setPreferenceState(p);
    AsyncStorage.setItem(KEY, p).catch(() => {});
  };

  return (
    <ThemeContext.Provider value={{ preference, setPreference }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useThemePreference = () => useContext(ThemeContext);
