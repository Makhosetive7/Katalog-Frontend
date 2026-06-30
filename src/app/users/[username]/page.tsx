"use client";

import {
  Box,
  Container,
  Grid,
  CircularProgress,
  Alert,
  Chip,
  Typography,
  alpha,
} from "@mui/material";
import { useParams } from "next/navigation";
import { MenuBook, Whatshot, EmojiEvents } from "@mui/icons-material";
import { useGetPublicProfileQuery } from "@/redux/api/books";
import BooksPageHeader from "@/components/book/BooksPageHeader";
import ProfileAchievements from "@/components/profile/ProfileAchievements";
import DashboardStatCard from "@/components/dashboard/DashboardStatCard";
import { DASH } from "@/components/dashboard/dashboardTheme";

export default function PublicProfilePage() {
  const params = useParams();
  const username = typeof params.username === "string" ? params.username : "";
  const { data, isLoading, isError } = useGetPublicProfileQuery(username, {
    skip: !username,
  });

  if (isLoading) {
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

  if (isError || !data) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ fontFamily: DASH.font }}>
          This profile is private or does not exist.
        </Alert>
      </Container>
    );
  }

  const { user, stats, recentBooks, achievements } = data;
  const displayName =
    [user.profile?.firstName, user.profile?.lastName].filter(Boolean).join(" ") ||
    user.username;

  return (
    <Box sx={{ bgcolor: DASH.cream, minHeight: "calc(100vh - 76px)", pb: 5 }}>
      <Container maxWidth="md" sx={{ py: { xs: 3, md: 4 }, px: { xs: 2, md: 3 } }}>
        <BooksPageHeader
          label="Reader"
          title={displayName}
          subtitle={`@${user.username} · reading on Katalog`}
        />

        {user.profile?.bio && (
          <Typography
            sx={{
              fontFamily: DASH.font,
              fontSize: "0.95rem",
              color: alpha(DASH.dark, 0.65),
              mb: 3,
              maxWidth: 560,
            }}
          >
            {user.profile.bio}
          </Typography>
        )}

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 6, sm: 3 }}>
            <DashboardStatCard
              label="Books"
              value={stats.totalBooks}
              icon={<MenuBook sx={{ fontSize: 22 }} />}
              accent={DASH.wine}
              subtitle="In library"
              delay={0}
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <DashboardStatCard
              label="Completed"
              value={stats.booksCompleted}
              icon={<EmojiEvents sx={{ fontSize: 22 }} />}
              accent={DASH.gold}
              subtitle="Finished"
              delay={0.05}
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <DashboardStatCard
              label="Streak"
              value={stats.currentStreak}
              icon={<Whatshot sx={{ fontSize: 22 }} />}
              accent="#FF6B35"
              subtitle={`Best: ${stats.longestStreak}`}
              delay={0.1}
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <DashboardStatCard
              label="Challenge"
              value={
                stats.challengeGoal
                  ? `${stats.challengeProgress}/${stats.challengeGoal}`
                  : "—"
              }
              icon={<MenuBook sx={{ fontSize: 22 }} />}
              accent={DASH.green}
              subtitle="This year"
              delay={0.15}
            />
          </Grid>
        </Grid>

        {recentBooks.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography
              sx={{
                fontFamily: DASH.font,
                fontWeight: 700,
                fontSize: "0.95rem",
                mb: 1.5,
                color: DASH.dark,
              }}
            >
              Recently completed
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {recentBooks.map((book, i) => (
                <Chip
                  key={i}
                  label={`${book.title} — ${book.author}`}
                  sx={{ fontFamily: DASH.font, bgcolor: alpha(DASH.dark, 0.05) }}
                />
              ))}
            </Box>
          </Box>
        )}

        {achievements.length > 0 && <ProfileAchievements achievements={achievements} />}
      </Container>
    </Box>
  );
}
