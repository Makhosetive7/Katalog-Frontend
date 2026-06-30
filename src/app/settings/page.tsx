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
import Link from "next/link";
import { useGetProfileQuery } from "@/redux/api/books";
import BooksPageHeader from "@/components/book/BooksPageHeader";
import ProfileHero from "@/components/profile/ProfileHero";
import SettingsProfileForm from "@/components/settings/SettingsProfileForm";
import SettingsPreferencesForm from "@/components/settings/SettingsPreferencesForm";
import SettingsPasswordForm from "@/components/settings/SettingsPasswordForm";
import SettingsAccountActions from "@/components/settings/SettingsAccountActions";
import SettingsExportSection from "@/components/settings/SettingsExportSection";
import SettingsImportSection from "@/components/settings/SettingsImportSection";
import { DASH } from "@/components/dashboard/dashboardTheme";

export default function SettingsPage() {
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
          Failed to load settings. Please try again.
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

  const { user } = data;
  const privacy = user.preferences?.privacy as
    | "public"
    | "private"
    | "friends-only"
    | undefined;

  return (
    <Box
      sx={{
        bgcolor: DASH.cream,
        minHeight: "calc(100vh - 76px)",
        pb: 5,
        backgroundImage: `radial-gradient(ellipse 70% 50% at 50% -10%, ${alpha(DASH.wine, 0.05)} 0%, transparent 60%)`,
      }}
    >
      <Container maxWidth="md" sx={{ py: { xs: 3, md: 4 }, px: { xs: 2, md: 3 } }}>
        <BooksPageHeader
          label="Account"
          title="Settings"
          subtitle="Update your profile, privacy, and security."
          actions={
            <Button
              component={Link}
              href="/profile"
              sx={{
                textTransform: "none",
                fontFamily: DASH.font,
                fontWeight: 600,
                fontSize: "0.8125rem",
                color: DASH.wine,
                border: `1px solid ${alpha(DASH.wine, 0.2)}`,
                px: 2,
                py: 0.85,
                "&:hover": { bgcolor: alpha(DASH.wine, 0.04) },
              }}
            >
              View profile
            </Button>
          }
        />

        <ProfileHero
          firstName={user.profile?.firstName}
          lastName={user.profile?.lastName}
          username={user.username}
          isVerified={user.isVerified}
          isDemo={user.isDemo}
        />

        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12 }}>
            <SettingsProfileForm
              initial={{
                firstName: user.profile?.firstName,
                lastName: user.profile?.lastName,
                bio: (user.profile as { bio?: string })?.bio,
                readingPreferences: user.profile?.readingPreferences,
              }}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <SettingsPreferencesForm
              initial={{
                emailNotifications: user.preferences?.emailNotifications,
                privacy: privacy ?? "private",
              }}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <SettingsPasswordForm />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <SettingsImportSection />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <SettingsExportSection />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <SettingsAccountActions />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
