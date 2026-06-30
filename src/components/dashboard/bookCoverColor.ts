import { DASH } from "./dashboardTheme";

const GENRE_COLORS: Record<string, string> = {
  Fiction: "#5C2E2E",
  Fantasy: "#6B4C9A",
  Romance: "#B84A6B",
  Mystery: "#2C4A6E",
  "Science Fiction": "#1A5C5C",
  "Literary Fiction": "#4A3728",
  Textbook: "#3D5A3D",
  Science: "#2E5E4E",
  Mathematics: "#4A4A8B",
  History: "#8B6914",
  Classics: "#6B3A3A",
  "Study Guide": "#5C4A2E",
  "Non-Fiction": "#3E4A5C",
  Humor: "#C97B2E",
  Thriller: "#1E1612",
  Contemporary: "#7A5C4A",
};

export function getBookCoverColor(genre?: string | string[]): string {
  const primary = Array.isArray(genre) ? genre[0] : genre;
  if (primary && GENRE_COLORS[primary]) return GENRE_COLORS[primary];
  return DASH.wine;
}

export const ACHIEVEMENT_LEVEL_COLORS: Record<string, string> = {
  beginner: "#9CA3AF",
  bronze: "#CD7F32",
  silver: "#94A3B8",
  gold: DASH.gold,
  platinum: "#9B59B6",
};
