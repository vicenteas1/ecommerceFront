import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    neutral: Palette["primary"];
  }
  interface PaletteOptions {
    neutral?: PaletteOptions["primary"];
  }
}

const theme = createTheme({
  palette: {
    primary: {
      main: "#0D64BA",
      dark: "#1284D2",
      light: "#18A4EA",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#35394C",
      light: "#636C86",
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#F6F8FB",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#35394C",
      secondary: "#636C86",
    },
  },
  shape: { borderRadius: 16 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: "none", borderRadius: 12, fontWeight: 600 },
      },
    },
    MuiTextField: {
      defaultProps: { fullWidth: true, size: "medium" },
    },
  },
  typography: {
    fontFamily: `"Inter", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji"`,
    h4: { fontWeight: 700 },
    h6: { fontWeight: 600 },
  },
});

export default theme;
