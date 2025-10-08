"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Chip,
  Divider,
  Grid,
  LinearProgress,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  IconButton,
  CircularProgress as MuiCircularProgress,
  Alert,
  Stack,
  Avatar,
  Paper,
  useTheme,
} from "@mui/material";

import {
  Close as CloseIcon,
  CalendarToday,
  MenuBook,
  TrendingUp,
  EmojiEvents,
  Analytics,
  Description,
  Person,
  LibraryBooks,
  TrackChanges,
  Speed,
  Timeline,
  Today,
  DateRange,
} from "@mui/icons-material";

import {
  useGetBookProgressAnalyticsQuery,
  useGetReadingStatisticsQuery,
  useGetGoalStatisticsQuery,
} from "@/redux/api/books";

interface BookDetailsModalProps {
  book: any;
  open: boolean;
  onClose: () => void;
}

export default function BookDetailsModal({
  book,
  open,
  onClose,
}: BookDetailsModalProps) {
  const theme = useTheme();

  const {
    data: analyticsData,
    isLoading: isLoadingAnalytics,
    error: analyticsError,
  } = useGetBookProgressAnalyticsQuery(book.id || book._id, { skip: !open });

  console.log("analyticsData:", analyticsData);

  const {
    data: readingStats,
    isLoading: isLoadingStats,
    error: statsError,
  } = useGetReadingStatisticsQuery(book.id || book._id, { skip: !open });

  console.log("readingStats:", readingStats);

  const {
    data: goalsStats,
    isLoading: isLoadingGoals,
  } = useGetGoalStatisticsQuery(
    { userId: book.user || book.userId, bookId: book.id || book._id },
    { skip: !open }
  );

  console.log("goalsStats:", goalsStats);

  const analytics = analyticsData?.analytics;
  const bookDetails = analyticsData?.bookDetails;
  const readingData = readingStats?.reading;
  const bookData = readingStats?.book;

  const statusColors = {
    "In-Progress": "primary",
    Completed: "success",
    Planned: "info",
    Dropped: "warning",
  } as const;

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const calculateDaysRemaining = (completionDate: string) => {
    if (!completionDate) return null;
    const today = new Date();
    const target = new Date(completionDate);
    const diffTime = target.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Enhanced StatCard component
  const StatCard = ({
    title,
    value,
    subtitle,
    icon,
    color = "primary",
    size = "medium",
  }: {
    title: string;
    value: any;
    subtitle?: string;
    icon: React.ReactNode;
    color?: string;
    size?: "small" | "medium" | "large";
  }) => {
    const avatarSize = size === "large" ? 48 : size === "medium" ? 40 : 32;
    const valueVariant =
      size === "large" ? "h5" : size === "medium" ? "h6" : "body1";

    return (
      <Card
        variant="outlined"
        sx={{
          height: "100%",
          borderRadius: 3,
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: 2,
          },
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar
              sx={{
                bgcolor: `${color}.main`,
                width: avatarSize,
                height: avatarSize,
                color: "white",
              }}
            >
              {icon}
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                {title}
              </Typography>
              <Typography
                variant={valueVariant}
                component="div"
                fontWeight="bold"
              >
                {value}
              </Typography>
              {subtitle && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  {subtitle}
                </Typography>
              )}
            </Box>
          </Stack>
        </CardContent>
      </Card>
    );
  };

  // Progress Card Component
  const ProgressCard = ({
    title,
    current,
    total,
    percentage,
    icon,
    color = "primary",
  }: {
    title: string;
    current: number;
    total: number;
    percentage: number;
    icon: React.ReactNode;
    color?: string;
  }) => (
    <Card variant="outlined" sx={{ borderRadius: 3, height: "100%" }}>
      <CardContent sx={{ p: 3 }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <Avatar sx={{ bgcolor: `${color}.main`, color: "white" }}>
            {icon}
          </Avatar>
          <Typography variant="subtitle1" fontWeight={600}>
            {title}
          </Typography>
        </Stack>
        <Stack spacing={2}>
          <Typography
            variant="h4"
            fontWeight={700}
            color="primary"
            textAlign="center"
          >
            {current} / {total}
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            textAlign="center"
          >
            {percentage}% completed
          </Typography>
          <LinearProgress
            variant="determinate"
            value={percentage || 0}
            color={color}
            sx={{
              height: 16,
              borderRadius: 8,
              "& .MuiLinearProgress-bar": {
                borderRadius: 8,
              },
            }}
          />
        </Stack>
      </CardContent>
    </Card>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3, maxHeight: "90vh" } }}
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 3,
          pb: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
          position: "relative",
          bgcolor: "grey.50",
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <MenuBook color="primary" />
          <Typography variant="h5" component="div" fontWeight={700}>
            Book Details & Analytics
          </Typography>
        </Stack>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 16,
            top: 16,
            color: "text.secondary",
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 0 }}>
        {!book ? (
          <Box p={3}>
            <Alert severity="error">
              Failed to load book details. Please try again.
            </Alert>
          </Box>
        ) : (
          <Box>
            {/* === TOP SECTION 50/50 === */}
            <Grid container spacing={3} sx={{ p: 3, pb: 2 }}>
              {/* Cover Image */}
              <Grid item xs={12} md={6}>
                <Paper
                  elevation={0}
                  sx={{
                    minWidth: "30vw",
                    height: 400,
                    bgcolor: "grey.50",
                    borderRadius: 3,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    position: "relative",
                    border: `1px solid ${theme.palette.divider}`,
                    mx: "auto",
                  }}
                >
                  {book.coverImage ? (
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <MenuBook sx={{ fontSize: 48, color: "text.secondary" }} />
                  )}
                  {book.status === "In-Progress" &&
                    analytics?.completionPercentage != null && (
                      <Box
                        sx={{
                          position: "absolute",
                          bottom: 16,
                          right: 16,
                          bgcolor: "background.paper",
                          borderRadius: "50%",
                          p: 1,
                          boxShadow: 3,
                        }}
                      >
                        <MuiCircularProgress
                          variant="determinate"
                          value={analytics.completionPercentage}
                          size={60}
                          thickness={4}
                          color="primary"
                        />
                        <Box
                          sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 14,
                            fontWeight: "bold",
                          }}
                        >
                          {analytics.completionPercentage}%
                        </Box>
                      </Box>
                    )}
                </Paper>
              </Grid>

              {/* Book Info */}
              <Grid item xs={12} md={6}>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="h5" fontWeight={600} gutterBottom>
                      {bookDetails?.title || book.title}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                      by {bookDetails?.author || book.author || "Unknown Author"}
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {bookDetails?.genre?.map((genre: string, index: number) => (
                      <Chip
                        key={index}
                        label={genre}
                        color="default"
                        variant="outlined"
                        size="small"
                      />
                    ))}
                    <Chip
                      label={book.status}
                      color={
                        statusColors[book.status as keyof typeof statusColors]
                      }
                      size="small"
                    />
                    {book.rating && (
                      <Chip
                        label={`⭐ ${book.rating}/5`}
                        color="default"
                        variant="outlined"
                        size="small"
                      />
                    )}
                  </Stack>
                  <Stack spacing={1}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <MenuBook
                        sx={{ fontSize: 18, color: "text.secondary" }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {bookData?.totalPages || book.pages || "N/A"} pages
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Description
                        sx={{ fontSize: 18, color: "text.secondary" }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {bookData?.totalChapters || book.totalChapters || "N/A"} chapters
                      </Typography>
                    </Box>
                    {book.dateStarted && (
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <CalendarToday
                          sx={{ fontSize: 18, color: "text.secondary" }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          Started: {formatDate(book.dateStarted)}
                        </Typography>
                      </Box>
                    )}
                    {book.dateCompleted && (
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <CalendarToday
                          sx={{ fontSize: 18, color: "text.secondary" }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          Completed: {formatDate(book.dateCompleted)}
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                </Stack>
              </Grid>
            </Grid>

            {/* === ENHANCED CURRENT PROGRESS === */}
            <Box sx={{ px: 3, pb: 3 }}>
              <Card
                variant="outlined"
                sx={{ borderRadius: 3, bgcolor: "grey.50" }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={2}
                    sx={{ mb: 2 }}
                  >
                    <TrackChanges color="primary" sx={{ fontSize: 28 }} />
                    <Typography variant="h6" fontWeight={600}>
                      Current Progress
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={analytics?.completionPercentage || 0}
                    sx={{
                      height: 12,
                      borderRadius: 6,
                      mb: 2,
                      backgroundColor: "grey.300",
                      "& .MuiLinearProgress-bar": {
                        borderRadius: 6,
                      },
                    }}
                  />
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography variant="body1" fontWeight={500}>
                      Page {analytics?.byPages?.current || 0} of {analytics?.byPages?.total || "N/A"}
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      Chapter {analytics?.byChapters?.current || 0} of {analytics?.byChapters?.total || "N/A"}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* === COMPREHENSIVE ANALYTICS === */}
            <Box sx={{ px: 3, pb: 2 }}>
              <Typography
                variant="h6"
                fontWeight={600}
                gutterBottom
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <Analytics /> Reading Analytics
              </Typography>
              
              {isLoadingAnalytics ? (
                <Box display="flex" justifyContent="center" py={4}>
                  <MuiCircularProgress size={40} />
                </Box>
              ) : analyticsError ? (
                <Alert severity="warning" sx={{ mb: 2 }}>
                  Analytics data not available
                </Alert>
              ) : analytics ? (
                <Grid container spacing={3}>
                  {/* Progress by Pages */}
                  <Grid item xs={12} md={6}>
                    <ProgressCard
                      title="Progress by Pages"
                      current={analytics.byPages?.current || 0}
                      total={analytics.byPages?.total || 0}
                      percentage={analytics.byPages?.percentage || 0}
                      icon={<Description />}
                      color="primary"
                    />
                  </Grid>

                  {/* Progress by Chapters */}
                  <Grid item xs={12} md={6}>
                    <ProgressCard
                      title="Progress by Chapters"
                      current={analytics.byChapters?.current || 0}
                      total={analytics.byChapters?.total || 0}
                      percentage={analytics.byChapters?.percentage || 0}
                      icon={<LibraryBooks />}
                      color="secondary"
                    />
                  </Grid>

                  {/* Overall Completion */}
                  <Grid item xs={12} md={4}>
                    <StatCard
                      title="Overall Completion"
                      value={`${analytics.completionPercentage || 0}%`}
                      icon={<TrackChanges />}
                      color="success"
                      size="large"
                    />
                  </Grid>

                  {/* Recommended Metric */}
                  <Grid item xs={12} md={4}>
                    <StatCard
                      title="Recommended Tracking"
                      value={analytics.recommendedMetric === "pages" ? "Pages" : "Chapters"}
                      subtitle="Based on your reading pattern"
                      icon={<Speed />}
                      color="info"
                      size="large"
                    />
                  </Grid>

                  {/* Reading Efficiency */}
                  <Grid item xs={12} md={4}>
                    <StatCard
                      title="Reading Efficiency"
                      value={analytics.byPages?.percentage > analytics.byChapters?.percentage ? "Pages" : "Chapters"}
                      subtitle="More consistent progress"
                      icon={<TrendingUp />}
                      color="warning"
                      size="large"
                    />
                  </Grid>
                </Grid>
              ) : null}
            </Box>

            {/* === ENHANCED READING STATISTICS === */}
            <Box sx={{ px: 3, pb: 2 }}>
              <Typography
                variant="h6"
                fontWeight={600}
                gutterBottom
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <Timeline /> Reading Statistics
              </Typography>
              
              {isLoadingStats ? (
                <Box display="flex" justifyContent="center" py={2}>
                  <MuiCircularProgress size={24} />
                </Box>
              ) : statsError ? (
                <Alert severity="warning">Failed to load reading stats</Alert>
              ) : readingData ? (
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                      title="Pages Read"
                      value={readingData.totalPagesRead || 0}
                      icon={<Description />}
                      color="primary"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                      title="Chapters Read"
                      value={readingData.totalChaptersRead || 0}
                      icon={<LibraryBooks />}
                      color="secondary"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                      title="Pages Per Day"
                      value={readingData.pagesPerDay || "0.0"}
                      icon={<Speed />}
                      color="info"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                      title="Chapters Per Day"
                      value={readingData.chaptersPerDay || "0.00"}
                      icon={<TrendingUp />}
                      color="success"
                    />
                  </Grid>

                  {/* Additional Reading Stats */}
                  <Grid item xs={12} sm={6} md={4}>
                    <StatCard
                      title="Days Tracked"
                      value={readingData.daysTracked || 0}
                      icon={<Today />}
                      color="warning"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <StatCard
                      title="Est. Completion"
                      value={readingData.estimatedCompletionDate ? formatDate(readingData.estimatedCompletionDate) : "N/A"}
                      subtitle={readingData.estimatedCompletionDate ? 
                        `${calculateDaysRemaining(readingData.estimatedCompletionDate)} days remaining` : 
                        "Not available"}
                      icon={<DateRange />}
                      color="primary"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <StatCard
                      title="Reading Consistency"
                      value={readingData.daysTracked > 0 ? "Good" : "Starting"}
                      subtitle={`${readingData.daysTracked || 0} days active`}
                      icon={<TrackChanges />}
                      color="success"
                    />
                  </Grid>
                </Grid>
              ) : null}
            </Box>

            {/* === ENHANCED GOALS STATS === */}
            <Box sx={{ px: 3, pb: 3 }}>
              <Stack
                direction="row"
                alignItems="center"
                spacing={2}
                sx={{ mb: 3 }}
              >
                <EmojiEvents color="primary" sx={{ fontSize: 28 }} />
                <Typography variant="h6" fontWeight={600}>
                  Goals & Achievements
                </Typography>
              </Stack>
              
              {isLoadingGoals ? (
                <Box display="flex" justifyContent="center" py={4}>
                  <MuiCircularProgress size={40} />
                </Box>
              ) : goalsStats ? (
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Card
                      variant="outlined"
                      sx={{ borderRadius: 3, height: "100%" }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={2}
                          sx={{ mb: 2 }}
                        >
                          <EmojiEvents color="warning" />
                          <Typography variant="subtitle1" fontWeight={600}>
                            Goals Overview
                          </Typography>
                        </Stack>
                        <Stack spacing={3}>
                          <StatCard
                            title="Total Goals"
                            value={goalsStats.totalGoals || 0}
                            icon={<EmojiEvents />}
                            color="warning"
                            size="large"
                          />
                          <Stack
                            direction="row"
                            spacing={3}
                            justifyContent="space-around"
                          >
                            <Box textAlign="center">
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                gutterBottom
                              >
                                Completed
                              </Typography>
                              <Typography
                                variant="h4"
                                color="success.main"
                                fontWeight={700}
                              >
                                {goalsStats.completedGoals || 0}
                              </Typography>
                            </Box>
                            <Box textAlign="center">
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                gutterBottom
                              >
                                Active
                              </Typography>
                              <Typography variant="h4" fontWeight={700}>
                                {goalsStats.activeGoals || 0}
                              </Typography>
                            </Box>
                          </Stack>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Card
                      variant="outlined"
                      sx={{ borderRadius: 3, height: "100%" }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={2}
                          sx={{ mb: 2 }}
                        >
                          <TrackChanges color="info" />
                          <Typography variant="subtitle1" fontWeight={600}>
                            Performance Metrics
                          </Typography>
                        </Stack>
                        <Box textAlign="center" sx={{ mt: 2 }}>
                          <Typography
                            variant="h2"
                            fontWeight={800}
                            color="primary"
                            gutterBottom
                          >
                            {goalsStats.avgCompletion || 0}%
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={goalsStats.avgCompletion || 0}
                            sx={{
                              height: 16,
                              borderRadius: 8,
                              mb: 2,
                              backgroundColor: "grey.100",
                              "& .MuiLinearProgress-bar": {
                                borderRadius: 8,
                              },
                            }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            Average goal completion rate
                          </Typography>
                          {goalsStats.completedGoals > 0 && (
                            <Typography 
                              variant="body2" 
                              color="success.main" 
                              sx={{ mt: 1, fontWeight: 600 }}
                            >
                              {Math.round((goalsStats.completedGoals / goalsStats.totalGoals) * 100)}% success rate
                            </Typography>
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              ) : (
                <Alert severity="info">
                  No goal data available. Set reading goals to track your progress!
                </Alert>
              )}
            </Box>

            {/* === NOTES === */}
            {book.chapterNotes && book.chapterNotes.length > 0 && (
              <Box sx={{ px: 3, pb: 2 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Chapter Notes
                </Typography>
                <Grid container spacing={2}>
                  {book.chapterNotes
                    .slice(0, 3)
                    .map((note: any, index: number) => (
                      <Grid item xs={12} md={4} key={index}>
                        <Card
                          variant="outlined"
                          sx={{
                            borderRadius: 2,
                            height: 140,
                            display: "flex",
                            px: 2,
                            alignItems: "center",
                          }}
                        >
                          <Avatar
                            sx={{
                              bgcolor: "secondary.main",
                              width: 48,
                              height: 48,
                              mr: 2,
                            }}
                          >
                            <MenuBook />
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2" fontWeight="600">
                              Chapter {note.chapter}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mt: 0.5 }}
                            >
                              {note.note}
                            </Typography>
                            {note.createdAt && (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {formatDate(note.createdAt)}
                              </Typography>
                            )}
                          </Box>
                        </Card>
                      </Grid>
                    ))}
                </Grid>
              </Box>
            )}

            {/* === DESCRIPTION === */}
            {book.description && (
              <Box sx={{ px: 3, pb: 3 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Description
                </Typography>
                <Card variant="outlined" sx={{ borderRadius: 2 }}>
                  <CardContent>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ lineHeight: 1.6 }}
                    >
                      {book.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          p: 3,
          borderTop: `1px solid ${theme.palette.divider}`,
          bgcolor: "grey.50",
        }}
      >
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            borderRadius: 2,
            px: 4,
            py: 1,
            fontSize: "1rem",
          }}
          startIcon={<CloseIcon />}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}