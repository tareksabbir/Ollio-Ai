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
      "Build a Netflix-style homepage with a hero banner (use a nice, dark-mode compatible gradient here), movie sections, responsive cards, and a modal for viewing details using mock data and local state. Use dark mode.",
  },
  {
    emoji: LayoutDashboard,
    title: "Build an admin dashboard",
    prompt:
      "Create an admin dashboard with a sidebar, stat cards, a chart placeholder, and a basic table with filter and pagination using local state. Use clear visual grouping and balance in your design for a modern, professional look.",
  },
  {
    emoji: KanbanSquare,
    title: "Build a kanban board",
    prompt:
      "Build a kanban board with drag-and-drop using react-beautiful-dnd and support for adding and removing tasks with local state. Use consistent spacing, column widths, and hover effects for a polished UI.",
  },
  {
    emoji: FolderOpen,
    title: "Build a file manager",
    prompt:
      "Build apple-style a file manager with folder list, file grid, and options to rename or delete items using mock data and local state. Focus on spacing, clear icons, and visual distinction between folders and files.",
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
      "Build a amazon-style  store page with category filters, a product grid, and local cart logic to add and remove items. Focus on clear typography, spacing, and button states for a great e-commerce UI.",
  },
  {
    emoji: Home,
    title: "Build an Airbnb clone",
    prompt:
      "Build an Airbnb-style listings grid with mock data, filter sidebar, and a modal with property details using local state. Use card spacing, soft shadows, and clean layout for a welcoming design.",
  },
  {
    emoji: Music,
    title: "Build a Spotify clone",
    prompt:
      "Build a Spotify-style music player with a sidebar for playlists, a main area for song details, and playback controls. Use local state for managing playback and song selection. Prioritize layout balance and intuitive control placement for a smooth user experience. Use dark mode.",
  },
  {
    emoji: MessageSquare,
    title: "Build a chat app",
    prompt:
      "Build a  faebook messenger-style messaging app with a sidebar showing conversations, a main chat area with messages, and an input field. Use local state for message history. Include timestamps, user avatars, and smooth message animations for a polished chat experience.",
  },
  {
    emoji: FileText,
    title: "Build a note-taking app",
    prompt:
      "Build a apple-style  note-taking app with a sidebar for note list, rich text editor area, and folder organization. Use local state for managing notes. Focus on clean typography, intuitive navigation, and a distraction-free writing experience.",
  },
  {
    emoji: UtensilsCrossed,
    title: "Build a food delivery app",
    prompt:
      "Build a zomato-style  food delivery app with restaurant cards, menu items, and a cart system. Include category filters and a checkout modal. Use local state for cart management. Focus on appetizing imagery, clear pricing, and smooth add-to-cart interactions.",
  },
  {
    emoji: Instagram,
    title: "Build an Instagram clone",
    prompt:
      "Build an Instagram-style feed with post cards showing images, likes, comments, and a story bar at the top. Include a modal for viewing full posts. Use local state for interactions. Focus on clean grid layouts and engaging visual hierarchy.",
  },
  {
    emoji: Gamepad2,
    title: "Build a game library",
    prompt:
      "Build a game library interface with game cards, filter options by genre and platform, and detailed game modals. Use local state for favorites and filters. Create an exciting, gaming-focused design with bold colors and dynamic layouts.",
  },
  {
    emoji: BookOpen,
    title: "Build a book library",
    prompt:
      "Build a book library with book covers in a grid, search and filter by genre, and a reading list feature. Include a modal with book details and reviews. Use local state for managing reading lists. Focus on elegant typography and comfortable spacing.",
  },
  {
    emoji: Briefcase,
    title: "Build a job board",
    prompt:
      "Build a job board with job listings, filter sidebar for location and role, and detailed job modals with apply buttons. Use local state for saved jobs. Focus on professional design, clear information hierarchy, and easy-to-scan job cards.",
  },
  {
    emoji: Dumbbell,
    title: "Build a fitness tracker",
    prompt:
      "Build a fitness tracker with workout cards, progress charts, and a calendar view for scheduled workouts. Use local state for tracking activities. Focus on motivating design with progress indicators and clean data visualization.",
  },
  {
    emoji: Palette,
    title: "Build a design portfolio",
    prompt:
      "Build a design portfolio with a masonry grid of projects, category filters, and project detail modals with images and descriptions. Use local state for filtering. Create a visually striking layout that showcases creativity and attention to detail.",
  },
  {
    emoji: Calendar,
    title: "Build a calendar app",
    prompt:
      "Build a google-style  calendar app with month/week/day views, event creation modal, and event list sidebar. Use local state for managing events. Focus on clean date visualization, intuitive navigation, and color-coded event categories.",
  },
  {
    emoji: GraduationCap,
    title: "Build a learning platform",
    prompt:
      "Build an online learning platform with course cards, progress tracking, video player placeholder, and lesson sidebar. Use local state for course progress. Focus on educational design with clear learning paths and progress indicators.",
  },
  {
    emoji: Cloud,
    title: "Build a weather app",
    prompt:
      "Build a apple-style  weather app with current conditions, hourly forecast, and 7-day outlook. Include location search and favorite cities. Use local state for managing locations. Focus on clear data presentation with appropriate icons and visual weather indicators.",
  },
  {
    emoji: CreditCard,
    title: "Build a banking dashboard",
    prompt:
      "Build a paypal-style  banking dashboard with account balances, recent transactions list, spending charts, and quick transfer feature. Use local state for transaction data. Focus on trust-building design with clear numbers, secure aesthetics, and organized financial information.",
  },
  {
    emoji: Target,
    title: "Build a habit tracker",
    prompt:
      "Build a habit tracker with daily checklist, streak counters, and calendar heatmap visualization. Use local state for tracking habits. Focus on motivating design with visual progress indicators and satisfying completion interactions.",
  },
  {
    emoji: Mic,
    title: "Build a podcast app",
    prompt:
      "Build a apple-style podcast app with show cards, episode list, audio player controls, and subscription management. Use local state for playback and subscriptions. Focus on audio-first design with clear episode navigation and intuitive playback controls.",
  },
];
