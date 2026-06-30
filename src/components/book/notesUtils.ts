import { ChapterNote } from "@/types/books";
import { ReadingBook } from "./readingBookUtils";

export type NotesByBookResponse = {
  book: ReadingBook | null;
  chapters: Record<string, ChapterNote[]>;
  totalNotes: number;
};

export type GroupedChapterNotes = Record<string, ChapterNote[]>;

export function filterNotesBySearch(
  chapters: GroupedChapterNotes,
  search: string
): GroupedChapterNotes {
  const q = search.trim().toLowerCase();
  if (!q) return chapters;

  const filtered: GroupedChapterNotes = {};

  Object.entries(chapters).forEach(([chapterNumber, chapterNotes]) => {
    const matched = chapterNotes.filter((note) => {
      const keywords = (note.keywords ?? []).join(" ").toLowerCase();
      return (
        note.note.toLowerCase().includes(q) ||
        keywords.includes(q) ||
        String(note.chapter).includes(q)
      );
    });
    if (matched.length > 0) filtered[chapterNumber] = matched;
  });

  return filtered;
}

export function sortChapterNumbers(chapters: GroupedChapterNotes): string[] {
  return Object.keys(chapters).sort((a, b) => Number(a) - Number(b));
}

export function getLatestNoteDate(chapters: GroupedChapterNotes): string | null {
  let latest = 0;
  Object.values(chapters).forEach((notes) => {
    notes.forEach((note) => {
      const time = new Date(note.createdAt).getTime();
      if (time > latest) latest = time;
    });
  });
  return latest ? new Date(latest).toISOString() : null;
}

export function computeNotesStats(chapters: GroupedChapterNotes, totalNotes: number) {
  const chapterCount = Object.keys(chapters).length;
  const latest = getLatestNoteDate(chapters);

  return {
    totalNotes,
    chapterCount,
    latestLabel: latest
      ? new Date(latest).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        })
      : "—",
  };
}

export function filterBooksBySearch(books: ReadingBook[], search: string): ReadingBook[] {
  const q = search.trim().toLowerCase();
  if (!q) return books;

  return books.filter((book) => {
    const genre = Array.isArray(book.genre) ? book.genre.join(" ") : book.genre ?? "";
    return (
      book.title?.toLowerCase().includes(q) ||
      book.author?.toLowerCase().includes(q) ||
      genre.toLowerCase().includes(q)
    );
  });
}
