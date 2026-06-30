"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Box, Button, Typography, alpha, Chip } from "@mui/material";
import { Add, ArrowForward, LocalFireDepartment, TrendingUp } from "@mui/icons-material";
import { motion } from "framer-motion";
import { DASH } from "./dashboardTheme";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function getMotivation(streak: number, inProgress: number) {
  if (streak >= 14) return "You're on fire — keep that streak alive.";
  if (streak >= 7) return "A solid week of reading. Don't stop now.";
  if (inProgress > 0) return `${inProgress} book${inProgress === 1 ? "" : "s"} waiting for you today.`;
  return "Your shelf is growing — nice work.";
}

type DashboardHeroProps = {
  streak?: number;
  longestStreak?: number;
  averageCompletion?: number;
  completionRate?: number;
  inProgressCount?: number;
};

export default function DashboardHero({
  streak = 0,
  longestStreak = 0,
  averageCompletion = 0,
  completionRate = 0,
  inProgressCount = 0,
}: DashboardHeroProps) {
  const [name, setName] = useState("Reader");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (!raw) return;
      const user = JSON.parse(raw);
      if (user?.profile?.firstName) setName(user.profile.firstName);
      else if (user?.username) setName(user.username);
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      sx={{
        position: "relative",
        borderRadius: 0,
        overflow: "hidden",
        mb: 3,
        background: `linear-gradient(135deg, ${DASH.dark} 0%, ${DASH.wineDark} 55%, #4A2525 100%)`,
        boxShadow: "0 12px 40px rgba(30, 22, 18, 0.18)",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 80% 60% at 100% 0%, rgba(201,169,98,0.18) 0%, transparent 55%)",
          pointerEvents: "none",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: -40,
          right: -40,
          width: 200,
          height: 200,
          borderRadius: 0,
          bgcolor: alpha(DASH.gold, 0.06),
          pointerEvents: "none",
        }}
      />

      <Box
        sx={{
          position: "relative",
          p: { xs: 3, md: 4 },
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "flex-start", md: "center" },
          justifyContent: "space-between",
          gap: 3,
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Chip
            label="Your reading hub"
            size="small"
            sx={{
              mb: 1.5,
              height: 24,
              bgcolor: alpha(DASH.gold, 0.15),
              color: DASH.gold,
              border: `1px solid ${alpha(DASH.gold, 0.35)}`,
              fontFamily: DASH.font,
              fontWeight: 600,
              fontSize: "0.7rem",
              letterSpacing: "0.04em",
            }}
          />
          <Typography
            component="h1"
            sx={{
              fontFamily: DASH.serif,
              fontWeight: 700,
              fontSize: { xs: "1.65rem", md: "2.1rem" },
              color: DASH.cream,
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
              mb: 0.75,
            }}
          >
            {getGreeting()}, {name}
          </Typography>
          <Typography
            sx={{
              fontFamily: DASH.font,
              fontSize: "0.9rem",
              color: alpha(DASH.cream, 0.72),
              maxWidth: 420,
            }}
          >
            {getMotivation(streak, inProgressCount)}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1.5,
            alignItems: "center",
          }}
        >
          {streak > 0 && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.25,
                px: 2,
                py: 1.25,
                borderRadius: 0,
                bgcolor: alpha("#FF6B35", 0.15),
                border: `1px solid ${alpha("#FF6B35", 0.35)}`,
              }}
            >
              <LocalFireDepartment sx={{ color: "#FF8C5A", fontSize: 28 }} />
              <Box>
                <Typography
                  sx={{
                    fontFamily: DASH.serif,
                    fontWeight: 700,
                    fontSize: "1.5rem",
                    color: DASH.cream,
                    lineHeight: 1,
                  }}
                >
                  {streak}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: DASH.font,
                    fontSize: "0.7rem",
                    color: alpha(DASH.cream, 0.65),
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  day streak
                </Typography>
              </Box>
            </Box>
          )}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.25,
              px: 2,
              py: 1.25,
              borderRadius: 0,
              bgcolor: alpha(DASH.cream, 0.08),
              border: `1px solid ${alpha(DASH.cream, 0.12)}`,
            }}
          >
            <TrendingUp sx={{ color: DASH.green, fontSize: 26 }} />
            <Box>
              <Typography
                sx={{
                  fontFamily: DASH.serif,
                  fontWeight: 700,
                  fontSize: "1.5rem",
                  color: DASH.cream,
                  lineHeight: 1,
                }}
              >
                {averageCompletion}%
              </Typography>
              <Typography
                sx={{
                  fontFamily: DASH.font,
                  fontSize: "0.7rem",
                  color: alpha(DASH.cream, 0.65),
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                avg progress
              </Typography>
            </Box>
          </Box>

          {completionRate > 0 && (
            <Box
              sx={{
                px: 2,
                py: 1.25,
                borderRadius: 0,
                bgcolor: alpha(DASH.green, 0.12),
                border: `1px solid ${alpha(DASH.green, 0.3)}`,
                textAlign: "center",
              }}
            >
              <Typography
                sx={{
                  fontFamily: DASH.serif,
                  fontWeight: 700,
                  fontSize: "1.5rem",
                  color: DASH.green,
                  lineHeight: 1,
                }}
              >
                {completionRate}%
              </Typography>
              <Typography
                sx={{
                  fontFamily: DASH.font,
                  fontSize: "0.7rem",
                  color: alpha(DASH.cream, 0.65),
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                finished
              </Typography>
            </Box>
          )}
        </Box>

        <Button
          component={Link}
          href="/books/inProgress"
          variant="contained"
          startIcon={<Add />}
          endIcon={<ArrowForward sx={{ fontSize: "16px !important" }} />}
          sx={{
            textTransform: "none",
            fontFamily: DASH.font,
            fontWeight: 600,
            fontSize: "0.875rem",
            bgcolor: DASH.gold,
            color: DASH.dark,
            px: 2.5,
            py: 1.1,
            borderRadius: 0,
            boxShadow: "none",
            flexShrink: 0,
            alignSelf: { xs: "stretch", md: "center" },
            "&:hover": { bgcolor: "#D4B872", boxShadow: "none" },
          }}
        >
          Add book
        </Button>
      </Box>

      {longestStreak > streak && streak > 0 && (
        <Box
          sx={{
            px: { xs: 3, md: 4 },
            pb: 2,
            pt: 0,
            position: "relative",
          }}
        >
          <Typography
            sx={{
              fontFamily: DASH.font,
              fontSize: "0.75rem",
              color: alpha(DASH.cream, 0.45),
            }}
          >
            Personal best: {longestStreak} days
          </Typography>
        </Box>
      )}
    </Box>
  );
}
