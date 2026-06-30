"use client";

import { Box, Typography, alpha } from "@mui/material";
import { motion } from "framer-motion";
import { DASH } from "./dashboardTheme";

export default function DashboardStatCard({
  label,
  value,
  icon,
  accent = DASH.wine,
  subtitle,
  delay = 0,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  accent?: string;
  subtitle?: string;
  delay?: number;
}) {
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: [0.22, 1, 0.36, 1] }}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        px: { xs: 1.5, sm: 2 },
        py: { xs: 2.5, sm: 3 },
        borderRadius: 0,
        bgcolor: "#FFFFFF",
        border: `1px solid ${alpha(DASH.wine, 0.1)}`,
        borderTop: `3px solid ${accent}`,
        height: "100%",
        minHeight: { xs: 128, sm: 140 },
        transition: "background-color 0.2s ease",
        "&:hover": {
          bgcolor: alpha(accent, 0.04),
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 36,
          height: 36,
          mb: 1,
          color: accent,
        }}
      >
        {icon}
      </Box>

      <Typography
        sx={{
          fontFamily: DASH.serif,
          fontWeight: 700,
          fontSize: { xs: "1.6rem", sm: "1.9rem" },
          color: DASH.dark,
          lineHeight: 1,
          mb: 0.6,
          letterSpacing: "-0.02em",
        }}
      >
        {value}
      </Typography>

      <Typography
        sx={{
          fontFamily: DASH.font,
          fontSize: "0.72rem",
          fontWeight: 600,
          color: alpha(DASH.dark, 0.62),
          textTransform: "uppercase",
          letterSpacing: "0.07em",
          lineHeight: 1.3,
        }}
      >
        {label}
      </Typography>

      {subtitle && (
        <Typography
          sx={{
            fontFamily: DASH.font,
            fontSize: "0.68rem",
            color: alpha(DASH.dark, 0.4),
            mt: 0.45,
            lineHeight: 1.3,
          }}
        >
          {subtitle}
        </Typography>
      )}
    </Box>
  );
}
