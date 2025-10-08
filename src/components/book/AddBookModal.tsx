"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useCreateBookMutation } from "@/redux/api/books";

interface AddBookModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AddBookModal({ open, onClose }: AddBookModalProps) {
  const [createBook, { isLoading }] = useCreateBookMutation();

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: "",
    pages: 0,
    chapters: 0,
    status: "Planned",
    rating: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createBook({
        title: formData.title.trim(),
        author: formData.author.trim(),
        genre: formData.genre.trim(),
        pages: Number(formData.pages),
        chapters: Number(formData.chapters),
        status: formData.status,
        rating: Number(formData.rating),
      }).unwrap();

      onClose();
      setFormData({ title: "", author: "", genre: "", pages: 0, chapters: 0, status: "Planned", rating: 0 });
    } catch (error) {
      console.error("Failed to create book:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Add New Book</DialogTitle>

        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField
              required
              name="title"
              label="Book Title"
              value={formData.title}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              required
              name="author"
              label="Author"
              value={formData.author}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              required
              name="genre"
              label="Genre"
              value={formData.genre}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              required
              name="pages"
              label="Pages"
              type="number"
              value={formData.pages}
              onChange={handleChange}
              inputProps={{ min: 1 }}
              fullWidth
            />
            <TextField
              required
              name="chapters"
              label="Chapters"
              type="number"
              value={formData.chapters}
              onChange={handleChange}
              inputProps={{ min: 1 }}
              fullWidth
            />

            {/* Optional status selector */}
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={formData.status}
                label="Status"
                onChange={handleChange}
              >
                <MenuItem value="Planned">Planned</MenuItem>
                <MenuItem value="In-Progress">In-Progress</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="Dropped">Dropped</MenuItem>
              </Select>
            </FormControl>

            {/* Optional rating */}
            <TextField
              name="rating"
              label="Rating (0-5)"
              type="number"
              value={formData.rating}
              onChange={handleChange}
              inputProps={{ min: 0, max: 5, step: 0.1 }}
              fullWidth
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={isLoading}>
            {isLoading ? "Adding..." : "Add Book"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
