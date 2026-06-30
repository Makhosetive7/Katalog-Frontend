"use client";

import Link from "next/link";
import {
  Box,
  Button,
  Typography,
  Grid,
  alpha,
} from "@mui/material";
import {
  AutoStories,
  EmojiEvents,
  BarChart,
  ArrowForward,
} from "@mui/icons-material";
import { DASH } from "./dashboardTheme";

const steps = [
  {
    icon: <AutoStories sx={{ fontSize: 22 }} />,
    title: "Add a book",
    description: "Drop in what you're reading right now.",
    color: DASH.wine,
  },
  {
    icon: <EmojiEvents sx={{ fontSize: 22 }} />,
    title: "Set a goal",
    description: "Pages per week, chapters, or finish dates.",
    color: DASH.gold,
  },
  {
    icon: <BarChart sx={{ fontSize: 22 }} />,
    title: "Track progress",
    description: "Watch your stats and streaks grow.",
    color: DASH.green,
  },
];

export default function DashboardEmptyState({ goalsError }: { goalsError?: boolean }) {
  return (
    <Box
      sx={{
        maxWidth: 720,
        mx: "auto",
        textAlign: "center",
        py: { xs: 4, md: 8 },
        px: 2,
      }}
    >
      <Typography
        sx={{
          fontFamily: DASH.serif,
          fontWeight: 700,
          fontSize: { xs: "1.75rem", md: "2.25rem" },
          color: DASH.dark,
          letterSpacing: "-0.02em",
          mb: 1.5,
        }}
      >
        Your reading story starts here
      </Typography>
      <Typography
        sx={{
          fontFamily: DASH.font,
          fontSize: "0.95rem",
          color: alpha(DASH.dark, 0.55),
          lineHeight: 1.65,
          mb: 4,
          maxWidth: 440,
          mx: "auto",
        }}
      >
        Add your first book to unlock progress tracking, stats, and goal heatmaps.
      </Typography>

      <Grid container spacing={2} sx={{ mb: 4, textAlign: "left" }}>
        {steps.map((step) => (
          <Grid key={step.title} size={{ xs: 12, sm: 4 }}>
            <Box
              sx={{
                p: 2.5,
                borderRadius: 0,
                bgcolor: "#FFFFFF",
                border: `1px solid ${alpha(DASH.wine, 0.08)}`,
                height: "100%",
              }}
            >
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: alpha(step.color, 0.1),
                  color: step.color,
                  mb: 1.5,
                }}
              >
                {step.icon}
              </Box>
              <Typography
                sx={{ fontFamily: DASH.font, fontWeight: 700, fontSize: "0.9rem", mb: 0.5 }}
              >
                {step.title}
              </Typography>
              <Typography
                sx={{
                  fontFamily: DASH.font,
                  fontSize: "0.8125rem",
                  color: alpha(DASH.dark, 0.5),
                  lineHeight: 1.5,
                }}
              >
                {step.description}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

      <Button
        component={Link}
        href="/books/inProgress"
        variant="contained"
        endIcon={<ArrowForward />}
        sx={{
          textTransform: "none",
          fontFamily: DASH.font,
          fontWeight: 600,
          bgcolor: DASH.dark,
          color: DASH.cream,
          px: 3,
          py: 1.25,
          borderRadius: 0,
          boxShadow: "none",
          "&:hover": { bgcolor: DASH.wineDark, boxShadow: "none" },
        }}
      >
        Add your first book
      </Button>

      {goalsError && (
        <Typography
          sx={{
            fontFamily: DASH.font,
            fontSize: "0.8rem",
            color: alpha(DASH.dark, 0.45),
            mt: 3,
          }}
        >
          Goal tracking is temporarily unavailable — book progress still works.
        </Typography>
      )}
    </Box>
  );
}
