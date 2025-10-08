"use client";

import { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  TextField,
  Stack,
  LinearProgress,
} from "@mui/material";
import { Book, ReadingGoal } from "@/types/books";
import { useUpdateReadingProgressMutation } from "@/redux/api/books";

interface BookProgressModalProps {
  book: Book;
  open: boolean;
  onClose: () => void;
}

export default function BookProgressModal({
  book,
  open,
  onClose,
}: BookProgressModalProps) {
  const [currentPage, setCurrentPage] = useState(book.currentPage || 0);
  const [currentChapter, setCurrentChapter] = useState(book.currentChapter || 0);
  const [note, setNote] = useState("");
  const [updatedGoals, setUpdatedGoals] = useState<ReadingGoal[]>([]);

  // RTK Query mutation hook
  const [updateReadingProgress, { isLoading }] =
    useUpdateReadingProgressMutation();

  useEffect(() => {
    if (open) {
      setCurrentPage(book.currentPage || 0);
      setCurrentChapter(book.currentChapter || 0);
      setNote("");
      setUpdatedGoals([]);
    }
  }, [book, open]);

  const handleSave = async () => {
    try {
      const result = await updateReadingProgress({
        id: book._id,
        currentPage,
        currentChapter,
        note,
      }).unwrap();

      // If backend returns goals, update state
      if (result.goals) {
        setUpdatedGoals(result.goals);
      }

      onClose();
    } catch (err) {
      console.error("Failed to update progress:", err);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: 400 },
          bgcolor: "background.paper",
          p: 4,
          borderRadius: 2,
          boxShadow: 24,
        }}
      >
        <Typography variant="h6" mb={2}>
          Update Progress: {book.title}
        </Typography>

        <Stack spacing={2}>
          <TextField
            label={`Current Page (Max ${book.pages})`}
            type="number"
            value={currentPage}
            onChange={(e) => setCurrentPage(Number(e.target.value))}
            inputProps={{ min: 0, max: book.pages }}
            fullWidth
          />
          <TextField
            label={`Current Chapter (Max ${book.chapters})`}
            type="number"
            value={currentChapter}
            onChange={(e) => setCurrentChapter(Number(e.target.value))}
            inputProps={{ min: 0, max: book.chapters }}
            fullWidth
          />
          <TextField
            label="Add a Note (Optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            multiline
            rows={3}
            fullWidth
          />

          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save Progress"}
          </Button>

          {updatedGoals.length > 0 && (
            <Box mt={2}>
              <Typography variant="subtitle1">Updated Goals</Typography>
              {updatedGoals.map((goal) => (
                <Box key={goal._id} sx={{ mt: 1 }}>
                  <Typography variant="body2">
                    {goal.type.toUpperCase()} Goal: {goal.progress}/{goal.target}{" "}
                    {goal.completed ? "Completed" : ""}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={(goal.progress / goal.target) * 100}
                  />
                </Box>
              ))}
            </Box>
          )}
        </Stack>
      </Box>
    </Modal>
  );
}
