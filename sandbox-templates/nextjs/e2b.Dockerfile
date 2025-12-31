# You can use most Debian-based base images
FROM node:21-slim

# Install curl
RUN apt-get update && apt-get install -y curl && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY compile_page.sh /compile_page.sh
RUN chmod +x /compile_page.sh

# Install dependencies and customize sandbox
WORKDIR /home/user/nextjs-app

# ✅ এখানে --ts যোগ করা হয়েছে যাতে টাইপস্ক্রিপ্ট প্রোজেক্ট তৈরি হয়
RUN npx --yes create-next-app@latest . --yes --ts --eslint --tailwind

# ✅ Shadcn init
RUN npx --yes shadcn@latest init --yes -b neutral --force
RUN npx --yes shadcn@latest add --all --yes

# ✅ সব লাইব্রেরি একটি কমান্ডে ইনস্টল করা হচ্ছে (Layer Caching এবং স্পিড বাড়ানোর জন্য)
RUN npm install \
  chart.js react-chartjs-2 \
  zustand \
  framer-motion \
  date-fns clsx tailwind-merge \
  react-hook-form zod @hookform/resolvers \
  @tanstack/react-query

# Move the Nextjs app to the home directory
# ✅ cp -r ব্যবহার করা হয়েছে কারণ এটি hidden files এবং sub-directories সব কপি করে
RUN cp -r /home/user/nextjs-app/. /home/user/ && rm -rf /home/user/nextjs-app