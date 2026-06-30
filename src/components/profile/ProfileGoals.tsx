"use client";

import { Box, Typography, Chip, LinearProgress, alpha } from "@mui/material";
import { DASH } from "@/components/dashboard/dashboardTheme";
import ProfileSection from "./ProfileSection";

type Goal = {
  _id?: string;
  type?: string;
  target?: number;
  progress?: number;
  completed?: boolean;
  endDate?: string;
  timeFrame?: string;
  timeframe?: string;
};

function formatDate(dateStr?: string) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

function goalLabel(goal: Goal) {
  const type = goal.type ?? "reading";
  const frame = goal.timeFrame ?? goal.timeframe ?? "custom";
  return `${type} · ${frame}`;
}

export default function ProfileGoals({ goals }: { goals: Goal[] }) {
  const active = goals.filter((g) => !g.completed);
  const completed = goals.filter((g) => g.completed);

  return (
    <ProfileSection title="Reading goals" accent="#3B82F6">
      {goals.length === 0 ? (
        <Typography
          sx={{
            fontFamily: DASH.font,
            fontSize: "0.8125rem",
            color: alpha(DASH.dark, 0.45),
            fontStyle: "italic",
          }}
        >
          No goals set yet. Add one from any book you&apos;re reading.
        </Typography>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {active.length > 0 && (
            <Box>
              <Typography
                sx={{
                  fontFamily: DASH.font,
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  color: alpha(DASH.dark, 0.45),
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  mb: 1,
                }}
              >
                Active ({active.length})
              </Typography>
              {active.map((goal, i) => (
                <GoalRow key={goal._id ?? i} goal={goal} />
              ))}
            </Box>
          )}
          {completed.length > 0 && (
            <Box>
              <Typography
                sx={{
                  fontFamily: DASH.font,
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  color: alpha(DASH.dark, 0.45),
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  mb: 1,
                }}
              >
                Completed ({completed.length})
              </Typography>
              {completed.map((goal, i) => (
                <GoalRow key={goal._id ?? `done-${i}`} goal={goal} done />
              ))}
            </Box>
          )}
        </Box>
      )}
    </ProfileSection>
  );
}

function GoalRow({ goal, done = false }: { goal: Goal; done?: boolean }) {
  const progress = goal.progress ?? 0;
  const target = goal.target ?? 1;
  const pct = Math.min(100, Math.round((progress / target) * 100));

  return (
    <Box
      sx={{
        p: 1.5,
        mb: 1,
        border: `1px solid ${alpha(DASH.wine, 0.1)}`,
        bgcolor: done ? alpha(DASH.green, 0.03) : "#FFFFFF",
        "&:last-child": { mb: 0 },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 1,
          mb: 0.75,
        }}
      >
        <Typography
          sx={{
            fontFamily: DASH.font,
            fontWeight: 600,
            fontSize: "0.8125rem",
            color: DASH.dark,
            textTransform: "capitalize",
          }}
        >
          {goalLabel(goal)}
        </Typography>
        {done && (
          <Chip
            label="Done"
            size="small"
            sx={{
              height: 20,
              fontSize: "0.65rem",
              fontFamily: DASH.font,
              borderRadius: 0,
              bgcolor: alpha(DASH.green, 0.12),
              color: DASH.green,
            }}
          />
        )}
      </Box>
      <Typography
        sx={{
          fontFamily: DASH.font,
          fontSize: "0.75rem",
          color: alpha(DASH.dark, 0.5),
          mb: 0.75,
        }}
      >
        {progress} / {target} · due {formatDate(goal.endDate)}
      </Typography>
      <LinearProgress
        variant="determinate"
        value={pct}
        sx={{
          height: 4,
          bgcolor: alpha(DASH.wine, 0.08),
          "& .MuiLinearProgress-bar": {
            bgcolor: done ? DASH.green : DASH.wine,
          },
        }}
      />
    </Box>
  );
}
