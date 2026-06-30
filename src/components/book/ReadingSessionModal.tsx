"use client";

import { useState } from "react";
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Grid,
  alpha,
} from "@mui/material";
import { Book } from "@/types/books";
import { useCreateReadingSessionMutation } from "@/redux/api/books";
import AppModal from "./AppModal";
import ProgressFeedback from "./ProgressFeedback";
import type { RichProgressResponse } from "@/types/books";
import { modalFieldSx, modalSelectSx } from "./modalTheme";
import { DASH } from "@/components/dashboard/dashboardTheme";
import { getBookCoverColor } from "@/components/dashboard/bookCoverColor";

interface ReadingSessionModalProps {
  book: Book & { _id?: string; pages?: number; genre?: string | string[] };
  open: boolean;
  onClose: () => void;
  onUpdate?: () => void;
}

const MOODS = [
  "excited",
  "focused",
  "relaxed",
  "bored",
  "confused",
  "inspired",
  "neutral",
];

function getBookId(book: Book & { _id?: string }) {
  return book._id || book.id;
}

export default function ReadingSessionModal({
  book,
  open,
  onClose,
  onUpdate,
}: ReadingSessionModalProps) {
  const accent = getBookCoverColor(book.genre);
  const totalPages = typeof book.pages === "number" ? book.pages : 0;

  const [pagesRead, setPagesRead] = useState("");
  const [chaptersRead, setChaptersRead] = useState("");
  const [readingTime, setReadingTime] = useState("");
  const [mood, setMood] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<RichProgressResponse | null>(null);

  const [createReadingSession, { isLoading }] = useCreateReadingSessionMutation();

  const reset = () => {
    setPagesRead("");
    setChaptersRead("");
    setReadingTime("");
    setMood("");
    setDate(new Date().toISOString().split("T")[0]);
    setError(null);
    setFeedback(null);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async () => {
    if (!pagesRead && !chaptersRead) {
      setError("Enter pages read or chapters read.");
      return;
    }

    try {
      const result = await createReadingSession({
        bookId: getBookId(book),
        body: {
          pagesRead: parseInt(pagesRead, 10) || 0,
          chaptersRead: parseInt(chaptersRead, 10) || 0,
          readingTime: parseInt(readingTime, 10) || 0,
          mood,
          date: date ? new Date(date).toISOString() : new Date().toISOString(),
        },
      }).unwrap();

      setFeedback(result);
      onUpdate?.();

      if (
        !result.achievementsUnlocked?.length &&
        !result.goalsCompleted?.length &&
        !result.streak?.isNewRecord
      ) {
        handleClose();
      }
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "data" in err
          ? String((err as { data?: { error?: string } }).data?.error)
          : "Failed to log session.";
      setError(message);
    }
  };

  return (
    <AppModal
      open={open}
      onClose={handleClose}
      label="Session"
      title="Log reading session"
      subtitle={book.title}
      accent={accent}
      onSubmit={handleSubmit}
      submitLabel="Log session"
      isSubmitting={isLoading}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {totalPages > 0 && (
          <Typography
            sx={{
              fontFamily: DASH.font,
              fontSize: "0.8125rem",
              color: alpha(DASH.dark, 0.5),
            }}
          >
            Current place: {book.currentPage ?? 0} / {totalPages} pages
          </Typography>
        )}

        {error && (
          <Typography
            sx={{
              fontFamily: DASH.font,
              fontSize: "0.8125rem",
              color: DASH.wine,
              p: 1.25,
              border: `1px solid ${alpha(DASH.wine, 0.2)}`,
              bgcolor: alpha(DASH.wine, 0.04),
            }}
          >
            {error}
          </Typography>
        )}

        <Grid container spacing={2}>
          <Grid size={{ xs: 6 }}>
            <TextField
              label="Pages read"
              type="number"
              value={pagesRead}
              onChange={(e) => setPagesRead(e.target.value)}
              placeholder="25"
              helperText="Or use chapters"
              fullWidth
              sx={modalFieldSx}
            />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <TextField
              label="Chapters read"
              type="number"
              value={chaptersRead}
              onChange={(e) => setChaptersRead(e.target.value)}
              placeholder="1"
              fullWidth
              sx={modalFieldSx}
            />
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid size={{ xs: 6 }}>
            <TextField
              label="Reading time (min)"
              type="number"
              value={readingTime}
              onChange={(e) => setReadingTime(e.target.value)}
              placeholder="45"
              fullWidth
              sx={modalFieldSx}
            />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <TextField
              label="Date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
              sx={modalFieldSx}
            />
          </Grid>
        </Grid>

        <FormControl fullWidth>
          <InputLabel sx={{ fontFamily: DASH.font }}>Mood</InputLabel>
          <Select
            value={mood}
            label="Mood"
            onChange={(e) => setMood(e.target.value)}
            sx={modalSelectSx}
          >
            <MenuItem value="" sx={{ fontFamily: DASH.font }}>
              Select mood
            </MenuItem>
            {MOODS.map((moodOption) => (
              <MenuItem key={moodOption} value={moodOption} sx={{ fontFamily: DASH.font }}>
                {moodOption.charAt(0).toUpperCase() + moodOption.slice(1)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <ProgressFeedback result={feedback} />
        {feedback && (
          <Typography
            component="button"
            onClick={handleClose}
            sx={{
              alignSelf: "flex-end",
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
        )}
      </Box>
    </AppModal>
  );
}
