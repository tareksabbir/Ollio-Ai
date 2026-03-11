# You can use most Debian-based base images
FROM node:21-slim

# Install curl and other system utilities
RUN apt-get update && apt-get install -y \
    curl \
    git \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY compile_page.sh /compile_page.sh
RUN chmod +x /compile_page.sh

WORKDIR /home/user/nextjs-app

RUN npx --yes create-next-app@latest . --yes --ts --eslint --tailwind

# Shadcn init
RUN npx --yes shadcn@latest init --defaults --force --yes
RUN npx --yes shadcn@latest add --all --yes

# ─── Charts ─────────────────────────────────────────────────────────────────
RUN npm install recharts chart.js react-chartjs-2

# ─── Date & Time ────────────────────────────────────────────────────────────
RUN npm install date-fns dayjs react-datepicker @types/react-datepicker react-day-picker

# ─── State Management ───────────────────────────────────────────────────────
RUN npm install zustand jotai immer

# ─── Animation ──────────────────────────────────────────────────────────────
RUN npm install framer-motion

# ─── Forms & Validation ─────────────────────────────────────────────────────
RUN npm install react-hook-form zod @hookform/resolvers

# ─── Tables ─────────────────────────────────────────────────────────────────
RUN npm install @tanstack/react-table

# ─── Data Fetching ──────────────────────────────────────────────────────────
RUN npm install @tanstack/react-query axios swr

# ─── Drag & Drop ────────────────────────────────────────────────────────────
RUN npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities

# ─── File Upload ────────────────────────────────────────────────────────────
RUN npm install react-dropzone

# ─── Rich Text / Markdown ───────────────────────────────────────────────────
RUN npm install react-markdown remark-gfm

# ─── Code Highlighting ──────────────────────────────────────────────────────
RUN npm install react-syntax-highlighter @types/react-syntax-highlighter

# ─── Icons ──────────────────────────────────────────────────────────────────
RUN npm install lucide-react react-icons

# ─── PDF & Export ───────────────────────────────────────────────────────────
RUN npm install jspdf html2canvas xlsx papaparse @types/papaparse

# ─── UI Extras ──────────────────────────────────────────────────────────────
RUN npm install react-hot-toast sonner react-colorful vaul cmdk embla-carousel-react react-resizable-panels input-otp

# ─── Utilities ──────────────────────────────────────────────────────────────
RUN npm install lodash @types/lodash nanoid uuid @types/uuid clsx tailwind-merge class-variance-authority use-debounce react-use qrcode.react

# Move to home directory
RUN cp -r /home/user/nextjs-app/. /home/user/ && rm -rf /home/user/nextjs-app