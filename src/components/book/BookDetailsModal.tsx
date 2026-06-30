"use client";

import {
  Box,
  Typography,
  Chip,
  Grid,
  LinearProgress,
  CircularProgress,
  Alert,
  Button,
  alpha,
} from "@mui/material";
import {
  useGetBookProgressAnalyticsQuery,
  useGetReadingStatisticsQuery,
  useGetGoalStatisticsQuery,
} from "@/redux/api/books";
import AppModal from "./AppModal";
import { DASH } from "@/components/dashboard/dashboardTheme";
import { BookThumb, CircularProgressRing } from "@/components/dashboard/BookThumb";
import { getBookCoverColor } from "@/components/dashboard/bookCoverColor";
import { modalGhostButtonSx } from "./modalTheme";

type BookDetailsModalProps = {
  book: {
    id?: string;
    _id?: string;
    title?: string;
    author?: string;
    genre?: string | string[];
    status?: string;
    rating?: number;
    pages?: number | { current: number; total: number };
    totalChapters?: number;
    chapters?: number;
    coverImage?: string;
    imageUrl?: string;
    description?: string;
    user?: string;
    userId?: string;
  };
  open: boolean;
  onClose: () => void;
};

function resolvePageCount(
  pages?: number | { current: number; total: number },
  fallback?: number
): number | string {
  if (typeof pages === "number") return pages;
  if (pages && typeof pages === "object") return pages.total;
  return fallback ?? "—";
}

function DetailStat({
  label,
  value,
  accent = DASH.wine,
}: {
  label: string;
  value: string | number;
  accent?: string;
}) {
  return (
    <Box
      sx={{
        p: 1.75,
        textAlign: "center",
        border: `1px solid ${alpha(DASH.wine, 0.1)}`,
        borderTop: `3px solid ${accent}`,
        bgcolor: "#FFFFFF",
        height: "100%",
      }}
    >
      <Typography
        sx={{
          fontFamily: DASH.serif,
          fontWeight: 700,
          fontSize: "1.35rem",
          color: DASH.dark,
          lineHeight: 1,
          mb: 0.5,
        }}
      >
        {value}
      </Typography>
      <Typography
        sx={{
          fontFamily: DASH.font,
          fontSize: "0.68rem",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          color: alpha(DASH.dark, 0.5),
        }}
      >
        {label}
      </Typography>
    </Box>
  );
}

const STATUS_COLORS: Record<string, string> = {
  "In-Progress": DASH.wine,
  Completed: DASH.green,
  Planned: "#3B82F6",
  Dropped: DASH.gold,
};

export default function BookDetailsModal({
  book,
  open,
  onClose,
}: BookDetailsModalProps) {
  const bookId = book.id || book._id || "";
  const accent = getBookCoverColor(book.genre);
  const genres = Array.isArray(book.genre) ? book.genre : book.genre ? [book.genre] : [];
  const coverSrc = book.coverImage || book.imageUrl;

  const {
    data: analyticsData,
    isLoading: isLoadingAnalytics,
    error: analyticsError,
  } = useGetBookProgressAnalyticsQuery(bookId, { skip: !open || !bookId });

  const {
    data: readingStats,
    isLoading: isLoadingStats,
    error: statsError,
  } = useGetReadingStatisticsQuery(bookId, { skip: !open || !bookId });

  const { data: goalsStats, isLoading: isLoadingGoals } = useGetGoalStatisticsQuery(
    { userId: book.user || book.userId || "", bookId },
    { skip: !open || !bookId }
  );

  const analytics = analyticsData?.analytics;
  const bookDetails = analyticsData?.bookDetails;
  const readingData = readingStats?.reading;

  const completion = analytics?.completionPercentage ?? 0;
  const progressColor = completion >= 100 ? DASH.green : accent;

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <AppModal
      open={open}
      onClose={onClose}
      label="Details"
      title={bookDetails?.title || book.title || "Book details"}
      subtitle={bookDetails?.author || book.author || "Unknown author"}
      maxWidth="md"
      accent={accent}
      hideActions
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "flex-start",
            p: 2,
            border: `1px solid ${alpha(DASH.wine, 0.1)}`,
            bgcolor: alpha(accent, 0.03),
          }}
        >
          {coverSrc ? (
            <Box
              component="img"
              src={coverSrc}
              alt=""
              sx={{
                width: 56,
                height: 76,
                objectFit: "cover",
                flexShrink: 0,
                border: `1px solid ${alpha(accent, 0.2)}`,
              }}
            />
          ) : (
            <BookThumb
              title={book.title || "Book"}
              genre={book.genre}
              size="lg"
            />
          )}

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, mb: 1 }}>
              {book.status && (
                <Chip
                  label={book.status}
                  size="small"
                  sx={{
                    height: 24,
                    fontFamily: DASH.font,
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    borderRadius: 0,
                    bgcolor: alpha(STATUS_COLORS[book.status] ?? DASH.wine, 0.1),
                    color: STATUS_COLORS[book.status] ?? DASH.wine,
                  }}
                />
              )}
              {genres.map((genre) => (
                <Chip
                  key={genre}
                  label={genre}
                  size="small"
                  sx={{
                    height: 24,
                    fontFamily: DASH.font,
                    fontSize: "0.7rem",
                    borderRadius: 0,
                    bgcolor: alpha(accent, 0.08),
                    color: accent,
                    border: `1px solid ${alpha(accent, 0.15)}`,
                  }}
                />
              ))}
              {book.rating != null && book.rating > 0 && (
                <Chip
                  label={`${book.rating}/5`}
                  size="small"
                  sx={{
                    height: 24,
                    fontFamily: DASH.font,
                    fontSize: "0.7rem",
                    borderRadius: 0,
                  }}
                />
              )}
            </Box>

            <Typography
              sx={{
                fontFamily: DASH.font,
                fontSize: "0.8125rem",
                color: alpha(DASH.dark, 0.55),
                lineHeight: 1.5,
              }}
            >
              {resolvePageCount(book.pages, bookDetails?.pages)} pages
              {(book.totalChapters ?? book.chapters)
                ? ` · ${book.totalChapters ?? book.chapters} chapters`
                : ""}
            </Typography>
          </Box>

          <CircularProgressRing
            value={completion}
            color={progressColor}
            size={52}
          />
        </Box>

        <Box
          sx={{
            p: 2,
            border: `1px solid ${alpha(DASH.wine, 0.1)}`,
          }}
        >
          <Typography
            sx={{
              fontFamily: DASH.font,
              fontWeight: 600,
              fontSize: "0.8125rem",
              color: DASH.dark,
              mb: 1.25,
            }}
          >
            Current progress
          </Typography>

          {isLoadingAnalytics ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
              <CircularProgress size={22} sx={{ color: DASH.wine }} />
            </Box>
          ) : analyticsError ? (
            <Alert severity="warning" sx={{ borderRadius: 0, fontFamily: DASH.font }}>
              Progress data unavailable
            </Alert>
          ) : (
            <>
              <LinearProgress
                variant="determinate"
                value={Math.min(completion, 100)}
                sx={{
                  height: 4,
                  mb: 1.25,
                  bgcolor: alpha(DASH.wine, 0.08),
                  "& .MuiLinearProgress-bar": { bgcolor: progressColor },
                }}
              />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 2,
                  flexWrap: "wrap",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: DASH.font,
                    fontSize: "0.75rem",
                    color: alpha(DASH.dark, 0.55),
                  }}
                >
                  Page {analytics?.byPages?.current ?? 0} of{" "}
                  {analytics?.byPages?.total ?? resolvePageCount(book.pages)}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: DASH.font,
                    fontSize: "0.75rem",
                    color: alpha(DASH.dark, 0.55),
                  }}
                >
                  Chapter {analytics?.byChapters?.current ?? 0} of{" "}
                  {analytics?.byChapters?.total ?? book.chapters ?? "—"}
                </Typography>
              </Box>
            </>
          )}
        </Box>

        {(isLoadingStats || readingData) && (
          <Box>
            <Typography
              sx={{
                fontFamily: DASH.font,
                fontWeight: 600,
                fontSize: "0.8125rem",
                color: DASH.dark,
                mb: 1.25,
              }}
            >
              Reading stats
            </Typography>

            {isLoadingStats ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
                <CircularProgress size={22} sx={{ color: DASH.wine }} />
              </Box>
            ) : statsError ? (
              <Alert severity="warning" sx={{ borderRadius: 0, fontFamily: DASH.font }}>
                Stats unavailable
              </Alert>
            ) : readingData ? (
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <DetailStat
                    label="Pages read"
                    value={readingData.totalPagesRead ?? 0}
                    accent={DASH.wine}
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <DetailStat
                    label="Chapters read"
                    value={readingData.totalChaptersRead ?? 0}
                    accent={accent}
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <DetailStat
                    label="Pages / day"
                    value={readingData.pagesPerDay ?? "0"}
                    accent={DASH.gold}
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <DetailStat
                    label="Days tracked"
                    value={readingData.daysTracked ?? 0}
                    accent={DASH.green}
                  />
                </Grid>
              </Grid>
            ) : null}
          </Box>
        )}

        {(isLoadingGoals || goalsStats) && (
          <Box
            sx={{
              p: 2,
              border: `1px solid ${alpha(DASH.wine, 0.1)}`,
              bgcolor: alpha(DASH.gold, 0.04),
            }}
          >
            <Typography
              sx={{
                fontFamily: DASH.font,
                fontWeight: 600,
                fontSize: "0.8125rem",
                color: DASH.dark,
                mb: 1,
              }}
            >
              Goals
            </Typography>

            {isLoadingGoals ? (
              <CircularProgress size={20} sx={{ color: DASH.gold }} />
            ) : goalsStats ? (
              <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                <Typography sx={{ fontFamily: DASH.font, fontSize: "0.8125rem" }}>
                  <strong>{goalsStats.totalGoals ?? 0}</strong> total
                </Typography>
                <Typography
                  sx={{ fontFamily: DASH.font, fontSize: "0.8125rem", color: DASH.green }}
                >
                  <strong>{goalsStats.completedGoals ?? 0}</strong> completed
                </Typography>
                <Typography sx={{ fontFamily: DASH.font, fontSize: "0.8125rem" }}>
                  <strong>{goalsStats.activeGoals ?? 0}</strong> active
                </Typography>
                <Typography sx={{ fontFamily: DASH.font, fontSize: "0.8125rem" }}>
                  <strong>{goalsStats.avgCompletion ?? 0}%</strong> avg completion
                </Typography>
              </Box>
            ) : (
              <Typography
                sx={{
                  fontFamily: DASH.font,
                  fontSize: "0.8125rem",
                  color: alpha(DASH.dark, 0.5),
                }}
              >
                No goals set for this book yet.
              </Typography>
            )}
          </Box>
        )}

        {readingData?.estimatedCompletionDate && (
          <Typography
            sx={{
              fontFamily: DASH.font,
              fontSize: "0.8125rem",
              color: alpha(DASH.dark, 0.55),
            }}
          >
            Estimated finish: {formatDate(readingData.estimatedCompletionDate)}
          </Typography>
        )}

        {book.description && (
          <Box>
            <Typography
              sx={{
                fontFamily: DASH.font,
                fontWeight: 600,
                fontSize: "0.8125rem",
                color: DASH.dark,
                mb: 0.75,
              }}
            >
              Description
            </Typography>
            <Typography
              sx={{
                fontFamily: DASH.font,
                fontSize: "0.8125rem",
                color: alpha(DASH.dark, 0.6),
                lineHeight: 1.6,
              }}
            >
              {book.description}
            </Typography>
          </Box>
        )}

        <Box sx={{ display: "flex", justifyContent: "flex-end", pt: 0.5 }}>
          <Button onClick={onClose} sx={modalGhostButtonSx}>
            Close
          </Button>
        </Box>
      </Box>
    </AppModal>
  );
}
