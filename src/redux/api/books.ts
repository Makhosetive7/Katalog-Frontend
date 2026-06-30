// booksApi.ts
import { createCustomApi } from "../../utils/apiConfig";
import type {
  Book,
  CreateBookInput,
  BookProgressAnalyticsResponse,
  ReadingStatisticsResponse,
  GoalStatistics,
  DashboardBookProgress,
  ChapterNote,
  BookStatistics,
  ReadingSession,
  ReadingGoal,
  User,
  ProfileResponse,
  PaginatedBooks,
  RichProgressResponse,
  WeeklyInsights,
  DiscoveryBook,
  Recommendations,
  PublicProfile,
  NudgePreview,
  ImportPreview,
  ImportResult,
} from "../../types/books";

const API = {
  books: "/books",
  auth: "/auth",
  user: "/user",
  insights: "/insights",
  discovery: "/discovery",
  export: "/export",
  import: "/import",
  users: "/users",
  recommendations: "/recommendations",
  notifications: "/notifications",
};

export const booksApi = createCustomApi("booksApi", (builder) => ({
  getBooks: builder.query<PaginatedBooks<Book>, { page?: number; limit?: number } | void>({
    query: (params) => {
      const page = params?.page ?? 1;
      const limit = params?.limit ?? 50;
      return `${API.books}?page=${page}&limit=${limit}`;
    },
    providesTags: ["Books"],
  }),

  getBookById: builder.query<Book, string>({
    query: (id) => `${API.books}/${id}`,
    providesTags: (result, error, id) => [{ type: "Book", id }],
  }),

  getBooksByStatus: builder.query<{ status: string; count: number; books: Book[] }, string>({
    query: (status) => `${API.books}/bookStatus/${status}`,
    providesTags: ["Books"],
  }),

  getRecentBooks: builder.query<Book[], number | void>({
    query: (limit = 5) => `${API.books}/recent?limit=${limit}`,
    providesTags: ["Books"],
  }),

  searchBooks: builder.query<Book[], string>({
    query: (q) => `${API.books}/search?q=${encodeURIComponent(q)}`,
    transformResponse: (res: { items?: Book[]; results?: Book[] }) =>
      res.items ?? res.results ?? [],
    providesTags: ["Books"],
  }),

  searchDiscoveryBooks: builder.query<
    { query: string; count: number; results: DiscoveryBook[] },
    string
  >({
    query: (q) => `${API.discovery}/books?q=${encodeURIComponent(q)}`,
  }),

  getBookStatistics: builder.query<BookStatistics, void>({
    query: () => `${API.books}/statistics`,
    providesTags: ["BookStats"],
  }),

  getAllBooksProgress: builder.query<
    { books: DashboardBookProgress[]; statistics: Record<string, number> },
    void
  >({
    query: () => `${API.books}/progress/dashboard`,
    providesTags: ["Books"],
  }),

  getReadingActivityHeatmap: builder.query<
    {
      year: number;
      days: {
        date: string;
        sessions: number;
        pages: number;
        progressUpdates?: number;
        notesAdded?: number;
        booksStarted?: number;
        booksCompleted?: number;
      }[];
      stats: {
        totalActiveDays: number;
        totalSessions: number;
        totalPages: number;
        totalProgressUpdates: number;
        totalNotes: number;
        totalBooksCompleted: number;
        longestStreak: number;
      };
    },
    number | void
  >({
    query: (year) => {
      const y = year ?? new Date().getFullYear();
      return `${API.books}/activity/heatmap?year=${y}`;
    },
    providesTags: ["Activity"],
  }),

  getWeeklyInsights: builder.query<WeeklyInsights, void>({
    query: () => `${API.insights}/weekly`,
    providesTags: ["Insights"],
  }),

  getRecommendations: builder.query<Recommendations, void>({
    query: () => API.recommendations,
    providesTags: ["Recommendations"],
  }),

  getProgressAnalytics: builder.query<unknown, void>({
    query: () => `${API.books}/analytics`,
    providesTags: ["BookStats"],
  }),

  getBookProgressAnalytics: builder.query<BookProgressAnalyticsResponse, string>({
    query: (id) => `${API.books}/${id}/analytics`,
    providesTags: (result, error, id) => [{ type: "Book", id }],
  }),

  getBookPace: builder.query<
    {
      bookId: string;
      title: string;
      pagesRemaining: number;
      avgPagesPerDay: number;
      daysToFinish: number | null;
      estimatedFinishDate: string | null;
      completionPercentage: number;
    },
    string
  >({
    query: (bookId) => `${API.insights}/books/${bookId}/pace`,
  }),

  createBook: builder.mutation<Book, CreateBookInput>({
    query: (body) => ({ url: API.books, method: "POST", body }),
    invalidatesTags: ["Books", "BookStats", "Activity", "Insights", "Recommendations"],
  }),

  updateBook: builder.mutation<Book, { id: string; body: Partial<Book> }>({
    query: ({ id, body }) => ({ url: `${API.books}/${id}`, method: "PUT", body }),
    invalidatesTags: (result, error, { id }) => [
      { type: "Book", id },
      "Books",
      "BookStats",
      "Activity",
      "Insights",
      "Recommendations",
    ],
  }),

  updateReadingProgress: builder.mutation<
    RichProgressResponse,
    {
      id: string;
      currentPage?: number;
      currentChapter?: number;
      note?: string;
      status?: string;
    }
  >({
    query: ({ id, ...body }) => ({
      url: `${API.books}/${id}/progress`,
      method: "PUT",
      body,
    }),
    invalidatesTags: (result, error, { id }) => [
      { type: "Book", id },
      "Books",
      "BookStats",
      "Activity",
      "Insights",
      "Recommendations",
      "Profile",
    ],
  }),

  deleteBook: builder.mutation<void, string>({
    query: (id) => ({ url: `${API.books}/${id}`, method: "DELETE" }),
    invalidatesTags: ["Books", "BookStats", "Recommendations"],
  }),

  getBookReadingSessions: builder.query<ReadingSession[], string>({
    query: (bookId) => `${API.books}/${bookId}/sessions`,
    providesTags: (result, error, bookId) => [{ type: "Sessions", id: bookId }],
  }),

  getReadingStatistics: builder.query<ReadingStatisticsResponse, string>({
    query: (bookId) => `${API.books}/${bookId}/statistics`,
    providesTags: (result, error, bookId) => [{ type: "Sessions", id: bookId }],
  }),

  createReadingSession: builder.mutation<
    RichProgressResponse & { session: ReadingSession },
    { bookId: string; body: Partial<ReadingSession> }
  >({
    query: ({ bookId, body }) => ({
      url: `${API.books}/${bookId}/sessions`,
      method: "POST",
      body,
    }),
    invalidatesTags: (result, error, { bookId }) => [
      { type: "Sessions", id: bookId },
      { type: "Book", id: bookId },
      "Books",
      "BookStats",
      "Activity",
      "Insights",
      "Recommendations",
      "Profile",
    ],
  }),

  deleteReadingSession: builder.mutation<void, string>({
    query: (sessionId) => ({
      url: `${API.books}/sessions/${sessionId}`,
      method: "DELETE",
    }),
    invalidatesTags: ["Sessions", "BookStats"],
  }),

  getChapterNotes: builder.query<ChapterNote[], string>({
    query: (bookId) => `${API.books}/${bookId}/notes`,
    transformResponse: (res: { notes?: ChapterNote[]; chapters?: Record<string, ChapterNote[]> }) => {
      if (res.notes) return res.notes;
      if (res.chapters) return Object.values(res.chapters).flat();
      return [];
    },
    providesTags: (result, error, bookId) => [{ type: "Notes", id: bookId }],
  }),

  createChapterNote: builder.mutation<
    ChapterNote,
    { bookId: string; body: Partial<ChapterNote> }
  >({
    query: ({ bookId, body }) => ({
      url: `${API.books}/${bookId}/notes`,
      method: "POST",
      body,
    }),
    invalidatesTags: (result, error, { bookId }) => [
      { type: "Notes", id: bookId },
      "Activity",
    ],
  }),

  getNotesByBookId: builder.query<
    { book: Book | null; chapters: Record<string, ChapterNote[]>; totalNotes: number },
    string
  >({
    query: (bookId) => `${API.books}/${bookId}/notes`,
    providesTags: (result, error, bookId) => [{ type: "Notes", id: bookId }],
  }),

  updateChapterNote: builder.mutation<
    ChapterNote,
    { noteId: string; body: Partial<ChapterNote> }
  >({
    query: ({ noteId, body }) => ({
      url: `${API.books}/notes/${noteId}`,
      method: "PUT",
      body,
    }),
    invalidatesTags: ["Notes", "Activity"],
  }),

  deleteChapterNote: builder.mutation<void, string>({
    query: (noteId) => ({ url: `${API.books}/notes/${noteId}`, method: "DELETE" }),
    invalidatesTags: ["Notes", "Activity"],
  }),

  getBookGoals: builder.query<ReadingGoal[], string>({
    query: (bookId) => `${API.books}/${bookId}/goals`,
    providesTags: (result, error, bookId) => [{ type: "Goals", id: bookId }],
  }),

  getGoalStatistics: builder.query<GoalStatistics, { userId: string; bookId: string }>({
    query: ({ userId, bookId }) => `${API.books}/goals/stats/${userId}/${bookId}`,
    providesTags: ["Goals"],
  }),

  checkGoalProgress: builder.query<unknown, string>({
    query: (goalId) => `${API.books}/goals/${goalId}/progress`,
    providesTags: (result, error, goalId) => [{ type: "Goals", id: goalId }],
  }),

  checkAllGoals: builder.query<{ goals: { goal: ReadingGoal }[] }, void>({
    async queryFn(_arg, _api, _extraOptions, baseQuery) {
      const result = await baseQuery(`${API.books}/goals/check`);
      if (result.error) {
        if (result.error.status === 404) {
          return { data: { goals: [] } };
        }
        return { error: result.error };
      }
      return { data: result.data as { goals: { goal: ReadingGoal }[] } };
    },
    providesTags: ["Goals"],
  }),

  createReadingGoal: builder.mutation<
    ReadingGoal,
    { bookId: string; body: Partial<ReadingGoal> }
  >({
    query: ({ bookId, body }) => ({
      url: `${API.books}/${bookId}/goals`,
      method: "POST",
      body,
    }),
    invalidatesTags: (result, error, { bookId }) => [{ type: "Goals", id: bookId }],
  }),

  updateReadingGoal: builder.mutation<
    ReadingGoal,
    { goalId: string; body: Partial<ReadingGoal> }
  >({
    query: ({ goalId, body }) => ({
      url: `${API.books}/goals/${goalId}`,
      method: "PUT",
      body,
    }),
    invalidatesTags: (result, error, { goalId }) => [{ type: "Goals", id: goalId }],
  }),

  deleteReadingGoal: builder.mutation<void, string>({
    query: (goalId) => ({ url: `${API.books}/goals/${goalId}`, method: "DELETE" }),
    invalidatesTags: ["Goals"],
  }),

  register: builder.mutation<User, Partial<User>>({
    query: (body) => ({ url: `${API.auth}/register`, method: "POST", body }),
  }),

  login: builder.mutation<{ token: string; user: User }, { email: string; password: string }>({
    query: (body) => ({ url: `${API.auth}/login`, method: "POST", body }),
  }),

  demoLogin: builder.mutation<{ token: string; user: User }, void>({
    query: () => ({ url: `${API.auth}/demo`, method: "POST" }),
  }),

  getAuthConfig: builder.query<
    { env: string; allowLocal: boolean; allowDemo: boolean; allowGoogle: boolean },
    void
  >({
    query: () => `${API.auth}/config`,
  }),

  logout: builder.mutation<void, void>({
    query: () => ({ url: `${API.auth}/logout`, method: "POST" }),
  }),

  getProfile: builder.query<ProfileResponse, void>({
    query: () => `${API.user}/myProfile`,
    providesTags: ["Profile"],
  }),

  getPublicProfile: builder.query<PublicProfile, string>({
    query: (username) => `${API.users}/${username}/public`,
  }),

  updateProfile: builder.mutation<
    User,
    {
      firstName?: string;
      lastName?: string;
      bio?: string;
      readingPreferences?: string[];
      preferences?: {
        emailNotifications?: boolean;
        privacy?: "public" | "private" | "friends-only";
      };
    }
  >({
    query: (body) => ({ url: `${API.user}/updateProfile`, method: "PUT", body }),
    transformResponse: (res: { user: User }) => res.user,
    invalidatesTags: ["Profile"],
  }),

  changePassword: builder.mutation<void, { currentPassword: string; newPassword: string }>({
    query: (body) => ({ url: `${API.user}/change-password`, method: "PUT", body }),
  }),

  verifyEmail: builder.mutation<void, { token: string }>({
    query: (body) => ({ url: `${API.auth}/verify-email`, method: "POST", body }),
  }),

  resendVerification: builder.mutation<void, { email: string }>({
    query: (body) => ({ url: `${API.auth}/resend-verification`, method: "POST", body }),
  }),

  forgotPassword: builder.mutation<void, { email: string }>({
    query: (body) => ({ url: `${API.auth}/forgot-password`, method: "POST", body }),
  }),

  resetPassword: builder.mutation<void, { token: string; newPassword: string }>({
    query: (body) => ({ url: `${API.auth}/reset-password`, method: "POST", body }),
  }),

  previewNudges: builder.query<NudgePreview, void>({
    query: () => `${API.notifications}/nudges/preview`,
  }),

  sendNudgeEmail: builder.mutation<{ sent: boolean; nudges?: string[]; reason?: string }, void>({
    query: () => ({ url: `${API.notifications}/nudges/send`, method: "POST" }),
  }),

  exportBooksCsv: builder.mutation<Blob, void>({
    async queryFn(_arg, _api, _extraOptions, baseQuery) {
      const result = await baseQuery({
        url: `${API.export}/books.csv`,
        responseHandler: (response) => response.blob(),
      });
      if (result.error) return { error: result.error };
      return { data: result.data as Blob };
    },
  }),

  exportLibraryJson: builder.query<unknown, void>({
    query: () => `${API.export}/library.json`,
  }),

  previewImport: builder.mutation<ImportPreview, { csv: string }>({
    query: (body) => ({ url: `${API.import}/preview`, method: "POST", body }),
  }),

  importBooks: builder.mutation<
    ImportResult,
    { csv: string; skipDuplicates?: boolean }
  >({
    query: (body) => ({ url: `${API.import}/books`, method: "POST", body }),
    invalidatesTags: ["Books", "BookStats", "Activity", "Insights", "Recommendations"],
  }),
}));

export const {
  useGetBooksQuery,
  useGetBookByIdQuery,
  useGetBooksByStatusQuery,
  useGetRecentBooksQuery,
  useSearchBooksQuery,
  useSearchDiscoveryBooksQuery,
  useGetBookStatisticsQuery,
  useGetAllBooksProgressQuery,
  useGetReadingActivityHeatmapQuery,
  useGetWeeklyInsightsQuery,
  useGetRecommendationsQuery,
  useGetProgressAnalyticsQuery,
  useGetBookProgressAnalyticsQuery,
  useGetBookPaceQuery,
  useGetChapterNotesQuery,
  useCreateBookMutation,
  useUpdateBookMutation,
  useUpdateReadingProgressMutation,
  useDeleteBookMutation,
  useGetBookReadingSessionsQuery,
  useGetReadingStatisticsQuery,
  useCreateReadingSessionMutation,
  useDeleteReadingSessionMutation,
  useCreateChapterNoteMutation,
  useUpdateChapterNoteMutation,
  useDeleteChapterNoteMutation,
  useGetBookGoalsQuery,
  useGetGoalStatisticsQuery,
  useCheckGoalProgressQuery,
  useCheckAllGoalsQuery,
  useCreateReadingGoalMutation,
  useUpdateReadingGoalMutation,
  useDeleteReadingGoalMutation,
  useRegisterMutation,
  useLoginMutation,
  useDemoLoginMutation,
  useGetAuthConfigQuery,
  useGetNotesByBookIdQuery,
  useLogoutMutation,
  useGetProfileQuery,
  useGetPublicProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useVerifyEmailMutation,
  useResendVerificationMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  usePreviewNudgesQuery,
  useSendNudgeEmailMutation,
  useExportBooksCsvMutation,
  useExportLibraryJsonQuery,
  usePreviewImportMutation,
  useImportBooksMutation,
} = booksApi;
