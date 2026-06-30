"use client";

import { Box, Typography, Skeleton, alpha } from "@mui/material";
import { CheckCircle } from "@mui/icons-material";
import { DASH } from "@/components/dashboard/dashboardTheme";
import CompletedBookCard from "./CompletedBookCard";
import { ReadingBook } from "./readingBookUtils";

function CompletedBookSkeleton() {
  return (
    <Box
      sx={{
        border: `1px solid ${alpha(DASH.wine, 0.08)}`,
        borderTop: `3px solid ${alpha(DASH.green, 0.3)}`,
        p: 2.25,
      }}
    >
      <Box sx={{ display: "flex", gap: 1.75, alignItems: "center" }}>
        <Skeleton variant="rectangular" width={52} height={68} />
        <Box sx={{ flex: 1 }}>
          <Skeleton width="55%" height={22} />
          <Skeleton width="35%" height={18} sx={{ mt: 0.75 }} />
          <Skeleton width="40%" height={16} sx={{ mt: 1 }} />
        </Box>
      </Box>
    </Box>
  );
}

export default function CompletedBookList({
  books,
  isLoading,
  emptyTitle = "No finished books yet",
  emptyDescription = "Mark a book as completed when you reach the last page.",
}: {
  books: (ReadingBook & { timeline?: { completedAt?: string }; endDate?: string })[];
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  if (isLoading) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        {[...Array(3)].map((_, i) => (
          <CompletedBookSkeleton key={i} />
        ))}
      </Box>
    );
  }

  if (books.length === 0) {
    return (
      <Box
        sx={{
          textAlign: "center",
          py: { xs: 6, md: 8 },
          px: 2,
          bgcolor: "#FFFFFF",
          border: `1px dashed ${alpha(DASH.wine, 0.2)}`,
        }}
      >
        <Box
          sx={{
            width: 56,
            height: 56,
            bgcolor: alpha(DASH.green, 0.1),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mx: "auto",
            mb: 2,
            color: DASH.green,
          }}
        >
          <CheckCircle />
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
            maxWidth: 360,
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
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
      {books.map((book, index) => (
        <CompletedBookCard
          key={book.id || book._id || `${book.title}-${index}`}
          book={book}
          index={index}
        />
      ))}
    </Box>
  );
}
