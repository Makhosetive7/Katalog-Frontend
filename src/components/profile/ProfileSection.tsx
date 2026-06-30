"use client";

import { Box, Typography, alpha } from "@mui/material";
import { DASH } from "@/components/dashboard/dashboardTheme";

export default function ProfileSection({
  title,
  children,
  accent = DASH.wine,
}: {
  title: string;
  children: React.ReactNode;
  accent?: string;
}) {
  return (
    <Box
      sx={{
        bgcolor: "#FFFFFF",
        border: `1px solid ${alpha(DASH.wine, 0.1)}`,
        borderTop: `3px solid ${accent}`,
        p: { xs: 2, md: 2.5 },
        height: "100%",
      }}
    >
      <Typography
        sx={{
          fontFamily: DASH.font,
          fontWeight: 700,
          fontSize: "0.8125rem",
          color: DASH.dark,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          mb: 2,
        }}
      >
        {title}
      </Typography>
      {children}
    </Box>
  );
}

export function ProfileField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Box sx={{ mb: 1.75, "&:last-child": { mb: 0 } }}>
      <Typography
        sx={{
          fontFamily: DASH.font,
          fontSize: "0.7rem",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          color: alpha(DASH.dark, 0.42),
          mb: 0.35,
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          fontFamily: DASH.font,
          fontSize: "0.875rem",
          color: DASH.dark,
          lineHeight: 1.45,
        }}
      >
        {children}
      </Typography>
    </Box>
  );
}
