import {
  Film,
  LayoutDashboard,
  KanbanSquare,
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
  Dumbbell,
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
      "Build a Netflix-style homepage with a large hero banner and multiple movie rows. Use dark mode with a gradient overlay on the hero. Use real Unsplash movie-related images via direct movie images.unsplash.com URLs (no placeholders). Include responsive cards, hover effects, and a modal for viewing movie details using mock data and local state.",
  },
  {
    emoji: LayoutDashboard,
    title: "Build an admin dashboard",
    prompt:
      "Create a modern admin dashboard with a sidebar, stat cards, charts, and a data table with filtering and pagination using local state. Use a clean professional layout with clear visual grouping. Include a subtle header or empty-state image using a real Unsplash image (no placeholders).",
  },
  {
    emoji: KanbanSquare,
    title: "Build a kanban board",
    prompt:
      "Build a kanban board with drag-and-drop columns using react-beautiful-dnd. Support adding, editing, and removing tasks with local state. Maintain consistent column widths, spacing, and hover states. Include a subtle Unsplash workspace image in the header area.",
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
      "Build a YouTube-style homepage with a category sidebar, video grid, and preview modal. Use real Unsplash images for video thumbnails using direct image URLs. Use clean alignment, consistent aspect ratios, and local state for interactions. Avoid placeholders.",
  },
  {
    emoji: ShoppingBag,
    title: "Build a store page",
    prompt:
      "Build an Amazon-style e-commerce store with category filters, a product grid, and a local cart system. Use real Unsplash product images with consistent sizing. Focus on clear typography, spacing, pricing visibility, and strong button states. No placeholder images.",
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
      "Build a Facebook Messenger-style chat app with a conversation sidebar, chat view, and message input. Use real Unsplash profile images for avatars. Include timestamps, message grouping, and smooth animations. Use local state for message history.",
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
    emoji: Dumbbell,
    title: "Build a fitness tracker",
    prompt:
      "Build a fitness tracker with workout cards, progress charts, and a calendar view. Use real Unsplash fitness-related images. Use local state for tracking workouts. Focus on motivating visuals and clear progress indicators.",
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
