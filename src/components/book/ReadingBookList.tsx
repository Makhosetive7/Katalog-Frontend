"use client";

import { Box, Typography, Skeleton, alpha } from "@mui/material";
import { AutoStories } from "@mui/icons-material";
import { DASH } from "@/components/dashboard/dashboardTheme";
import ReadingBookCard from "./ReadingBookCard";
import { ReadingBook } from "./readingBookUtils";

function ReadingBookSkeleton() {
  return (
    <Box
      sx={{
        border: `1px solid ${alpha(DASH.wine, 0.08)}`,
        borderTop: `3px solid ${alpha(DASH.wine, 0.15)}`,
        p: 2.25,
      }}
    >
      <Box sx={{ display: "flex", gap: 1.75, alignItems: "center" }}>
        <Skeleton variant="rectangular" width={52} height={68} />
        <Box sx={{ flex: 1 }}>
          <Skeleton width="55%" height={22} />
          <Skeleton width="35%" height={18} sx={{ mt: 0.75 }} />
          <Skeleton width="100%" height={4} sx={{ mt: 2 }} />
        </Box>
      </Box>
    </Box>
  );
}

export default function ReadingBookList({
  books,
  isLoading,
  emptyTitle = "Nothing on your shelf yet",
  emptyDescription = "Add the book you're reading right now and start logging pages.",
}: {
  books: ReadingBook[];
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  if (isLoading) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        {[...Array(3)].map((_, i) => (
          <ReadingBookSkeleton key={i} />
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
        <ReadingBookCard
          key={book.id || book._id || `${book.title}-${index}`}
          book={book}
          index={index}
        />
      ))}
    </Box>
  );
}
