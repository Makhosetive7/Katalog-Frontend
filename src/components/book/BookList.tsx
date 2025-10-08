"use client";

import { Grid, Typography, Box, Container } from "@mui/material";
import BookCard from "./BookCard";
import { Book } from "@/types/books";

interface BookListProps {
  books: Book[];
  isLoading?: boolean;
  status?: "Completed" | "Dropped" | "Planned" | "InProgress";
}

export default function BookList({ books = [], isLoading, status }: BookListProps) {
  if (isLoading) {
    return (
      <Container maxWidth="xl" sx={{ px: 0 }}>
        <Grid container spacing={2}>
          {[...Array(6)].map((_, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Box sx={{ height: 240, bgcolor: "grey.100", borderRadius: 3 }} />
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  if (books.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Typography variant="h6" color="textSecondary">
          No books found
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Add some books to get started!
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ px: 0 }}>
      <Grid container spacing={2}>
        {books.map((book) => (
          <BookCard key={book.id || book._id} book={book} />
        ))}
      </Grid>
    </Container>
  );
}