# Multi-stage Dockerfile for Formular Universal AI-Powered Form Intelligence Platform

# Stage 1: Base Node.js image
FROM node:18-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat

# Stage 2: Dependencies installer
FROM base AS deps
COPY package*.json ./
COPY frontend/package*.json ./frontend/
COPY backend/package*.json ./backend/
RUN npm ci
RUN cd frontend && npm ci --legacy-peer-deps
RUN cd backend && npm ci

# Stage 3: Frontend builder
FROM base AS frontend-builder
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/frontend/node_modules ./frontend/node_modules
COPY frontend ./frontend
COPY package*.json ./

# Build frontend
WORKDIR /app/frontend
RUN npm run build

# Stage 4: Backend builder  
FROM base AS backend-builder
COPY --from=deps /app/backend/node_modules ./backend/node_modules
COPY backend ./backend
COPY package*.json ./

# Generate Prisma client
WORKDIR /app/backend
RUN npx prisma generate

# Stage 5: Production runner
FROM node:18-alpine AS runner
WORKDIR /app

# Install production dependencies
RUN apk add --no-cache postgresql-client

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built applications
COPY --from=frontend-builder --chown=nextjs:nodejs /app/frontend/.next ./frontend/.next
COPY --from=frontend-builder --chown=nextjs:nodejs /app/frontend/public ./frontend/public
COPY --from=frontend-builder /app/frontend/package*.json ./frontend/
COPY --from=backend-builder /app/backend ./backend
COPY --from=deps /app/frontend/node_modules ./frontend/node_modules
COPY --from=deps /app/backend/node_modules ./backend/node_modules

# Copy root package.json for scripts
COPY package*.json ./

# Set environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Expose ports
EXPOSE 3000 5001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5001/health || exit 1

# Switch to non-root user
USER nextjs

# Start application
CMD ["npm", "run", "start"] 