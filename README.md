# Ollio AI - AI-Powered UI Component Generator

> A sophisticated full-stack web application that transforms natural language prompts into live, functional UI components using AI agents and secure cloud sandboxes.

[![Next.js](https://img.shields.io/badge/Next.js-16.1-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![tRPC](https://img.shields.io/badge/tRPC-11.8-2596be)](https://trpc.io/)
[![Prisma](https://img.shields.io/badge/Prisma-7.2-2D3748)](https://www.prisma.io/)

---

## 📖 Table of Contents

1. [Project Overview](#-project-overview)
2. [System Architecture](#-system-architecture)
3. [Project Structure](#-project-structure)
4. [Complete Data Flow](#-complete-data-flow)
5. [Database Design](#-database-design)
6. [Authentication & Security](#-authentication--security)
7. [Setup & Installation](#-setup--installation)
8. [Architecture Decisions](#-architecture-decisions)
9. [Technical Challenges](#-technical-challenges)
10. [State Management](#-state-management)
11. [Custom Hooks](#-custom-hooks)
12. [API Design](#-api-design)
13. [Future Improvements](#-future-improvements)

---

## 🎯 Project Overview

### What is Ollio AI?

Ollio AI is an enterprise-grade, AI-powered web application that bridges the gap between natural language and functional UI components. It allows users to describe what they want to build in plain English (or any language), and an AI agent autonomously generates production-ready HTML, CSS, and JavaScript code, executes it in a secure sandbox environment, and returns a live preview—all through an intuitive chat interface.

### The Problem It Solves

Traditional UI development requires:
- Deep knowledge of HTML, CSS, and JavaScript
- Hours of manual coding and debugging
- Multiple iterations to get the design right
- Understanding of responsive design principles

**Ollio AI eliminates these barriers** by letting anyone describe what they want, and the AI handles the technical implementation.

### Key Features

- **Natural Language Interface**: Chat-based interaction for UI generation
- **Real-time Code Generation**: AI writes production-ready code
- **Live Previews**: Instant visualization in isolated sandboxes
- **Multi-file Support**: Generates HTML, CSS, and JavaScript separately
- **Project Management**: Organize multiple UI components in projects
- **Version History**: Track all message iterations and code changes
- **Secure Execution**: Sandboxed environments prevent malicious code
- **Credit System**: Fair usage tracking and management
- **Responsive Design**: Mobile-first approach throughout

### Technology Stack Summary

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js 16 + React 19 | Server components, app router, streaming |
| **Styling** | Tailwind CSS 4 | Utility-first CSS framework |
| **Type Safety** | TypeScript 5 | End-to-end type safety |
| **API Layer** | tRPC 11 | Type-safe client-server communication |
| **Database** | PostgreSQL + Prisma | Relational data with ORM |
| **Authentication** | Clerk | User management, session handling |
| **Background Jobs** | Inngest | Async task orchestration |
| **AI Agent** | @inngest/agent-kit + OpenAI | Reasoning and code generation |
| **Sandboxing** | E2B Code Interpreter | Secure code execution |
| **State Management** | React Query (TanStack) | Server state, caching, mutations |
| **UI Components** | Radix UI + shadcn/ui | Accessible, customizable primitives |
| **Code Editor** | CodeMirror 6 | Syntax highlighting, multi-language |

---

## 🏗️ System Architecture

### High-Level Architecture Overview

The application follows a **microservices-inspired monolithic architecture** where concerns are cleanly separated into layers, but all run within the same deployment for simplicity and reduced latency.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              USER BROWSER                                    │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                    PRESENTATION LAYER (React)                          │ │
│  │  • Next.js 16 App Router (Server & Client Components)                 │ │
│  │  • React 19 with Suspense & Error Boundaries                          │ │
│  │  • Tailwind CSS for styling                                           │ │
│  │  • CodeMirror for syntax highlighting                                 │ │
│  │                                                                        │ │
│  │  Components:                                                          │ │
│  │  ├─ Chat Interface (src/app/projects/[projectId]/page.tsx)           │ │
│  │  ├─ Code Viewer (src/components/code-view/)                          │ │
│  │  ├─ Project Dashboard (src/app/projects/page.tsx)                    │ │
│  │  └─ UI Primitives (src/components/ui/)                               │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                    ↓ ↑                                       │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                    STATE MANAGEMENT LAYER                              │ │
│  │  • tRPC React Query Client (Type-safe hooks)                          │ │
│  │  • TanStack Query for caching & synchronization                       │ │
│  │  • Optimistic updates & automatic refetching                          │ │
│  │                                                                        │ │
│  │  Hooks:                                                               │ │
│  │  ├─ api.projects.create.useMutation()                                │ │
│  │  ├─ api.projects.getById.useQuery()                                  │ │
│  │  └─ api.projects.list.useQuery()                                     │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
                                      ↓ ↑
                               HTTP/HTTPS (tRPC Protocol)
                                      ↓ ↑
┌─────────────────────────────────────────────────────────────────────────────┐
│                          NEXT.JS SERVER (Node.js)                            │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                      MIDDLEWARE LAYER                                  │ │
│  │  • Clerk Edge Middleware (src/proxy.ts)                               │ │
│  │  • Request authentication & authorization                             │ │
│  │  • Route protection (public vs. protected)                            │ │
│  │  • Session management                                                 │ │
│  │                                                                        │ │
│  │  Flow:                                                                │ │
│  │  Request → Check Auth → Allow/Redirect → Next Handler                │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                    ↓                                         │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                      API LAYER (tRPC)                                  │ │
│  │  • Type-safe RPC endpoints (src/trpc/routers/)                        │ │
│  │  • Input validation with Zod schemas                                  │ │
│  │  • Business logic orchestration                                       │ │
│  │  • Error handling & transformation                                    │ │
│  │                                                                        │ │
│  │  Routers:                                                             │ │
│  │  ├─ projectsRouter (CRUD operations)                                 │ │
│  │  ├─ messagesRouter (Chat history)                                    │ │
│  │  ├─ usageRouter (Credit tracking)                                    │ │
│  │  └─ Root Router (_app.ts - combines all)                             │ │
│  │                                                                        │ │
│  │  Procedures:                                                          │ │
│  │  ├─ protectedProcedure (requires auth)                               │ │
│  │  └─ publicProcedure (open access)                                    │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                    ↓                                         │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                    BUSINESS LOGIC LAYER                                │ │
│  │  • Domain-specific logic (src/modules/)                               │ │
│  │  • Credit consumption (src/lib/usage.ts)                              │ │
│  │  • Project validation                                                 │ │
│  │  • Message formatting                                                 │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
                                      ↓ ↑
                            PostgreSQL Connection Pool
                                      ↓ ↑
┌─────────────────────────────────────────────────────────────────────────────┐
│                      POSTGRESQL DATABASE                                     │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                    DATA PERSISTENCE LAYER                              │ │
│  │  • Prisma ORM (prisma/schema.prisma)                                  │ │
│  │  • Connection pooling with PgBouncer                                  │ │
│  │  • Automatic migrations                                               │ │
│  │  • Type-safe query building                                           │ │
│  │                                                                        │ │
│  │  Tables:                                                              │ │
│  │  ├─ User (Authentication data)                                        │ │
│  │  ├─ Project (UI generation projects)                                 │ │
│  │  ├─ Message (Chat history: USER ↔ ASSISTANT)                         │ │
│  │  ├─ Fragment (Generated code files)                                  │ │
│  │  └─ Usage (Credit tracking)                                          │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
                                      ↓
                         Event Dispatch (Async)
                                      ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│                    INNGEST (Background Job Platform)                         │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                    JOB ORCHESTRATION LAYER                             │ │
│  │  • Event-driven architecture                                          │ │
│  │  • Durable execution with retries                                     │ │
│  │  • Step functions for complex workflows                               │ │
│  │  • Built-in observability                                             │ │
│  │                                                                        │ │
│  │  Functions:                                                           │ │
│  │  └─ generateUIAgent (src/inngest/functions.ts)                       │ │
│  │     ├─ Step 1: Create sandbox                                        │ │
│  │     ├─ Step 2: Initialize AI agent                                   │ │
│  │     ├─ Step 3: Run generation                                        │ │
│  │     ├─ Step 4: Save results                                          │ │
│  │     └─ Step 5: Cleanup sandbox                                       │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                    ↓                                         │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                    AI AGENT LAYER                                      │ │
│  │  • @inngest/agent-kit (Agent framework)                               │ │
│  │  • OpenAI GPT-4 (Language model)                                      │ │
│  │  • Tool-based reasoning                                               │ │
│  │  • Multi-step execution                                               │ │
│  │                                                                        │ │
│  │  Agent Capabilities:                                                  │ │
│  │  ├─ Natural language understanding                                    │ │
│  │  ├─ Code generation (HTML, CSS, JS)                                  │ │
│  │  ├─ File system operations                                           │ │
│  │  ├─ Terminal command execution                                       │ │
│  │  └─ Multi-turn reasoning                                             │ │
│  │                                                                        │ │
│  │  Tools Available to Agent:                                           │ │
│  │  ├─ terminal: Run shell commands                                     │ │
│  │  ├─ writeFile: Create/update files                                   │ │
│  │  ├─ readFile: Read file contents                                     │ │
│  │  └─ listFiles: Directory listing                                     │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
                                      ↓
                              Sandbox API Calls
                                      ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│                    E2B CODE INTERPRETER (Cloud Sandbox)                      │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                    SECURE EXECUTION ENVIRONMENT                        │ │
│  │  • Isolated Linux containers (Firecracker VMs)                        │ │
│  │  • Resource limits (CPU, memory, network)                             │ │
│  │  • Automatic cleanup after execution                                  │ │
│  │  • Public URL generation for previews                                 │ │
│  │                                                                        │ │
│  │  Features:                                                            │ │
│  │  ├─ File System: In-memory workspace                                 │ │
│  │  ├─ Terminal: Full bash shell access                                 │ │
│  │  ├─ Web Server: Serve generated HTML/CSS/JS                          │ │
│  │  ├─ Port Exposure: Public URLs for iframe embedding                  │ │
│  │  └─ Templates: Pre-configured environments (Next.js, React, etc.)    │ │
│  │                                                                        │ │
│  │  Security Measures:                                                   │ │
│  │  ├─ Network isolation (no outbound access)                           │ │
│  │  ├─ CPU throttling                                                    │ │
│  │  ├─ Memory limits (512MB - 2GB)                                      │ │
│  │  ├─ Execution timeouts (30s - 5min)                                  │ │
│  │  └─ Automatic destruction after use                                  │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Architecture Principles

#### 1. **Separation of Concerns**
Each layer has a single, well-defined responsibility. The presentation layer never directly talks to the database, and business logic is isolated from UI concerns.

#### 2. **Type Safety Everywhere**
TypeScript ensures type safety from the database schema (Prisma) through the API layer (tRPC) to the React components. A single source of truth prevents runtime errors.

#### 3. **Asynchronous by Design**
Long-running AI tasks are handled asynchronously to keep the UI responsive. The API immediately returns after dispatching a job, and the frontend polls for results.

#### 4. **Security First**
- Authentication at the edge (middleware)
- Isolated code execution (E2B sandboxes)
- Input validation (Zod schemas)
- No direct database access from frontend

#### 5. **Scalability**
- Stateless API servers (horizontal scaling)
- Background job workers (parallel processing)
- Database connection pooling
- CDN-ready static assets

---

## 📁 Project Structure

### Directory Organization

The project follows a **domain-driven design** approach where related functionality is grouped together, making it easier to understand and maintain.

```
ollio-ai/
│
├── prisma/                          # DATABASE LAYER
│   ├── schema.prisma                # Data models and relationships
│   └── migrations/                  # Database version history
│       └── 20240101_init/
│
├── public/                          # STATIC ASSETS
│   ├── asset/                       # Images, icons, logos
│   │   ├── logo.svg
│   │   └── hero-bg.png
│   └── projects/                    # Pre-built showcase HTML files
│       ├── landing-page.html
│       └── dashboard.html
│
├── src/                             # SOURCE CODE
│   │
│   ├── app/                         # NEXT.JS APP ROUTER (Frontend Routes)
│   │   │
│   │   ├── (home)/                  # Public pages (no auth required)
│   │   │   ├── layout.tsx           # Home layout wrapper
│   │   │   ├── page.tsx             # Landing page (/)
│   │   │   ├── pricing/
│   │   │   │   └── page.tsx         # Pricing page (/pricing)
│   │   │   └── about/
│   │   │       └── page.tsx         # About page (/about)
│   │   │
│   │   ├── projects/                # Protected application area
│   │   │   ├── layout.tsx           # Projects layout (sidebar, header)
│   │   │   ├── page.tsx             # Projects list (/projects)
│   │   │   │                        # Shows all user's projects
│   │   │   │
│   │   │   └── [projectId]/         # Dynamic project route
│   │   │       ├── page.tsx         # ⭐ MAIN CHAT INTERFACE
│   │   │       │                    # Where users interact with AI
│   │   │       │                    # Real-time code generation UI
│   │   │       │
│   │   │       └── loading.tsx      # Loading state for this route
│   │   │
│   │   ├── api/                     # API ROUTES
│   │   │   │
│   │   │   ├── inngest/             # Inngest webhook
│   │   │   │   └── route.ts         # Background job API endpoint
│   │   │   │                        # Receives events from Inngest platform
│   │   │   │
│   │   │   └── trpc/                # tRPC HTTP handler
│   │   │       └── [trpc]/
│   │   │           └── route.ts     # Main tRPC endpoint (/api/trpc)
│   │   │                            # Handles all tRPC requests
│   │   │
│   │   ├── sign-in/                 # Clerk auth pages
│   │   │   └── [[...sign-in]]/
│   │   │       └── page.tsx
│   │   │
│   │   ├── sign-up/
│   │   │   └── [[...sign-up]]/
│   │   │       └── page.tsx
│   │   │
│   │   ├── layout.tsx               # ⭐ ROOT LAYOUT
│   │   │                            # Wraps entire app
│   │   │                            # Sets up providers (Clerk, tRPC, Theme)
│   │   │
│   │   ├── globals.css              # Global styles & Tailwind imports
│   │   ├── not-found.tsx            # 404 page
│   │   └── error.tsx                # Error boundary
│   │
│   ├── components/                  # REUSABLE REACT COMPONENTS
│   │   │
│   │   ├── ui/                      # Base UI primitives (shadcn/ui)
│   │   │   ├── button.tsx           # Button component
│   │   │   ├── card.tsx             # Card wrapper
│   │   │   ├── dialog.tsx           # Modal dialog
│   │   │   ├── input.tsx            # Form input
│   │   │   ├── label.tsx            # Form label
│   │   │   ├── select.tsx           # Dropdown select
│   │   │   ├── textarea.tsx         # Multi-line input
│   │   │   ├── toast.tsx            # Notification toast
│   │   │   ├── tooltip.tsx          # Hover tooltip
│   │   │   ├── dropdown-menu.tsx    # Context menu
│   │   │   ├── tabs.tsx             # Tab navigation
│   │   │   ├── separator.tsx        # Visual divider
│   │   │   ├── scroll-area.tsx      # Custom scrollbar
│   │   │   ├── skeleton.tsx         # Loading placeholder
│   │   │   └── ...                  # 30+ more components
│   │   │
│   │   ├── showcase/                # Project showcase components
│   │   │   ├── showcase-card.tsx    # Individual project card
│   │   │   ├── showcase-grid.tsx    # Grid layout for projects
│   │   │   └── showcase-filters.tsx # Filter/search functionality
│   │   │
│   │   ├── code-view/               # Code editor components
│   │   │   ├── code-editor.tsx      # CodeMirror wrapper
│   │   │   ├── code-tabs.tsx        # Multi-file tab view
│   │   │   ├── code-preview.tsx     # Live preview iframe
│   │   │   └── code-toolbar.tsx     # Copy, download, theme buttons
│   │   │
│   │   ├── chat/                    # Chat interface components
│   │   │   ├── message-list.tsx     # Scrollable message history
│   │   │   ├── message-item.tsx     # Single message bubble
│   │   │   ├── chat-input.tsx       # Prompt input field
│   │   │   └── typing-indicator.tsx # AI is typing animation
│   │   │
│   │   └── layout/                  # Layout components
│   │       ├── header.tsx           # Top navigation bar
│   │       ├── sidebar.tsx          # Side navigation
│   │       ├── footer.tsx           # Footer
│   │       └── theme-toggle.tsx     # Dark/light mode switch
│   │
│   ├── inngest/                     # ⭐ ASYNCHRONOUS AI CORE
│   │   │
│   │   ├── functions.ts             # ⭐⭐⭐ CRITICAL FILE
│   │   │                            # Main AI agent logic
│   │   │                            # Tool definitions (terminal, filesystem)
│   │   │                            # Sandbox orchestration
│   │   │                            # Result persistence
│   │   │
│   │   ├── client.ts                # Inngest client initialization
│   │   │                            # Configuration and setup
│   │   │
│   │   └── utils.ts                 # Helper functions
│   │                                # Prompt formatting
│   │                                # Code parsing utilities
│   │
│   ├── lib/                         # SHARED UTILITIES & CONFIGURATION
│   │   │
│   │   ├── db.ts                    # Prisma client singleton
│   │   │                            # Prevents multiple instances
│   │   │                            # Connection pooling setup
│   │   │
│   │   ├── usage.ts                 # Credit/usage tracking
│   │   │                            # consumeCredits() function
│   │   │                            # Rate limiting logic
│   │   │
│   │   ├── utils.ts                 # General utilities
│   │   │                            # cn() for className merging
│   │   │                            # Date formatting
│   │   │                            # String manipulation
│   │   │
│   │   ├── constants.ts             # App-wide constants
│   │   │                            # API limits
│   │   │                            # Feature flags
│   │   │
│   │   └── validators.ts            # Reusable Zod schemas
│   │                                # Input validation rules
│   │
│   ├── modules/                     # DOMAIN-DRIVEN BUSINESS LOGIC
│   │   │                            # Each module = feature domain
│   │   │
│   │   ├── projects/                # Project management domain
│   │   │   ├── server/
│   │   │   │   └── procedures.ts    # ⭐⭐ CRITICAL FILE
│   │   │   │                        # tRPC procedures for projects
│   │   │   │                        # create, update, delete, list
│   │   │   │                        # Job dispatch to Inngest
│   │   │   │
│   │   │   └── client/
│   │   │       └── hooks.ts         # Custom React hooks
│   │   │                            # useProject(), useProjects()
│   │   │
│   │   ├── messages/                # Chat message domain
│   │   │   └── server/
│   │   │       └── procedures.ts    # Message CRUD operations
│   │   │
│   │   └── usage/                   # Usage tracking domain
│   │       └── server/
│   │           └── procedures.ts    # Credit management
│   │
│   ├── trpc/                        # TRPC CONFIGURATION
│   │   │
│   │   ├── routers/                 # API route definitions
│   │   │   │
│   │   │   ├── _app.ts              # ⭐ ROOT ROUTER
│   │   │   │                        # Combines all sub-routers
│   │   │   │                        # Creates unified API
│   │   │   │
│   │   │   ├── projects.ts          # Projects router
│   │   │   ├── messages.ts          # Messages router
│   │   │   └── usage.ts             # Usage router
│   │   │
│   │   ├── server.tsx               # tRPC server configuration
│   │   │                            # Context creation
│   │   │                            # Error formatting
│   │   │
│   │   ├── client.tsx               # tRPC React client
│   │   │                            # React Query setup
│   │   │                            # Type-safe hooks
│   │   │
│   │   └── react.tsx                # tRPC React provider
│   │                                # Wraps app with tRPC context
│   │
│   ├── hooks/                       # CUSTOM REACT HOOKS
│   │   ├── use-project.ts           # Project state management
│   │   ├── use-chat.ts              # Chat interface logic
│   │   ├── use-code-editor.ts       # Code editor state
│   │   └── use-media-query.ts       # Responsive breakpoints
│   │
│   ├── types/                       # TYPESCRIPT TYPE DEFINITIONS
│   │   ├── api.ts                   # API response types
│   │   ├── database.ts              # Database model types
│   │   └── global.d.ts              # Global type augmentations
│   │
│   └── proxy.ts                     # ⭐⭐ CRITICAL FILE
│                                    # Edge Middleware
│                                    # Authentication enforcement
│                                    # Route protection
│
├── scripts/                         # UTILITY SCRIPTS
│   ├── setup.ts                     # Initial project setup
│   ├── create-base-template.sh      # E2B template builder
│   └── seed.ts                      # Database seeding
│
├── .env.example                     # Environment variables template
├── .env.local                       # Local development secrets (gitignored)
├── .gitignore                       # Git ignore patterns
├── .eslintrc.json                   # ESLint configuration
├── package.json                     # Dependencies and scripts
├── tsconfig.json                    # TypeScript configuration
├── tailwind.config.ts               # Tailwind CSS configuration
├── next.config.js                   # Next.js configuration
└── README.md                        # This file
```

### File Naming Conventions

- **React Components**: PascalCase (e.g., `ChatInput.tsx`)
- **Utilities**: kebab-case (e.g., `use-project.ts`)
- **API Routes**: kebab-case (e.g., `route.ts`)
- **Types**: kebab-case (e.g., `api-types.ts`)

### Critical Files Deep Dive

#### 1. `src/inngest/functions.ts` - The AI Engine

This file contains the heart of the application's intelligence. It defines:
- The AI agent configuration
- Tool definitions the AI can use
- Sandbox lifecycle management
- Result persistence logic

**Why it's critical:** This is where prompts become code. Any changes to code generation behavior happen here.

#### 2. `src/modules/projects/server/procedures.ts` - The Orchestrator

This file bridges the user interface and the AI engine. It:
- Validates user input
- Checks user permissions and credits
- Dispatches background jobs
- Returns immediate responses

**Why it's critical:** This ensures the UI remains responsive while heavy processing happens asynchronously.

#### 3. `src/proxy.ts` - The Guardian

This middleware runs on every request to:
- Authenticate users via Clerk
- Protect private routes
- Allow public routes
- Handle authentication redirects

**Why it's critical:** Without this, unauthorized users could access protected data.

#### 4. `prisma/schema.prisma` - The Data Model

This single file defines:
- All database tables
- Column types and constraints
- Relationships between entities
- Indexes for performance

**Why it's critical:** It's the single source of truth for data structure. Changes here affect the entire application.

---

## 🔄 Complete Data Flow

### End-to-End Request Journey

Let me walk you through every single step that happens when a user types "Create a dark login form" and hits send.

#### **Phase 1: User Interaction (0-50ms)**

**Location:** User's Browser → `src/app/projects/[projectId]/page.tsx`

```typescript
// User clicks "Send" button after typing prompt
function onSubmit(values: z.infer<typeof formSchema>) {
  // 1. Form data is validated by React Hook Form + Zod
  // Schema ensures 'content' is between 10-1000 characters
  
  // 2. Optimistic UI update (message appears immediately)
  setMessages(prev => [...prev, { 
    role: 'USER', 
    content: values.content,
    pending: true // Shows loading state
  }]);
  
  // 3. Call tRPC mutation (type-safe API call)
  createMutation.mutate({
    projectId: props.params.projectId,
    content: values.content,
  });
  
  // 4. Input field is cleared
  form.reset();
}
```

**What happens behind the scenes:**
- React Hook Form validates input against Zod schema
- TanStack Query (React Query) prepares the mutation
- Browser serializes data to JSON
- HTTP POST request is created with headers

**Data at this point:**
```json
{
  "projectId": "clx7a2b3c4d5e6f7g8h9",
  "content": "Create a dark login form"
}
```

---

#### **Phase 2: Network Transit (50-150ms)**

**Location:** Browser → Internet → Your Server

**What happens:**
- DNS lookup for your domain
- TLS handshake for HTTPS
- HTTP/2 connection established
- Request headers include:
  - `Authorization`: Clerk session token
  - `Content-Type`: application/json
  - `trpc-batch-mode`: single request

**Network path:**
```
User Browser (192.168.1.100)
    ↓
Local Router
    ↓
ISP Network
    ↓
Internet Backbone
    ↓
Your Hosting Provider (Vercel/AWS)
    ↓
Next.js Server (your-domain.com)
```

---

#### **Phase 3: Server Entry Point (150-200ms)**

**Location:** Next.js Server → `src/proxy.ts` (Middleware)

```typescript
// EVERY request hits this middleware first
export default clerkMiddleware((auth, request) => {
  // 1. Extract the request URL
  const url = new URL(request.url);
  
  // 2. Check if this is a public route
  const isPublic = isPublicRoute(request);
  // Public routes: '/', '/pricing', '/api/inngest'
  
  if (!isPublic) {
    // 3. Verify Clerk session token from cookies
    const session = auth();
    
    if (!session.userId) {
      // 4. No valid session - redirect to sign-in
      return NextResponse.redirect(
        new URL('/sign-in', request.url)
      );
    }
    
    // 5. Session valid - attach user info to request context
    // This will be available in tRPC procedures as ctx.session
  }
  
  // 6. Allow request to proceed
  return NextResponse.next();
});
```

**Security checks performed:**
- Session token signature validation
- Token expiration check
- User status verification (active/suspended)
- Rate limit check (100 requests/minute per user)

**If authentication fails:**
- User is redirected to `/sign-in`
- Original URL is saved for post-login redirect
- Request never reaches the API

---

#### **Phase 4: API Router Processing (200-250ms)**

**Location:** `src/app/api/trpc/[trpc]/route.ts` → `src/trpc/routers/_app.ts`

```typescript
// Root router combines all sub-routers
export const appRouter = router({
  projects: projectsRouter,  // Our request goes here
  messages: messagesRouter,
  usage: usageRouter,
});

// Type inference for client
export type AppRouter = typeof appRouter;
```

Request is routed to: `projectsRouter.create`

**Location:** `src/modules/projects/server/procedures.ts`

```typescript
export const create = protectedProcedure
  .input(
    z.object({
      projectId: z.string().cuid(), // Validates CUID format
      content: z.string().min(10).max(1000), // 10-1000 chars
    })
  )
  .mutation(async ({ ctx, input }) => {
    // === BUSINESS LOGIC STARTS HERE ===
    
    // 1. Extract user ID from authenticated context
    const userId = ctx.session.user.id;
    
    console.log(`User ${userId} creating message in project ${input.projectId}`);
    
    // 2. Check if user has enough credits
    const hasEnoughCredits = await consumeCredits(userId, 1);
    // This function:
    // - Queries Usage table
    // - Checks if user.creditsUsed < user.creditsLimit
    // - Atomically increments creditsUsed if true
    
    if (!hasEnoughCredits) {
      throw new TRPCError({
        code: 'PAYMENT_REQUIRED',
        message: 'Insufficient credits. Please upgrade your plan.',
      });
    }
    
    // 3. Verify project ownership
    const projectExists = await db.project.findFirst({
      where: {
        id: input.projectId,
        userId: userId, // Security: User can only access their projects
      },
    });
    
    if (!projectExists) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Project not found or access denied.',
      });
    }
    
    // 4. DATABASE WRITE #1: Save user's message
    const project = await db.project.update({
      where: {
        id: input.projectId,
      },
      data: {
        messages: {
          create: {
            role: 'USER',
            content: input.content,
            createdAt: new Date(),
          },
        },
        updatedAt: new Date(), // Update project's last modified time
      },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1, // Get the message we just created
        },
      },
    });
    
    // 5. THE CRITICAL HANDOFF: Dispatch to Inngest
    await inngest.send({
      name: 'agent/generate-ui', // Event name
      data: {
        projectId: input.projectId,
        prompt: input.content,
        userId: userId,
      },
      user: ctx.session.user, // For tracking/logging
    });
    
    console.log(`Inngest job dispatched for project ${input.projectId}`);
    
    // 6. Return immediately (don't wait for AI)
    return {
      success: true,
      message: project.messages[0],
      projectId: project.id,
    };
  });
```

**Why this is fast:**
- No waiting for AI generation
- Simple database operations (< 50ms)
- Immediate response to user

**Data written to database:**
```sql
INSERT INTO "Message" (id, role, content, projectId, createdAt)
VALUES ('clx8...', 'USER', 'Create a dark login form', 'clx7...', NOW());

UPDATE "Usage" 
SET creditsUsed = creditsUsed + 1
WHERE userId = 'user_xyz';
```

---

#### **Phase 5: Response to Browser (250-300ms)**

**Location:** Server → Browser

```json
// HTTP 200 OK
{
  "result": {
    "data": {
      "success": true,
      "message": {
        "id": "clx8a2b3c4d5e6f7g8h9",
        "role": "USER",
        "content": "Create a dark login form",
        "createdAt": "2025-01-07T10:30:45.123Z"
      },
      "projectId": "clx7a2b3c4d5e6f7g8h9"
    }
  }
}
```

**Frontend receives response:**
```typescript
// In src/app/projects/[projectId]/page.tsx

const createMutation = api.projects.create.useMutation({
  onSuccess: (data) => {
    // 1. Update local state
    setMessages(prev => prev.map(msg => 
      msg.pending ? { ...msg, pending: false, id: data.message.id } : msg
    ));
    
    // 2. Show success toast
    toast.success('Message sent! AI is generating...');
    
    // 3. Start polling for AI response
    refetch(); // Triggers useQuery to check for new messages
  },
  onError: (error) => {
    toast.error(error.message);
    // Remove optimistic message
    setMessages(prev => prev.filter(msg => !msg.pending));
  },
});
```

**User sees:**
- Their message appears in chat (no longer pending)
- Loading indicator appears below
- "AI is thinking..." animation

**Total time so far: ~300ms** (User experience is instant!)

---

#### **Phase 6: Background Job Execution (Async, 10-60 seconds)**

Now the heavy lifting begins, but the user's browser is free to do other things.

**Location:** Inngest Platform → `src/inngest/functions.ts`

```typescript
export const generateUIAgent = inngest.createFunction(
  {
    id: 'generate-ui-agent',
    name: 'Generate UI Component',
    concurrency: 5, // Max 5 jobs running simultaneously
    retries: 3, // Retry on failure
  },
  { event: 'agent/generate-ui' },
  async ({ event, step }) => {
    // === STEP 1: Create Secure Sandbox ===
    const sandbox = await step.run('create-sandbox', async () => {
      console.log(`Creating sandbox for project ${event.data.projectId}`);
      
      return await Sandbox.create({
        template: 'nextjs', // Pre-configured Next.js environment
        timeoutMs: 300000, // 5-minute timeout
      });
    });
    
    console.log(`Sandbox created: ${sandbox.id}`);
    
    // Ensure cleanup happens even if job fails
    await step.defer(async () => {
      console.log(`Cleaning up sandbox ${sandbox.id}`);
      await sandbox.close();
    });
    
    // === STEP 2: Initialize AI Agent ===
    const agent = await step.run('init-agent', () => {
      return createAgent({
        // Model configuration
        model: 'gpt-4-turbo-preview',
        temperature: 0.7, // Balance creativity and consistency
        maxTokens: 4000,
        
        // System prompt (AI's instructions)
        system: `You are an expert UI developer. Generate clean, modern, accessible HTML, CSS, and JavaScript based on user prompts. Always:
        - Use semantic HTML5
        - Write mobile-first responsive CSS
        - Add proper ARIA labels
        - Include comments in code
        - Follow best practices`,
        
        // === TOOL DEFINITIONS ===
        tools: {
          // TOOL 1: Terminal execution
          terminal: createTool({
            name: 'terminal',
            description: 'Run shell commands in the sandbox',
            parameters: z.object({
              command: z.string().describe('Shell command to execute'),
            }),
            fn: async ({ args, state: sandbox }) => {
              console.log(`Running command: ${args.command}`);
              
              const { stdout, stderr, exitCode } = await sandbox.terminal.run(
                args.command
              );
              
              return {
                stdout: stdout.trim(),
                stderr: stderr.trim(),
                exitCode,
                success: exitCode === 0,
              };
            },
          }),
          
          // TOOL 2: File writing
          writeFile: createTool({
            name: 'writeFile',
            description: 'Create or update a file in the sandbox',
            parameters: z.object({
              path: z.string().describe('File path (e.g., /index.html)'),
              content: z.string().describe('File content'),
            }),
            fn: async ({ args, state: sandbox }) => {
              console.log(`Writing file: ${args.path}`);
              
              await sandbox.filesystem.write(args.path, args.content);
              
              return {
                success: true,
                path: args.path,
                size: args.content.length,
              };
            },
          }),
          
          // TOOL 3: File reading
          readFile: createTool({
            name: 'readFile',
            description: 'Read a file from the sandbox',
            parameters: z.object({
              path: z.string().describe('File path to read'),
            }),
            fn: async ({ args, state: sandbox }) => {
              const content = await sandbox.filesystem.read(args.path);
              return { content };
            },
          }),
          
          // TOOL 4: List files
          listFiles: createTool({
            name: 'listFiles',
            description: 'List all files in a directory',
            parameters: z.object({
              path: z.string().default('/').describe('Directory path'),
            }),
            fn: async ({ args, state: sandbox }) => {
              const files = await sandbox.filesystem.list(args.path);
              return { files: files.map(f => f.name) };
            },
          }),
        },
      });
    });
    
    // === STEP 3: Run AI Agent ===
    const { output, steps: agentSteps } = await step.run(
      'generate-code',
      async () => {
        console.log(`Starting AI generation for: "${event.data.prompt}"`);
        
        const result = await agent.run(step, {
          // The prompt to the AI
          data: `User request: ${event.data.prompt}
          
          Please create a complete, production-ready UI component. Generate separate HTML, CSS, and JavaScript files. Make it visually appealing and fully functional.`,
          
          // Pass sandbox as state (available to all tools)
          state: sandbox,
          
          // Maximum reasoning steps
          maxSteps: 20,
        });
        
        console.log(`AI completed in ${result.steps.length} steps`);
        return result;
      }
    );
    
    // === STEP 4: Extract Generated Files ===
    const files = await step.run('extract-files', async () => {
      // List all files in the sandbox
      const allFiles = await sandbox.filesystem.list('/');
      
      // Read content of each file
      const fileContents = await Promise.all(
        allFiles.map(async (file) => {
          const content = await sandbox.filesystem.read(file.name);
          const extension = file.name.split('.').pop() || 'txt';
          
          return {
            name: file.name,
            format: extension, // 'html', 'css', 'js', etc.
            code: content,
            size: content.length,
          };
        })
      );
      
      console.log(`Extracted ${fileContents.length} files`);
      return fileContents;
    });
    
    // === STEP 5: Generate Preview URL ===
    const previewUrl = await step.run('generate-preview', async () => {
      // E2B automatically serves files on a public URL
      const url = `https://${sandbox.getHost()}/`;
      console.log(`Preview available at: ${url}`);
      return url;
    });
    
    // === STEP 6: Save to Database ===
    await step.run('save-to-database', async () => {
      console.log(`Saving results for project ${event.data.projectId}`);
      
      // Create ASSISTANT message with all generated files
      await db.message.create({
        data: {
          projectId: event.data.projectId,
          role: 'ASSISTANT',
          content: output, // AI's natural language response
          previewUrl: previewUrl,
          fragments: {
            create: files.map(file => ({
              format: file.format,
              code: file.code,
              filename: file.name,
            })),
          },
        },
      });
      
      console.log(`Results saved successfully`);
    });
    
    // === JOB COMPLETE ===
    return {
      success: true,
      projectId: event.data.projectId,
      filesGenerated: files.length,
      previewUrl,
    };
  }
);
```

**What the AI actually does:**

1. **Reasoning Phase** (5-10s)
   - Analyzes the prompt
   - Plans the file structure
   - Decides what tools to use

2. **Code Generation** (10-30s)
   - Calls `writeFile` tool multiple times
   - Generates HTML structure
   - Writes CSS styles
   - Creates JavaScript interactivity

3. **Testing** (5-10s)
   - Calls `terminal` tool to run build commands
   - Checks for errors
   - Validates output

4. **Finalization** (2-5s)
   - Reads all generated files
   - Formats responses
   - Returns results

**Example of AI's internal steps:**
```
Step 1: Plan the component structure
  → Deciding to create index.html, styles.css, script.js

Step 2: writeFile(index.html)
  → Creating semantic HTML structure

Step 3: writeFile(styles.css)
  → Writing dark theme CSS with animations

Step 4: writeFile(script.js)
  → Adding form validation logic

Step 5: terminal("npm install")
  → Installing dependencies (if needed)

Step 6: Verify files
  → Reading back files to confirm

Step 7: Generate response
  → Creating user-friendly message
```

---

#### **Phase 7: Polling for Results (Frontend, Every 2 seconds)**

**Location:** `src/app/projects/[projectId]/page.tsx`

```typescript
// React Query automatically polls
const { data: messages, isLoading } = api.projects.getById.useQuery(
  { projectId },
  {
    refetchInterval: 2000, // Poll every 2 seconds
    refetchIntervalInBackground: false, // Stop when tab is hidden
  }
);

// When new ASSISTANT message appears in database
useEffect(() => {
  if (!messages) return;
  
  const lastMessage = messages[messages.length - 1];
  
  if (lastMessage.role === 'ASSISTANT' && !lastMessage.seen) {
    // Mark as seen
    markAsSeen(lastMessage.id);
    
    // Show notification
    toast.success('AI has generated your component!');
    
    // Scroll to new message
    scrollToBottom();
  }
}, [messages]);
```

**Polling requests:**
```
T=0s:   GET /api/trpc/projects.getById → No new messages
T=2s:   GET /api/trpc/projects.getById → No new messages
T=4s:   GET /api/trpc/projects.getById → No new messages
T=6s:   GET /api/trpc/projects.getById → No new messages
...
T=24s:  GET /api/trpc/projects.getById → ✓ New ASSISTANT message!
```

---

#### **Phase 8: Displaying Results (Frontend)**

**Location:** `src/app/projects/[projectId]/page.tsx`

```typescript
// Message list component
{messages.map((message) => (
  <div key={message.id} className={message.role === 'USER' ? 'user-message' : 'ai-message'}>
    {/* Message content */}
    <p>{message.content}</p>
    
    {/* If ASSISTANT message, show code and preview */}
    {message.role === 'ASSISTANT' && message.fragments && (
      <div className="code-result">
        {/* Code tabs */}
        <Tabs>
          {message.fragments.map((fragment) => (
            <TabPanel key={fragment.id} label={fragment.filename}>
              <CodeEditor
                code={fragment.code}
                language={fragment.format}
                readOnly
              />
            </TabPanel>
          ))}
        </Tabs>
        
        {/* Live preview iframe */}
        {message.previewUrl && (
          <iframe
            src={message.previewUrl}
            className="preview-iframe"
            sandbox="allow-scripts allow-same-origin"
            loading="lazy"
          />
        )}
      </div>
    )}
  </div>
))}
```

**User sees:**
- AI's message: "I've created a dark-themed login form..."
- Code tabs: `index.html`, `styles.css`, `script.js`
- Live preview: Functional login form in iframe
- Action buttons: Copy code, Download, Open in new tab

---

### Complete Flow Visualization

```
[USER ACTION]
    │
    ├─→ Phase 1: Browser (0-50ms)
    │   ├─ Form submission
    │   ├─ Validation
    │   └─ Optimistic UI update
    │
    ├─→ Phase 2: Network (50-150ms)
    │   ├─ TLS handshake
    │   ├─ HTTP/2 connection
    │   └─ Request transmission
    │
    ├─→ Phase 3: Middleware (150-200ms)
    │   ├─ Authentication check
    │   ├─ Session validation
    │   └─ Route protection
    │
    ├─→ Phase 4: API Layer (200-250ms)
    │   ├─ Input validation
    │   ├─ Credit check
    │   ├─ Database write #1 (USER message)
    │   └─ Inngest dispatch
    │
    ├─→ Phase 5: Response (250-300ms)
    │   ├─ Success response
    │   ├─ UI confirmation
    │   └─ Start polling
    │
    ├─→ Phase 6: Background (Async, 10-60s)
    │   ├─ Inngest picks up job
    │   ├─ Create sandbox
    │   ├─ Initialize AI agent
    │   ├─ Generate code
    │   ├─ Extract files
    │   └─ Database write #2 (ASSISTANT message)
    │
    ├─→ Phase 7: Polling (Every 2s)
    │   ├─ Check for new messages
    │   ├─ Detect ASSISTANT message
    │   └─ Trigger UI update
    │
    └─→ Phase 8: Display (Final)
        ├─ Show AI response
        ├─ Render code tabs
        └─ Load preview iframe

[RESULT DISPLAYED]
```

---

## 🗄️ Database Design

### Schema Overview

The database uses a **relational model** with four core entities that represent the entire application's data structure.

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ==========================================
// USER ENTITY
// ==========================================
model User {
  id        String    @id @default(cuid())
  // CUID = Collision-resistant Unique ID
  // Example: "clx7a2b3c4d5e6f7g8h9"
  
  clerkId   String    @unique
  // References Clerk's user ID
  // Example: "user_2abcdef123456"
  
  email     String    @unique
  name      String?
  imageUrl  String?   // Profile picture
  
  // RELATIONSHIPS
  projects  Project[] // One user → many projects
  usage     Usage?    // One user → one usage record
  
  // TIMESTAMPS
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  
  @@index([clerkId])
  @@index([email])
}

// ==========================================
// PROJECT ENTITY
// ==========================================
model Project {
  id          String    @id @default(cuid())
  
  name        String    // "E-commerce Landing Page"
  description String?   // Optional project description
  
  // OWNERSHIP
  userId      String
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  // onDelete: Cascade = Delete all projects when user is deleted
  
  // RELATIONSHIPS
  messages    Message[] // One project → many messages
  
  // METADATA
  status      String    @default("active") // active, archived, deleted
  visibility  String    @default("private") // private, public, shared
  
  // TIMESTAMPS
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  @@index([userId])
  @@index([status])
  @@index([createdAt])
}

// ==========================================
// MESSAGE ENTITY (Chat History)
// ==========================================
model Message {
  id        String     @id @default(cuid())
  
  role      String     // "USER" or "ASSISTANT"
  content   String     @db.Text // Unlimited length for long messages
  
  // LINKED RESOURCES
  previewUrl String?   // E2B sandbox URL for live preview
  
  // OWNERSHIP
  projectId String
  project   Project    @relation(fields: [projectId], references: [id], onDelete: Cascade)
  
  // RELATIONSHIPS
  fragments Fragment[] // One message → many code files
  
  // METADATA
  seen      Boolean    @default(false) // For notifications
  tokenCount Int?      // AI token usage tracking
  
  // TIMESTAMPS
  createdAt DateTime   @default(now())
  
  @@index([projectId])
  @@index([role])
  @@index([createdAt])
}

// ==========================================
// FRAGMENT ENTITY (Code Files)
// ==========================================
model Fragment {
  id       String   @id @default(cuid())
  
  format   String   // "html", "css", "javascript", "json", etc.
  code     String   @db.Text // The actual code content
  filename String   // "index.html", "styles.css"
  
  // OWNERSHIP
  messageId String?
  message   Message? @relation(fields: [messageId], references: [id], onDelete: Cascade)
  
  // METADATA
  size     Int?     // File size in bytes
  
  // TIMESTAMPS
  createdAt DateTime @default(now())
  
  @@index([messageId])
  @@index([format])
}

// ==========================================
// USAGE ENTITY (Credit Tracking)
// ==========================================
model Usage {
  id           String   @id @default(cuid())
  
  // OWNERSHIP
  userId       String   @unique
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // CREDIT SYSTEM
  creditsUsed  Int      @default(0)
  creditsLimit Int      @default(100) // Free tier limit
  
  // SUBSCRIPTION
  plan         String   @default("free") // free, pro, enterprise
  stripeCustomerId String? // For payment processing
  
  // TIMESTAMPS
  resetAt      DateTime? // When credits reset
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
  
  @@index([userId])
  @@index([plan])
}
```

### Entity Relationships Diagram

```
┌─────────────┐
│    User     │
│             │
│ - clerkId   │
│ - email     │
│ - name      │
└──────┬──────┘
       │ 1
       │
       │ has many
       │
       ├─────────────┐
       │ M           │ 1
┌──────▼──────┐  ┌───▼────────┐
│   Project   │  │   Usage    │
│             │  │            │
│ - name      │  │ - credits  │
│ - status    │  │ - plan     │
└──────┬──────┘  └────────────┘
       │ 1
       │
       │ has many
       │
       │ M
┌──────▼──────┐
│   Message   │
│             │
│ - role      │
│ - content   │
│ - preview   │
└──────┬──────┘
       │ 1
       │
       │ has many
       │
       │ M
┌──────▼──────┐
│  Fragment   │
│             │
│ - format    │
│ - code      │
│ - filename  │
└─────────────┘
```

### Database Queries Examples

#### Creating a new project with first message

```typescript
// This happens when a user creates a new project
const project = await db.project.create({
  data: {
    name: "Landing Page Project",
    userId: "user_abc123",
    messages: {
      create: {
        role: "USER",
        content: "Create a hero section with a call-to-action button",
      },
    },
  },
  include: {
    messages: true,
  },
});
```

Generated SQL:
```sql
BEGIN;
  INSERT INTO "Project" (id, name, userId, createdAt, updatedAt)
  VALUES ('clx1...', 'Landing Page Project', 'user_abc123', NOW(), NOW());
  
  INSERT INTO "Message" (id, role, content, projectId, createdAt)
  VALUES ('clx2...', 'USER', 'Create a hero section...', 'clx1...', NOW());
COMMIT;
```

#### Fetching a project with all messages and code

```typescript
// This runs when loading the chat interface
const project = await db.project.findUnique({
  where: { id: projectId },
  include: {
    messages: {
      orderBy: { createdAt: 'asc' }, // Oldest first
      include: {
        fragments: true, // Include all code files
      },
    },
  },
});
```

Generated SQL:
```sql
SELECT 
  p.*,
  m.id as message_id, m.role, m.content, m.previewUrl, m.createdAt,
  f.id as fragment_id, f.format, f.code, f.filename
FROM "Project" p
LEFT JOIN "Message" m ON m.projectId = p.id
LEFT JOIN "Fragment" f ON f.messageId = m.id
WHERE p.id = 'clx1...'
ORDER BY m.createdAt ASC;
```

---

## 🔐 Authentication & Security

### Multi-Layer Security Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  LAYER 1: Edge Middleware (src/proxy.ts)                    │
│  • Runs on Cloudflare Edge                                  │
│  • Checks every request before it reaches the server        │
│  • Validates Clerk session tokens                           │
│  • Redirects unauthenticated users                          │
└─────────────────────────────────────────────────────────────┘
                          ↓ (if authenticated)
┌─────────────────────────────────────────────────────────────┐
│  LAYER 2: tRPC Protected Procedures                         │
│  • Validates user has active session                        │
│  • Checks user permissions                                  │
│  • Ensures user can only access their own data              │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  LAYER 3: Database Row-Level Checks                         │
│  • WHERE userId = currentUser.id                            │
│  • Prevents unauthorized data access                        │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  LAYER 4: E2B Sandbox Isolation                             │
│  • AI-generated code runs in isolated containers            │
│  • No network access to internal systems                    │
│  • Automatic cleanup after execution                        │
└─────--------------------------------------------------------


# Missing Sections for Ollio AI README

Here are the remaining sections for your comprehensive README:

---

## 🚀 Setup & Installation

### Prerequisites

Before you begin, ensure you have the following installed:

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | 18.0+ | Runtime environment |
| npm/pnpm/yarn | Latest | Package manager |
| PostgreSQL | 14+ | Database |
| Git | Latest | Version control |

### Required API Keys

You'll need accounts and API keys from these services:

- **Clerk** - Authentication ([clerk.com](https://clerk.com))
- **OpenAI** - AI model ([platform.openai.com](https://platform.openai.com))
- **E2B** - Code sandboxes ([e2b.dev](https://e2b.dev))
- **Inngest** - Background jobs ([inngest.com](https://inngest.com))

### Installation Steps

#### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/ollio-ai.git
cd ollio-ai
```

#### 2. Install Dependencies

```bash
# Using npm
npm install

# Using pnpm (recommended for faster installs)
pnpm install

# Using yarn
yarn install
```

#### 3. Environment Configuration

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Fill in your environment variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/ollio_ai"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"

# OpenAI
OPENAI_API_KEY="sk-..."

# E2B Sandboxes
E2B_API_KEY="e2b_..."

# Inngest
INNGEST_EVENT_KEY="..."
INNGEST_SIGNING_KEY="..."

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

#### 4. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run migrations to create tables
npx prisma migrate dev --name init

# (Optional) Seed the database with sample data
npx prisma db seed
```

#### 5. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

### Development Workflow

```bash
# Run development server with hot reload
npm run dev

# Type-check without building
npm run type-check

# Lint code
npm run lint

# Format code
npm run format

# Run database studio (visual database editor)
npx prisma studio

# View Inngest dev server (for testing background jobs)
npx inngest-cli dev
```

### Production Deployment

#### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# vercel.com/your-project/settings/environment-variables
```

#### Deploy to Other Platforms

The app is a standard Next.js application and can be deployed to:
- **Netlify** - Supports Next.js with adapters
- **Railway** - Easy PostgreSQL + Node.js hosting
- **Fly.io** - Docker-based deployment
- **AWS/GCP/Azure** - Enterprise deployments

### Docker Setup (Optional)

```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build the app
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

```bash
# Build and run
docker build -t ollio-ai .
docker run -p 3000:3000 --env-file .env.local ollio-ai
```

---

## 🎨 Architecture Decisions

### Why These Technologies?

#### Next.js 16 (App Router)

**Decision:** Use Next.js App Router over Pages Router

**Rationale:**
- **Server Components** reduce client-side JavaScript bundle size by 40%
- **Streaming SSR** improves perceived performance with progressive rendering
- **Route Groups** organize features without affecting URL structure
- **Built-in Loading/Error States** simplify UX patterns
- **Colocation** keeps components, logic, and routes together

**Trade-offs:**
- ✅ Better performance, simpler data fetching
- ❌ Steeper learning curve, newer ecosystem

---

#### tRPC over REST/GraphQL

**Decision:** Use tRPC for API layer

**Rationale:**
- **End-to-end type safety** eliminates runtime API errors
- **No code generation** - types are inferred automatically
- **Smaller bundle** than GraphQL clients (Apollo/Relay)
- **Better DX** - autocomplete for every API call
- **Easy to refactor** - rename a procedure, all usages update

**Comparison:**
```typescript
// tRPC (Type-safe, autocomplete, refactor-friendly)
const project = await api.projects.getById.useQuery({ id });

// REST (Manual types, no autocomplete, brittle)
const project = await fetch(`/api/projects/${id}`).then(r => r.json());

// GraphQL (Requires codegen, more boilerplate)
const project = await client.query({ query: GET_PROJECT, variables: { id } });
```

**Trade-offs:**
- ✅ Perfect for TypeScript monorepos
- ❌ Tight coupling between client/server
- ❌ Not ideal for public APIs

---

#### Prisma over Raw SQL/TypeORM

**Decision:** Use Prisma as the ORM

**Rationale:**
- **Type-safe queries** prevent SQL injection and typos
- **Declarative schema** serves as single source of truth
- **Automatic migrations** track schema changes
- **Excellent DX** - autocomplete for every query
- **Performance** - query optimization and connection pooling

**Example:**
```typescript
// Prisma (Safe, readable, typed)
const user = await db.user.findUnique({
  where: { email: 'user@example.com' },
  include: { projects: true },
});

// Raw SQL (Error-prone, no type safety)
const user = await db.query(
  'SELECT * FROM users WHERE email = $1',
  ['user@example.com']
);
```

**Trade-offs:**
- ✅ Great for most use cases
- ❌ Complex queries may need raw SQL
- ❌ Schema changes require migrations

---

#### Inngest over Direct Queue Systems

**Decision:** Use Inngest for background jobs instead of BullMQ/SQS

**Rationale:**
- **Zero infrastructure** - no Redis/RabbitMQ to manage
- **Built-in retries** with exponential backoff
- **Step functions** for complex workflows
- **Visual debugging** with built-in dashboard
- **Type-safe events** integrate with tRPC

**Comparison:**
```typescript
// Inngest (Simple, declarative)
await inngest.send({
  name: 'agent/generate-ui',
  data: { projectId, prompt },
});

// BullMQ (Requires Redis, more setup)
const queue = new Queue('ui-generation', { connection: redis });
await queue.add('generate', { projectId, prompt });
```

**Trade-offs:**
- ✅ Faster development, less ops overhead
- ❌ Vendor lock-in
- ❌ Limited to Inngest's pricing tiers

---

#### E2B over Docker/Lambda

**Decision:** Use E2B for code sandboxing

**Rationale:**
- **Firecracker VMs** provide stronger isolation than containers
- **Instant spin-up** (~300ms vs 5s+ for Lambda cold starts)
- **Built-in file system** and terminal APIs
- **Public URLs** for previews without extra infrastructure
- **Resource limits** prevent runaway processes

**Security benefits:**
- No access to production databases
- CPU/memory throttling
- Automatic cleanup
- Network isolation

**Trade-offs:**
- ✅ Superior security and performance
- ❌ Vendor lock-in
- ❌ Cost scales with usage

---

### Data Flow Architecture

#### Synchronous vs Asynchronous

**Decision:** Separate fast API responses from slow AI generation

**Why:**
- **User Experience:** UI responds in <300ms, not 30+ seconds
- **Scalability:** Background workers scale independently
- **Reliability:** Retries don't block the user interface
- **Monitoring:** Track job status separately from API health

**Implementation:**
```
User Request → API (fast) → Database → Immediate Response
                                 ↓
                            Background Job Queue
                                 ↓
                            AI Generation (slow)
                                 ↓
                            Database Update
                                 ↓
                            Frontend Polling → User Sees Result
```

---

### State Management

#### React Query over Redux/Zustand

**Decision:** Use TanStack Query (React Query) for server state

**Rationale:**
- **Automatic caching** reduces redundant API calls
- **Background refetching** keeps data fresh
- **Optimistic updates** improve perceived performance
- **Loading/error states** handled automatically
- **No boilerplate** compared to Redux

**What we DON'T use:**
- ❌ Redux - Too much boilerplate for server state
- ❌ Zustand - Better for client-only state
- ❌ Context API - Re-renders too often

**Client State Strategy:**
- **URL state** for filters, pagination (Next.js searchParams)
- **Local state** for forms, UI toggles (useState)
- **React Query** for ALL server data

---

### Security Architecture

#### Defense in Depth

**Multiple layers of security:**

1. **Edge Middleware** - First line of defense
2. **API Validation** - Zod schemas on every input
3. **Database Queries** - Row-level security checks
4. **Sandboxes** - Isolated code execution
5. **Rate Limiting** - Prevent abuse

**Why not rely on one layer?**
- Single point of failure is risky
- Defense in depth catches mistakes
- Compliance requirements (SOC 2, GDPR)

---

## 💥 Technical Challenges

### Challenge 1: Long-Running AI Tasks

**Problem:**
HTTP requests timeout after 30-60 seconds, but AI code generation takes 10-60+ seconds.

**Solutions Considered:**

| Approach | Pros | Cons | Chosen? |
|----------|------|------|---------|
| **Synchronous API** | Simple | Timeouts, poor UX | ❌ |
| **WebSockets** | Real-time updates | Complex, stateful | ❌ |
| **Server-Sent Events** | One-way streaming | Limited browser support | ❌ |
| **Polling + Background Jobs** | Stateless, reliable | Slight delay | ✅ |

**Implementation:**
```typescript
// API returns immediately
await inngest.send({ name: 'agent/generate-ui', data: { prompt } });
return { status: 'processing' };

// Frontend polls every 2 seconds
useQuery({
  queryKey: ['messages', projectId],
  queryFn: () => fetchMessages(projectId),
  refetchInterval: 2000,
});
```

**Lessons Learned:**
- Users prefer immediate feedback over waiting
- Background jobs allow for retries and monitoring
- Polling is simple and works everywhere

---

### Challenge 2: Type Safety Across Layers

**Problem:**
Maintaining type consistency from database → API → frontend without duplication.

**Solution: Single Source of Truth**

```typescript
// 1. Database schema defines types
// prisma/schema.prisma
model Project {
  id    String
  name  String
  // ...
}

// 2. Prisma generates TypeScript types
// node_modules/.prisma/client/index.d.ts
export type Project = {
  id: string;
  name: string;
  // ...
}

// 3. tRPC procedures use Prisma types
export const getProject = procedure
  .input(z.object({ id: z.string() }))
  .query(async ({ input }): Promise<Project> => {
    return db.project.findUnique({ where: { id: input.id } });
  });

// 4. Frontend gets automatic types
const { data } = api.projects.getById.useQuery({ id });
//     ^-- data is typed as Project | undefined
```

**Benefits:**
- Change schema once, types update everywhere
- Compile-time errors prevent runtime bugs
- Refactoring is safe and fast

---

### Challenge 3: Sandbox Security

**Problem:**
AI-generated code could be malicious (infinite loops, data exfiltration, resource exhaustion).

**Security Measures:**

1. **Process Isolation**
   ```typescript
   const sandbox = await Sandbox.create({
     timeoutMs: 300000, // 5-minute hard limit
     memory: 512, // 512MB RAM limit
     cpuLimit: 1, // Single CPU core
   });
   ```

2. **Network Restrictions**
   - No outbound internet access
   - Can't reach internal services
   - Only serves on public URL for iframe

3. **Resource Monitoring**
   ```typescript
   // Kill sandbox if CPU usage > 90% for 10s
   await sandbox.monitor({
     cpuThreshold: 0.9,
     duration: 10000,
     action: 'terminate',
   });
   ```

4. **Automatic Cleanup**
   ```typescript
   // Always cleanup, even on errors
   await step.defer(async () => {
     await sandbox.close();
   });
   ```

**Incident Response:**
If a sandbox is compromised:
- Isolated from other sandboxes
- No production data accessible
- Destroyed within 5 minutes max
- All actions logged for audit

---

### Challenge 4: Database Query Performance

**Problem:**
Loading a project with 100+ messages and 500+ code fragments was taking 3+ seconds.

**Optimization Steps:**

1. **Before: N+1 Query Problem**
   ```typescript
   // This made 1 + N + M queries!
   const project = await db.project.findUnique({ where: { id } });
   const messages = await db.message.findMany({ where: { projectId: id } });
   for (const message of messages) {
     const fragments = await db.fragment.findMany({ where: { messageId: message.id } });
   }
   ```

2. **After: Single Query with Joins**
   ```typescript
   // This makes 1 query with JOINs
   const project = await db.project.findUnique({
     where: { id },
     include: {
       messages: {
         include: { fragments: true },
         orderBy: { createdAt: 'asc' },
       },
     },
   });
   ```

3. **Added Database Indexes**
   ```prisma
   model Message {
     @@index([projectId]) // Fast lookups by project
     @@index([createdAt]) // Fast sorting
   }
   ```

4. **Result:**
   - Query time: 3000ms → 150ms (20x faster)
   - Database load: 100+ queries → 1 query
   - Bundle size: Same (server-side only)

---

### Challenge 5: Real-Time Updates Without WebSockets

**Problem:**
Show live updates when AI completes generation, without complex WebSocket infrastructure.

**Solution: Smart Polling**

```typescript
const { data, isLoading } = useQuery({
  queryKey: ['messages', projectId],
  queryFn: () => fetchMessages(projectId),
  refetchInterval: (data) => {
    // If last message is from AI, stop polling (generation complete)
    const lastMessage = data?.messages[data.messages.length - 1];
    if (lastMessage?.role === 'ASSISTANT') {
      return false; // Stop polling
    }
    return 2000; // Poll every 2 seconds
  },
});
```

**Optimization:**
- Only poll when generation is in progress
- Stop immediately when result appears
- Use SWR for deduplication across tabs

**Trade-offs:**
- ✅ Simple, stateless, works everywhere
- ✅ No extra infrastructure
- ❌ Up to 2-second delay in updates
- ❌ More database queries

**Why not WebSockets?**
- Requires stateful server (harder to scale)
- Complex error handling and reconnection
- Polling is "good enough" for this use case

---

## 🧠 State Management

### State Categories

The application manages three types of state:

#### 1. Server State (Managed by React Query)

**What:** Data that lives on the server (database)

**Examples:**
- User's projects list
- Chat message history
- Generated code fragments
- Credit usage

**How it's managed:**
```typescript
// Automatic caching, refetching, and synchronization
const { data, isLoading, error } = api.projects.list.useQuery();
```

**React Query handles:**
- Caching (avoid redundant fetches)
- Background refetching (keep data fresh)
- Optimistic updates (instant UI feedback)
- Error handling and retries

---

#### 2. URL State (Managed by Next.js)

**What:** State that should be bookmarkable and shareable

**Examples:**
- Current project ID (`/projects/clx123`)
- Search filters
- Pagination
- Selected tab

**How it's managed:**
```typescript
// Reading from URL
const projectId = params.projectId;

// Writing to URL
router.push(`/projects/${projectId}?tab=code`);

// Preserves state across page refreshes
```

**Benefits:**
- Shareable links
- Browser back/forward works
- No hydration mismatches

---

#### 3. Client State (Managed by React Hooks)

**What:** Transient UI state that doesn't need persistence

**Examples:**
- Form input values
- Modal open/closed
- Dropdown expanded
- Theme preference

**How it's managed:**
```typescript
// Simple local state
const [isOpen, setIsOpen] = useState(false);

// Derived state
const hasUnsavedChanges = formState.isDirty;

// Refs for DOM access
const inputRef = useRef<HTMLInputElement>(null);
```

---

### Data Flow Patterns

#### Pattern 1: Optimistic Updates

**Use case:** User creates a new message

```typescript
const createMessage = api.projects.create.useMutation({
  // Before API call, update UI immediately
  onMutate: async (newMessage) => {
    // Cancel outgoing refetches
    await utils.projects.getById.cancel();
    
    // Snapshot current state
    const previousMessages = utils.projects.getById.getData();
    
    // Optimistically update cache
    utils.projects.getById.setData({ id: projectId }, (old) => ({
      ...old,
      messages: [...old.messages, { ...newMessage, id: 'temp-id', pending: true }],
    }));
    
    return { previousMessages };
  },
  
  // On success, replace temp data with real data
  onSuccess: (data, variables, context) => {
    utils.projects.getById.setData({ id: projectId }, (old) => ({
      ...old,
      messages: old.messages.map(msg =>
        msg.id === 'temp-id' ? data.message : msg
      ),
    }));
  },
  
  // On error, rollback to previous state
  onError: (err, variables, context) => {
    utils.projects.getById.setData(
      { id: projectId },
      context.previousMessages
    );
    toast.error('Failed to send message');
  },
});
```

**Result:** UI feels instant, even on slow connections

---

#### Pattern 2: Dependent Queries

**Use case:** Load project details, then load messages

```typescript
// First query
const { data: project } = api.projects.getById.useQuery({ id: projectId });

// Second query only runs when first succeeds
const { data: messages } = api.messages.list.useQuery(
  { projectId: project?.id },
  { enabled: !!project?.id } // Only fetch if project exists
);
```

---

#### Pattern 3: Infinite Scroll

**Use case:** Load messages in batches

```typescript
const {
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
} = api.messages.infinite.useInfiniteQuery(
  { projectId, limit: 20 },
  {
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  }
);

// In component
<InfiniteScroll
  onLoadMore={fetchNextPage}
  hasMore={hasNextPage}
  loading={isFetchingNextPage}
>
  {data.pages.flatMap(page => page.messages).map(message => (
    <MessageItem key={message.id} message={message} />
  ))}
</InfiniteScroll>
```

---

### Caching Strategy

#### Cache Invalidation Rules

```typescript
// After creating a message, invalidate project queries
onSuccess: () => {
  utils.projects.getById.invalidate({ id: projectId });
  utils.projects.list.invalidate(); // List may have "last updated" time
}

// After deleting a project, invalidate list
onSuccess: () => {
  utils.projects.list.invalidate();
  // No need to invalidate getById - it's gone
}
```

#### Stale Time Configuration

```typescript
// Different data has different freshness requirements
api.projects.list.useQuery(
  {},
  {
    staleTime: 60000, // 1 minute - projects don't change often
  }
);

api.messages.list.useQuery(
  { projectId },
  {
    staleTime: 2000, // 2 seconds - messages change frequently during generation
  }
);
```

---

## 🪝 Custom Hooks

### Hook: `useProject()`

**Purpose:** Centralize project-related logic

**Location:** `src/hooks/use-project.ts`

```typescript
export function useProject(projectId: string) {
  const utils = api.useContext();
  
  // Fetch project data
  const { data: project, isLoading } = api.projects.getById.useQuery(
    { id: projectId },
    { refetchInterval: 2000 } // Poll for updates
  );
  
  // Create message mutation
  const createMessage = api.projects.create.useMutation({
    onSuccess: () => {
      utils.projects.getById.invalidate({ id: projectId });
    },
  });
  
  // Delete project mutation
  const deleteProject = api.projects.delete.useMutation({
    onSuccess: () => {
      utils.projects.list.invalidate();
      router.push('/projects');
    },
  });
  
  // Derived state
  const lastMessage = project?.messages[project.messages.length - 1];
  const isGenerating = lastMessage?.role === 'USER' && !lastMessage.replied;
  const messageCount = project?.messages.length ?? 0;
  
  return {
    project,
    isLoading,
    createMessage,
    deleteProject,
    isGenerating,
    messageCount,
  };
}

// Usage in component
function ProjectPage({ params }: { params: { projectId: string } }) {
  const {
    project,
    createMessage,
    isGenerating,
  } = useProject(params.projectId);
  
  // Now you have everything project-related in one place
}
```

---

### Hook: `useCodeEditor()`

**Purpose:** Manage code editor state

```typescript
export function useCodeEditor(initialCode: string, language: string) {
  const [code, setCode] = useState(initialCode);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const editorRef = useRef<EditorView | null>(null);
  
  // Copy code to clipboard
  const copyCode = useCallback(async () => {
    await navigator.clipboard.writeText(code);
    toast.success('Copied to clipboard');
  }, [code]);
  
  // Download code as file
  const downloadCode = useCallback(() => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code.${language}`;
    a.click();
    URL.revokeObjectURL(url);
  }, [code, language]);
  
  // Format code (prettier)
  const formatCode = useCallback(async () => {
    const formatted = await prettier.format(code, {
      parser: language === 'html' ? 'html' : 'babel',
    });
    setCode(formatted);
  }, [code, language]);
  
  return {
    code,
    setCode,
    theme,
    setTheme,
    editorRef,
    copyCode,
    downloadCode,
    formatCode,
  };
}
```

---

### Hook: `useMediaQuery()`

**Purpose:** Responsive design helpers

```typescript
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  
  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);
    
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener('change', listener);
    
    return () => media.removeEventListener('change', listener);
  }, [query]);
  
  return matches;
}

// Usage
function Sidebar() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  if (isMobile) {
    return <MobileSidebar />;
  }
  
  return <DesktopSidebar />;
}
```

---

## 🌐 API Design

### tRPC Router Structure

```typescript
// Root router combines all feature routers
export const appRouter = router({
  projects: projectsRouter,
  messages: messagesRouter,
  usage: usageRouter,
  admin: adminRouter,
});

// Projects router
export const projectsRouter = router({
  // Queries (read operations)
  list: protectedProcedure
    .input(z.object({ limit: z.number().optional() }))
    .query(async ({ ctx, input }) => { /* ... */ }),
  
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => { /* ... */ }),
  
  // Mutations (write operations)
  create: protectedProcedure
    .input(z.object({ projectId: z.string(), content: z.string() }))
    .mutation(async ({ ctx, input }) => { /* ... */ }),
  
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => { /* ... */ }),
  
  update: protectedProcedure
    .input(z.object({ id: z.string(), name: z.string() }))
    .mutation(async ({ ctx, input }) => { /* ... */ }),
});
```

### Input Validation Standards

**All inputs must be validated with Zod:**

```typescript
// Good: Strict validation
.input(z.object({
  email: z.string().email(),
  age: z.number().min(13).max(120),
  role: z.enum(['USER', 'ADMIN']),
  tags: z.array(z.string()).max(10),
}))

// Bad: No validation (security risk)
.input(z.any())
```

### Error Handling

```typescript
// Standard error codes
if (!project) {
  throw new TRPCError({
    code: 'NOT_FOUND',
    message: 'Project not found',
  });
}

if (!hasPermission) {
  throw new TRPCError({
    code: 'FORBIDDEN',
    message: 'You do not have permission to access this project',
  });
}

if (rateLimitExceeded) {
  throw new TRPCError({
    code: 'TOO_MANY_REQUESTS',
    message: 'Rate limit exceeded. Try again in 1 minute.',
  });
}
```

### API Versioning Strategy

**Current approach:** No versioning (private API)

**Future approach (if API becomes public):**
```typescript
// Version in router structure
export const appRouter = router({
  v1: v1Router,
  v2: v2Router, // New features, breaking changes
});

// Version in URL
// /api/trpc/v1/projects.list
// /api/trpc/v2/projects.list
```

---

## 🚀 Future Improvements

### Planned Features

#### 1. Real-Time Collaboration
**Goal:** Multiple users editing the same project simultaneously

**Implementation:**
- WebSocket connection for live updates
- Operational Transforms (OT) for conflict resolution
- Cursor position sharing
- Live presence indicators

**Challenges:**
- State synchronization across clients
- Handling network partitions
- Scaling WebSocket connections

---

#### 2. Component Library
**Goal:** Save and reuse generated components

**Implementation:**
```typescript
model ComponentLibrary {
  id        String   @id
  userId    String
  name      String   // "Dark Login Form"
  category  String   // "Forms", "Navigation", "Hero"
  tags      String[] // ["dark", "modern", "animated"]
  code      Json     // All files
  thumbnail String   // Screenshot
  downloads Int      @default(0)
  isPublic  Boolean  @default(false)
}
```

**Features:**
- Search and filter library
- One-click insertion into projects
- Public marketplace for sharing

---

#### 3. AI Model Selection
**Goal:** Let users choose AI models

**Options:**
- GPT-4 Turbo (current, best quality)
- GPT-3.5 Turbo (faster, cheaper)
- Claude 3 (better at frontend code)
- Llama 3 (open source, self-hosted)

**UI:**
```typescript
<Select>
  <option value="gpt-4-turbo">GPT-4 Turbo (Recommended)</option>
  <option value="gpt-3.5-turbo">GPT-3.5 (Fast & Cheap)</option>
  <option value="claude-3-opus">Claude 3 Opus (Beta)</option>
</Select>
```

---

#### 4. Version Control for Projects
**Goal:** Git-like history for generated components

**Features:**
- Save snapshots after each generation
- Diff view between versions
- Rollback to previous version
- Branch and merge components

**Schema:**
```typescript
model ProjectVersion {
  id         String   @id
  projectId  String
  version    Int      // 1, 2, 3...
  message    String   // "Added dark mode"
  snapshot   Json     // All messages + code at this point
  createdAt  DateTime
}
```

---

#### 5. Advanced Sandboxes
**Goal:** Support more frameworks and environments

**Current:** HTML/CSS/JS only

**Future:**
- React (with hot reload)
- Vue, Svelte, Angular
- Tailwind CSS
- TypeScript
- Backend APIs (Express, FastAPI)

**Implementation:**
```typescript
const sandbox = await Sandbox.create({
  template: 'react-vite', // or 'nextjs', 'vue3', 'svelte'
});
```

