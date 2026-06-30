"use client";

import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Chip,
  alpha,
} from "@mui/material";
import { Bolt } from "@mui/icons-material";
import Reveal from "./Reveal";
import { features } from "./landingData";
import { DASH, landingCardSx, landingChipSx } from "./landingTheme";

export default function LandingFeatures() {
  return (
    <Box
      id="features"
      component="section"
      aria-labelledby="features-heading"
      sx={{ py: { xs: 10, md: 14 }, bgcolor: DASH.cream }}
    >
      <Container maxWidth="lg">
        <Reveal>
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <Chip
              icon={<Bolt sx={{ fontSize: 18 }} />}
              label="Features"
              sx={{
                ...landingChipSx,
                mb: 2,
                bgcolor: alpha(DASH.wine, 0.08),
                color: DASH.wine,
              }}
            />
            <Typography
              id="features-heading"
              component="h2"
              sx={{
                fontFamily: DASH.serif,
                fontWeight: 700,
                fontSize: { xs: "2rem", md: "2.75rem" },
                letterSpacing: "-0.02em",
                mb: 2,
              }}
            >
              Reading, but make it fun
            </Typography>
            <Typography
              color="text.secondary"
              sx={{
                maxWidth: 540,
                mx: "auto",
                fontFamily: DASH.font,
                lineHeight: 1.7,
                fontSize: "1.05rem",
              }}
            >
              Everything you need to stay consistent — streaks, stats, notes, and
              a shelf that actually reflects what you&apos;ve read.
            </Typography>
          </Box>
        </Reveal>

        <Grid container spacing={3}>
          {features.map((feature, i) => (
            <Grid key={feature.title} size={{ xs: 12, sm: 6, md: 4 }}>
              <Reveal delay={i * 80}>
                <Paper
                  elevation={0}
                  className="landing-feature-card"
                  sx={{
                    ...landingCardSx(feature.color),
                    p: 3.5,
                    height: "100%",
                    textAlign: "center",
                  }}
                >
                  <Typography
                    component="h3"
                    variant="h6"
                    sx={{ mb: 1.5, fontFamily: DASH.font, fontWeight: 700 }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    color="text.secondary"
                    sx={{ fontFamily: DASH.font, lineHeight: 1.65, textAlign: "left" }}
                  >
                    {feature.description}
                  </Typography>
                </Paper>
              </Reveal>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
