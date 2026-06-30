"use client";

import { useState } from "react";
import { Box, TextField, Alert } from "@mui/material";
import { useCreateChapterNoteMutation } from "@/redux/api/books";
import AppModal from "./AppModal";
import { modalFieldSx } from "./modalTheme";
import { DASH } from "@/components/dashboard/dashboardTheme";

interface UpdateBookNotesModalProps {
  open: boolean;
  onClose: () => void;
  bookId: string;
}

export default function UpdateBookNotesModal({
  open,
  onClose,
  bookId,
}: UpdateBookNotesModalProps) {
  const [chapter, setChapter] = useState("");
  const [noteText, setNoteText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [createNote, { isLoading }] = useCreateChapterNoteMutation();

  const reset = () => {
    setChapter("");
    setNoteText("");
    setError(null);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSave = async () => {
    setError(null);

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
      await createNote({
        bookId,
        body: { chapter: chapNum, note: noteText.trim() },
      }).unwrap();

      handleClose();
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "data" in err
          ? String((err as { data?: { error?: string } }).data?.error)
          : "Failed to create note.";
      setError(message);
    }
  };

  return (
    <AppModal
      open={open}
      onClose={handleClose}
      label="Notes"
      title="Add a note"
      subtitle="Capture thoughts for a chapter."
      accent={DASH.wine}
      onSubmit={handleSave}
      submitLabel="Save note"
      isSubmitting={isLoading}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {error && (
          <Alert severity="error" sx={{ borderRadius: 0, fontFamily: DASH.font }}>
            {error}
          </Alert>
        )}

        <TextField
          label="Chapter"
          type="number"
          value={chapter}
          onChange={(e) => setChapter(e.target.value)}
          inputProps={{ min: 1 }}
          fullWidth
          sx={modalFieldSx}
        />

        <TextField
          label="Note"
          multiline
          rows={5}
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          placeholder="Quotes, themes, questions…"
          fullWidth
          sx={modalFieldSx}
        />
      </Box>
    </AppModal>
  );
}
