"use client";

import { Grid, Box, Typography, alpha } from "@mui/material";
import { AutoStories } from "@mui/icons-material";
import BookCard from "./BookCard";
import { Book } from "@/types/books";
import { DASH } from "@/components/dashboard/dashboardTheme";

interface BookListProps {
  books: Book[];
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  onAdd?: () => void;
}

function BookSkeleton() {
  return (
    <Box
      sx={{
        height: 200,
        borderRadius: 0,
        bgcolor: alpha(DASH.wine, 0.04),
        border: `1px solid ${alpha(DASH.wine, 0.06)}`,
      }}
    />
  );
}

export default function BookList({
  books = [],
  isLoading,
  emptyTitle = "No books yet",
  emptyDescription = "Add a book to start tracking your reading progress.",
}: BookListProps) {
  if (isLoading) {
    return (
      <Grid container spacing={2}>
        {[...Array(4)].map((_, i) => (
          <Grid key={i} size={{ xs: 12, md: 6 }}>
            <BookSkeleton />
          </Grid>
        ))}
      </Grid>
    );
  }

  if (books.length === 0) {
    return (
      <Box
        sx={{
          textAlign: "center",
          py: { xs: 6, md: 8 },
          px: 2,
          borderRadius: 0,
          bgcolor: "#FFFFFF",
          border: `1px dashed ${alpha(DASH.wine, 0.2)}`,
        }}
      >
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: 0,
            bgcolor: alpha(DASH.wine, 0.08),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mx: "auto",
            mb: 2,
            color: DASH.wine,
          }}
        >
          <AutoStories />
        </Box>
        <Typography
          sx={{
            fontFamily: DASH.serif,
            fontWeight: 700,
            fontSize: "1.15rem",
            color: DASH.dark,
            mb: 0.75,
          }}
        >
          {emptyTitle}
        </Typography>
        <Typography
          sx={{
            fontFamily: DASH.font,
            fontSize: "0.875rem",
            color: alpha(DASH.dark, 0.5),
            maxWidth: 320,
            mx: "auto",
            lineHeight: 1.55,
          }}
        >
          {emptyDescription}
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={2}>
      {books.map((book) => (
        <Grid key={book.id || (book as Book & { _id?: string })._id} size={{ xs: 12, lg: 6 }}>
          <BookCard book={book} />
        </Grid>
      ))}
    </Grid>
  );
}
