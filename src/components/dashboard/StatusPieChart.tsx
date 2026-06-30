"use client";

import { Box, Typography, alpha } from "@mui/material";
import { DASH } from "./dashboardTheme";
import DashboardSection from "./DashboardSection";

type StatusDatum = { name: string; value: number };

const STATUS_ORDER = ["Completed", "In progress", "Planned", "Dropped", "Other"] as const;

const STATUS_COLORS: Record<string, string> = {
  Completed: DASH.green,
  "In progress": DASH.wine,
  Planned: DASH.gold,
  Dropped: alpha(DASH.dark, 0.35),
  Other: "#94A3B8",
};

function sortStatuses(data: StatusDatum[]) {
  return [...data]
    .filter((d) => d.value > 0)
    .sort((a, b) => {
      const ai = STATUS_ORDER.indexOf(a.name as (typeof STATUS_ORDER)[number]);
      const bi = STATUS_ORDER.indexOf(b.name as (typeof STATUS_ORDER)[number]);
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    });
}

export default function StatusPieChart({ data }: { data: StatusDatum[] }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const items = sortStatuses(data);

  if (total === 0) {
    return (
      <DashboardSection title="Shelf breakdown" subtitle="How your books are distributed">
        <Box
          sx={{
            py: 4,
            textAlign: "center",
            borderRadius: 0,
            bgcolor: alpha(DASH.wine, 0.03),
            border: `1px dashed ${alpha(DASH.wine, 0.1)}`,
          }}
        >
          <Typography sx={{ fontFamily: DASH.font, fontSize: "0.875rem", color: alpha(DASH.dark, 0.45) }}>
            Add books to see how your shelf is shaping up.
          </Typography>
        </Box>
      </DashboardSection>
    );
  }

  return (
    <DashboardSection title="Shelf breakdown" subtitle={`${total} book${total === 1 ? "" : "s"} total`}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          minHeight: { xs: "auto", md: 300 },
          py: { xs: 1, md: 2 },
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 280 }}>
          <Box
            sx={{
              display: "flex",
              height: 10,
              borderRadius: 0,
              overflow: "hidden",
              bgcolor: alpha(DASH.wine, 0.06),
              mb: 3,
            }}
          >
            {items.map((item) => {
              const color = STATUS_COLORS[item.name] ?? DASH.wine;
              const widthPct = (item.value / total) * 100;
              if (widthPct <= 0) return null;
              return (
                <Box
                  key={item.name}
                  title={`${item.name}: ${item.value}`}
                  sx={{
                    width: `${widthPct}%`,
                    minWidth: item.value > 0 ? 6 : 0,
                    bgcolor: color,
                    transition: "width 0.4s ease",
                  }}
                />
              );
            })}
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.25 }}>
            {items.map((item) => {
              const color = STATUS_COLORS[item.name] ?? DASH.wine;
              const pct = Math.round((item.value / total) * 100);

              return (
                <Box
                  key={item.name}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    py: 1.25,
                  }}
                >
                  <Box
                    sx={{
                      width: 28,
                      height: 4,
                      borderRadius: 0,
                      bgcolor: color,
                      mb: 1,
                    }}
                  />
                  <Typography
                    sx={{
                      fontFamily: DASH.font,
                      fontSize: "0.8125rem",
                      fontWeight: 500,
                      color: DASH.dark,
                      mb: 0.35,
                    }}
                  >
                    {item.name}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.75 }}>
                    <Typography
                      sx={{
                        fontFamily: DASH.serif,
                        fontWeight: 700,
                        fontSize: "1.25rem",
                        color: DASH.dark,
                        lineHeight: 1,
                      }}
                    >
                      {item.value}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: DASH.font,
                        fontSize: "0.75rem",
                        color: alpha(DASH.dark, 0.42),
                      }}
                    >
                      · {pct}%
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>
    </DashboardSection>
  );
}
