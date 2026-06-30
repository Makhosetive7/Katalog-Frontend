"use client";

import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Typography,
  Chip,
  IconButton,
  CircularProgress,
  Alert,
  alpha,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { Book } from "@/types/books";
import {
  useGetChapterNotesQuery,
  useCreateChapterNoteMutation,
  useDeleteChapterNoteMutation,
} from "@/redux/api/books";
import AppModal from "./AppModal";
import { modalFieldSx, modalSectionSx } from "./modalTheme";
import { DASH } from "@/components/dashboard/dashboardTheme";
import { getBookCoverColor } from "@/components/dashboard/bookCoverColor";

interface ChapterNotesModalProps {
  book: Book & { _id?: string; genre?: string | string[] };
  open: boolean;
  onClose: () => void;
  onUpdate?: () => void;
}

function getBookId(book: Book & { _id?: string }) {
  return book._id || book.id;
}

export default function ChapterNotesModal({
  book,
  open,
  onClose,
  onUpdate,
}: ChapterNotesModalProps) {
  const bookId = getBookId(book);
  const accent = getBookCoverColor(book.genre);

  const [chapter, setChapter] = useState("");
  const [note, setNote] = useState("");
  const [keywords, setKeywords] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const { data: notesData, isLoading: fetching, refetch } = useGetChapterNotesQuery(
    bookId,
    { skip: !open || !bookId }
  );
  const [createChapterNote, { isLoading: creating }] = useCreateChapterNoteMutation();
  const [deleteChapterNote] = useDeleteChapterNoteMutation();

  const notes = Array.isArray(notesData) ? notesData : [];

  useEffect(() => {
    if (open) refetch();
  }, [open, refetch]);

  const resetForm = () => {
    setChapter("");
    setNote("");
    setKeywords("");
    setFormError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async () => {
    if (!chapter || !note.trim()) {
      setFormError("Chapter number and note are required.");
      return;
    }

    try {
      await createChapterNote({
        bookId,
        body: {
          chapter: parseInt(chapter, 10),
          note: note.trim(),
          keywords: keywords
            .split(",")
            .map((k) => k.trim())
            .filter(Boolean),
          isPublic: false,
        },
      }).unwrap();

      resetForm();
      onUpdate?.();
      refetch();
    } catch (error: unknown) {
      const message =
        error && typeof error === "object" && "data" in error
          ? String((error as { data?: { error?: string } }).data?.error)
          : "Failed to create note.";
      setFormError(message);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!confirm("Delete this note?")) return;

    try {
      await deleteChapterNote(noteId).unwrap();
      onUpdate?.();
      refetch();
    } catch (error) {
      console.error("Failed to delete note:", error);
    }
  };

  return (
    <AppModal
      open={open}
      onClose={handleClose}
      label="Notes"
      title="Chapter notes"
      subtitle={book.title}
      accent={accent}
      maxWidth="md"
      hideActions
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
        <Box sx={modalSectionSx}>
          <Typography
            sx={{
              fontFamily: DASH.font,
              fontWeight: 600,
              fontSize: "0.875rem",
              color: DASH.dark,
              mb: 1.5,
            }}
          >
            Add a note
          </Typography>

          {formError && (
            <Alert severity="error" sx={{ mb: 1.5, borderRadius: 0, fontFamily: DASH.font }}>
              {formError}
            </Alert>
          )}

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
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
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Quotes, themes, questions…"
              fullWidth
              sx={modalFieldSx}
            />
            <TextField
              label="Keywords (comma-separated)"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="plot, character, theme"
              fullWidth
              sx={modalFieldSx}
            />
            <Box>
              <Chip
                icon={<Add sx={{ fontSize: "16px !important" }} />}
                label={creating ? "Adding…" : "Add note"}
                onClick={handleSubmit}
                disabled={creating}
                sx={{
                  fontFamily: DASH.font,
                  fontWeight: 600,
                  bgcolor: DASH.dark,
                  color: DASH.cream,
                  borderRadius: 0,
                  height: 36,
                  px: 0.5,
                  "&:hover": { bgcolor: DASH.wineDark },
                  "& .MuiChip-icon": { color: DASH.cream },
                }}
              />
            </Box>
          </Box>
        </Box>

        <Box>
          <Typography
            sx={{
              fontFamily: DASH.font,
              fontWeight: 600,
              fontSize: "0.875rem",
              color: DASH.dark,
              mb: 1.25,
            }}
          >
            Saved notes ({notes.length})
          </Typography>

          {fetching ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
              <CircularProgress size={24} sx={{ color: DASH.wine }} />
            </Box>
          ) : notes.length === 0 ? (
            <Typography
              sx={{
                fontFamily: DASH.font,
                fontSize: "0.8125rem",
                color: alpha(DASH.dark, 0.45),
                fontStyle: "italic",
              }}
            >
              No notes yet — add your first one above.
            </Typography>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {notes.map((noteItem) => (
                <Box
                  key={noteItem._id}
                  sx={{
                    p: 1.75,
                    border: `1px solid ${alpha(DASH.wine, 0.1)}`,
                    bgcolor: "#FFFFFF",
                    display: "flex",
                    gap: 1.5,
                    alignItems: "flex-start",
                  }}
                >
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "baseline",
                        gap: 1,
                        mb: 0.5,
                        flexWrap: "wrap",
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: DASH.font,
                          fontWeight: 700,
                          fontSize: "0.8125rem",
                          color: DASH.dark,
                        }}
                      >
                        Chapter {noteItem.chapter}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: DASH.font,
                          fontSize: "0.7rem",
                          color: alpha(DASH.dark, 0.4),
                        }}
                      >
                        {new Date(noteItem.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Typography
                      sx={{
                        fontFamily: DASH.font,
                        fontSize: "0.8125rem",
                        color: alpha(DASH.dark, 0.65),
                        lineHeight: 1.5,
                        mb: noteItem.keywords?.length ? 1 : 0,
                      }}
                    >
                      {noteItem.note}
                    </Typography>
                    {noteItem.keywords && noteItem.keywords.length > 0 && (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {noteItem.keywords.map((keyword, index) => (
                          <Chip
                            key={index}
                            label={keyword}
                            size="small"
                            sx={{
                              height: 22,
                              fontSize: "0.65rem",
                              fontFamily: DASH.font,
                              borderRadius: 0,
                              bgcolor: alpha(accent, 0.08),
                              color: accent,
                              border: `1px solid ${alpha(accent, 0.15)}`,
                            }}
                          />
                        ))}
                      </Box>
                    )}
                  </Box>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteNote(noteItem._id)}
                    sx={{
                      color: alpha(DASH.wine, 0.55),
                      border: `1px solid ${alpha(DASH.wine, 0.12)}`,
                      borderRadius: 0,
                      width: 30,
                      height: 30,
                      flexShrink: 0,
                    }}
                  >
                    <Delete sx={{ fontSize: 16 }} />
                  </IconButton>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Box>
    </AppModal>
  );
}
