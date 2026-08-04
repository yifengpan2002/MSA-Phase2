import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: { main: "#1f8a70" }, // energy
    secondary: { main: "#c98f16" }, // points
    background: { default: "#e9ebe4", paper: "#f5f6f1" },
    text: { primary: "#131a22", secondary: "#5c6670" },
    divider: "#c9cdc4",
  },
  typography: {
    fontFamily: '"Karla", system-ui, sans-serif',
    h1: {
      fontFamily: '"Newsreader", Georgia, serif',
      fontWeight: 400,
      fontSize: "clamp(2.75rem, 6vw, 4rem)",
      lineHeight: 1.05,
    },
    h2: { fontFamily: '"Newsreader", Georgia, serif', fontWeight: 400 },
    button: {
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: 12,
      letterSpacing: "0.16em",
      textTransform: "uppercase",
    },
  },
  shape: { borderRadius: 2 },
  components: {
    MuiButton: { defaultProps: { disableElevation: true } },
  },
});
