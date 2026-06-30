"use client";

import { Box, Typography, alpha } from "@mui/material";
import { DASH } from "./dashboardTheme";
import { getBookCoverColor } from "./bookCoverColor";

export function getTitleInitials(title: string): string {
  const words = title.trim().split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    return `${words[0][0] ?? ""}${words[1][0] ?? ""}`.toUpperCase();
  }
  return title.slice(0, 2).toUpperCase() || "BK";
}

type BookThumbProps = {
  title: string;
  genre?: string | string[];
  size?: "sm" | "md" | "lg";
};

export function BookThumb({ title, genre, size = "md" }: BookThumbProps) {
  const accent = getBookCoverColor(genre);
  const initials = getTitleInitials(title);
  const dimensions =
    size === "sm"
      ? { w: 36, h: 48, fontSize: "0.7rem" }
      : size === "lg"
        ? { w: 52, h: 68, fontSize: "0.85rem" }
        : { w: 42, h: 56, fontSize: "0.8rem" };

  return (
    <Box
      aria-hidden
      sx={{
        width: dimensions.w,
        height: dimensions.h,
        flexShrink: 0,
        borderRadius: 0,
        background: `linear-gradient(145deg, ${alpha(accent, 0.14)} 0%, ${alpha(accent, 0.06)} 100%)`,
        border: `1px solid ${alpha(accent, 0.18)}`,
        boxShadow: `2px 3px 10px ${alpha(DASH.dark, 0.06)}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          left: 7,
          top: 10,
          bottom: 10,
          width: 2,
          borderRadius: 0,
          bgcolor: alpha(accent, 0.4),
        },
        "&::after": {
          content: '""',
          position: "absolute",
          inset: 0,
          background: `linear-gradient(90deg, ${alpha("#fff", 0.35)} 0%, transparent 35%)`,
          pointerEvents: "none",
        },
      }}
    >
      <Typography
        component="span"
        sx={{
          fontFamily: DASH.serif,
          fontWeight: 700,
          fontSize: dimensions.fontSize,
          color: accent,
          letterSpacing: "0.04em",
          pl: 0.5,
          userSelect: "none",
        }}
      >
        {initials}
      </Typography>
    </Box>
  );
}

export function CircularProgressRing({
  value,
  size = 44,
  color,
}: {
  value: number;
  size?: number;
  color: string;
}) {
  const stroke = 3;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(value, 100) / 100) * circumference;

  return (
    <Box sx={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <Box
        component="svg"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        sx={{ transform: "rotate(-90deg)" }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={alpha(DASH.wine, 0.1)}
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.4s ease" }}
        />
      </Box>
      <Typography
        sx={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: DASH.font,
          fontWeight: 700,
          fontSize: "0.65rem",
          color: DASH.dark,
        }}
      >
        {Math.round(value)}%
      </Typography>
    </Box>
  );
}
