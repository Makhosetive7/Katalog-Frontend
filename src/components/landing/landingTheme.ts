import { alpha } from "@mui/material";
import { DASH } from "@/components/dashboard/dashboardTheme";

export { DASH };

export const landingChipSx = {
  borderRadius: 0,
  fontFamily: DASH.font,
  fontWeight: 600,
  fontSize: "0.75rem",
} as const;

export function landingCardSx(accent: string = DASH.wine) {
  return {
    borderRadius: 0,
    bgcolor: "#FFFFFF",
    border: `1px solid ${alpha(DASH.wine, 0.1)}`,
    borderTop: `3px solid ${accent}`,
  };
}

export const landingButtonPrimarySx = {
  borderRadius: 0,
  textTransform: "none" as const,
  fontFamily: DASH.font,
  fontWeight: 700,
  boxShadow: "none",
};

export const landingButtonOutlinedSx = {
  borderRadius: 0,
  textTransform: "none" as const,
  fontFamily: DASH.font,
  fontWeight: 600,
};
