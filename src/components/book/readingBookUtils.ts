import { Book } from "@/types/books";

export type ReadingBook = Book & {
  _id?: string;
  completionPercentage?: number;
  imageUrl?: string;
  genre?: string | string[];
  pages?: number | { current: number; total: number };
  updatedAt?: string;
};

export function getBookId(book: ReadingBook): string {
  return book.id || book._id || "";
}

export function getTotalPages(book: ReadingBook): number {
  if (typeof book.pages === "number") return book.pages;
  if (book.pages && typeof book.pages === "object") return book.pages.total ?? 0;
  return book.totalPages ?? 0;
}

export function getCurrentPage(book: ReadingBook): number {
  if (typeof book.pages === "object" && book.pages) return book.pages.current ?? 0;
  return book.currentPage ?? 0;
}

export function getProgress(book: ReadingBook): number {
  if (book.completionPercentage != null) return Math.round(book.completionPercentage);
  const total = getTotalPages(book);
  if (!total) return 0;
  return Math.round((getCurrentPage(book) / total) * 100);
}

export function getGenreLabel(genre?: string | string[]): string | undefined {
  if (!genre) return undefined;
  return Array.isArray(genre) ? genre[0] : genre;
}

export function normalizeReadingBooks(data: unknown): ReadingBook[] {
  const raw = Array.isArray(data)
    ? data
    : data && typeof data === "object" && "books" in data
      ? (data as { books?: ReadingBook[] }).books
      : [];

  if (!Array.isArray(raw)) return [];

  return raw.map((book) => ({
    ...book,
    id: getBookId(book),
  }));
}

export type ReadingSort = "progress" | "title" | "updated";

export function sortReadingBooks(books: ReadingBook[], sort: ReadingSort): ReadingBook[] {
  const sorted = [...books];

  switch (sort) {
    case "title":
      return sorted.sort((a, b) => (a.title ?? "").localeCompare(b.title ?? ""));
    case "updated":
      return sorted.sort(
        (a, b) =>
          new Date(b.updatedAt ?? 0).getTime() - new Date(a.updatedAt ?? 0).getTime()
      );
    case "progress":
    default:
      return sorted.sort((a, b) => getProgress(b) - getProgress(a));
  }
}

export function computeReadingStats(books: ReadingBook[]) {
  const count = books.length;
  const avgProgress =
    count > 0
      ? Math.round(books.reduce((sum, b) => sum + getProgress(b), 0) / count)
      : 0;
  const pagesRead = books.reduce((sum, b) => sum + getCurrentPage(b), 0);

  return { count, avgProgress, pagesRead };
}

export function getCompletedDate(
  book: ReadingBook & {
    timeline?: { completedAt?: string };
    endDate?: string;
  }
): string | undefined {
  return book.timeline?.completedAt ?? book.endDate ?? book.updatedAt;
}

export function getRating(book: ReadingBook): number | null {
  if (book.rating == null || book.rating <= 0) return null;
  return book.rating;
}

export type CompletedSort = "completed" | "title" | "updated" | "rating";

export function sortCompletedBooks(
  books: ReadingBook[],
  sort: CompletedSort
): ReadingBook[] {
  const sorted = [...books];

  switch (sort) {
    case "title":
      return sorted.sort((a, b) => (a.title ?? "").localeCompare(b.title ?? ""));
    case "updated":
      return sorted.sort(
        (a, b) =>
          new Date(b.updatedAt ?? 0).getTime() - new Date(a.updatedAt ?? 0).getTime()
      );
    case "rating":
      return sorted.sort((a, b) => (getRating(b) ?? 0) - (getRating(a) ?? 0));
    case "completed":
    default:
      return sorted.sort((a, b) => {
        const aDate = new Date(getCompletedDate(a) ?? 0).getTime();
        const bDate = new Date(getCompletedDate(b) ?? 0).getTime();
        return bDate - aDate;
      });
  }
}

export function computeCompletedStats(books: ReadingBook[]) {
  const count = books.length;
  const totalPages = books.reduce((sum, b) => sum + getTotalPages(b), 0);
  const rated = books.filter((b) => getRating(b) != null);
  const avgRating =
    rated.length > 0
      ? Math.round(
          (rated.reduce((sum, b) => sum + (getRating(b) ?? 0), 0) / rated.length) * 10
        ) / 10
      : null;

  return { count, totalPages, avgRating, ratedCount: rated.length };
}

function formatShortDate(dateStr?: string) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function getCompletedLabel(
  book: ReadingBook & { timeline?: { completedAt?: string }; endDate?: string }
): string {
  const date = formatShortDate(getCompletedDate(book));
  const pages = getTotalPages(book);
  if (date && pages) return `Finished ${date} · ${pages.toLocaleString()} pages`;
  if (date) return `Finished ${date}`;
  if (pages) return `${pages.toLocaleString()} pages`;
  return "Completed";
}
