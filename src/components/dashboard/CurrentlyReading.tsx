"use client";

import Link from "next/link";
import {
  Box,
  Typography,
  LinearProgress,
  Button,
  alpha,
} from "@mui/material";
import { ArrowForward } from "@mui/icons-material";
import { motion } from "framer-motion";
import { DASH, flatProgressSx, dashChipSx } from "./dashboardTheme";
import { getBookCoverColor } from "./bookCoverColor";
import { BookThumb, CircularProgressRing } from "./BookThumb";
import DashboardSection from "./DashboardSection";

type BookItem = {
  id: string;
  title: string;
  author?: string;
  genre?: string | string[];
  completionPercentage?: number;
  pages?: { current: number; total: number };
  status?: string;
};

export default function CurrentlyReading({ books }: { books: BookItem[] }) {
  const reading = books
    .filter((b) => b.status === "In-Progress")
    .sort((a, b) => (b.completionPercentage ?? 0) - (a.completionPercentage ?? 0))
    .slice(0, 5);

  if (reading.length === 0) {
    return (
      <DashboardSection title="Currently reading" subtitle="Pick up where you left off">
        <Box
          sx={{
            textAlign: "center",
            py: 3.5,
            px: 2,
            borderRadius: 0,
            bgcolor: alpha(DASH.wine, 0.03),
            border: `1px dashed ${alpha(DASH.wine, 0.12)}`,
          }}
        >
          <Typography
            sx={{
              fontFamily: DASH.font,
              fontSize: "0.875rem",
              color: alpha(DASH.dark, 0.5),
              lineHeight: 1.6,
            }}
          >
            No books in progress.{" "}
            <Box
              component={Link}
              href="/books/inProgress"
              sx={{ color: DASH.wine, fontWeight: 600, textDecoration: "none" }}
            >
              Start one →
            </Box>
          </Typography>
        </Box>
      </DashboardSection>
    );
  }

  return (
    <DashboardSection
      title="Currently reading"
      subtitle={`${reading.length} active title${reading.length === 1 ? "" : "s"}`}
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
          View all
        </Button>
      }
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
        {reading.map((book, index) => {
          const progress = book.completionPercentage ?? 0;
          const pages = book.pages;
          const pageLabel = pages?.total
            ? `${pages.current ?? 0} of ${pages.total} pages`
            : "Page count not set";
          const accent = getBookCoverColor(book.genre);
          const genreLabel = Array.isArray(book.genre) ? book.genre[0] : book.genre;
          const progressColor = progress >= 100 ? DASH.green : accent;

          return (
            <Box
              key={book.id}
              component={motion.div}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.75,
                p: 1.75,
                borderRadius: 0,
                bgcolor: "#FFFFFF",
                border: `1px solid ${alpha(DASH.wine, 0.07)}`,
                transition: "box-shadow 0.15s ease, border-color 0.15s ease",
                "&:hover": {
                  borderColor: alpha(DASH.wine, 0.14),
                  boxShadow: `0 4px 16px ${alpha(DASH.dark, 0.05)}`,
                },
              }}
            >
              <BookThumb title={book.title} genre={book.genre} />

              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  sx={{
                    fontFamily: DASH.font,
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    color: DASH.dark,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    mb: 0.25,
                  }}
                >
                  {book.title}
                </Typography>

                <Typography
                  sx={{
                    fontFamily: DASH.font,
                    fontSize: "0.75rem",
                    color: alpha(DASH.dark, 0.48),
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    mb: 1,
                  }}
                >
                  {[book.author, genreLabel].filter(Boolean).join(" · ")}
                </Typography>

                <Typography
                  sx={{
                    fontFamily: DASH.font,
                    fontSize: "0.7rem",
                    color: alpha(DASH.dark, 0.42),
                    mb: 0.6,
                  }}
                >
                  {pageLabel}
                </Typography>

                <LinearProgress
                  variant="determinate"
                  value={Math.min(progress, 100)}
                  sx={{
                    height: 5,
                    bgcolor: alpha(DASH.wine, 0.07),
                    ...flatProgressSx,
                    "& .MuiLinearProgress-bar": {
                      ...flatProgressSx["& .MuiLinearProgress-bar"],
                      bgcolor: progressColor,
                    },
                  }}
                />
              </Box>

              <CircularProgressRing value={progress} color={progressColor} />
            </Box>
          );
        })}
      </Box>
    </DashboardSection>
  );
}
