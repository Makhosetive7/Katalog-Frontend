/** Build a GitHub-style grid: weeks as columns, Sunday = row 0. */
export function buildHeatmapWeeks(year: number): Date[][] {
  const jan1 = new Date(year, 0, 1);
  const dec31 = new Date(year, 11, 31);

  const gridStart = new Date(jan1);
  gridStart.setHours(0, 0, 0, 0);
  gridStart.setDate(gridStart.getDate() - gridStart.getDay());

  const gridEnd = new Date(dec31);
  gridEnd.setHours(0, 0, 0, 0);
  gridEnd.setDate(gridEnd.getDate() + (6 - gridEnd.getDay()));

  const weeks: Date[][] = [];
  const cursor = new Date(gridStart);

  while (cursor <= gridEnd) {
    const week: Date[] = [];
    for (let i = 0; i < 7; i++) {
      week.push(new Date(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push(week);
  }

  return weeks;
}

export function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/** Week column index for the 1st of each month (GitHub-style month headers). */
export function getMonthLabelPositions(year: number): { label: string; weekIndex: number }[] {
  const jan1 = new Date(year, 0, 1);
  const gridStart = new Date(jan1);
  gridStart.setHours(0, 0, 0, 0);
  gridStart.setDate(gridStart.getDate() - gridStart.getDay());

  return MONTHS.map((label, month) => {
    const firstOfMonth = new Date(year, month, 1);
    firstOfMonth.setHours(0, 0, 0, 0);
    const diffDays = Math.round(
      (firstOfMonth.getTime() - gridStart.getTime()) / (1000 * 60 * 60 * 24)
    );
    return { label, weekIndex: Math.floor(diffDays / 7) };
  });
}

export function getIntensityLevel(sessions: number): 0 | 1 | 2 | 3 | 4 {
  if (!sessions || sessions <= 0) return 0;
  if (sessions === 1) return 1;
  if (sessions === 2) return 2;
  if (sessions <= 4) return 3;
  return 4;
}

export type ActivityDayDetail = {
  sessions: number;
  pages: number;
  progressUpdates?: number;
  notesAdded?: number;
  booksStarted?: number;
  booksCompleted?: number;
};

export function formatHeatmapTooltip(date: Date, activity: ActivityDayDetail): string {
  const label = date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  if (!activity.sessions || activity.sessions <= 0) {
    return `${label} — No reading activity`;
  }

  const parts: string[] = [];

  if (activity.progressUpdates) {
    parts.push(
      `${activity.progressUpdates} progress update${activity.progressUpdates === 1 ? "" : "s"}`
    );
  }
  if (activity.pages > 0) {
    parts.push(`${activity.pages} page${activity.pages === 1 ? "" : "s"} logged`);
  }
  if (activity.notesAdded) {
    parts.push(`${activity.notesAdded} note${activity.notesAdded === 1 ? "" : "s"}`);
  }
  if (activity.booksCompleted) {
    parts.push(`${activity.booksCompleted} book${activity.booksCompleted === 1 ? "" : "s"} finished`);
  }
  if (activity.booksStarted) {
    parts.push(`${activity.booksStarted} book${activity.booksStarted === 1 ? "" : "s"} started`);
  }

  if (parts.length === 0) {
    parts.push(`${activity.sessions} reading session${activity.sessions === 1 ? "" : "s"}`);
  }

  return `${label} — ${parts.join(" · ")}`;
}
