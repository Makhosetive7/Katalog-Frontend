"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Button,
  Stack,
  CircularProgress,
  Grid,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import BookProgressModal from "./BookProgressModal";
import BookDetailsModal from "./BookDetailsModal";
import BookNotesModal from "./ChapterNotesModal";
import ReadingGoalModal from "./ReadingGoalModal";
import { Book } from "@/types/books";


interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  const theme = useTheme();
  const isSmUp = useMediaQuery(theme.breakpoints.up("sm"));

  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);

  const progress = book.pages
    ? Math.round((book.currentPage / book.pages) * 100)
    : book.completionPercentage ?? 0;

  const statusColors = {
    "In-Progress": "primary",
    Completed: "success",
    Planned: "info",
    Dropped: "warning",
  } as const;

  return (
    <>
      <Grid item xs={12} sm={6} md={4}>
        <Card
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            borderRadius: 3,
            boxShadow: 4,
            transition: "transform 0.2s, box-shadow 0.2s",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: 8,
            },
            height: { xs: "auto", sm: 250 },
          }}
        >
          {/* Book Cover */}
          {book.coverImage ? (
            <CardMedia
              component="img"
              image={book.coverImage}
              alt={book.title}
              sx={{
                width: { xs: "100%", sm: 150 },
                height: { xs: 180, sm: "100%" },
                objectFit: "cover",
              }}
            />
          ) : (
            <Box
              sx={{
                width: { xs: "100%", sm: 150 },
                height: { xs: 180, sm: "100%" },
                bgcolor: "grey.200",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "text.secondary",
                fontSize: "1rem",
              }}
            >
              No Cover
            </Box>
          )}

          {/* Book Info */}
          <CardContent
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              p: 2,
              position: "relative",
            }}
          >
            {/* Progress circle */}
            {book.status === "In-Progress" && (
              <CircularProgress
                variant="determinate"
                value={progress}
                size={50}
                thickness={5}
                sx={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  bgcolor: "background.paper",
                  borderRadius: "50%",
                  p: 0.5,
                  boxShadow: 2,
                  zIndex: 1,
                }}
              />
            )}

            {/* Title & Author */}
            <Box sx={{ mb: 1, pr: book.status === "In-Progress" ? 6 : 0 }}>
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                noWrap
                sx={{ mb: 0.3 }}
              >
                {book.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {book.author || "Unknown Author"}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                Genre: {book.genre || "Fantasy"}
              </Typography>
            </Box>

            {/* Status Chip */}
            <Chip
              label={book.status}
              color={statusColors[book.status as keyof typeof statusColors]}
              size="small"
              sx={{ mb: 1.5, width: "fit-content" }}
            />

            {/* Progress Info */}
            {book.status === "In-Progress" && (
              <Typography variant="body2" sx={{ mb: 1 }}>
                {book.currentPage}/{book.pages} pages ({progress}%)
              </Typography>
            )}

            {/* Rating */}
            {book.rating && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                ⭐ {book.rating}/5
              </Typography>
            )}

            {/* Action Buttons */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1}
              sx={{ mt: "auto", flexWrap: "wrap", gap: 1 }}
            >
              <Button
                variant="contained"
                color="primary"
                size="small"
                fullWidth={!isSmUp}
                onClick={() => setIsDetailsModalOpen(true)}
              >
                View Details
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                size="small"
                fullWidth={!isSmUp}
                onClick={() => setIsProgressModalOpen(true)}
              >
                Update Progress
              </Button>
              <Button
                variant="outlined"
                color="primary"
                size="small"
                fullWidth={!isSmUp}
                onClick={() => setIsNotesModalOpen(true)}
              >
                Chapter Notes
              </Button>
              <Button
                variant="outlined"
                color="success"
                size="small"
                fullWidth={!isSmUp}
                onClick={() => setIsGoalModalOpen(true)}
              >
                Set Goal
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      {/* Modals */}
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
