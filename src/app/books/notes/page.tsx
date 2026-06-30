"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Box,
  Container,
  TextField,
  Button,
  InputAdornment,
  Grid,
  CircularProgress,
  Typography,
  alpha,
} from "@mui/material";
import {
  Search,
  Add,
  ArrowForward,
  MenuBook,
  EditNote,
  AutoStories,
} from "@mui/icons-material";
import {
  useGetAllBooksProgressQuery,
  useGetNotesByBookIdQuery,
  useDeleteChapterNoteMutation,
} from "@/redux/api/books";
import BooksPageHeader from "@/components/book/BooksPageHeader";
import NotesBookPicker from "@/components/book/NotesBookPicker";
import NoteCard from "@/components/book/NoteCard";
import UpdateBookNotesModal from "@/components/book/UpdateBookNotesModal";
import DashboardStatCard from "@/components/dashboard/DashboardStatCard";
import { DASH } from "@/components/dashboard/dashboardTheme";
import { getBookCoverColor } from "@/components/dashboard/bookCoverColor";
import { normalizeReadingBooks } from "@/components/book/readingBookUtils";
import {
  filterNotesBySearch,
  sortChapterNumbers,
  computeNotesStats,
  filterBooksBySearch,
} from "@/components/book/notesUtils";

function normalizeDashboardBooks(data: unknown) {
  if (!data || typeof data !== "object") return [];
  if (Array.isArray(data)) return normalizeReadingBooks(data);
  const payload = data as { books?: unknown[] };
  return normalizeReadingBooks(payload.books ?? []);
}

export default function NotesPage() {
  const { data: booksData, isLoading: booksLoading } = useGetAllBooksProgressQuery();
  const books = useMemo(
    () =>
      normalizeDashboardBooks(booksData).sort((a, b) =>
        (a.title ?? "").localeCompare(b.title ?? "")
      ),
    [booksData]
  );

  const [selectedBookId, setSelectedBookId] = useState("");
  const [bookSearch, setBookSearch] = useState("");
  const [noteSearch, setNoteSearch] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  const selectedBook = books.find((b) => (b.id || b._id) === selectedBookId);

  useEffect(() => {
    if (!selectedBookId && books.length > 0) {
      setSelectedBookId(books[0].id || books[0]._id || "");
    }
  }, [books, selectedBookId]);

  const { data: notesData, isLoading: notesLoading } = useGetNotesByBookIdQuery(
    selectedBookId,
    { skip: !selectedBookId }
  );

  const [deleteChapterNote] = useDeleteChapterNoteMutation();

  const chapters = notesData?.chapters ?? {};
  const totalNotes = notesData?.totalNotes ?? 0;
  const accent = getBookCoverColor(selectedBook?.genre);

  const filteredBooks = useMemo(
    () => filterBooksBySearch(books, bookSearch),
    [books, bookSearch]
  );

  const filteredChapters = useMemo(
    () => filterNotesBySearch(chapters, noteSearch),
    [chapters, noteSearch]
  );

  const chapterNumbers = useMemo(
    () => sortChapterNumbers(filteredChapters),
    [filteredChapters]
  );

  const stats = useMemo(
    () => computeNotesStats(chapters, totalNotes),
    [chapters, totalNotes]
  );

  const handleDeleteNote = async (noteId: string) => {
    if (!confirm("Delete this note?")) return;
    try {
      await deleteChapterNote(noteId).unwrap();
    } catch (error) {
      console.error("Failed to delete note:", error);
    }
  };

  return (
    <Box
      sx={{
        bgcolor: DASH.cream,
        minHeight: "calc(100vh - 76px)",
        pb: 5,
        backgroundImage: `radial-gradient(ellipse 70% 50% at 50% -10%, ${alpha(DASH.wine, 0.05)} 0%, transparent 60%)`,
      }}
    >
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 }, px: { xs: 2, md: 3 } }}>
        <BooksPageHeader
          label="Notes"
          title="Chapter notes"
          subtitle="Capture quotes, themes, and takeaways as you read."
          actions={
            <Button
              variant="contained"
              startIcon={<Add />}
              endIcon={<ArrowForward sx={{ fontSize: "16px !important" }} />}
              onClick={() => setOpenDialog(true)}
              disabled={!selectedBookId}
              sx={{
                textTransform: "none",
                fontFamily: DASH.font,
                fontWeight: 600,
                fontSize: "0.875rem",
                bgcolor: DASH.dark,
                color: DASH.cream,
                px: 2.5,
                py: 1,
                boxShadow: "none",
                flexShrink: 0,
                "&:hover": { bgcolor: DASH.wineDark, boxShadow: "none" },
                "&.Mui-disabled": {
                  bgcolor: alpha(DASH.dark, 0.25),
                  color: alpha(DASH.cream, 0.7),
                },
              }}
            >
              Add note
            </Button>
          }
        />

        {selectedBookId && !notesLoading && totalNotes > 0 && (
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 4, sm: 4 }}>
              <DashboardStatCard
                label="Total notes"
                value={stats.totalNotes}
                icon={<EditNote sx={{ fontSize: 22 }} />}
                accent={DASH.wine}
                subtitle="For this book"
                delay={0.05}
              />
            </Grid>
            <Grid size={{ xs: 4, sm: 4 }}>
              <DashboardStatCard
                label="Chapters"
                value={stats.chapterCount}
                icon={<MenuBook sx={{ fontSize: 22 }} />}
                accent={accent}
                subtitle="With notes"
                delay={0.1}
              />
            </Grid>
            <Grid size={{ xs: 4, sm: 4 }}>
              <DashboardStatCard
                label="Latest"
                value={stats.latestLabel}
                icon={<AutoStories sx={{ fontSize: 22 }} />}
                accent={DASH.gold}
                subtitle="Most recent note"
                delay={0.15}
              />
            </Grid>
          </Grid>
        )}

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ mb: 1.5 }}>
              <Typography
                sx={{
                  fontFamily: DASH.font,
                  fontWeight: 600,
                  fontSize: "0.8125rem",
                  color: DASH.dark,
                  mb: 1,
                }}
              >
                Your books
              </Typography>
              <TextField
                size="small"
                placeholder="Filter books…"
                value={bookSearch}
                onChange={(e) => setBookSearch(e.target.value)}
                fullWidth
                sx={{
                  mb: 1.5,
                  "& .MuiOutlinedInput-root": {
                    fontFamily: DASH.font,
                    fontSize: "0.8125rem",
                    bgcolor: "#FFFFFF",
                    "& fieldset": { borderColor: alpha(DASH.wine, 0.18) },
                    "&:hover fieldset": { borderColor: alpha(DASH.wine, 0.32) },
                    "&.Mui-focused fieldset": { borderColor: DASH.wine },
                  },
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search sx={{ fontSize: 16, color: alpha(DASH.wine, 0.45) }} />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Box>

            {booksLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress size={24} sx={{ color: DASH.wine }} />
              </Box>
            ) : (
              <NotesBookPicker
                books={filteredBooks}
                selectedId={selectedBookId}
                onSelect={setSelectedBookId}
              />
            )}
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            {!selectedBookId ? (
              <Box
                sx={{
                  textAlign: "center",
                  py: 8,
                  px: 2,
                  bgcolor: "#FFFFFF",
                  border: `1px dashed ${alpha(DASH.wine, 0.2)}`,
                }}
              >
                <Typography
                  sx={{
                    fontFamily: DASH.font,
                    fontSize: "0.875rem",
                    color: alpha(DASH.dark, 0.5),
                  }}
                >
                  Select a book to view its notes.
                </Typography>
              </Box>
            ) : (
              <>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: { sm: "center" },
                    justifyContent: "space-between",
                    gap: 1.5,
                    mb: 2,
                  }}
                >
                  <Box>
                    <Typography
                      sx={{
                        fontFamily: DASH.serif,
                        fontWeight: 700,
                        fontSize: "1.1rem",
                        color: DASH.dark,
                      }}
                    >
                      {selectedBook?.title ?? "Notes"}
                    </Typography>
                    {selectedBook?.author && (
                      <Typography
                        sx={{
                          fontFamily: DASH.font,
                          fontSize: "0.8125rem",
                          color: alpha(DASH.dark, 0.5),
                        }}
                      >
                        {selectedBook.author}
                      </Typography>
                    )}
                  </Box>

                  <TextField
                    size="small"
                    placeholder="Search notes…"
                    value={noteSearch}
                    onChange={(e) => setNoteSearch(e.target.value)}
                    sx={{
                      width: { xs: "100%", sm: 260 },
                      "& .MuiOutlinedInput-root": {
                        fontFamily: DASH.font,
                        fontSize: "0.8125rem",
                        bgcolor: "#FFFFFF",
                        "& fieldset": { borderColor: alpha(DASH.wine, 0.18) },
                        "&:hover fieldset": { borderColor: alpha(DASH.wine, 0.32) },
                        "&.Mui-focused fieldset": { borderColor: DASH.wine },
                      },
                    }}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Search sx={{ fontSize: 16, color: alpha(DASH.wine, 0.45) }} />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </Box>

                {notesLoading ? (
                  <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                    <CircularProgress size={28} sx={{ color: DASH.wine }} />
                  </Box>
                ) : totalNotes === 0 ? (
                  <Box
                    sx={{
                      textAlign: "center",
                      py: 8,
                      px: 2,
                      bgcolor: "#FFFFFF",
                      border: `1px dashed ${alpha(DASH.wine, 0.2)}`,
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: DASH.serif,
                        fontWeight: 700,
                        fontSize: "1rem",
                        color: DASH.dark,
                        mb: 0.75,
                      }}
                    >
                      No notes yet
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: DASH.font,
                        fontSize: "0.875rem",
                        color: alpha(DASH.dark, 0.5),
                        mb: 2,
                      }}
                    >
                      Add your first note for this book.
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<Add />}
                      onClick={() => setOpenDialog(true)}
                      sx={{
                        textTransform: "none",
                        fontFamily: DASH.font,
                        fontWeight: 600,
                        bgcolor: DASH.dark,
                        boxShadow: "none",
                        "&:hover": { bgcolor: DASH.wineDark, boxShadow: "none" },
                      }}
                    >
                      Add note
                    </Button>
                  </Box>
                ) : chapterNumbers.length === 0 ? (
                  <Box
                    sx={{
                      textAlign: "center",
                      py: 6,
                      bgcolor: "#FFFFFF",
                      border: `1px dashed ${alpha(DASH.wine, 0.2)}`,
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: DASH.font,
                        fontSize: "0.875rem",
                        color: alpha(DASH.dark, 0.5),
                      }}
                    >
                      No notes match your search.
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                    {chapterNumbers.map((chapterNumber) => {
                      const chapterNotes = [...(filteredChapters[chapterNumber] ?? [])].sort(
                        (a, b) =>
                          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                      );

                      return (
                        <Box key={chapterNumber}>
                          <Typography
                            sx={{
                              fontFamily: DASH.font,
                              fontWeight: 700,
                              fontSize: "0.75rem",
                              textTransform: "uppercase",
                              letterSpacing: "0.07em",
                              color: alpha(DASH.dark, 0.5),
                              mb: 1,
                              pb: 0.75,
                              borderBottom: `1px solid ${alpha(DASH.wine, 0.1)}`,
                            }}
                          >
                            Chapter {chapterNumber}
                            <Box
                              component="span"
                              sx={{
                                ml: 1,
                                fontWeight: 500,
                                color: alpha(DASH.dark, 0.35),
                              }}
                            >
                              ({chapterNotes.length})
                            </Box>
                          </Typography>
                          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                            {chapterNotes.map((note) => (
                              <NoteCard
                                key={note._id}
                                note={note}
                                accent={accent}
                                onDelete={handleDeleteNote}
                              />
                            ))}
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>
                )}
              </>
            )}
          </Grid>
        </Grid>

        <UpdateBookNotesModal
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          bookId={selectedBookId}
        />
      </Container>
    </Box>
  );
}
