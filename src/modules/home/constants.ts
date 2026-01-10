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
      "Build Netflix homepage: hero banner with gradient overlay, horizontal movie rows by category, navbar. Dark mode (#141414). Images: https://images.unsplash.com/{photo_id}?auto=format&fit=crop&w=1200&q=80 (cinematic/movie themes). Movie cards with title, rating, year, hover scale effects. Modal for movie details with cast, description, play button. React state for modals, selected movie. Components: Navbar, HeroBanner, MovieRow, MovieCard, MovieModal. Mock: 5 categories, 8-10 movies each.",
  },
  {
    emoji: LayoutDashboard,
    title: "Build an admin dashboard",
    prompt:
      "Admin dashboard: collapsible sidebar nav, header with search, stat KPI cards, charts (recharts: line/bar/pie), data table with sort/filter/pagination. Clean professional layout. Header image: https://images.unsplash.com/{photo_id}?auto=format&fit=crop&w=1200&q=80. React state for sidebar, filters, pagination, modals. Components: Sidebar, Header, StatCard, RevenueChart, SalesChart, TrafficChart, DataTable. Mock: 50+ rows.",
  },
  {
    emoji: KanbanSquare,
    title: "Build a kanban board",
    prompt:
      "Kanban with native HTML5 drag-drop (onDragStart, onDragOver, onDrop). Columns: Backlog, To Do, In Progress, Done. Cards show title, description, avatar (Unsplash), priority badge, due date. Top navbar, add/edit/delete tasks, search/filter. React state for tasks, drag state, modals. Components: Board, Column, TaskCard, AddTaskModal, EditTaskModal. Mock: 15-20 tasks.",
  },
  {
    emoji: FolderOpen,
    title: "Build a file manager",
    prompt:
      "macOS file manager: folder tree sidebar, grid/list view toggle, breadcrumb toolbar, search. File items with thumbnails (Unsplash images for image files: https://images.unsplash.com/{photo_id}?auto=format&fit=crop&w=400&q=80, icons for others), name, size, date. Right-click menu (open, rename, delete, move), preview modal, inline rename, delete confirm. React state for path, selected files, view mode, menus, modals. Components: Sidebar, Toolbar, FileGrid, FileList, FileItem, ContextMenu, PreviewModal. Mock: 30-40 files, hierarchical folders.",
  },
  {
    emoji: Youtube,
    title: "Build a YouTube clone",
    prompt:
      "YouTube platform: collapsible category sidebar, header with search, video grid, player modal. Cards show thumbnail (Unsplash: https://images.unsplash.com/{photo_id}?auto=format&fit=crop&w=1200&q=80), title, channel with avatar, views, date, duration. Player modal with large video area, title, channel info, subscribe button, like/dislike, description, comments. Category filters. React state for sidebar, selected video, filters, search, modal. Components: Navbar, Sidebar, VideoGrid, VideoCard, VideoPlayer, CommentSection, RelatedVideos. Mock: 30-40 videos.",
  },
  {
    emoji: ShoppingBag,
    title: "Build a store page",
    prompt:
      "E-commerce: nav header with search/cart badge, filter sidebar (categories, price slider, rating, brands), product grid, sort dropdown. Product cards with image (Unsplash: https://images.unsplash.com/{photo_id}?auto=format&fit=crop&w=800&q=80), title, price, rating, quick add. Detail modal with gallery, description, size/color options, quantity, add to cart, reviews. Cart sidebar slides in showing items with thumbnail, quantity controls, remove, subtotal, checkout. React state for cart, filters, selected product, modals. Components: Header, Sidebar, ProductGrid, ProductCard, ProductModal, CartDrawer, CartItem, FilterSection. Mock: 40-50 products.",
  },
  {
    emoji: Home,
    title: "Build an Airbnb clone",
    prompt:
      "Airbnb: nav with search (location/dates/guests), filter chips (Beachfront, Cabins, etc.), property grid. Cards show image (Unsplash property: https://images.unsplash.com/{photo_id}?auto=format&fit=crop&w=800&q=80), location, rating, type, dates, price/night, heart favorite. Detail modal with carousel, host info, description, amenities with icons, bedroom/bath count, reviews, booking panel with date picker. React state for filters, favorites, selected property, booking dates/guests, modal. Components: Navbar, SearchBar, FilterChips, PropertyGrid, PropertyCard, PropertyModal, ImageCarousel, BookingPanel, ReviewSection. Mock: 30-40 properties.",
  },
  {
    emoji: Music,
    title: "Build a Spotify clone",
    prompt:
      "Spotify: dark mode (#121212, #1db954 accent), sidebar with nav/playlists, main content with featured/recent/album grids, bottom player bar. Cover art from Unsplash music: https://images.unsplash.com/{photo_id}?auto=format&fit=crop&w=600&q=80. Cards show artwork, title, description. Playlist view with large art, creator, play button, song table (# Title Artist Album Duration) with hover play. Player shows current song, artwork, controls (shuffle, prev, play, next, repeat), progress bar, volume slider. React state for current track, playing state, time, volume, selected playlist, queue. Components: Sidebar, MainContent, PlaylistCard, PlaylistView, TrackTable, TrackRow, Player, PlayerControls, VolumeControl. Mock: 10-15 playlists, 100+ songs.",
  },
  {
    emoji: MessageSquare,
    title: "Build a chat app",
    prompt:
      "Messaging: conversation list sidebar (avatar, name, last message, time, unread badge), header, chat area with message bubbles (different colors sent/received), timestamps, read receipts, grouping. Bottom input with emoji, attachment, text, send. Search, new chat modal, message actions (reply, copy, delete), typing indicator, online status. Avatars: Unsplash profile: https://images.unsplash.com/{photo_id}?auto=format&fit=crop&w=200&q=80. React state for conversations, selected conversation, messages, typing users, input, modals. Components: Sidebar, ConversationList, ConversationItem, ChatHeader, MessageList, Message, MessageInput, EmojiPicker, NewChatModal. Mock: 10-15 conversations, 50+ messages.",
  },
  {
    emoji: FileText,
    title: "Build a note-taking app",
    prompt:
      "Apple Notes: collapsible folder sidebar with tree (Personal, Work, etc.) and counts, middle notes list (title, preview, date) sortable, main editor with formatting toolbar (bold, italic, underline, headings, lists, checkbox, code). Top nav with editable title, delete, share, info (dates, word count). Search across notes, folder management, note actions (pin, archive, duplicate), drag-drop folders. Empty state image: https://images.unsplash.com/{photo_id}?auto=format&fit=crop&w=1200&q=80. React state for folders, notes, selected note, editor content, search, formatting. Components: Sidebar, FolderTree, NotesList, NoteItem, Editor, Toolbar, TitleBar, SearchBar, EmptyState. Mock: 20-30 notes.",
  },
  {
    emoji: UtensilsCrossed,
    title: "Build a food delivery app",
    prompt:
      "Food delivery: nav with logo, location, search, cart badge. Category chips (Pizza, Burgers, Asian, etc.), restaurant grid, cart sidebar. Restaurant cards with image (Unsplash food: https://images.unsplash.com/{photo_id}?auto=format&fit=crop&w=800&q=80), name, cuisine, rating, delivery time/fee, offer badge. Restaurant view with banner, info, menu tabs, items grid (image, name, description, price, add button with quantity). Item detail modal with large image, description, customization (size, add-ons, instructions), quantity, add to cart. Cart shows items with thumbnail, name, quantity controls, price, coupon input, fees, total, checkout. React state for cart, selected restaurant, menu, filters, modals, quantities. Components: Navbar, CategoryFilters, RestaurantGrid, RestaurantCard, RestaurantView, MenuSection, MenuItem, ItemModal, Cart, CartItem, CheckoutModal. Mock: 20-30 restaurants, 100+ items.",
  },
  {
    emoji: Instagram,
    title: "Build an Instagram clone",
    prompt:
      "Instagram: nav with logo, search, icons (home/messages/explore/notifications), profile menu. Stories bar with circular avatars (gradient rings), scrollable. Feed with posts: avatar/name, timestamp, image/carousel (Unsplash: https://images.unsplash.com/{photo_id}?auto=format&fit=crop&w=1200&q=80), like/comment/share/save buttons, like count, caption, comments link, add comment input. Right sidebar with profile card, suggestions. Story viewer modal full-screen with progress bars, prev/next, close. Post detail modal with larger image, full caption, comments list with replies, double-tap like animation. Create post modal with image upload placeholder, caption, location, settings. React state for posts, stories, comments, likes, saved, modal, current story. Components: Navbar, StoriesBar, StoryCircle, StoryViewer, Feed, Post, PostActions, Comments, Sidebar, SuggestionCard, CreatePostModal, PostModal. Mock: 30-40 posts, 15-20 stories.",
  },
  {
    emoji: Gamepad2,
    title: "Build a game library",
    prompt:
      "Gaming library: dark mode (#0f0f0f, #7b2cbf accent), nav with logo/search/tabs, filter sidebar (Genre: Action/RPG/Strategy, Platform: PC/PlayStation/Xbox, Rating, Price), game grid, sort options. Cards show cover (Unsplash gaming: https://images.unsplash.com/{photo_id}?auto=format&fit=crop&w=800&q=80), title, platform icons, price/discount, rating, favorite heart. Detail modal with large cover, screenshot gallery, title, developer, release date, genre tags, description, system requirements table, reviews with rating breakdown, buttons (Add to Cart, Wishlist, Play). Favorites/library section, wishlist tab, recent activity. React state for games, filters, favorites, cart, selected game, modal, view mode. Components: Navbar, Sidebar, FilterSection, GameGrid, GameCard, GameModal, Screenshots, ReviewSection, SystemRequirements, CartDrawer. Mock: 50+ games.",
  },
  {
    emoji: BookOpen,
    title: "Build a book library",
    prompt:
      "Book library: nav with logo/search/tabs, filter sidebar (Genre: Fiction/Mystery/Romance/Sci-Fi, Author, Year, Rating), book grid, view toggle (grid/list). Cards with cover (Unsplash books: https://images.unsplash.com/{photo_id}?auto=format&fit=crop&w=600&q=80), title, author, rating, pages, status badge (Want to Read/Reading/Finished). Detail modal with large cover, title, author bio, description, publication info, genre tags, rating breakdown with reviews, similar books, buttons (Add to Reading List, Mark as Reading, Finished, Write Review). Reading list page with currently reading (progress bars), want to read shelf, finished books with stats (books read, pages, streak). Reading goals widget, recommendations. React state for books, reading lists, filters, selected book, progress, modal, review form. Components: Navbar, Sidebar, BookGrid, BookCard, BookModal, ReviewSection, ReadingList, ProgressTracker, RecommendedBooks, ReadingGoals. Mock: 50+ books.",
  },
  {
    emoji: Briefcase,
    title: "Build a job board",
    prompt:
      "Job board: header with logo, search bar with location, post job button, sign in. Filter sidebar (Job Type: Full-time/Part-time/Remote, Experience, Salary Range, Company Size, Industry), job listings, sort dropdown (Recent, Relevant, Salary). Job cards with company logo/icon, title, company, location with remote badge, salary, posted date, type badges, save icon. Professional colors. Detail modal with company banner (Unsplash office: https://images.unsplash.com/{photo_id}?auto=format&fit=crop&w=1200&q=80), title, company info with follow, description with sections (Responsibilities, Requirements, Benefits), skills tags, deadline, share, apply button. Saved jobs page, application tracking (Applied, Under Review, Interview, Rejected, Accepted), company profile with culture photos and open positions. Apply modal with resume upload placeholder, cover letter textarea, additional info. React state for jobs, filters, saved, applications, selected job, modals, form. Components: Navbar, SearchBar, Sidebar, FilterSection, JobList, JobCard, JobDetail, ApplyModal, SavedJobs, ApplicationStatus, CompanyProfile. Mock: 40-50 jobs.",
  },
  {
    emoji: Dumbbell,
    title: "Build a fitness tracker",
    prompt:
      "Fitness tracker: nav with logo, tabs (dashboard/workouts/nutrition/progress), profile. Dashboard with stat cards (Workouts This Week, Calories, Active Minutes, Streak), weekly activity chart (recharts), quick action cards, calendar with workout icons. Workout cards with type icon, exercise name, duration, calories, completion badge, view button. Motivating Unsplash fitness images: https://images.unsplash.com/{photo_id}?auto=format&fit=crop&w=1200&q=80 for headers/empty states. Workout modal with exercise list (sets/reps/weight), rest timers, checkboxes, notes, summary. Workout library by type (Strength, Cardio, Yoga, HIIT) with templates. Progress page with charts (recharts: weight line, measurements, workout frequency bar, personal records), progress photos gallery, goals with progress bars. Nutrition tracker with calorie counter, macro pie chart, meal logging with cards, water intake. React state for workouts, exercises, progress, goals, nutrition, calendar, modals, forms. Components: Navbar, Dashboard, StatCard, ActivityChart, Calendar, WorkoutList, WorkoutCard, WorkoutModal, ExerciseList, ProgressCharts, GoalsSection, NutritionTracker, MealLog, WorkoutLibrary. Mock: diverse workouts, months of progress.",
  },
  {
    emoji: Palette,
    title: "Build a design portfolio",
    prompt:
      "Design portfolio: hero section (large headline, subtitle, CTA, creative background), nav with logo, links (work/about/contact), theme toggle. Featured projects in masonry grid, about section with bio/skills, footer with social links. Project cards with image (Unsplash creative: https://images.unsplash.com/{photo_id}?auto=format&fit=crop&w=1200&q=80), title, category tags, year. Modern bold design, strong typography, white space, animations. Detail modal with project hero, title, role, duration, tools, description (Challenge/Solution/Result sections), image gallery, testimonial, prev/next navigation. Filter buttons (All, Web, Mobile, Branding, UI/UX, Illustration). Smooth scroll animations, hover effects with scale/overlay, parallax on hero. About with designer photo, bio, skills with proficiency, tools with icons, experience timeline, contact form. React state for filtered projects, selected project, modal, theme, form. Components: Hero, Navbar, ProjectGrid, ProjectCard, ProjectModal, ImageGallery, FilterButtons, AboutSection, SkillsDisplay, Timeline, ContactForm, Footer. Mock: 20-25 projects with case studies. Premium aesthetic.",
  },
  {
    emoji: Calendar,
    title: "Build a calendar app",
    prompt:
      "Google Calendar: header with month/year nav arrows, today button, view selector (month/week/day), create event button, search. Sidebar with mini calendar, my calendars list (color-coded checkboxes), upcoming events. Month view with date cells, event bars with titles/colors, multiple events per day. Week view with hourly time slots (6 AM - 10 PM), event blocks by time with height based on duration, drag to resize. Day view with detailed hourly schedule. Events show title, time, location icon, category color. Create/edit modal with form (title, date picker, start/end time, repeat options, location, description, category with color picker, reminders). All-day events section, event detail popover with full info and edit/delete, multi-day spanning. Agenda view with chronological upcoming events. Empty state image: https://images.unsplash.com/{photo_id}?auto=format&fit=crop&w=1200&q=80. React state for current date, view mode, events, selected event, calendars with toggles, modal, form. Components: Header, Sidebar, MiniCalendar, CalendarList, MonthView, WeekView, DayView, AgendaView, EventModal, EventCard, TimeGrid, DateCell. Mock: 50+ events spanning months, categories, recurring, all-day.",
  },
  {
    emoji: GraduationCap,
    title: "Build a learning platform",
    prompt:
      "Learning platform: nav with logo, tabs (browse/my learning/dashboard), search, notifications, profile. Hero with featured course carousel, category grid, popular courses. Course cards with thumbnail (Unsplash education: https://images.unsplash.com/{photo_id}?auto=format&fit=crop&w=800&q=80), title, instructor with avatar, rating with student count, duration, lesson count, level badge (Beginner/Intermediate/Advanced), price/free tag, enroll button. Warm educational colors. Course detail page with banner, title, instructor section with bio/credentials, description with learning bullets, curriculum accordion (sections/lessons with icons/durations), requirements, reviews with rating breakdown, related courses, enroll CTA. Student dashboard with enrolled courses (progress bars, continue buttons), completed courses, certificates, learning streak. Course player with left lesson sidebar (curriculum with checkmarks), main video player, lesson title/description, tabs (overview/resources/discussions), next lesson button. Progress tracking showing overall progress, quiz scores, time spent. Quiz with multiple choice, submit, score display, review answers. React state for courses, enrolled courses, progress, current lesson, quiz answers, modals, filters. Components: Navbar, Hero, CourseGrid, CourseCard, CourseDetail, Curriculum, ReviewSection, Dashboard, CoursePlayer, LessonSidebar, VideoPlayer, QuizComponent, ProgressTracker, CertificateCard. Mock: 30-40 courses, 50+ lessons per course.",
  },
  {
    emoji: Cloud,
    title: "Build a weather app",
    prompt:
      "Apple Weather: search bar for cities, current location hero showing large temp, condition with icon, feels like, high/low, location name, beautiful weather background (Unsplash weather: https://images.unsplash.com/{photo_id}?auto=format&fit=crop&w=1200&q=80 - sunny/rainy/cloudy/snowy based on condition). Horizontal scrolling hourly forecast (next 24 hours with time, icon, temp). 7-day forecast with daily cards (day name, icon, high/low, precipitation chance). Detailed metrics cards: wind speed/direction with animated icon, humidity with gauge, UV index with safety level, visibility, air quality with color coding, sunrise/sunset with sun arc, pressure. City search with autocomplete, favorite cities list with quick-switch cards (current temp/conditions), location permission request. Weather alerts banner (storm warning, heat advisory). Dynamic gradients/icons by condition (sunny: bright blues/yellows, rainy: grays/blues, cloudy: muted, night: dark purples/blues). React state for current weather, hourly/daily forecast, favorite cities, selected city, search query, loading. Components: SearchBar, CurrentWeather, HourlyForecast, DailyForecast, DayCard, WeatherDetails, MetricCard, FavoriteCities, CityCard, WeatherAlert, SunPosition. Mock: weather data for multiple cities with all metrics. Beautiful visuals with weather-appropriate backgrounds.",
  },
  {
    emoji: CreditCard,
    title: "Build a banking dashboard",
    prompt:
      "Banking dashboard: secure header (bank logo, nav: accounts/transfer/bills/settings, notifications, profile), accounts overview with cards (checking, savings, credit) showing masked account number, current balance, available balance, view details. Professional trustworthy colors (navy, white, subtle accents). Finance Unsplash images in headers: https://images.unsplash.com/{photo_id}?auto=format&fit=crop&w=1200&q=80. Recent transactions table with filters showing date, description with merchant logo/icon, category tag, amount (color-coded income/expense), status badge. Spending analytics with recharts: spending by category pie, monthly trend line, income vs expenses bar, budget progress bars with categories (Groceries, Transportation, Entertainment). Quick transfer form with recipient selector, account dropdown, amount input, note, confirm button. Bills section with upcoming bills (due dates, amount, auto-pay toggle, pay now). Transaction detail modal with full info, merchant details, category, notes, categorize option. React state for accounts, transactions, budgets, transfers, selected account, modals, filters, form. Components: Header, AccountCard, TransactionTable, TransactionRow, SpendingCharts, TransferForm, BillsList, BillCard, TransactionModal, BudgetSection. Mock: 50+ transactions, multiple accounts, bills.",
  },
  {
    emoji: Target,
    title: "Build a habit tracker",
    prompt:
      "Habit tracker: header with logo, nav (habits/analytics/settings), streak display, profile. Dashboard showing today's habits list with checkboxes, daily completion percentage circular progress, current streak counter with fire emoji. Habit cards with name/icon, streak count, completion rate %, large check-in button, edit/delete. Calendar heatmap view showing entire year with color intensity (dark green fully complete, light green partial, gray incomplete). Motivating Unsplash lifestyle: https://images.unsplash.com/{photo_id}?auto=format&fit=crop&w=1200&q=80. Add habit modal with form (name, icon selector, frequency: daily/weekly/custom days, reminder time, category, goal). Analytics page with recharts: completion rate over time line, habit breakdown pie, best/worst performers, monthly stats. Habit detail view with individual history, best/current streak, completion %, calendar, notes. Motivational quotes, achievement badges (7-day, 30-day, perfect week), category color coding (Health, Productivity, Social, Learning). React state for habits, daily completions, selected date/habit, modal, calendar data, stats. Components: Header, HabitList, HabitCard, CalendarHeatmap, AddHabitModal, Analytics, CompletionChart, HabitDetail, StreakCounter, AchievementBadge, CategoryFilter. Mock: 10-15 habits, 3-6 months completion history.",
  },
  {
    emoji: Mic,
    title: "Build a podcast app",
    prompt:
      "Apple Podcasts: nav with logo, tabs (browse/library/search), queue icon, profile. Hero with featured/trending carousel, category nav (Technology, Business, True Crime, Comedy, News, Education), popular shows grid. Podcast cards with cover artwork (Unsplash podcast/studio: https://images.unsplash.com/{photo_id}?auto=format&fit=crop&w=800&q=80), title, author, subscriber count, rating, subscribe button. Podcast detail page with large cover, title, author with follow, description, rating, episode count, episodes list (thumbnail, title, duration, date, play button, download icon). Episode detail with large artwork, title, description with show notes, play/pause, progress bar, playback speed selector, share, chapter markers. Fixed bottom audio player with mini artwork, episode title/show name, playback controls (15s back, play/pause, 15s forward), progress bar with timestamps, queue button, volume slider. Queue sidebar with current playing and queued episodes, reorder drag-drop (native HTML5). Library page tabs: subscriptions, downloads, history, favorites. Search with filters (category, duration, rating). Personalized recommendations. React state for podcasts, episodes, subscriptions, queue, current episode, playback state, progress, speed, downloads, modals. Components: Navbar, Hero, CategoryNav, PodcastGrid, PodcastCard, PodcastDetail, EpisodeList, EpisodeCard, EpisodePlayer, MiniPlayer, QueueSidebar, Library, SearchPage, PlaybackControls. Mock: 30-40 podcasts, 200+ episodes.",
  },
];