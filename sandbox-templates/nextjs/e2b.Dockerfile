# You can use most Debian-based base images
FROM node:21-slim

# Install curl
RUN apt-get update && apt-get install -y curl && apt-get clean && rm -rf /var/lib/apt/lists/*

# Copy and make the compile script executable
COPY compile_page.sh /compile_page.sh
RUN chmod +x /compile_page.sh

# Install dependencies and customize sandbox
WORKDIR /home/user/nextjs-app

RUN npx --yes create-next-app@16.1.1 . --yes --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

RUN npx --yes shadcn@3.6.2 init --yes -b neutral --force
RUN npx --yes shadcn@3.6.2 add --all --yes

# Move the Next.js app to the home directory and remove the nextjs-app directory
RUN mv /home/user/nextjs-app/* /home/user/ && \
    mv /home/user/nextjs-app/.* /home/user/ 2>/dev/null || true && \
    rm -rf /home/user/nextjs-app

WORKDIR /home/user