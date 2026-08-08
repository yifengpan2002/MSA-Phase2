import { createTheme } from "@mui/material/styles";

export type OrbitThemeMode = "light" | "dark";

const fonts = {
  body: '"Karla", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  heading: '"Newsreader", Georgia, serif',
  mono: '"JetBrains Mono", "SFMono-Regular", Consolas, monospace',
};

export function createOrbitTheme(mode: OrbitThemeMode = "dark") {
  const isDark = mode === "dark";

  const palette = {
    light: {
      primary: "#1b927b",
      primarySoft: "rgba(27, 146, 123, 0.11)",
      secondary: "#c8891b",
      background: "#f2f4ee",
      paper: "rgba(255, 255, 249, 0.88)",
      paperSolid: "#fffefa",
      text: "#101820",
      muted: "#64706b",
      divider: "rgba(20, 32, 30, 0.14)",
      cardShadow: "0 22px 70px rgba(36, 50, 44, 0.10)",
      bodyBackground:
        "radial-gradient(circle at 12% 8%, rgba(27, 146, 123, 0.14), transparent 30%), radial-gradient(circle at 88% 2%, rgba(200, 137, 27, 0.14), transparent 26%), linear-gradient(180deg, #f6f7f1 0%, #eef2eb 100%)",
    },
    dark: {
      primary: "#7fe1c8",
      primarySoft: "rgba(127, 225, 200, 0.12)",
      secondary: "#f2b84b",
      background: "#05080c",
      paper: "rgba(14, 22, 28, 0.78)",
      paperSolid: "#111a20",
      text: "#eef7f3",
      muted: "#a7b7b1",
      divider: "rgba(180, 235, 220, 0.16)",
      cardShadow: "0 24px 80px rgba(0, 0, 0, 0.35)",
      bodyBackground:
        "radial-gradient(circle at 14% 8%, rgba(127, 225, 200, 0.16), transparent 28%), radial-gradient(circle at 86% 4%, rgba(242, 184, 75, 0.12), transparent 24%), radial-gradient(circle at 50% 105%, rgba(93, 124, 255, 0.12), transparent 32%), linear-gradient(180deg, #05080c 0%, #0b1016 100%)",
    },
  }[mode];

  return createTheme({
    palette: {
      mode,
      primary: { main: palette.primary },
      secondary: { main: palette.secondary },
      background: {
        default: palette.background,
        paper: palette.paperSolid,
      },
      text: {
        primary: palette.text,
        secondary: palette.muted,
      },
      divider: palette.divider,
    },
    typography: {
      fontFamily: fonts.body,
      h1: {
        fontFamily: fonts.heading,
        fontWeight: 400,
        fontSize: "clamp(2.6rem, 7vw, 5.4rem)",
        lineHeight: 0.98,
        letterSpacing: "-0.035em",
      },
      h2: {
        fontFamily: fonts.heading,
        fontWeight: 400,
        letterSpacing: "-0.02em",
      },
      h3: {
        fontFamily: fonts.heading,
        fontWeight: 400,
        letterSpacing: "-0.015em",
      },
      body1: { lineHeight: 1.7 },
      body2: { lineHeight: 1.6 },
      button: {
        fontFamily: fonts.mono,
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
      },
    },
    shape: { borderRadius: 18 },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            minWidth: 320,
            background: palette.bodyBackground,
            backgroundAttachment: "fixed",
          },
          "::selection": {
            backgroundColor: palette.primarySoft,
            color: palette.text,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: isDark
              ? "rgba(5, 8, 12, 0.74)"
              : "rgba(247, 248, 242, 0.78)",
            borderBottom: `1px solid ${palette.divider}`,
            backdropFilter: "blur(18px)",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            backgroundColor: palette.paper,
            borderColor: palette.divider,
            boxShadow: "none",
            backdropFilter: "blur(16px)",
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            backgroundColor: palette.paper,
            borderColor: palette.divider,
            boxShadow: "none",
            backdropFilter: "blur(16px)",
          },
        },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: {
            borderRadius: 999,
            minHeight: 38,
            paddingInline: 18,
            transition:
              "transform 160ms ease, background-color 160ms ease, border-color 160ms ease, box-shadow 160ms ease",
            "&:hover": {
              transform: "translateY(-1px)",
            },
          },
          contained: {
            color: isDark ? "#04100c" : "#ffffff",
            boxShadow: `0 14px 34px ${isDark ? "rgba(127, 225, 200, 0.14)" : "rgba(27, 146, 123, 0.18)"}`,
          },
          outlined: {
            borderColor: palette.divider,
          },
          text: {
            color: palette.text,
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            borderRadius: 999,
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 18,
            backgroundColor: isDark
              ? "rgba(255, 255, 255, 0.035)"
              : "rgba(255, 255, 255, 0.60)",
            "& fieldset": {
              borderColor: palette.divider,
            },
            "&:hover fieldset": {
              borderColor: palette.primary,
            },
          },
        },
      },
      MuiAlert: {
        styleOverrides: {
          root: {
            borderRadius: 18,
            border: `1px solid ${palette.divider}`,
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            borderColor: palette.divider,
          },
        },
      },
    },
  });
}
