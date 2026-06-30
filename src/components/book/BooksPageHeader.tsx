"use client";

import { Box, Typography, alpha } from "@mui/material";
import { DASH } from "@/components/dashboard/dashboardTheme";

export default function BooksPageHeader({
  label,
  title,
  subtitle,
  actions,
}: {
  label: string;
  title: string;
  subtitle: string;
  actions?: React.ReactNode;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { xs: "flex-start", sm: "center" },
        justifyContent: "space-between",
        gap: 2,
        mb: { xs: 3, md: 4 },
      }}
    >
      <Box>
        <Typography
          sx={{
            fontFamily: DASH.font,
            fontSize: "0.8rem",
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: alpha(DASH.wine, 0.55),
            mb: 0.5,
          }}
        >
          {label}
        </Typography>
        <Typography
          component="h1"
          sx={{
            fontFamily: DASH.serif,
            fontWeight: 700,
            fontSize: { xs: "1.5rem", md: "1.85rem" },
            color: DASH.dark,
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
          }}
        >
          {title}
        </Typography>
        <Typography
          sx={{
            fontFamily: DASH.font,
            fontSize: "0.875rem",
            color: alpha(DASH.dark, 0.5),
            mt: 0.5,
            maxWidth: 480,
          }}
        >
          {subtitle}
        </Typography>
      </Box>
      {actions}
    </Box>
  );
}
