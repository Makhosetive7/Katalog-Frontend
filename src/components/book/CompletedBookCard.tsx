"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  alpha,
  IconButton,
  Tooltip,
} from "@mui/material";
import { EditNote, InfoOutlined, Star } from "@mui/icons-material";
import { motion } from "framer-motion";
import { Book } from "@/types/books";
import BookDetailsModal from "./BookDetailsModal";
import BookNotesModal from "./ChapterNotesModal";
import { DASH } from "@/components/dashboard/dashboardTheme";
import { getBookCoverColor } from "@/components/dashboard/bookCoverColor";
import { BookThumb, CircularProgressRing } from "@/components/dashboard/BookThumb";
import {
  ReadingBook,
  getGenreLabel,
  getRating,
  getCompletedLabel,
} from "./readingBookUtils";

export default function CompletedBookCard({
  book,
  index = 0,
}: {
  book: ReadingBook & { timeline?: { completedAt?: string }; endDate?: string };
  index?: number;
}) {
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);

  const genreLabel = getGenreLabel(book.genre);
  const accent = getBookCoverColor(book.genre);
  const rating = getRating(book);
  const metaLabel = getCompletedLabel(book);
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
          borderTop: `3px solid ${DASH.green}`,
          transition: "border-color 0.2s ease, background-color 0.2s ease",
          "&:hover": {
            borderColor: alpha(DASH.green, 0.35),
            bgcolor: alpha(DASH.green, 0.02),
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
                  mb: 0.75,
                }}
              >
                {[book.author, genreLabel].filter(Boolean).join(" · ")}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  flexWrap: "wrap",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: DASH.font,
                    fontSize: "0.7rem",
                    color: alpha(DASH.dark, 0.45),
                  }}
                >
                  {metaLabel}
                </Typography>
                {rating != null && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.35 }}>
                    <Star sx={{ fontSize: 14, color: DASH.gold }} />
                    <Typography
                      sx={{
                        fontFamily: DASH.font,
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        color: DASH.dark,
                      }}
                    >
                      {rating}/10
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>

            <Box sx={{ display: { xs: "none", sm: "block" }, flexShrink: 0 }}>
              <CircularProgressRing value={100} color={DASH.green} size={48} />
            </Box>
          </Box>

          <Box
            sx={{
              display: { xs: "flex", sm: "none" },
              justifyContent: "flex-end",
              mt: 1.5,
              pt: 1.5,
              borderTop: `1px solid ${alpha(DASH.wine, 0.08)}`,
            }}
          >
            <CircularProgressRing value={100} color={DASH.green} size={44} />
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
            <Tooltip title="Book details">
              <IconButton
                size="small"
                onClick={() => setIsDetailsModalOpen(true)}
                sx={{
                  color: alpha(DASH.dark, 0.5),
                  border: `1px solid ${alpha(DASH.wine, 0.15)}`,
                  width: 34,
                  height: 34,
                  borderRadius: 0,
                }}
              >
                <InfoOutlined sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Box>

      <BookDetailsModal
        book={book}
        open={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
      />
      <BookNotesModal
        book={book as Book}
        open={isNotesModalOpen}
        onClose={() => setIsNotesModalOpen(false)}
      />
    </>
  );
}
