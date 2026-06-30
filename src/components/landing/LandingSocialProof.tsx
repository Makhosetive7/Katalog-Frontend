"use client";

import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Avatar,
  alpha,
} from "@mui/material";
import Reveal from "./Reveal";
import { testimonials, stats } from "./landingData";
import { DASH, landingCardSx } from "./landingTheme";

export default function LandingSocialProof() {
  return (
    <Box
      component="section"
      aria-labelledby="social-proof-heading"
      sx={{ py: { xs: 10, md: 14 }, bgcolor: DASH.cream }}
    >
      <Container maxWidth="lg">
        <Reveal>
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Typography
              id="social-proof-heading"
              component="h2"
              sx={{
                fontFamily: DASH.serif,
                fontWeight: 700,
                fontSize: { xs: "2rem", md: "2.5rem" },
                letterSpacing: "-0.02em",
                mb: 2,
              }}
            >
              Readers are leveling up
            </Typography>
            <Typography
              color="text.secondary"
              sx={{
                fontFamily: DASH.font,
                maxWidth: 480,
                mx: "auto",
                lineHeight: 1.7,
              }}
            >
              Students and young readers are building streaks, finishing books, and
              actually remembering what they read.
            </Typography>
          </Box>
        </Reveal>

        <Grid container spacing={3} sx={{ mb: 8 }}>
          {stats.map((stat, i) => (
            <Grid key={stat.label} size={{ xs: 12, sm: 4 }}>
              <Reveal delay={i * 80}>
                <Paper
                  elevation={0}
                  sx={{
                    ...landingCardSx(DASH.wine),
                    p: 3,
                    textAlign: "center",
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: DASH.font,
                      fontWeight: 800,
                      fontSize: { xs: "2rem", md: "2.5rem" },
                      color: DASH.wine,
                      mb: 0.5,
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: DASH.font,
                      color: "text.secondary",
                      fontSize: "0.9rem",
                    }}
                  >
                    {stat.label}
                  </Typography>
                </Paper>
              </Reveal>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3}>
          {testimonials.map((t, i) => (
            <Grid key={t.name} size={{ xs: 12, md: 4 }}>
              <Reveal delay={i * 100}>
                <Paper
                  elevation={0}
                  className="landing-feature-card"
                  sx={{
                    ...landingCardSx(t.color),
                    p: 3.5,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: DASH.serif,
                      fontSize: "2rem",
                      lineHeight: 1,
                      color: alpha(t.color, 0.4),
                      mb: 1.5,
                    }}
                    aria-hidden="true"
                  >
                    &ldquo;
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: DASH.font,
                      lineHeight: 1.7,
                      color: "text.primary",
                      flex: 1,
                      mb: 3,
                      fontSize: "0.95rem",
                    }}
                  >
                    {t.quote}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Avatar
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 0,
                        bgcolor: alpha(t.color, 0.15),
                        color: t.color,
                        fontFamily: DASH.font,
                        fontWeight: 700,
                        fontSize: "0.9rem",
                      }}
                    >
                      {t.avatar}
                    </Avatar>
                    <Box>
                      <Typography
                        sx={{
                          fontFamily: DASH.font,
                          fontWeight: 700,
                          fontSize: "0.9rem",
                        }}
                      >
                        {t.name}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: DASH.font,
                          color: "text.secondary",
                          fontSize: "0.8rem",
                        }}
                      >
                        {t.role}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Reveal>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
