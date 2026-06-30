"use client";

import { useState } from "react";
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from "@mui/material";
import { useCreateBookMutation } from "@/redux/api/books";
import AppModal from "./AppModal";
import BookDiscoveryPanel from "./BookDiscoveryPanel";
import type { Book, DiscoveryBook } from "@/types/books";
import { modalFieldSx, modalSelectSx } from "./modalTheme";
import { DASH } from "@/components/dashboard/dashboardTheme";

interface AddBookModalProps {
  open: boolean;
  onClose: () => void;
}

const EMPTY_FORM = {
  title: "",
  author: "",
  genre: "",
  pages: "",
  chapters: "",
  status: "Planned" as Book["status"],
  rating: "",
  imageUrl: "",
  isbn: "",
  description: "",
  openLibraryKey: "",
};

export default function AddBookModal({ open, onClose }: AddBookModalProps) {
  const [createBook, { isLoading }] = useCreateBookMutation();
  const [formData, setFormData] = useState(EMPTY_FORM);

  const handleClose = () => {
    setFormData(EMPTY_FORM);
    onClose();
  };

  const handleDiscoverySelect = (book: DiscoveryBook) => {
    setFormData({
      title: book.title,
      author: book.author,
      genre: book.genres?.[0] ?? "",
      pages: book.pages ? String(book.pages) : "",
      chapters: "",
      status: "Planned",
      rating: "",
      imageUrl: book.coverUrl ?? "",
      isbn: book.isbn ?? "",
      description: "",
      openLibraryKey: book.openLibraryKey ?? "",
    });
  };

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.author.trim()) return;

    try {
      await createBook({
        title: formData.title.trim(),
        author: formData.author.trim(),
        genre: formData.genre.trim(),
        pages: Number(formData.pages) || 0,
        chapters: Number(formData.chapters) || 0,
        status: formData.status,
        rating: Number(formData.rating) || 0,
        imageUrl: formData.imageUrl || undefined,
        isbn: formData.isbn || undefined,
        description: formData.description || undefined,
        openLibraryKey: formData.openLibraryKey || undefined,
      }).unwrap();

      handleClose();
    } catch (error) {
      console.error("Failed to create book:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <AppModal
      open={open}
      onClose={handleClose}
      label="Library"
      title="Add a book"
      subtitle="Start tracking a new title on your shelf."
      accent={DASH.gold}
      onSubmit={handleSubmit}
      submitLabel="Add book"
      isSubmitting={isLoading}
      submitDisabled={!formData.title.trim() || !formData.author.trim()}
    >
      <BookDiscoveryPanel onSelect={handleDiscoverySelect} />
      <Box
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <TextField
          required
          name="title"
          label="Title"
          value={formData.title}
          onChange={handleChange}
          fullWidth
          sx={modalFieldSx}
        />
        <TextField
          required
          name="author"
          label="Author"
          value={formData.author}
          onChange={handleChange}
          fullWidth
          sx={modalFieldSx}
        />
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              name="genre"
              label="Genre"
              value={formData.genre}
              onChange={handleChange}
              fullWidth
              sx={modalFieldSx}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth>
              <InputLabel sx={{ fontFamily: DASH.font }}>Status</InputLabel>
              <Select
                name="status"
                value={formData.status}
                label="Status"
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, status: e.target.value }))
                }
                sx={modalSelectSx}
              >
                <MenuItem value="Planned">Planned</MenuItem>
                <MenuItem value="In-Progress">In progress</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="Dropped">Dropped</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid size={{ xs: 6 }}>
            <TextField
              name="pages"
              label="Pages"
              type="number"
              value={formData.pages}
              onChange={handleChange}
              inputProps={{ min: 1 }}
              fullWidth
              sx={modalFieldSx}
            />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <TextField
              name="chapters"
              label="Chapters"
              type="number"
              value={formData.chapters}
              onChange={handleChange}
              inputProps={{ min: 1 }}
              fullWidth
              sx={modalFieldSx}
            />
          </Grid>
        </Grid>
        <TextField
          name="rating"
          label="Rating (0–5)"
          type="number"
          value={formData.rating}
          onChange={handleChange}
          inputProps={{ min: 0, max: 5, step: 0.5 }}
          fullWidth
          sx={modalFieldSx}
        />
      </Box>
    </AppModal>
  );
}
