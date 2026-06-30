"use client";

import {
  Box,
  Container,
  Grid,
  CircularProgress,
  Alert,
  Button,
  alpha,
} from "@mui/material";
import {
  MenuBook,
  CheckCircle,
  Autorenew,
  AutoStories,
} from "@mui/icons-material";
import {
  useGetAllBooksProgressQuery,
  useGetReadingActivityHeatmapQuery,
  useGetProfileQuery,
} from "@/redux/api/books";
import { DASH } from "@/components/dashboard/dashboardTheme";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardStatCard from "@/components/dashboard/DashboardStatCard";
import DashboardEmptyState from "@/components/dashboard/DashboardEmptyState";
import CurrentlyReading from "@/components/dashboard/CurrentlyReading";
import StatusPieChart from "@/components/dashboard/StatusPieChart";
import CompletionBarChart from "@/components/dashboard/CompletionBarChart";
import ContributionHeatmap from "@/components/dashboard/ContributionHeatmap";
import WeeklyInsightsPanel from "@/components/dashboard/WeeklyInsightsPanel";
import RecommendationsPanel from "@/components/dashboard/RecommendationsPanel";
import ReadingInsights from "@/components/dashboard/ReadingInsights";

type BookRecord = {
  id: string;
  title: string;
  author?: string;
  genre?: string | string[];
  status?: string;
  completionPercentage?: number;
  pages?: { current: number; total: number };
};

type DashboardData = {
  books: BookRecord[];
  statistics: {
    totalBooks?: number;
    completedBooks?: number;
    inProgressBooks?: number;
    averageCompletion?: number;
    completionRate?: number;
    totalPagesRead?: number;
  };
};

function normalizeDashboard(data: unknown): DashboardData {
  if (!data || typeof data !== "object") {
    return { books: [], statistics: {} };
  }
  if (Array.isArray(data)) {
    return { books: data as BookRecord[], statistics: {} };
  }
  const payload = data as DashboardData;
  return {
    books: payload.books ?? [],
    statistics: payload.statistics ?? {},
  };
}

function countByStatus(books: BookRecord[]) {
  const completed = books.filter((b) => b.status === "Completed").length;
  const inProgress = books.filter((b) => b.status === "In-Progress").length;
  const planned = books.filter((b) => b.status === "Planned").length;
  const dropped = books.filter((b) => b.status === "Dropped").length;
  const other = Math.max(0, books.length - completed - inProgress - planned - dropped);

  return { completed, inProgress, planned, dropped, other };
}

export default function DashboardPage() {
  const {
    data,
    error: booksError,
    isLoading: booksLoading,
    refetch,
  } = useGetAllBooksProgressQuery();

  const currentYear = new Date().getFullYear();
  const {
    data: activityData,
    isLoading: activityLoading,
    isError: activityError,
  } = useGetReadingActivityHeatmapQuery(currentYear, {
    skip: booksLoading || !!booksError,
  });

  const { data: profileData } = useGetProfileQuery(undefined, {
    skip: booksLoading || !!booksError,
  });

  if (booksLoading) {
    return (
      <Box
        sx={{
          minHeight: "calc(100vh - 76px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: DASH.cream,
        }}
      >
        <CircularProgress sx={{ color: DASH.wine }} size={36} />
      </Box>
    );
  }

  if (booksError) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 2, fontFamily: DASH.font, borderRadius: 0 }}>
          Failed to load your reading data. Please try again.
        </Alert>
        <Button
          variant="contained"
          onClick={() => refetch()}
          sx={{
            textTransform: "none",
            fontFamily: DASH.font,
            bgcolor: DASH.dark,
            borderRadius: 0,
            boxShadow: "none",
            "&:hover": { bgcolor: DASH.wineDark, boxShadow: "none" },
          }}
        >
          Retry
        </Button>
      </Container>
    );
  }

  const dashboard = normalizeDashboard(data);
  const books = dashboard.books;
  const hasNoBooks = books.length === 0;

  if (hasNoBooks) {
    return (
      <Box sx={{ bgcolor: DASH.cream, minHeight: "calc(100vh - 76px)" }}>
        <Container maxWidth="lg" sx={{ px: { xs: 2, md: 3 } }}>
          <DashboardHeader />
          <DashboardEmptyState />
        </Container>
      </Box>
    );
  }

  const statusCounts = countByStatus(books);
  const stats = dashboard.statistics;
  const safeStats = {
    totalBooks: stats.totalBooks ?? books.length,
    completedBooks: statusCounts.completed,
    inProgressBooks: statusCounts.inProgress,
    completionRate:
      stats.completionRate ??
      (books.length > 0
        ? Math.round((statusCounts.completed / books.length) * 100)
        : 0),
    totalPagesRead:
      stats.totalPagesRead ??
      books.reduce((sum, b) => sum + (b.pages?.current ?? 0), 0),
  };

  const statusData = [
    { name: "Completed", value: statusCounts.completed },
    { name: "In progress", value: statusCounts.inProgress },
    { name: "Planned", value: statusCounts.planned },
    ...(statusCounts.dropped > 0 ? [{ name: "Dropped", value: statusCounts.dropped }] : []),
    ...(statusCounts.other > 0 ? [{ name: "Other", value: statusCounts.other }] : []),
  ];

  return (
    <Box
      sx={{
        bgcolor: DASH.cream,
        minHeight: "calc(100vh - 76px)",
        pb: 5,
        backgroundImage: `radial-gradient(ellipse 70% 50% at 50% -10%, ${alpha(DASH.wine, 0.05)} 0%, transparent 60%)`,
      }}
    >
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 }, px: { xs: 2, md: 3 } }}>
        <DashboardHeader />

        <Grid container spacing={2} sx={{ mb: 3 }}>
          {[
            {
              label: "Total books",
              value: safeStats.totalBooks,
              icon: <MenuBook sx={{ fontSize: 22 }} />,
              accent: DASH.wine,
              subtitle: "On your shelf",
              delay: 0.05,
            },
            {
              label: "Completed",
              value: safeStats.completedBooks,
              icon: <CheckCircle sx={{ fontSize: 22 }} />,
              accent: DASH.green,
              subtitle: `${safeStats.completionRate}% of shelf`,
              delay: 0.1,
            },
            {
              label: "In progress",
              value: safeStats.inProgressBooks,
              icon: <Autorenew sx={{ fontSize: 22 }} />,
              accent: DASH.gold,
              subtitle: "Active reads",
              delay: 0.15,
            },
            {
              label: "Pages read",
              value: safeStats.totalPagesRead.toLocaleString(),
              icon: <AutoStories sx={{ fontSize: 22 }} />,
              accent: "#8B4A4A",
              subtitle: "Logged so far",
              delay: 0.2,
            },
          ].map((stat) => (
            <Grid key={stat.label} size={{ xs: 6, sm: 3 }}>
              <DashboardStatCard {...stat} />
            </Grid>
          ))}
        </Grid>

        <ReadingInsights
          streak={profileData?.streak}
          achievements={profileData?.achievements}
        />

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, lg: 6 }}>
            <WeeklyInsightsPanel />
          </Grid>
          <Grid size={{ xs: 12, lg: 6 }}>
            <RecommendationsPanel />
          </Grid>
        </Grid>

        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, lg: 7 }}>
            <CurrentlyReading books={books} />
          </Grid>
          <Grid size={{ xs: 12, lg: 5 }}>
            <StatusPieChart data={statusData} />
          </Grid>
        </Grid>

        {!activityError && (
          <Box sx={{ mb: 3 }}>
            <ContributionHeatmap
              year={activityData?.year ?? currentYear}
              days={activityData?.days ?? []}
              stats={activityData?.stats}
              isLoading={activityLoading}
            />
          </Box>
        )}

        <CompletionBarChart books={books} />
      </Container>
    </Box>
  );
}
