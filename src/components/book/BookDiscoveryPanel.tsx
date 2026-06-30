"use client";

import { useState } from "react";
import {
  Box,
  TextField,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  CircularProgress,
  alpha,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { useSearchDiscoveryBooksQuery } from "@/redux/api/books";
import type { DiscoveryBook } from "@/types/books";
import { DASH } from "@/components/dashboard/dashboardTheme";
import { modalFieldSx } from "@/components/book/modalTheme";

type BookDiscoveryPanelProps = {
  onSelect: (book: DiscoveryBook) => void;
};

export default function BookDiscoveryPanel({ onSelect }: BookDiscoveryPanelProps) {
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");

  const handleSearch = (value: string) => {
    setQuery(value);
    window.clearTimeout((handleSearch as unknown as { t?: number }).t);
    (handleSearch as unknown as { t?: number }).t = window.setTimeout(() => {
      setDebounced(value.trim());
    }, 400);
  };

  const { data, isFetching, isError } = useSearchDiscoveryBooksQuery(debounced, {
    skip: debounced.length < 2,
  });

  return (
    <Box sx={{ mb: 2 }}>
      <Typography
        sx={{
          fontFamily: DASH.font,
          fontSize: "0.75rem",
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: alpha(DASH.dark, 0.45),
          mb: 1,
        }}
      >
        Search Open Library
      </Typography>
      <TextField
        fullWidth
        size="small"
        placeholder="Search by title or author…"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        InputProps={{
          startAdornment: <Search sx={{ mr: 1, color: alpha(DASH.dark, 0.35), fontSize: 20 }} />,
        }}
        sx={modalFieldSx}
      />

      {isFetching && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
          <CircularProgress size={22} sx={{ color: DASH.wine }} />
        </Box>
      )}

      {isError && debounced.length >= 2 && (
        <Typography sx={{ fontFamily: DASH.font, fontSize: "0.8125rem", color: DASH.wine, mt: 1 }}>
          Search unavailable. Enter details manually.
        </Typography>
      )}

      {data?.results && data.results.length > 0 && (
        <List dense sx={{ mt: 1, maxHeight: 220, overflow: "auto", border: `1px solid ${alpha(DASH.dark, 0.08)}` }}>
          {data.results.map((book) => (
            <ListItemButton
              key={book.openLibraryKey ?? `${book.title}-${book.author}`}
              onClick={() => onSelect(book)}
              sx={{ fontFamily: DASH.font }}
            >
              <ListItemText
                primary={book.title}
                secondary={`${book.author}${book.pages ? ` · ${book.pages} pages` : ""}`}
                primaryTypographyProps={{ fontSize: "0.875rem", fontWeight: 600 }}
                secondaryTypographyProps={{ fontSize: "0.75rem" }}
              />
            </ListItemButton>
          ))}
        </List>
      )}
    </Box>
  );
}
