import { createContext, useContext } from "react";
import type { OrbitThemeMode } from "../theme";

export interface ColorModeContextValue {
  mode: OrbitThemeMode;
  setMode: (mode: OrbitThemeMode) => void;
  toggleMode: () => void;
}

export const ColorModeContext = createContext<ColorModeContextValue | null>(
  null,
);

export function useColorMode() {
  const value = useContext(ColorModeContext);
  if (!value) {
    throw new Error("useColorMode must be used inside ColorModeProvider.");
  }
  return value;
}
