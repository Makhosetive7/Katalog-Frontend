"use client";

import { createTheme } from "@mui/material/styles";

const square = { borderRadius: 0 } as const;

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#5C2E2E",
      light: "#8B4A4A",
      dark: "#3D1C1C",
    },
    secondary: {
      main: "#C9A962",
      light: "#E0C98A",
      dark: "#9A7D3C",
    },
    background: {
      default: "#FAF6F0",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1E1612",
      secondary: "#5C4F45",
    },
  },
  typography: {
    fontFamily: '"Georgia", "Times New Roman", serif',
    h1: { fontWeight: 700, letterSpacing: "-0.02em" },
    h2: { fontWeight: 700, letterSpacing: "-0.01em" },
    h3: { fontWeight: 600 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: { borderRadius: 0 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: square,
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: square,
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: square,
        rounded: square,
      },
    },
    MuiCard: {
      styleOverrides: {
        root: square,
      },
    },
    MuiChip: {
      styleOverrides: {
        root: square,
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: square,
        notchedOutline: square,
      },
    },
    MuiFilledInput: {
      styleOverrides: {
        root: square,
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: square,
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: square,
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: square,
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: square,
        list: square,
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: square,
      },
    },
    MuiPopover: {
      styleOverrides: {
        paper: square,
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: square,
        rounded: square,
      },
    },
    MuiSkeleton: {
      styleOverrides: {
        root: square,
        rounded: square,
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: square,
        bar: square,
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: square,
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        paper: square,
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: square,
      },
    },
    MuiToggleButtonGroup: {
      styleOverrides: {
        root: square,
      },
    },
    MuiFab: {
      styleOverrides: {
        root: square,
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: square,
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: square,
      },
    },
    MuiTab: {
      styleOverrides: {
        root: square,
      },
    },
  },
});
