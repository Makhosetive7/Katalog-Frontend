"use client";

import Link from "next/link";
import { Box, Button, Container, Typography, Paper, Stack, alpha } from "@mui/material";
import { ArrowForward } from "@mui/icons-material";
import Reveal from "./Reveal";
import { DASH, landingButtonOutlinedSx, landingButtonPrimarySx, landingCardSx } from "./landingTheme";

export default function LandingCTA() {
  return (
    <Box component="section" aria-labelledby="cta-heading" sx={{ py: { xs: 10, md: 14 }, bgcolor: DASH.cream }}>
      <Container maxWidth="md">
        <Reveal>
          <Paper
            elevation={0}
            sx={{
              ...landingCardSx(DASH.wine),
              p: { xs: 4, md: 7 },
              textAlign: "center",
              bgcolor: alpha(DASH.wine, 0.04),
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Typography
              id="cta-heading"
              component="h2"
              sx={{
                fontFamily: DASH.serif,
                fontWeight: 700,
                fontSize: { xs: "1.75rem", md: "2.5rem" },
                letterSpacing: "-0.02em",
                mb: 2,
                position: "relative",
              }}
            >
              Ready to start your reading streak?
            </Typography>
            <Typography
              color="text.secondary"
              sx={{
                mb: 4,
                fontFamily: DASH.font,
                lineHeight: 1.7,
                fontSize: "1.05rem",
                maxWidth: 440,
                mx: "auto",
                position: "relative",
              }}
            >
              Join free today. Add your first book, log a few pages, and watch
              the progress bars fill up. It&apos;s weirdly satisfying.
            </Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              justifyContent="center"
              sx={{ position: "relative" }}
            >
              <Button
                component={Link}
                href="/auth/register"
                variant="contained"
                size="large"
                endIcon={<ArrowForward />}
                sx={{
                  ...landingButtonPrimarySx,
                  py: 1.6,
                  px: 4,
                  fontSize: "1.05rem",
                  bgcolor: DASH.green,
                  color: "#FFFFFF",
                  "&:hover": { bgcolor: "#4CAD02", boxShadow: "none" },
                }}
              >
                Start Tracking
              </Button>
              <Button
                component={Link}
                href="/auth/login"
                variant="outlined"
                size="large"
                sx={{
                  ...landingButtonOutlinedSx,
                  py: 1.6,
                  px: 4,
                  borderColor: alpha(DASH.wine, 0.25),
                  color: "text.primary",
                  "&:hover": { borderColor: DASH.wine, bgcolor: alpha(DASH.wine, 0.04) },
                }}
              >
                Log In
              </Button>
            </Stack>
          </Paper>
        </Reveal>
      </Container>
    </Box>
  );
}
