"use client";

import { Box, Typography, Chip, alpha } from "@mui/material";
import { EmojiEvents } from "@mui/icons-material";
import { DASH } from "@/components/dashboard/dashboardTheme";
import { ACHIEVEMENT_LEVEL_COLORS } from "@/components/dashboard/bookCoverColor";
import ProfileSection from "./ProfileSection";

type Achievement = {
  _id?: string;
  title?: string;
  name?: string;
  description?: string;
  level?: string;
  earnedAt?: string;
  achievedAt?: string;
};

function formatDate(dateStr?: string) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ProfileAchievements({
  achievements,
}: {
  achievements: Achievement[];
}) {
  const sorted = [...achievements].sort((a, b) => {
    const aTime = new Date(a.earnedAt ?? a.achievedAt ?? 0).getTime();
    const bTime = new Date(b.earnedAt ?? b.achievedAt ?? 0).getTime();
    return bTime - aTime;
  });

  return (
    <ProfileSection title="Achievements" accent={DASH.gold}>
      {sorted.length === 0 ? (
        <Typography
          sx={{
            fontFamily: DASH.font,
            fontSize: "0.8125rem",
            color: alpha(DASH.dark, 0.45),
            fontStyle: "italic",
          }}
        >
          No achievements yet — keep reading to earn badges.
        </Typography>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
          {sorted.map((achievement, i) => {
            const levelColor =
              ACHIEVEMENT_LEVEL_COLORS[achievement.level ?? "beginner"] ?? DASH.gold;
            const date = achievement.earnedAt ?? achievement.achievedAt;

            return (
              <Box
                key={achievement._id ?? i}
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 1.5,
                  p: 1.5,
                  border: `1px solid ${alpha(levelColor, 0.15)}`,
                  bgcolor: alpha(levelColor, 0.04),
                }}
              >
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: alpha(levelColor, 0.12),
                  }}
                >
                  <EmojiEvents sx={{ color: levelColor, fontSize: 20 }} />
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.75,
                      flexWrap: "wrap",
                      mb: 0.25,
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: DASH.font,
                        fontWeight: 600,
                        fontSize: "0.875rem",
                        color: DASH.dark,
                      }}
                    >
                      {achievement.title ?? achievement.name ?? "Achievement"}
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
                          borderRadius: 0,
                          bgcolor: alpha(levelColor, 0.12),
                          color: levelColor,
                        }}
                      />
                    )}
                  </Box>
                  {achievement.description && (
                    <Typography
                      sx={{
                        fontFamily: DASH.font,
                        fontSize: "0.75rem",
                        color: alpha(DASH.dark, 0.55),
                        lineHeight: 1.45,
                      }}
                    >
                      {achievement.description}
                    </Typography>
                  )}
                  {date && (
                    <Typography
                      sx={{
                        fontFamily: DASH.font,
                        fontSize: "0.68rem",
                        color: alpha(DASH.dark, 0.38),
                        mt: 0.35,
                      }}
                    >
                      Earned {formatDate(date)}
                    </Typography>
                  )}
                </Box>
              </Box>
            );
          })}
        </Box>
      )}
    </ProfileSection>
  );
}
