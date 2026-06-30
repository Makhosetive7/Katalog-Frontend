"use client";

import { Box, Typography, alpha } from "@mui/material";
import { DASH } from "./dashboardTheme";

export default function DashboardMiniStat({
  label,
  value,
  accent = DASH.wine,
  hint,
}: {
  label: string;
  value: string | number;
  accent?: string;
  hint?: string;
}) {
  return (
    <Box
      sx={{
        p: 1.5,
        textAlign: "center",
        bgcolor: "#FFFFFF",
        border: `1px solid ${alpha(DASH.wine, 0.08)}`,
        borderTop: `3px solid ${accent}`,
        height: "100%",
      }}
    >
      <Typography
        sx={{
          fontFamily: DASH.serif,
          fontWeight: 700,
          fontSize: "1.35rem",
          color: DASH.dark,
          lineHeight: 1,
          mb: 0.5,
        }}
      >
        {value}
      </Typography>
      <Typography
        sx={{
          fontFamily: DASH.font,
          fontSize: "0.65rem",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          color: alpha(DASH.dark, 0.55),
        }}
      >
        {label}
      </Typography>
      {hint && (
        <Typography
          sx={{
            fontFamily: DASH.font,
            fontSize: "0.65rem",
            color: alpha(DASH.dark, 0.4),
            mt: 0.35,
          }}
        >
          {hint}
        </Typography>
      )}
    </Box>
  );
}
