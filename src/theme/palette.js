// src/theme/palette.js
import { alpha } from "@mui/material/styles";

const GREY = {
  0: "#f9fafb",
  100: "#f3f4f6",
  200: "#e5e7eb",
  300: "#d1d5db",
  400: "#9ca3af",
  500: "#6b7280",
  600: "#4b5563",
  700: "#374151",
  800: "#1f2937",
  900: "#111827",
};

const COMMON = {
  black: "#000000",
  white: "#FFFFFF",
};

// 🌿 PRIMARY — Sustainability Green
const PRIMARY = {
  main: "#059669",       // emerald green
  light: "#6ee7b7",
  lighter: "#e6fdf5",
  dark: "#047857",
  contrastText: "#FFFFFF",
};

// 🌍 SECONDARY — Earth Grey / Forest
const SECONDARY = {
  main: "#4B5563",
  light: "#9CA3AF",
  dark: "#374151",
  contrastText: "#FFFFFF",
};

// 🔵 INFO — Sky / Atmosphere Blue
const INFO = {
  main: "#0ea5e9",
  light: "#7dd3fc",
  dark: "#0369a1",
  contrastText: "#FFFFFF",
};

// 🟢 SUCCESS — Represents Carbon Reduction
const SUCCESS = {
  main: "#22c55e",
  light: "#86efac",
  dark: "#15803d",
  contrastText: "#FFFFFF",
};

// 🟡 WARNING
const WARNING = {
  main: "#f59e0b",
  light: "#fcd34d",
  dark: "#b45309",
  contrastText: "#FFFFFF",
};

// 🔴 ERROR
const ERROR = {
  main: "#dc2626",
  light: "#fca5a5",
  dark: "#991b1b",
  contrastText: "#FFFFFF",
};

// -----------------------------

const DEFAULT = {
  common: COMMON,
  primary: PRIMARY,
  secondary: SECONDARY,
  info: INFO,
  success: SUCCESS,
  warning: WARNING,
  error: ERROR,
  grey: GREY,

  divider: alpha(GREY[500], 0.2),

  action: {
    hover: alpha(GREY[500], 0.08),
    selected: alpha(GREY[500], 0.16),
    disabled: alpha(GREY[500], 0.6),
    disabledBackground: alpha(GREY[500], 0.24),
    focus: alpha(GREY[500], 0.24),
    hoverOpacity: 0.08,
    disabledOpacity: 0.48,
  },
};

// -----------------------------

export function palette(mode = "light") {
  const light = {
    ...DEFAULT,
    mode: "light",

    text: {
      primary: "#0B0F0E",
      secondary: "#4B5563",
      disabled: GREY[500],
    },

    background: {
      paper: "#ffffff",
      default: "#f4faf7", // soft greenish white (clean sustainability feel)
      navbar: PRIMARY.main, // Emerald green navbar
    },

    action: {
      ...DEFAULT.action,
      active: GREY[700],
    },
  };

  const dark = {
    ...DEFAULT,
    mode: "dark",

    text: {
      primary: "#e5e7eb",
      secondary: "#9ca3af",
      disabled: GREY[600],
    },

    background: {
      paper: "#1e293b",   // slate dark
      default: "#0f172a", // deep navy (eco-friendly dark mode)
      navbar: "#10b981",  // brighter green for contrast
    },

    action: {
      ...DEFAULT.action,
      active: GREY[300],
    },
  };

  return mode === "light" ? light : dark;
}
