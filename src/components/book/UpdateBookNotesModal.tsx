"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Alert,
  Snackbar,
} from "@mui/material";
import { useCreateChapterNoteMutation } from "@/redux/api/books";

interface AddNoteDialogProps {
  open: boolean;
  onClose: () => void;
  bookId: string;
}

export default function UpdateBookNotesModal({ open, onClose, bookId }: AddNoteDialogProps) {
  const [chapter, setChapter] = useState<string>("");
  const [noteText, setNoteText] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [successOpen, setSuccessOpen] = useState(false);

  const [createNote, { isLoading }] = useCreateChapterNoteMutation();

  const reset = () => {
    setChapter("");
    setNoteText("");
    setError(null);
  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  const handleSave = async () => {
    setError(null);

    // basic validation
    const chapNum = Number(chapter);
    if (!bookId) {
      setError("No book selected.");
      return;
    }
    if (!chapter || Number.isNaN(chapNum) || chapNum <= 0) {
      setError("Please enter a valid chapter number.");
      return;
    }
    if (!noteText.trim()) {
      setError("Note cannot be empty.");
      return;
    }

    try {
      // **Important**: pass `body` exactly as your API expects
      await createNote({
        bookId,
        body: { chapter: chapNum, note: noteText.trim() },
      }).unwrap();

      setSuccessOpen(true);
      reset();
      onClose(); // close dialog after success
      // RTK Query will invalidate tags (if your mutation is configured) and refetch notes automatically
    } catch (err: any) {
      console.error("Failed to create chapter note:", err);
      // try to surface useful message
      const message =
        err?.data?.error ||
        err?.error?.message ||
        (typeof err === "string" ? err : "Failed to create note.");
      setError(message);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={handleCancel} fullWidth maxWidth="sm">
        <DialogTitle>Add a New Note</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <TextField
              label="Chapter"
              type="number"
              fullWidth
              value={chapter}
              onChange={(e) => setChapter(e.target.value)}
              margin="normal"
              inputProps={{ min: 1 }}
            />

            <TextField
              label="Note"
              multiline
              rows={5}
              fullWidth
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              margin="normal"
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={successOpen}
        autoHideDuration={2500}
        onClose={() => setSuccessOpen(false)}
        message="Note added"
      />
    </>
  );
}
