"use client";

import Link from "next/link";
import { Box, Typography, alpha } from "@mui/material";

type LogoSize = "sm" | "md" | "lg";
type LogoVariant = "light" | "dark";

const SIZES = {
  sm: { mark: 32, title: "1rem", tagline: false },
  md: { mark: 40, title: "1.35rem", tagline: true },
  lg: { mark: 52, title: "1.75rem", tagline: true },
} as const;

function LogoMark({ size, variant }: { size: number; variant: LogoVariant }) {
  const spine = variant === "light" ? "#FAF6F0" : "#5C2E2E";
  const pageLeft = variant === "light" ? alpha("#FAF6F0", 0.85) : "#8B4A4A";
  const pageRight = variant === "light" ? alpha("#FAF6F0", 0.65) : "#5C2E2E";
  const bookmark = "#C9A962";
  const progress = "#58CC02";

  return (
    <Box
      component="svg"
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      sx={{ flexShrink: 0, display: "block" }}
    >
      <rect x="4" y="8" width="18" height="32" rx="2" fill={pageRight} />
      <rect x="26" y="8" width="18" height="32" rx="2" fill={pageLeft} />
      <path d="M22 8 L26 8 L26 40 L24 38 L22 40 Z" fill={spine} />
      <path d="M22 6 L26 6 L24 3 Z" fill={bookmark} />
      <rect x="8" y="30" width="10" height="3" rx="1.5" fill={progress} />
      <rect x="8" y="35" width="7" height="2" rx="1" fill={variant === "light" ? alpha("#FAF6F0", 0.35) : alpha("#1E1612", 0.15)} />
      <rect x="30" y="30" width="10" height="3" rx="1.5" fill={variant === "light" ? alpha("#FAF6F0", 0.35) : alpha("#1E1612", 0.12)} />
      <rect x="30" y="35" width="7" height="2" rx="1" fill={variant === "light" ? alpha("#FAF6F0", 0.25) : alpha("#1E1612", 0.1)} />
    </Box>
  );
}

export default function KatalogLogo({
  href = "/",
  size = "md",
  variant = "dark",
  showTagline = false,
  onClick,
}: {
  href?: string;
  size?: LogoSize;
  variant?: LogoVariant;
  showTagline?: boolean;
  onClick?: () => void;
}) {
  const config = SIZES[size];
  const textColor = variant === "light" ? "#FAF6F0" : "#1E1612";
  const taglineColor = variant === "light" ? alpha("#FAF6F0", 0.55) : alpha("#5C2E2E", 0.55);

  return (
    <Box
      component={Link}
      href={href}
      aria-label="Katalog — home"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: size === "sm" ? 1 : 1.5,
        textDecoration: "none",
        transition: "opacity 0.2s ease",
        "&:hover": { opacity: 0.88 },
      }}
      onClick={onClick}
    >
      <LogoMark size={config.mark} variant={variant} />
      <Box sx={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
        <Typography
          component="span"
          sx={{
            fontFamily: '"Georgia", "Times New Roman", serif',
            fontWeight: 700,
            fontSize: config.title,
            letterSpacing: "-0.03em",
            color: textColor,
          }}
        >
          Katalog
        </Typography>
        {(showTagline || config.tagline) && size !== "sm" && (
          <Typography
            component="span"
            sx={{
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontSize: "0.65rem",
              fontWeight: 600,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: taglineColor,
              mt: 0.35,
            }}
          >
            read · track · grow
          </Typography>
        )}
      </Box>
    </Box>
  );
}
