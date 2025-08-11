FROM node:18-alpine

# Install system dependencies for metrics collection
RUN apk add --no-cache \
    docker-cli \
    procps \
    util-linux \
    coreutils

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application files
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S metrics -u 1001 -G nodejs

# Change ownership
RUN chown -R metrics:nodejs /app
USER metrics

# Expose port
EXPOSE 3008

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "const http = require('http'); http.get('http://localhost:3008/api/health', (res) => process.exit(res.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1));"

CMD ["npm", "start"]