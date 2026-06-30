"use client";

import { Box, Typography, Chip, alpha } from "@mui/material";
import { VerifiedUser } from "@mui/icons-material";
import { motion } from "framer-motion";
import { DASH } from "@/components/dashboard/dashboardTheme";

type ProfileHeroProps = {
  firstName?: string;
  lastName?: string;
  username?: string;
  isVerified?: boolean;
  isDemo?: boolean;
};

function getInitials(firstName?: string, lastName?: string, username?: string) {
  if (firstName || lastName) {
    return `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase() || "?";
  }
  return username?.[0]?.toUpperCase() ?? "?";
}

export default function ProfileHero({
  firstName,
  lastName,
  username,
  isVerified,
  isDemo,
}: ProfileHeroProps) {
  const displayName = [firstName, lastName].filter(Boolean).join(" ") || username || "Reader";
  const initials = getInitials(firstName, lastName, username);

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      sx={{
        mb: 3,
        p: { xs: 2.5, md: 3 },
        bgcolor: DASH.dark,
        border: `1px solid ${alpha(DASH.wine, 0.3)}`,
        background: `linear-gradient(135deg, ${DASH.dark} 0%, ${DASH.wineDark} 60%, #4A2525 100%)`,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2.5 }}>
        <Box
          sx={{
            width: { xs: 64, sm: 72 },
            height: { xs: 64, sm: 72 },
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: alpha(DASH.cream, 0.12),
            border: `2px solid ${alpha(DASH.gold, 0.35)}`,
            fontFamily: DASH.serif,
            fontWeight: 700,
            fontSize: { xs: "1.25rem", sm: "1.5rem" },
            color: DASH.cream,
            letterSpacing: "0.04em",
          }}
        >
          {initials}
        </Box>

        <Box sx={{ minWidth: 0 }}>
          <Typography
            sx={{
              fontFamily: DASH.serif,
              fontWeight: 700,
              fontSize: { xs: "1.35rem", md: "1.65rem" },
              color: DASH.cream,
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
              mb: 0.35,
            }}
          >
            {displayName}
          </Typography>
          {username && (
            <Typography
              sx={{
                fontFamily: DASH.font,
                fontSize: "0.875rem",
                color: alpha(DASH.cream, 0.65),
                mb: 1,
              }}
            >
              @{username}
            </Typography>
          )}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
            {isVerified && (
              <Chip
                icon={<VerifiedUser sx={{ fontSize: "14px !important", color: `${DASH.gold} !important` }} />}
                label="Verified"
                size="small"
                sx={{
                  height: 24,
                  fontFamily: DASH.font,
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  borderRadius: 0,
                  bgcolor: alpha(DASH.gold, 0.15),
                  color: DASH.gold,
                  border: `1px solid ${alpha(DASH.gold, 0.3)}`,
                }}
              />
            )}
            {isDemo && (
              <Chip
                label="Demo account"
                size="small"
                sx={{
                  height: 24,
                  fontFamily: DASH.font,
                  fontSize: "0.7rem",
                  borderRadius: 0,
                  bgcolor: alpha(DASH.cream, 0.08),
                  color: alpha(DASH.cream, 0.75),
                  border: `1px solid ${alpha(DASH.cream, 0.2)}`,
                }}
              />
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
