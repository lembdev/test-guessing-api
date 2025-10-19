FROM alpine:3.22.2 AS base
WORKDIR /app
RUN apk add --no-cache nodejs npm

# ----------------------------
FROM base AS builder
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ----------------------------
FROM base AS production
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev --omit=optional --ignore-scripts

# ----------------------------
FROM alpine:3.22.2 AS runner
WORKDIR /app

# Install runtime dependencies
RUN apk add --no-cache nodejs

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy dependencies and built application
COPY --from=production /app/node_modules      ./node_modules
COPY --from=production /app/package.json      ./package.json
COPY --from=production /app/package-lock.json ./package-lock.json
COPY --from=builder    /app/dist              ./dist

# Set ownership
RUN chown -R nodejs:nodejs /app

USER nodejs

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "dist/main.js"]