"use client";

import Link from "next/link";
import {
  Box,
  Typography,
  LinearProgress,
  Button,
  Chip,
  alpha,
} from "@mui/material";
import { ArrowForward } from "@mui/icons-material";
import { motion } from "framer-motion";
import { DASH, flatProgressSx, dashChipSx } from "./dashboardTheme";
import { getBookCoverColor } from "./bookCoverColor";
import DashboardSection from "./DashboardSection";

type BookItem = {
  id: string;
  title: string;
  author?: string;
  genre?: string | string[];
  status?: string;
  completionPercentage?: number;
  pages?: { current: number; total: number };
};

const STATUS_SORT: Record<string, number> = {
  "In-Progress": 0,
  Planned: 1,
  Completed: 2,
  Dropped: 3,
};

function progressColor(status: string | undefined, completion: number) {
  if (status === "Completed" || completion >= 100) return DASH.green;
  if (status === "Dropped") return alpha(DASH.dark, 0.35);
  if (status === "Planned") return DASH.gold;
  if (completion >= 50) return DASH.wine;
  return DASH.gold;
}

function statusLabel(status?: string) {
  if (!status) return null;
  if (status === "In-Progress") return "Reading";
  return status;
}

export default function CompletionBarChart({ books }: { books: BookItem[] }) {
  const completedCount = books.filter(
    (b) => b.status === "Completed" || (b.completionPercentage ?? 0) >= 100
  ).length;

  const sorted = [...books].sort((a, b) => {
    const sa = STATUS_SORT[a.status ?? ""] ?? 4;
    const sb = STATUS_SORT[b.status ?? ""] ?? 4;
    if (sa !== sb) return sa - sb;
    return (b.completionPercentage ?? 0) - (a.completionPercentage ?? 0);
  });

  const visible = sorted.slice(0, 8);
  const hasMore = sorted.length > 8;

  if (books.length === 0) {
    return (
      <DashboardSection title="Your shelf" subtitle="Track progress across every book">
        <Box
          sx={{
            py: 3.5,
            px: 2,
            textAlign: "center",
            borderRadius: 0,
            bgcolor: alpha(DASH.wine, 0.03),
            border: `1px dashed ${alpha(DASH.wine, 0.1)}`,
          }}
        >
          <Typography sx={{ fontFamily: DASH.font, fontSize: "0.875rem", color: alpha(DASH.dark, 0.45) }}>
            No books yet — add one to start tracking progress.
          </Typography>
        </Box>
      </DashboardSection>
    );
  }

  return (
    <DashboardSection
      title="Your shelf"
      subtitle={`${completedCount} of ${books.length} finished`}
      action={
        hasMore ? (
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
            View all
          </Button>
        ) : undefined
      }
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 1.25,
        }}
      >
        {visible.map((book, index) => {
          const progress = book.completionPercentage ?? 0;
          const color = progressColor(book.status, progress);
          const accent = getBookCoverColor(book.genre);
          const label = statusLabel(book.status);
          const pages = book.pages;
          const pageHint =
            pages?.total && book.status !== "Planned"
              ? `${pages.current ?? 0}/${pages.total} pg`
              : null;

          return (
            <Box
              key={book.id}
              component={motion.div}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: index * 0.03 }}
              sx={{
                p: 1.5,
                borderRadius: 0,
                bgcolor: alpha(DASH.wine, 0.02),
                border: `1px solid ${alpha(DASH.wine, 0.06)}`,
                transition: "border-color 0.15s ease",
                "&:hover": {
                  borderColor: alpha(DASH.wine, 0.12),
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: 1,
                  mb: 0.75,
                }}
              >
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography
                    sx={{
                      fontFamily: DASH.font,
                      fontWeight: 600,
                      fontSize: "0.8125rem",
                      color: DASH.dark,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      lineHeight: 1.3,
                    }}
                  >
                    {book.title}
                  </Typography>
                  {book.author && (
                    <Typography
                      sx={{
                        fontFamily: DASH.font,
                        fontSize: "0.7rem",
                        color: alpha(DASH.dark, 0.42),
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        mt: 0.15,
                      }}
                    >
                      {book.author}
                    </Typography>
                  )}
                </Box>
                <Typography
                  sx={{
                    fontFamily: DASH.font,
                    fontWeight: 700,
                    fontSize: "0.8rem",
                    color,
                    flexShrink: 0,
                    lineHeight: 1.3,
                  }}
                >
                  {progress}%
                </Typography>
              </Box>

              <LinearProgress
                variant="determinate"
                value={Math.min(progress, 100)}
                sx={{
                  height: 5,
                  mb: 0.75,
                  bgcolor: alpha(DASH.wine, 0.07),
                  ...flatProgressSx,
                  "& .MuiLinearProgress-bar": {
                    ...flatProgressSx["& .MuiLinearProgress-bar"],
                    bgcolor: color,
                  },
                }}
              />

              <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                {label && (
                  <Chip
                    label={label}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: "0.625rem",
                      fontFamily: DASH.font,
                      fontWeight: 600,
                      bgcolor: alpha(color, 0.1),
                      color,
                      border: "none",
                      ...dashChipSx,
                    }}
                  />
                )}
                {pageHint && (
                  <Typography
                    sx={{
                      fontFamily: DASH.font,
                      fontSize: "0.65rem",
                      color: alpha(DASH.dark, 0.4),
                    }}
                  >
                    {pageHint}
                  </Typography>
                )}
                {!pageHint && book.genre && (
                  <Typography
                    sx={{
                      fontFamily: DASH.font,
                      fontSize: "0.65rem",
                      color: alpha(accent, 0.8),
                    }}
                  >
                    {Array.isArray(book.genre) ? book.genre[0] : book.genre}
                  </Typography>
                )}
              </Box>
            </Box>
          );
        })}
      </Box>
    </DashboardSection>
  );
}
