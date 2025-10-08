// booksApi.ts
import { createCustomApi } from "../../utils/apiConfig";
import type {
  Book,
  BookProgress,
  ChapterNote,
  BookStatistics,
  ReadingSession,
  ReadingGoal,
  User,
  ProfileResponse,
} from "../../types/books";

export const booksApi = createCustomApi("booksApi", (builder) => ({
  getBooks: builder.query<Book[], void>({
    query: () => "/books",
    providesTags: ["Books"],
  }),

  getBookById: builder.query<Book, string>({
    query: (id) => `/books/${id}`,
    providesTags: (result, error, id) => [{ type: "Book", id }],
  }),

  getBooksByStatus: builder.query<Book[], string>({
    query: (status) => `/books/bookStatus/${status}`,
    providesTags: ["Books"],
  }),

  getRecentBooks: builder.query<Book[], number | void>({
    query: (limit = 5) => `/books/recent?limit=${limit}`,
    providesTags: ["Books"],
  }),

  searchBooks: builder.query<Book[], string>({
    query: (q) => `/books/search?q=${encodeURIComponent(q)}`,
    providesTags: ["Books"],
  }),

  getBookStatistics: builder.query<BookStatistics, void>({
    query: () => "/books/statistics",
    providesTags: ["BookStats"],
  }),

  getAllBooksProgress: builder.query<BookProgress[], void>({
    query: () => "/books/progress/dashboard",
    providesTags: ["Books"],
  }),

  getProgressAnalytics: builder.query<any, void>({
    query: () => "/books/analytics",
    providesTags: ["BookStats"],
  }),

  getBookProgressAnalytics: builder.query<any, string>({
    query: (id) => `/books/${id}/analytics`,
    providesTags: (result, error, id) => [{ type: "Book", id }],
  }),

  createBook: builder.mutation<Book, Partial<Book>>({
    query: (body) => ({ url: "/books/createBook", method: "POST", body }),
    invalidatesTags: ["Books", "BookStats"],
  }),

  updateBook: builder.mutation<Book, { id: string; body: Partial<Book> }>({
    query: ({ id, body }) => ({ url: `/books/${id}`, method: "PUT", body }),
    invalidatesTags: (result, error, { id }) => [
      { type: "Book", id },
      "Books",
      "BookStats",
    ],
  }),

  updateReadingProgress: builder.mutation<
    Book,
    {
      id: string;
      currentPage?: number;
      currentChapter?: number;
      note?: string;
      status?: string;
    }
  >({
    query: ({ id, ...body }) => ({
      url: `/books/${id}/progress`,
      method: "PUT",
      body,
    }),
    invalidatesTags: (result, error, { id }) => [
      { type: "Book", id },
      "Books",
      "BookStats",
    ],
  }),

  deleteBook: builder.mutation<void, string>({
    query: (id) => ({ url: `/books/${id}`, method: "DELETE" }),
    invalidatesTags: ["Books", "BookStats"],
  }),

  getBookReadingSessions: builder.query<ReadingSession[], string>({
    query: (bookId) => `/books/${bookId}/sessions`,
    providesTags: (result, error, bookId) => [{ type: "Sessions", id: bookId }],
  }),

  getReadingStatistics: builder.query<any, string>({
    query: (bookId) => `/books/${bookId}/statistics`,
    providesTags: (result, error, bookId) => [{ type: "Sessions", id: bookId }],
  }),

  createReadingSession: builder.mutation<
    ReadingSession,
    { bookId: string; body: Partial<ReadingSession> }
  >({
    query: ({ bookId, body }) => ({
      url: `/books/${bookId}/sessions`,
      method: "POST",
      body,
    }),
    invalidatesTags: (result, error, { bookId }) => [
      { type: "Sessions", id: bookId },
      { type: "Book", id: bookId },
      "Books",
      "BookStats",
    ],
  }),

  deleteReadingSession: builder.mutation<void, string>({
    query: (sessionId) => ({
      url: `/books/sessions/${sessionId}`,
      method: "DELETE",
    }),
    invalidatesTags: ["Sessions", "BookStats"],
  }),

  getChapterNotes: builder.query<ChapterNote[], string>({
    query: (bookId) => `/books/${bookId}/notes`,
    transformResponse: (res: { notes: ChapterNote[] }) => res.notes,
    providesTags: (result, error, bookId) => [{ type: "Notes", id: bookId }],
  }),
  createChapterNote: builder.mutation<
    ChapterNote,
    { bookId: string; body: Partial<ChapterNote> }
  >({
    query: ({ bookId, body }) => ({
      url: `/books/${bookId}/notes`,
      method: "POST",
      body,
    }),
    invalidatesTags: (result, error, { bookId }) => [
      { type: "Notes", id: bookId },
    ],
  }),

  getNotesByBookId: builder.query<ChapterNote[], string>({
    query: (bookId) => `/books/${bookId}/notes`,
    providesTags: (result, error, bookId) => [{ type: "Notes", id: bookId }],
  }),

  updateChapterNote: builder.mutation<
    ChapterNote,
    { noteId: string; body: Partial<ChapterNote> }
  >({
    query: ({ noteId, body }) => ({
      url: `/books/notes/${noteId}`,
      method: "PUT",
      body,
    }),
    invalidatesTags: ["Notes"],
  }),

  deleteChapterNote: builder.mutation<void, string>({
    query: (noteId) => ({ url: `/books/notes/${noteId}`, method: "DELETE" }),
    invalidatesTags: ["Notes"],
  }),

  getBookGoals: builder.query<ReadingGoal[], string>({
    query: (bookId) => `/books/${bookId}/goals`,
    providesTags: (result, error, bookId) => [{ type: "Goals", id: bookId }],
  }),

  getGoalStatistics: builder.query<any, { userId: string; bookId: string }>({
    query: ({ userId, bookId }) => `/books/goals/stats/${userId}/${bookId}`,
    providesTags: ["Goals"],
  }),

  checkGoalProgress: builder.query<any, string>({
    query: (goalId) => `/books/goals/${goalId}/progress`,
    providesTags: (result, error, goalId) => [{ type: "Goals", id: goalId }],
  }),

  checkAllGoals: builder.query<any, void>({
    query: () => `/books/goals/check`,
    providesTags: ["Goals"],
  }),

  createReadingGoal: builder.mutation<
    ReadingGoal,
    { bookId: string; body: Partial<ReadingGoal> }
  >({
    query: ({ bookId, body }) => ({
      url: `/books/${bookId}/goals`,
      method: "POST",
      body,
    }),
    invalidatesTags: (result, error, { bookId }) => [
      { type: "Goals", id: bookId },
    ],
  }),

  updateReadingGoal: builder.mutation<
    ReadingGoal,
    { goalId: string; body: Partial<ReadingGoal> }
  >({
    query: ({ goalId, body }) => ({
      url: `/books/goals/${goalId}`,
      method: "PUT",
      body,
    }),
    invalidatesTags: (result, error, { goalId }) => [
      { type: "Goals", id: goalId },
    ],
  }),

  deleteReadingGoal: builder.mutation<void, string>({
    query: (goalId) => ({ url: `/books/goals/${goalId}`, method: "DELETE" }),
    invalidatesTags: ["Goals"],
  }),

  register: builder.mutation<User, Partial<User>>({
    query: (body) => ({ url: "/books/register", method: "POST", body }),
  }),

  login: builder.mutation<
    { token: string; user: User },
    { email: string; password: string }
  >({
    query: (body) => ({ url: "/books/login", method: "POST", body }),
  }),

  demoLogin: builder.mutation<{ token: string; user: User }, void>({
    query: () => ({ url: "/books/demo", method: "POST" }),
  }),

  logout: builder.mutation<void, void>({
    query: () => ({ url: "/books/logout", method: "POST" }),
  }),

  getProfile: builder.query<ProfileResponse, void>({
    query: () => "/books/myProfile",
  }),
  updateProfile: builder.mutation<User, Partial<User>>({
    query: (body) => ({ url: "/books/updateProfile", method: "PUT", body }),
  }),

  changePassword: builder.mutation<
    void,
    { oldPassword: string; newPassword: string }
  >({
    query: (body) => ({ url: "/books/change-password", method: "PUT", body }),
  }),

  verifyEmail: builder.mutation<void, { token: string }>({
    query: (body) => ({ url: "/books/verify-email", method: "POST", body }),
  }),

  resendVerification: builder.mutation<void, { email: string }>({
    query: (body) => ({
      url: "/books/resend-verification",
      method: "POST",
      body,
    }),
  }),
  forgotPassword: builder.mutation<void, { email: string }>({
    query: (body) => ({ url: "/books/forgot-password", method: "POST", body }),
  }),

  resetPassword: builder.mutation<void, { token: string; newPassword: string }>(
    {
      query: (body) => ({ url: "/books/reset-password", method: "POST", body }),
    }
  ),
}));

export const {
  useGetBooksQuery,
  useGetBookByIdQuery,
  useGetBooksByStatusQuery,
  useGetRecentBooksQuery,
  useSearchBooksQuery,
  useGetBookStatisticsQuery,
  useGetAllBooksProgressQuery,
  useGetProgressAnalyticsQuery,
  useGetBookProgressAnalyticsQuery,
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
  useGetNotesByBookIdQuery,
  useLogoutMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useVerifyEmailMutation,
  useResendVerificationMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = booksApi;
