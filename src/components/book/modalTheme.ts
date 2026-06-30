import { alpha, SxProps, Theme } from "@mui/material";
import { DASH } from "@/components/dashboard/dashboardTheme";

export const modalPaperSx: SxProps<Theme> = {
  borderRadius: 0,
  bgcolor: "#FFFFFF",
  boxShadow: "0 24px 64px rgba(30, 22, 18, 0.18)",
  overflow: "hidden",
};

export const modalTitleSx: SxProps<Theme> = {
  m: 0,
  px: 3,
  py: 2.25,
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: 2,
  borderBottom: `1px solid ${alpha(DASH.wine, 0.1)}`,
  bgcolor: DASH.cream,
};

export const modalContentSx: SxProps<Theme> = {
  px: 3,
  py: 3,
  borderTop: "none",
};

export const modalActionsSx: SxProps<Theme> = {
  px: 3,
  py: 2,
  gap: 1,
  borderTop: `1px solid ${alpha(DASH.wine, 0.1)}`,
  bgcolor: alpha(DASH.cream, 0.5),
};

export const modalFieldSx: SxProps<Theme> = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 0,
    fontFamily: DASH.font,
    fontSize: "0.875rem",
    bgcolor: "#FFFFFF",
    "& fieldset": {
      borderColor: alpha(DASH.wine, 0.18),
    },
    "&:hover fieldset": {
      borderColor: alpha(DASH.wine, 0.32),
    },
    "&.Mui-focused fieldset": {
      borderColor: DASH.wine,
    },
  },
  "& .MuiInputLabel-root": {
    fontFamily: DASH.font,
    fontSize: "0.8125rem",
  },
  "& .MuiFormHelperText-root": {
    fontFamily: DASH.font,
    fontSize: "0.7rem",
  },
};

export const modalSelectSx: SxProps<Theme> = {
  borderRadius: 0,
  fontFamily: DASH.font,
  fontSize: "0.875rem",
  bgcolor: "#FFFFFF",
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: alpha(DASH.wine, 0.18),
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: alpha(DASH.wine, 0.32),
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: DASH.wine,
  },
};

export const modalPrimaryButtonSx: SxProps<Theme> = {
  textTransform: "none",
  fontFamily: DASH.font,
  fontWeight: 600,
  fontSize: "0.8125rem",
  bgcolor: DASH.dark,
  color: DASH.cream,
  px: 2.5,
  py: 0.85,
  boxShadow: "none",
  borderRadius: 0,
  "&:hover": { bgcolor: DASH.wineDark, boxShadow: "none" },
  "&.Mui-disabled": {
    bgcolor: alpha(DASH.dark, 0.35),
    color: alpha(DASH.cream, 0.7),
  },
};

export const modalGhostButtonSx: SxProps<Theme> = {
  textTransform: "none",
  fontFamily: DASH.font,
  fontWeight: 500,
  fontSize: "0.8125rem",
  color: alpha(DASH.dark, 0.6),
  borderRadius: 0,
  px: 2,
  "&:hover": { bgcolor: alpha(DASH.wine, 0.05) },
};

export const modalSectionSx: SxProps<Theme> = {
  p: 2,
  border: `1px solid ${alpha(DASH.wine, 0.1)}`,
  bgcolor: alpha(DASH.cream, 0.35),
};

export const modalLabelSx: SxProps<Theme> = {
  fontFamily: DASH.font,
  fontSize: "0.7rem",
  fontWeight: 600,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: alpha(DASH.wine, 0.55),
  mb: 0.5,
};

export const modalHeadingSx: SxProps<Theme> = {
  fontFamily: DASH.serif,
  fontWeight: 700,
  fontSize: "1.2rem",
  color: DASH.dark,
  letterSpacing: "-0.02em",
  lineHeight: 1.2,
};
