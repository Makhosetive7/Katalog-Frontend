"use client";

import Link from "next/link";
import {
  Box,
  Container,
  Grid,
  CircularProgress,
  Alert,
  Button,
  Chip,
  alpha,
} from "@mui/material";
import {
  MenuBook,
  Whatshot,
  EmojiEvents,
  TrackChanges,
} from "@mui/icons-material";
import { useGetProfileQuery } from "@/redux/api/books";
import BooksPageHeader from "@/components/book/BooksPageHeader";
import DashboardStatCard from "@/components/dashboard/DashboardStatCard";
import ProfileHero from "@/components/profile/ProfileHero";
import ProfileSection, { ProfileField } from "@/components/profile/ProfileSection";
import ProfileAchievements from "@/components/profile/ProfileAchievements";
import ProfileGoals from "@/components/profile/ProfileGoals";
import { DASH } from "@/components/dashboard/dashboardTheme";

function formatDate(dateStr?: string) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function ProfilePage() {
  const { data, isLoading, isError, refetch } = useGetProfileQuery();

  if (isLoading) {
    return (
      <Box
        sx={{
          bgcolor: DASH.cream,
          minHeight: "calc(100vh - 76px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress sx={{ color: DASH.wine }} size={36} />
      </Box>
    );
  }

  if (isError || !data) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 2, fontFamily: DASH.font, borderRadius: 0 }}>
          Failed to load profile. Please try again.
        </Alert>
        <Button
          variant="contained"
          onClick={() => refetch()}
          sx={{
            textTransform: "none",
            fontFamily: DASH.font,
            bgcolor: DASH.dark,
            boxShadow: "none",
            borderRadius: 0,
            "&:hover": { bgcolor: DASH.wineDark, boxShadow: "none" },
          }}
        >
          Retry
        </Button>
      </Container>
    );
  }

  const { user, streak, achievements = [], goals = [], booksRead = [] } = data;
  const activeGoals = goals.filter((g: { completed?: boolean }) => !g.completed);

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
        <BooksPageHeader
          label="Account"
          title="Your profile"
          subtitle="Reading stats, preferences, and achievements in one place."
          actions={
            user.preferences?.privacy === "public" ? (
              <Button
                component={Link}
                href={`/users/${user.username}`}
                sx={{
                  textTransform: "none",
                  fontFamily: DASH.font,
                  fontWeight: 600,
                  fontSize: "0.8125rem",
                  color: DASH.wine,
                  border: `1px solid ${alpha(DASH.wine, 0.2)}`,
                  px: 2,
                  py: 0.85,
                }}
              >
                Public profile
              </Button>
            ) : undefined
          }
        />

        <ProfileHero
          firstName={user.profile?.firstName}
          lastName={user.profile?.lastName}
          username={user.username}
          isVerified={user.isVerified}
          isDemo={user.isDemo}
        />

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 6, sm: 3 }}>
            <DashboardStatCard
              label="Books finished"
              value={booksRead.length}
              icon={<MenuBook sx={{ fontSize: 22 }} />}
              accent={DASH.green}
              subtitle="Completed reads"
              delay={0.05}
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <DashboardStatCard
              label="Day streak"
              value={streak?.currentStreak ?? 0}
              icon={<Whatshot sx={{ fontSize: 22 }} />}
              accent="#FF6B35"
              subtitle={
                streak?.longestStreak
                  ? `Best: ${streak.longestStreak} days`
                  : "Keep it going"
              }
              delay={0.1}
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <DashboardStatCard
              label="Achievements"
              value={achievements.length}
              icon={<EmojiEvents sx={{ fontSize: 22 }} />}
              accent={DASH.gold}
              subtitle="Badges earned"
              delay={0.15}
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <DashboardStatCard
              label="Active goals"
              value={activeGoals.length}
              icon={<TrackChanges sx={{ fontSize: 22 }} />}
              accent={DASH.wine}
              subtitle={`${goals.length} total`}
              delay={0.2}
            />
          </Grid>
        </Grid>

        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              <ProfileSection title="Personal information">
                <ProfileField label="Email">{user.email}</ProfileField>
                <ProfileField label="Member since">
                  {formatDate(user.createdAt)}
                </ProfileField>
                {streak?.lastReadingDate && (
                  <ProfileField label="Last reading activity">
                    {formatDate(streak.lastReadingDate)}
                  </ProfileField>
                )}
              </ProfileSection>

              <ProfileSection title="Reading preferences" accent={DASH.green}>
                {user.profile?.readingPreferences?.length > 0 ? (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
                    {user.profile.readingPreferences.map((preference: string) => (
                      <Chip
                        key={preference}
                        label={preference}
                        size="small"
                        sx={{
                          fontFamily: DASH.font,
                          fontSize: "0.75rem",
                          borderRadius: 0,
                          bgcolor: alpha(DASH.green, 0.08),
                          color: DASH.dark,
                          border: `1px solid ${alpha(DASH.green, 0.2)}`,
                        }}
                      />
                    ))}
                  </Box>
                ) : (
                  <Box
                    component="span"
                    sx={{
                      fontFamily: DASH.font,
                      fontSize: "0.8125rem",
                      color: alpha(DASH.dark, 0.45),
                      fontStyle: "italic",
                    }}
                  >
                    No preferences set yet.
                  </Box>
                )}
              </ProfileSection>

              <ProfileSection title="Privacy & settings" accent={DASH.wineDark}>
                <ProfileField label="Profile visibility">
                  <Chip
                    label={
                      user.preferences?.privacy
                        ? user.preferences.privacy.charAt(0).toUpperCase() +
                          user.preferences.privacy.slice(1)
                        : "Private"
                    }
                    size="small"
                    sx={{
                      mt: 0.25,
                      height: 24,
                      fontFamily: DASH.font,
                      fontSize: "0.75rem",
                      borderRadius: 0,
                      bgcolor: alpha(DASH.wine, 0.08),
                      color: DASH.wine,
                    }}
                  />
                </ProfileField>
                <ProfileField label="Email notifications">
                  {user.preferences?.emailNotifications ? "Enabled" : "Disabled"}
                </ProfileField>
              </ProfileSection>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              <ProfileAchievements achievements={achievements} />
              <ProfileGoals goals={goals} />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
