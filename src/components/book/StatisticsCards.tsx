"use client";

import { Grid, Card, CardContent, Typography, Box, alpha } from "@mui/material";
import {
  LibraryBooks as LibraryIcon,
  CheckCircle as CheckIcon,
  TrendingUp as TrendIcon,
  Schedule as TimeIcon,
} from "@mui/icons-material";
import { useGetAllBooksProgressQuery } from "@/redux/api/books";

export default function StatisticsCards() {
  const {
    data: allBooksProgress,
    isLoading,
    isError,
    isFetching,
  } = useGetAllBooksProgressQuery();

  const stats = [
    {
      title: "Total Books",
      value: allBooksProgress?.[0]?.totalBooks ?? "-",
      icon: <LibraryIcon sx={{ fontSize: 32 }} />,
      color: "#5DB7DE",
      gradient: "linear-gradient(135deg, #5DB7DE 0%, #A3D9FF 100%)",
    },
    {
      title: "Completed",
      value: allBooksProgress?.[0]?.completedBooks ?? "-",
      icon: <CheckIcon sx={{ fontSize: 32 }} />,
      color: "#4CAF50",
      gradient: "linear-gradient(135deg, #4CAF50 0%, #81C784 100%)",
    },
    {
      title: "Avg Completion",
      value: `${allBooksProgress?.[0]?.averageCompletion ?? "-"}%`,
      icon: <TrendIcon sx={{ fontSize: 32 }} />,
      color: "#FF9800",
      gradient: "linear-gradient(135deg, #FF9800 0%, #FFB74D 100%)",
    },
    {
      title: "Completion Rate",
      value: `${allBooksProgress?.[0]?.completionRate ?? "-"}%`,
      icon: <TimeIcon sx={{ fontSize: 32 }} />,
      color: "#9C27B0",
      gradient: "linear-gradient(135deg, #9C27B0 0%, #BA68C8 100%)",
    },
  ];

  if (isLoading || isFetching)
    return <Typography>Loading statistics...</Typography>;
  if (isError || !allBooksProgress)
    return <Typography>Error loading data.</Typography>;

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {stats.map((stat, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card
            sx={{
              background: stat.gradient,
              color: "white",
              borderRadius: 3,
              height: "100%",
              transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: 8,
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <Box>
                  <Typography variant="overline" sx={{ color: "white", opacity: 0.9, fontWeight: 500 }}>
                    {stat.title}
                  </Typography>
                  <Typography variant="h3" component="div" fontWeight="bold" sx={{ mt: 1 }}>
                    {stat.value}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    bgcolor: "rgba(255, 255, 255, 0.2)",
                    borderRadius: "50%",
                    p: 1.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {stat.icon}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}