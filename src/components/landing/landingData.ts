import {
  AutoStories,
  LocalFireDepartment,
  EmojiEvents,
  BarChart,
  EditNote,
  Groups,
} from "@mui/icons-material";
import { createElement } from "react";

export const features = [
  {
    icon: createElement(LocalFireDepartment, { sx: { fontSize: 28 } }),
    title: "Reading Streaks",
    description:
      "Keep the fire alive. Log daily and watch your streak meter climb — miss a day, feel the burn.",
    color: "#FF6B35",
    bg: "rgba(255, 107, 53, 0.1)",
  },
  {
    icon: createElement(AutoStories, { sx: { fontSize: 28 } }),
    title: "Your Bookshelf",
    description:
      "Add books and articles to your shelf. Level up as you finish more — from Newcomer to Literary Legend.",
    color: "#5C2E2E",
    bg: "rgba(92, 46, 46, 0.1)",
  },
  {
    icon: createElement(BarChart, { sx: { fontSize: 28 } }),
    title: "Progress Bars",
    description:
      "See exactly how far you've come. Per-book progress bars that fill up with every page you log.",
    color: "#3B82F6",
    bg: "rgba(59, 130, 246, 0.1)",
  },
  {
    icon: createElement(EmojiEvents, { sx: { fontSize: 28 } }),
    title: "Daily Reading XP",
    description:
      "Earn XP for every session. Hit daily goals, unlock badges, and flex your reading stats.",
    color: "#58CC02",
    bg: "rgba(88, 204, 2, 0.1)",
  },
  {
    icon: createElement(EditNote, { sx: { fontSize: 28 } }),
    title: "Chapter Notes",
    description:
      "Jot quotes, hot takes, and aha moments per chapter. Your brain dump, beautifully organized.",
    color: "#EC4899",
    bg: "rgba(236, 72, 153, 0.1)",
  },
  {
    icon: createElement(Groups, { sx: { fontSize: 28 } }),
    title: "Share the Wins",
    description:
      "Compare streaks with friends, celebrate milestones, and make reading a little competitive.",
    color: "#F59E0B",
    bg: "rgba(245, 158, 11, 0.1)",
  },
];

export const steps = [
  {
    step: "1",
    title: "Add your reads",
    description: "Sign up free, drop in the books or articles you're reading right now.",
    emoji: "📚",
  },
  {
    step: "2",
    title: "Log your progress",
    description: "Update pages, start sessions, earn XP — it takes like 10 seconds.",
    emoji: "⚡",
  },
  {
    step: "3",
    title: "Level up",
    description: "Streaks grow, badges unlock, your shelf gets legendary. Keep going.",
    emoji: "🏆",
  },
];

export const testimonials = [
  {
    quote:
      "I finally stopped lying to myself about how much I read. The streak feature is genuinely addictive.",
    name: "Maya R.",
    role: "College sophomore",
    avatar: "M",
    color: "#5C2E2E",
  },
  {
    quote:
      "It's like Duolingo but for books. I've finished 4 novels this semester because the progress bars are so satisfying.",
    name: "Jordan K.",
    role: "Grad student",
    avatar: "J",
    color: "#FF6B35",
  },
  {
    quote:
      "Chapter notes changed how I study. I actually remember what I read now instead of just turning pages.",
    name: "Alex T.",
    role: "High school senior",
    avatar: "A",
    color: "#58CC02",
  },
];

export const stats = [
  { value: "12K+", label: "Pages logged this week" },
  { value: "847", label: "Active reading streaks" },
  { value: "4.9★", label: "Reader satisfaction" },
];

export const shelfBooks = [
  { title: "Atomic Habits", progress: 72, pages: "198/275", color: "#5C2E2E" },
  { title: "The Midnight Library", progress: 45, pages: "126/280", color: "#3B82F6" },
  { title: "Sapiens", progress: 91, pages: "412/450", color: "#58CC02" },
];
