"use client";
import React from "react";
import {
  Box,
  Grid,
  Card,
  Typography,
  Container,
  CircularProgress,
  Alert,
  Paper,
  useTheme,
  alpha,
  Tooltip as MuiTooltip,
  Button,
} from "@mui/material";
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import {
  useCheckAllGoalsQuery,
  useGetAllBooksProgressQuery,
} from "@/redux/api/books";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import BarChartIcon from "@mui/icons-material/BarChart";
import AddIcon from "@mui/icons-material/Add";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import WarningIcon from "@mui/icons-material/Warning";
import { RedeemOutlined } from "@mui/icons-material";

// Month labels for heatmap with smaller font
const MonthLabels = ({ year, cellSize, cellGap }) => {
  const months = [
    { name: "Jan", month: 0 },
    { name: "Feb", month: 1 },
    { name: "Mar", month: 2 },
    { name: "Apr", month: 3 },
    { name: "May", month: 4 },
    { name: "Jun", month: 5 },
    { name: "Jul", month: 6 },
    { name: "Aug", month: 7 },
    { name: "Sep", month: 8 },
    { name: "Oct", month: 9 },
    { name: "Nov", month: 10 },
    { name: "Dec", month: 11 },
  ];

  const getWeekIndex = (date) => {
    const firstDay = new Date(year, 0, 1);
    const dayOfYear = Math.floor(
      (date.getTime() - firstDay.getTime()) / (1000 * 60 * 60 * 24)
    );
    const offset = (firstDay.getDay() + 6) % 7;
    return Math.floor((dayOfYear + offset) / 7);
  };

  return (
    <Box
      sx={{
        position: "relative",
        height: 18,
        userSelect: "none",
        mb: 0.5,
        color: "text.primary",
      }}
    >
      {months.map(({ name, month }) => {
        const date = new Date(year, month, 1);
        const weekIndex = getWeekIndex(date);
        const leftPos = weekIndex * (cellSize + cellGap) + cellSize / 2;
        return (
          <Typography
            key={month}
            sx={{
              position: "absolute",
              left: leftPos,
              top: 0,
              fontSize: 10,
              fontWeight: "bold",
              whiteSpace: "nowrap",
              transform: "translateX(-50%)",
            }}
          >
            {name}
          </Typography>
        );
      })}
    </Box>
  );
};

const ContributionHeatmap = ({ goals }) => {
  const theme = useTheme();
  const year = new Date().getFullYear();

  // Smaller cell size and gap for less clutter
  const cellSize = 12;
  const cellGap = 3;

  const firstDayOfYear = new Date(year, 0, 1);
  const startDate = new Date(firstDayOfYear);
  startDate.setDate(firstDayOfYear.getDate() - firstDayOfYear.getDay());

  const endDate = new Date(year + 1, 0, 1);
  endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

  const weeks = [];
  for (
    let d = startDate.getTime();
    d <= endDate.getTime();
    d += 1000 * 60 * 60 * 24 * 7
  ) {
    const weekStart = new Date(d);
    const week = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + i);
      week.push(day);
    }
    weeks.push(week);
  }

  const dateToGoalsMap = {};
  goals.forEach(({ goal }) => {
    if (!goal) return;
    const start = new Date(goal.startDate);
    const end = new Date(goal.endDate);
    for (
      let dt = new Date(start);
      dt <= end;
      dt = new Date(dt.getTime() + 24 * 60 * 60 * 1000)
    ) {
      const key = dt.toISOString().slice(0, 10);
      if (!dateToGoalsMap[key]) dateToGoalsMap[key] = [];
      dateToGoalsMap[key].push(goal);
    }
  });

  const getColorForDate = (date) => {
    if (date.getFullYear() !== year) return theme.palette.grey[100];
    const key = date.toISOString().slice(0, 10);
    const goalsForDate = dateToGoalsMap[key] || [];
    if (goalsForDate.length === 0) return theme.palette.grey[300];
    if (goalsForDate.some((g) => g.completed))
      return theme.palette.success.main;
    if (
      goalsForDate.some((g) => !g.completed && new Date(g.endDate) < new Date())
    )
      return theme.palette.error.main;
    return theme.palette.warning.main;
  };

  const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <Box sx={{ userSelect: "none", overflowX: "auto", pt: 2 }}>
      <MonthLabels year={year} cellSize={cellSize} cellGap={cellGap} />

      <Box sx={{ display: "flex" }}>
        {/* Day Labels */}
        <Box
          sx={{
            display: "grid",
            gridTemplateRows: `repeat(7, ${cellSize}px)`,
            rowGap: `${cellGap}px`,
            mr: 1,
            fontSize: 10,
            color: theme.palette.text.secondary,
            minWidth: 28,
          }}
        >
          {dayLabels.map((d) => (
            <Typography
              key={d}
              variant="caption"
              sx={{ lineHeight: `${cellSize}px`, pr: 1, textAlign: "right" }}
            >
              {d}
            </Typography>
          ))}
        </Box>

        {/* Heatmap Grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: `repeat(${weeks.length}, ${cellSize}px)`,
            gridTemplateRows: `repeat(7, ${cellSize}px)`,
            columnGap: `${cellGap}px`,
            rowGap: `${cellGap}px`,
          }}
        >
          {weeks.flatMap((week, colIndex) =>
            week.map((date) => {
              const goalsForDate =
                dateToGoalsMap[date.toISOString().slice(0, 10)] || [];
              const color = getColorForDate(date);
              const dayIndex = (date.getDay() + 6) % 7;

              const tooltipContent = (
                <Box sx={{ maxWidth: 350, whiteSpace: "normal" }}>
                  <Typography
                    variant="subtitle2"
                    fontWeight="bold"
                    gutterBottom
                  >
                    {date.toDateString()}
                  </Typography>
                  {goalsForDate.length === 0 ? (
                    <Typography variant="body2">No goals</Typography>
                  ) : (
                    goalsForDate.map((goal, idx) => {
                      const book = goal.book || {};
                      const progress = goal.progress ?? 0;
                      const status = goal.completed
                        ? "Completed"
                        : new Date(goal.endDate) < new Date()
                        ? "Overdue"
                        : "In Progress";
                      return (
                        <Box
                          key={idx}
                          sx={{ mb: idx === goalsForDate.length - 1 ? 0 : 1 }}
                        >
                          <Typography variant="body2" fontWeight="bold">
                            {book.title || "Untitled Book"}
                          </Typography>
                          <Typography variant="body2" sx={{ fontSize: 12 }}>
                            Type: {goal.type} | Target: {goal.target} |
                            Progress: {progress} | Timeframe: {goal.timeFrame} |
                            Status: {status}
                          </Typography>
                        </Box>
                      );
                    })
                  )}
                </Box>
              );

              return (
                <MuiTooltip
                  key={date.toISOString()}
                  title={tooltipContent}
                  arrow
                  placement="top"
                  componentsProps={{ tooltip: { sx: { fontSize: 12 } } }}
                >
                  <Box
                    sx={{
                      width: cellSize,
                      height: cellSize,
                      backgroundColor: color,
                      borderRadius: 1,
                      cursor:
                        date.getFullYear() === year ? "pointer" : "default",
                      opacity: date.getFullYear() === year ? 1 : 0.25,
                      transition: "transform 0.15s",
                      gridColumnStart: colIndex + 1,
                      gridRowStart: dayIndex + 1,
                      "&:hover": {
                        transform:
                          date.getFullYear() === year
                            ? "scale(1.3)"
                            : undefined,
                        outline:
                          date.getFullYear() === year
                            ? `2px solid ${theme.palette.primary.main}`
                            : undefined,
                      },
                    }}
                  />
                </MuiTooltip>
              );
            })
          )}
        </Box>
      </Box>

      {/* Legend */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          mt: 2,
          userSelect: "none",
          flexWrap: "wrap",
        }}
      >
        {[
          { label: "Goal Completed", color: theme.palette.success.main },
          { label: "In Progress", color: theme.palette.warning.main },
          { label: "Overdue", color: theme.palette.error.main },
          { label: "No Goals", color: theme.palette.grey[300] },
        ].map((item, idx) => (
          <Box key={idx} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 16,
                height: 16,
                backgroundColor: item.color,
                borderRadius: 3,
              }}
            />
            <Typography variant="caption">{item.label}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

// Remove memo() from the main component export
export default function Analytics() {
  const {
    data,
    error: booksError,
    isLoading: booksLoading,
  } = useGetAllBooksProgressQuery();

  const {
    data: allReadingGoals,
    isLoading: goalsLoading,
    isError: goalsError,
  } = useCheckAllGoalsQuery();

  console.log("Books Progress Data:", data);
  console.log("All Reading Goals:", allReadingGoals);
  console.log("Goals Error:", goalsError);

  const theme = useTheme();
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82CA9D",
  ];

  // Mock reading trend data
  const readingTrendData = [
    { month: "Jan", pages: 0 },
    { month: "Feb", pages: 0 },
    { month: "Mar", pages: 0 },
    { month: "Apr", pages: 0 },
    { month: "May", pages: 0 },
    { month: "Jun", pages: 0 },
    { month: "Jul", pages: 0 },
    { month: "Aug", pages: 0 },
    { month: "Sep", pages: 0 },
    { month: "Oct", pages: 0 },
    { month: "Nov", pages: 0 },
    { month: "Dec", pages: 0 },
  ];

  if (booksLoading || goalsLoading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="50vh"
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  // Handle API errors gracefully
  if (booksError) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load reading data. Please try again later.
        </Alert>
        <Box textAlign="center" mt={4}>
          <Button
            variant="contained"
            onClick={() => window.location.reload()}
            startIcon={<AutorenewIcon />}
          >
            Retry
          </Button>
        </Box>
      </Container>
    );
  }

  // Check if user has no data (new user)
  const hasNoBooks = !data || !data.books || data.books.length === 0;
  const hasGoals =
    allReadingGoals &&
    allReadingGoals.goals &&
    allReadingGoals.goals.length > 0;

  // If no books data, show empty state regardless of goals API status
  if (hasNoBooks) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="60vh"
          textAlign="center"
        >
          {/* Welcome Illustration */}
          <Box
            sx={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 3,
            }}
          >
            <TrendingUpIcon
              sx={{
                fontSize: 60,
                color: theme.palette.primary.main,
              }}
            />
          </Box>

          <Typography
            variant="h4"
            fontWeight="bold"
            gutterBottom
            color="primary"
          >
            Welcome to Your Reading Analytics!
          </Typography>

          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: 600, mb: 4 }}
          >
            Start your reading journey and track your progress with beautiful
            analytics. Add your first book to unlock powerful insights about
            your reading habits.
          </Typography>

          {/* Show goals API error as warning if it exists */}
          {goalsError && (
            <Alert severity="warning" sx={{ mb: 3, maxWidth: 600 }}>
              Note: Goal tracking features are currently unavailable, but you
              can still track your reading progress.
            </Alert>
          )}

          {/* Action Cards */}
          <Grid container spacing={3} sx={{ maxWidth: 800, mb: 4 }}>
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  p: 3,
                  textAlign: "center",
                  border: `2px dashed ${alpha(
                    theme.palette.primary.main,
                    0.2
                  )}`,
                  backgroundColor: alpha(theme.palette.primary.main, 0.02),
                  height: "100%",
                }}
              >
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2,
                    mx: "auto",
                  }}
                >
                  <AddIcon color="primary" />
                </Box>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Add Your First Book
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Start by adding books to your library. Track your progress and
                  build your reading history.
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  p: 3,
                  textAlign: "center",
                  border: `2px dashed ${alpha(
                    theme.palette.success.main,
                    0.2
                  )}`,
                  backgroundColor: alpha(theme.palette.success.main, 0.02),
                  height: "100%",
                }}
              >
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    backgroundColor: alpha(theme.palette.success.main, 0.1),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2,
                    mx: "auto",
                  }}
                >
                  <EmojiEventsIcon color="success" />
                </Box>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {goalsError
                    ? "Goal Features Coming Soon"
                    : "Set Reading Goals"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {goalsError
                    ? "Goal tracking will be available soon. Stay tuned for updates!"
                    : "Create reading goals to stay motivated and track your achievements."}
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  p: 3,
                  textAlign: "center",
                  border: `2px dashed ${alpha(
                    theme.palette.warning.main,
                    0.2
                  )}`,
                  backgroundColor: alpha(theme.palette.warning.main, 0.02),
                  height: "100%",
                }}
              >
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    backgroundColor: alpha(theme.palette.warning.main, 0.1),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2,
                    mx: "auto",
                  }}
                >
                  <BarChartIcon color="warning" />
                </Box>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  View Analytics
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Watch your reading statistics grow with interactive charts and
                  progress tracking.
                </Typography>
              </Card>
            </Grid>
          </Grid>

          {/* Call to Action Buttons */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <Button
              variant="contained"
              size="large"
              startIcon={<AddIcon />}
              href="/books/add"
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
              }}
            >
              Add Your First Book
            </Button>
            {!goalsError && (
              <Button
                variant="outlined"
                size="large"
                startIcon={<EmojiEventsIcon />}
                href="/goals"
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                }}
              >
                Set Reading Goals
              </Button>
            )}
          </Box>

          {/* Preview of what they'll see */}
          <Paper
            sx={{
              mt: 6,
              p: 4,
              backgroundColor: alpha(theme.palette.primary.main, 0.02),
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              borderRadius: 3,
            }}
          >
            <Typography
              variant="h6"
              fontWeight="bold"
              gutterBottom
              textAlign="center"
            >
              What You'll See Here
            </Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {[
                "📈 Reading progress over time",
                "📊 Book completion statistics",
                "📚 Reading habit insights",
                "📖 Personalized recommendations",
                ...(goalsError
                  ? []
                  : [
                      "🎯 Goal achievement tracking",
                      "🏆 Achievement milestones",
                    ]),
              ].map((feature, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        backgroundColor: theme.palette.primary.main,
                      }}
                    />
                    <Typography variant="body2">{feature}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Box>
      </Container>
    );
  }

  // User has books data - proceed with analytics display
  const { books = [], statistics = {} } = data;
  const goals = goalsError ? [] : allReadingGoals?.goals || [];

  const safeStatistics = {
    totalBooks: statistics.totalBooks || books.length || 0,
    completedBooks: statistics.completedBooks || 0,
    inProgressBooks: statistics.inProgressBooks || 0,
    averageCompletion: statistics.averageCompletion || 0,
    completionRate: statistics.completionRate || 0,
    ...statistics,
  };

  // SUMMARY CARD DATA
  const summaryCards = [
    {
      title: "Total Books",
      value: safeStatistics.totalBooks,
      icon: <LibraryBooksIcon fontSize="large" />,
      color: theme.palette.primary.main,
    },
    {
      title: "Completed Books",
      value: safeStatistics.completedBooks,
      icon: <CheckCircleIcon fontSize="large" />,
      color: theme.palette.success.main,
    },
    {
      title: "In Progress",
      value: safeStatistics.inProgressBooks,
      icon: <AutorenewIcon fontSize="large" />,
      color: theme.palette.warning.main,
    },
  ];

  // Book completion data for bar chart
  const completionData = books.map((book) => ({
    name:
      book.title?.length > 15
        ? `${book.title.substring(0, 15)}...`
        : book.title || "Untitled",
    completion: book.completionPercentage || 0,
    fullName: book.title || "Untitled",
  }));

  // Status distribution data for pie chart
  const statusData = [
    { name: "Completed", value: safeStatistics.completedBooks },
    { name: "In Progress", value: safeStatistics.inProgressBooks },
    {
      name: "Planned",
      value: Math.max(
        0,
        safeStatistics.totalBooks -
          safeStatistics.completedBooks -
          safeStatistics.inProgressBooks
      ),
    },
  ];

  // Sorted books by completion percentage
  const sortedByCompletion = [...books].sort(
    (a, b) => (b.completionPercentage || 0) - (a.completionPercentage || 0)
  );

  // Aggregate pages read
  const totalPagesRead = books.reduce(
    (sum, b) => sum + (b.pages?.current || 0),
    0
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {goalsError && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Goal tracking features are temporarily unavailable. Your book
          analytics are still working perfectly!
        </Alert>
      )}

      {/* Summary Cards */}
      <Grid container spacing={10} mb={4} justifyContent="center">
        {summaryCards.map((card, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <Card sx={{ display: "flex", alignItems: "center", p: 2 }}>
              <Box sx={{ mr: 2, color: card.color }}>{card.icon}</Box>
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  {card.value}
                </Typography>
                <Typography variant="subtitle2">{card.title}</Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid
        container
        spacing={4}
        mb={4}
        justifyContent="space-around"
        flexDirection={{ xs: "column", md: "row", lg: "row" }}
      >
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 2,
              height: "100%",
              width: "50vw",
            }}
          >
            <Typography
              variant="h6"
              fontWeight="bold"
              mb={2}
              textAlign="center"
            >
              📈 Reading Trend
            </Typography>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={readingTrendData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f0f0f0"
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#666", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#666", fontSize: 12 }}
                />
                <Tooltip
                  cursor={{ fill: "rgba(136, 132, 216, 0.1)" }}
                  contentStyle={{
                    borderRadius: 8,
                    border: "none",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                  formatter={(value) => [`${value} pages`, "Pages"]}
                />
                <Bar
                  dataKey="pages"
                  fill="#8884d8"
                  radius={[4, 4, 0, 0]}
                  name="Pages Read"
                >
                  {readingTrendData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 2,
              height: "100%",
              width: "50vw",
            }}
          >
            <Typography
              variant="h6"
              fontWeight="bold"
              mb={2}
              textAlign="center"
            >
              🥧 Book Status Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                >
                  {statusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      stroke="#fff"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value} books`, "Count"]}
                  contentStyle={{ borderRadius: 8 }}
                />
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{ fontSize: 16, fontWeight: "bold" }}
                >
                  {statusData.reduce((acc, curr) => acc + curr.value, 0)} Total
                </text>
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={4} mb={4} justifyContent="center">
        {/* Insights */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              height: "100%",
              backgroundColor: theme.palette.background.paper,
              p: 3,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              boxShadow: 3,
              borderRadius: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 2,
                justifyContent: "center",
              }}
            >
              <BarChartIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
              <Typography variant="h6" fontWeight="bold">
                Insights
              </Typography>
            </Box>
            <Grid container spacing={2}>
              {[
                {
                  label: "Completed Books",
                  value: `${safeStatistics.completedBooks} / ${safeStatistics.totalBooks}`,
                  bgColor: alpha(theme.palette.primary.main, 0.08),
                },
                {
                  label: "Average Completion",
                  value: `${safeStatistics.averageCompletion}%`,
                  bgColor: alpha(theme.palette.success.main, 0.08),
                },
                {
                  label: "Total Pages Read",
                  value: totalPagesRead.toLocaleString(),
                  bgColor: alpha(theme.palette.info.main, 0.08),
                },
                {
                  label: "Active Goals",
                  value: goalsError ? "N/A" : goals.length,
                  bgColor: alpha(theme.palette.warning.main, 0.08),
                },
              ].map((item, idx) => (
                <Grid item xs={6} key={idx}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 1.5,
                      backgroundColor: item.bgColor,
                      borderRadius: 1.5,
                      height: "100%",
                    }}
                  >
                    <Typography variant="body2" gutterBottom>
                      {item.label}
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {item.value}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grid>
      </Grid>

      {!goalsError && goals.length > 0 && (
        <Box sx={{ width: "100%", maxWidth: 1200, mx: "auto" }}>
          <Card
            sx={{
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
              backgroundColor: theme.palette.background.paper,
              p: 3,
            }}
          >
            <ContributionHeatmap goals={goals} />
          </Card>
        </Box>
      )}

      <Paper
        sx={{
          p: 3,
          mt: 4,
          borderRadius: 3,
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          border: "1px solid #e0e0e0",
        }}
      >
        <Typography
          variant="h6"
          fontWeight="bold"
          mb={3}
          color="secondary.main"
        >
          📈 Reading Completion Overview
        </Typography>
        <ResponsiveContainer
          width="100%"
          height={completionData.length * 60 + 40}
        >
          <BarChart
            data={completionData}
            layout="vertical"
            margin={{ top: 10, right: 30, left: 80, bottom: 10 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={true}
              stroke="#f0f0f0"
            />
            <XAxis
              type="number"
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#666", fontSize: 12 }}
            />
            <YAxis
              type="category"
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#666", fontSize: 12 }}
              width={70}
            />
            <Tooltip
              formatter={(value) => [`${value}%`, "Completion"]}
              contentStyle={{
                borderRadius: 8,
                border: "none",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            />
            <Bar
              dataKey="completion"
              fill={theme.palette.primary.main}
              radius={[0, 4, 4, 0]}
              name="Completion %"
            >
              {completionData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.completion >= 100
                      ? "#4CAF50"
                      : entry.completion >= 75
                      ? "#2196F3"
                      : entry.completion >= 50
                      ? "#FF9800"
                      : "#F44336"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Paper>

      {/* Encouragement message */}
      <Alert severity="info" sx={{ mt: 3 }}>
        Great progress! Keep reading to build your analytics history.
      </Alert>
    </Container>
  );
}