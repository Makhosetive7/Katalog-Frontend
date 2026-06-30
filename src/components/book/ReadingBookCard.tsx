"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  LinearProgress,
  Button,
  alpha,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  TrendingUp,
  EditNote,
  EmojiEvents,
  InfoOutlined,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { Book } from "@/types/books";
import BookProgressModal from "./BookProgressModal";
import BookDetailsModal from "./BookDetailsModal";
import BookNotesModal from "./ChapterNotesModal";
import ReadingGoalModal from "./ReadingGoalModal";
import { DASH } from "@/components/dashboard/dashboardTheme";
import { getBookCoverColor } from "@/components/dashboard/bookCoverColor";
import { BookThumb, CircularProgressRing } from "@/components/dashboard/BookThumb";
import {
  ReadingBook,
  getGenreLabel,
  getProgress,
  getTotalPages,
  getCurrentPage,
} from "./readingBookUtils";

export default function ReadingBookCard({
  book,
  index = 0,
}: {
  book: ReadingBook;
  index?: number;
}) {
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);

  const progress = getProgress(book);
  const totalPages = getTotalPages(book);
  const currentPage = getCurrentPage(book);
  const genreLabel = getGenreLabel(book.genre);
  const accent = getBookCoverColor(book.genre);
  const progressColor = progress >= 100 ? DASH.green : accent;

  const pageLabel = totalPages
    ? `${currentPage.toLocaleString()} of ${totalPages.toLocaleString()} pages`
    : "Page count not set";

  const coverSrc = book.coverImage || book.imageUrl;

  return (
    <>
      <Box
        component={motion.article}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.04 }}
        sx={{
          bgcolor: "#FFFFFF",
          border: `1px solid ${alpha(DASH.wine, 0.1)}`,
          borderTop: `3px solid ${accent}`,
          transition: "border-color 0.2s ease, background-color 0.2s ease",
          "&:hover": {
            borderColor: alpha(accent, 0.35),
            bgcolor: alpha(accent, 0.02),
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "stretch", md: "center" },
            gap: { xs: 0, md: 2 },
            p: { xs: 2, md: 2.25 },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.75,
              flex: 1,
              minWidth: 0,
            }}
          >
            {coverSrc ? (
              <Box
                component="img"
                src={coverSrc}
                alt=""
                sx={{
                  width: 48,
                  height: 64,
                  objectFit: "cover",
                  flexShrink: 0,
                  border: `1px solid ${alpha(accent, 0.2)}`,
                }}
              />
            ) : (
              <BookThumb title={book.title} genre={book.genre} size="lg" />
            )}

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                sx={{
                  fontFamily: DASH.font,
                  fontWeight: 700,
                  fontSize: { xs: "0.95rem", md: "1rem" },
                  color: DASH.dark,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  mb: 0.35,
                }}
              >
                {book.title}
              </Typography>

              <Typography
                sx={{
                  fontFamily: DASH.font,
                  fontSize: "0.78rem",
                  color: alpha(DASH.dark, 0.5),
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  mb: 1.25,
                }}
              >
                {[book.author, genreLabel].filter(Boolean).join(" · ")}
              </Typography>

              <Box
                sx={{
                  display: { xs: "none", sm: "flex" },
                  alignItems: "center",
                  gap: 1.5,
                  maxWidth: 420,
                }}
              >
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontFamily: DASH.font,
                      fontSize: "0.7rem",
                      color: alpha(DASH.dark, 0.45),
                      mb: 0.5,
                    }}
                  >
                    {pageLabel}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(progress, 100)}
                    sx={{
                      height: 4,
                      bgcolor: alpha(DASH.wine, 0.08),
                      "& .MuiLinearProgress-bar": {
                        bgcolor: progressColor,
                      },
                    }}
                  />
                </Box>
                <CircularProgressRing value={progress} color={progressColor} size={48} />
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              display: { xs: "flex", sm: "none" },
              alignItems: "center",
              gap: 1.5,
              mt: 1.5,
              pt: 1.5,
              borderTop: `1px solid ${alpha(DASH.wine, 0.08)}`,
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography
                sx={{
                  fontFamily: DASH.font,
                  fontSize: "0.7rem",
                  color: alpha(DASH.dark, 0.45),
                  mb: 0.5,
                }}
              >
                {pageLabel}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={Math.min(progress, 100)}
                sx={{
                  height: 4,
                  bgcolor: alpha(DASH.wine, 0.08),
                  "& .MuiLinearProgress-bar": { bgcolor: progressColor },
                }}
              />
            </Box>
            <CircularProgressRing value={progress} color={progressColor} size={44} />
          </Box>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 0.75,
              flexShrink: 0,
              alignItems: "center",
              justifyContent: { xs: "flex-start", md: "flex-end" },
              pt: { xs: 1.5, md: 0 },
              borderTop: { xs: `1px solid ${alpha(DASH.wine, 0.08)}`, md: "none" },
              mt: { xs: 1.5, md: 0 },
            }}
          >
            <Button
              size="small"
              variant="contained"
              startIcon={<TrendingUp sx={{ fontSize: "16px !important" }} />}
              onClick={() => setIsProgressModalOpen(true)}
              sx={{
                textTransform: "none",
                fontFamily: DASH.font,
                fontSize: "0.78rem",
                fontWeight: 600,
                bgcolor: DASH.dark,
                boxShadow: "none",
                px: 1.75,
                py: 0.75,
                "&:hover": { bgcolor: DASH.wineDark, boxShadow: "none" },
              }}
            >
              Log progress
            </Button>
            <Button
              size="small"
              variant="outlined"
              startIcon={<EditNote sx={{ fontSize: "16px !important" }} />}
              onClick={() => setIsNotesModalOpen(true)}
              sx={{
                textTransform: "none",
                fontFamily: DASH.font,
                fontSize: "0.78rem",
                borderColor: alpha(DASH.wine, 0.22),
                color: DASH.wine,
                px: 1.5,
                py: 0.75,
                "&:hover": {
                  borderColor: DASH.wine,
                  bgcolor: alpha(DASH.wine, 0.04),
                },
              }}
            >
              Notes
            </Button>
            <Tooltip title="Set a goal">
              <IconButton
                size="small"
                onClick={() => setIsGoalModalOpen(true)}
                sx={{
                  color: alpha(DASH.dark, 0.5),
                  border: `1px solid ${alpha(DASH.wine, 0.15)}`,
                  width: 34,
                  height: 34,
                }}
              >
                <EmojiEvents sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Book details">
              <IconButton
                size="small"
                onClick={() => setIsDetailsModalOpen(true)}
                sx={{
                  color: alpha(DASH.dark, 0.5),
                  border: `1px solid ${alpha(DASH.wine, 0.15)}`,
                  width: 34,
                  height: 34,
                }}
              >
                <InfoOutlined sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Box>

      <BookProgressModal
        book={book as Book}
        open={isProgressModalOpen}
        onClose={() => setIsProgressModalOpen(false)}
      />
      <BookDetailsModal
        book={book as Book}
        open={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
      />
      <BookNotesModal
        book={book as Book}
        open={isNotesModalOpen}
        onClose={() => setIsNotesModalOpen(false)}
      />
      <ReadingGoalModal
        book={book as Book}
        open={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
      />
    </>
  );
}
