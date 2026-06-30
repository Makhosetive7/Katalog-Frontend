"use client";

import { useState, useMemo } from "react";
import {
  Box,
  Container,
  TextField,
  Button,
  InputAdornment,
  Grid,
  MenuItem,
  Select,
  FormControl,
  alpha,
} from "@mui/material";
import {
  Search,
  Add,
  ArrowForward,
  CheckCircle,
  AutoStories,
  Star,
} from "@mui/icons-material";
import { useGetBooksByStatusQuery } from "@/redux/api/books";
import BooksPageHeader from "@/components/book/BooksPageHeader";
import CompletedBookList from "@/components/book/CompletedBookList";
import AddBookModal from "@/components/book/AddBookModal";
import DashboardStatCard from "@/components/dashboard/DashboardStatCard";
import { DASH } from "@/components/dashboard/dashboardTheme";
import {
  normalizeReadingBooks,
  sortCompletedBooks,
  computeCompletedStats,
  type CompletedSort,
} from "@/components/book/readingBookUtils";

const SORT_OPTIONS: { value: CompletedSort; label: string }[] = [
  { value: "completed", label: "Date finished" },
  { value: "title", label: "Title" },
  { value: "rating", label: "Rating" },
  { value: "updated", label: "Recently updated" },
];

export default function CompletedPage() {
  const { data, isLoading } = useGetBooksByStatusQuery("Completed");
  const books = normalizeReadingBooks(data);

  const [openModal, setOpenModal] = useState(false);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<CompletedSort>("completed");

  const stats = useMemo(() => computeCompletedStats(books), [books]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const matched = q
      ? books.filter((b) => {
          const genre = Array.isArray(b.genre) ? b.genre.join(" ") : b.genre ?? "";
          return (
            b.title?.toLowerCase().includes(q) ||
            b.author?.toLowerCase().includes(q) ||
            genre.toLowerCase().includes(q)
          );
        })
      : books;

    return sortCompletedBooks(matched, sort);
  }, [books, search, sort]);

  return (
    <Box
      sx={{
        bgcolor: DASH.cream,
        minHeight: "calc(100vh - 76px)",
        pb: 5,
        backgroundImage: `radial-gradient(ellipse 70% 50% at 50% -10%, ${alpha(DASH.green, 0.05)} 0%, transparent 60%)`,
      }}
    >
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 }, px: { xs: 2, md: 3 } }}>
        <BooksPageHeader
          label="Shelf"
          title="Completed reads"
          subtitle="Books you've finished — your reading wins, all in one place."
          actions={
            <Button
              variant="contained"
              startIcon={<Add />}
              endIcon={<ArrowForward sx={{ fontSize: "16px !important" }} />}
              onClick={() => setOpenModal(true)}
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
              }}
            >
              Add book
            </Button>
          }
        />

        {!isLoading && books.length > 0 && (
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 4, sm: 4 }}>
              <DashboardStatCard
                label="Finished"
                value={stats.count}
                icon={<CheckCircle sx={{ fontSize: 22 }} />}
                accent={DASH.green}
                subtitle="Books completed"
                delay={0.05}
              />
            </Grid>
            <Grid size={{ xs: 4, sm: 4 }}>
              <DashboardStatCard
                label="Pages read"
                value={stats.totalPages.toLocaleString()}
                icon={<AutoStories sx={{ fontSize: 22 }} />}
                accent={DASH.wine}
                subtitle="Across finished books"
                delay={0.1}
              />
            </Grid>
            <Grid size={{ xs: 4, sm: 4 }}>
              <DashboardStatCard
                label="Avg rating"
                value={stats.avgRating != null ? stats.avgRating : "—"}
                icon={<Star sx={{ fontSize: 22 }} />}
                accent={DASH.gold}
                subtitle={
                  stats.ratedCount > 0
                    ? `${stats.ratedCount} rated`
                    : "No ratings yet"
                }
                delay={0.15}
              />
            </Grid>
          </Grid>
        )}

        <Box
          sx={{
            mb: 2.5,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 1.5,
            alignItems: { sm: "center" },
          }}
        >
          <TextField
            size="small"
            placeholder="Search by title, author, or genre…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{
              flex: 1,
              "& .MuiOutlinedInput-root": {
                fontFamily: DASH.font,
                fontSize: "0.875rem",
                bgcolor: "#FFFFFF",
                "& fieldset": {
                  borderColor: alpha(DASH.wine, 0.18),
                },
                "&:hover fieldset": {
                  borderColor: alpha(DASH.wine, 0.32),
                },
                "&.Mui-focused fieldset": {
                  borderColor: DASH.wine,
                },
              },
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ fontSize: 18, color: alpha(DASH.wine, 0.45) }} />
                  </InputAdornment>
                ),
              },
            }}
          />

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              flexShrink: 0,
            }}
          >
            <FormControl size="small" sx={{ minWidth: 168 }}>
              <Select
                value={sort}
                onChange={(e) => setSort(e.target.value as CompletedSort)}
                sx={{
                  fontFamily: DASH.font,
                  fontSize: "0.8125rem",
                  bgcolor: "#FFFFFF",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: alpha(DASH.wine, 0.18),
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: alpha(DASH.wine, 0.32),
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: DASH.wine,
                  },
                }}
              >
                {SORT_OPTIONS.map((option) => (
                  <MenuItem
                    key={option.value}
                    value={option.value}
                    sx={{ fontFamily: DASH.font, fontSize: "0.8125rem" }}
                  >
                    Sort: {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {!isLoading && books.length > 0 && (
              <Box
                component="span"
                sx={{
                  fontFamily: DASH.font,
                  fontSize: "0.8125rem",
                  color: alpha(DASH.dark, 0.45),
                  whiteSpace: "nowrap",
                }}
              >
                {filtered.length} of {books.length}
              </Box>
            )}
          </Box>
        </Box>

        <CompletedBookList
          books={filtered}
          isLoading={isLoading}
          emptyTitle={search ? "No matches" : "No finished books yet"}
          emptyDescription={
            search
              ? "Try a different search term or add a completed book."
              : "Finish a book in progress, or add one you've already read."
          }
        />

        <AddBookModal open={openModal} onClose={() => setOpenModal(false)} />
      </Container>
    </Box>
  );
}
