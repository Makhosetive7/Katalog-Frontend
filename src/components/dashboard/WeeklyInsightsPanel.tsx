"use client";

import Link from "next/link";
import {
  Box,
  Grid,
  Typography,
  Button,
  Chip,
  LinearProgress,
  alpha,
  Skeleton,
} from "@mui/material";
import {
  AutoStories,
  WarningAmber,
  TrendingUp,
  TrendingDown,
  Remove,
  ArrowForward,
  EmojiEvents,
  Flag,
} from "@mui/icons-material";
import { useGetWeeklyInsightsQuery } from "@/redux/api/books";
import DashboardSection from "@/components/dashboard/DashboardSection";
import DashboardMiniStat from "@/components/dashboard/DashboardMiniStat";
import { BookThumb } from "@/components/dashboard/BookThumb";
import { DASH, dashChipSx, flatProgressSx } from "@/components/dashboard/dashboardTheme";

function changeLabel(percent: number) {
  if (percent > 0) return `+${percent}% vs last week`;
  if (percent < 0) return `${percent}% vs last week`;
  return "Same as last week";
}

function ChangeIcon({ percent }: { percent: number }) {
  if (percent > 0) return <TrendingUp sx={{ fontSize: 16 }} />;
  if (percent < 0) return <TrendingDown sx={{ fontSize: 16 }} />;
  return <Remove sx={{ fontSize: 16 }} />;
}

export default function WeeklyInsightsPanel() {
  const { data, isLoading, isError } = useGetWeeklyInsightsQuery();

  if (isLoading) {
    return <Skeleton variant="rectangular" height={280} sx={{ borderRadius: 0, height: "100%", minHeight: 280 }} />;
  }

  if (isError || !data) return null;

  const change = data.summary.pagesChangePercent;
  const changeColor = change > 0 ? DASH.green : change < 0 ? "#B84A4A" : alpha(DASH.dark, 0.45);

  return (
    <DashboardSection
      title="This week"
      subtitle="Your last 7 days at a glance"
      action={
        <Button
          component={Link}
          href="/books/inProgress"
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
          Log progress
        </Button>
      }
    >
      <Grid container spacing={1.25} sx={{ mb: 2 }}>
        <Grid size={{ xs: 6, sm: 3 }}>
          <DashboardMiniStat
            label="Pages read"
            value={data.summary.pagesRead}
            accent={DASH.wine}
            hint={changeLabel(change)}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <DashboardMiniStat
            label="Active days"
            value={data.summary.activeDays}
            accent={DASH.gold}
            hint="out of 7"
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <DashboardMiniStat
            label="Sessions"
            value={data.summary.sessionsCount}
            accent="#8B4A4A"
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <DashboardMiniStat
            label="In progress"
            value={data.summary.booksInProgress}
            accent={DASH.green}
          />
        </Grid>
      </Grid>

      {data.narratives.length > 0 && (
        <Box
          sx={{
            p: 1.75,
            mb: 2,
            bgcolor: alpha(DASH.wine, 0.03),
            border: `1px solid ${alpha(DASH.wine, 0.08)}`,
            borderLeft: `3px solid ${DASH.wine}`,
          }}
        >
          {data.narratives.map((line, i) => (
            <Box
              key={i}
              sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 1,
                mb: i < data.narratives.length - 1 ? 0.75 : 0,
              }}
            >
              {i === 1 && change !== 0 && (
                <Box sx={{ color: changeColor, mt: 0.15, flexShrink: 0 }}>
                  <ChangeIcon percent={change} />
                </Box>
              )}
              <Typography
                sx={{
                  fontFamily: DASH.font,
                  fontSize: "0.8125rem",
                  color: alpha(DASH.dark, 0.72),
                  lineHeight: 1.55,
                }}
              >
                {line}
              </Typography>
            </Box>
          ))}
        </Box>
      )}

      {data.streak?.atRisk && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.25,
            p: 1.5,
            mb: 2,
            bgcolor: alpha("#FF6B35", 0.08),
            border: `1px solid ${alpha("#FF6B35", 0.22)}`,
            borderTop: `3px solid #FF6B35`,
          }}
        >
          <WarningAmber sx={{ color: "#FF6B35", fontSize: 22, flexShrink: 0 }} />
          <Box>
            <Typography sx={{ fontFamily: DASH.font, fontWeight: 600, fontSize: "0.85rem", color: DASH.dark }}>
              Streak at risk
            </Typography>
            <Typography sx={{ fontFamily: DASH.font, fontSize: "0.78rem", color: alpha(DASH.dark, 0.55) }}>
              Log reading today to keep your {data.streak.current}-day streak alive.
            </Typography>
          </Box>
        </Box>
      )}

      {data.goalsDueSoon.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography
            sx={{
              fontFamily: DASH.font,
              fontWeight: 600,
              fontSize: "0.75rem",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: alpha(DASH.dark, 0.45),
              mb: 1,
            }}
          >
            Goals due soon
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {data.goalsDueSoon.slice(0, 2).map((goal) => {
              const pct = goal.target > 0 ? Math.round((goal.progress / goal.target) * 100) : 0;
              return (
                <Box
                  key={goal.id}
                  sx={{
                    p: 1.25,
                    border: `1px solid ${alpha(DASH.wine, 0.08)}`,
                    borderLeft: `3px solid ${DASH.gold}`,
                    bgcolor: alpha(DASH.gold, 0.04),
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.75 }}>
                    <Flag sx={{ fontSize: 16, color: DASH.gold }} />
                    <Typography sx={{ fontFamily: DASH.font, fontWeight: 600, fontSize: "0.8rem", color: DASH.dark }}>
                      {goal.type} goal · {goal.progress}/{goal.target}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(pct, 100)}
                    sx={{
                      height: 4,
                      bgcolor: alpha(DASH.wine, 0.08),
                      ...flatProgressSx,
                      "& .MuiLinearProgress-bar": {
                        ...flatProgressSx["& .MuiLinearProgress-bar"],
                        bgcolor: DASH.gold,
                      },
                    }}
                  />
                </Box>
              );
            })}
          </Box>
        </Box>
      )}

      {data.continueReading.length > 0 && (
        <Box>
          <Typography
            sx={{
              fontFamily: DASH.font,
              fontWeight: 600,
              fontSize: "0.75rem",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: alpha(DASH.dark, 0.45),
              mb: 1,
            }}
          >
            Pick up where you left off
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {data.continueReading.slice(0, 3).map((book) => {
              const progress = book.completionPercentage ?? 0;
              return (
                <Box
                  key={book.id}
                  component={Link}
                  href="/books/inProgress"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.25,
                    p: 1.25,
                    textDecoration: "none",
                    border: `1px solid ${alpha(DASH.wine, 0.08)}`,
                    bgcolor: "#FFFFFF",
                    transition: "border-color 0.15s ease, bgcolor 0.15s ease",
                    "&:hover": {
                      borderColor: alpha(DASH.wine, 0.18),
                      bgcolor: alpha(DASH.wine, 0.02),
                    },
                  }}
                >
                  <BookThumb title={book.title} size="sm" />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      noWrap
                      sx={{ fontFamily: DASH.font, fontWeight: 600, fontSize: "0.8125rem", color: DASH.dark }}
                    >
                      {book.title}
                    </Typography>
                    <Typography
                      noWrap
                      sx={{ fontFamily: DASH.font, fontSize: "0.7rem", color: alpha(DASH.dark, 0.45), mb: 0.5 }}
                    >
                      {book.author}
                      {book.pages ? ` · ${book.currentPage}/${book.pages} pg` : ""}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(progress, 100)}
                      sx={{
                        height: 4,
                        bgcolor: alpha(DASH.wine, 0.07),
                        ...flatProgressSx,
                        "& .MuiLinearProgress-bar": {
                          ...flatProgressSx["& .MuiLinearProgress-bar"],
                          bgcolor: progress >= 100 ? DASH.green : DASH.wine,
                        },
                      }}
                    />
                  </Box>
                  <Typography
                    sx={{
                      fontFamily: DASH.font,
                      fontWeight: 700,
                      fontSize: "0.75rem",
                      color: DASH.wine,
                      flexShrink: 0,
                    }}
                  >
                    {progress}%
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Box>
      )}

      {data.recentAchievements.length > 0 && (
        <Box sx={{ mt: 2, pt: 2, borderTop: `1px solid ${alpha(DASH.wine, 0.08)}` }}>
          <Typography
            sx={{
              fontFamily: DASH.font,
              fontWeight: 600,
              fontSize: "0.75rem",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: alpha(DASH.dark, 0.45),
              mb: 1,
            }}
          >
            Recent wins
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
            {data.recentAchievements.map((a, i) => (
              <Chip
                key={`${a.title}-${i}`}
                icon={<EmojiEvents sx={{ fontSize: "14px !important" }} />}
                label={a.title}
                size="small"
                sx={{
                  fontFamily: DASH.font,
                  fontSize: "0.72rem",
                  bgcolor: alpha(DASH.gold, 0.12),
                  color: DASH.dark,
                  ...dashChipSx,
                }}
              />
            ))}
          </Box>
        </Box>
      )}
    </DashboardSection>
  );
}
