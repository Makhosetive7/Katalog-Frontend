"use client";

import { Box, Paper, Typography, LinearProgress, Chip, alpha } from "@mui/material";
import { LocalFireDepartment, Bolt, EmojiEvents } from "@mui/icons-material";
import { shelfBooks } from "./landingData";
import { DASH } from "./landingTheme";

type ProgressPreviewProps = {
  variant?: "compact" | "full";
};

const flatBarSx = {
  borderRadius: 0,
  "& .MuiLinearProgress-bar": { borderRadius: 0 },
};

export default function ProgressPreview({ variant = "full" }: ProgressPreviewProps) {
  const isCompact = variant === "compact";

  return (
    <Paper
      elevation={0}
      aria-hidden="true"
      className="landing-mockup"
      sx={{
        p: isCompact ? 2.5 : 3.5,
        borderRadius: 0,
        bgcolor: "#FFFFFF",
        border: `1px solid ${alpha(DASH.wine, 0.1)}`,
        borderTop: `3px solid ${DASH.wine}`,
        boxShadow: "0 16px 48px rgba(30, 22, 18, 0.12)",
        maxWidth: isCompact ? 380 : 480,
        width: "100%",
        mx: "auto",
        transition: "box-shadow 0.3s ease",
        "&:hover": isCompact ? { boxShadow: "0 20px 56px rgba(30, 22, 18, 0.16)" } : {},
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2.5 }}>
        <Box>
          <Typography
            sx={{
              fontFamily: DASH.font,
              fontWeight: 700,
              fontSize: isCompact ? "0.95rem" : "1.1rem",
              color: DASH.dark,
            }}
          >
            Today&apos;s Reading
          </Typography>
          <Typography
            sx={{ fontFamily: DASH.font, fontSize: "0.8rem", color: alpha(DASH.dark, 0.5) }}
          >
            Level 7 · Bookworm
          </Typography>
        </Box>
        <Chip
          icon={<EmojiEvents sx={{ fontSize: 16, color: `${DASH.gold} !important` }} />}
          label="3 badges"
          size="small"
          sx={{
            borderRadius: 0,
            bgcolor: alpha(DASH.gold, 0.12),
            color: DASH.wineDark,
            fontWeight: 600,
            fontFamily: DASH.font,
            fontSize: "0.75rem",
            border: `1px solid ${alpha(DASH.gold, 0.25)}`,
          }}
        />
      </Box>

      <Box
        className="landing-streak-card"
        sx={{
          p: 2,
          mb: 2,
          borderRadius: 0,
          bgcolor: alpha("#FF6B35", 0.06),
          border: `1px solid ${alpha("#FF6B35", 0.2)}`,
          borderTop: `3px solid #FF6B35`,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <LocalFireDepartment
            className="landing-fire-icon"
            sx={{ color: "#FF6B35", fontSize: 28 }}
          />
          <Typography
            sx={{
              fontFamily: DASH.serif,
              fontWeight: 700,
              fontSize: isCompact ? "1.5rem" : "1.75rem",
              color: "#FF6B35",
              lineHeight: 1,
            }}
          >
            14
          </Typography>
          <Typography
            sx={{
              fontFamily: DASH.font,
              fontWeight: 600,
              color: alpha(DASH.dark, 0.55),
              fontSize: "0.85rem",
            }}
          >
            day streak
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 0.5 }}>
          {Array.from({ length: 7 }).map((_, i) => (
            <Box
              key={i}
              className={i < 6 ? "landing-streak-flame landing-streak-flame--active" : "landing-streak-flame"}
              sx={{
                flex: 1,
                height: 6,
                borderRadius: 0,
                bgcolor: i < 6 ? undefined : alpha("#FF6B35", 0.15),
              }}
            />
          ))}
        </Box>
      </Box>

      <Box sx={{ mb: 2.5 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.75 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Bolt sx={{ fontSize: 18, color: DASH.green }} />
            <Typography
              sx={{
                fontFamily: DASH.font,
                fontWeight: 600,
                fontSize: "0.85rem",
                color: DASH.dark,
              }}
            >
              Daily XP
            </Typography>
          </Box>
          <Typography
            sx={{
              fontFamily: DASH.font,
              fontWeight: 700,
              fontSize: "0.85rem",
              color: DASH.green,
            }}
          >
            340 / 500
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={68}
          className="landing-xp-bar"
          sx={{
            height: 4,
            bgcolor: alpha(DASH.green, 0.12),
            ...flatBarSx,
            "& .MuiLinearProgress-bar": {
              borderRadius: 0,
              bgcolor: DASH.green,
            },
          }}
        />
      </Box>

      <Typography
        sx={{
          fontFamily: DASH.font,
          fontWeight: 600,
          fontSize: "0.72rem",
          color: alpha(DASH.dark, 0.45),
          mb: 1.5,
          textTransform: "uppercase",
          letterSpacing: "0.07em",
        }}
      >
        Currently Reading
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        {shelfBooks.slice(0, isCompact ? 2 : 3).map((book) => (
          <Box key={book.title}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
              <Typography
                sx={{
                  fontFamily: DASH.font,
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  color: DASH.dark,
                }}
              >
                {book.title}
              </Typography>
              <Typography
                sx={{
                  fontFamily: DASH.font,
                  fontSize: "0.75rem",
                  color: alpha(DASH.dark, 0.45),
                }}
              >
                {book.pages}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={book.progress}
              className="landing-book-bar"
              sx={{
                height: 4,
                bgcolor: alpha(book.color, 0.12),
                ...flatBarSx,
                "& .MuiLinearProgress-bar": {
                  borderRadius: 0,
                  bgcolor: book.color,
                },
              }}
            />
          </Box>
        ))}
      </Box>
    </Paper>
  );
}
