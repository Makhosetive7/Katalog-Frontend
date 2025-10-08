"use client";

import { useState, useMemo } from "react";
import {
  useGetBooksByStatusQuery,
  useGetNotesByBookIdQuery,
} from "@/redux/api/books";
import { format } from "date-fns";

import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  TextField,
  CircularProgress,
  Divider,
  Stack,
  useTheme,
  useMediaQuery,
  Button,
} from "@mui/material";

import UpdateBookNotesModal from "@/components/book/UpdateBookNotesModal";

export default function NotesPage() {
  const theme = useTheme();
  const isSmUp = useMediaQuery(theme.breakpoints.up("sm"));
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

  const { data } = useGetBooksByStatusQuery("In-Progress");
  const books = data?.books || [];

  const [selectedBookId, setSelectedBookId] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const { data: notesData, isLoading } = useGetNotesByBookIdQuery(selectedBookId, {
    skip: !selectedBookId,
  });

  // Dialog state
  const [openDialog, setOpenDialog] = useState(false);

  // Filter notes by keyword
  const filteredChapters = useMemo(() => {
    if (!notesData) return {};
    const filtered: Record<string, typeof notesData.chapters[string]> = {};
    Object.entries(notesData.chapters).forEach(([chapterNumber, chapterNotes]) => {
      const filteredNotes = chapterNotes.filter((note) =>
        note.note.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (filteredNotes.length > 0) filtered[chapterNumber] = filteredNotes;
    });
    return filtered;
  }, [notesData, searchTerm]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        minHeight: "100vh",
        bgcolor: "grey.100",
      }}
    >
      {/* Sidebar */}
      <Box
        sx={{
          width: { xs: "100%", sm: 280 },
          bgcolor: "background.paper",
          p: 2,
          boxShadow: 3,
          overflowY: { xs: "visible", sm: "auto" },
          mb: { xs: 2, md: 0 },
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          My Books
        </Typography>
        <Stack spacing={2}>
          {books.map((book) => (
            <Card
              key={book._id}
              variant={selectedBookId === book._id ? "outlined" : undefined}
              sx={{
                borderColor: selectedBookId === book._id ? "primary.main" : "grey.300",
                bgcolor: selectedBookId === book._id ? "primary.light" : "background.paper",
              }}
            >
              <CardActionArea onClick={() => setSelectedBookId(book._id)}>
                <CardContent>
                  <Typography variant="subtitle1" fontWeight="medium">
                    {book.title ?? "Untitled Book"}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Stack>
      </Box>

      {/* Main Content */}
      <Box sx={{ flex: 1, p: { xs: 2, sm: 4 } }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 3 }}
        >
          <Typography variant="h4" sx={{ fontSize: { xs: 20, md: 28 } }}>
            Book Notes
          </Typography>
          {selectedBookId && (
            <Button
              variant="contained"
              onClick={() => setOpenDialog(true)}
            >
              Add Note
            </Button>
          )}
        </Stack>

        {/* Search bar */}
        {selectedBookId && notesData && (
          <TextField
            fullWidth
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            variant="outlined"
            sx={{ mb: 4 }}
          />
        )}

        {/* Notes */}
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
            <CircularProgress />
          </Box>
        ) : !selectedBookId ? (
          <Typography textAlign="center" color="text.secondary" mt={10}>
            Select a book from the sidebar to view its notes.
          </Typography>
        ) : Object.entries(filteredChapters).length === 0 ? (
          <Typography textAlign="center" color="text.secondary" mt={10}>
            No notes match your search.
          </Typography>
        ) : (
          Object.entries(filteredChapters).map(([chapterNumber, chapterNotes]) => (
            <Box key={chapterNumber} mb={6}>
              <Typography
                variant="h5"
                sx={{
                  mb: 2,
                  pb: 1,
                  borderBottom: "1px solid",
                  borderColor: "grey.300",
                  fontSize: { xs: 18, md: 22 },
                }}
              >
                Chapter {chapterNumber}
              </Typography>
              <Stack spacing={3}>
                {chapterNotes
                  .slice()
                  .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
                  .map((note) => (
                    <Card
                      key={note._id}
                      variant="outlined"
                      sx={{
                        borderLeft: 4,
                        borderColor: "primary.main",
                        bgcolor: "background.paper",
                      }}
                    >
                      <CardContent>
                        <Stack
                          direction={{ xs: "column", sm: "row" }}
                          justifyContent="space-between"
                          mb={1}
                          spacing={1}
                        >
                          <Typography variant="caption" color="primary">
                            Chapter {note.chapter}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {format(new Date(note.createdAt), "MMM dd, yyyy")}
                          </Typography>
                        </Stack>
                        <Divider sx={{ mb: 1 }} />
                        <Typography variant="body1">{note.note}</Typography>
                      </CardContent>
                    </Card>
                  ))}
              </Stack>
            </Box>
          ))
        )}
      </Box>

      {/* Add Note Dialog */}
      <UpdateBookNotesModal
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        bookId={selectedBookId}
      />
    </Box>
  );
}
