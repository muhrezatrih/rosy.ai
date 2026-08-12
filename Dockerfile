# Base image
FROM node:22-alpine AS base

WORKDIR /app

# Dependencies stage
FROM base AS dependencies
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Production runner stage
FROM base AS runner
ENV NODE_ENV=production
ENV PORT=5001

# Copy production dependencies and application files
COPY --from=dependencies /app/node_modules ./node_modules
COPY package.json ./
COPY index.js ./
COPY src/ ./src/

# Non-root user for security hardening
USER node

EXPOSE 5001

CMD ["node", "index.js"]
