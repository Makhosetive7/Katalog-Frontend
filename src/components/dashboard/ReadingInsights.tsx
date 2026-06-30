"use client";

import Link from "next/link";
import { Box, Typography, Chip, Button, alpha } from "@mui/material";
import {
  LocalFireDepartment,
  EmojiEvents,
  ArrowForward,
  Whatshot,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { DASH, dashChipSx } from "./dashboardTheme";
import { ACHIEVEMENT_LEVEL_COLORS } from "./bookCoverColor";
import DashboardSection from "./DashboardSection";

type Achievement = {
  _id?: string;
  title?: string;
  description?: string;
  level?: string;
  earnedAt?: string;
  type?: string;
};

type ReadingInsightsProps = {
  streak?: {
    currentStreak?: number;
    longestStreak?: number;
    lastReadingDate?: string;
  } | null;
  achievements?: Achievement[];
};

function formatRelativeDate(dateStr?: string) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const diff = Date.now() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function ReadingInsights({
  streak,
  achievements = [],
}: ReadingInsightsProps) {
  const currentStreak = streak?.currentStreak ?? 0;
  const longestStreak = streak?.longestStreak ?? 0;
  const recentAchievements = [...achievements]
    .sort((a, b) => {
      const aTime = new Date(a.earnedAt ?? 0).getTime();
      const bTime = new Date(b.earnedAt ?? 0).getTime();
      return bTime - aTime;
    })
    .slice(0, 4);

  const hasStreak = currentStreak > 0 || longestStreak > 0;
  const hasAchievements = recentAchievements.length > 0;

  if (!hasStreak && !hasAchievements) return null;

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: hasStreak && hasAchievements ? "1fr 1.6fr" : "1fr" },
        gap: 2,
        mb: 3,
      }}
    >
      {hasStreak && (
        <Box
          sx={{
            p: { xs: 2.5, md: 3 },
            borderRadius: 0,
            background: `linear-gradient(145deg, ${alpha("#FF6B35", 0.12)} 0%, ${alpha(DASH.wine, 0.06)} 100%)`,
            border: `1px solid ${alpha("#FF6B35", 0.2)}`,
            boxShadow: "0 4px 24px rgba(30, 22, 18, 0.04)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <Whatshot sx={{ color: "#FF6B35", fontSize: 22 }} />
            <Typography
              sx={{ fontFamily: DASH.font, fontWeight: 700, fontSize: "0.95rem", color: DASH.dark }}
            >
              Reading streak
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "baseline", gap: 1, mb: 1 }}>
            <Typography
              sx={{
                fontFamily: DASH.serif,
                fontWeight: 700,
                fontSize: "3rem",
                color: DASH.dark,
                lineHeight: 1,
              }}
            >
              {currentStreak}
            </Typography>
            <Typography
              sx={{ fontFamily: DASH.font, fontSize: "0.9rem", color: alpha(DASH.dark, 0.55) }}
            >
              days in a row
            </Typography>
          </Box>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
            <Chip
              icon={<LocalFireDepartment sx={{ fontSize: "16px !important" }} />}
              label={`Best: ${longestStreak} days`}
              size="small"
              sx={{
                fontFamily: DASH.font,
                fontSize: "0.75rem",
                bgcolor: alpha("#FF6B35", 0.12),
                color: "#C44D1A",
                border: "none",
                ...dashChipSx,
              }}
            />
            {streak?.lastReadingDate && (
              <Chip
                label={`Last read ${formatRelativeDate(streak.lastReadingDate)}`}
                size="small"
                sx={{
                  fontFamily: DASH.font,
                  fontSize: "0.75rem",
                  bgcolor: alpha(DASH.dark, 0.05),
                  color: alpha(DASH.dark, 0.6),
                  ...dashChipSx,
                }}
              />
            )}
          </Box>

          <Typography
            sx={{
              fontFamily: DASH.font,
              fontSize: "0.8125rem",
              color: alpha(DASH.dark, 0.5),
              lineHeight: 1.5,
            }}
          >
            {currentStreak >= 7
              ? "Consistency builds habits. You're doing great."
              : "Log progress today to keep your streak going."}
          </Typography>
        </Box>
      )}

      {hasAchievements && (
        <DashboardSection
          title="Recent achievements"
          subtitle={`${achievements.length} badge${achievements.length === 1 ? "" : "s"} earned`}
          action={
            <Button
              component={Link}
              href="/profile"
              size="small"
              endIcon={<ArrowForward sx={{ fontSize: "14px !important" }} />}
              sx={{
                textTransform: "none",
                fontFamily: DASH.font,
                fontSize: "0.8rem",
                fontWeight: 600,
                color: DASH.wine,
                minWidth: 0,
              }}
            >
              Profile
            </Button>
          }
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
            {recentAchievements.map((achievement, i) => {
              const levelColor =
                ACHIEVEMENT_LEVEL_COLORS[achievement.level ?? "beginner"] ??
                DASH.gold;

              return (
                <Box
                  key={achievement._id ?? i}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    p: 1.5,
                    borderRadius: 0,
                    bgcolor: alpha(levelColor, 0.06),
                    border: `1px solid ${alpha(levelColor, 0.15)}`,
                    transition: "transform 0.15s ease",
                    "&:hover": { transform: "translateX(4px)" },
                  }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: alpha(levelColor, 0.15),
                      flexShrink: 0,
                    }}
                  >
                    <EmojiEvents sx={{ color: levelColor, fontSize: 22 }} />
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                      <Typography
                        sx={{
                          fontFamily: DASH.font,
                          fontWeight: 600,
                          fontSize: "0.875rem",
                          color: DASH.dark,
                        }}
                      >
                        {achievement.title ?? "Achievement"}
                      </Typography>
                      {achievement.level && (
                        <Chip
                          label={achievement.level}
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: "0.65rem",
                            fontFamily: DASH.font,
                            fontWeight: 700,
                            textTransform: "capitalize",
                            bgcolor: alpha(levelColor, 0.15),
                            color: levelColor,
                            ...dashChipSx,
                          }}
                        />
                      )}
                    </Box>
                    {achievement.description && (
                      <Typography
                        sx={{
                          fontFamily: DASH.font,
                          fontSize: "0.75rem",
                          color: alpha(DASH.dark, 0.5),
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {achievement.description}
                      </Typography>
                    )}
                  </Box>
                  {achievement.earnedAt && (
                    <Typography
                      sx={{
                        fontFamily: DASH.font,
                        fontSize: "0.7rem",
                        color: alpha(DASH.dark, 0.4),
                        flexShrink: 0,
                      }}
                    >
                      {formatRelativeDate(achievement.earnedAt)}
                    </Typography>
                  )}
                </Box>
              );
            })}
          </Box>
        </DashboardSection>
      )}
    </Box>
  );
}
