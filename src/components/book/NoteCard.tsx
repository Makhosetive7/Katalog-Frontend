"use client";

import { Box, Typography, Chip, IconButton, alpha } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { format } from "date-fns";
import { ChapterNote } from "@/types/books";
import { DASH } from "@/components/dashboard/dashboardTheme";

export default function NoteCard({
  note,
  accent = DASH.wine,
  onDelete,
}: {
  note: ChapterNote;
  accent?: string;
  onDelete?: (id: string) => void;
}) {
  return (
    <Box
      sx={{
        p: 1.75,
        bgcolor: "#FFFFFF",
        border: `1px solid ${alpha(DASH.wine, 0.1)}`,
        borderLeft: `3px solid ${accent}`,
        transition: "background-color 0.15s ease",
        "&:hover": { bgcolor: alpha(accent, 0.02) },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 1,
          mb: 0.75,
        }}
      >
        <Typography
          sx={{
            fontFamily: DASH.font,
            fontSize: "0.7rem",
            fontWeight: 600,
            color: alpha(DASH.dark, 0.45),
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          {format(new Date(note.createdAt), "MMM d, yyyy")}
        </Typography>
        {onDelete && (
          <IconButton
            size="small"
            onClick={() => onDelete(note._id)}
            aria-label="Delete note"
            sx={{
              width: 28,
              height: 28,
              borderRadius: 0,
              color: alpha(DASH.wine, 0.5),
              border: `1px solid ${alpha(DASH.wine, 0.12)}`,
              "&:hover": { bgcolor: alpha(DASH.wine, 0.06) },
            }}
          >
            <Delete sx={{ fontSize: 15 }} />
          </IconButton>
        )}
      </Box>

      <Typography
        sx={{
          fontFamily: DASH.font,
          fontSize: "0.875rem",
          color: alpha(DASH.dark, 0.75),
          lineHeight: 1.6,
          whiteSpace: "pre-wrap",
          mb: note.keywords?.length ? 1 : 0,
        }}
      >
        {note.note}
      </Typography>

      {note.keywords && note.keywords.length > 0 && (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
          {note.keywords.map((keyword) => (
            <Chip
              key={keyword}
              label={keyword}
              size="small"
              sx={{
                height: 22,
                fontSize: "0.65rem",
                fontFamily: DASH.font,
                borderRadius: 0,
                bgcolor: alpha(accent, 0.08),
                color: accent,
                border: `1px solid ${alpha(accent, 0.15)}`,
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}
