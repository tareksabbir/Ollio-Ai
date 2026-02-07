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

type Template = {
  emoji: LucideIcon;
  title: string;
  prompt: string;
};

const base = (name: string, layout: string) => `
Build a ${name} website.

Requirements:
- UI only
- No backend
- No external APIs
- Use mock JSON data only
- Fully responsive
- Clean modern design
- Reusable components

Layout:
${layout}

`;

export const PROJECT_TEMPLATES: Template[] = [
  {
    emoji: Film,
    title: "Build a Netflix clone",
    prompt: base("Netflix-style streaming homepage", `
- Hero banner with dark gradient
- Multiple horizontal movie rows
- Hoverable cards
- Details modal
`),
  },

  {
    emoji: LayoutDashboard,
    title: "Build an admin dashboard",
    prompt: base("modern admin dashboard", `
- Sidebar navigation
- Stat summary cards
- Chart placeholder section
- Table with filtering and pagination
`),
  },

  {
    emoji: FolderOpen,
    title: "Build a file manager",
    prompt: base("macOS-style file manager", `
- Folder sidebar
- File grid with previews
- Rename and delete actions
- Toolbar controls
`),
  },

  {
    emoji: Youtube,
    title: "Build a YouTube clone",
    prompt: base("YouTube-style video homepage", `
- Left category sidebar
- Video thumbnail grid
- Search bar
- Video preview modal
`),
  },

  {
    emoji: ShoppingBag,
    title: "Build a store page",
    prompt: base("e-commerce store page", `
- Category filters
- Product grid
- Add to cart
- Cart summary panel
`),
  },

  {
    emoji: Home,
    title: "Build an Airbnb clone",
    prompt: base("Airbnb-style property listings page", `
- Filter sidebar
- Property cards
- Image previews
- Property detail modal
`),
  },

  {
    emoji: Music,
    title: "Build a Spotify clone",
    prompt: base("Spotify-style music player", `
- Playlist sidebar
- Track list
- Album artwork
- Playback controls (play/pause/next)
`),
  },

  {
    emoji: MessageSquare,
    title: "Build a chat app",
    prompt: base("real-time chat UI (local only)", `
- Conversation sidebar
- Chat message area
- Message input box
- Timestamped messages
`),
  },

  {
    emoji: FileText,
    title: "Build a note-taking app",
    prompt: base("minimal note-taking app", `
- Note list sidebar
- Editor panel
- Create/delete notes
- Search notes
`),
  },

  {
    emoji: UtensilsCrossed,
    title: "Build a food delivery app",
    prompt: base("food delivery ordering app", `
- Restaurant cards
- Menu items
- Add to cart
- Checkout modal
`),
  },

  {
    emoji: Instagram,
    title: "Build an Instagram clone",
    prompt: base("Instagram-style feed", `
- Story bar
- Post feed
- Like/comment buttons
- Post detail modal
`),
  },

  {
    emoji: Gamepad2,
    title: "Build a game library",
    prompt: base("game library browser", `
- Game cards
- Genre filters
- Favorites toggle
- Game detail modal
`),
  },

  {
    emoji: BookOpen,
    title: "Build a book library",
    prompt: base("book library app", `
- Book cover grid
- Search and filters
- Reading list
- Book detail modal
`),
  },

  {
    emoji: Briefcase,
    title: "Build a job board",
    prompt: base("job board listings page", `
- Job cards
- Filter sidebar
- Save jobs
- Job detail modal
`),
  },

  {
    emoji: Palette,
    title: "Build a design portfolio",
    prompt: base("creative design portfolio", `
- Masonry project grid
- Category filters
- Project detail modal
- Smooth hover animations
`),
  },

  {
    emoji: Calendar,
    title: "Build a calendar app",
    prompt: base("calendar scheduling app", `
- Month view
- Week view
- Day view
- Event creation modal
`),
  },

  {
    emoji: GraduationCap,
    title: "Build a learning platform",
    prompt: base("online learning dashboard", `
- Course cards
- Lesson sidebar
- Progress tracking
- Continue learning section
`),
  },

  {
    emoji: Cloud,
    title: "Build a weather app",
    prompt: base("weather dashboard UI", `
- Current weather
- Hourly forecast
- 7-day forecast
- City search and favorites
`),
  },

  {
    emoji: CreditCard,
    title: "Build a banking dashboard",
    prompt: base("banking/finance dashboard", `
- Balance cards
- Transactions table
- Spending chart placeholder
- Transfer form
`),
  },

  {
    emoji: Target,
    title: "Build a habit tracker",
    prompt: base("habit tracking app", `
- Daily checklist
- Streak counters
- Calendar heatmap
- Add/remove habits
`),
  },

  {
    emoji: Mic,
    title: "Build a podcast app",
    prompt: base("podcast player app", `
- Show cards
- Episode list
- Playback controls
- Subscribe button
`),
  },
];
