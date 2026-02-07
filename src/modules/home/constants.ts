import {
  Film,
  LayoutDashboard,
  FolderOpen,
  Youtube,
  ShoppingBag,
  Home,
  Music,
  MessageSquare,
  FileText,
  UtensilsCrossed,
  Instagram,
  Gamepad2,
  BookOpen,
  Briefcase,
  Palette,
  Calendar,
  GraduationCap,
  Cloud,
  CreditCard,
  Target,
  Mic,
  type LucideIcon,
} from "lucide-react";

export const PROJECT_TEMPLATES: Array<{
  emoji: LucideIcon;
  title: string;
  prompt: string;
}> = [
  {
    emoji: Film,
    title: "Build a Netflix clone",
    prompt:
      "Build a Netflix-style homepage with a hero banner (use a nice, dark-mode compatible gradient here), movie sections, responsive cards, and a modal for viewing details using mock data and local state. Use dark mode.",
  },
  {
    emoji: LayoutDashboard,
    title: "Build an admin dashboard",
    prompt:
      "Create an admin dashboard with a sidebar, stat cards, a chart placeholder, and a basic table with filter and pagination using local state. Use clear visual grouping and balance in your design for a modern, professional look.",
  },
  {
    emoji: FolderOpen,
    title: "Build a file manager",
    prompt:
      "Build an Apple-style file manager with a folder sidebar, file grid, and actions to rename or delete items using mock data and local state. Use real Unsplash images as file previews where applicable. Focus on spacing, clarity, and soft shadows. No placeholder images.",
  },
  {
    emoji: Youtube,
    title: "Build a YouTube clone",
    prompt:
      "Build a YouTube-style homepage with mock video thumbnails, a category sidebar, and a modal preview with title and description using local state. Ensure clean alignment and a well-organized grid layout.",
  },
  {
    emoji: ShoppingBag,
    title: "Build a store page",
    prompt:
      "Build a store page with category filters, a product grid, and local cart logic to add and remove items. Focus on clear typography, spacing, and button states for a great e-commerce UI.",
  },
  {
    emoji: Home,
    title: "Build an Airbnb clone",
    prompt:
      "Build an Airbnb-style listings grid with property cards, filter sidebar, and a property detail modal using local state. Use real Unsplash property images with consistent aspect ratios. Apply soft shadows, rounded cards, and a welcoming layout. No placeholders.",
  },
  {
    emoji: Music,
    title: "Build a Spotify clone",
    prompt:
      "Build a Spotify-style music player with a playlist sidebar, main content area, and playback controls. Use dark mode. Include album artwork using real Unsplash music-related images. Use local state for playback and song selection. Prioritize layout balance and intuitive controls.",
  },
  {
    emoji: MessageSquare,
    title: "Build a chat app",
    prompt:
      "Build a chat app with a conversation sidebar, chat view, and message input. Use real Unsplash profile images for avatars. Include timestamps, message grouping, and smooth animations. Use local state for message history.",
  },
  {
    emoji: FileText,
    title: "Build a note-taking app",
    prompt:
      "Build an Apple-style note-taking app with a note list sidebar, editor area, and folder organization. Use local state for notes. Include a minimal Unsplash image in empty states only. Focus on clean typography and distraction-free writing.",
  },
  {
    emoji: UtensilsCrossed,
    title: "Build a food delivery app",
    prompt:
      "Build a Zomato-style food delivery app with restaurant cards, menu items, and a cart system using local state. Use real Unsplash food images directly in image tags. Include category filters and a checkout modal. Focus on appetizing visuals and smooth interactions.",
  },
  {
    emoji: Instagram,
    title: "Build an Instagram clone",
    prompt:
      "Build an Instagram-style feed with a story bar, image posts, likes, and comments. Use real Unsplash images for posts and avatars. Include a modal for viewing full posts. Use local state for interactions and maintain a clean grid layout.",
  },
  {
    emoji: Gamepad2,
    title: "Build a game library",
    prompt:
      "Build a game library with game cards, genre and platform filters, and detailed modals. Use real Unsplash gaming-related images. Use local state for favorites and filters. Create a bold, immersive gaming-focused UI.",
  },
  {
    emoji: BookOpen,
    title: "Build a book library",
    prompt:
      "Build a book library with a grid of book covers, search, and genre filters. Use real Unsplash book-cover-style images. Include a reading list feature and detail modal. Focus on elegant typography and comfortable spacing.",
  },
  {
    emoji: Briefcase,
    title: "Build a job board",
    prompt:
      "Build a job board with job cards, filter sidebar, and job detail modals. Use real Unsplash office or workplace images subtly in headers or empty states. Focus on professional design and easy-to-scan listings. Use local state for saved jobs.",
  },
  {
    emoji: Palette,
    title: "Build a design portfolio",
    prompt:
      "Build a design portfolio with a masonry grid of projects, category filters, and project detail modals. Use real Unsplash images to represent projects. Focus on strong visual hierarchy, spacing, and a premium creative aesthetic.",
  },
  {
    emoji: Calendar,
    title: "Build a calendar app",
    prompt:
      "Build a Google-style calendar app with month, week, and day views. Include event creation modals and color-coded events using local state. Use a subtle Unsplash productivity image in the header only. Focus on clean date visualization.",
  },
  {
    emoji: GraduationCap,
    title: "Build a learning platform",
    prompt:
      "Build an online learning platform with course cards, progress tracking, and lesson sidebars. Use real Unsplash education-related images for courses. Use local state for progress. Focus on clarity, structure, and learning flow.",
  },
  {
    emoji: Cloud,
    title: "Build a weather app",
    prompt:
      "Build an Apple-style weather app with current conditions, hourly forecast, and 7-day outlook. Use real Unsplash weather images for locations. Include search and favorite cities using local state. Focus on clean data presentation.",
  },
  {
    emoji: CreditCard,
    title: "Build a banking dashboard",
    prompt:
      "Build a PayPal-style banking dashboard with balances, recent transactions, spending charts, and quick transfers. Use real Unsplash finance-related images sparingly in headers. Focus on trust, clarity, and organized financial data.",
  },
  {
    emoji: Target,
    title: "Build a habit tracker",
    prompt:
      "Build a habit tracker with daily checklists, streak counters, and a calendar heatmap. Use real Unsplash lifestyle or productivity images subtly. Use local state for habits. Focus on motivating progress visuals.",
  },
  {
    emoji: Mic,
    title: "Build a podcast app",
    prompt:
      "Build an Apple-style podcast app with show cards, episode lists, and playback controls. Use real Unsplash podcast or studio images. Use local state for playback and subscriptions. Focus on audio-first design and intuitive navigation.",
  },
];