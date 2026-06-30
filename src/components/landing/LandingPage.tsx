"use client";

import { Box } from "@mui/material";
import LandingHero from "./LandingHero";
import LandingFeatures from "./LandingFeatures";
import LandingHowItWorks from "./LandingHowItWorks";
import LandingProgressViz from "./LandingProgressViz";
import LandingSocialProof from "./LandingSocialProof";
import LandingCTA from "./LandingCTA";
import LandingFooter from "./LandingFooter";

import { DASH } from "@/components/dashboard/dashboardTheme";

export default function LandingPage() {
  return (
    <Box sx={{ overflow: "hidden", bgcolor: DASH.cream }}>
      <LandingHero />
      <LandingFeatures />
      <LandingHowItWorks />
      <LandingProgressViz />
      <LandingSocialProof />
      <LandingCTA />
      <LandingFooter />
    </Box>
  );
}
