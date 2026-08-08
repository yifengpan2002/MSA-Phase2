import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createOrbitTheme, type OrbitThemeMode } from "../theme";
import { ColorModeContext, type ColorModeContextValue } from "./colorMode";

const STORAGE_KEY = "orbit.themeMode";

function getInitialMode(): OrbitThemeMode {
  if (typeof window === "undefined") return "dark";

  try {
    const savedMode = window.localStorage.getItem(STORAGE_KEY);
    if (savedMode === "light" || savedMode === "dark") return savedMode;
  } catch {
    /* localStorage can be unavailable in private or restricted contexts */
  }

  return "dark";
}

export function ColorModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<OrbitThemeMode>(getInitialMode);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      /* keep rendering even if browser storage is unavailable */
    }
  }, [mode]);

  const theme = useMemo(() => createOrbitTheme(mode), [mode]);

  const value = useMemo<ColorModeContextValue>(
    () => ({
      mode,
      setMode,
      toggleMode: () =>
        setMode((current) => (current === "dark" ? "light" : "dark")),
    }),
    [mode],
  );

  return (
    <ColorModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

