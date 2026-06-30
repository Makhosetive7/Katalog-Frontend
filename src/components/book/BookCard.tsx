"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  LinearProgress,
  Button,
  Chip,
  alpha,
} from "@mui/material";
import {
  MenuBook,
  TrendingUp,
  EditNote,
  EmojiEvents,
  InfoOutlined,
} from "@mui/icons-material";
import BookProgressModal from "./BookProgressModal";
import BookDetailsModal from "./BookDetailsModal";
import BookNotesModal from "./ChapterNotesModal";
import ReadingGoalModal from "./ReadingGoalModal";
import { Book } from "@/types/books";
import { DASH } from "@/components/dashboard/dashboardTheme";

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);

  const progress = book.pages
    ? Math.round(((book.currentPage ?? 0) / book.pages) * 100)
    : book.completionPercentage ?? 0;

  const isReading = book.status === "In-Progress";

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          borderRadius: 0,
          bgcolor: "#FFFFFF",
          border: `1px solid ${alpha(DASH.wine, 0.08)}`,
          overflow: "hidden",
          height: "100%",
          transition: "box-shadow 0.2s ease, transform 0.2s ease",
          "&:hover": {
            boxShadow: "0 8px 28px rgba(30, 22, 18, 0.07)",
            transform: "translateY(-2px)",
          },
        }}
      >
        {/* Cover */}
        <Box
          sx={{
            width: { xs: "100%", sm: 120 },
            minHeight: { xs: 140, sm: "auto" },
            flexShrink: 0,
            bgcolor: alpha(DASH.wine, 0.06),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {book.coverImage ? (
            <Box
              component="img"
              src={book.coverImage}
              alt=""
              sx={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <MenuBook sx={{ fontSize: 36, color: alpha(DASH.wine, 0.35) }} />
          )}
        </Box>

        {/* Content */}
        <Box sx={{ flex: 1, p: { xs: 2, sm: 2.25 }, display: "flex", flexDirection: "column", minWidth: 0 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1, mb: 0.75 }}>
            <Box sx={{ minWidth: 0 }}>
              <Typography
                sx={{
                  fontFamily: DASH.font,
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  color: DASH.dark,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {book.title}
              </Typography>
              <Typography
                sx={{
                  fontFamily: DASH.font,
                  fontSize: "0.8rem",
                  color: alpha(DASH.dark, 0.5),
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {book.author || "Unknown author"}
                {book.genre ? ` · ${book.genre}` : ""}
              </Typography>
            </Box>
            <Chip
              label={book.status}
              size="small"
              sx={{
                height: 22,
                fontSize: "0.7rem",
                fontFamily: DASH.font,
                fontWeight: 600,
                bgcolor: isReading ? alpha(DASH.wine, 0.1) : alpha(DASH.green, 0.1),
                color: isReading ? DASH.wine : DASH.green,
                flexShrink: 0,
              }}
            />
          </Box>

          {isReading && (
            <Box sx={{ mb: 1.5 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                <Typography sx={{ fontFamily: DASH.font, fontSize: "0.75rem", color: alpha(DASH.dark, 0.5) }}>
                  {book.currentPage ?? 0} / {book.pages ?? "?"} pages
                </Typography>
                <Typography
                  sx={{
                    fontFamily: DASH.font,
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: progress >= 100 ? DASH.green : DASH.wine,
                  }}
                >
                  {progress}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={Math.min(progress, 100)}
                sx={{
                  height: 6,
                  borderRadius: 0,
                  bgcolor: alpha(DASH.wine, 0.08),
                  "& .MuiLinearProgress-bar": {
                    borderRadius: 0,
                    bgcolor: progress >= 100 ? DASH.green : DASH.wine,
                  },
                }}
              />
            </Box>
          )}

          {book.rating != null && book.rating > 0 && (
            <Typography sx={{ fontFamily: DASH.font, fontSize: "0.75rem", color: alpha(DASH.dark, 0.45), mb: 1 }}>
              Rated {book.rating}/5
            </Typography>
          )}

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 0.75,
              mt: "auto",
              pt: 1,
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
                fontSize: "0.75rem",
                fontWeight: 600,
                bgcolor: DASH.dark,
                boxShadow: "none",
                py: 0.6,
                "&:hover": { bgcolor: DASH.wineDark, boxShadow: "none" },
              }}
            >
              Update
            </Button>
            <Button
              size="small"
              variant="outlined"
              startIcon={<EditNote sx={{ fontSize: "16px !important" }} />}
              onClick={() => setIsNotesModalOpen(true)}
              sx={{
                textTransform: "none",
                fontFamily: DASH.font,
                fontSize: "0.75rem",
                borderColor: alpha(DASH.wine, 0.25),
                color: DASH.wine,
                py: 0.6,
                "&:hover": { borderColor: DASH.wine, bgcolor: alpha(DASH.wine, 0.04) },
              }}
            >
              Notes
            </Button>
            <Button
              size="small"
              variant="outlined"
              startIcon={<EmojiEvents sx={{ fontSize: "16px !important" }} />}
              onClick={() => setIsGoalModalOpen(true)}
              sx={{
                textTransform: "none",
                fontFamily: DASH.font,
                fontSize: "0.75rem",
                borderColor: alpha(DASH.wine, 0.25),
                color: DASH.wine,
                py: 0.6,
                "&:hover": { borderColor: DASH.wine, bgcolor: alpha(DASH.wine, 0.04) },
              }}
            >
              Goal
            </Button>
            <Button
              size="small"
              variant="text"
              startIcon={<InfoOutlined sx={{ fontSize: "16px !important" }} />}
              onClick={() => setIsDetailsModalOpen(true)}
              sx={{
                textTransform: "none",
                fontFamily: DASH.font,
                fontSize: "0.75rem",
                color: alpha(DASH.dark, 0.55),
                py: 0.6,
                minWidth: 0,
              }}
            >
              Details
            </Button>
          </Box>
        </Box>
      </Box>

      <BookProgressModal
        book={book}
        open={isProgressModalOpen}
        onClose={() => setIsProgressModalOpen(false)}
      />
      <BookDetailsModal
        book={book}
        open={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
      />
      <BookNotesModal
        book={book}
        open={isNotesModalOpen}
        onClose={() => setIsNotesModalOpen(false)}
      />
      <ReadingGoalModal
        book={book}
        open={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
      />
    </>
  );
}
