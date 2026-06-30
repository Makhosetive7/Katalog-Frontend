"use client";

import { Box, Typography, alpha } from "@mui/material";
import { BookThumb } from "@/components/dashboard/BookThumb";
import { getBookCoverColor } from "@/components/dashboard/bookCoverColor";
import { DASH } from "@/components/dashboard/dashboardTheme";
import { ReadingBook, getGenreLabel } from "./readingBookUtils";

export default function NotesBookPicker({
  books,
  selectedId,
  onSelect,
}: {
  books: ReadingBook[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  if (books.length === 0) {
    return (
      <Typography
        sx={{
          fontFamily: DASH.font,
          fontSize: "0.8125rem",
          color: alpha(DASH.dark, 0.45),
          p: 2,
          border: `1px dashed ${alpha(DASH.wine, 0.2)}`,
          textAlign: "center",
        }}
      >
        No books on your shelf yet.
      </Typography>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      {books.map((book) => {
        const id = book.id || book._id || "";
        const selected = id === selectedId;
        const accent = getBookCoverColor(book.genre);
        const genreLabel = getGenreLabel(book.genre);

        return (
          <Box
            key={id}
            component="button"
            type="button"
            onClick={() => onSelect(id)}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.25,
              width: "100%",
              textAlign: "left",
              p: 1.25,
              cursor: "pointer",
              bgcolor: selected ? alpha(accent, 0.06) : "#FFFFFF",
              border: `1px solid ${selected ? alpha(accent, 0.3) : alpha(DASH.wine, 0.1)}`,
              borderLeft: `3px solid ${selected ? accent : alpha(DASH.wine, 0.15)}`,
              transition: "border-color 0.15s ease, background-color 0.15s ease",
              "&:hover": {
                bgcolor: alpha(accent, 0.04),
                borderColor: alpha(accent, 0.25),
              },
            }}
          >
            <BookThumb title={book.title} genre={book.genre} size="sm" />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                sx={{
                  fontFamily: DASH.font,
                  fontWeight: 700,
                  fontSize: "0.8125rem",
                  color: DASH.dark,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {book.title}
              </Typography>
              <Typography
                sx={{
                  fontFamily: DASH.font,
                  fontSize: "0.7rem",
                  color: alpha(DASH.dark, 0.45),
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {[book.author, genreLabel, book.status].filter(Boolean).join(" · ")}
              </Typography>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
