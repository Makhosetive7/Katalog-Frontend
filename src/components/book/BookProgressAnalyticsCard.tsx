"use client";

import { useGetAllBooksProgressQuery } from "@/redux/api/books";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Box,
  alpha,
  Chip,
} from "@mui/material";
import { CheckCircle, AccessTime, PauseCircle } from "@mui/icons-material";

export default function BookAnalytics() {
  const {
    data: allBooksProgress,
    isLoading,
    isError,
    isFetching,
  } = useGetAllBooksProgressQuery();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle sx={{ color: "#4CAF50" }} />;
      case "In-Progress":
        return <AccessTime sx={{ color: "#FF9800" }} />;
      case "Dropped":
        return <PauseCircle sx={{ color: "#f44336" }} />;
      default:
        return <AccessTime sx={{ color: "#9C27B0" }} />;
    }
  };

  if (isLoading || isFetching)
    return <Typography>Loading statistics...</Typography>;
  if (isError || !allBooksProgress)
    return <Typography>Error loading data.</Typography>;

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Grid container spacing={3}>
        {allBooksProgress.books.map((book: any) => (
          <Grid item xs={12} sm={6} md={4} key={book.id}>
            <Card
              sx={{
                background: `linear-gradient(135deg, ${alpha(
                  "#5DB7DE",
                  0.1
                )} 0%, ${alpha("#F7FFF6", 0.3)} 100%)`,
                    borderRadius: 0,
                border: `1px solid ${alpha("#5DB7DE", 0.2)}`,
                transition:
                  "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 6,
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                {/* Header */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 2,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "bold",
                      color: "#2C5F73",
                      lineHeight: 1.2,
                    }}
                  >
                    {book.title}
                  </Typography>
                     <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
                  {book.genre?.map((g: string, index: number) => (
                    <Chip
                      key={index}
                      label={g}
                      size="small"
                      sx={{
                        bgcolor: alpha(book.color || "#5DB7DE", 0.1),
                        color: book.color || "#5DB7DE",
                        fontWeight: "900",
                      }}
                    />
                  ))}
                </Box>
                  {getStatusIcon(book.status)}
                </Box>

                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", mb: 1 }}
                >
                  Author: <strong>{book.author}</strong>
                </Typography>

             

                {/* Status Badge */}
                <Box
                  sx={{
                    display: "inline-block",
                    bgcolor: alpha(book.color || "#5DB7DE", 0.1),
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 0,
                    mb: 2,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: "medium",
                      color: book.color || "#5DB7DE",
                    }}
                  >
                    {book.status}
                  </Typography>
                </Box>

                {/* Progress Bar */}
                <Box sx={{ mb: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                      Progress
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: "bold", color: "#5DB7DE" }}
                    >
                      {book.completionPercentage}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={book.completionPercentage}
                    sx={{
                      height: 8,
                      borderRadius: 0,
                      backgroundColor: alpha("#5DB7DE", 0.2),
                      "& .MuiLinearProgress-bar": {
                        backgroundColor: book.color || "#5DB7DE",
                        borderRadius: 0,
                      },
                    }}
                  />
                </Box>

                {/* Pages */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: 2,
                    bgcolor: alpha("#5DB7DE", 0.05),
                    borderRadius: 0,
                  }}
                >
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Pages Read
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: "bold", color: "#2C5F73" }}
                  >
                    {book.pages.current} / {book.pages.total}
                  </Typography>
                </Box>

                {/* Pages Left */}
                {book.status === "In-Progress" && (
                  <Typography
                    variant="caption"
                    sx={{
                      color: "text.secondary",
                      display: "block",
                      mt: 1,
                      textAlign: "center",
                    }}
                  >
                    {book.pages.total - book.pages.current} pages remaining
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
