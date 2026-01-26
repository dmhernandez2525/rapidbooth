FROM node:20-alpine

WORKDIR /app

# Install dependencies for monorepo
COPY package*.json ./
COPY apps/web/package*.json ./apps/web/
COPY apps/api/package*.json ./apps/api/ 2>/dev/null || true
COPY packages/ ./packages/ 2>/dev/null || true

RUN npm install

# Copy source code
COPY . .

# Expose Next.js port
EXPOSE 3000

# Start development server
CMD ["npm", "run", "dev"]
