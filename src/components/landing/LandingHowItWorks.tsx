"use client";

import { Box, Container, Typography, Grid, Chip, alpha } from "@mui/material";
import { Timeline } from "@mui/icons-material";
import Reveal from "./Reveal";
import { steps } from "./landingData";
import { DASH, landingChipSx } from "./landingTheme";

export default function LandingHowItWorks() {
  return (
    <Box
      id="how-it-works"
      component="section"
      aria-labelledby="how-it-works-heading"
      sx={{
        py: { xs: 10, md: 14 },
        bgcolor: "#F0EAE0",
      }}
    >
      <Container maxWidth="lg">
        <Reveal>
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <Chip
              icon={<Timeline sx={{ fontSize: 18 }} />}
              label="How it works"
              sx={{
                ...landingChipSx,
                mb: 2,
                bgcolor: alpha(DASH.green, 0.1),
                color: "#3D8C00",
              }}
            />
            <Typography
              id="how-it-works-heading"
              component="h2"
              sx={{
                fontFamily: DASH.serif,
                fontWeight: 700,
                fontSize: { xs: "2rem", md: "2.75rem" },
                letterSpacing: "-0.02em",
              }}
            >
              Up and reading in 3 steps
            </Typography>
          </Box>
        </Reveal>

        <Grid container spacing={4}>
          {steps.map((item, i) => (
            <Grid key={item.step} size={{ xs: 12, md: 4 }}>
              <Reveal delay={i * 120}>
                <Box
                  sx={{
                    textAlign: "center",
                    px: 2,
                    position: "relative",
                  }}
                >
                  {i < steps.length - 1 && (
                    <Box
                      aria-hidden="true"
                      className="landing-step-connector"
                      sx={{
                        display: { xs: "none", md: "block" },
                        position: "absolute",
                        top: 36,
                        right: -24,
                        width: 48,
                        height: 2,
                        bgcolor: alpha(DASH.green, 0.3),
                      }}
                    />
                  )}
                  <Box
                    sx={{
                      width: 72,
                      height: 72,
                      borderRadius: 0,
                      mx: "auto",
                      mb: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "2rem",
                      bgcolor: "#FFFFFF",
                      border: "1px solid",
                      borderColor: alpha(DASH.green, 0.25),
                      borderTop: `3px solid ${DASH.green}`,
                    }}
                  >
                    {item.emoji}
                  </Box>
                  <Typography
                    sx={{
                      fontFamily: DASH.font,
                      fontWeight: 800,
                      fontSize: "0.75rem",
                      color: DASH.green,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      mb: 1,
                    }}
                  >
                    Step {item.step}
                  </Typography>
                  <Typography
                    component="h3"
                    variant="h5"
                    sx={{ mb: 1.5, fontFamily: DASH.font, fontWeight: 700 }}
                  >
                    {item.title}
                  </Typography>
                  <Typography
                    color="text.secondary"
                    sx={{ fontFamily: DASH.font, lineHeight: 1.7 }}
                  >
                    {item.description}
                  </Typography>
                </Box>
              </Reveal>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
