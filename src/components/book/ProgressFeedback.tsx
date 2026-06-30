"use client";

import { Box, Typography, Chip, alpha } from "@mui/material";
import { EmojiEvents, LocalFireDepartment, TrendingUp } from "@mui/icons-material";
import type { RichProgressResponse } from "@/types/books";
import { DASH } from "@/components/dashboard/dashboardTheme";
import { ACHIEVEMENT_LEVEL_COLORS } from "@/components/dashboard/bookCoverColor";

type ProgressFeedbackProps = {
  result: RichProgressResponse | null;
};

export default function ProgressFeedback({ result }: ProgressFeedbackProps) {
  if (!result) return null;

  const achievements = result.achievementsUnlocked ?? [];
  const goalsDone = result.goalsCompleted ?? [];
  const streak = result.streak;
  const insights = result.insights;

  const hasContent =
    achievements.length > 0 ||
    goalsDone.length > 0 ||
    streak?.isNewRecord ||
    (insights?.paceToFinishLabel && insights.pagesLoggedThisUpdate > 0);

  if (!hasContent) return null;

  return (
    <Box
      sx={{
        mt: 2,
        p: 2,
        border: `1px solid ${alpha(DASH.gold, 0.25)}`,
        bgcolor: alpha(DASH.gold, 0.06),
        display: "flex",
        flexDirection: "column",
        gap: 1.25,
      }}
    >
      <Typography sx={{ fontFamily: DASH.font, fontWeight: 700, fontSize: "0.875rem", color: DASH.dark }}>
        Great work!
      </Typography>

      {insights?.paceToFinishLabel && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <TrendingUp sx={{ fontSize: 18, color: DASH.wine }} />
          <Typography sx={{ fontFamily: DASH.font, fontSize: "0.8125rem", color: alpha(DASH.dark, 0.7) }}>
            Finish in {insights.paceToFinishLabel}
          </Typography>
        </Box>
      )}

      {streak && streak.current > 0 && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <LocalFireDepartment sx={{ fontSize: 18, color: "#FF6B35" }} />
          <Typography sx={{ fontFamily: DASH.font, fontSize: "0.8125rem", color: alpha(DASH.dark, 0.7) }}>
            {streak.current}-day streak{streak.isNewRecord ? " — new personal best!" : ""}
          </Typography>
        </Box>
      )}

      {achievements.map((a) => {
        const color = ACHIEVEMENT_LEVEL_COLORS[a.level] ?? DASH.gold;
        return (
          <Box key={a.id} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <EmojiEvents sx={{ fontSize: 18, color }} />
            <Typography sx={{ fontFamily: DASH.font, fontSize: "0.8125rem", color: DASH.dark }}>
              Unlocked: {a.title}
            </Typography>
            <Chip label={a.level} size="small" sx={{ height: 20, fontSize: "0.65rem", bgcolor: alpha(color, 0.15), color }} />
          </Box>
        );
      })}

      {goalsDone.map((g) => (
        <Typography key={g.id} sx={{ fontFamily: DASH.font, fontSize: "0.8125rem", color: alpha(DASH.dark, 0.7) }}>
          Goal completed: {g.type} ({g.progress}/{g.target})
        </Typography>
      ))}
    </Box>
  );
}
