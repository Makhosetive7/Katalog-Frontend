"use client";

import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  CircularProgress,
  Chip,
  Stack,
  Avatar,
  Button,
  Alert,
  Paper,
} from "@mui/material";
import {
  Email as EmailIcon,
  CalendarToday as CalendarIcon,
  EmojiEvents as TrophyIcon,
  LocalLibrary as BookIcon,
  Whatshot as StreakIcon,
  VerifiedUser as VerifiedIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useGetProfileQuery } from "@/redux/api/books";

const Profile = () => {
  const { data, isLoading, isError } = useGetProfileQuery();

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (isError || !data) {
    return (
      <Container maxWidth="md" sx={{ py: 5 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load profile data. Please try again later.
        </Alert>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </Container>
    );
  }

  const { user, streak, achievements = [], goals = [], booksRead = [] } = data;

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      {/* Header Section */}
      <Paper
        sx={{
          p: 4,
          mb: 4,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box sx={{ position: "absolute", top: -50, right: -50, opacity: 0.1 }}>
          <BookIcon sx={{ fontSize: 200 }} />
        </Box>

        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <Avatar
              sx={{
                width: 100,
                height: 100,
                bgcolor: "white",
                color: "#667eea",
                fontSize: "2rem",
                fontWeight: "bold",
                border: "4px solid rgba(255,255,255,0.3)",
              }}
            >
              {user.profile?.firstName?.[0]}{user.profile?.lastName?.[0]}
            </Avatar>
          </Grid>
          <Grid item xs>
            <Box>
              <Typography variant="h3" fontWeight="bold" gutterBottom>
                {user.profile?.firstName} {user.profile?.lastName}
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                @{user.username}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                {user.isVerified && (
                  <Chip
                    icon={<VerifiedIcon />}
                    label="Verified"
                    size="small"
                    sx={{ bgcolor: "white", color: "#667eea" }}
                  />
                )}
                {user.isDemo && (
                  <Chip
                    label="Demo Account"
                    size="small"
                    variant="outlined"
                    sx={{ color: "white", borderColor: "white" }}
                  />
                )}
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={4}>
        {/* Statistics Cards */}
        <Grid item xs={12}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Card sx={{ textAlign: "center", p: 3, borderRadius: 3 }}>
                  <CardContent>
                    <BookIcon color="primary" sx={{ fontSize: 48, mb: 2 }} />
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                      {booksRead.length}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Books Read
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            <Grid item xs={12} sm={4}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Card sx={{ textAlign: "center", p: 3, borderRadius: 3 }}>
                  <CardContent>
                    <StreakIcon color="warning" sx={{ fontSize: 48, mb: 2 }} />
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                      {streak?.currentStreak || 0}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Day Streak
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            <Grid item xs={12} sm={4}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Card sx={{ textAlign: "center", p: 3, borderRadius: 3 }}>
                  <CardContent>
                    <TrophyIcon color="success" sx={{ fontSize: 48, mb: 2 }} />
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                      {achievements.length}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Achievements
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
        </Grid>

        {/* Left Column - Personal Info & Preferences */}
        <Grid item xs={12} md={6}>
          <Stack spacing={4}>
            {/* Personal Information */}
            <motion.div whileHover={{ scale: 1.02 }}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    <EmailIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                    Personal Information
                  </Typography>
                  <Stack spacing={2} sx={{ mt: 2 }}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Email
                      </Typography>
                      <Typography variant="body1">{user.email}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Member Since
                      </Typography>
                      <Typography variant="body1">
                        <CalendarIcon sx={{ mr: 1, fontSize: 18, verticalAlign: "middle" }} />
                        {new Date(user.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                    {streak?.lastReadingDate && (
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Last Reading Activity
                        </Typography>
                        <Typography variant="body1">
                          {new Date(streak.lastReadingDate).toLocaleDateString()}
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </motion.div>

            {/* Reading Preferences */}
            <motion.div whileHover={{ scale: 1.02 }}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Reading Preferences
                  </Typography>
                  {user.profile?.readingPreferences?.length > 0 ? (
                    <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 2 }}>
                      {user.profile.readingPreferences.map((preference, index) => (
                        <Chip
                          key={index}
                          label={preference}
                          variant="outlined"
                          size="small"
                          sx={{ mb: 1 }}
                        />
                      ))}
                    </Stack>
                  ) : (
                    <Typography color="text.secondary" sx={{ mt: 2 }}>
                      No reading preferences set yet.
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </Stack>
        </Grid>

        {/* Right Column - Settings & Achievements */}
        <Grid item xs={12} md={6}>
          <Stack spacing={4}>
            {/* Privacy & Settings */}
            <motion.div whileHover={{ scale: 1.02 }}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Privacy & Settings
                  </Typography>
                  <Stack spacing={2} sx={{ mt: 2 }}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Profile Visibility
                      </Typography>
                      <Chip
                        label={
                          user.preferences?.privacy?.charAt(0).toUpperCase() +
                          user.preferences?.privacy?.slice(1)
                        }
                        color="primary"
                        size="small"
                        sx={{ mt: 1 }}
                      />
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Email Notifications
                      </Typography>
                      <Typography variant="body1">
                        {user.preferences?.emailNotifications ? "Enabled" : "Disabled"}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </motion.div>

            {/* Achievements */}
            <motion.div whileHover={{ scale: 1.02 }}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    <TrophyIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                    Achievements
                  </Typography>
                  {achievements.length > 0 ? (
                    <Stack spacing={2} sx={{ mt: 2 }}>
                      {achievements.map((achievement, index) => (
                        <Box
                          key={index}
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <TrophyIcon color="warning" />
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle1" fontWeight="medium">
                              {achievement.name || `Achievement ${index + 1}`}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {achievement.description || "Great job on this achievement!"}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Stack>
                  ) : (
                    <Typography color="text.secondary" sx={{ mt: 2 }}>
                      No achievements yet. Keep reading to earn achievements!
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Reading Goals */}
            <motion.div whileHover={{ scale: 1.02 }}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Reading Goals
                  </Typography>
                  {goals.length > 0 ? (
                    <Stack spacing={1} sx={{ mt: 2 }}>
                      {goals.map((goal, index) => (
                        <Typography key={index} variant="body1">
                          🎯 {goal.description || `Goal ${index + 1}`}
                        </Typography>
                      ))}
                    </Stack>
                  ) : (
                    <Typography color="text.secondary" sx={{ mt: 2 }}>
                      No active reading goals. Set some goals to stay motivated!
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;
