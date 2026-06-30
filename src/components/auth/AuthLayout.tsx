"use client";

import { Box, Typography, alpha } from "@mui/material";
import { AUTH } from "./authTheme";

type AuthLayoutProps = {
  title: string;
  subtitle: string;
  quote?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export default function AuthLayout({
  title,
  subtitle,
  quote = "Every page counts.",
  children,
  footer,
}: AuthLayoutProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        minHeight: { xs: "calc(100dvh - 64px)", md: "calc(100vh - 76px)" },
        bgcolor: { xs: AUTH.cream, md: "transparent" },
      }}
    >
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          flex: "1 1 52%",
          bgcolor: AUTH.cream,
          px: { md: 6, lg: 8 },
          py: 6,
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            py: 8,
            maxWidth: 480,
          }}
        >
          <Typography
            component="p"
            sx={{
              fontFamily: AUTH.font,
              fontSize: "0.8rem",
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: alpha(AUTH.wine, 0.55),
              mb: 2,
            }}
          >
            Katalog
          </Typography>
          <Typography
            component="h1"
            sx={{
              fontFamily: AUTH.serif,
              fontWeight: 700,
              fontSize: { md: "2.75rem", lg: "3.25rem" },
              lineHeight: 1.12,
              letterSpacing: "-0.03em",
              color: AUTH.dark,
              mb: 2.5,
            }}
          >
            {quote}
          </Typography>
          <Typography
            sx={{
              fontFamily: AUTH.font,
              fontSize: "1.1rem",
              lineHeight: 1.7,
              color: alpha(AUTH.dark, 0.55),
              maxWidth: 380,
            }}
          >
            Track books, build streaks, and never lose your place again.
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          flex: { xs: "1 1 auto", md: "1 1 48%" },
          bgcolor: { xs: AUTH.cream, md: "#FFFFFF" },
          px: 2,
          py: 3,
          pb: { xs: "max(1.25rem, env(safe-area-inset-bottom))", md: 5 },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          borderLeft: { md: `1px solid ${alpha(AUTH.wine, 0.08)}` },
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 300,
            textAlign: "center",
            mx: "auto",
          }}
        >
          <Typography
            component="h2"
            sx={{
              fontFamily: AUTH.font,
              fontWeight: 700,
              fontSize: "1.2rem",
              color: AUTH.dark,
              mb: 0.4,
            }}
          >
            {title}
          </Typography>
          <Typography
            sx={{
              fontFamily: AUTH.font,
              fontSize: "0.8125rem",
              color: alpha(AUTH.dark, 0.5),
              mb: 2.5,
              lineHeight: 1.45,
            }}
          >
            {subtitle}
          </Typography>

          <Box sx={{ textAlign: "left" }}>{children}</Box>

          {footer && <Box sx={{ mt: 2.5 }}>{footer}</Box>}
        </Box>
      </Box>
    </Box>
  );
}
