"use client";

import Link from "next/link";
import { Box, Container, Typography, Stack, alpha } from "@mui/material";
import { DASH } from "./landingTheme";

const footerLinks = [
  { label: "Features", href: "/#features" },
  { label: "How it Works", href: "/#how-it-works" },
  { label: "Dashboard Preview", href: "/#progress" },
  { label: "Sign Up", href: "/auth/register" },
  { label: "Log In", href: "/auth/login" },
];

export default function LandingFooter() {
  return (
    <Box
      component="footer"
      sx={{
        py: { xs: 5, md: 6 },
        borderTop: "1px solid",
        borderColor: alpha("#5C2E2E", 0.1),
        bgcolor: DASH.cream,
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "center", md: "flex-start" }}
          spacing={4}
        >
          <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
            <Typography
              sx={{
                fontFamily: DASH.serif,
                fontWeight: 700,
                fontSize: "1.25rem",
                mb: 0.5,
                color: "#5C2E2E",
              }}
            >
              Katalog
            </Typography>
            <Typography
              color="text.secondary"
              sx={{ fontFamily: DASH.font, fontSize: "0.9rem" }}
            >
              Track books. Build streaks. Level up.
            </Typography>
          </Box>

          <Stack
            direction="row"
            flexWrap="wrap"
            justifyContent="center"
            gap={{ xs: 2, md: 3 }}
            component="nav"
            aria-label="Footer navigation"
          >
            {footerLinks.map((link) => (
              <Typography
                key={link.label}
                component={Link}
                href={link.href}
                sx={{
                  fontFamily: DASH.font,
                  fontSize: "0.9rem",
                  color: "text.secondary",
                  textDecoration: "none",
                  "&:hover": { color: "primary.main" },
                }}
              >
                {link.label}
              </Typography>
            ))}
          </Stack>
        </Stack>

        <Typography
          color="text.secondary"
          sx={{
            fontFamily: DASH.font,
            fontSize: "0.85rem",
            textAlign: "center",
            mt: 4,
            pt: 3,
            borderTop: "1px solid",
            borderColor: alpha("#5C2E2E", 0.06),
          }}
        >
          © {new Date().getFullYear()} Katalog. Made for readers who want to finish what they start.
        </Typography>
      </Container>
    </Box>
  );
}
