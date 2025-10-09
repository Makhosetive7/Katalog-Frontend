# Katalog Frontend

A **Next.js + TypeScript** frontend for the Katalog backend API.  
This application provides an intuitive user interface to manage books, track progress, set goals, write notes, and view analytics.

---

## Features

### Authentication

- Register new users with email verification.
- Login, logout, and demo login support.
- Password reset with verification flow.

### Book Management

- Add, update, and remove books.
- View books by status: **Completed**, **In Progress**.
- Search and view detailed book information.
- Track reading progress interactively.

### Goals & Sessions

- Set reading goals per book.
- Start and log reading sessions.
- Track progress toward challenges and goals.

### Notes

- Create and manage notes for specific chapters.
- View grouped notes for quick review.

### Dashboard & Analytics

- Visualize progress with charts and statistics.
- See daily/weekly reading streaks.
- Monitor achievements and reading history.

### Profile

- Update profile details and preferences.
- Manage account security (password change).

---

## Key Pages

### Dashboard (/dashboard)

- Overview of reading statistics
- Recent reading activity
- Current reading challenges
- Progress towards goals

### Book Management (/books)

- In Progress (/books/InProgress) - Currently reading books
- Completed (/books/completed) - Finished books
- Book Notes (/books/notes) - All your annotations

### User Profile (/profile)

- Personal information management
- Reading preferences
- Account settings

### Onboarding (/onBoarding)

- Guided setup for new users
- Reading preferences selection
- Initial book additions

---

## Component Overview

- AddBookModal - Add new books to library
- BookCard - Display book information
- BookDetailsModal - Detailed book view
- ReadingGoalModal - Set reading targets
- ReadingSessionModal - Log reading progress
- ChapterNotesModal - Take chapter notes
- StatisticsCards - Display reading stats

## Layout Components

- NavBar - Navigation with user menu

### Redux State Management (API Slices)

- Books API (redux/api/books.ts) - Handles all book, authentication and progress tracking related API calls

---

## Tech Stack

- **Framework**: [Next.js 13+ (App Router)](https://nextjs.org/)
- **Language**: TypeScript
- **State Management**: Redux Toolkit (RTK Query for API calls)
- **Styling**: CSS (global + modular)
- **UI Components**: Custom React components (modals, cards, analytics)
- **API Integration**: Katalog API backend (Express.js + MongoDB)
