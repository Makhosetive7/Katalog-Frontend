"use client";

import { useState } from "react";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
} from "@mui/material";
import { useGetBooksByStatusQuery } from "@/redux/api/books";
import BookList from "@/components/book/BookList";
import AddBookModal from "@/components/book/AddBookModal"; 

export default function InProgressPage() {
  const { data, isLoading } = useGetBooksByStatusQuery("In-Progress");
  const books = data?.books ?? [];

  const [openModal, setOpenModal] = useState(false);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box textAlign="center" mb={4} px={2}>
        <Typography
          variant="h4"
          gutterBottom
          color="primary.main"
          fontWeight="bold"
        >
          📚 Currently Reading
        </Typography>
        <Typography
          variant="body1"
          sx={{ maxWidth: 600, mx: "auto", color: "text.secondary" }}
        >
          Track your books in progress and stay on top of your reading goals.
        </Typography>
      </Box>

      <Box
        sx={{
          mb: 3,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
        }}
      >
        <TextField
          placeholder="Search current reads..."
          variant="outlined"
          size="small"
          sx={{ width: "100%", maxWidth: 400 }}
        />

        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenModal(true)}
          sx={{ textTransform: "none", fontWeight: "bold" }}
        >
          ➕ Add New Book
        </Button>
      </Box>

      {/* Book List */}
      <Box sx={{ width: "100%", maxWidth: 800, mx: "auto" }}>
        <BookList books={books} isLoading={isLoading} status="In-Progress" />
      </Box>

      {/* Add Book Modal */}
      <AddBookModal open={openModal} onClose={() => setOpenModal(false)} />
    </Container>
  );
}
