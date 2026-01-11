


# You can use most Debian-based base images
FROM node:21-slim

# Install curl
RUN apt-get update && apt-get install -y curl && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY compile_page.sh /compile_page.sh
RUN chmod +x /compile_page.sh

# Install dependencies and customize sandbox
WORKDIR /home/user/nextjs-app

# এখানে --ts যোগ করা হয়েছে যাতে টাইপস্ক্রিপ্ট প্রোজেক্ট তৈরি হয়
RUN npx --yes create-next-app@latest . --yes --ts --eslint --tailwind

# Shadcn init
RUN npx --yes shadcn@latest init --yes -b neutral --force
RUN npx --yes shadcn@latest add --all --yes

# Chart libraries
RUN npm install chart.js react-chartjs-2 recharts

# State management
RUN npm install zustand

# Animation
RUN npm install framer-motion

# Utility libraries
RUN npm install date-fns clsx tailwind-merge class-variance-authority

# Form handling & validation
RUN npm install react-hook-form zod @hookform/resolvers

# Data fetching
RUN npm install @tanstack/react-query axios

# Drag and drop
RUN npm install react-dnd react-dnd-html5-backend


# File upload
RUN npm install react-dropzone

# Utilities
RUN npm install lodash @types/lodash nanoid


# Move the Nextjs app to the home directory
# cp -r ব্যবহার করা হয়েছে কারণ এটি hidden files এবং sub-directories সব কপি করে
RUN cp -r /home/user/nextjs-app/. /home/user/ && rm -rf /home/user/nextjs-app