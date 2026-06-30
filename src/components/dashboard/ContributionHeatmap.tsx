"use client";

import { Box, Typography, Tooltip, alpha, Skeleton, useMediaQuery, useTheme } from "@mui/material";
import { DASH } from "./dashboardTheme";
import DashboardSection from "./DashboardSection";
import {
  buildHeatmapWeeks,
  formatHeatmapTooltip,
  getIntensityLevel,
  getMonthLabelPositions,
  toDateKey,
} from "./heatmapUtils";

export type ActivityDay = {
  date: string;
  sessions: number;
  pages: number;
  progressUpdates?: number;
  notesAdded?: number;
  booksStarted?: number;
  booksCompleted?: number;
};

export type ActivityHeatmapStats = {
  totalActiveDays: number;
  totalSessions: number;
  totalPages: number;
  totalProgressUpdates?: number;
  totalNotes?: number;
  totalBooksCompleted?: number;
  longestStreak: number;
};

type ContributionHeatmapProps = {
  year: number;
  days: ActivityDay[];
  stats?: ActivityHeatmapStats;
  isLoading?: boolean;
};

const DESKTOP_CELL_SIZE = 13;
const DESKTOP_CELL_GAP = 3;
const MOBILE_CELL_SIZE = 9;
const MOBILE_CELL_GAP = 2;
const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function intensityColor(level: 0 | 1 | 2 | 3 | 4, inYear: boolean, isFuture: boolean) {
  if (!inYear) return alpha(DASH.dark, 0.03);
  if (isFuture) return alpha(DASH.wine, 0.05);

  const greens = [
    alpha(DASH.wine, 0.08),
    alpha(DASH.green, 0.28),
    alpha(DASH.green, 0.48),
    alpha(DASH.green, 0.68),
    DASH.green,
  ];

  return greens[level];
}

function MonthLabels({
  year,
  cellSize,
  cellGap,
  labelOffset,
}: {
  year: number;
  cellSize: number;
  cellGap: number;
  labelOffset: number;
}) {
  const positions = getMonthLabelPositions(year);
  const colWidth = cellSize + cellGap;

  return (
    <Box
      sx={{
        position: "relative",
        height: { xs: 14, sm: 18 },
        mb: 0.75,
        ml: `${labelOffset}px`,
        minWidth: positions.length * colWidth,
      }}
    >
      {positions.map(({ label, weekIndex }, index) => {
        const nextWeek = positions[index + 1]?.weekIndex;
        const span = nextWeek !== undefined ? nextWeek - weekIndex : 5;
        if (span < 2 && index > 0) return null;

        return (
          <Typography
            key={label}
            sx={{
              position: "absolute",
              left: weekIndex * colWidth,
              fontSize: { xs: 9, sm: 11 },
              fontFamily: DASH.font,
              fontWeight: 600,
              color: alpha(DASH.dark, 0.55),
              letterSpacing: "0.02em",
              whiteSpace: "nowrap",
            }}
          >
            {label}
          </Typography>
        );
      })}
    </Box>
  );
}

export default function ContributionHeatmap({
  year,
  days,
  stats,
  isLoading,
}: ContributionHeatmapProps) {
  const theme = useTheme();
  const isCompact = useMediaQuery(theme.breakpoints.down("sm"));
  const cellSize = isCompact ? MOBILE_CELL_SIZE : DESKTOP_CELL_SIZE;
  const cellGap = isCompact ? MOBILE_CELL_GAP : DESKTOP_CELL_GAP;
  const labelOffset = isCompact ? 22 : 28;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dayMap = new Map(days.map((d) => [d.date, d]));
  const weeks = buildHeatmapWeeks(year);
  const weekCount = weeks.length;

  if (isLoading) {
    return (
      <DashboardSection title={`Reading activity · ${year}`} subtitle="Loading your reading history…">
        <Skeleton variant="rectangular" height={140} sx={{ borderRadius: 0 }} />
      </DashboardSection>
    );
  }

  const subtitle = stats
    ? [
        `${stats.totalActiveDays} active day${stats.totalActiveDays === 1 ? "" : "s"}`,
        stats.totalProgressUpdates
          ? `${stats.totalProgressUpdates} progress update${stats.totalProgressUpdates === 1 ? "" : "s"}`
          : null,
        stats.totalNotes ? `${stats.totalNotes} note${stats.totalNotes === 1 ? "" : "s"}` : null,
        `${stats.totalPages.toLocaleString()} pages logged`,
      ]
        .filter(Boolean)
        .join(" · ")
    : "Track progress, notes, and reading sessions — one square per day";

  return (
    <DashboardSection title={`Reading activity · ${year}`} subtitle={subtitle}>
      <Box
        sx={{
          overflowX: "auto",
          pb: 1,
          mx: { xs: -1, md: 0 },
          px: { xs: 1, md: 0 },
        }}
      >
        <Box sx={{ minWidth: weekCount * (cellSize + cellGap) + labelOffset }}>
          <MonthLabels year={year} cellSize={cellSize} cellGap={cellGap} labelOffset={labelOffset} />

          <Box sx={{ display: "flex", alignItems: "flex-start" }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateRows: `repeat(7, ${cellSize}px)`,
                rowGap: `${cellGap}px`,
                mr: 1,
                pt: 0,
                minWidth: labelOffset,
              }}
            >
              {DAY_LABELS.map((label, i) => (
                <Typography
                  key={label}
                  sx={{
                    fontSize: { xs: 8, sm: 10 },
                    fontFamily: DASH.font,
                    fontWeight: 500,
                    color: alpha(DASH.dark, 0.45),
                    lineHeight: `${cellSize}px`,
                    textAlign: "right",
                    pr: 0.5,
                    visibility: i % 2 === 0 ? "visible" : "hidden",
                  }}
                >
                  {label}
                </Typography>
              ))}
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: `repeat(${weekCount}, ${cellSize}px)`,
                gridTemplateRows: `repeat(7, ${cellSize}px)`,
                columnGap: `${cellGap}px`,
                rowGap: `${cellGap}px`,
              }}
            >
              {weeks.flatMap((week, colIndex) =>
                week.map((date) => {
                  const inYear = date.getFullYear() === year;
                  const isFuture = date > today;
                  const key = toDateKey(date);
                  const activity = dayMap.get(key);
                  const sessions = activity?.sessions ?? 0;
                  const level = getIntensityLevel(sessions);
                  const rowIndex = date.getDay();
                  const color = intensityColor(level, inYear, isFuture);
                  const tooltipActivity = {
                    sessions,
                    pages: activity?.pages ?? 0,
                    progressUpdates: activity?.progressUpdates,
                    notesAdded: activity?.notesAdded,
                    booksStarted: activity?.booksStarted,
                    booksCompleted: activity?.booksCompleted,
                  };

                  return (
                    <Tooltip
                      key={`${colIndex}-${key}`}
                      title={formatHeatmapTooltip(date, tooltipActivity)}
                      arrow
                      placement="top"
                    >
                      <Box
                        sx={{
                          width: cellSize,
                          height: cellSize,
                          bgcolor: color,
                          borderRadius: 0,
                          gridColumnStart: colIndex + 1,
                          gridRowStart: rowIndex + 1,
                          border: `1px solid ${alpha(DASH.dark, inYear && !isFuture ? 0.04 : 0.02)}`,
                          opacity: inYear ? 1 : 0.25,
                          cursor: inYear && !isFuture ? "pointer" : "default",
                          transition: "transform 0.1s ease, box-shadow 0.1s ease",
                          "&:hover":
                            inYear && !isFuture
                              ? {
                                  transform: isCompact ? "scale(1.15)" : "scale(1.2)",
                                  boxShadow: `0 0 0 2px ${alpha(DASH.wine, 0.25)}`,
                                  zIndex: 1,
                                }
                              : {},
                        }}
                      />
                    </Tooltip>
                  );
                })
              )}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Legend */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
          mt: 2.5,
          pt: 2,
          borderTop: `1px solid ${alpha(DASH.wine, 0.08)}`,
        }}
      >
        {stats && (
          <Typography sx={{ fontFamily: DASH.font, fontSize: "0.75rem", color: alpha(DASH.dark, 0.5) }}>
            Longest streak: <strong>{stats.longestStreak} days</strong>
          </Typography>
        )}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, ml: "auto" }}>
          <Typography sx={{ fontFamily: DASH.font, fontSize: "0.7rem", color: alpha(DASH.dark, 0.45) }}>
            Less
          </Typography>
          {[0, 1, 2, 3, 4].map((level) => (
            <Box
              key={level}
              sx={{
                width: { xs: MOBILE_CELL_SIZE, sm: DESKTOP_CELL_SIZE },
                height: { xs: MOBILE_CELL_SIZE, sm: DESKTOP_CELL_SIZE },
                borderRadius: 0,
                bgcolor: intensityColor(level as 0 | 1 | 2 | 3 | 4, true, false),
                border: `1px solid ${alpha(DASH.dark, 0.04)}`,
              }}
            />
          ))}
          <Typography sx={{ fontFamily: DASH.font, fontSize: "0.7rem", color: alpha(DASH.dark, 0.45) }}>
            More
          </Typography>
        </Box>
      </Box>
    </DashboardSection>
  );
}
