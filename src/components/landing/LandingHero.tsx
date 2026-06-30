"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Container,
  Typography,
  Grid,
  Stack,
  Chip,
  alpha,
  CircularProgress,
} from "@mui/material";
import { ArrowForward, PlayArrow } from "@mui/icons-material";
import { useDemoLoginMutation } from "@/redux/api/books";
import { setAuthSession } from "@/utils/authStorage";
import ProgressPreview from "./ProgressPreview";
import { DASH, landingButtonPrimarySx, landingButtonOutlinedSx, landingChipSx } from "./landingTheme";

export default function LandingHero() {
  const router = useRouter();
  const [demoLogin, { isLoading: isDemoLoading }] = useDemoLoginMutation();

  const handleDemo = async () => {
    try {
      const result = await demoLogin().unwrap();
      setAuthSession(result.token, result.user);
      router.refresh();
      router.push("/dashboard");
    } catch (err) {
      console.error("Demo login failed:", err);
    }
  };

  return (
    <Box
      component="section"
      aria-labelledby="hero-heading"
      sx={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        bgcolor: DASH.dark,
        overflow: "hidden",
      }}
    >
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1, py: { xs: 12, md: 6 } }}>
        <Grid container spacing={{ xs: 6, md: 4 }} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <Box className="landing-hero-enter">
              <Chip
                label="Free for students & readers"
                sx={{
                  ...landingChipSx,
                  mb: 3,
                  bgcolor: alpha("#FF6B35", 0.15),
                  color: "#FFB088",
                  border: "1px solid rgba(255,107,53,0.35)",
                }}
              />
              <Typography
                id="hero-heading"
                component="h1"
                sx={{
                  color: DASH.cream,
                  fontFamily: DASH.serif,
                  fontWeight: 700,
                  fontSize: { xs: "2.4rem", sm: "3rem", md: "3.5rem" },
                  lineHeight: 1.1,
                  letterSpacing: "-0.03em",
                  mb: 2.5,
                }}
              >
                Track every page.{" "}
                <Box component="span" sx={{ color: DASH.gold }}>
                  Build your streak.
                </Box>
              </Typography>
              <Typography
                sx={{
                  color: alpha(DASH.cream, 0.8),
                  fontSize: { xs: "1.05rem", md: "1.2rem" },
                  lineHeight: 1.65,
                  mb: 4,
                  maxWidth: 500,
                  fontFamily: DASH.font,
                  fontWeight: 400,
                }}
              >
                Katalog turns books and articles into a game — log progress, earn XP,
                unlock badges, and watch your reading life level up.
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
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
                  variant="outlined"
                  size="large"
                  onClick={handleDemo}
                  disabled={isDemoLoading}
                  startIcon={
                    isDemoLoading ? (
                      <CircularProgress size={20} sx={{ color: DASH.cream }} />
                    ) : (
                      <PlayArrow />
                    )
                  }
                  sx={{
                    ...landingButtonOutlinedSx,
                    py: 1.6,
                    px: 3.5,
                    fontSize: "1rem",
                    color: DASH.cream,
                    borderColor: alpha(DASH.cream, 0.35),
                    "&:hover": {
                      borderColor: DASH.gold,
                      bgcolor: alpha(DASH.gold, 0.1),
                    },
                  }}
                >
                  {isDemoLoading ? "Loading…" : "Try Demo"}
                </Button>
              </Stack>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              className="landing-hero-enter landing-hero-enter--delayed"
              sx={{ display: "flex", justifyContent: "center", position: "relative" }}
            >
              <ProgressPreview variant="compact" />
            </Box>
          </Grid>
        </Grid>
      </Container>

      <Typography
        className="landing-scroll-hint"
        aria-hidden="true"
        sx={{
          position: "absolute",
          bottom: 32,
          left: "50%",
          transform: "translateX(-50%)",
          color: alpha(DASH.cream, 0.45),
          fontSize: "0.85rem",
          fontFamily: DASH.font,
        }}
      >
        Scroll to explore ↓
      </Typography>
    </Box>
  );
}
