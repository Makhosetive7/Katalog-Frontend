import { alpha } from "@mui/material";

export const AUTH = {
  dark: "#1E1612",
  cream: "#FAF6F0",
  wine: "#5C2E2E",
  wineDark: "#3D1C1C",
  gold: "#C9A962",
  green: "#58CC02",
  font: "system-ui, -apple-system, sans-serif",
  serif: '"Georgia", "Times New Roman", serif',
} as const;

export const authFieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 0,
    fontFamily: AUTH.font,
    fontSize: "0.8125rem",
    bgcolor: "#FFFFFF",
    transition: "border-color 0.15s ease, box-shadow 0.15s ease",
    "& input": {
      py: 1.1,
      px: 0.25,
      fontSize: "16px",
    },
    "& fieldset": {
      borderColor: alpha(AUTH.wine, 0.14),
    },
    "&:hover fieldset": {
      borderColor: alpha(AUTH.wine, 0.3),
    },
    "&.Mui-focused": {
      bgcolor: "#FFFFFF",
      boxShadow: `0 0 0 3px ${alpha(AUTH.wine, 0.08)}`,
    },
    "&.Mui-focused fieldset": {
      borderColor: AUTH.wine,
      borderWidth: 1,
    },
  },
  "& .MuiInputLabel-root": {
    fontFamily: AUTH.font,
    fontSize: "0.8125rem",
  },
  "& .MuiInputLabel-shrink": {
    fontSize: "0.75rem",
  },
  "& .MuiFormHelperText-root": {
    fontFamily: AUTH.font,
    fontSize: "0.7rem",
    mt: 0.5,
  },
};

export const authPrimaryButtonSx = {
  py: 0.9,
  minHeight: 40,
  fontSize: "0.8125rem",
  fontWeight: 600,
  fontFamily: AUTH.font,
  borderRadius: 0,
  textTransform: "none" as const,
  bgcolor: AUTH.dark,
  color: AUTH.cream,
  boxShadow: "none",
  "&:hover": {
    bgcolor: AUTH.wineDark,
    boxShadow: "none",
  },
};

export const authGhostButtonSx = {
  py: 0.75,
  minHeight: 36,
  fontFamily: AUTH.font,
  fontWeight: 500,
  fontSize: "0.8125rem",
  borderRadius: 0,
  textTransform: "none" as const,
  color: alpha(AUTH.dark, 0.55),
  "&:hover": {
    bgcolor: alpha(AUTH.wine, 0.04),
  },
};

export const authAlertSx = {
  mb: 1.5,
  borderRadius: 0,
  fontFamily: AUTH.font,
  fontSize: "0.8125rem",
  py: 0,
  "& .MuiAlert-message": {
    padding: "8px 0",
  },
};
