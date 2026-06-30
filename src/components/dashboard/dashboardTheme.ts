export const DASH = {
  dark: "#1E1612",
  cream: "#FAF6F0",
  wine: "#5C2E2E",
  wineDark: "#3D1C1C",
  gold: "#C9A962",
  green: "#58CC02",
  font: "system-ui, -apple-system, sans-serif",
  serif: '"Georgia", "Times New Roman", serif',
} as const;

export const CHART_COLORS = [DASH.wine, DASH.green, DASH.gold, "#8B4A4A", "#3B82F6"];

export const flatProgressSx = {
  borderRadius: 0,
  "& .MuiLinearProgress-bar": { borderRadius: 0 },
} as const;

export const dashChipSx = {
  borderRadius: 0,
} as const;
