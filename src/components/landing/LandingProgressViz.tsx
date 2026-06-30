"use client";

import {
  Box,
  Container,
  Typography,
  Grid,
  Chip,
  Paper,
  alpha,
} from "@mui/material";
import { BarChart, LocalFireDepartment, AutoStories } from "@mui/icons-material";
import Reveal from "./Reveal";
import ProgressPreview from "./ProgressPreview";
import { DASH, landingChipSx } from "./landingTheme";

const highlights = [
  {
    icon: <LocalFireDepartment sx={{ fontSize: 22 }} />,
    label: "Streak fire meter",
    description: "Daily flames that keep you accountable",
    color: "#FF6B35",
  },
  {
    icon: <AutoStories sx={{ fontSize: 22 }} />,
    label: "Bookshelf levels",
    description: "Rank up from Newcomer to Legend",
    color: DASH.wine,
  },
  {
    icon: <BarChart sx={{ fontSize: 22 }} />,
    label: "Per-book progress",
    description: "Satisfying bars for every read",
    color: DASH.gold,
  },
];

export default function LandingProgressViz() {
  return (
    <Box
      id="progress"
      component="section"
      aria-labelledby="progress-heading"
      sx={{
        py: { xs: 10, md: 14 },
        bgcolor: DASH.dark,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Grid container spacing={{ xs: 6, md: 8 }} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <Reveal>
              <Chip
                label="Your dashboard"
                sx={{
                  ...landingChipSx,
                  mb: 2,
                  bgcolor: alpha(DASH.wine, 0.25),
                  color: alpha(DASH.cream, 0.9),
                }}
              />
              <Typography
                id="progress-heading"
                component="h2"
                sx={{
                  fontFamily: DASH.serif,
                  fontWeight: 700,
                  fontSize: { xs: "2rem", md: "2.5rem" },
                  color: DASH.cream,
                  letterSpacing: "-0.02em",
                  mb: 2,
                }}
              >
                See your reading life{" "}
                <Box component="span" sx={{ color: DASH.gold }}>
                  come alive
                </Box>
              </Typography>
              <Typography
                sx={{
                  color: alpha(DASH.cream, 0.75),
                  fontFamily: DASH.font,
                  lineHeight: 1.7,
                  mb: 4,
                  fontSize: "1.05rem",
                }}
              >
                Streaks, XP, progress bars, and a leveling bookshelf — all in one
                clean dashboard that makes you want to open another chapter.
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {highlights.map((item) => (
                  <Paper
                    key={item.label}
                    elevation={0}
                    sx={{
                      p: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      bgcolor: alpha("#FFFFFF", 0.06),
                      border: "1px solid",
                      borderColor: alpha("#FFFFFF", 0.1),
                      borderRadius: 0,
                      borderTop: `3px solid ${item.color}`,
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
                        bgcolor: alpha(item.color, 0.15),
                        color: item.color,
                        flexShrink: 0,
                      }}
                    >
                      {item.icon}
                    </Box>
                    <Box>
                      <Typography
                        sx={{
                          fontFamily: DASH.font,
                          fontWeight: 700,
                          color: DASH.cream,
                          fontSize: "0.95rem",
                        }}
                      >
                        {item.label}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: DASH.font,
                          color: alpha(DASH.cream, 0.6),
                          fontSize: "0.85rem",
                        }}
                      >
                        {item.description}
                      </Typography>
                    </Box>
                  </Paper>
                ))}
              </Box>
            </Reveal>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Reveal delay={150}>
              <ProgressPreview variant="full" />
            </Reveal>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
