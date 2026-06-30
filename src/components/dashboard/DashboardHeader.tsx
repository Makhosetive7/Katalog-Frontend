"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Box, Button, Typography, alpha } from "@mui/material";
import { Add, ArrowForward } from "@mui/icons-material";
import { DASH } from "./dashboardTheme";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function DashboardHeader() {
  const [name, setName] = useState("Reader");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (!raw) return;
      const user = JSON.parse(raw);
      if (user?.profile?.firstName) setName(user.profile.firstName);
      else if (user?.username) setName(user.username);
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { xs: "flex-start", sm: "center" },
        justifyContent: "space-between",
        gap: 2,
        mb: { xs: 3, md: 4 },
      }}
    >
      <Box>
        <Typography
          sx={{
            fontFamily: DASH.font,
            fontSize: "0.8rem",
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: alpha(DASH.wine, 0.55),
            mb: 0.5,
          }}
        >
          Dashboard
        </Typography>
        <Typography
          component="h1"
          sx={{
            fontFamily: DASH.serif,
            fontWeight: 700,
            fontSize: { xs: "1.5rem", md: "1.85rem" },
            color: DASH.dark,
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
          }}
        >
          {getGreeting()}, {name}
        </Typography>
        <Typography
          sx={{
            fontFamily: DASH.font,
            fontSize: "0.875rem",
            color: alpha(DASH.dark, 0.5),
            mt: 0.5,
          }}
        >
          Here&apos;s how your reading is going.
        </Typography>
      </Box>

      <Button
        component={Link}
        href="/books/inProgress"
        variant="contained"
        startIcon={<Add />}
        endIcon={<ArrowForward sx={{ fontSize: "16px !important" }} />}
        sx={{
          textTransform: "none",
          fontFamily: DASH.font,
          fontWeight: 600,
          fontSize: "0.875rem",
          bgcolor: DASH.dark,
          color: DASH.cream,
          px: 2.5,
          py: 1,
          borderRadius: 0,
          boxShadow: "none",
          flexShrink: 0,
          "&:hover": { bgcolor: DASH.wineDark, boxShadow: "none" },
        }}
      >
        Add book
      </Button>
    </Box>
  );
}
