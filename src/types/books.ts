export interface Book {
  id: string;
  title: string;
  author: string;
  description?: string;
  coverImage?: string;
  totalPages: number;
  currentPage: number;
  pages: number;
  totalChapters: number;
  currentChapter: number;
  status: "Planned" | "In-Progress" | "Completed" | "Dropped";
  rating?: number;
  genre: string;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
  statistics: number;
}

export interface BookProgress {
  bookId: string;
  averageCompletion: number;
  completionRate: number;
  totalBooks: number;
  completedBooks: number;
  currentPage: number;
  currentChapter: number;
  note: string;
}

export interface BookStatistics {
  totalBooks: number;
  completedBooks: number;
  booksReading: number;
  booksToRead: number;
  totalPages: number;
  pagesRead: number;
  averageCompletion: number;
  completionRate: number;
}

export interface ReadingSession {
  _id: string;
  user: string;
  book: string;
  pagesRead: number;
  chaptersRead: number;
  readingTime: number;
  mood?: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReadingGoal {
  _id: string;
  user: string;
  book: string;
  type: "pages" | "chapters" | "time" | "completion";
  target: number;
  timeframe: "daily" | "weekly" | "monthly" | "custom";
  startDate: string;
  endDate: string;
  completed: boolean;
  completedAt?: string;
  progress: number;
  createdAt: string;
  updatedAt: string;
}

export interface ChapterNote {
  _id: string;
  user: string;
  book: string;
  chapter: number;
  note: string;
  isPublic: boolean;
  keywords: string[];
  createdAt: string;
  updatedAt: string;
}

export interface User {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isVerified: boolean;
  _id: string;
  profile: UserProfile;
  preferences: UserPreferences;
  isDemo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  readingPreferences: string[];
}

export interface UserPreferences {
  emailNotifications: boolean;
  privacy: "public" | "private" | "friends";
}

export interface Streak {
  _id: string;
  user: string;
  currentStreak: number;
  longestStreak: number;
  lastReadingDate: string;
  streakHistory: any[];
  createdAt: string;
  updatedAt: string;
}

export interface Achievement {
  _id: string;
  name: string;
  description: string;
  icon: string;
  achievedAt: string;
}

export interface ProfileResponse {
  user: User;
  achievements: Achievement[];
  goals: any[];
  booksRead: any[];
  streak: Streak;
}
