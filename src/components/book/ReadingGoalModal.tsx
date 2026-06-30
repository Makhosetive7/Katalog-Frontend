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
  alpha,
} from "@mui/material";
import { Book } from "@/types/books";
import { useCreateReadingGoalMutation } from "@/redux/api/books";
import AppModal from "./AppModal";
import { modalFieldSx, modalSelectSx } from "./modalTheme";
import { DASH } from "@/components/dashboard/dashboardTheme";
import { getBookCoverColor } from "@/components/dashboard/bookCoverColor";

interface ReadingGoalModalProps {
  book: Book & { _id?: string; pages?: number; genre?: string | string[] };
  open: boolean;
  onClose: () => void;
  onUpdate?: () => void;
}

const GOAL_TYPES = [
  { value: "pages", label: "Pages" },
  { value: "chapters", label: "Chapters" },
  { value: "time", label: "Reading time (minutes)" },
  { value: "completion", label: "Completion %" },
];

const TIME_FRAMES = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "custom", label: "Custom date" },
];

function getBookId(book: Book & { _id?: string }) {
  return book._id || book.id;
}

export default function ReadingGoalModal({
  book,
  open,
  onClose,
  onUpdate,
}: ReadingGoalModalProps) {
  const accent = getBookCoverColor(book.genre);
  const totalPages = typeof book.pages === "number" ? book.pages : 0;
  const currentPage = book.currentPage ?? 0;
  const progressPct =
    totalPages > 0 ? Math.round((currentPage / totalPages) * 100) : 0;

  const [type, setType] = useState("pages");
  const [target, setTarget] = useState("");
  const [timeFrame, setTimeFrame] = useState("custom");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [createReadingGoal, { isLoading }] = useCreateReadingGoalMutation();

  const reset = () => {
    setType("pages");
    setTarget("");
    setTimeFrame("custom");
    setEndDate("");
    setError(null);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const getTargetPlaceholder = () => {
    switch (type) {
      case "pages":
        return "e.g. 50";
      case "chapters":
        return "e.g. 5";
      case "time":
        return "e.g. 120";
      case "completion":
        return "e.g. 100";
      default:
        return "";
    }
  };

  const handleSubmit = async () => {
    if (!target || !endDate) {
      setError("Target and end date are required.");
      return;
    }

    try {
      await createReadingGoal({
        bookId: getBookId(book),
        body: {
          type,
          target: parseInt(target, 10),
          timeframe: timeFrame,
          endDate: new Date(endDate).toISOString(),
        },
      }).unwrap();

      onUpdate?.();
      handleClose();
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "data" in err
          ? String((err as { data?: { error?: string } }).data?.error)
          : "Failed to create goal.";
      setError(message);
    }
  };

  return (
    <AppModal
      open={open}
      onClose={handleClose}
      label="Goals"
      title="Set a reading goal"
      subtitle={book.title}
      accent={DASH.gold}
      onSubmit={handleSubmit}
      submitLabel="Set goal"
      isSubmitting={isLoading}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {totalPages > 0 && (
          <Typography
            sx={{
              fontFamily: DASH.font,
              fontSize: "0.8125rem",
              color: alpha(DASH.dark, 0.5),
              p: 1.5,
              border: `1px solid ${alpha(accent, 0.15)}`,
              bgcolor: alpha(accent, 0.04),
            }}
          >
            Current: {currentPage} / {totalPages} pages · {progressPct}% through the book
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

        <FormControl fullWidth>
          <InputLabel sx={{ fontFamily: DASH.font }}>Goal type</InputLabel>
          <Select
            value={type}
            label="Goal type"
            onChange={(e) => setType(e.target.value)}
            sx={modalSelectSx}
          >
            {GOAL_TYPES.map((goal) => (
              <MenuItem key={goal.value} value={goal.value} sx={{ fontFamily: DASH.font }}>
                {goal.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Target"
          type="number"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          placeholder={getTargetPlaceholder()}
          fullWidth
          sx={modalFieldSx}
        />

        <FormControl fullWidth>
          <InputLabel sx={{ fontFamily: DASH.font }}>Time frame</InputLabel>
          <Select
            value={timeFrame}
            label="Time frame"
            onChange={(e) => setTimeFrame(e.target.value)}
            sx={modalSelectSx}
          >
            {TIME_FRAMES.map((frame) => (
              <MenuItem key={frame.value} value={frame.value} sx={{ fontFamily: DASH.font }}>
                {frame.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="End date"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          fullWidth
          sx={modalFieldSx}
        />
      </Box>
    </AppModal>
  );
}
