"use client";

import Link from "next/link";
import {
  Box,
  Typography,
  Button,
  Chip,
  LinearProgress,
  alpha,
  Skeleton,
} from "@mui/material";
import {
  MenuBook,
  LightbulbOutlined,
  BookmarkBorder,
  ArrowForward,
  AutoStories,
} from "@mui/icons-material";
import { useGetRecommendationsQuery } from "@/redux/api/books";
import DashboardSection from "@/components/dashboard/DashboardSection";
import { BookThumb } from "@/components/dashboard/BookThumb";
import { DASH, dashChipSx, flatProgressSx } from "@/components/dashboard/dashboardTheme";

export default function RecommendationsPanel() {
  const { data, isLoading, isError } = useGetRecommendationsQuery();

  if (isLoading) {
    return <Skeleton variant="rectangular" height={280} sx={{ borderRadius: 0, height: "100%", minHeight: 280 }} />;
  }

  if (isError || !data) return null;

  const hasContent =
    data.continueReading.length > 0 ||
    data.upNext.length > 0 ||
    data.genreSuggestions.length > 0 ||
    data.topGenres.length > 0 ||
    data.readingTip;

  if (!hasContent) return null;

  return (
    <DashboardSection
      title="For you"
      subtitle="Tailored to your shelf and habits"
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
          My books
        </Button>
      }
    >
      {data.readingTip && (
        <Box
          sx={{
            display: "flex",
            gap: 1.25,
            mb: 2,
            p: 1.75,
            bgcolor: alpha(DASH.gold, 0.06),
            border: `1px solid ${alpha(DASH.gold, 0.18)}`,
            borderTop: `3px solid ${DASH.gold}`,
          }}
        >
          <LightbulbOutlined sx={{ fontSize: 22, color: DASH.gold, flexShrink: 0, mt: 0.1 }} />
          <Typography sx={{ fontFamily: DASH.font, fontSize: "0.8125rem", color: alpha(DASH.dark, 0.75), lineHeight: 1.55 }}>
            {data.readingTip}
          </Typography>
        </Box>
      )}

      {data.topGenres.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography
            sx={{
              fontFamily: DASH.font,
              fontWeight: 600,
              fontSize: "0.75rem",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: alpha(DASH.dark, 0.45),
              mb: 0.75,
            }}
          >
            Your top genres
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
            {data.topGenres.map((g) => (
              <Chip
                key={g.genre}
                label={`${g.genre} · ${g.count}`}
                size="small"
                sx={{
                  fontFamily: DASH.font,
                  fontSize: "0.72rem",
                  fontWeight: 600,
                  textTransform: "capitalize",
                  bgcolor: alpha(DASH.wine, 0.08),
                  color: DASH.wine,
                  ...dashChipSx,
                }}
              />
            ))}
          </Box>
        </Box>
      )}

      {data.continueReading.length > 0 && (
        <Box sx={{ mb: data.upNext.length > 0 ? 2 : 0 }}>
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
            Finish next
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {data.continueReading.slice(0, 2).map((book) => (
              <Box
                key={book.id}
                component={Link}
                href="/books/inProgress"
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 1.25,
                  p: 1.25,
                  textDecoration: "none",
                  border: `1px solid ${alpha(DASH.wine, 0.08)}`,
                  borderLeft: `3px solid ${DASH.green}`,
                  bgcolor: "#FFFFFF",
                  transition: "border-color 0.15s ease, bgcolor 0.15s ease",
                  "&:hover": {
                    borderColor: alpha(DASH.wine, 0.18),
                    bgcolor: alpha(DASH.green, 0.03),
                  },
                }}
              >
                <BookThumb title={book.title} size="sm" />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    sx={{ fontFamily: DASH.font, fontWeight: 600, fontSize: "0.8125rem", color: DASH.dark, mb: 0.25 }}
                  >
                    {book.title}
                  </Typography>
                  <Typography
                    sx={{ fontFamily: DASH.font, fontSize: "0.7rem", color: alpha(DASH.dark, 0.45), mb: 0.75 }}
                  >
                    {book.author}
                    {book.pagesLeft > 0 ? ` · ${book.pagesLeft} pages left` : ""}
                    {book.daysToFinish != null ? ` · ~${book.daysToFinish} days` : ""}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(book.completionPercentage ?? 0, 100)}
                    sx={{
                      height: 4,
                      mb: 0.75,
                      bgcolor: alpha(DASH.wine, 0.07),
                      ...flatProgressSx,
                      "& .MuiLinearProgress-bar": {
                        ...flatProgressSx["& .MuiLinearProgress-bar"],
                        bgcolor: DASH.green,
                      },
                    }}
                  />
                  <Typography sx={{ fontFamily: DASH.font, fontSize: "0.72rem", color: alpha(DASH.dark, 0.5) }}>
                    {book.reason}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {data.upNext.length > 0 && (
        <Box sx={{ mb: data.genreSuggestions.length > 0 ? 2 : 0 }}>
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
            Up next on your shelf
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
            {data.upNext.slice(0, 3).map((book) => (
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
                  bgcolor: alpha(DASH.wine, 0.02),
                  transition: "border-color 0.15s ease",
                  "&:hover": { borderColor: alpha(DASH.wine, 0.16) },
                }}
              >
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: alpha(DASH.wine, 0.08),
                    color: DASH.wine,
                    flexShrink: 0,
                  }}
                >
                  <BookmarkBorder sx={{ fontSize: 18 }} />
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    noWrap
                    sx={{ fontFamily: DASH.font, fontWeight: 600, fontSize: "0.8125rem", color: DASH.dark }}
                  >
                    {book.title}
                  </Typography>
                  <Typography noWrap sx={{ fontFamily: DASH.font, fontSize: "0.7rem", color: alpha(DASH.dark, 0.45) }}>
                    {book.author} · {book.reason}
                  </Typography>
                </Box>
                <AutoStories sx={{ fontSize: 18, color: alpha(DASH.wine, 0.4), flexShrink: 0 }} />
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {data.genreSuggestions.slice(0, 1).map((s) => (
        <Box
          key={s.genre}
          sx={{
            p: 1.5,
            bgcolor: alpha(DASH.wine, 0.03),
            border: `1px solid ${alpha(DASH.wine, 0.08)}`,
            borderLeft: `3px solid ${DASH.wine}`,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
            <MenuBook sx={{ fontSize: 18, color: DASH.wine }} />
            <Typography
              sx={{
                fontFamily: DASH.font,
                fontWeight: 600,
                fontSize: "0.75rem",
                textTransform: "capitalize",
                color: DASH.wine,
              }}
            >
              Explore {s.genre}
            </Typography>
          </Box>
          <Typography sx={{ fontFamily: DASH.font, fontSize: "0.8125rem", color: alpha(DASH.dark, 0.65), lineHeight: 1.5 }}>
            {s.message}
          </Typography>
        </Box>
      ))}
    </DashboardSection>
  );
}
