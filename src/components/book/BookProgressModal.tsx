"use client";

import { useState, useEffect } from "react";
import { Box, TextField, Typography, LinearProgress, alpha } from "@mui/material";
import { Book } from "@/types/books";
import { useUpdateReadingProgressMutation } from "@/redux/api/books";
import AppModal from "./AppModal";
import ProgressFeedback from "./ProgressFeedback";
import type { RichProgressResponse } from "@/types/books";
import { modalFieldSx } from "./modalTheme";
import { DASH } from "@/components/dashboard/dashboardTheme";
import { CircularProgressRing } from "@/components/dashboard/BookThumb";
import { getBookCoverColor } from "@/components/dashboard/bookCoverColor";

interface BookProgressModalProps {
  book: Book & { _id?: string; pages?: number; chapters?: number; genre?: string | string[] };
  open: boolean;
  onClose: () => void;
}

function getBookId(book: Book & { _id?: string }) {
  return book._id || book.id;
}

function getTotalPages(book: Book & { pages?: number }) {
  return typeof book.pages === "number" ? book.pages : 0;
}

function getTotalChapters(book: Book & { chapters?: number; totalChapters?: number }) {
  return book.chapters ?? book.totalChapters ?? 0;
}

export default function BookProgressModal({
  book,
  open,
  onClose,
}: BookProgressModalProps) {
  const totalPages = getTotalPages(book);
  const totalChapters = getTotalChapters(book);
  const accent = getBookCoverColor(book.genre);

  const [currentPage, setCurrentPage] = useState(book.currentPage || 0);
  const [currentChapter, setCurrentChapter] = useState(book.currentChapter || 0);
  const [note, setNote] = useState("");
  const [feedback, setFeedback] = useState<RichProgressResponse | null>(null);

  const [updateReadingProgress, { isLoading }] = useUpdateReadingProgressMutation();

  useEffect(() => {
    if (open) {
      setCurrentPage(book.currentPage || 0);
      setCurrentChapter(book.currentChapter || 0);
      setNote("");
      setFeedback(null);
    }
  }, [book, open]);

  const handleClose = () => {
    setFeedback(null);
    onClose();
  };

  const previewProgress = totalPages
    ? Math.round((currentPage / totalPages) * 100)
    : 0;
  const progressColor = previewProgress >= 100 ? DASH.green : accent;

  const handleSave = async () => {
    try {
      const result = await updateReadingProgress({
        id: getBookId(book),
        currentPage,
        currentChapter,
        note,
      }).unwrap();
      setFeedback(result);
      if (
        !result.achievementsUnlocked?.length &&
        !result.goalsCompleted?.length &&
        !result.streak?.isNewRecord
      ) {
        handleClose();
      }
    } catch (err) {
      console.error("Failed to update progress:", err);
    }
  };

  return (
    <AppModal
      open={open}
      onClose={handleClose}
      label="Reading"
      title="Log progress"
      subtitle={book.title}
      accent={accent}
      onSubmit={handleSave}
      submitLabel="Save progress"
      isSubmitting={isLoading}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          mb: 2.5,
          p: 2,
          border: `1px solid ${alpha(DASH.wine, 0.1)}`,
          bgcolor: alpha(accent, 0.04),
        }}
      >
        <CircularProgressRing
          value={previewProgress}
          color={progressColor}
          size={56}
        />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            sx={{
              fontFamily: DASH.font,
              fontSize: "0.75rem",
              color: alpha(DASH.dark, 0.5),
              mb: 0.5,
            }}
          >
            {totalPages
              ? `${currentPage} of ${totalPages} pages`
              : "Update your place in the book"}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={Math.min(previewProgress, 100)}
            sx={{
              height: 4,
              bgcolor: alpha(DASH.wine, 0.08),
              "& .MuiLinearProgress-bar": { bgcolor: progressColor },
            }}
          />
        </Box>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {totalPages > 0 && (
          <TextField
            label={`Current page (of ${totalPages})`}
            type="number"
            value={currentPage}
            onChange={(e) => setCurrentPage(Number(e.target.value))}
            inputProps={{ min: 0, max: totalPages }}
            fullWidth
            sx={modalFieldSx}
          />
        )}
        {totalChapters > 0 && (
          <TextField
            label={`Current chapter (of ${totalChapters})`}
            type="number"
            value={currentChapter}
            onChange={(e) => setCurrentChapter(Number(e.target.value))}
            inputProps={{ min: 0, max: totalChapters }}
            fullWidth
            sx={modalFieldSx}
          />
        )}
        <TextField
          label="Note (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          multiline
          rows={3}
          placeholder="Thoughts from this reading session…"
          fullWidth
          sx={modalFieldSx}
        />
        <ProgressFeedback result={feedback} />
        {feedback && (
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
            <Typography
              component="button"
              onClick={handleClose}
              sx={{
                fontFamily: DASH.font,
                fontSize: "0.8125rem",
                color: DASH.wine,
                border: "none",
                bgcolor: "transparent",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Done
            </Typography>
          </Box>
        )}
      </Box>
    </AppModal>
  );
}
