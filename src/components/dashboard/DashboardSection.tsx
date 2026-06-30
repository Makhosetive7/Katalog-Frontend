"use client";

import { Box, Typography, alpha } from "@mui/material";
import { DASH } from "./dashboardTheme";

export default function DashboardSection({
  title,
  subtitle,
  action,
  children,
  noPadding,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  noPadding?: boolean;
}) {
  return (
    <Box
      sx={{
        borderRadius: 0,
        bgcolor: "#FFFFFF",
        border: `1px solid ${alpha(DASH.wine, 0.07)}`,
        boxShadow: "0 4px 24px rgba(30, 22, 18, 0.04)",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 2,
          px: { xs: 2.5, md: 3 },
          pt: { xs: 2.5, md: 3 },
          pb: noPadding ? 0 : 2,
        }}
      >
        <Box>
          <Typography
            sx={{
              fontFamily: DASH.font,
              fontWeight: 700,
              fontSize: "1rem",
              color: DASH.dark,
              letterSpacing: "-0.01em",
            }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography
              sx={{
                fontFamily: DASH.font,
                fontSize: "0.8125rem",
                color: alpha(DASH.dark, 0.5),
                mt: 0.35,
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
        {action}
      </Box>
      <Box sx={{ px: noPadding ? 0 : { xs: 2.5, md: 3 }, pb: noPadding ? 0 : { xs: 2.5, md: 3 } }}>
        {children}
      </Box>
    </Box>
  );
}
