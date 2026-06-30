export interface PaginatedBooks<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export interface RichProgressResponse {
  message?: string;
  book: {
    id: string;
    title: string;
    author: string;
    currentPage: number;
    currentChapter: number;
    status: string;
    completionPercentage: number;
    velocity?: { avgPagesPerDay: number; lastUpdated: string };
  };
  streak?: {
    current: number;
    longest: number;
    isNewRecord: boolean;
    lastReadingDate?: string;
  } | null;
  goalsCompleted?: { id: string; type: string; target: number; progress: number }[];
  achievementsUnlocked?: {
    id: string;
    title: string;
    description?: string;
    level: string;
    type: string;
    earnedAt: string;
  }[];
  insights?: {
    pagesLoggedThisUpdate: number;
    pagesToday: number;
    paceToFinishDays: number | null;
    paceToFinishLabel: string | null;
  };
  updatedGoals?: { id: string; progress: number; target: number; completed: boolean }[];
}

export interface WeeklyInsights {
  period: { start: string; end: string };
  summary: {
    pagesRead: number;
    pagesChangePercent: number;
    sessionsCount: number;
    activeDays: number;
    booksInProgress: number;
  };
  streak?: { current: number; longest: number; atRisk: boolean } | null;
  goalsDueSoon: {
    id: string;
    type: string;
    target: number;
    progress: number;
    endDate: string;
  }[];
  continueReading: {
    id: string;
    title: string;
    author: string;
    completionPercentage: number;
    currentPage: number;
    pages: number;
  }[];
  recentAchievements: { title: string; level: string; earnedAt: string }[];
  narratives: string[];
}

export interface DiscoveryBook {
  openLibraryKey?: string;
  title: string;
  author: string;
  publishYear?: number;
  pages?: number;
  isbn?: string;
  coverUrl?: string | null;
  genres?: string[];
}

export interface Recommendations {
  continueReading: {
    id: string;
    title: string;
    author: string;
    completionPercentage: number;
    pagesLeft: number;
    daysToFinish: number | null;
    reason: string;
  }[];
  upNext: { id: string; title: string; author: string; reason: string }[];
  topGenres: { genre: string; count: number }[];
  genreSuggestions: { genre: string; message: string }[];
  readingTip: string | null;
}

export interface PublicProfile {
  user: {
    username: string;
    profile?: UserProfile & { bio?: string };
    memberSince: string;
  };
  stats: {
    totalBooks: number;
    booksCompleted: number;
    currentStreak: number;
    longestStreak: number;
    challengeGoal: number | null;
    challengeProgress: number;
  };
  recentBooks: {
    title: string;
    author: string;
    genre?: string[];
    rating?: number;
    completionPercentage?: number;
  }[];
  achievements: Achievement[];
}

export interface NudgePreview {
  nudges: string[];
  emailEnabled: boolean;
}

export interface ImportPreview {
  format: "external" | "katalog";
  totalRows: number;
  validCount: number;
  invalidCount: number;
  statusBreakdown: Record<string, number>;
  preview: {
    rowNumber: number;
    valid: boolean;
    issues: string[];
    title?: string;
    author?: string;
    status?: string;
    pages?: number;
    rating?: number;
  }[];
  invalidRows: { rowNumber: number; issues: string[] }[];
}

export interface ImportResult {
  message: string;
  format: string;
  imported: number;
  skippedDuplicates: number;
  failed: number;
  invalidRows: number;
  statusBreakdown: Record<string, number>;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  description?: string;
  coverImage?: string;
  imageUrl?: string;
  isbn?: string;
  openLibraryKey?: string;
  totalPages: number;
  currentPage: number;
  pages: number;
  chapters?: number;
  totalChapters: number;
  currentChapter: number;
  completionPercentage?: number;
  status: "Planned" | "In-Progress" | "Completed" | "Dropped";
  rating?: number;
  genre: string;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
  statistics: number;
}

export type CreateBookInput = {
  title: string;
  author: string;
  genre?: string;
  pages?: number;
  chapters?: number;
  status?: Book["status"];
  rating?: number;
  imageUrl?: string;
  isbn?: string;
  description?: string;
  openLibraryKey?: string;
};

export interface BookProgressAnalytics {
  completionPercentage?: number;
  byPages?: { current?: number; total?: number };
  byChapters?: { current?: number; total?: number };
}

export interface BookProgressAnalyticsResponse {
  analytics?: BookProgressAnalytics;
  bookDetails?: {
    title?: string;
    author?: string;
    pages?: number;
  };
}

export interface ReadingStatisticsResponse {
  reading?: {
    totalPagesRead?: number;
    totalChaptersRead?: number;
    pagesPerDay?: number | string;
    daysTracked?: number;
    estimatedCompletionDate?: string;
  };
}

export interface GoalStatistics {
  totalGoals?: number;
  completedGoals?: number;
  activeGoals?: number;
  avgCompletion?: number;
}

export interface DashboardBookProgress {
  id: string;
  title: string;
  author: string;
  genre?: string[];
  status: Book["status"];
  pages: { current: number; total: number };
  chapters: { current: number; total: number };
  completionPercentage: number;
  color?: string;
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
  privacy: "public" | "private" | "friends-only";
}

export interface Streak {
  _id: string;
  user: string;
  currentStreak: number;
  longestStreak: number;
  lastReadingDate: string;
  streakHistory: Record<string, unknown>[];
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
  goals: Record<string, unknown>[];
  booksRead: Record<string, unknown>[];
  streak: Streak;
}
