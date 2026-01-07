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


Request is routed to: `projectsRouter.create`

**Location:** `src/modules/projects/server/procedures.ts`


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


**User sees:**
- Their message appears in chat (no longer pending)
- Loading indicator appears below
- "AI is thinking..." animation

**Total time so far: ~300ms** (User experience is instant!)

---

#### **Phase 6: Background Job Execution (Async, 10-60 seconds)**

Now the heavy lifting begins, but the user's browser is free to do other things.

**Location:** Inngest Platform → `src/inngest/functions.ts`


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
└─────---------------------------------------------------------

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
